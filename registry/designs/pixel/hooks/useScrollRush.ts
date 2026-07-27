"use client";

import { useEffect, useRef, type RefObject } from "react";

/** Scroll speed (px/ms) that counts as a full-tilt run down the cabinet bank. */
const V_MAX = 2.4;
/** Energy attack / release per 60fps-normalized frame — the CRT notices a
 *  rush fast and takes its time settling back, like phosphor afterglow. */
const ATTACK = 0.16;
const RELEASE = 0.05;
/** Aberration envelope: max RGB-split offset (px) and ghost opacity. */
const MAX_SHIFT_PX = 3;
const MAX_GHOST = 0.9;
/** Below this energy, after this much scroll silence, the loop parks. */
const SLEEP_AT = 0.004;
const SLEEP_AFTER_MS = 320;

/**
 * Turns page scroll VELOCITY (not position) into a smoothed 0→1 "rush"
 * energy and writes it to two CSS custom properties on the entry root:
 *
 *   --pixel-shift  (0–3px)   — how far the chromatic-aberration ghosts split
 *   --pixel-ghost  (0–0.9)   — how visible those ghosts are
 *
 * At rest both are 0 and the display headings render with only the idle
 * CRT breathe (a separate, slower, always-on animation). Scroll hard and
 * the headings smear cyan-left / magenta-right like a knocked CRT; stop,
 * and everything eases back to crisp over the release curve.
 *
 * The returned ref carries the same 0→1 number for any JS consumer that
 * wants it (the marquee speeds up with the same energy). The loop only
 * runs while there is something to decay: it wakes on the first scroll
 * event and parks itself once energy has drained, so an idle page costs
 * zero frames. Under prefers-reduced-motion it writes the resting values
 * once and never listens at all.
 */
export function useScrollRush(
  rootRef: RefObject<HTMLElement | null>,
  reduced: boolean,
): RefObject<number> {
  const energyRef = useRef(0);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const write = (value: number) => {
      energyRef.current = value;
      root.style.setProperty(
        "--pixel-shift",
        `${(value * MAX_SHIFT_PX).toFixed(2)}px`,
      );
      root.style.setProperty("--pixel-ghost", (value * MAX_GHOST).toFixed(3));
    };

    if (reduced) {
      write(0);
      return;
    }

    let raf = 0;
    let running = false;
    let lastY = 0;
    let lastT = 0;
    let lastScrollAt = 0;
    let energy = 0;

    const park = () => {
      running = false;
      cancelAnimationFrame(raf);
      energy = 0;
      write(0);
    };

    const step = (now: number) => {
      raf = requestAnimationFrame(step);
      const dt = Math.min(Math.max(now - lastT, 1), 64);
      lastT = now;

      const y = window.scrollY;
      const v = Math.abs(y - lastY) / dt; // px per ms
      lastY = y;
      if (v > 0.01) lastScrollAt = now;

      const target = Math.min(1, v / V_MAX);
      const k = (target > energy ? ATTACK : RELEASE) * (dt / 16.7);
      energy += (target - energy) * Math.min(1, k);
      write(energy);

      if (energy < SLEEP_AT && now - lastScrollAt > SLEEP_AFTER_MS) park();
    };

    const wake = () => {
      if (running || document.hidden) return;
      running = true;
      lastY = window.scrollY;
      lastT = performance.now();
      lastScrollAt = lastT;
      raf = requestAnimationFrame(step);
    };

    const onVisibility = () => {
      if (document.hidden && running) park();
    };

    window.addEventListener("scroll", wake, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.removeEventListener("scroll", wake);
      document.removeEventListener("visibilitychange", onVisibility);
      cancelAnimationFrame(raf);
      write(0);
    };
  }, [rootRef, reduced]);

  return energyRef;
}
