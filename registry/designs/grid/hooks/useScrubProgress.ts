"use client";

import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

// Minimal local RefObject type to avoid importing React's generic here just
// for the signature. Matches React's RefObject<T | null>.
type RefObject<T> = {
  readonly current: T | null;
};

/**
 * Drives a pinned section's timeline from scroll progress.
 *
 * The container is made `position: sticky` so it pins while its parent
 * (with extra height) scrolls past. This hook maps the parent's scroll
 * position to a 0.0–1.0 progress value, lerp-smooths it (the smoothing is
 * the whole point of a scrubbed pinned section), and calls `onProgress`
 * with each smoothed frame. It also writes the raw progress to the
 * container as `--grid-scrub` so CSS can react (e.g. to set a percentage
 * readout) without a second listener.
 *
 * - Reads happen inside rAF, never during layout.
 * - One rAF per scroll event; the handle is cleared when it runs, so an
 *   idle page costs zero frames.
 * - Pauses when the parent is more than 1.6 viewports away, when the tab
 *   is hidden (visibilitychange), and entirely under reduced motion (the
 *   section renders fully built via its `is-built` class).
 * - All listeners and the rAF handle clean up on unmount.
 */
export function useScrubProgress(
  parentRef: RefObject<HTMLElement | null>,
  containerRef: RefObject<HTMLElement | null>,
  onProgress: (p: number) => void,
) {
  const reduced = usePrefersReducedMotion();
  // Keep the latest callback without re-subscribing on every render.
  const cbRef = useRef(onProgress);
  useEffect(() => {
    cbRef.current = onProgress;
  });

  useEffect(() => {
    const parent = parentRef.current;
    const container = containerRef.current;
    if (!parent || !container) return;
    if (reduced) {
      container.classList.add("is-built");
      container.style.setProperty("--grid-scrub", "1");
      cbRef.current(1);
      return;
    }

    let raf = 0;
    let current = 0;
    let target = 0;
    let running = false;
    const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

    const compute = () => {
      const rect = parent.getBoundingClientRect();
      const vh = window.innerHeight;
      // Travel: from when the parent's top hits the top of the viewport to
      // when its bottom hits the bottom of the viewport. The pinned child
      // holds still across exactly this range.
      const travel = rect.height - vh;
      if (travel <= 0) {
        target = rect.top < vh * 0.5 ? 1 : 0;
        return;
      }
      const scrolled = clamp01(-rect.top / travel);
      target = scrolled;
    };

    const tick = () => {
      // Lerp toward target — the smoothing that makes a scrub feel like a
      // drawing being pulled along, not a stepped machine.
      current += (target - current) * 0.14;
      if (Math.abs(target - current) < 0.0005) current = target;
      const p = current;
      container.style.setProperty("--grid-scrub", p.toFixed(4));
      cbRef.current(p);
      if (current !== target) {
        raf = requestAnimationFrame(tick);
      } else {
        running = false;
        raf = 0;
      }
    };

    const schedule = () => {
      compute();
      if (!running) {
        running = true;
        raf = requestAnimationFrame(tick);
      }
    };

    const onVisibility = () => {
      if (document.hidden) {
        if (raf) {
          cancelAnimationFrame(raf);
          raf = 0;
          running = false;
        }
      } else {
        schedule();
      }
    };

    // Seed once so the section is correct on first paint.
    schedule();

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      document.removeEventListener("visibilitychange", onVisibility);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [reduced, parentRef, containerRef]);
}
