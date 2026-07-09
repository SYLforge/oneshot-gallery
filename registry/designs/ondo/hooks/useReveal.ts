"use client";

import { useEffect, useRef } from "react";

/**
 * Reveals descendants marked with [data-reveal] as they enter the viewport,
 * by adding an `is-visible` class. Pre-reveal states (opacity/translate for
 * "fade", the inset clip for "clip") live in styles.css and are gated behind
 * the `.ondo-js` root class, so all content is fully visible when JavaScript
 * never runs.
 *
 * Elements that intersect in the same observer batch are staggered 90ms
 * apart. The delay is written both as transition-delay (for the element
 * itself) and as the `--ondo-reveal-delay` custom property, so a child —
 * the clip-path on a card's art — can inherit the same beat.
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
          const delay = `${batch * 90}ms`;
          el.style.transitionDelay = delay;
          el.style.setProperty("--ondo-reveal-delay", delay);
          el.classList.add("is-visible");
          io.unobserve(el);
          batch += 1;
        }
      },
      { threshold: 0.18, rootMargin: "0px 0px -8% 0px" },
    );
    for (const el of targets) io.observe(el);
    return () => io.disconnect();
  }, [disabled]);

  return rootRef;
}
