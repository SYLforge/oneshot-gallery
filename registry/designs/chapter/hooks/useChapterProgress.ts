"use client";

import { useEffect, useRef, type RefObject } from "react";

/** Frame-rate-independent smoothing per 60fps-normalized frame. */
const LERP = 0.14;
/** Frame throttle for high-refresh displays (~64fps). */
const FRAME_MS = 15.5;

/**
 * 시간의 책 — 펼쳐진 페이지를 스크롤로 넘긴다.
 *
 * The pinned spreads section is tall (its height is set in CSS as
 * `(SPREADS + 1) × 100vh` so there is runway to turn through). Its inner
 * `.chapter-spreads__sticky` is `position: sticky; top: 0; height: 100vh` —
 * the book held open. As the visitor scrolls the runway, this hook writes:
 *
 *   - `--chapter-spread` (0 → 1, lerped) — the smooth page-turn value.
 *   - `data-spreadstate="0".."N-1"` on the sticky stage — the integer page
 *     index that drives a robust single-spread crossfade in CSS (no fragile
 *     float math: exactly one spread is visible at a time).
 *   - the folio counter text (e.g. "02 / 06").
 *
 * This is direct input→style mapping (scroll position → a number), not an
 * autonomous animation, so it stays live under `prefers-reduced-motion` —
 * only the *lerp* is bypassed, so the page-turn still tracks the wheel 1:1
 * and the spreads still crossfade (a reveal of already-present content, not
 * motion). The section count is read at call time so the data file is the
 * single source of truth.
 */
export function useChapterProgress(
  pinRef: RefObject<HTMLElement | null>,
  spreadCount: number,
  progressVar = "--chapter-spread",
): void {
  const rafRef = useRef(0);
  const smoothRef = useRef(0);
  const lastTargetRef = useRef(0);
  const maxIndex = Math.max(0, spreadCount - 1);

  useEffect(() => {
    const el = pinRef.current;
    if (!el) return;
    let lastTick = 0;

    const stage = el.querySelector<HTMLElement>(".chapter-spreads__sticky");

    const writeFolio = (idx: number) => {
      if (!stage) return;
      stage.dataset.spreadstate = String(idx);
      const counter = stage.querySelector<HTMLElement>(
        ".chapter-spreads__counter",
      );
      if (counter) {
        counter.textContent = String(idx + 1).padStart(2, "0");
      }
    };

    const compute = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      // 0 when the section's top hits the top of the viewport,
      // 1 when its bottom hits the bottom. The section is taller than the
      // viewport on purpose (it is the pin's runway).
      const usable = Math.max(1, rect.height - vh);
      const traveled = Math.min(Math.max(-rect.top, 0), usable);
      lastTargetRef.current = traveled / usable;
      el.style.setProperty(
        `${progressVar}-raw`,
        lastTargetRef.current.toFixed(4),
      );
      // The integer spread index (0..N-1) drives a robust single-spread
      // crossfade in CSS. Snap to the nearest spread, clamped to the last.
      const idx = Math.min(
        maxIndex,
        Math.max(0, Math.floor(lastTargetRef.current * spreadCount + 0.0001)),
      );
      writeFolio(idx);
    };

    const tick = (now: number) => {
      rafRef.current = 0;
      if (now - lastTick < FRAME_MS) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }
      lastTick = now;
      smoothRef.current += (lastTargetRef.current - smoothRef.current) * LERP;
      el.style.setProperty(progressVar, smoothRef.current.toFixed(4));
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
  }, [pinRef, spreadCount, maxIndex, progressVar]);
}
