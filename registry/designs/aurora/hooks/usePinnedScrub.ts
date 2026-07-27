"use client";

import { useEffect, type RefObject } from "react";

/** Half-life of the scroll-progress smoothing, per 60fps-normalized frame.
 *  Low = snappy to scroll, high = heavy and cinematic. 0.16 reads as
 *  "the cards move with you, one beat behind". */
const SMOOTH = 0.16;

/**
 * The signature pinned section. The element passed in `pinRef` is made
 * `position: sticky` by CSS; this hook measures how far the visitor has
 * scrolled *through* that sticky region and writes a smoothed 0→1 progress
 * onto it as `--aurora-pin`. The CSS reads the variable to assemble /
 * disassemble the glass-card stack: each card rides its own piece of the
 * timeline via staggered translate, scale, and opacity.
 *
 * Progress is the fraction of the sticky distance consumed:
 *
 *     top of pin at viewport top        → 0
 *     bottom of pin at viewport bottom  → 1
 *
 * The raw progress is lerp-smoothed per rAF frame so the cards glide rather
 * than tick. The loop is purely input-driven (it only runs while the value
 * is settling), costs nothing at rest, and parks entirely under reduced
 * motion — in which case the stack is laid out statically and fully visible.
 *
 * One `--aurora-pin` value drives the whole choreography: the cards, the
 * pin progress bar, and the section's accent tint. No layout reads inside
 * scroll handlers (the rect is measured once per settle, capped).
 */
export function usePinnedScrub(
  pinRef: RefObject<HTMLElement | null>,
  reduced: boolean,
): void {
  useEffect(() => {
    const pin = pinRef.current;
    if (!pin) return;

    // Under reduced motion the CSS lays the stack out statically; the
    // variable is left at 1 so the "fully assembled" state is the resting
    // state.
    if (reduced) {
      pin.style.setProperty("--aurora-pin", "1");
      return;
    }

    let raf = 0;
    let running = false;
    let raw = 0;
    let smooth = 0;
    let lastMeasuredAt = 0;

    const measure = (): number => {
      const r = pin.getBoundingClientRect();
      const track = r.height - window.innerHeight;
      if (track <= 0) return 1;
      const consumed = -r.top;
      return Math.min(1, Math.max(0, consumed / track));
    };

    const write = (v: number) => {
      pin.style.setProperty("--aurora-pin", v.toFixed(4));
    };

    const step = () => {
      raf = requestAnimationFrame(step);
      // Re-measure only when actually settling; once parked we never touch
      // the rect again until the next scroll.
      smooth += (raw - smooth) * SMOOTH;
      const settled = Math.abs(raw - smooth) < 0.0005;
      write(smooth);
      if (settled) {
        smooth = raw;
        running = false;
        cancelAnimationFrame(raf);
      }
    };

    const wake = () => {
      // Throttle rect reads to one per frame at most.
      const now = performance.now();
      if (now - lastMeasuredAt > 0) {
        lastMeasuredAt = now;
        raw = measure();
      }
      if (!running) {
        running = true;
        raf = requestAnimationFrame(step);
      }
    };

    const onVisibility = () => {
      if (document.hidden && running) {
        running = false;
        cancelAnimationFrame(raf);
      }
    };

    // Initialize so the first paint matches the real scroll position.
    raw = measure();
    smooth = raw;
    write(smooth);

    window.addEventListener("scroll", wake, { passive: true });
    window.addEventListener("resize", wake, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.removeEventListener("scroll", wake);
      window.removeEventListener("resize", wake);
      document.removeEventListener("visibilitychange", onVisibility);
      cancelAnimationFrame(raf);
    };
  }, [pinRef, reduced]);
}
