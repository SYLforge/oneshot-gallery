"use client";

import { useEffect, useRef } from "react";

/**
 * `clip-path-reveal` + the squiggle `svg-line-draw` that rides with it.
 *
 * Wires up two kinds of scroll-triggered reveals on the element tree the
 * returned ref is attached to:
 *
 * 1. `[data-mp-clip]` — a shape/panel whose clip-path wipes open as it
 *    enters the viewport. Each target carries a CSS custom property
 *    `--mp-clip-from` (the starting clip-path string) and the rule defines
 *    `--mp-clip-to` as its resting (full) clip; this hook sets the start
 *    inline, then on scroll-in toggles a class so CSS transitions the
 *    clip-path over ~620ms. A per-target stagger lives in the markup via
 *    `--mp-delay`.
 * 2. `[data-mp-squiggle]` — an SVG path/path-set whose stroke draws itself
 *    via stroke-dashoffset. The hook measures each path's length and seeds
 *    the dashoffset, then transitions it to 0 on scroll-in.
 *
 * The pre-reveal state is gated behind the `.memphis-js` root class: with
 * JavaScript disabled (or under reduced motion) nothing is hidden — every
 * shape sits at its resting clip, every squiggle is fully drawn, and the
 * page is a finished poster. `.memphis-js` only exists to *enable* the
 * pre-reveal starting state once JS is alive and motion is allowed.
 */
export function useClipReveal<T extends HTMLElement>(disabled: boolean) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    const clipEls = Array.from(
      root.querySelectorAll<HTMLElement>("[data-mp-clip]"),
    );
    const squigEls = Array.from(
      root.querySelectorAll<SVGPathElement>("[data-mp-squiggle]"),
    );

    // Reduced motion / no IO: ensure everything is at rest, nothing hidden.
    if (disabled || !("IntersectionObserver" in window)) {
      for (const el of clipEls) {
        el.style.clipPath = "";
        el.classList.remove("is-clipped");
      }
      for (const p of squigEls) {
        p.style.strokeDasharray = "";
        p.style.strokeDashoffset = "";
      }
      return;
    }

    // Seed the pre-reveal starting state. The .memphis-js class on the root
    // is what makes these visible; without it the rule's resting clip wins
    // and nothing is ever hidden (no-JS / SSR safety).
    for (const el of clipEls) {
      const from = getComputedStyle(el)
        .getPropertyValue("--mp-clip-from")
        .trim();
      if (from) {
        el.style.clipPath = from;
        el.classList.add("is-clipped");
      }
    }
    for (const p of squigEls) {
      const len = p.getTotalLength();
      // Defer writing the measured dash if the path isn't laid out yet.
      if (len > 0) {
        p.style.strokeDasharray = `${len}`;
        p.style.strokeDashoffset = `${len}`;
      }
    }

    const io = new IntersectionObserver(
      (hits) => {
        for (const hit of hits) {
          if (!hit.isIntersecting) continue;
          const el = hit.target as HTMLElement;
          const delayRaw = getComputedStyle(el)
            .getPropertyValue("--mp-delay")
            .trim();
          const delay = Number.parseFloat(delayRaw) || 0;
          if (el.hasAttribute("data-mp-clip")) {
            window.setTimeout(() => {
              el.style.clipPath = "";
              el.classList.remove("is-clipped");
              el.classList.add("is-revealed");
            }, delay);
          } else if (el.hasAttribute("data-mp-squiggle")) {
            const path = el as unknown as SVGPathElement;
            window.setTimeout(() => {
              path.style.transition =
                "stroke-dashoffset 900ms cubic-bezier(0.16,1,0.3,1)";
              path.style.strokeDashoffset = "0";
            }, delay);
          }
          io.unobserve(el);
        }
      },
      { threshold: 0.2, rootMargin: "0px 0px -8% 0px" },
    );

    for (const el of clipEls) io.observe(el);
    for (const p of squigEls) io.observe(p as unknown as Element);

    return () => {
      io.disconnect();
    };
  }, [disabled]);

  return ref;
}
