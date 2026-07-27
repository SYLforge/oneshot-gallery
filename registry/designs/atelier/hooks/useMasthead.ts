"use client";

import { useEffect, useRef } from "react";

/**
 * Drives the cover masthead's per-glyph reveal — the signature
 * `char-split-reveal`. On mount (motion allowed) it adds `is-set` to the
 * referenced heading; the per-glyph CSS transition (lifted from the baseline,
 * un-clipped) is staggered by each span's `--atelier-ci`, so the masthead
 * opens like a cover being set down on a table. The CSS default state IS the
 * finished one, so without JavaScript and under reduced motion the name is
 * simply there, fully set.
 *
 * A small `requestAnimationFrame` deferral ensures the browser has painted
 * the initial (clipped) state before we flip to the final one — without it,
 * some engines fold the two states and skip the transition entirely.
 */
export function useMasthead<T extends HTMLElement>(disabled: boolean) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (disabled) {
      el.classList.add("is-set");
      return;
    }
    const raf = requestAnimationFrame(() => {
      // double-rAF: commit the pre-state on one frame, flip on the next, so
      // the transition is guaranteed to fire across engines.
      requestAnimationFrame(() => el.classList.add("is-set"));
    });
    return () => cancelAnimationFrame(raf);
  }, [disabled]);

  return ref;
}
