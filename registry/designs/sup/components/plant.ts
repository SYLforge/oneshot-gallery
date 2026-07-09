/**
 * Deterministic L-system plant generator.
 *
 * Runs at module load on both the server and the client with a fixed seed,
 * so the SVG markup is byte-identical across hydration — the plant is real
 * server-rendered content, not a client effect.
 *
 * Grammar (a classic bracketed L-system):
 *   axiom  X
 *   rules  X → F[+X][-X]FX      (a bud becomes: grow, branch left, branch
 *          F → FF                right, grow again, keep a leading bud)
 *
 * The turtle interpretation adds what the grammar can't say: per-segment
 * angle wander (nothing alive is straight), mild phototropism pulling every
 * heading back toward "up", shrinking step lengths with branch depth, and a
 * growth clock — each branch records how far along the plant's total reach
 * it starts and ends, which styles.css turns into a stroke-dashoffset
 * drawing window. Base grows first, crown grows last, exactly like a plant.
 */

export type PlantBranch = {
  /** SVG path data (midpoint-smoothed quadratics through the turtle walk). */
  d: string;
  /** Stroke width in final viewBox units — thick at the root, hairline at tips. */
  w: number;
  /** Growth window start, 0..1 along the whole plant's growth clock. */
  t0: number;
  /** Growth window end. */
  t1: number;
  /** Branch depth (bracket nesting), for stroke color tiers. */
  depth: number;
};

export type PlantLeaf = {
  x: number;
  y: number;
  /** Rotation in degrees — roughly the heading of the twig it sits on. */
  ang: number;
  /** Leaf length in final viewBox units. */
  size: number;
  /** Moment on the growth clock when this leaf unfurls. */
  t: number;
  /** Alternating foliage tone (0 = lichen, 1 = deep moss). */
  tone: 0 | 1;
};

export type Plant = {
  branches: PlantBranch[];
  leaves: PlantLeaf[];
  viewBox: string;
};

/** mulberry32 — tiny seeded PRNG; growth must be identical on server and client. */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function rewrite(axiom: string, rules: Record<string, string>, n: number): string {
  let s = axiom;
  for (let i = 0; i < n; i++) {
    let next = "";
    for (const ch of s) next += rules[ch] ?? ch;
    s = next;
  }
  return s;
}

type Frame = {
  x: number;
  y: number;
  ang: number;
  depth: number;
  /** Cumulative growth distance from the seed along this lineage. */
  dist: number;
  startDist: number;
  pts: number[];
};

type RawBranch = { pts: number[]; startDist: number; endDist: number; depth: number };
type RawLeaf = { x: number; y: number; ang: number; dist: number; depth: number; jit: number; tone: 0 | 1 };

const BRANCH_ANGLE = 27;

/**
 * Grow a plant into a `boxW × boxH` viewBox. The root sits on the bottom
 * edge; the whole silhouette is normalized to fit with a small margin, so
 * the same code yields the hero tree (4 iterations) and the smaller
 * understory shrub (3 iterations) without hand-tuned step lengths.
 */
