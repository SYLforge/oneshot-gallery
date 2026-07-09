"use client";

import { useEffect, type RefObject } from "react";

/**
 * Reveals descendants marked with [data-reveal] as they enter the viewport,
 * by adding an `is-visible` class. The pre-reveal state (opacity/translate)
 * lives in styles.css and is gated behind the `.lumen-js` root class, so the
 * content is fully visible when JavaScript never runs.
 *
 * The forecast sparkline piggybacks on the same class: its
 * stroke-dashoffset draw is triggered by `.is-visible` on its wrapper.
 *
 * Elements that intersect in the same observer batch are staggered 80ms
 * apart via transition-delay, so a screenful never fades as one slab.
 */
export function useReveal(
  rootRef: RefObject<HTMLElement | null>,
  disabled: boolean,
): void {
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
          el.style.transitionDelay = `${batch * 80}ms`;
          el.classList.add("is-visible");
          io.unobserve(el);
          batch += 1;
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
    );
    for (const el of targets) io.observe(el);
    return () => io.disconnect();
  }, [rootRef, disabled]);
}
