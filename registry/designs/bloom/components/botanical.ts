/**
 * BLOOM botanical illustrations.
 *
 * Unlike sup (which grows a procedural L-system), bloom's line-art is
 * hand-authored SVG — a perfumer's botanical plate, the kind you'd find
 * pressed into a 19th-century scent journal. Every path is a literal `d`
 * string drawn once at module load, identical on server and client (SSR'd
 * content, hydration-safe by construction).
 *
 * The drawing clock: each stroke carries `--d0` (when on the 0→1 draw clock
 * it begins) and `--d1` (when it ends). styles.css converts the single
 * `--bloom-draw` variable into each stroke's stroke-dashoffset window, so
 * the whole plate draws in narrative order — stem, then branches, then
 * leaves, then the bud/flower last — driven by one property write/frame.
 * `pathLength={1}` everywhere so dash math ignores real path length.
 */

export type Stroke = {
  /** the path's `d` */
  d: string;
  /** draw-start on the 0→1 clock */
  d0: number;
  /** draw-end on the 0→1 clock */
  d1: number;
  /** stroke width */
  w: number;
  /** class hook for color tier */
  cls:
    | "bloom-stem"
    | "bloom-branch"
    | "bloom-leaf-line"
    | "bloom-vein"
    | "bloom-petal-line"
    | "bloom-calyx";
};

export type Wash = {
  /** the wash shape's `d` */
  d: string;
  /** fill token class */
  cls: "bloom-wash-green" | "bloom-wash-blush" | "bloom-wash-sage";
  /** when the wash begins to settle (mirrors nearby strokes) */
  settle: number;
};

export type LeafShape = {
  /** transform: translate/rotate to place this leaf on the stem */
  xform: string;
  /** leaf outline `d`, drawn in its own window */
  d: string;
  /** vein `d`, drawn just after the outline */
  vein: string;
  d0: number;
  d1: number;
};

export type Plate = {
  viewBox: string;
  strokes: Stroke[];
  leaves: LeafShape[];
  washes: Wash[];
};

/* --------------------------------------------------------------------------
   HERO BOTANICAL — a flowering stem that draws itself in.
   Stem first (0.00–0.18), two branches (0.18–0.34), leaves (0.30–0.58),
   then the bud opens into a five-petal flower last (0.58–1.00).
   Drawn in a 0 0 400 640 viewBox; the stem rises from bottom-center.
   -------------------------------------------------------------------------- */

const HERO_STEM: Stroke[] = [
  {
    // main stem — one long rising S-curve from base to the bud
    d: "M200 632 C 196 560, 208 480, 200 400 C 194 340, 210 300, 202 252",
    d0: 0.0,
    d1: 0.18,
    w: 3.2,
    cls: "bloom-stem",
  },
  {
    // lower-left branch
    d: "M198 470 C 176 460, 150 452, 122 446",
    d0: 0.18,
    d1: 0.28,
    w: 2.4,
    cls: "bloom-branch",
  },
  {
    // upper-right branch
    d: "M201 360 C 224 350, 252 344, 280 340",
    d0: 0.24,
    d1: 0.34,
    w: 2.4,
    cls: "bloom-branch",
  },
];

// Leaf outlines are simple lancet/ovate shapes with a midrib vein.
// Each is authored around its own local origin then placed by xform.
const HERO_LEAVES: LeafShape[] = [
  {
    // lower-left leaf, attached to the lower branch
    xform: "translate(118 444) rotate(-28)",
    d: "M0 0 C 26 -10, 52 -6, 74 6 C 52 16, 26 22, 0 18 Z",
    vein: "M4 8 C 24 6, 48 6, 70 7",
    d0: 0.3,
    d1: 0.44,
  },
  {
    // upper-right leaf
    xform: "translate(282 338) rotate(24)",
    d: "M0 0 C 28 -8, 56 -4, 80 8 C 56 18, 28 24, 0 20 Z",
    vein: "M4 9 C 26 7, 52 7, 76 9",
    d0: 0.36,
    d1: 0.5,
  },
  {
    // a smaller lower stem leaf
    xform: "translate(196 540) rotate(8)",
    d: "M0 0 C 20 -6, 40 -3, 58 6 C 40 14, 20 18, 0 14 Z",
    vein: "M3 6 C 18 5, 36 5, 54 6",
    d0: 0.42,
    d1: 0.54,
  },
  {
    // a small opposite stem leaf
    xform: "translate(204 480) rotate(-172)",
    d: "M0 0 C 20 -6, 40 -3, 58 6 C 40 14, 20 18, 0 14 Z",
    vein: "M3 6 C 18 5, 36 5, 54 6",
    d0: 0.46,
    d1: 0.58,
  },
];

