"use client";

import { useEffect, useRef } from "react";

/**
 * Reveals descendants marked with [data-reveal] as they enter the viewport,
 * by adding an `is-visible` class. The pre-reveal state (opacity + a small
 * rise, or the tategaki header's per-glyph cadence) lives in styles.css and
 * is gated behind the `.chado-js` root class — so every line of the ceremony
 * is plainly present when JavaScript never runs. The ceremony must read as a
 * finished document with JS off; a tea rite degrades to paper, not to blanks.
 *
 * Two flavors:
 *   data-reveal          — the element itself fades and rises (1.1s, the
 *                          ceremony's slower ease), with a 140ms stagger
 *                          between elements of the same observer batch, so a
 *                          screenful never moves as one slab.
 *   data-reveal="scene"  — the element does not animate itself; it only
 *                          receives `is-visible` so its descendants (tategaki
 *                          glyphs, beat lines) can run their own choreography.
 */
export function useReveal<T extends HTMLElement>(disabled: boolean) {
  const rootRef = useRef<T | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const targets = Array.from(
      root.querySelectorAll<HTMLElement>("[data-reveal]"),
    );

    if (disabled || !("IntersectionObserver" in window)) {
      for (const el of targets) el.classList.add("is-visible");
      return;
    }

    const io = new IntersectionObserver(
      (hits) => {
        let batch = 0;
        for (const hit of hits) {
          if (!hit.isIntersecting) continue;
          const el = hit.target as HTMLElement;
          if (el.dataset.reveal !== "scene") {
            el.style.transitionDelay = `${batch * 140}ms`;
            batch += 1;
          }
          el.classList.add("is-visible");
          io.unobserve(el);
        }
      },
      { threshold: 0.18, rootMargin: "0px 0px -10% 0px" },
    );
    for (const el of targets) io.observe(el);
    return () => io.disconnect();
  }, [disabled]);

  return rootRef;
}
