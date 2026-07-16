"use client";

import { useEffect, useRef } from "react";

/**
 * Types `text` out one glyph at a time, the way a live delivery tracker
 * updates — 주문 접수, 조리 중, 배달 출발, 배달 완료. Re-typing is gated by
 * the caller's `start` flag (typically latched on `seen` from useInView),
 * so a status that has not scrolled into frame sits silent.
 *
 * Reduced motion: caller collapses the step by passing a tiny `speed`
 * (1ms) so glyphs land in a few frames; the cursor itself is hidden by
 * the reduced-motion media query in styles.css.
 *
 * Returns a ref object the caller attaches to the visible (aria-hidden)
 * span. The hook writes the typed slice directly to that span's textContent
 * — one DOM write per glyph, zero React re-renders, no `setState in effect`
 * lint pattern. The full string lives in a separate visually-hidden span
 * owned by the caller for screen readers.
 *
 * The cursor span is a sibling (with class `moonlit-status__cursor
 * is-typing`); the hook does not own it. Under reduced motion the CSS
 * media query hides the cursor and the text lands whole.
 */
export function useTypewriter<T extends HTMLElement>(
  text: string,
  start: boolean,
  speed = 55,
): React.RefObject<T | null> {
  const elRef = useRef<T | null>(null);
  const rafRef = useRef<number | null>(null);
  const glyphs = Array.from(text);

  // Write the current typed slice to the bound element. No-op if not bound.
  const paint = (count: number) => {
    const el = elRef.current;
    if (!el) return;
    el.textContent = glyphs.slice(0, count).join("");
  };

  useEffect(() => {
    if (!start) return;

    let idx = 0;
    let last = 0;
    paint(0);

    if (text === "") return;

    const tick = (now: number) => {
      if (idx === 0) last = now;
      const elapsed = now - last;
      const due = Math.max(1, Math.floor(elapsed / speed));
      if (due > 0) {
        idx = Math.min(glyphs.length, idx + due);
        paint(idx);
        last = now;
      }
      if (idx < glyphs.length) {
        rafRef.current = window.requestAnimationFrame(tick);
      }
    };
    rafRef.current = window.requestAnimationFrame(tick);

    return () => {
      if (rafRef.current !== null) window.cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [start, text, speed]);

  return elRef;
}
