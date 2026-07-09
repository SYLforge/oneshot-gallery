"use client";

import { useEffect, useRef } from "react";

export type ScrollVelocitySample = {
  /** Signed scroll velocity in px/ms (positive = scrolling down), clamped. */
  v: number;
  /** performance.now() timestamp of the sample. */
  t: number;
};

/** Instantaneous velocity clamp — flicks beyond this read the same. */
const V_CLAMP = 6;

/**
 * Tracks raw scroll velocity into a ref, without ever re-rendering React.
 *
 * The hook stays deliberately dumb: it records the *instantaneous* velocity
 * and its timestamp on every scroll event, and nothing else. Smoothing (the
 * lerp that makes the smoke bend rather than jerk) belongs to the consumer's
 * rAF loop, where it can be frame-rate normalized — see SmokeCanvas, which
 * treats a sample older than ~140ms as "the page has stopped".
 */
export function useScrollVelocity() {
  const sample = useRef<ScrollVelocitySample>({ v: 0, t: 0 });

  useEffect(() => {
    let lastY = window.scrollY;
    let lastT = performance.now();

    const onScroll = () => {
      const now = performance.now();
      const dt = now - lastT;
      const dy = window.scrollY - lastY;
      lastY = window.scrollY;
      lastT = now;
      if (dt <= 0) return;
      const v = dy / Math.max(dt, 4);
      sample.current = {
        v: v > V_CLAMP ? V_CLAMP : v < -V_CLAMP ? -V_CLAMP : v,
        t: now,
      };
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return sample;
}
