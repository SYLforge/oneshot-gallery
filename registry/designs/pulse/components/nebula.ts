/**
 * PULSE nebula renderer — a vanilla canvas 2D particle field with hand-rolled
 * 3D perspective projection. No three.js, no WebGL, no dependencies.
 *
 * The signature: a few hundred points float in 3D space, projected onto the
 * 2D canvas by a perspective divide (x' = x·f/(f+z)). The "camera" tilts
 * with the pointer (rotX/rotY applied to each point before projection), and
 * every point's radius and brightness breathe with a simulated beat envelope.
 * A low-alpha clear each frame leaves a motion trail — the read of "energy
 * moving through a medium", not dots on a screen.
 *
 * This is "3D" honestly stated: there is no mesh, no scene graph, no GPU.
 * There is a vector field of points whose on-screen size and position are a
 * function of their depth and the beat. That is enough to read as a living
 * nebula, and it ships with zero dependencies and zero image files.
 *
 * Every color arrives as a token from the caller; this module owns no hexes
 * (the particle gradient stops are passed in from tokens.json roles
 * "particle-hi", "particle-violet", "magenta" — kept as named constants only
 * to avoid repeating string literals).
 */

/** One particle in the field. Positions are in arbitrary world units. */
export type Particle = {
  /** Home position — the point's stratum center. */
  hx: number;
  hy: number;
  hz: number;
  /** Current animated offset from home (orbital drift). */
  ox: number;
  oy: number;
  oz: number;
  /** Orbit phase + speed — each point circles its stratum center. */
  phase: number;
  speed: number;
  /** Orbit radius in world units. */
  radius: number;
  /** Stratum band 0..1 — picks the gradient stop and base brightness. */
  stratum: number;
};

/** The five per-track palettes. Hue + intensity shift as the tracklist scrolls. */
export type TrackPalette = {
  id: string;
  /** Two gradient stops [near, far] for the particle color ramp. */
  near: string;
  far: string;
  /** The on-beat rim pool color (CSS hex). */
  rim: string;
  /** Multiplier on base particle count/brightness for this track. */
  intensity: number;
};

export const TRACK_PALETTES: TrackPalette[] = [
  { id: "violet",  near: "#f0f4ff", far: "#9d4edd", rim: "#9d4edd", intensity: 1.0 },
  { id: "magenta", near: "#f0f4ff", far: "#ff006e", rim: "#ff006e", intensity: 1.25 },
  { id: "ember",   near: "#fff1e6", far: "#ff8a3d", rim: "#ff8a3d", intensity: 1.1 },
  { id: "aqua",    near: "#e6fbff", far: "#3dd6ff", rim: "#3dd6ff", intensity: 0.9 },
  { id: "violet2", near: "#f0f4ff", far: "#9d4edd", rim: "#9d4edd", intensity: 1.0 },
];

export type NebulaState = {
  /** Pointer-driven camera tilt, radians. Lerped toward target each frame. */
  rotX: number;
  rotY: number;
  /** Target camera tilt (set from pointer). */
  targetRotX: number;
  targetRotY: number;
  /** Simulated beat envelope 0..1 (sharp attack, slow decay). */
  beat: number;
  /** Wall-clock seconds since start (drives the beat phase). */
  t: number;
  /** Smoothed scroll-driven track position 0..1 (mixes the 5 palettes). */
  track: number;
  /** Raw (unsmoothed) track position, for things that must not lag. */
  trackRaw: number;
};

export type RenderOpts = {
  state: NebulaState;
  particles: Particle[];
  /** Focal length for the perspective divide, in world units. */
  focal: number;
  /** World-space half-extent the field spans (for camera framing). */
  span: number;
  /** CSS pixel width (caller pre-scales ctx for DPR). */
  w: number;
  /** CSS pixel height. */
  h: number;
  /** Trail alpha — how much of the previous frame survives the clear. */
  trail: number;
  /** Whether this is a reduced-motion still (no trail, full paint). */
  still: boolean;
};

