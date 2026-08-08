/**
 * FLOW — the river renderer (vanilla canvas 2D).
 *
 * The signature moment of the entry: words drift across a canvas along
 * sine waves, in three planes of depth. This module is the pure simulation
 * and draw — no React, no DOM events — so it can be reasoned about and
 * tested as a function of (state, dt). The React wrapper (WordRiver.tsx)
 * owns the rAF loop, resize, pointer, and visibility; this owns what one
 * frame looks like.
 *
 * The model is deliberately honest about what it is. There is no mesh, no
 * scene graph, no physics engine. Each word is a position, a phase along a
 * sine, and a depth band. Depth sets three things at once — size, speed,
 * and opacity — so the eye reads three planes without having to be told.
 * The far band drifts slowly in faint small type; the near band sweeps
 * fast in large crisp type. Between them the mid band carries the weight
 * of the river. This is the same three-depth composition the dream entry
 * uses for its clouds, restated for type.
 *
 * Pointer interaction is a soft push, not a grab. Words near the cursor are
 * nudged gently downstream of it, as if the cursor were a stone parting the
 * current. The push is radial, falls off with distance, and lerps back to
 * zero when the pointer leaves — water has memory but not grudges.
 *
 * NaN discipline (the pulse lesson): every value that can come from a
 * division, a measurement, or a pointer event is guarded with
 * Number.isFinite before it is written into word state. A bad rect, a
 * zero-size canvas, or a pointer at Infinity can never put a word at NaN
 * and leave the canvas blank.
 */

import { mulberry32, RIVER_WORDS, type Depth, type RiverWord } from "./words";

/* ==========================================================================
   Types
   ========================================================================== */

/** One word, mid-flight, in the river. */
export type FlowGlyph = {
  /** The source word this glyph renders. */
  word: RiverWord;
  /** Depth band — drives size, speed, opacity, the vertical lane. */
  depth: Depth;
  /** x in CSS pixels, from the left edge. Wraps when it leaves the right. */
  x: number;
  /** Baseline y in CSS pixels. Animated by the sine wave around `baseY`. */
  baseY: number;
  /** Phase of the sine wave, radians. Advances with time. */
  phase: number;
  /** Wavelength of the sine (px per radian of 2π). Different per band. */
  wavelength: number;
  /** Vertical amplitude of the sine drift (px). */
  amplitude: number;
  /** Horizontal speed (px per second). Negative = flows left (downstream). */
  speed: number;
  /** A small per-glyph phase offset so neighbours aren't in lockstep. */
  jitter: number;
  /** Pointer push — current horizontal offset from the sine baseline (px). */
  pushX: number;
  /** Pointer push — current vertical offset (px). */
  pushY: number;
};

/** The river's per-frame state, owned by the rAF loop. */
export type RiverState = {
  /** Wall-clock seconds since start (advances the sine phases). */
  t: number;
  /** Smoothed pointer position in CSS pixels, or null when none. */
  px: number | null;
  py: number | null;
  /** Pointer influence radius (px). */
  pushRadius: number;
  /** Pointer push strength (px offset at radius 0). */
  pushStrength: number;
};

/** Palette tokens passed in from styles.css by the React wrapper. */
export type RiverPalette = {
  /** Sky background, painted each frame to clear. */
  sky: string;
  /** Far-band ink — faint, cool. */
  far: string;
  /** Mid-band ink — the readable teal. */
  mid: string;
  /** Near-band ink — crisp, deep. */
  near: string;
  /** Latin typeface stack. */
  fontLatin: string;
  /** Korean typeface stack. */
  fontKorean: string;
};

/** Options handed to drawRiver for one frame. */
export type RiverOpts = {
  glyphs: FlowGlyph[];
  state: RiverState;
  palette: RiverPalette;
  /** CSS pixel width of the canvas. */
  w: number;
  /** CSS pixel height of the canvas. */
  h: number;
  /** Whether this is a reduced-motion still (no pointer, frozen sine). */
  still: boolean;
};

/* ==========================================================================
   Depth-band tuning
   --------------------------------------------------------------------------
   Each band has a target font size, opacity, speed, amplitude, wavelength,
   and the vertical lane fraction it lives in. The three bands tile the
   canvas height so they overlap softly at the edges, never stacking in a
   single line. Speeds are mutually prime-ish so the bands never sync.
   ========================================================================== */

