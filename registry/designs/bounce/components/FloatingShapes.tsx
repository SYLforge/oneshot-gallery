"use client";

import { usePointerParallax } from "../hooks/usePointerParallax";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

/**
 * A field of soft pastel blobs, stars, and clouds that drift toward the
 * pointer — `pointer-parallax`. Each shape is inline SVG (no images),
 * positioned absolutely and given a `--depth` (0.04–0.18); styles.css
 * multiplies the normalized pointer offset by depth so nearer shapes
 * follow more and far ones barely. The whole field also bobs gently on
 * mutually-prime idle periods, so it is alive even without a pointer
 * (touch devices, reduced-but-present motion fallback).
 *
 * Decorative only: `aria-hidden`, pointer-transparent.
 */
export default function FloatingShapes() {
  const reduced = usePrefersReducedMotion();
  const ref = usePointerParallax<HTMLDivElement>(reduced);

  return (
    <div className="bounce-field" ref={ref} aria-hidden="true">
      {/* far layer — barely drifts */}
      <div className="bounce-field__layer bounce-field__layer--far">
        <Cloud className="bounce-shape bounce-shape--cloud1" />
        <Cloud className="bounce-shape bounce-shape--cloud2" />
        <Star className="bounce-shape bounce-shape--star1" tone="butter" />
      </div>

      {/* mid layer */}
      <div className="bounce-field__layer bounce-field__layer--mid">
        <Blob className="bounce-shape bounce-shape--blob1" tone="peach" />
        <Blob className="bounce-shape bounce-shape--blob2" tone="sky" />
        <Star className="bounce-shape bounce-shape--star2" tone="peach" />
        <Blob className="bounce-shape bounce-shape--blob3" tone="grape" />
      </div>

      {/* near layer — drifts most */}
      <div className="bounce-field__layer bounce-field__layer--near">
        <Star className="bounce-shape bounce-shape--star3" tone="grape" />
        <Blob className="bounce-shape bounce-shape--blob4" tone="butter" />
        <Dot className="bounce-shape bounce-shape--dot1" tone="plum" />
        <Dot className="bounce-shape bounce-shape--dot2" tone="accent" />
      </div>
    </div>
  );
}

type Tone = "butter" | "sky" | "peach" | "grape" | "plum" | "accent";

function Blob({ className, tone }: { className: string; tone: Tone }) {
  return (
    <svg
      className={className}
      viewBox="0 0 120 120"
      width="120"
      height="120"
      focusable="false"
    >
      <path
        d="M60 8c14 0 22 10 28 22 4 8 24 10 24 30s-18 22-22 32-12 20-30 20-26-10-32-22S4 80 4 60 18 36 26 28 46 8 60 8z"
        fill={`var(--bounce-${tone})`}
      />
    </svg>
  );
}

function Star({ className, tone }: { className: string; tone: Tone }) {
  // a chunky 5-point star, rounded via stroke-linejoin
  const pts: string[] = [];
  const spikes = 5;
  const outer = 52;
  const inner = 24;
  for (let i = 0; i < spikes * 2; i += 1) {
    const r = i % 2 === 0 ? outer : inner;
    const a = (Math.PI * i) / spikes - Math.PI / 2;
    pts.push(`${(60 + Math.cos(a) * r).toFixed(1)},${(60 + Math.sin(a) * r).toFixed(1)}`);
  }
  return (
    <svg
      className={className}
      viewBox="0 0 120 120"
      width="96"
      height="96"
      focusable="false"
    >
      <polygon
        points={pts.join(" ")}
        fill={`var(--bounce-${tone})`}
        stroke="var(--bounce-ink)"
        strokeWidth="3"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Cloud({ className }: { className: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 160 80"
      width="160"
      height="80"
      focusable="false"
    >
      <path
        d="M40 64c-14 0-26-8-26-22s12-22 26-22c3-9 12-16 24-16s22 7 26 18c3-1 6-2 10-2 14 0 26 10 26 24s-12 22-26 22H40z"
        fill="var(--bounce-cloud)"
        stroke="var(--bounce-ink)"
        strokeWidth="3"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Dot({ className, tone }: { className: string; tone: Tone }) {
  return (
    <svg
      className={className}
      viewBox="0 0 40 40"
      width="40"
      height="40"
      focusable="false"
    >
      <circle cx="20" cy="20" r="16" fill={`var(--bounce-${tone})`} />
    </svg>
  );
}
