/**
 * Procedural shan-shui landscape generation — pure, deterministic, no React.
 *
 * The benchmark to surpass is `{Shan, Shui}*` by LingDong, which synthesizes
 * mountains, trees, mist and waterfalls from noise and draws them as SVG.
 * This module answers it for a live canvas: mountains built from multi-octave
 * value noise and drawn as filled silhouette paths whose ink density *is*
 * their depth (远山如黛 — "distant mountains are like eyebrow pigment"),
 * mist as soft radial-gradient blobs pooled in valleys, and recursive
 * brushstroke trees. Everything is seeded so the scroll is the same painting
 * on every visit, yet it generates forever in both directions.
 *
 * Used by the hero canvas (LandscapeCanvas.tsx) and safe to call at module
 * load on both server and client — the permutation is identical across
 * hydration, which is what lets the no-JS / SSR state already be a painting.
 */

/* --------------------------------------------------------------------------
   Determinism
   -------------------------------------------------------------------------- */

/** mulberry32 — tiny seeded PRNG; the landscape is the same painting every visit. */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** 256-entry permutation for the lattice hash. Seeded 1368 — a Ming year. */
function buildPerm(seed: number): Uint8Array {
  const rand = mulberry32(seed);
  const p = new Uint8Array(256);
  for (let i = 0; i < 256; i++) p[i] = i;
  for (let i = 255; i > 0; i--) {
    const j = (rand() * (i + 1)) | 0;
    const t = p[i];
    p[i] = p[j];
    p[j] = t;
  }
  return p;
}

const PERM = buildPerm(1368);

/** Lattice hash → [0, 1). */
function latHash(ix: number, iy: number): number {
  return PERM[(ix + PERM[iy & 255]) & 255] / 255;
}

/** Smooth-stepped bilinear value noise over the integer lattice. */
export function valueNoise(x: number, y: number): number {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  let fx = x - ix;
  let fy = y - iy;
  fx = fx * fx * (3 - 2 * fx);
  fy = fy * fy * (3 - 2 * fy);
  const a = latHash(ix, iy);
  const b = latHash(ix + 1, iy);
  const c = latHash(ix, iy + 1);
  const d = latHash(ix + 1, iy + 1);
  return a + (b - a) * fx + (c - a) * fy + (a - b - c + d) * fx * fy;
}

/** Clamp. */
export function clamp(v: number, lo: number, hi: number): number {
  return v < lo ? lo : v > hi ? hi : v;
}

/** Smoothstep — Hermite interpolation. */
export function smoothstep(a: number, b: number, x: number): number {
  const s = clamp((x - a) / (b - a), 0, 1);
  return s * s * (3 - 2 * s);
}

/* --------------------------------------------------------------------------
   Mountain ridge generation
   -------------------------------------------------------------------------- */

/**
 * A ridge layer in the depth stack. Far layers are paler, smaller, and ride
 * higher (closer to the horizon); near layers are darker, taller, and ride
 * lower. The ink density IS the aerial perspective.
 */
export type RidgeLayer = {
  /** 0 = farthest, RIDGE_LAYERS-1 = nearest. */
  depth: number;
  /** Base horizon y as a fraction of stage height (top=0). Larger = lower. */
  baseY: number;
  /** Amplitude of the ridge as a fraction of stage height. */
  amp: number;
  /** Horizontal noise frequency (px⁻¹) — far ridges are broader. */
  freq: number;
  /** Per-layer phase offset so layers don't share peaks. */
  phase: number;
  /** Ink alpha — 远山如黛, distance is ink density. */
  ink: number;
  /** Ink color (rgb triple) for this layer — palest at the horizon. */
  rgb: [number, number, number];
};

/**
 * Five mountain layers, farthest first. Each nearer layer is darker, taller,
 * and sits lower on the paper — the canonical shan-shui depth structure.
 * Ink alphas and colors come from the design tokens (aerial-density motion).
 */
