"use client";

import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

/**
 * Direction-aware clip-path reveal.
 *
 * Attach the returned ref to a block you want wiped in by a hard geometric
 * cut (the brutalist equivalent of a fade). When the block enters the
 * viewport, `is-revealed` is added to it; `styles.css` drives the
 * inset/polygon clip from `--rave-reveal-dir`. The reveal happens once and
 * the observer disconnects — a section does not get to re-wipe every time
 * it scrolls back into frame.
 *
 * No-JS / SSR: the page ships already visible (`rave-reveal` with no
 * `rave-js` ancestor is static, clip-path: none). The pre-reveal hidden
 * state is gated behind `.rave-js .rave-reveal` so the SSR markup is the
 * completed flyer.
 */
export function useReveal<T extends HTMLElement = HTMLElement>() {
  const ref = useRef<T | null>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Reduced motion: leave the SSR-visible state alone. No wipe.
    if (reduced) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
            io.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "-8% 0px -8% 0px", threshold: 0.12 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduced]);

  return ref;
}
