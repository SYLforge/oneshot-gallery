"use client";

import { useEffect, useRef } from "react";

/** Per-frame lerp toward the pointer, normalized to 60fps in the loop. */
const DRIFT_LERP = 0.06;

/**
 * Drives `--mp-x` / `--mp-y` (each −1…1) on the referenced element — the
 * shape layers' pointer drift. styles.css multiplies these into small,
 * capped, depth-scaled translations: nearer shapes drift more, far ones
 * barely. The lerp is gentle so the shapes feel like they are catching up
 * to the pointer, not tracking it 1:1 — a parallax, not a pointer-follow.
 *
 * Fine pointers only — on touch the shapes simply bob on their idle CSS
 * animation (life comes from there instead), and under reduced motion this
 * hook does nothing; the CSS fallback for both variables is 0, so shapes
 * sit at their scattered base positions.
 *
 * The rAF loop pauses when the element is offscreen (IntersectionObserver)
 * and when the tab is hidden.
 */
export function usePointerParallax<T extends HTMLElement>(disabled: boolean) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || disabled) return;
    // Touch devices and coarse pointers get the idle-bob fallback only.
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      return;
    }

    let raf = 0;
    let running = false;
    let inView = true;
    let x = 0;
    let y = 0;
    let tx = 0;
    let ty = 0;
    let last = 0;

    const step = (now: number) => {
      raf = requestAnimationFrame(step);
      const dt = Math.min(now - last, 48);
      last = now;
      const k = DRIFT_LERP * (dt / 16.7);
      x += (tx - x) * k;
      y += (ty - y) * k;
      el.style.setProperty("--mp-x", x.toFixed(4));
      el.style.setProperty("--mp-y", y.toFixed(4));
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

    const onMove = (ev: PointerEvent) => {
      if (ev.pointerType !== "mouse" && ev.pointerType !== "pen") return;
      const r = el.getBoundingClientRect();
      tx = Math.max(-1, Math.min(1, ((ev.clientX - r.left) / r.width) * 2 - 1));
      ty = Math.max(-1, Math.min(1, ((ev.clientY - r.top) / r.height) * 2 - 1));
    };
    const onLeave = () => {
      tx = 0;
      ty = 0;
    };
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);

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
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", onVisibility);
      el.style.removeProperty("--mp-x");
      el.style.removeProperty("--mp-y");
    };
  }, [disabled]);

  return ref;
}