// The bud/flower at the top — a calyx then five petals. These strokes occupy
// the back half of the clock (0.58–1.00) so the plant blooms last.
const HERO_FLOWER: Stroke[] = [
  {
    // calyx — the green base of the bud
    d: "M202 252 C 192 246, 192 234, 202 228 C 212 234, 212 246, 202 252 Z",
    d0: 0.58,
    d1: 0.64,
    w: 2.2,
    cls: "bloom-calyx",
  },
  {
    // petal 1 (top)
    d: "M202 228 C 190 210, 190 188, 202 174 C 214 188, 214 210, 202 228 Z",
    d0: 0.66,
    d1: 0.76,
    w: 2,
    cls: "bloom-petal-line",
  },
  {
    // petal 2 (upper-left)
    d: "M200 226 C 182 224, 166 210, 160 192 C 178 188, 194 198, 200 214 C 201 218, 201 222, 200 226 Z",
    d0: 0.72,
    d1: 0.82,
    w: 2,
    cls: "bloom-petal-line",
  },
  {
    // petal 3 (upper-right)
    d: "M204 226 C 222 224, 238 210, 244 192 C 226 188, 210 198, 204 214 C 203 218, 203 222, 204 226 Z",
    d0: 0.74,
    d1: 0.84,
    w: 2,
    cls: "bloom-petal-line",
  },
  {
    // petal 4 (lower-left)
    d: "M201 228 C 186 234, 170 246, 168 262 C 186 262, 198 250, 202 238 C 202 234, 202 230, 201 228 Z",
    d0: 0.78,
    d1: 0.88,
    w: 2,
    cls: "bloom-petal-line",
  },
  {
    // petal 5 (lower-right)
    d: "M203 228 C 218 234, 234 246, 236 262 C 218 262, 206 250, 202 238 C 202 234, 202 230, 203 228 Z",
    d0: 0.8,
    d1: 0.9,
    w: 2,
    cls: "bloom-petal-line",
  },
];

// The blush wash behind the petals — settles as the flower opens.
const HERO_WASHES: Wash[] = [
  {
    // a soft blush disc behind the whole flower head
    d: "M202 218 m -42 0 a 42 42 0 1 0 84 0 a 42 42 0 1 0 -84 0",
    cls: "bloom-wash-blush",
    settle: 0.62,
  },
  {
    // a green wash behind the leaves cluster
    d: "M150 450 m -40 0 a 40 28 0 1 0 80 0 a 40 28 0 1 0 -80 0",
    cls: "bloom-wash-green",
    settle: 0.34,
  },
];

export const HERO_PLATE: Plate = {
  viewBox: "0 0 400 640",
  strokes: [...HERO_STEM, ...HERO_FLOWER],
  leaves: HERO_LEAVES,
  washes: HERO_WASHES,
};

/* --------------------------------------------------------------------------
   SCENT-NOTE BOTANICALS — three small plates for the three scent notes.
   Top (citrus leaf), heart (peony), base (root). Each is a compact
   0 0 200 200 plate that draws on reveal.
   -------------------------------------------------------------------------- */

export type Note = {
  /** glyph + bilingual label */
  ko: string;
  en: string;
  latin: string;
  /** the note family — drives the wash color */
  family: "top" | "heart" | "base";
  plate: Plate;
};

// TOP NOTE — a pointed citrus leaf with a vein
const TOP_PLATE: Plate = {
  viewBox: "0 0 200 200",
  strokes: [
    {
      // leaf outline (lancet)
      d: "M100 24 C 84 60, 78 110, 100 176 C 122 110, 116 60, 100 24 Z",
      d0: 0,
      d1: 0.5,
      w: 2.2,
      cls: "bloom-leaf-line",
    },
    {
      // midrib
      d: "M100 30 L 100 170",
      d0: 0.4,
      d1: 0.66,
      w: 1.4,
      cls: "bloom-vein",
    },
    {
      // side vein left
      d: "M100 80 C 90 86, 84 92, 80 100",
      d0: 0.6,
      d1: 0.76,
      w: 1,
      cls: "bloom-vein",
    },
    {
      // side vein right
      d: "M100 80 C 110 86, 116 92, 120 100",
      d0: 0.64,
      d1: 0.8,
      w: 1,
      cls: "bloom-vein",
    },
    {
      // lower side vein left
      d: "M100 120 C 92 126, 88 132, 86 140",
      d0: 0.72,
      d1: 0.86,
      w: 1,
      cls: "bloom-vein",
    },
    {
      // lower side vein right
      d: "M100 120 C 108 126, 112 132, 114 140",
      d0: 0.76,
      d1: 0.9,
      w: 1,
      cls: "bloom-vein",
    },
  ],
  leaves: [],
  washes: [
    {
      d: "M100 100 m -30 0 a 30 76 0 1 0 60 0 a 30 76 0 1 0 -60 0",
      cls: "bloom-wash-sage",
      settle: 0.3,
    },
  ],
};