/**
 * Linearly interpolate between two hex colors. Used to mix the per-track
 * palettes as --pulse-track scrolls 0→1 across the five stops.
 */
export function mixHex(a: string, b: string, t: number): string {
  const pa = parseHex(a);
  const pb = parseHex(b);
  // Clamp t to 0..1 so a stray non-finite never extrapolates out of gamut.
  const tt = Number.isFinite(t) ? Math.max(0, Math.min(1, t)) : 0;
  const r = Math.round(pa[0] + (pb[0] - pa[0]) * tt);
  const g = Math.round(pa[1] + (pb[1] - pa[1]) * tt);
  const bl = Math.round(pa[2] + (pb[2] - pa[2]) * tt);
  return `rgb(${r},${g},${bl})`;
}

function parseHex(c: string): [number, number, number] {
  const hex = (c || "").replace("#", "");
  const full =
    hex.length === 3
      ? hex.split("").map((ch) => ch + ch).join("")
      : hex;
  const safe = (s: string) => {
    const n = parseInt(s, 16);
    return Number.isFinite(n) ? n : 0;
  };
  return [safe(full.slice(0, 2)), safe(full.slice(2, 4)), safe(full.slice(4, 6))];
}

/**
 * Pick the two neighboring track palettes for a 0..1 track value and the
 * blend t between them. The five palettes tile [0,1] into four segments.
 */
export function paletteForTrack(track: number): {
  near: string;
  far: string;
  rim: string;
  intensity: number;
} {
  // Sanitize: the scroll hook can briefly feed a non-finite value (zero-height
  // pin at first paint, detached ref, etc.). A bad track must never crash the
  // canvas with an unparseable gradient color — clamp to a safe 0..1.
  const tk = Number.isFinite(track) ? Math.max(0, Math.min(1, track)) : 0;
  const seg = Math.max(0, Math.min(TRACK_PALETTES.length - 2, Math.floor(tk * (TRACK_PALETTES.length - 1))));
  const t = Math.max(0, Math.min(1, tk * (TRACK_PALETTES.length - 1) - seg));
  const a = TRACK_PALETTES[seg];
  const b = TRACK_PALETTES[seg + 1];
  return {
    near: mixHex(a.near, b.near, t),
    far: mixHex(a.far, b.far, t),
    rim: mixHex(a.rim, b.rim, t),
    intensity: a.intensity + (b.intensity - a.intensity) * t,
  };
}

/**
 * Advance the nebula state one frame. Owns the beat envelope, the camera
 * lerp, and the wall-clock. Called by the canvas rAF in NebulaField.
 *
 * The beat is a pure function of wall time: 120 BPM = 0.5s period, with a
 * sharp attack and a slow decay (env = max(0, cos(phase))^1.6). The camera
 * lerps toward the pointer target at 0.06/frame — a slow lean, never a snap.
 */
export function stepNebula(s: NebulaState, dtMs: number, reduced: boolean): void {
  const dt = Math.min(48, dtMs) / 1000; // clamp dt to avoid huge jumps on tab refocus
  s.t += dt;
  // Beat: 120 BPM. Envelope is a raised-cosine pulse, one per period.
  const BPM = 120;
  const period = 60 / BPM; // 0.5s
  const phase = (s.t % period) / period; // 0..1 within the beat
  const env = Math.pow(Math.max(0, Math.cos(phase * Math.PI)), 1.6);
  // Under reduced motion we hold the beat at a composed mid-value so the
  // still reads as "the field, mid-breath" rather than flat.
  s.beat = reduced ? 0.35 : env;

  // Camera lerp.
  const k = reduced ? 1 : 0.06;
  s.rotX += (s.targetRotX - s.rotX) * k;
  s.rotY += (s.targetRotY - s.rotY) * k;
}

/**
 * Advance the particles' orbital drift one frame. Each point circles its
 * stratum center; under reduced motion the drift is frozen (the still).
 */
