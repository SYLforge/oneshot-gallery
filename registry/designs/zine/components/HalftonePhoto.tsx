"use client";

import type { CSSProperties } from "react";

/**
 * A halftone "photo" — a newsprint duotone built entirely from SVG, no
 * raster payload. The image is a field of ink dots whose radius grows
 * toward the shadow side of a soft radial mask, so the panel reads as a
 * photocopied halftone photograph: dense where the picture is dark,
 * sparse where it is light. A cream backdrop shows through the gaps the
 * way newsprint shows through ink.
 *
 * Each variant picks a mask center + a dot pitch so the six "photos" in
 * the grid feel like different shots of the same underground: a stage
 * monitor, a risograph bed, a crowd, a taped wall, a cassette deck, a
 * flyer stack. They are role="img" with bilingual aria-labels.
 *
 * `rotate` and `tape` let the layout misregister each panel slightly —
 * the collage energy comes from the panels not sitting square.
 */
type Variant = "stage" | "riso" | "crowd" | "wall" | "tape" | "flyers";

const MASK: Record<Variant, { cx: number; cy: number; r: number }> = {
  stage: { cx: 124, cy: 96, r: 150 },
  riso: { cx: 156, cy: 124, r: 168 },
  crowd: { cx: 100, cy: 132, r: 158 },
  wall: { cx: 132, cy: 84, r: 144 },
  tape: { cx: 92, cy: 108, r: 150 },
  flyers: { cx: 150, cy: 138, r: 162 },
};

export default function HalftonePhoto({
  variant,
  rotate = 0,
  label,
}: {
  variant: Variant;
  rotate?: number;
  label: string;
}) {
  const m = MASK[variant];
  const cols = 26;
  const rows = 18;
  const dots: { x: number; y: number; r: number }[] = [];
  for (let gy = 0; gy < rows; gy += 1) {
    for (let gx = 0; gx < cols; gx += 1) {
      // stagger every other row so the dot grid reads as halftone, not graph paper
      const x = 10 + gx * 12 + (gy % 2 ? 6 : 0);
      const y = 12 + gy * 12;
      if (x > 308 || y > 224) continue;
      const dx = x - m.cx;
      const dy = y - m.cy;
      const d = Math.sqrt(dx * dx + dy * dy);
      // inverse-square-ish falloff from the mask center = shadow density
      const density = Math.max(0, 1 - d / m.r);
      const r = Math.max(0, density * density * 5.4);
      if (r > 0.35) dots.push({ x, y, r });
    }
  }

  return (
    <div
      className="zine-photo"
      style={{ "--z-photo-rot": `${rotate}deg` } as CSSProperties}
      role="img"
      aria-label={label}
    >
      <svg
        className="zine-photo__art"
        viewBox="0 0 320 236"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
        focusable="false"
      >
        {dots.map((d, i) => (
          <circle key={i} cx={d.x} cy={d.y} r={d.r} className="zine-photo__dot" />
        ))}
      </svg>
      <span className="zine-photo__tape zine-photo__tape--tl" aria-hidden="true" />
      <span className="zine-photo__tape zine-photo__tape--br" aria-hidden="true" />
    </div>
  );
}
