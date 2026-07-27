"use client";

import { useEffect, useRef } from "react";

/** Frame throttle (~64fps). */
const FRAME_MS = 15.5;
/** Pointer lerp, normalized to 60fps inside the loop. */
const FOIL_LERP = 0.06;

/**
 * Drives `--chrome-px` and `--chrome-py` (both -1..1, the pointer offset
 * from the element center) on the referenced element — the pointer-parallax
 * source. styles.css reads them to shift the holographic foil layers'
 * gradient origins (three layers, ±18°/±11°/±6°), so the rainbow sheen
 * drifts with your hand and the metal looks lit, not printed.
 *
 * The CSS default is 0 (foil centered), so without JavaScript, under
 * reduced motion, and on touch the foil simply rests in its neutral
 * rainbow state. The rAF loop only runs while the element is near the
 * viewport and the tab is visible; on touch the foil is static (no
 * hover-only affordance — the chrome shader self-ripples instead).
 */
export function useFoilParallax<T extends HTMLElement>(disabled: boolean) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (disabled) return;

    const fine = window.matchMedia(
      "(hover: hover) and (pointer: fine)",
    ).matches;
    if (!fine) return; // touch: foil rests; the chrome shader carries motion

    let raf = 0;
    let running = false;
    let inView = false;
    let last = 0;
    let px = 0;
    let py = 0;
    let tx = 0;
    let ty = 0;

    const step = (now: number) => {
      raf = requestAnimationFrame(step);
      if (now - last < FRAME_MS) return;
      const dt = Math.min(now - last, 48);
      last = now;
      const k = (dt / 16.7) * FOIL_LERP;
      px += (tx - px) * k;
      py += (ty - py) * k;
      el.style.setProperty("--chrome-px", px.toFixed(4));
      el.style.setProperty("--chrome-py", py.toFixed(4));
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
      const rect = el.getBoundingClientRect();
      if (rect.width < 1) return;
      tx = ((ev.clientX - rect.left) / rect.width - 0.5) * 2;
      ty = ((ev.clientY - rect.top) / rect.height - 0.5) * 2;
    };
    const onLeave = () => {
      tx = 0;
      ty = 0;
    };

    const onVisibility = () => {
      if (document.hidden) stop();
      else if (inView) start();
    };

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);

    const io = new IntersectionObserver(
      (hits) => {
        inView = hits[hits.length - 1].isIntersecting;
        if (inView && !document.hidden) start();
        else stop();
      },
      { rootMargin: "120px 0px" },
    );
    io.observe(el);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      stop();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, [disabled]);

  return ref;
}
