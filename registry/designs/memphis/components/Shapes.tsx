"use client";

/**
 * The Memphis shape library — pure inline SVG, no images.
 * Every shape is a token-colored geometric primitive: squiggles, blobs,
 * zigzags, confetti dots, the terrazzo band, half-circles. They appear as
 * hero decoration, parallax field layers, and project-tile accents. Tone is
 * one of the five palette drums; the ink outline is optional (outline =
 * true) so filled chips can sit dense without every edge being ruled.
 *
 * Deterministic geometry (computed from fixed params at module scope, never
 * from Math.random) keeps SSR and client identical.
 */

export type Tone = "teal" | "coral" | "marigold" | "cobalt" | "plum";

const FILL: Record<Tone, string> = {
  teal: "var(--mp-teal)",
  coral: "var(--mp-coral)",
  marigold: "var(--mp-marigold)",
  cobalt: "var(--mp-cobalt)",
  plum: "var(--mp-plum)",
};

/** A horizontal squiggle — three humps. Stroke draws via data-mp-squiggle. */
export function Squiggle({
  className,
  tone = "marigold",
  width = 180,
  draw = false,
}: {
  className?: string;
  tone?: Tone;
  width?: number;
  draw?: boolean;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 180 36"
      width={width}
      height={(width * 36) / 180}
      focusable="false"
      aria-hidden="true"
    >
      <path
        d="M4 18 Q22 2 40 18 T76 18 T112 18 T148 18 T176 18"
        fill="none"
        stroke={FILL[tone]}
        strokeWidth="7"
        strokeLinecap="round"
        {...(draw ? { "data-mp-squiggle": "" } : {})}
      />
    </svg>
  );
}

/** A blobby Memphis shape — an asymmetric rounded polygon. */
export function Blob({
  className,
  tone = "coral",
  outline = true,
  size = 120,
}: {
  className?: string;
  tone?: Tone;
  outline?: boolean;
  size?: number;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 120 120"
      width={size}
      height={size}
      focusable="false"
      aria-hidden="true"
    >
      <path
        d="M62 6c16 0 26 12 32 24 5 10 22 14 22 32s-16 24-22 34-14 18-34 18-28-10-34-22S4 82 4 62 16 38 26 28 46 6 62 6z"
        fill={FILL[tone]}
        {...(outline
          ? { stroke: "var(--mp-ink)", strokeWidth: 3, strokeLinejoin: "round" }
          : {})}
      />
    </svg>
  );
}

/** A bold zigzag — the Memphis lightning motif. */
export function Zigzag({
  className,
  tone = "cobalt",
  width = 140,
}: {
  className?: string;
  tone?: Tone;
  width?: number;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 140 60"
      width={width}
      height={(width * 60) / 140}
      focusable="false"
      aria-hidden="true"
    >
      <polyline
        points="6,52 30,12 54,52 78,12 102,52 126,12"
        fill="none"
        stroke={FILL[tone]}
        strokeWidth="8"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
    </svg>
  );
}

/** A confetti dot — solid filled circle, the scatter unit. */
export function Confetti({
  className,
  tone = "teal",
  size = 36,
}: {
  className?: string;
  tone?: Tone;
  size?: number;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 36 36"
      width={size}
      height={size}
      focusable="false"
      aria-hidden="true"
    >
      <circle cx="18" cy="18" r="14" fill={FILL[tone]} />
    </svg>
  );
}

/** A half-circle / arch — a Memphis signature silhouette. */
export function Arch({
  className,
  tone = "teal",
  width = 120,
}: {
  className?: string;
  tone?: Tone;
  width?: number;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 120 64"
      width={width}
      height={(width * 64) / 120}
      focusable="false"
      aria-hidden="true"
    >
      <path
        d="M4 64 A56 56 0 0 1 116 64 Z"
        fill={FILL[tone]}
        stroke="var(--mp-ink)"
        strokeWidth="3"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** A spotted disc — terrazzo-on-a-plate, the studio's logo mark. */
export function SpottedDisc({
  className,
  size = 140,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 140 140"
      width={size}
      height={size}
      focusable="false"
      aria-hidden="true"
    >
      <circle
        cx="70"
        cy="70"
        r="66"
        fill="var(--mp-marigold)"
        stroke="var(--mp-ink)"
        strokeWidth="3"
      />
      <circle cx="44" cy="48" r="8" fill="var(--mp-teal)" />
      <circle cx="92" cy="40" r="6" fill="var(--mp-coral)" />
      <circle cx="100" cy="86" r="9" fill="var(--mp-cobalt)" />
      <circle cx="52" cy="100" r="7" fill="var(--mp-plum)" />
      <circle cx="74" cy="68" r="5" fill="var(--mp-ink)" />
    </svg>
  );
}

/** Deterministic terrazzo fleck coords (no Math.random → SSR-stable). */
const TERRAZZO = [
  { x: 4, y: 18, r: -14, s: 0.8, c: "teal" },
  { x: 16, y: 6, r: 22, s: 0.6, c: "coral" },
  { x: 28, y: 22, r: 8, s: 1.0, c: "marigold" },
  { x: 42, y: 8, r: -28, s: 0.7, c: "cobalt" },
  { x: 54, y: 20, r: 12, s: 0.9, c: "plum" },
  { x: 66, y: 6, r: 30, s: 0.6, c: "teal" },
  { x: 78, y: 18, r: -10, s: 0.8, c: "coral" },
  { x: 90, y: 4, r: 18, s: 0.7, c: "marigold" },
  { x: 8, y: 36, r: 24, s: 0.6, c: "cobalt" },
  { x: 24, y: 40, r: -8, s: 0.9, c: "plum" },
  { x: 40, y: 36, r: 14, s: 0.7, c: "teal" },
  { x: 56, y: 42, r: 26, s: 0.8, c: "coral" },
  { x: 70, y: 36, r: 10, s: 0.6, c: "marigold" },
  { x: 84, y: 40, r: -20, s: 1.0, c: "cobalt" },
  { x: 96, y: 34, r: 6, s: 0.7, c: "plum" },
] as const;

/**
 * The terrazzo band — a decorative full-width strip of rotated multicolor
 * chips over the paper ground, multiply-blended so it reads as speckled
 * handmade stock. aria-hidden, pointer-transparent.
 */
export function TerrazzoBand({ className }: { className?: string }) {
  return (
    <div className={className} aria-hidden="true">
      <svg
        viewBox="0 0 100 48"
        width="100%"
        height="100%"
        preserveAspectRatio="xMidYMid slice"
        focusable="false"
      >
        {TERRAZZO.map((f, i) => (
          <rect
            key={i}
            x={f.x}
            y={f.y}
            width={4 * f.s}
            height={2.6 * f.s}
            rx={0.6 * f.s}
            fill={FILL[f.c as Tone]}
            opacity={0.85}
            transform={`rotate(${f.r} ${f.x + 2 * f.s} ${f.y + 1.3 * f.s})`}
          />
        ))}
      </svg>
    </div>
  );
}