export function growPlant(
  seed: number,
  iterations: number,
  boxW: number,
  boxH: number,
  leafChance = 0.82,
): Plant {
  const rnd = mulberry32(seed);
  const sentence = rewrite("X", { X: "F[+X][-X]FX", F: "FF" }, iterations);

  const rawBranches: RawBranch[] = [];
  const rawLeaves: RawLeaf[] = [];
  const stack: Frame[] = [];
  let f: Frame = { x: 0, y: 0, ang: -90, depth: 0, dist: 0, startDist: 0, pts: [0, 0] };

  for (const ch of sentence) {
    if (ch === "F") {
      const step = 10 * Math.pow(0.92, f.depth) * (0.85 + rnd() * 0.3);
      f.ang += (rnd() - 0.5) * 8; // wander — nothing alive is straight
      f.ang += (-90 - f.ang) * 0.034; // phototropism — lean back toward the light
      const r = (f.ang * Math.PI) / 180;
      f.x += Math.cos(r) * step;
      f.y += Math.sin(r) * step;
      f.dist += step;
      f.pts.push(f.x, f.y);
    } else if (ch === "+") {
      f.ang += BRANCH_ANGLE + (rnd() - 0.5) * 10;
    } else if (ch === "-") {
      f.ang -= BRANCH_ANGLE + (rnd() - 0.5) * 10;
    } else if (ch === "[") {
      stack.push(f);
      f = {
        x: f.x,
        y: f.y,
        ang: f.ang,
        depth: f.depth + 1,
        dist: f.dist,
        startDist: f.dist,
        pts: [f.x, f.y],
      };
    } else if (ch === "]") {
      if (f.pts.length >= 4) {
        rawBranches.push({
          pts: f.pts,
          startDist: f.startDist,
          endDist: f.dist,
          depth: f.depth,
        });
      }
      const parent = stack.pop();
      if (parent) f = parent;
    } else if (ch === "X" && rnd() < leafChance) {
      // a bud that never became a branch — a leaf lives here
      rawLeaves.push({
        x: f.x,
        y: f.y,
        ang: f.ang + (rnd() - 0.5) * 70,
        dist: f.dist,
        depth: f.depth,
        jit: rnd(),
        tone: rnd() < 0.45 ? 1 : 0,
      });
    }
  }
  // the trunk itself — the frame that never got popped
  rawBranches.push({ pts: f.pts, startDist: 0, endDist: f.dist, depth: 0 });

  // ---- normalize into the requested viewBox ------------------------------
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;
  for (const b of rawBranches) {
    for (let i = 0; i < b.pts.length; i += 2) {
      if (b.pts[i] < minX) minX = b.pts[i];
      if (b.pts[i] > maxX) maxX = b.pts[i];
      if (b.pts[i + 1] < minY) minY = b.pts[i + 1];
      if (b.pts[i + 1] > maxY) maxY = b.pts[i + 1];
    }
  }
  const margin = boxW * 0.06;
  const s = Math.min(
    (boxW - margin * 2) / Math.max(maxX - minX, 1),
    (boxH - margin) / Math.max(maxY - minY, 1),
  );
  // center horizontally; the seed (raw y = 0, the lowest point) sits on the ground
  const ox = boxW / 2 - ((minX + maxX) / 2) * s;
  const oy = boxH - 2 - maxY * s;
  const px = (x: number) => Math.round((x * s + ox) * 10) / 10;
  const py = (y: number) => Math.round((y * s + oy) * 10) / 10;

  let maxDist = 0;
  for (const b of rawBranches) if (b.endDist > maxDist) maxDist = b.endDist;
  for (const l of rawLeaves) if (l.dist > maxDist) maxDist = l.dist;
  /** Map a growth distance onto the shared 0..1 clock (crown done by ~0.93). */
  const clock = (d: number) => 0.02 + 0.9 * (d / maxDist);

  const branches: PlantBranch[] = rawBranches.map((b) => {
    // midpoint smoothing: pass through the endpooints, curve near the interior
    const n = b.pts.length / 2;
    const X = (i: number) => px(b.pts[i * 2]);
    const Y = (i: number) => py(b.pts[i * 2 + 1]);
    let d = `M${X(0)} ${Y(0)}`;
    if (n === 2) {
      d += `L${X(1)} ${Y(1)}`;
    } else {
      for (let i = 1; i < n - 1; i++) {
        const mx = Math.round(((X(i) + X(i + 1)) / 2) * 10) / 10;
        const my = Math.round(((Y(i) + Y(i + 1)) / 2) * 10) / 10;
        d += `Q${X(i)} ${Y(i)} ${mx} ${my}`;
      }
      d += `L${X(n - 1)} ${Y(n - 1)}`;
    }
    const t0 = clock(b.startDist);
    const t1 = Math.max(t0 + 0.03, clock(b.endDist));
    return {
      d,
      w: Math.max(0.9, 4.8 * Math.pow(0.68, b.depth)),
      t0: Math.round(t0 * 1000) / 1000,
      t1: Math.round(t1 * 1000) / 1000,
      depth: b.depth,
    };
  });

  const leaves: PlantLeaf[] = rawLeaves.map((l) => ({
    x: px(l.x),
    y: py(l.y),
    ang: Math.round(l.ang * 10) / 10,
    size: Math.round(Math.min(44, Math.max(20, s * 8 * Math.pow(0.96, l.depth) * (0.7 + l.jit * 0.7))) * 10) / 10,
    t: Math.round(Math.min(0.93, clock(l.dist)) * 1000) / 1000,
    tone: l.tone,
  }));

  return { branches, leaves, viewBox: `0 0 ${boxW} ${boxH}` };
}

/** Almond-shaped leaf path of length `size`, base at the local origin. */
export function leafPath(size: number): string {
  const half = Math.round(size * 0.3 * 10) / 10;
  const mid = Math.round(size * 0.42 * 10) / 10;
  return `M0 0Q${mid} ${-half} ${size} 0Q${mid} ${half} 0 0Z`;
}
