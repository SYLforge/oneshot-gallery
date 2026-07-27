"use client";

import { useEffect, useRef, type RefObject } from "react";

/** Frame-rate-independent smoothing per 60fps-normalized frame. */
const LERP = 0.14;
/** Frame throttle for high-refresh displays (~64fps). */
const FRAME_MS = 15.5;

/**
 * Tracks scroll progress through the pinned lookbook section and writes a
 * smoothed 0→1 value to `--atelier-page` on the pinned element.
 *
 * The lookbook is a tall section (height = LOOKS × 100vh) whose inner
 * `.atelier-lookbook__sticky` is `position: sticky; top: 0; height: 100vh`.
 * As the visitor scrolls through the runway, the five looks crossfade by
 * reading `--atelier-page` — opacity and a hairline scale only, never layout.
 *
 * This is direct input→style manipulation (scroll position → a number), not
 * an autonomous animation, so it stays live under prefers-reduced-motion —
 * only the *lerp* is bypassed there, so the page-turn still tracks the wheel
 * 1:1 and the looks still crossfade (a reveal of content, not motion).
 */
export function useLookProgress(
  pinRef: RefObject<HTMLElement | null>,
  progressVar = "--atelier-page",
): void {
  const rafRef = useRef(0);
  const smoothRef = useRef(0);
  const lastTargetRef = useRef(0);

  useEffect(() => {
    const el = pinRef.current;
    if (!el) return;
    let lastTick = 0;

    const compute = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      // 0 when the section's top hits the top of the viewport,
      // 1 when its bottom hits the bottom. The section is taller than the
      // viewport on purpose (it is the pin's runway).
      const usable = Math.max(1, rect.height - vh);
      const traveled = Math.min(Math.max(-rect.top, 0), usable);
      lastTargetRef.current = traveled / usable;
      el.style.setProperty(`${progressVar}-raw`, lastTargetRef.current.toFixed(4));
    };

    const tick = (now: number) => {
      rafRef.current = 0;
      if (now - lastTick < FRAME_MS) {
        // schedule another frame to keep smoothing live without over-running
        rafRef.current = requestAnimationFrame(tick);
        return;
      }
      lastTick = now;
      smoothRef.current +=
        (lastTargetRef.current - smoothRef.current) * LERP;
      el.style.setProperty(progressVar, smoothRef.current.toFixed(4));
      // keep ticking until settled, so the page never stops mid-turn
      if (Math.abs(lastTargetRef.current - smoothRef.current) > 0.0005) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    const schedule = () => {
      compute();
      if (!rafRef.current) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    compute();
    smoothRef.current = lastTargetRef.current; // no spring on first paint
    el.style.setProperty(progressVar, smoothRef.current.toFixed(4));

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [pinRef, progressVar]);
}
