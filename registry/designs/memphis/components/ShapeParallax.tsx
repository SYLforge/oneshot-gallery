"use client";

import { usePointerParallax } from "../hooks/usePointerParallax";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import { Blob, Squiggle, Zigzag, Confetti, Arch } from "./Shapes";

/**
 * `pointer-parallax` — a field of Memphis shapes in three depth layers that
 * drift toward the pointer. Each layer multiplies the normalized pointer
 * offset (set on the field root by usePointerParallax as --mp-x / --mp-y,
 * each −1…1) by a depth factor in styles.css: near shapes drift up to ±26px,
 * mid ±16px, far ±8px — so nearer shapes follow more and far ones barely,
 * reading as real depth. Each shape also bobs gently on a mutually-prime
 * idle period, so the field is alive even without a pointer (touch devices
 * and the reduced-but-present fallback).
 *
 * Decorative only: aria-hidden, pointer-transparent. The depth factor lives
 * in the layer wrapper's transform; the shape's own transform carries the
 * idle bob, so they compose without clobbering each other (translate on the
 * layer, translate on the shape — separate elements).
 */
export default function ShapeParallax() {
  const reduced = usePrefersReducedMotion();
  const ref = usePointerParallax<HTMLDivElement>(reduced);

  return (
    <div className="mp-field" ref={ref} aria-hidden="true">
      {/* far layer — barely drifts, low opacity */}
      <div className="mp-field__layer mp-field__layer--far">
        <Squiggle className="mp-field__sh mp-field__sh--s1" tone="marigold" width={160} />
        <Blob className="mp-field__sh mp-field__sh--b1" tone="teal" size={90} />
        <Confetti className="mp-field__sh mp-field__sh--d1" tone="plum" size={26} />
      </div>

      {/* mid layer */}
      <div className="mp-field__layer mp-field__layer--mid">
        <Zigzag className="mp-field__sh mp-field__sh--z1" tone="cobalt" width={130} />
        <Blob className="mp-field__sh mp-field__sh--b2" tone="coral" size={110} outline={false} />
        <Arch className="mp-field__sh mp-field__sh--a1" tone="marigold" width={100} />
        <Confetti className="mp-field__sh mp-field__sh--d2" tone="teal" size={30} />
      </div>

      {/* near layer — drifts most */}
      <div className="mp-field__layer mp-field__layer--near">
        <Squiggle className="mp-field__sh mp-field__sh--s2" tone="coral" width={120} />
        <Blob className="mp-field__sh mp-field__sh--b3" tone="cobalt" size={80} />
        <Confetti className="mp-field__sh mp-field__sh--d3" tone="marigold" size={34} />
        <Zigzag className="mp-field__sh mp-field__sh--z2" tone="teal" width={90} />
      </div>
    </div>
  );
}
