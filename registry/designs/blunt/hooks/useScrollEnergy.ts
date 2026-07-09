"use client";

import { useEffect, useRef, type RefObject } from "react";

export type ScrollEnergy = {
  /** 1 = last scroll moved down, -1 = up. Starts at 1 so tickers drift. */
  dir: 1 | -1;
  /** Smoothed |scroll speed| in px/ms, capped at 4. Consumers decay it. */
  vel: number;
};

/**
 * Tracks scroll direction and a smoothed scroll velocity in a mutable ref —
 * no React state, no re-renders. Consumers read `ref.current` inside their
 * own rAF loops and are responsible for decaying `vel` toward zero
 * (the hook only pumps energy in; the marquee bleeds it out).
 */
export function useScrollEnergy(): RefObject<ScrollEnergy> {
  const ref = useRef<ScrollEnergy>({ dir: 1, vel: 0 });

  useEffect(() => {
    let lastY = window.scrollY;
    let lastT = performance.now();

    const onScroll = () => {
      const y = window.scrollY;
      const t = performance.now();
      const dy = y - lastY;
      const dt = Math.max(1, t - lastT);
      if (dy !== 0) ref.current.dir = dy > 0 ? 1 : -1;
      const v = Math.min(4, Math.abs(dy) / dt);
      ref.current.vel = ref.current.vel * 0.6 + v * 0.4;
      lastY = y;
      lastT = t;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return ref;
}