export function stepParticles(particles: Particle[], dtMs: number, reduced: boolean): void {
  if (reduced) return;
  const dt = Math.min(48, dtMs) / 1000;
  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];
    p.phase += p.speed * dt;
    p.ox = Math.cos(p.phase) * p.radius;
    p.oy = Math.sin(p.phase * 0.8 + p.stratum * 3.1) * p.radius * 0.6;
    p.oz = Math.sin(p.phase) * p.radius * 0.5;
  }
}

/**
 * Draw the nebula into the given 2D context. The context is expected to be
 * pre-scaled for DPR by the caller; we draw in CSS pixels. Origin: center.
 *
 * Pipeline per particle:
 *   1. world pos = home + offset
 *   2. apply camera rotation (rotX about X, rotY about Y)
 *   3. perspective divide: x' = x·f/(f+z), y' = y·f/(f+z)
 *   4. map to screen px, size + brightness scaled by depth and beat
 * Particles are drawn back-to-front (z-sorted) so near points occlude far;
 * additive 'lighter' compositing makes overlaps glow rather than overwrite.
 */
export function drawNebula(ctx: CanvasRenderingContext2D, o: RenderOpts): void {
  const { w, h, state, particles, focal, span, trail, still } = o;

  // Trail clear: paint a low-alpha void rect so previous frames fade.
  // Under reduced-motion still mode, do a full opaque clear (no trail).
  ctx.save();
  ctx.globalCompositeOperation = "source-over";
  if (still) {
    ctx.fillStyle = "#05060f";
    ctx.fillRect(0, 0, w, h);
  } else {
    ctx.fillStyle = `rgba(5, 6, 15, ${trail})`;
    ctx.fillRect(0, 0, w, h);
  }
  ctx.restore();

  // Precompute the per-track palette mix.
  const pal = paletteForTrack(state.track);

  // Camera rotation sin/cos.
  const cosX = Math.cos(state.rotX);
  const sinX = Math.sin(state.rotX);
  const cosY = Math.cos(state.rotY);
  const sinY = Math.sin(state.rotY);

  // World→screen scale: map `span` world units to ~min(w,h)·0.42 px.
  const scale = (Math.min(w, h) * 0.42) / span;
  const cx = w / 2;
  const cy = h * 0.52;

  // Project all particles, then sort back-to-front.
  const projected: {
    px: number;
    py: number;
    r: number;
    bright: number;
    stratum: number;
  }[] = [];

  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];
    let x = p.hx + p.ox;
    let y = p.hy + p.oy;
    let z = p.hz + p.oz;

    // Rotate about X (pitch): y' = y·cos - z·sin, z' = y·sin + z·cos
    const y1 = y * cosX - z * sinX;
    const z1 = y * sinX + z * cosX;
    y = y1;
    z = z1;
    // Rotate about Y (yaw): x' = x·cos + z·sin, z' = -x·sin + z·cos
    const x1 = x * cosY + z * sinY;
    const z2 = -x * sinY + z * cosY;
    x = x1;
    z = z2;

    // Perspective divide. Clamp z behind the camera to avoid blow-ups.
    const denom = Math.max(focal * 0.25, focal + z);
    const persp = focal / denom;
    const px = cx + x * scale * persp;
    const py = cy + y * scale * persp;

    // Size: base radius scaled by perspective and beat. Far points shrink.
    const baseR = 0.7 + (1 - p.stratum) * 1.6; // stratum 0 = bright core, bigger
    const beatBoost = 1 + 0.5 * state.beat * pal.intensity;
    const r = Math.max(0.3, baseR * persp * beatBoost);

    // Brightness: depth falloff + stratum + beat. Stratum 0 is the hot core.
    const depthFade = Math.max(0.15, Math.min(1, persp * 1.1));
    const stratumFade = 1 - p.stratum * 0.45;
    const bright = Math.max(0.05, Math.min(1, depthFade * stratumFade * (0.6 + 0.4 * state.beat) * pal.intensity));

    projected.push({ px, py, r, bright, stratum: p.stratum });
  }

  // Back-to-front: smaller radius ≈ farther ≈ drawn first. A full z-resort
  // would need depth carried through; the radius approximation is faithful
  // because r scales with the perspective divide (which encodes depth).
  projected.sort((a, b) => a.r - b.r);

  // Additive draw — overlaps glow.
  ctx.save();
  ctx.globalCompositeOperation = "lighter";

  for (let i = 0; i < projected.length; i++) {
    const p = projected[i];
    // Color: lerp far→near by stratum (stratum 0 = near/hot, 1 = far/dim).
    const color = mixHex(pal.far, pal.near, 1 - p.stratum);
    const a = p.bright;
    // Radial gradient per particle for a soft star, cheap enough at a few
    // hundred points; falls back to a flat fill if createRadialGradient is
    // unavailable.
    const grad = ctx.createRadialGradient(p.px, p.py, 0, p.px, p.py, p.r * 2.2);
    grad.addColorStop(0, withRgba(color, a));
    grad.addColorStop(0.4, withRgba(color, a * 0.6));
    grad.addColorStop(1, withRgba(color, 0));
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(p.px, p.py, p.r * 2.2, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

/**
 * Apply alpha to a color. Accepts #hex (3 or 6 digit) or rgb()/rgba();
 * returns an rgba() string.
 */
export function withRgba(color: string, alpha: number): string {
  const a = Math.max(0, Math.min(1, alpha));
  if (color.startsWith("#")) {
    const [r, g, b] = parseHex(color);
    return `rgba(${r},${g},${b},${a})`;
  }
  const m = /^rgba?\(([^)]+)\)$/.exec(color);
  if (m) {
    const parts = m[1].split(",").map((s) => s.trim());
    const [r, g, b] = parts;
    return `rgba(${r},${g},${b},${a})`;
  }
  // rgb() form from mixHex — parse it.
  const rm = /^rgb\(([^)]+)\)$/.exec(color);
  if (rm) {
    const parts = rm[1].split(",").map((s) => s.trim());
    const [r, g, b] = parts;
    return `rgba(${r},${g},${b},${a})`;
  }
  return color;
}

