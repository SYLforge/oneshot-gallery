"use client";

import { useEffect, useRef } from "react";

/** Per-frame lerp toward scroll progress, normalized to 60fps. */
const DESCENT_LERP = 0.08;

/**
 * Drives `--drm-descent` (0 → 1) on the pinned element as the visitor scrolls
 * through it — the signature moment: a pinned sky that slowly dissolves from
 * pale cloud-white into deep indigo as you "descend" toward sleep. One
 * scroll-progress value drives every visual: the cloud layers fade out, the
 * sky color lerps through its stops, the star pinpoints fade in. The CSS
 * fallback is `var(--drm-descent, 0)` — fully awake, day sky — so without
 * JavaScript, and under reduced motion (where this hook does nothing), the
 * section simply shows its day composition.
 *
 * `progress` here is the page's scroll progress *through* the pinned region,
 * not the whole document: 0 when the section's top reaches the top of the
 * viewport, 1 when its bottom is one viewport-height away. The element is
 * expected to be tall (≥ 200vh) and made `position: sticky` by styles.css.
 */
export function useScrollDescent<T extends HTMLElement>(disabled: boolean) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || disabled) return;

    el.style.setProperty("--drm-descent", "0");

    let raf = 0;
    let running = false;
    let inView = false;
    let value = 0;
    let last = 0;

    const computeProgress = (): number => {
      const rect = el.getBoundingClientRect();
      // total scrollable distance inside the pinned span
      const span = Math.max(1, rect.height - window.innerHeight);
      // how far the section's top has scrolled above the viewport top, in [0, span]
      const traveled = Math.min(Math.max(-rect.top, 0), span);
      return traveled / span;
    };

    const step = (now: number) => {
      raf = requestAnimationFrame(step);
      const dt = Math.min(now - last, 48);
      last = now;
      const target = computeProgress();
      const next = value + (target - value) * DESCENT_LERP * (dt / 16.7);
      if (Math.abs(next - value) < 0.0002) return;
      value = next;
      el.style.setProperty("--drm-descent", value.toFixed(4));
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

    const io = new IntersectionObserver(
      (hits) => {
        inView = hits[hits.length - 1].isIntersecting;
        if (inView && !document.hidden) start();
        else stop();
      },
      // generous margin: keep scrubbing a little before/after the pin
      { rootMargin: "40px 0px 40px 0px" },
    );
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
      el.style.removeProperty("--drm-descent");
    };
  }, [disabled]);

  return ref;
}
