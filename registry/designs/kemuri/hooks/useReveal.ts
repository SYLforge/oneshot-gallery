"use client";

import { useEffect, useRef } from "react";

/**
 * Reveals descendants marked with [data-reveal] as they enter the viewport,
 * by adding an `is-visible` class. The pre-reveal state (opacity/translate,
 * or the poem's per-glyph cadence) lives in styles.css and is gated behind
 * the `.kemuri-js` root class, so every word is plainly visible when
 * JavaScript never runs.
 *
 * Two flavors:
 *   data-reveal          — the element itself fades and rises (0.9s), with a
 *                          90ms stagger between elements of the same
 *                          observer batch, so a screenful never moves as one
 *                          slab.
 *   data-reveal="scene"  — the element does not animate itself; it only
 *                          receives `is-visible` so its descendants (poem
 *                          glyphs, plate captions) can run their own
 *                          choreographed delays.
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
            el.style.transitionDelay = `${batch * 90}ms`;
            batch += 1;
          }
          el.classList.add("is-visible");
          io.unobserve(el);
        }
      },
      { threshold: 0.18, rootMargin: "0px 0px -8% 0px" },
    );
    for (const el of targets) io.observe(el);
    return () => io.disconnect();
  }, [disabled]);

  return rootRef;
}
