"use client";

import { useEffect, useRef } from "react";

/**
 * Drives a 0→1 scroll progress for a pinned essay spread, written to the
 * element as the `--yb-scrub` custom property. The tipped-in figure plate
 * consumes it in CSS: `stroke-dashoffset: calc(1 - var(--yb-scrub))` on
 * pathLength=1 strokes, so the ink draws exactly as far as the reader has
 * scrolled — and no further.
 *
 * Discipline:
 * - All geometry is measured inside rAF (one getBoundingClientRect read,
 *   then one custom-property write — read before write, no layout thrash).
 * - The raw progress is lerp-smoothed with a dt-normalized factor so a
 *   120Hz display doesn't scrub twice as fast as a 60Hz one.
 * - An IntersectionObserver starts/stops the loop, so an offscreen spread
 *   costs zero frames.
 * - Disabled (reduced motion) or never mounted (no JS): the CSS fallback
 *   `var(--yb-scrub, 1)` and the root default of 1 leave every stroke
 *   fully drawn — a finished plate, statically tipped in.
 */
export function useScrollScrub<T extends HTMLElement>(disabled: boolean) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (disabled) {
      el.style.setProperty("--yb-scrub", "1");
      return;
    }

    let raf = 0;
    let last = 0;
    let value: number | null = null;

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(Math.max(now - last, 1), 48);
      last = now;

      // Read phase: one rect, one viewport height.
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;

      // The scrub runs from "spread top at 70% of the viewport" across
      // 85% of the spread's height, capped at ~1.1 viewports so tall
      // single-column (mobile) spreads still finish while the plate is
      // in view.
      const span = Math.max(Math.min(rect.height * 0.85, vh * 1.1), 1);
      const raw = (vh * 0.7 - rect.top) / span;
      const target = Math.min(1, Math.max(0, raw));

      if (value === null) {
        value = target; // first frame: no animated catch-up flash
      } else {
        value += (target - value) * (1 - Math.pow(0.86, dt / 16.7));
        if (Math.abs(target - value) < 0.0005) value = target;
      }

      // Write phase.
      el.style.setProperty("--yb-scrub", value.toFixed(4));
    };

    const start = () => {
      if (raf) return;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      if (!raf) return;
      cancelAnimationFrame(raf);
      raf = 0;
    };

    if (!("IntersectionObserver" in window)) {
      start();
      return stop;
    }

    const io = new IntersectionObserver(
      (hits) => {
        for (const hit of hits) {
          if (hit.isIntersecting) start();
          else stop();
        }
      },
      { rootMargin: "30% 0px 30% 0px" },
    );
    io.observe(el);

    return () => {
      stop();
      io.disconnect();
    };
  }, [disabled]);

  return ref;
}
