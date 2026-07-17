"use client";

import { useEffect, useRef } from "react";

export type ScrollSample = {
  /** Raw scroll-y in CSS px. */
  y: number;
  /** Signed instantaneous velocity in px/ms (positive = down), clamped. */
  v: number;
  /** performance.now() timestamp of the last sample. */
  t: number;
};

/** Instantaneous velocity clamp — flicks beyond this read the same. */
const V_CLAMP = 6;

/**
 * Records scroll position and velocity into a ref, never re-rendering React.
 *
 * The hook is deliberately dumb: it samples raw `scrollY` + a clamped px/ms
 * velocity + its timestamp on every scroll event. Consumers (the landscape
 * canvas, the pinned layer parallax) read the ref inside their own rAF loops,
 * where smoothing and frame-rate normalization belong. A sample older than
 * ~140ms reads as "the scroll has stopped" — see LandscapeCanvas.
 */
export function useScrollProgress() {
  const sample = useRef<ScrollSample>({ y: 0, v: 0, t: 0 });

  useEffect(() => {
    let lastY = window.scrollY;
    let lastT = performance.now();
    sample.current = { y: lastY, v: 0, t: lastT };

    const onScroll = () => {
      const now = performance.now();
      const dt = now - lastT;
      const dy = window.scrollY - lastY;
      lastY = window.scrollY;
      lastT = now;
      if (dt <= 0) return;
      const v = dy / Math.max(dt, 4);
      sample.current = {
        y: window.scrollY,
        v: v > V_CLAMP ? V_CLAMP : v < -V_CLAMP ? -V_CLAMP : v,
        t: now,
      };
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    // Recalibrate on resize — scroll positions stay valid, but a layout
    // shift can land the viewport mid-section with no scroll firing.
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return sample;
}
