"use client";

import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

/**
 * Reveals descendants marked with `data-reveal` as they scroll into view,
 * by adding the `is-shown` class. Returns a ref to attach to a container
 * (the zones section root).
 *
 * The pre-reveal state (opacity/translate) lives in styles.css and is gated
 * behind the `.hanok-js` root class, so every zone is fully visible when
 * JavaScript never runs (the SSR state is the finished page). Under
 * prefers-reduced-motion the observer still runs but the CSS parks the
 * transition, so zones appear at rest either way.
 *
 * Elements that intersect in the same observer batch are staggered 100ms
 * apart via transition-delay, so a screenful of zones never rises as one
 * slab. The whole page uses one observer (perf gate G3: nothing per-zone).
 *
 * This imperative pattern (ref + classList, no state read in render) is
 * chosen deliberately over a `{ref, shown}` tuple because it keeps the ref
 * out of render — the lint rule that guards refs-during-render stays clean,
 * and there is nothing for React to re-render on intersection.
 */
export function useReveal<T extends HTMLElement>() {
  const rootRef = useRef<T | null>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const targets = Array.from(
      root.querySelectorAll<HTMLElement>("[data-reveal]"),
    );

    if (!("IntersectionObserver" in window)) {
      for (const el of targets) el.classList.add("is-shown");
      return;
    }

    if (reduced) {
      // Reduced motion: show everything at rest. The CSS will not transition.
      for (const el of targets) el.classList.add("is-shown");
      return;
    }

    const io = new IntersectionObserver(
      (hits) => {
        let batch = 0;
        for (const hit of hits) {
          if (!hit.isIntersecting) continue;
          const el = hit.target as HTMLElement;
          el.style.transitionDelay = `${batch * 100}ms`;
          el.classList.add("is-shown");
          io.unobserve(el);
          batch += 1;
        }
      },
      { threshold: 0.14, rootMargin: "0px 0px -8% 0px" },
    );
    for (const el of targets) io.observe(el);
    return () => io.disconnect();
  }, [reduced]);

  return rootRef;
}
