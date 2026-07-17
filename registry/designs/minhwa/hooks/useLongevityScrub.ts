"use client";

import { useEffect, type RefObject } from "react";

/**
 * Drives the 십장생 (ten longevity symbols) section — a scroll-scrubbed
 * PINNED sequence. The section is a tall outer track; inside it a sticky
 * stage stays fixed while the visitor scrolls, and the ten symbols advance
 * one position at a time.
 *
 * The hook reads the section's scroll progress (0 at the top of the track,
 * 1 at the bottom) once per rAF and writes it as a single CSS custom
 * property on the sticky element:
 *
 *   --minhwa-longevity  ∈ [0, 1]
 *
 * styles.css derives the active symbol, the caption crossfade, and the
 * scale of the current symbol purely from that property via calc()/clamp()/
 * round() — no per-frame layout, no React state round-trip. transform and
 * opacity only.
 *
 * The hook clamps dt to 48ms so a backgrounded tab can't lurch on return,
 * pauses entirely on `visibilitychange` (hidden), and never runs under
 * reduced motion — under reduced motion the section simply shows all ten
 * symbols in a composed grid (styles.css pins --minhwa-longevity at a state
 * where every symbol is visible), which `useReveal` handles via the
 * `is-visible` class.
 *
 * `sectionRef` should be the OUTER track element (the tall one). The sticky
 * child is found by class `.minhwa-long__stage`.
 */
export function useLongevityScrub(
  sectionRef: RefObject<HTMLElement | null>,
  disabled: boolean,
) {
  useEffect(() => {
    if (disabled) return;
    const section = sectionRef.current;
    if (!section) return;
    const stage = section.querySelector<HTMLElement>(".minhwa-long__stage");
    if (!stage) return;

    let raf = 0;
    let running = false;

    const compute = () => {
      const rect = section.getBoundingClientRect();
      const viewH = window.innerHeight;
      // The track is taller than the viewport (track = stage height + the
      // scroll distance). Progress is how far the track top has risen above
      // the viewport top, over the scrollable distance.
      const scrollable = Math.max(rect.height - viewH, 1);
      const traveled = Math.min(Math.max(-rect.top / scrollable, 0), 1);
      stage.style.setProperty("--minhwa-longevity", traveled.toFixed(4));
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
      stage.style.removeProperty("--minhwa-longevity");
    };
  }, [sectionRef, disabled]);
}
