"use client";

import { useEffect, useRef } from "react";

/** How much of the plant grows on its own, before any scroll. */
const INTRO_REACH = 0.74;
/** How long the intro growth takes to get there. */
const INTRO_MS = 5200;
/** Scroll finishes the crown within the first ~0.85 viewport. */
const SCROLL_SPAN = 0.85;
/** Per-frame lerp toward the target, normalized to 60fps in the loop. */
const GROW_LERP = 0.06;

/**
 * Drives `--sup-grow` (0 → 1) on the referenced element — the L-system
 * plant's shared growth clock. Every branch in styles.css converts this one
 * variable into its own stroke-dashoffset window, and every leaf into an
 * opacity/scale window, so a single property write per frame grows the
 * whole plant in order, base first, crown last.
 *
 * The CSS fallback is `var(--sup-grow, 1)` — fully grown — so without
 * JavaScript, and under reduced motion (where this hook does nothing), the
 * plant simply stands complete. With motion allowed, growth eases to
 * INTRO_REACH on its own and scroll raises the rest; scrolling back lets
 * the crown recede a little, which is the point: the forest keeps your pace.
 *
 * The rAF loop only runs while the element is near the viewport and the
 * tab is visible.
 */
export function useGrowth<T extends HTMLElement>(disabled: boolean) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || disabled) return;

    el.style.setProperty("--sup-grow", "0");

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
      const next = value + (target - value) * GROW_LERP * (dt / 16.7);
      if (Math.abs(next - value) < 0.0002) return;
      value = next;
      el.style.setProperty("--sup-grow", value.toFixed(4));
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
      // hand the element back to the CSS fallback (fully grown)
      el.style.removeProperty("--sup-grow");
    };
  }, [disabled]);

  return ref;
}
