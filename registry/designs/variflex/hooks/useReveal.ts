"use client";

import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

/**
 * Reveals descendants marked with [data-reveal] as they enter the viewport,
 * by adding an `is-visible` class (the name styles.css expects). Pre-reveal
 * states (opacity/translate) live in styles.css and are gated behind the
 * `.neon-js` root class, so all content is fully visible when JavaScript
 * never runs.
 *
 * Elements that intersect in the same observer batch are staggered 80ms apart
 * — the street's cadence.
 */
export function useReveal<T extends HTMLElement = HTMLElement>() {
  const ref = useRef<T | null>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const targets = Array.from(
      root.querySelectorAll<HTMLElement>("[data-reveal]"),
    );

    if (reduced || !("IntersectionObserver" in window)) {
      for (const el of targets) el.classList.add("is-visible");
      return;
    }

    const io = new IntersectionObserver(
      (hits) => {
        let batch = 0;
        for (const hit of hits) {
          if (!hit.isIntersecting) continue;
          const el = hit.target as HTMLElement;
          el.style.transitionDelay = `${batch * 80}ms`;
          el.classList.add("is-visible");
          io.unobserve(el);
          batch += 1;
        }
      },
      { threshold: 0.16, rootMargin: "0px 0px -8% 0px" },
    );
    for (const el of targets) io.observe(el);
    return () => io.disconnect();
  }, [reduced]);

  return ref;
}