type BandTuning = {
  /** Base font size at a 640px-tall canvas, in px. */
  size: number;
  /** Base opacity (the band's own ink). */
  alpha: number;
  /** Horizontal speed (px/s); negative flows left. */
  speed: number;
  /** Vertical sine amplitude in px. */
  amplitude: number;
  /** Sine wavelength in px. */
  wavelength: number;
  /** Where in the canvas height this band's lane is centered, 0..1. */
  lane: number;
  /** How much of the canvas height the lane spans, 0..1. */
  laneSpan: number;
};

const BANDS: BandTuning[] = [
  // depth 0 — far: small, faint, slow, high in the frame
  { size: 14, alpha: 0.22, speed: -14, amplitude: 10, wavelength: 520, lane: 0.18, laneSpan: 0.34 },
  // depth 1 — mid: readable drift, carries the river
  { size: 26, alpha: 0.46, speed: -28, amplitude: 18, wavelength: 680, lane: 0.44, laneSpan: 0.42 },
  // depth 2 — near: large, crisp, fast, low in the frame
  { size: 44, alpha: 0.82, speed: -46, amplitude: 26, wavelength: 880, lane: 0.74, laneSpan: 0.46 },
];

/** Target glyph counts per band, scaled by canvas width at seed time. */
const BAND_COUNTS = [9, 12, 8];

/** Multiplier that makes the font scale with the canvas height. */
function sizeForCanvas(band: BandTuning, h: number): number {
  // reference height 560 — at 560, the band sizes are as authored.
  const k = Math.max(0.6, Math.min(1.5, h / 560));
  return band.size * k;
}

/* ==========================================================================
   Seeding — deterministic across server and client
   ========================================================================== */

/**
 * Seed the glyph field. The river is the same every load (mulberry32 seeded
 * from a constant) so the no-JS still and the rAF view agree on every word's
 * starting position. Band counts scale with canvas width so a wide screen
 * gets a fuller river and a narrow one doesn't crowd.
 */
export function seedGlyphs(w: number, h: number): FlowGlyph[] {
  const rnd = mulberry32(20260806);
  const out: FlowGlyph[] = [];

  // Scale band counts with width — a 1920px screen earns ~1.5×, a 360px
  // screen ~0.6×. Clamped so a phone still reads as a river, not a drip.
  const widthK = Math.max(0.55, Math.min(1.6, w / 1200));

  for (let d = 0; d < BANDS.length; d++) {
    const band = BANDS[d];
    const count = Math.max(3, Math.round(BAND_COUNTS[d] * widthK));
    // Build a lane window: lane center ± laneSpan/2, clamped into [0,1].
    const laneTop = Math.max(0.04, band.lane - band.laneSpan / 2);
    const laneBot = Math.min(0.96, band.lane + band.laneSpan / 2);

    for (let i = 0; i < count; i++) {
      // Pick a word that prefers this band where possible; fall back to any.
      const preferred = RIVER_WORDS.filter((wd) => wd.depth === (d as Depth));
      const pool = preferred.length > 0 ? preferred : RIVER_WORDS;
      const word = pool[Math.floor(rnd() * pool.length)];

      // Spread initial x across a bit more than the canvas so the wrap
      // doesn't dump them all in at once.
      const x0 = rnd() * (w * 1.3) - w * 0.15;
      // Lane position, biased toward the lane center.
      const laneU = 0.5 + (rnd() - 0.5) * 0.9;
      const baseY = (laneTop + (laneBot - laneTop) * laneU) * h;

      out.push({
        word,
        depth: d as Depth,
        x: x0,
        baseY,
        phase: rnd() * Math.PI * 2,
        wavelength: band.wavelength * (0.85 + rnd() * 0.3),
        amplitude: band.amplitude * (0.8 + rnd() * 0.4),
        speed: band.speed * (0.9 + rnd() * 0.2),
        jitter: rnd() * Math.PI * 2,
        pushX: 0,
        pushY: 0,
      });
    }
  }

  // Draw far-to-near: depth 0 (far) first, depth 2 (near) last.
  out.sort((a, b) => a.depth - b.depth);
  return out;
}

/* ==========================================================================
   Step — advance the river one frame
   ========================================================================== */

/**
 * Advance glyph positions by dt seconds. Phases advance, x wraps, and the
 * pointer push lerps back toward the sine baseline. The pointer's push is
 * computed here too: each glyph within `pushRadius` of the pointer is nudged
 * radially, as if the cursor were a stone parting the current.
 *
 * Under reduced motion the glyph positions are not advanced — the river is
 * frozen at its seed composition, the still.
 */