// HEART NOTE — a small peony: a cluster of rounded petals around a center
const HEART_PLATE: Plate = {
  viewBox: "0 0 200 200",
  strokes: [
    {
      // center petals (inner ring of 3)
      d: "M100 80 C 92 70, 92 58, 100 50 C 108 58, 108 70, 100 80 Z",
      d0: 0,
      d1: 0.28,
      w: 1.8,
      cls: "bloom-petal-line",
    },
    {
      d: "M100 80 C 88 84, 76 80, 70 70 C 80 62, 92 64, 100 72 Z",
      d0: 0.18,
      d1: 0.4,
      w: 1.8,
      cls: "bloom-petal-line",
    },
    {
      d: "M100 80 C 112 84, 124 80, 130 70 C 120 62, 108 64, 100 72 Z",
      d0: 0.24,
      d1: 0.46,
      w: 1.8,
      cls: "bloom-petal-line",
    },
    {
      // outer ring of 5 larger petals
      d: "M100 76 C 88 60, 88 40, 100 26 C 112 40, 112 60, 100 76 Z",
      d0: 0.4,
      d1: 0.6,
      w: 2,
      cls: "bloom-petal-line",
    },
    {
      d: "M98 78 C 78 70, 64 52, 62 34 C 80 32, 94 46, 100 64 Z",
      d0: 0.5,
      d1: 0.7,
      w: 2,
      cls: "bloom-petal-line",
    },
    {
      d: "M102 78 C 122 70, 136 52, 138 34 C 120 32, 106 46, 100 64 Z",
      d0: 0.54,
      d1: 0.74,
      w: 2,
      cls: "bloom-petal-line",
    },
    {
      d: "M99 80 C 84 86, 70 100, 66 120 C 86 122, 96 108, 100 92 Z",
      d0: 0.62,
      d1: 0.82,
      w: 2,
      cls: "bloom-petal-line",
    },
    {
      d: "M101 80 C 116 86, 130 100, 134 120 C 114 122, 104 108, 100 92 Z",
      d0: 0.66,
      d1: 0.86,
      w: 2,
      cls: "bloom-petal-line",
    },
    {
      // a short stem below
      d: "M100 122 C 100 140, 100 160, 100 176",
      d0: 0.8,
      d1: 0.96,
      w: 2,
      cls: "bloom-stem",
    },
  ],
  leaves: [],
  washes: [
    {
      d: "M100 78 m -44 0 a 44 44 0 1 0 88 0 a 44 44 0 1 0 -88 0",
      cls: "bloom-wash-blush",
      settle: 0.36,
    },
  ],
};

// BASE NOTE — a root/tuber: a bulb shape with root tendrils below
const BASE_PLATE: Plate = {
  viewBox: "0 0 200 200",
  strokes: [
    {
      // the bulb/tuber outline
      d: "M100 60 C 78 60, 64 78, 64 100 C 64 124, 80 140, 100 140 C 120 140, 136 124, 136 100 C 136 78, 122 60, 100 60 Z",
      d0: 0,
      d1: 0.4,
      w: 2.2,
      cls: "bloom-leaf-line",
    },
    {
      // a shoot rising from the top
      d: "M100 60 C 100 48, 100 38, 100 28",
      d0: 0.3,
      d1: 0.5,
      w: 1.8,
      cls: "bloom-stem",
    },
    {
      // two small leaves at the shoot
      d: "M100 40 C 92 36, 86 34, 80 34",
      d0: 0.44,
      d1: 0.58,
      w: 1.4,
      cls: "bloom-leaf-line",
    },
    {
      d: "M100 40 C 108 36, 114 34, 120 34",
      d0: 0.48,
      d1: 0.62,
      w: 1.4,
      cls: "bloom-leaf-line",
    },
    {
      // root tendrils below (5)
      d: "M84 138 C 80 152, 76 164, 72 176",
      d0: 0.5,
      d1: 0.72,
      w: 1.4,
      cls: "bloom-vein",
    },
    {
      d: "M100 140 C 100 154, 100 166, 100 178",
      d0: 0.54,
      d1: 0.78,
      w: 1.4,
      cls: "bloom-vein",
    },
    {
      d: "M116 138 C 120 152, 124 164, 128 176",
      d0: 0.58,
      d1: 0.82,
      w: 1.4,
      cls: "bloom-vein",
    },
    {
      d: "M74 134 C 66 146, 60 156, 56 166",
      d0: 0.64,
      d1: 0.86,
      w: 1.2,
      cls: "bloom-vein",
    },
    {
      d: "M126 134 C 134 146, 140 156, 144 166",
      d0: 0.68,
      d1: 0.9,
      w: 1.2,
      cls: "bloom-vein",
    },
  ],
  leaves: [],
  washes: [
    {
      d: "M100 100 m -40 0 a 40 44 0 1 0 80 0 a 40 44 0 1 0 -80 0",
      cls: "bloom-wash-green",
      settle: 0.3,
    },
  ],
};

