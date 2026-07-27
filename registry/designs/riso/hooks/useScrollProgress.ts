"use client";

import { useEffect, useRef } from "react";

/** Per-frame lerp toward the scroll target, normalized to 60fps. */
const PRESS_LERP = 0.12;

/**
 * Drives `--riso-press` (0 → 1) on the referenced element based on how far
 * the viewport has scrolled through the element's own height — the pinned
 * "the press" section. The section is taller than the viewport on purpose
 * (a sticky inner), so the progress maps onto a few screens of scroll while
 * the overprint builder stays pinned. As `--riso-press` rises, three
 * spot-color layers drop onto the sheet in phases: pink (0→0.33), blue
 * (0.33→0.66), yellow (0.66→1), each multiplying onto the last like drum
 * passes through a risograph.
 *
 * The CSS fallback is `var(--riso-press, 1)` — all three layers down — so
 * without JavaScript, and under reduced motion (where this hook does
 * nothing), the signature overprint simply stands printed in full. The lerp
 * makes the build scrubbable without jitter: scrolling fast lays the ink
 * fast, scrolling back up lifts it off again.
 *
 * The scroll handler is passive and only writes one CSS custom property (no
 * layout work); the rAF loop runs only while the section is on screen and
 * the tab is visible.
 */
export function useScrollProgress<T extends HTMLElement>(disabled: boolean) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || disabled) return;

    el.style.setProperty("--riso-press", "0");

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
      // via position: sticky in CSS, so the visible press stays fixed while
      // this number climbs.
      const total = rect.height - window.innerHeight;
      if (total <= 0) {
        target = 1;
        return;
      }
      const traveled = Math.min(Math.max(-rect.top, 0), total);
      target = traveled / total;
    };

    const step = (now: number) => {
      raf = requestAnimationFrame(step);
      const dt = Math.min(now - last, 48);
      last = now;
      const next = value + (target - value) * PRESS_LERP * (dt / 16.7);
      if (Math.abs(next - value) < 0.0002) return;
      value = next;
      el.style.setProperty("--riso-press", value.toFixed(4));
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
      // hand the element back to the CSS fallback (fully printed)
      el.style.removeProperty("--riso-press");
    };
  }, [disabled]);

  return ref;
}
