"use client";

import { useEffect, useRef, type RefObject } from "react";

/** Frame-rate-independent smoothing per 60fps-normalized frame. */
const LERP = 0.18;

/**
 * Tracks scroll progress through a pinned section and writes a smoothed
 * 0→1 value to a custom property on the pinned element.
 *
 * `progressVar` names the CSS custom property written (default
 * `--orbit-build`); the exploded build's part offsets and rail clips read it.
 * The raw (unsmoothed) progress is written to `<progressVar>-raw` so scrub-
 * dependent things that must not lag (clip-path wipes) can use it directly.
 *
 * This is direct input→style manipulation (scroll position → a number), not
 * an autonomous animation, so it stays live under prefers-reduced-motion —
 * only the *lerp* is bypassed there, so the build still responds 1:1 to the
 * wheel.
 */
export function useScrollProgress(
  pinRef: RefObject<HTMLElement | null>,
  progressVar = "--orbit-build",
): void {
  const rafRef = useRef(0);
  const smoothRef = useRef(0);

  useEffect(() => {
    const el = pinRef.current;
    if (!el) return;

    let lastTarget = 0;

    const compute = () => {
      rafRef.current = 0;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      // 0 when the section's top hits the top of the viewport,
      // 1 when its bottom hits the bottom. The section is taller than the
      // viewport on purpose (it is the pin's runway).
      const usable = Math.max(1, rect.height - vh);
      const traveled = Math.min(Math.max(-rect.top, 0), usable);
      lastTarget = traveled / usable;
      el.style.setProperty(`${progressVar}-raw`, lastTarget.toFixed(4));
    };

    const tick = () => {
      rafRef.current = 0;
      smoothRef.current += (lastTarget - smoothRef.current) * LERP;
      el.style.setProperty(progressVar, smoothRef.current.toFixed(4));
    };

    const scheduleCompute = () => {
      if (!rafRef.current) {
        rafRef.current = requestAnimationFrame(() => {
          compute();
          tick();
        });
      }
    };

    compute();
    smoothRef.current = lastTarget; // no spring on first paint
    el.style.setProperty(progressVar, smoothRef.current.toFixed(4));

    window.addEventListener("scroll", scheduleCompute, { passive: true });
    window.addEventListener("resize", scheduleCompute, { passive: true });
    return () => {
      window.removeEventListener("scroll", scheduleCompute);
      window.removeEventListener("resize", scheduleCompute);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [pinRef, progressVar]);
}