export const NOTES: readonly Note[] = [
  {
    ko: "탑 노트",
    en: "Top note",
    latin: "Citrus aurantium",
    family: "top",
    plate: TOP_PLATE,
  },
  {
    ko: "하트 노트",
    en: "Heart note",
    latin: "Paeonia lactiflora",
    family: "heart",
    plate: HEART_PLATE,
  },
  {
    ko: "베이스 노트",
    en: "Base note",
    latin: "Vetiveria zizanioides",
    family: "base",
    plate: BASE_PLATE,
  },
];

/* --------------------------------------------------------------------------
   THE SIGNATURE FLOWER — the pinned "the bloom" section.
   A large eight-petal flower drawn at viewBox 0 0 600 600, centered. Each
   petal is its own <g> so useScrollProgress can drive scale+rotation per
   petal via the shared --bloom-open variable. Petals are pre-drawn (the
   line-art is static/complete here — this plate is about OPENING, not
   drawing), so every stroke has a wide d0..d1 window of 0..1 (always drawn)
   and the motion is purely the petal-group transform.
   -------------------------------------------------------------------------- */

export type Petal = {
  /** transform placing this petal around the center (rotation in deg) */
  rotate: number;
  /** petal outline `d`, authored pointing "up" from center 300,300 */
  d: string;
  /** inner highlight vein */
  vein: string;
  /** draw order on a notional clock — but here all petals are pre-drawn */
  tier: 0 | 1;
};

// A petal shape authored pointing up from (300, 300): a rounded teardrop.
const PETAL_INNER_D =
  "M300 300 C 286 270, 286 236, 300 210 C 314 236, 314 270, 300 300 Z";
const PETAL_INNER_VEIN = "M300 296 C 300 270, 300 244, 300 220";
const PETAL_OUTER_D =
  "M300 300 C 278 260, 278 214, 300 176 C 322 214, 322 260, 300 300 Z";
const PETAL_OUTER_VEIN = "M300 296 C 300 262, 300 230, 300 196";

// Inner ring of 5 petals (drawn on top, smaller), outer ring of 8 (larger).
const INNER_ROTATIONS = [0, 72, 144, 216, 288];
const OUTER_ROTATIONS = [36, 81, 126, 171, 216, 261, 306, 351];

export const SIGNATURE_PETALS: Petal[] = [
  ...INNER_ROTATIONS.map((rotate) => ({
    rotate,
    d: PETAL_INNER_D,
    vein: PETAL_INNER_VEIN,
    tier: 1 as const,
  })),
  ...OUTER_ROTATIONS.map((rotate) => ({
    rotate,
    d: PETAL_OUTER_D,
    vein: PETAL_OUTER_VEIN,
    tier: 0 as const,
  })),
];

// The center disc + anthers (always visible; they scale slightly with open)
export const SIGNATURE_CENTER = {
  // the receptacle disc
  disc: "M300 300 m -20 0 a 20 20 0 1 0 40 0 a 20 20 0 1 0 -40 0",
  // six anther dots placed around the disc
  anthers: [
    { cx: 300, cy: 286 },
    { cx: 314, cy: 292 },
    { cx: 318, cy: 308 },
    { cx: 308, cy: 318 },
    { cx: 292, cy: 318 },
    { cx: 282, cy: 308 },
  ],
};

// The blush wash that fills as the flower opens — one big disc.
export const SIGNATURE_WASH =
  "M300 300 m -150 0 a 150 150 0 1 0 300 0 a 150 150 0 1 0 -300 0";
