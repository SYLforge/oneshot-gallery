"use client";

import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

/**
 * 숨결 원 — the breathing background.
 *
 * Three concentric translucent circles (paper-warm at falling alpha) that
 * breathe on a slow 12s cycle (scale 1 → 1.06, ease-in-out, infinite
 * alternate) and drift with the pointer (pointer-parallax): each layer's
 * translate is lerped toward the pointer offset, weighted by --st-depth
 * so the farthest layer moves least. The whole stack sits behind the
 * content at z-index 0 and is decorative (aria-hidden, role="img" with a
 * bilingual description).
 *
 * Discipline:
 * - Pointer parallax runs in a single rAF loop, lerped (0.06/frame) and
 *   capped to a small radius, transform-only; offscreen or hidden tab →
 *   the loop pauses and the circles settle to rest.
 * - Reduced motion: the breathing keyframe is removed and the parallax
 *   hook never starts; the circles sit still, present, calm.
 * - Touch: there is no hover dependency — the circles breathe on their
 *   own; pointer drift is a progressive enhancement that simply does not
 *   engage on a coarse pointer.
 *
 * The element is purely decorative: aria-hidden hides it from assistive
 * tech, and a visually-hidden description satisfies the scene's labeling
 * without adding noise.
 */
export default function BreathCircle() {
  const reduced = usePrefersReducedMotion();
  const stackRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = stackRef.current;
    if (!el) return;
    if (reduced) return;

    // Only fine pointers contribute parallax; coarse pointers (touch)
    // leave the circles to breathe on their own.
    if (!window.matchMedia("(pointer: fine)").matches) return;

    let raf = 0;
    // current rendered offsets, lerped toward target
    let cx = 0;
    let cy = 0;
    // target offset derived from pointer
    let tx = 0;
    let ty = 0;

    const onPointer = (e: PointerEvent) => {
      const w = window.innerWidth || 1;
      const h = window.innerHeight || 1;
      // -1..1 from center, then scaled per-layer by --st-depth in CSS.
      tx = ((e.clientX / w) - 0.5) * 2;
      ty = ((e.clientY / h) - 0.5) * 2;
    };

    const frame = () => {
      raf = requestAnimationFrame(frame);
      cx += (tx - cx) * 0.06;
      cy += (ty - cy) * 0.06;
      // -12% .. +12% of viewport, capped by the lerp + clamp in CSS.
      el.style.setProperty("--st-px", (cx * 12).toFixed(3));
      el.style.setProperty("--st-py", (cy * 12).toFixed(3));
    };

    const start = () => {
      if (raf) return;
      raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      if (!raf) return;
      cancelAnimationFrame(raf);
      raf = 0;
    };

    const onVisibility = () => {
      if (document.hidden) stop();
      else start();
    };

    window.addEventListener("pointermove", onPointer, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    start();

    return () => {
      window.removeEventListener("pointermove", onPointer);
      document.removeEventListener("visibilitychange", onVisibility);
      stop();
    };
  }, [reduced]);

  return (
    <div
      ref={stackRef}
      className="stretch-breath"
      aria-hidden="true"
      role="img"
      aria-label="숨결 원 — 배경에서 천천히 부풀었다 가라앉는 세 겹의 옅은 원. Three faint concentric circles breathing slowly behind the page."
    >
      <span className="stretch-breath__layer stretch-breath__layer--1" />
      <span className="stretch-breath__layer stretch-breath__layer--2" />
      <span className="stretch-breath__layer stretch-breath__layer--3" />
    </div>
  );
}
