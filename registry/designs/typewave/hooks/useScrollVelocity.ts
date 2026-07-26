"use client";

import { useEffect, useRef } from "react";

/**
 * The kinetic-typography core. Measures the instantaneous absolute scroll
 * velocity (px / ms), smooths it with an exponential decay, and exposes it
 * two ways:
 *
 *   - `ref.current` — the smoothed velocity (0 → ~1.6), updated every frame
 *     while scrolling and decaying toward 0 at rest. Read this inside a rAF
 *     loop to drive per-glyph scaleX without triggering a React render per
 *     frame. This is the path the wordmark's amplitude stretch uses.
 *   - the returned number — a coarse, rAF-throttled snapshot used only where
 *     a component genuinely needs to re-render on velocity (e.g. an active
 *     state). The wordmark does NOT use this path.
 *
 * `maxOut` is the velocity above which the signal saturates at 1.0, so the
 * consumer can treat the value as a normalized amplitude in [0, 1]. The
 * default (2.2 px/ms ≈ a firm scroll-wheel flick) is tuned so a casual wheel
 * tick reads ~0.5 and a hard flick reads 1.0 — the letters should react to
 * *effort*, not to every pixel.
 *
 * When `enabled` is false (reduced motion) the ref stays at 0 and no
 * listeners are attached; the type rests at its static final state.
 */
export function useScrollVelocity(enabled: boolean, maxOut = 2.2) {
  const ref = useRef(0);

  useEffect(() => {
    if (!enabled) {
      ref.current = 0;
      return;
    }

    let raf = 0;
    let lastY = window.scrollY;
    let lastT = 0; // 0 = "not started"; first scroll primes it
    let raw = 0; // instantaneous |v| in px/ms
    let last = performance.now();

    const onScroll = () => {
      const now = performance.now();
      const dy = window.scrollY - lastY;
      const dt = now - lastT;
      lastY = window.scrollY;
      lastT = now;
      if (dt <= 0) return;
      // |dy/dt| in px/ms — the magnitude is the amplitude
      raw = Math.min(Math.abs(dy / dt) / maxOut, 1.6);
      if (!raf) raf = requestAnimationFrame(tick);
    };

    const tick = () => {
      raf = 0;
      const now = performance.now();
      const k = Math.min((now - last) / 16.7, 3); // frame-rate normalized
      last = now;
      // exponential decay toward the new sample, then toward 0 at rest.
      // 0.14 approach + an idle decay so the stretch *releases* like a note.
      const target = raw;
      ref.current += (target - ref.current) * 0.14 * k;
      raw *= 0.86; // the sample itself cools — a flick's energy bleeds off
      if (ref.current > 0.001 || raw > 0.001) {
        raf = requestAnimationFrame(tick);
      } else {
        ref.current = 0;
        raw = 0;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
      ref.current = 0;
    };
  }, [enabled, maxOut]);

  return ref;
}
