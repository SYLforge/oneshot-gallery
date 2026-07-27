"use client";

import { useEffect, useRef } from "react";

/**
 * Reveals descendants marked with [data-tear] as they enter the viewport by
 * adding an `is-torn` class. The pre-tear state (clipped to invisibility)
 * lives in styles.css and is gated behind the `.gl-js` root class, so every
 * section is fully visible when JavaScript never runs — SSR is the completed
 * page.
 *
 * Elements that intersect in the same observer batch are staggered 60ms via
 * transition-delay, so a screenful never tears open as one slab.
 */
export function useGlitchReveal<T extends HTMLElement>(disabled: boolean) {
  const rootRef = useRef<T | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const targets = Array.from(
      root.querySelectorAll<HTMLElement>("[data-tear]"),
    );

    if (disabled || !("IntersectionObserver" in window)) {
      for (const el of targets) el.classList.add("is-torn");
      return;
    }

    const io = new IntersectionObserver(
      (hits) => {
        let batch = 0;
        for (const hit of hits) {
          if (!hit.isIntersecting) continue;
          const el = hit.target as HTMLElement;
          el.style.transitionDelay = `${batch * 60}ms`;
          el.classList.add("is-torn");
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
