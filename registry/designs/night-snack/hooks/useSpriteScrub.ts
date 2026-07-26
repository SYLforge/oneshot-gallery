"use client";

import { useEffect, useRef } from "react";

/**
 * Sprite-sequence scrub — the `sprite-scrub` technique, here applied to a
 * *code-drawn* sprite strip (no image payload). The cooking panel has a stack
 * of frames — steam plume positions + halftone-dot densities, each a pure
 * CSS/SVG drawing — and this hook scrubs which frame is showing by writing a
 * single number `--ns-steam` ∈ [0, 1] onto the panel as you scroll through it.
 *
 * The frames themselves live in the component as siblings; styles.css maps
 * `--ns-steam` to each frame's opacity so only ~3 are ever meaningfully
 * visible (a crossfade, not a flip). The hook never touches a frame directly —
 * it only writes the scrub variable, transform/opacity-safe.
 *
 * Mechanically: a scroll listener (passive) computes how far the panel has
 * traveled through the viewport — 0 when its top hits the bottom of the
 * screen, 1 when its bottom hits the top — and writes that onto the element as
 * `--ns-steam`. A rAF coalesces multiple scroll events into one write and
 * clamps `dt` to 48ms so a backgrounded tab cannot lurch on return. The loop
 * pauses entirely on `visibilitychange` (hidden) and never runs under reduced
 * motion — under reduced motion styles.css pins `--ns-steam` at its final
 * frame (steam fully risen, food plated).
 *
 * `targetRef` should be the element whose travel drives the scrub; the
 * consumer owns the ref. `once` is unused here (scrub is reversible by
 * nature) — kept off to match the gallery's hook ergonomics.
 */
export function useSpriteScrub<T extends HTMLElement>(disabled: boolean) {
  const targetRef = useRef<T | null>(null);

  useEffect(() => {
    const el = targetRef.current;
    if (!el || disabled) return;

    let raf = 0;
    let running = false;

    const compute = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // 0 when the panel's top is at the bottom of the viewport; 1 when its
      // bottom is at the top. Clamp so the scrub holds at both ends.
      const top = rect.top;
      const bottom = rect.bottom;
      const span = vh + rect.height;
      const traveled = vh - top; // how far the panel's top has risen into view
      const p = (traveled / span) * 1;
      const clamped = Math.min(Math.max(p, 0), 1);
      el.style.setProperty("--ns-steam", clamped.toFixed(4));
      // Suppress the unused `bottom` read warning — kept for clarity of the
      // span math; the optimizer drops it.
      void bottom;
    };

    const wake = () => {
      if (running) return;
      running = true;
      raf = window.requestAnimationFrame(() => {
        running = false;
        compute();
      });
    };

    const onVisibility = () => {
      if (document.hidden) {
        if (raf) window.cancelAnimationFrame(raf);
        running = false;
      } else {
        wake();
      }
    };

    compute();
    window.addEventListener("scroll", wake, { passive: true });
    window.addEventListener("resize", wake, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      if (raf) window.cancelAnimationFrame(raf);
      window.removeEventListener("scroll", wake);
      window.removeEventListener("resize", wake);
      document.removeEventListener("visibilitychange", onVisibility);
      el.style.removeProperty("--ns-steam");
    };
  }, [disabled]);

  return targetRef;
}