export function stepRiver(
  glyphs: FlowGlyph[],
  state: RiverState,
  dtMs: number,
  w: number,
  h: number,
  reduced: boolean,
): void {
  if (reduced) {
    // Still: no horizontal drift, no sine advance, no push. Reset any push.
    for (let i = 0; i < glyphs.length; i++) {
      glyphs[i].pushX = 0;
      glyphs[i].pushY = 0;
    }
    return;
  }

  // Clamp dt: a tab that refocuses after a minute should not catapult every
  // word off-screen. 48ms ≈ 20fps minimum.
  const dt = Math.min(48, Math.max(0, dtMs)) / 1000;
  state.t += dt;

  const px = state.px;
  const py = state.py;
  const radius = state.pushRadius;
  const strength = state.pushStrength;
  const r2 = radius * radius;

  for (let i = 0; i < glyphs.length; i++) {
    const g = glyphs[i];

    // Advance the sine phase — drives the vertical bob.
    g.phase += dt * (Math.PI * 2) * (Math.abs(g.speed) / g.wavelength);

    // Horizontal drift.
    g.x += g.speed * dt;

    // Wrap horizontally: when a glyph exits the left (negative speed flows
    // left), wrap to the right with a small margin so it doesn't pop in at
    // the exact edge.
    const band = BANDS[g.depth];
    const size = sizeForCanvas(band, h);
    const margin = size * 3;
    if (g.speed < 0 && g.x < -margin) {
      g.x = w + margin * Math.random();
      // New lane position on re-entry, so the river doesn't cycle on a line.
      const laneTop = Math.max(0.04, band.lane - band.laneSpan / 2);
      const laneBot = Math.min(0.96, band.lane + band.laneSpan / 2);
      const laneU = 0.5 + (Math.random() - 0.5) * 0.9;
      g.baseY = (laneTop + (laneBot - laneTop) * laneU) * h;
      g.phase = Math.random() * Math.PI * 2;
    } else if (g.speed > 0 && g.x > w + margin) {
      g.x = -margin * Math.random();
    }

    // Pointer push — radial nudge within the radius. Computed against the
    // glyph's *current* rendered position (base + sine + existing push) so
    // the push feels like it acts on the word the visitor sees.
    const sineY = Math.sin(g.phase + g.jitter) * g.amplitude;
    const curX = g.x + g.pushX;
    const curY = g.baseY + sineY + g.pushY;

    let targetPushX = 0;
    let targetPushY = 0;
    if (px !== null && py !== null && Number.isFinite(px) && Number.isFinite(py)) {
      const dx = curX - px;
      const dy = curY - py;
      const d2 = dx * dx + dy * dy;
      if (d2 < r2 && d2 > 0.01) {
        const dist = Math.sqrt(d2);
        // Falloff: 1 at radius edge, 1 at the cursor (cubic for a soft bowl).
        const u = 1 - dist / radius;
        const force = strength * u * u * (3 - 2 * u); // smoothstep
        // Push away from the cursor along the radial direction.
        targetPushX = (dx / dist) * force;
        targetPushY = (dy / dist) * force;
      }
    }

    // Lerp the push toward its target so the river doesn't snap when the
    // cursor enters/leaves a word's neighbourhood.
    const k = 1 - Math.pow(0.0001, dt); // frame-rate independent approach
    g.pushX += (targetPushX - g.pushX) * k;
    g.pushY += (targetPushY - g.pushY) * k;
  }
}

/* ==========================================================================
   Draw — render the river into a 2D context
   ========================================================================== */

/**
 * Paint one frame of the river. The context is expected to be pre-scaled
 * for DPR by the caller (so we draw in CSS pixels); origin is top-left.
 *
 * The far band is painted first (faint, small), the mid next, the near last
 * — so the nearer words occlude the farther ones, the way the surface of a
 * river occludes its depths. Within a band the glyphs are drawn in their
 * seed order; depth is the only sort that matters.
 */
