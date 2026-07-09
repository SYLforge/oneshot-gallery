"use client";

import { useEffect, useRef } from "react";

/**
 * Capped, lerped pointer parallax for the hanji layers.
 *
 * Writes two unitless custom properties (--giwa-px / --giwa-py, each in
 * [-1, 1]) onto the attached element; styles.css multiplies them into small
 * translate3d offsets (≤ 8px), so the cap lives in CSS next to the layers.
 *
 * Self-disabling: does nothing under reduced motion, on coarse pointers
 * (touch gets the calm, unmoving paper), or while `disabled` is true.
 * The rAF loop only runs while the pointer is actually settling — it parks
 * itself once the lerp converges and the pointer has left.
 */
export function usePointerParallax<T extends HTMLElement>(disabled: boolean) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || disabled) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    let raf = 0;
    let running = false;
    let inside = false;
    let targetX = 0;
    let targetY = 0;
    let curX = 0;
    let curY = 0;
    let last = 0;

    const apply = () => {
      el.style.setProperty("--giwa-px", curX.toFixed(4));
      el.style.setProperty("--giwa-py", curY.toFixed(4));
    };

    const loop = (now: number) => {
      const dt = Math.min(now - last, 48) / 16.7; // 60fps-normalized, clamped
      last = now;
      const k = 1 - Math.pow(1 - 0.09, dt); // lerp 0.09/frame at 60fps
      curX += (targetX - curX) * k;
      curY += (targetY - curY) * k;
      apply();
      const settled =
        Math.abs(targetX - curX) < 0.002 && Math.abs(targetY - curY) < 0.002;
      if (settled && !inside) {
        curX = targetX;
        curY = targetY;
        apply();
        running = false;
        return;
      }
      raf = window.requestAnimationFrame(loop);
    };

    const wake = () => {
      if (running) return;
      running = true;
      last = performance.now();
      raf = window.requestAnimationFrame(loop);
    };

    const onMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      inside = true;
      targetX = Math.min(1, Math.max(-1, ((e.clientX - rect.left) / rect.width) * 2 - 1));
      targetY = Math.min(1, Math.max(-1, ((e.clientY - rect.top) / rect.height) * 2 - 1));
      wake();
    };

    const onLeave = () => {
      inside = false;
      targetX = 0;
      targetY = 0;
      wake();
    };

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      window.cancelAnimationFrame(raf);
      el.style.removeProperty("--giwa-px");
      el.style.removeProperty("--giwa-py");
    };
  }, [disabled]);

  return ref;
}
