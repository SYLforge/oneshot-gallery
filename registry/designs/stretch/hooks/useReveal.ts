"use client";

import { useEffect, useRef } from "react";

/**
 * Reveals descendants marked with [data-reveal] as they enter the viewport,
 * by adding an `is-visible` class. Pre-reveal states (a quiet rise for
 * text, 18px → 0) live in styles.css and are gated behind the `.stretch-js`
 * root class, so the whole studio site is plainly readable when JavaScript
 * never runs — a wellness page must degrade to a calm, complete document.
 *
 * Elements that intersect in the same observer batch are staggered 90ms
 * apart via transition-delay, a touch slower than the default — breath,
 * not snap.
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
          el.style.transitionDelay = `${batch * 90}ms`;
          el.classList.add("is-visible");
          io.unobserve(el);
          batch += 1;
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );
    for (const el of targets) io.observe(el);
    return () => io.disconnect();
  }, [disabled]);

  return rootRef;
}
