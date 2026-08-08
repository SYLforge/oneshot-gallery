"use client";

import { useEffect, useRef } from "react";

/** Per-frame lerp toward the pointer, normalized to 60fps in the loop. */
const PARALLAX_LERP = 0.045;

/**
 * Drives `--flow-px` / `--flow-py` (each −1…1) on the referenced element —
 * the weightless depth of the hero wordmark over the river. styles.css
 * multiplies these into capped translations at three depths: the far kicker
 * barely moves, the title carries the drift, the nearest glyphs read at
 * arm's length. The lerp is deliberately slower than a tracking parallax
 * (0.045 vs the usual 0.08): the title does not chase the pointer, it
 * settles after it — the same weightless read as drift on water.
 *
 * Fine pointers only — on touch the layers simply rest (the canvas river
 * carries the motion instead), and under reduced motion this hook does
 * nothing; the CSS fallback for both variables is 0.
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
      el.style.setProperty("--flow-px", x.toFixed(4));
      el.style.setProperty("--flow-py", y.toFixed(4));
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
      // Guard: a zero-size rect would divide to Infinity; bail to neutral.
      if (r.width < 1 || r.height < 1) return;
      const nx = ((ev.clientX - r.left) / r.width) * 2 - 1;
      const ny = ((ev.clientY - r.top) / r.height) * 2 - 1;
      tx = Number.isFinite(nx) ? Math.max(-1, Math.min(1, nx)) : 0;
      ty = Number.isFinite(ny) ? Math.max(-1, Math.min(1, ny)) : 0;
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
      el.style.removeProperty("--flow-px");
      el.style.removeProperty("--flow-py");
    };
  }, [disabled]);

  return ref;
}
