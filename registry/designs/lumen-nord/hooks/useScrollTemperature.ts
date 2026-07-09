"use client";

import { useEffect, type RefObject } from "react";

/** Aurora green — where the page ends (deep night). */
const GREEN: readonly [number, number, number] = [111, 242, 195];
/** Magenta veil — where the page begins (dusk). */
const MAGENTA: readonly [number, number, number] = [194, 107, 242];

function lerpChannel(a: number, b: number, t: number): number {
  return Math.round(a + (b - a) * t);
}

/**
 * Drives the page's color temperature from scroll progress.
 *
 * Writes three custom properties on the entry root, rAF-throttled from a
 * passive scroll listener:
 *   --lumen-temp        raw 0→1 progress (0 = dusk at the top, 1 = deep night)
 *   --lumen-blend       magenta→green interpolated accent, as rgb()
 *   --lumen-blend-soft  the same hue at 35% alpha, for borders and edges
 *
 * The aurora shader reads the same scroll position on the GPU side
 * (amplified — see AuroraCanvas.TEMP_GAIN), so canvas and CSS agree on what
 * time of night it is. This is direct input→style manipulation, not an
 * autonomous animation, so it stays live under prefers-reduced-motion.
 */
export function useScrollTemperature(
  rootRef: RefObject<HTMLElement | null>,
): void {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    let raf = 0;

    const apply = () => {
      raf = 0;
      const doc = document.documentElement;
      const max = Math.max(1, doc.scrollHeight - window.innerHeight);
      const t = Math.min(1, Math.max(0, window.scrollY / max));
      const r = lerpChannel(MAGENTA[0], GREEN[0], t);
      const g = lerpChannel(MAGENTA[1], GREEN[1], t);
      const b = lerpChannel(MAGENTA[2], GREEN[2], t);
      root.style.setProperty("--lumen-temp", t.toFixed(4));
      root.style.setProperty("--lumen-blend", `rgb(${r} ${g} ${b})`);
      root.style.setProperty(
        "--lumen-blend-soft",
        `rgb(${r} ${g} ${b} / 0.35)`,
      );
    };

    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(apply);
    };

    apply();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [rootRef]);
}
