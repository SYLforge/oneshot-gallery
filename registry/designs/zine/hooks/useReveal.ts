"use client";

import { useEffect, useRef } from "react";

/**
 * Reveals descendants marked with [data-reveal] as they enter the viewport,
 * by adding an `is-visible` class. Three reveal vocabularies, all JS-gated
 * behind the `.zine-js` root class so the server-rendered zine is a
 * complete, readable document when JavaScript never runs:
 *
 * - default (fade-rise): paragraphs, heads, captions — opacity + translateY.
 * - "clip": article/photo panels wipe in with a clip-path polygon cut
 *   (the photocopied diagonal — see the clip-path-reveal breakdown).
 * - "char": per-glyph headline reveal. The CSS targets children via a
 *   `--z-ci` custom property the component sets on each letter span; the
 *   observer only flips the `is-visible` class once, the rest is CSS.
 *
 * Elements that intersect in the same observer batch are staggered 70ms
 * apart via transition-delay, so a screenful never lands as one slab.
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
          el.style.setProperty("--z-reveal-delay", `${batch * 70}ms`);
          el.classList.add("is-visible");
          io.unobserve(el);
          batch += 1;
        }
      },
      { threshold: 0.14, rootMargin: "0px 0px -7% 0px" },
    );
    for (const el of targets) io.observe(el);
    return () => io.disconnect();
  }, [disabled]);

  return rootRef;
}
