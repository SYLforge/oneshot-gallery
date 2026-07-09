"use client";

import { useEffect, useRef } from "react";

/** The intro opens the wordmark to this fraction of full air on its own. */
const INTRO_FLOOR = 0.45;
/** How long the intro takes to reach the floor. */
const INTRO_MS = 2600;
/** Scroll completes the breath within the first ~0.7 viewport. */
const SCROLL_SPAN = 0.7;
/** Per-frame lerp toward the target, normalized to 60fps in the loop. */
const BREATH_LERP = 0.055;

/**
 * Drives `--ondo-breath` (0 → 1) on the referenced element — the hero
 * wordmark's letter-spacing "breath". The CSS default is 1 (fully airy), so
 * without JavaScript, and under reduced motion, the wordmark simply rests
 * open. With motion allowed, the value starts at 0 (tight, 0.02em apparent
 * tracking), eases to INTRO_FLOOR on its own, and scroll takes it the rest
 * of the way — lerped every frame so it never snaps, capped at 1.
 *
 * The rAF loop only runs while the element is near the viewport and the tab
 * is visible.
 */
export function useBreath<T extends HTMLElement>(disabled: boolean) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (disabled) {
      // Reduced motion: settle airy, no animation.
      el.style.setProperty("--ondo-breath", "1");
      return;
    }

    el.style.setProperty("--ondo-breath", "0");

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
        easeOut(Math.min((now - born) / INTRO_MS, 1)) * INTRO_FLOOR;
      const scroll = Math.min(
        window.scrollY / (window.innerHeight * SCROLL_SPAN),
        1,
      );
      const target = Math.max(intro, scroll);
      value += (target - value) * BREATH_LERP * (dt / 16.7);
      if (value > 1) value = 1;
      el.style.setProperty("--ondo-breath", value.toFixed(4));
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
    };
  }, [disabled]);

  return ref;
}
