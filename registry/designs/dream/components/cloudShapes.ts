/**
 * Deterministic cloud-puff generator.
 *
 * Runs at module load on both the server and the client with fixed seeds, so
 * the SVG markup is byte-identical across hydration — each cloud is real
 * server-rendered content, not a client effect.
 *
 * A cloud is built from a row of overlapping circles whose radii wander along
 * a seeded sine envelope, joined into one smooth closed path by quadratic
 * arcs around the silhouette. Nothing here is a flat CSS blob: the path
 * carries the cloud's own rounded edge, and a finer feTurbulence grain is
 * layered on top in styles.css to give every puff a soft respiring texture.
 *
 * The "depth" parameter drives both the puff count and the viewBox so far
 * clouds are small and dense, near clouds are large and gauzy.
 */

export type CloudPuff = {
  /** Circle centers in viewBox units, x left→right. */
  cx: number;
  cy: number;
  r: number;
};

export type Cloud = {
  /** One closed quadratic path describing the whole cloud silhouette. */
  d: string;
  puffs: CloudPuff[];
  viewBox: string;
};

/** mulberry32 — tiny seeded PRNG; clouds must be identical on server and client. */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Grow a cloud into a `boxW × boxH` viewBox. The cloud sits with its base
 * near the bottom third (clouds are heavier than they look) and its puffs
 * wander up and down along a seeded envelope.
 */
export function growCloud(
  seed: number,
  puffCount: number,
  boxW: number,
  boxH: number,
): Cloud {
  const rnd = mulberry32(seed);
  const puffs: CloudPuff[] = [];

  // Lay the puffs left to right with a gentle size envelope so the cloud
  // reads as one mass with a soft crown, not a row of equal bubbles.
  const margin = boxW * 0.1;
  const span = boxW - margin * 2;
  const baseY = boxH * 0.6;
  for (let i = 0; i < puffCount; i++) {
    const u = puffCount === 1 ? 0.5 : i / (puffCount - 1);
    // crown envelope: bigger in the middle, tapered at the ends
    const env = Math.sin(u * Math.PI);
    const r = Math.round(
      (boxH * 0.16 + boxH * 0.2 * env) * (0.82 + rnd() * 0.36),
    );
    const cx = margin + span * u + (rnd() - 0.5) * span * 0.06;
    const cy = baseY - r * 0.55 * env - (rnd() - 0.5) * boxH * 0.06;
    puffs.push({ cx: Math.round(cx), cy: Math.round(cy), r });
  }

  // Walk the puffs as a closed silhouette: arc over the top of each, dip
  // between neighbours, then close along the flat bottom.
  const top = puffs;
  const d = traceSilhouette(top, boxH);

  return { d, puffs, viewBox: `0 0 ${boxW} ${boxH}` };
}

/**
 * Build a smooth closed path that arcs over the top of each puff and sags
 * between them, then runs flat along the baseline. Quadratic control points
 * sit at each puff's crown so the curve is tangent to the circle there.
 */
function traceSilhouette(puffs: CloudPuff[], boxH: number): string {
  if (puffs.length === 0) return "";
  const sorted = [...puffs].sort((a, b) => a.cx - b.cx);
  const base = boxH * 0.82;
  const first = sorted[0];
  const last = sorted[sorted.length - 1];
  let d = `M${round(first.cx - first.r)} ${round(base)}`;

  // up the left side of the first puff
  d += `Q${round(first.cx - first.r)} ${round(first.cy)} ${round(first.cx)} ${round(first.cy - first.r)}`;
  // over the crown to the right edge
  d += `Q${round(first.cx + first.r)} ${round(first.cy)} ${round(first.cx + first.r)} ${round(first.cy + first.r * 0.2)}`;

  for (let i = 1; i < sorted.length; i++) {
    const prev = sorted[i - 1];
    const cur = sorted[i];
    const gapMidX = (prev.cx + cur.cx) / 2;
    // sag between puffs: dip toward the baseline, then rise into the next crown
    const sagY = Math.min(base, Math.max(prev.cy, cur.cy) + (prev.r + cur.r) * 0.32);
    d += `Q${round(gapMidX)} ${round(sagY)} ${round(cur.cx - cur.r)} ${round(cur.cy + cur.r * 0.2)}`;
    d += `Q${round(cur.cx - cur.r)} ${round(cur.cy)} ${round(cur.cx)} ${round(cur.cy - cur.r)}`;
    d += `Q${round(cur.cx + cur.r)} ${round(cur.cy)} ${round(cur.cx + cur.r)} ${round(cur.cy + cur.r * 0.2)}`;
  }

  // down the right side to the baseline, then close along the flat bottom
  d += `Q${round(last.cx + last.r)} ${round(base)} ${round(last.cx + last.r)} ${round(base)}`;
  d += `L${round(first.cx - first.r)} ${round(base)}Z`;
  return d;
}

function round(n: number): number {
  return Math.round(n * 10) / 10;
}

/** A tiny star (4-point sparkle) path of radius `r` centered at the origin. */
export function starPath(r: number): string {
  const a = round(r);
  const b = round(r * 0.28);
  return `M0 ${-a}Q${b} ${-b} ${a} 0Q${b} ${b} 0 ${a}Q${-b} ${b} ${-a} 0Q${-b} ${-b} 0 ${-a}Z`;
}

/** Coordinates for `n` seeded stars inside a `boxW × boxH` field. */
export function starField(
  seed: number,
  n: number,
  boxW: number,
  boxH: number,
): { x: number; y: number; r: number; delay: number }[] {
  const rnd = mulberry32(seed);
  const out: { x: number; y: number; r: number; delay: number }[] = [];
  for (let i = 0; i < n; i++) {
    out.push({
      x: Math.round(rnd() * boxW),
      y: Math.round(rnd() * boxH),
      r: 0.6 + rnd() * 1.1,
      delay: rnd(),
    });
  }
  return out;
}
