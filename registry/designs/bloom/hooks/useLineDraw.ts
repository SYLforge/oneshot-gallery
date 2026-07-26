"use client";

import { useEffect, useRef } from "react";

/** How much of the drawing finishes on its own, before scroll joins. */
const INTRO_REACH = 0.7;
/** How long the intro draw takes to get there. */
const INTRO_MS = 2400;
/** Scroll finishes the drawing within the first ~0.9 viewport. */
const SCROLL_SPAN = 0.9;
/** Per-frame lerp toward the target, normalized to 60fps in the loop. */
const DRAW_LERP = 0.12;

/**
 * Drives `--bloom-draw` (0 → 1) on the referenced element — the shared
 * drawing clock for one botanical illustration. Every stroke in styles.css
 * converts this one variable into its own stroke-dashoffset window via its
 * own `--d0`/`--d1` (draw-start, draw-end along the clock), so a single
 * property write per frame draws the whole illustration in order: stem
 * first, then branches, then leaves, then buds last.
 *
 * The CSS fallback is `var(--bloom-draw, 1)` — fully drawn — so without
 * JavaScript, and under reduced motion (where this hook does nothing), the
 * illustration simply stands complete. With motion allowed, the lines draw
 * to INTRO_REACH on their own and scroll raises the rest; scrolling back
 * lets the crown recede, which is the point: a botanical drawing keeps your
 * pace.
 *
 * The rAF loop only runs while the element is near the viewport and the
 * tab is visible.
 */
export function useLineDraw<T extends HTMLElement>(disabled: boolean) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || disabled) return;

    el.style.setProperty("--bloom-draw", "0");

    let raf = 0;
    let running = false;
    let inView = true;
    let value = 0;
    let last = 0;
    const born = performance.now();
    const easeOut = (u: number) => 1 - (1 - u) ** 3;

    const step = (now: number) => {
      raf = requestAnimationFrame(step);
      const dt = Math.min(now - last, 48);
      last = now;
      const intro =
        easeOut(Math.min((now - born) / INTRO_MS, 1)) * INTRO_REACH;
      const scroll = Math.min(
        window.scrollY / (window.innerHeight * SCROLL_SPAN),
        1,
      );
      const target = Math.min(1, intro + (1 - INTRO_REACH) * scroll);
      const next = value + (target - value) * DRAW_LERP * (dt / 16.7);
      if (Math.abs(next - value) < 0.0002) return;
      value = next;
      el.style.setProperty("--bloom-draw", value.toFixed(4));
    };

    const start = () => {
      if (running) return;
      running = true;
      last = performance.now();
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

    const onVisibility = () => {
      if (document.hidden) stop();
      else if (inView) start();
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      stop();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      // hand the element back to the CSS fallback (fully drawn)
      el.style.removeProperty("--bloom-draw");
    };
  }, [disabled]);

  return ref;
}
