"use client";

import { useEffect, useRef } from "react";

/** Per-frame lerp toward the pointer, normalized to 60fps in the loop. */
const PARALLAX_LERP = 0.045;

/**
 * Drives `--drm-px` / `--drm-py` (each −1…1) on the referenced element — the
 * weightless depth of the cloud sky. styles.css multiplies these into
 * capped translations at three depths: the far sky barely moves, the middle
 * layer carries the drift, the nearest puffs read at arm's length. The lerp
 * is deliberately slower than a tracking parallax (0.045 vs the usual 0.08):
 * clouds do not chase the pointer, they settle after it.
 *
 * Fine pointers only — on touch the layers simply rest (the ambient cloud-bob
 * animation carries the life instead), and under reduced motion this hook
 * does nothing; the CSS fallback for both variables is 0.
 */
export function usePointerParallax<T extends HTMLElement>(disabled: boolean) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || disabled) return;
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
      const k = PARALLAX_LERP * (dt / 16.7);
      x += (tx - x) * k;
      y += (ty - y) * k;
      el.style.setProperty("--drm-px", x.toFixed(4));
      el.style.setProperty("--drm-py", y.toFixed(4));
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
      el.style.removeProperty("--drm-px");
      el.style.removeProperty("--drm-py");
    };
  }, [disabled]);

  return ref;
}
