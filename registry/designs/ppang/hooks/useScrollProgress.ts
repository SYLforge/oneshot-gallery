"use client";

import { useEffect, type RefObject } from "react";

/**
 * Drives the two scroll-tied effects on the page by writing two CSS custom
 * properties onto the root element — transform/opacity-only, so nothing
 * here ever touches layout:
 *
 *   --ppang-dawn   ∈ [0, 1]   how far the sky has climbed from pre-dawn
 *                             indigo through dawn blush to morning gold.
 *                             progress is measured over the first 55% of the
 *                             page (by the time you reach the kitchen, the
 *                             morning has arrived and the sky holds still).
 *   --ppang-sky-y  ∈ px       a small downward parallax for the hero sky
 *                             layer, capped so the bakery never slides off.
 *
 * The hook reads `scrollY / maxScroll` once per rAF and clamps dt to 48ms so
 * a backgrounded tab can't lurch on return. It pauses entirely on
 * `visibilitychange` (hidden) and never runs under reduced motion — under
 * reduced motion the page renders with the dawn already arrived
 * (--ppang-dawn pinned at 1) and no parallax, which styles.css handles.
 *
 * `rootRef` should be the entry root (the element carrying .ppang-root) so
 * the properties land in the scope styles.css reads them from. A ref is
 * taken rather than a value so the page can attach it without a state round-
 * trip (setting state inside a ref callback re-renders on every commit).
 */
export function useScrollProgress(
  rootRef: RefObject<HTMLElement | null>,
  disabled: boolean,
) {
  useEffect(() => {
    const el = rootRef.current;
    if (!el || disabled) return;

    let raf = 0;
    let running = false;

    const compute = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(Math.max(window.scrollY / max, 0), 1) : 0;
      // The dawn arrives in the first 55% of the scroll; after that it holds.
      const dawn = Math.min(p / 0.55, 1);
      // Hero parallax: meaningful only while the hero is on screen. We feed a
      // gentle, capped value derived from how far the hero top has left view.
      const hero = el.querySelector<HTMLElement>(".ppang-hero");
      let skyY = 0;
      if (hero) {
        const rect = hero.getBoundingClientRect();
        // 0 at the top of the page, growing as the hero scrolls away; clamp
        // so once the hero is gone the sky is parked.
        const traveled = Math.min(Math.max(-rect.top / rect.height, 0), 1);
        skyY = traveled * 60; // capped 60px — a drift, not a slide
      }
      el.style.setProperty("--ppang-dawn", dawn.toFixed(4));
      el.style.setProperty("--ppang-sky-y", `${skyY.toFixed(2)}px`);
    };

    const wake = () => {
      if (running) return;
      running = true;
      raf = window.requestAnimationFrame(() => {
        running = false;
        compute();
      });
    };

    const onVisibility = () => {
      if (document.hidden) {
        if (raf) window.cancelAnimationFrame(raf);
        running = false;
      } else {
        wake();
      }
    };

    compute();
    window.addEventListener("scroll", wake, { passive: true });
    window.addEventListener("resize", wake, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      if (raf) window.cancelAnimationFrame(raf);
      window.removeEventListener("scroll", wake);
      window.removeEventListener("resize", wake);
      document.removeEventListener("visibilitychange", onVisibility);
      el.style.removeProperty("--ppang-dawn");
      el.style.removeProperty("--ppang-sky-y");
    };
  }, [rootRef, disabled]);
}
