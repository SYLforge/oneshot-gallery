"use client";

import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

/**
 * Direction-aware clip-path reveal for the spatial dashboard.
 *
 * Two modes:
 *  - Attach the returned ref to the document root: every `[data-reveal]`
 *    descendant is observed and gets `is-revealed` when it enters the
 *    viewport (aurora-style, supports many blocks).
 *  - Or call `useReveal<T>()` and attach the ref to a single block you want
 *    wiped in (legacy single-element use); that block gets `is-revealed`.
 *
 * `styles.css` drives the clip from the reveal class; the reveal happens once
 * and the observer disconnects per block — a section does not get to re-wipe
 * every time it scrolls back into frame.
 *
 * No-JS / SSR: the page ships already visible — `widget-js` is not present at
 * first paint, and the pre-reveal hidden state is gated behind
 * `.widget-js [data-reveal]`, so the SSR markup is the completed dashboard.
 * Under reduced motion the hidden state is skipped — every block just stands.
 */
export function useReveal<T extends HTMLElement = HTMLElement>() {
  const ref = useRef<T | null>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    if (reduced) return;

    // Collect the root itself (if it carries data-reveal) plus descendants.
    const targets: HTMLElement[] = [];
    if (root.hasAttribute("data-reveal")) targets.push(root);
    root.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => {
      if (el !== root) targets.push(el);
    });
    if (targets.length === 0) return;

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
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, [reduced]);

  return ref;
}