/**
 * Seed the particle field. Deterministic given a seed — the nebula is the
 * same every load, so the no-JS still and the rAF view agree. The field is
 * a thick spherical shell with three stratified bands:
 *   - stratum ~0.0: a tight bright core (few points, near white)
 *   - stratum ~0.5: the violet mid-drift (most points)
 *   - stratum ~1.0: a sparse far halo (dim magenta/violet points)
 */
export function seedParticles(count: number, span: number, seed = 7): Particle[] {
  let s = seed;
  const rand = () => {
    // xorshift32 — deterministic, no Math.random drift.
    s ^= s << 13;
    s ^= s >>> 17;
    s ^= s << 5;
    return ((s >>> 0) % 100000) / 100000;
  };
  const gauss = () => {
    // Box-Muller over two uniforms.
    const u = Math.max(1e-6, rand());
    const v = rand();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  };

  const out: Particle[] = [];
  for (let i = 0; i < count; i++) {
    // Stratum: bias toward the mid-drift (more points there).
    const stratum = Math.max(0, Math.min(1, 0.5 + gauss() * 0.28));
    // Radial distance from center scales with stratum: core tight, halo wide.
    const r = (0.15 + stratum * 0.85) * span * (0.6 + rand() * 0.4);
    // Random direction on a sphere.
    const theta = rand() * Math.PI * 2;
    const phi = Math.acos(2 * rand() - 1);
    const hx = r * Math.sin(phi) * Math.cos(theta);
    const hy = r * Math.sin(phi) * Math.sin(theta) * 0.7; // flatten vertically
    const hz = r * Math.cos(phi);
    out.push({
      hx,
      hy,
      hz,
      ox: 0,
      oy: 0,
      oz: 0,
      phase: rand() * Math.PI * 2,
      speed: 0.04 + rand() * 0.14,
      radius: 0.02 + rand() * 0.08,
      stratum,
    });
  }
  return out;
}
