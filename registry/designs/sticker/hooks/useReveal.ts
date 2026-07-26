"use client";

import { useEffect } from "react";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

/**
 * useReveal — sections rise into place like a sticker being peeled up.
 *
 * Attach to a container; every descendant carrying `data-sticker-reveal`
 * starts hidden (via the `sticker-reveal` class, which is gated behind the
 * JS-mounted `sticker-js` root so no-JS shows everything immediately). When
 * an element scrolls into view it gains `is-revealed`, driving a
 * `translateY(24px) → 0` + `opacity 0 → 1` transition with a 90ms batched
 * stagger — siblings cascade. The easing is `ease-back`
 * (`cubic-bezier(0.34,1.56,0.64,1)`) so the settle has a tiny overshoot,
 * matching the sticker wobble.
 *
 * Reduced motion: nothing is hidden, nothing transitions — the page arrives
 * complete. A single `IntersectionObserver` drives everything; the loop
 * detaches once every reveal target has fired.
 */
export function useReveal(
  containerRef: React.RefObject<HTMLElement | null>,
): void {
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    if (reduced) {
      // ensure nothing is left hidden under reduced motion
      container
        .querySelectorAll<HTMLElement>("[data-sticker-reveal]")
        .forEach((el) => el.classList.add("is-revealed"));
      return;
    }

    const targets = Array.from(
      container.querySelectorAll<HTMLElement>("[data-sticker-reveal]"),
    );

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const el = entry.target as HTMLElement;
          // batched stagger by DOM order within the same reveal moment
          const idx = targets.indexOf(el);
          const delay = Math.min(360, Math.max(0, idx) * 90);
          window.setTimeout(() => el.classList.add("is-revealed"), delay);
          io.unobserve(el);
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.12 },
    );

    for (const el of targets) {
      io.observe(el);
    }

    return () => {
      io.disconnect();
    };
  }, [containerRef, reduced]);
}