export const RIDGE_LAYERS: RidgeLayer[] = [
  // farthest — dissolving into mist
  {
    depth: 0,
    baseY: 0.34,
    amp: 0.05,
    freq: 1 / 520,
    phase: 11.2,
    ink: 0.14,
    rgb: [154, 148, 136], // pale-wash
  },
  {
    depth: 1,
    baseY: 0.44,
    amp: 0.08,
    freq: 1 / 360,
    phase: 37.7,
    ink: 0.26,
    rgb: [125, 117, 106], // ink-soft
  },
  // middle
  {
    depth: 2,
    baseY: 0.55,
    amp: 0.12,
    freq: 1 / 240,
    phase: 4.4,
    ink: 0.42,
    rgb: [90, 82, 73], // ink-mid
  },
  // nearer
  {
    depth: 3,
    baseY: 0.68,
    amp: 0.16,
    freq: 1 / 170,
    phase: 71.3,
    ink: 0.62,
    rgb: [58, 52, 44], // ink-strong
  },
  // nearest — the foreground ridge, full ink
  {
    depth: 4,
    baseY: 0.82,
    amp: 0.2,
    freq: 1 / 120,
    phase: 92.8,
    ink: 0.82,
    rgb: [26, 23, 20], // sumi
  },
];

/** Octave amplitudes/weights for the ridge profile (roughness pyramid). */
const OCTAVE_FREQS = [1, 2.05, 4.4, 9.1];
const OCTAVE_WEIGHTS = [1, 0.52, 0.27, 0.13];

/**
 * The mountain silhouette height at world-x, for one ridge layer.
 * Sum of weighted value-noise bands — the canonical fBm ridge. `scrollX`
 * shifts the world so the same function paints an infinite scroll, and the
 * profile is deterministic for any x.
 */
export function ridgeHeight(
  layer: RidgeLayer,
  x: number,
  scrollX: number,
  stageH: number,
): number {
  const wx = (x + scrollX) * layer.freq + layer.phase;
  let h = 0;
  let wSum = 0;
  for (let o = 0; o < OCTAVE_FREQS.length; o++) {
    const f = OCTAVE_FREQS[o];
    h += (valueNoise(wx * f, layer.phase * f) - 0.5) * OCTAVE_WEIGHTS[o];
    wSum += OCTAVE_WEIGHTS[o];
  }
  h /= wSum; // normalize to ~[-0.5, 0.5]
  // ridges: sharpen peaks by reflecting the noise around 0.5 — mountain
  // silhouettes have pointed peaks and rounded valleys, unlike raw fBm.
  const ridge = 0.5 - Math.abs(h);
  const base = layer.baseY * stageH;
  const amp = layer.amp * stageH;
  return base - ridge * amp * 2.2;
}

/* --------------------------------------------------------------------------
   Trees — recursive brushstroke clusters
   -------------------------------------------------------------------------- */

export type TreeBranch = {
  /** Stroke points as flat [x0,y0,x1,y1,...] in stage-local px. */
  pts: number[];
  /** Stroke width in px. */
  w: number;
};

/**
 * A small recursive brushstroke tree (pine-like, the foreground accent of
 * literati painting). Grown deterministically from a seed; the turtle carries
 * a wander + slight upward phototropism so nothing alive is straight. Drawn
 * as a branching stroke cluster, not a literal pine silhouette — the brush
 * suggests the tree rather than describing it.
 */
