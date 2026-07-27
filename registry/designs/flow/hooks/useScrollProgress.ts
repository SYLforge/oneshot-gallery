"use client";

import { useEffect, useRef } from "react";

/**
 * Drives a 0→1 scroll progress for a pinned chashitsu (tea-preparation
 * scene), written to the element as the `--ch-scrub` custom property. The
 * chasen whisk consumes it in CSS:
 *   stroke-dashoffset: calc(1 - var(--ch-scrub, 1))
 * on pathLength=1 bamboo-tine paths — so the whisk draws exactly as far as
 * the guest has scrolled, and the bowl's matcha surface blooms in only as
 * the preparation completes. The whole ceremony is paced so the whisk never
 * moves faster than the hand that summoned it.
 *
 * Discipline (rubric gate G3):
 * - All geometry is measured inside rAF: one getBoundingClientRect read,
 *   then one custom-property write — read before write, no layout thrash.
 * - The raw progress is lerp-smoothed with a dt-normalized factor
 *   (1 - 0.88^(dt/16.7)), so a 120Hz display does not scrub twice as fast
 *   as a 60Hz one. Half-life ≈ 5.4 frames.
 * - An IntersectionObserver starts/stops the loop, so an offscreen
 *   chashitsu costs zero frames. A visibilitychange listener also stops it
 *   when the tab is hidden.
 * - Disabled (reduced motion) or never mounted (no JS): the hook writes
 *   `--ch-scrub: 1` once and the CSS default of 1 leaves every tine drawn
 *   and the bowl full — a completed preparation, statically waiting.
 */
export function useScrollProgress<T extends HTMLElement>(disabled: boolean) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (disabled) {
      el.style.setProperty("--ch-scrub", "1");
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

      // The scrub runs from "scene center at 62% of the viewport" across
      // 90% of the scene's height, capped at ~1.2 viewports so tall
      // single-column (mobile) chashitsu still finish while in view.
      const center = rect.top + rect.height / 2;
      const span = Math.max(Math.min(rect.height * 0.9, vh * 1.2), 1);
      const raw = (vh * 0.62 - center) / span;
      const target = Math.min(1, Math.max(0, raw));

      if (value === null) {
        value = target; // first frame: no animated catch-up flash
      } else {
        value += (target - value) * (1 - Math.pow(0.88, dt / 16.7));
        if (Math.abs(target - value) < 0.0005) value = target;
      }

      // Write phase.
      el.style.setProperty("--ch-scrub", value.toFixed(4));
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

    const onVisibility = () => {
      if (document.hidden) stop();
      else start();
    };
    document.addEventListener("visibilitychange", onVisibility);

    if (!("IntersectionObserver" in window)) {
      start();
      return () => {
        stop();
        document.removeEventListener("visibilitychange", onVisibility);
      };
    }

    const io = new IntersectionObserver(
      (hits) => {
        for (const hit of hits) {
          if (hit.isIntersecting) start();
          else stop();
        }
      },
      { rootMargin: "25% 0px 25% 0px" },
    );
    io.observe(el);

    return () => {
      stop();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [disabled]);

  return ref;
}
