"use client";

import { useEffect, useRef, type RefObject } from "react";

/**
 * Drives `onProgress` with the 0→1 progress of a tall section scrolling
 * through the viewport: 0 while the section top is at or below the top of
 * the screen, 1 once its bottom has reached the bottom — the classic
 * "sticky stage inside an over-tall section" scrub window.
 *
 * rAF-throttled: scroll/resize/visibility only schedule a frame; the single
 * getBoundingClientRect read and all style writes happen together inside
 * that frame, so the scrub never interleaves layout reads and writes.
 *
 * Offscreen pause: an IntersectionObserver keeps the rAF loop parked unless
 * the section is actually intersecting the viewport (rubric gate G3). Tab
 * hidden via visibilitychange also parks it.
 *
 * When `enabled` is false (reduced motion) nothing is measured and nothing
 * ever fires — the DOM stays in its static, server-rendered (assembled)
 * state.
 */
export function useScrollProgress<T extends HTMLElement>(
  targetRef: RefObject<T | null>,
  onProgress: (p: number) => void,
  enabled: boolean,
): void {
  const callbackRef = useRef(onProgress);

  useEffect(() => {
    callbackRef.current = onProgress;
  });

  useEffect(() => {
    if (!enabled) return;
    const el = targetRef.current;
    if (!el) return;

    let raf = 0;
    let scheduled = false;
    let visible = false;

    const measure = () => {
      scheduled = false;
      const rect = el.getBoundingClientRect();
      const range = rect.height - window.innerHeight;
      if (range <= 0) {
        callbackRef.current(rect.top <= 0 ? 1 : 0);
        return;
      }
      const p = Math.min(1, Math.max(0, -rect.top / range));
      callbackRef.current(p);
    };

    const schedule = () => {
      if (!visible) return; // parked while offscreen
      if (document.hidden) return; // parked while tab hidden
      if (scheduled) return;
      scheduled = true;
      raf = window.requestAnimationFrame(measure);
    };

    // Park the loop unless the section is actually on screen.
    const io = new IntersectionObserver(
      (entries) => {
        visible = entries[0]?.isIntersecting ?? false;
        if (visible) schedule();
      },
      { rootMargin: "100px 0px" },
    );
    io.observe(el);

    const onVisibility = () => {
      if (!document.hidden) schedule();
    };

    schedule(); // settle the initial position without waiting for a scroll
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      document.removeEventListener("visibilitychange", onVisibility);
      io.disconnect();
    };
  }, [enabled, targetRef]);
}
