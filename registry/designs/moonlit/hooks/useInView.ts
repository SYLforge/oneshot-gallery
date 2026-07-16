"use client";

import { useEffect, useState } from "react";

/**
 * Tracks whether a given element is currently in the viewport, plus a
 * latched `seen` flag (true once the element has ever been in view). The
 * consumer owns the ref (created with `useRef`) and passes it in, the
 * same pattern halflight's `useScrollProgress` uses — this keeps the
 * ref object stable across renders and side-steps the strict
 * `react-hooks/refs` lint rule that flags refs returned from custom hooks.
 *
 * `once` defaults to true — most reveals are one-shot. The marquee passes
 * `once: false` so the headlight trail can pause offscreen and resume when
 * the street panel returns.
 */
export function useInView<T extends HTMLElement>(
  targetRef: React.RefObject<T | null>,
  options?: { threshold?: number; rootMargin?: string; once?: boolean },
): { inView: boolean; seen: boolean } {
  const threshold = options?.threshold ?? 0.4;
  const rootMargin = options?.rootMargin ?? "0px 0px -10% 0px";
  const once = options?.once ?? true;

  const [inView, setInView] = useState(false);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = targetRef.current;
    if (!el || !("IntersectionObserver" in window)) {
      // No IO support: assume visible so SSR / legacy still renders content.
      setInView(true);
      setSeen(true);
      return;
    }
    const io = new IntersectionObserver(
      (hits) => {
        for (const hit of hits) {
          setInView(hit.isIntersecting);
          if (hit.isIntersecting) {
            setSeen(true);
            if (once) {
              io.disconnect();
              return;
            }
          }
        }
      },
      { threshold, rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [targetRef, threshold, rootMargin, once]);

  return { inView, seen };
}
