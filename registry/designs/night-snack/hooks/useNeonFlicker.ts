"use client";

import { useEffect, useRef } from "react";

/**
 * Neon flicker for the ASCII-art signs — the on-screen half of the
 * `ascii-render` technique (the other half is rendering the sign as a
 * character density field at all). The ASCII sign is a monospace grid of
 * glyphs; this hook periodically dims a small random subset of cells so the
 * sign reads as a bank of dying bulbs, not a printed string.
 *
 * The hook owns no React state. It attaches to the sign's container, finds
 * every `.ns-ascii__c` cell inside, and on a timer re-rolls a ~8% sample to
 * `is-dim` (opacity set by CSS, never inline color). Two signs can share one
 * hook because each carries its own `data-neon-seed`; the timers are offset
 * so they never sync.
 *
 * Under reduced motion the hook does nothing — styles.css holds every sign at
 * full, steady brightness. The hook also pauses when the sign is offscreen
 * (IntersectionObserver) and on hidden tabs, so an unseen sign costs nothing.
 *
 * `periodMs` defaults to 220ms — fast enough to read as a flicker, slow
 * enough that the eye can latch a sign and read it. `dimRatio` defaults to
 * 0.08 (≈8% of cells dim each roll).
 */
export function useNeonFlicker<T extends HTMLElement>(
  disabled: boolean,
  periodMs = 220,
  dimRatio = 0.08,
) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || disabled) return;

    const cells = Array.from(
      el.querySelectorAll<HTMLElement>(".ns-ascii__c"),
    );
    if (cells.length === 0) return;

    let inView = true;
    let io: IntersectionObserver | null = null;

    const roll = () => {
      if (!inView || document.hidden) return;
      // Clear a fraction, dim a fraction. Bounded work — n is small (~200).
      for (const c of cells) c.classList.remove("is-dim");
      const n = Math.max(1, Math.floor(cells.length * dimRatio));
      for (let k = 0; k < n; k++) {
        const idx = Math.floor(Math.random() * cells.length);
        cells[idx].classList.add("is-dim");
      }
    };

    const timer: number | undefined = window.setInterval(roll, periodMs);

    if ("IntersectionObserver" in window) {
      io = new IntersectionObserver(
        (hits) => {
          for (const h of hits) {
            inView = h.isIntersecting;
            if (!inView) {
              // Park the sign lit when it leaves view.
              for (const c of cells) c.classList.remove("is-dim");
            }
          }
        },
        { threshold: 0.05 },
      );
      io.observe(el);
    }

    return () => {
      if (timer !== undefined) window.clearInterval(timer);
      io?.disconnect();
      for (const c of cells) c.classList.remove("is-dim");
    };
  }, [disabled, periodMs, dimRatio]);

  return ref;
}
