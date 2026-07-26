"use client";

import { useEffect, useRef } from "react";

export type ScrollProgress = {
  /** Smoothed scroll progress across the target, 0..1 (lerp, frame-rate safe). */
  p: number;
  /** Raw instantaneous progress, 0..1 (for one-shot triggers that must not lag). */
  raw: number;
  /** performance.now() of the last raw sample. */
  t: number;
};

/**
 * Tracks scroll progress of a target element through the viewport into a ref,
 * without ever re-rendering React. Designed for the pinned verse section: as
 * the section's wrapper scrolls from "just entered" to "about to leave", p
 * runs 0 → 1, and the consumer's rAF loop lerps it so petals accumulate and
 * clear smoothly rather than ticking with each scroll event.
 *
 * The hook stays deliberately dumb: it records the *instantaneous* progress
 * (raw) on every scroll/resize, plus a timestamp. Smoothing belongs to the
 * consumer's rAF loop, where it can be frame-rate normalized.
 *
 * Progress is measured against the element's own box relative to the
 * viewport top, independent of total page height — so it works whether the
 * section is pinned by CSS or simply tall.
 */
export function useScrollProgress<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const sample = useRef<ScrollProgress>({ p: 0, raw: 0, t: 0 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const measure = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      // Start (0) when the element's top reaches the viewport top; end (1)
      // when its bottom leaves the viewport top. Clamped to [0, 1].
      const span = Math.max(rect.height - vh, 1);
      const traveled = Math.min(Math.max(-rect.top, 0), span);
      const raw = traveled / span;
      sample.current = { p: sample.current.p, raw, t: performance.now() };
    };

    measure();
    window.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      window.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
    };
  }, []);

  return { ref, progress: sample };
}
