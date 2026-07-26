"use client";

import { useEffect, useRef } from "react";

/**
 * Drives a 0→1 scroll-progress for a section, written to the element as a
 * `--st-progress` custom property. Unlike useStretchScrub (which maps a
 * range onto the pinned pose-sequence), this is the general-purpose
 * page-relative progress used by the long clay pose-divider that grows
 * across the whole sequence.
 *
 * Discipline:
 * - One getBoundingClientRect read, one custom-property write per frame
 *   (read before write, no layout thrash).
 * - Raw progress is lerp-smoothed with a dt-normalized factor (slower than
 *   the default — calm catch-up) so 120Hz and 60Hz scrub at the same rate.
 * - An IntersectionObserver starts/stops the loop; offscreen = zero frames.
 * - Disabled (reduced motion) or never mounted (no JS): the element keeps
 *   its CSS default `var(--st-progress, 1)` — every driven surface is
 *   already at its finished, fully-stretched end state.
 */
export function useScrollProgress<T extends HTMLElement>(disabled: boolean) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (disabled) {
      el.style.setProperty("--st-progress", "1");
      return;
    }

    let raf = 0;
    let last = 0;
    let value: number | null = null;

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(Math.max(now - last, 1), 48);
      last = now;

      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;

      // Progress begins when the section top reaches 80% of the viewport
      // and completes when its bottom leaves 20% — a generous, calm span.
      const span = Math.max(rect.height + vh * 0.6, 1);
      const raw = (vh * 0.8 - rect.top) / span;
      const target = Math.min(1, Math.max(0, raw));

      if (value === null) {
        value = target;
      } else {
        value += (target - value) * (1 - Math.pow(0.88, dt / 16.7));
        if (Math.abs(target - value) < 0.0005) value = target;
      }

      el.style.setProperty("--st-progress", value.toFixed(4));
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
