"use client";

import { useEffect, useRef } from "react";

/** Per-frame lerp toward the scroll target, normalized to 60fps. */
const OPEN_LERP = 0.14;

/**
 * Drives `--bloom-open` (0 → 1) on the referenced element based on how far
 * the viewport has scrolled through the element's own height — the pinned
 * "the bloom" section. As you scroll the pinned flower stays put while
 * `--bloom-open` rises from 0 (a closed bud, petals scaled to 0.42 and
 * rotated -8°) to 1 (fully open, petals at scale 1, rotation 0°). The
 * section's height in CSS is taller than the viewport on purpose (a sticky
 * inner), so the progress maps cleanly onto a few screens of scroll.
 *
 * The CSS fallback is `var(--bloom-open, 1)` — fully open — so without
 * JavaScript, and under reduced motion (where this hook does nothing), the
 * signature flower simply stands open. The lerp makes it scrubbable without
 * jitter: scrolling fast opens fast, scrolling slow opens slow, and
 * scrolling back up closes the flower again.
 *
 * The scroll handler is passive and only writes to a CSS custom property
 * (no layout work); the rAF loop runs only while the section is on screen
 * and the tab is visible.
 */
export function useScrollProgress<T extends HTMLElement>(disabled: boolean) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || disabled) return;

    el.style.setProperty("--bloom-open", "0");

    let raf = 0;
    let running = false;
    let inView = true;
    let value = 0;
    let last = 0;
    let target = 0;

    const computeTarget = () => {
      const rect = el.getBoundingClientRect();
      // Progress is how far the section's top has traveled from "just
      // entered at the bottom" to "its content has scrolled past". We pin
      // via position: sticky in CSS, so the visible flower stays fixed
      // while this number climbs.
      const total = rect.height - window.innerHeight;
      if (total <= 0) {
        target = 1;
        return;
      }
      // When the section top is at or above the viewport top, progress
      // starts; it completes when the section's bottom reaches the fold.
      const traveled = Math.min(Math.max(-rect.top, 0), total);
      target = traveled / total;
    };

    const step = (now: number) => {
      raf = requestAnimationFrame(step);
      const dt = Math.min(now - last, 48);
      last = now;
      const next = value + (target - value) * OPEN_LERP * (dt / 16.7);
      if (Math.abs(next - value) < 0.0002) return;
      value = next;
      el.style.setProperty("--bloom-open", value.toFixed(4));
    };

    const start = () => {
      if (running) return;
      running = true;
      last = performance.now();
      computeTarget();
      raf = requestAnimationFrame(step);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    const io = new IntersectionObserver((hits) => {
      inView = hits[hits.length - 1].isIntersecting;
      if (inView && !document.hidden) start();
      else stop();
    });
    io.observe(el);

    const onScroll = () => {
      if (inView && !document.hidden) computeTarget();
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    const onVisibility = () => {
      if (document.hidden) stop();
      else if (inView) start();
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      stop();
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      document.removeEventListener("visibilitychange", onVisibility);
      // hand the element back to the CSS fallback (fully open)
      el.style.removeProperty("--bloom-open");
    };
  }, [disabled]);

  return ref;
}