export function growTree(
  seed: number,
  ox: number,
  oy: number,
  scale: number,
): TreeBranch[] {
  const rnd = mulberry32(seed);
  const branches: TreeBranch[] = [];
  type Frame = { x: number; y: number; ang: number; depth: number; pts: number[] };
  const stack: Frame[] = [];
  const stepLen = 26 * scale;
  let f: Frame = { x: ox, y: oy, ang: -90, depth: 0, pts: [ox, oy] };

  const pushBranch = (fr: Frame) => {
    if (fr.pts.length >= 4) {
      branches.push({ pts: fr.pts, w: Math.max(0.8, 4.6 * Math.pow(0.62, fr.depth) * scale) });
    }
  };

  // ~6 branching events from the trunk — a spare literati tree, not a bush.
  for (let i = 0; i < 38; i++) {
    if (f.depth > 4) {
      const p = stack.pop();
      if (p) {
        pushBranch(f);
        f = p;
      } else break;
      continue;
    }
    // wander + phototropism
    f.ang += (rnd() - 0.5) * 12;
    f.ang += (-90 - f.ang) * 0.04;
    const r = (f.ang * Math.PI) / 180;
    const len = stepLen * Math.pow(0.82, f.depth) * (0.8 + rnd() * 0.4);
    f.x += Math.cos(r) * len;
    f.y += Math.sin(r) * len;
    f.pts.push(f.x, f.y);
    // branch decision
    const roll = rnd();
    if (roll < 0.4) {
      // branch left
      stack.push({ ...f, pts: [f.x, f.y] });
      f.ang -= 26 + rnd() * 12;
      f.depth += 1;
      f.pts = [f.x, f.y];
    } else if (roll < 0.8) {
      // branch right
      stack.push({ ...f, pts: [f.x, f.y] });
      f.ang += 26 + rnd() * 12;
      f.depth += 1;
      f.pts = [f.x, f.y];
    }
    // else continue the current limb
  }
  pushBranch(f);
  return branches;
}

/* --------------------------------------------------------------------------
   Seasons — the atmospheric shift
   -------------------------------------------------------------------------- */

export type Season = "spring" | "summer" | "autumn" | "winter";

/**
 * The four atmospheric moods. The scroll cycles through them so the painting
 * is never quite the same weather twice — TAWARAYA's "12 months captured,"
 * distilled to four ink densities. The shift is slow and rides the deep
 * scroll position, never a sudden cut.
 */
export const SEASONS: Record<
  Season,
  {
    /** Display label (zh). */
    zh: string;
    /** Display label (en). */
    en: string;
    /** Mist density multiplier — winter is drowned in cloud. */
    mist: number;
    /** Far-ridge ink multiplier — winter recedes further into haze. */
    farFade: number;
    /** A faint tonal wash applied over the sky region (rgb + alpha). */
    wash: [number, number, number, number];
    /** A seasonal accent that appears rarely (plum-blossom dots in spring, etc). */
    accent: "plum" | "none" | "maple" | "snow";
  }
> = {
  spring: {
    zh: "春",
    en: "spring",
    mist: 0.9,
    farFade: 1.0,
    wash: [168, 50, 50, 0.012],
    accent: "plum",
  },
  summer: {
    zh: "夏",
    en: "summer",
    mist: 0.7,
    farFade: 1.0,
    wash: [58, 82, 58, 0.02],
    accent: "none",
  },
  autumn: {
    zh: "秋",
    en: "autumn",
    mist: 0.85,
    farFade: 0.92,
    wash: [150, 88, 44, 0.02],
    accent: "maple",
  },
  winter: {
    zh: "冬",
    en: "winter",
    mist: 1.35,
    farFade: 0.62,
    wash: [220, 220, 224, 0.05],
    accent: "snow",
  },
};

/** Ordered cycle, for indexing by scroll position. */
export const SEASON_ORDER: Season[] = ["spring", "summer", "autumn", "winter"];

/**
 * Blend two adjacent seasons by a 0..1 factor. The result is a smooth
 * atmospheric crossfade — the weather changes the way weather does.
 */
export function blendSeasons(
  a: Season,
  b: Season,
  t: number,
): { mist: number; farFade: number; wash: [number, number, number, number]; accent: Season } {
  const sa = SEASONS[a];
  const sb = SEASONS[b];
  const mist = sa.mist + (sb.mist - sa.mist) * t;
  const farFade = sa.farFade + (sb.farFade - sa.farFade) * t;
  const wash: [number, number, number, number] = [
    sa.wash[0] + (sb.wash[0] - sa.wash[0]) * t,
    sa.wash[1] + (sb.wash[1] - sa.wash[1]) * t,
    sa.wash[2] + (sb.wash[2] - sa.wash[2]) * t,
    sa.wash[3] + (sb.wash[3] - sa.wash[3]) * t,
  ];
  return { mist, farFade, wash, accent: t < 0.5 ? a : b };
}