export function drawRiver(ctx: CanvasRenderingContext2D, o: RiverOpts): void {
  const { glyphs, state, palette, w, h, still } = o;

  // Clear with the sky. Always a full opaque clear: words are crisp text,
  // not a particle trail, so we never want ghosts of the previous frame.
  ctx.save();
  ctx.globalCompositeOperation = "source-over";
  ctx.fillStyle = palette.sky;
  // Guard: a zero-or-NaN w/h must not blank the page (NaN fillRect is a no-op
  // on some engines and a full-canvas paint on others — clamp).
  ctx.fillRect(0, 0, Number.isFinite(w) ? w : 0, Number.isFinite(h) ? h : 0);
  ctx.restore();

  // Under reduced-motion still, hold the sine at a composed phase so the
  // river reads as "mid-drift" rather than flat.
  const stillPhase = still ? 0.4 : 0;

  for (let i = 0; i < glyphs.length; i++) {
    const g = glyphs[i];
    const band = BANDS[g.depth];
    const size = sizeForCanvas(band, h);

    // Vertical position: baseline + sine + pointer push.
    const phase = g.phase + g.jitter + stillPhase;
    const sineY = Math.sin(phase) * g.amplitude;
    const x = g.x + g.pushX;
    const y = g.baseY + sineY + g.pushY;

    // NaN guard: if anything went non-finite, skip the glyph rather than
    // paint garbage (canvas APIs tolerate NaN by drawing nothing, but a
    // visible-on-load gap is worse than a skipped word).
    if (!Number.isFinite(x) || !Number.isFinite(y) || !Number.isFinite(size)) {
      continue;
    }

    // Ink color per band.
    const ink = g.depth === 0 ? palette.far : g.depth === 1 ? palette.mid : palette.near;
    const alpha = band.alpha;

    ctx.save();
    ctx.font = `${g.word.weight} ${size}px ${g.word.lang === "ko" ? palette.fontKorean : palette.fontLatin}`;
    ctx.textBaseline = "alphabetic";
    ctx.textAlign = "left";

    // A soft shadow on the near band gives the words a faint contact with
    // the surface — the hint of a reflection. Far/mid stay flat.
    if (g.depth === 2) {
      ctx.shadowColor = withAlpha(ink, 0.16);
      ctx.shadowBlur = size * 0.18;
      ctx.shadowOffsetY = size * 0.06;
    }

    ctx.fillStyle = withAlpha(ink, alpha);
    ctx.fillText(g.word.text, x, y);
    ctx.restore();
  }
}

/* ==========================================================================
   Helpers
   ========================================================================== */

/**
 * Read the four palette tokens from CSS custom properties on a host element.
 * Falls back to sensible defaults if the host is missing or the properties
 * are unset, so a misconfigured page still renders a river.
 */
export function readPalette(host: Element | null): RiverPalette {
  const s = host ? getComputedStyle(host) : null;
  const get = (name: string, fallback: string): string => {
    if (!s) return fallback;
    const v = s.getPropertyValue(name).trim();
    return v || fallback;
  };
  return {
    sky: get("--flow-canvas-sky", "#f0f9ff"),
    far: get("--flow-canvas-far", "#7dd3fc"),
    mid: get("--flow-canvas-mid", "#0284c7"),
    near: get("--flow-canvas-near", "#0c4a6e"),
    fontLatin: get("--flow-font", '"Inter", sans-serif'),
    fontKorean: get("--flow-font-ko", '"Noto Sans KR", sans-serif'),
  };
}

/** Apply an alpha to a hex or rgb() color, returning an rgba() string. */
function withAlpha(color: string, alpha: number): string {
  const a = Math.max(0, Math.min(1, alpha));
  const hex = (color || "").trim();
  if (hex.startsWith("#")) {
    const full =
      hex.length === 4
        ? hex
            .slice(1)
            .split("")
            .map((c) => c + c)
            .join("")
        : hex.slice(1);
    const r = parseInt(full.slice(0, 2), 16);
    const g = parseInt(full.slice(2, 4), 16);
    const b = parseInt(full.slice(4, 6), 16);
    const ok = (n: number) => Number.isFinite(n) && n >= 0;
    if (ok(r) && ok(g) && ok(b)) {
      return `rgba(${r},${g},${b},${a})`;
    }
  }
  // Fall through: assume an rgb()/rgba() string and just rebuild.
  const m = /rgba?\(([^)]+)\)/.exec(hex);
  if (m) {
    const parts = m[1].split(",").map((p) => p.trim()).slice(0, 3);
    return `rgba(${parts.join(",")},${a})`;
  }
  // Last resort: return the color as-is (canvas will treat unknown fill as
  // black, which is at least visible, never a blank).
  return hex;
}
