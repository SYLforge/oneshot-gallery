"use client";

import { useEffect, useRef } from "react";

/** Displacement scale while the wash is "still wet" — pure weather. */
const WET_SCALE = 62;
/** How long the wash takes to settle (ms). */
const SETTLE_MS = 1700;

/**
 * Drives the watercolor "bloom" — the signature of this page's
 * feturbulence-texture technique. Every `.bloom-wash-svg` inside the
 * referenced element carries an `feTurbulence + feDisplacementMap` filter
 * whose `scale` we animate from WET_SCALE down to 0 as the element enters
 * the viewport, so the wash color appears to bloom outward through the
 * fractal noise and then settle into its final edge — ink finding its
 * boundary on wet paper.
 *
 * Only the displacement `scale` animates; the turbulence `baseFrequency`
 * and `seed` never change, so the noise texture is computed once and each
 * frame pays displacement only (cheap). A separate rAF loop runs per wash,
 * cancelled on unmount; reduced motion and no-JS both land on `scale="0"`
 * (the markup default), so the washes are simply settled.
 *
 * The bloom metaphor, distinct from SAKURA: there, blossom is a scatter of
 * particle petals across a canvas. Here, bloom is the *spreading* of a
 * watercolor edge — a behavior of pigment on paper, not a thing moving.
 */
export function useWashSettle<T extends HTMLElement>(disabled: boolean) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const svgs = Array.from(
      el.querySelectorAll<SVGSVGElement>(".bloom-wash-svg"),
    );
    const maps = new Map<SVGSVGElement, SVGFEDisplacementMapElement>();
    for (const svg of svgs) {
      const fe = svg.querySelector("feDisplacementMap");
      if (!fe) continue;
      maps.set(svg, fe as SVGFEDisplacementMapElement);
    }

    if (disabled || !("IntersectionObserver" in window) || maps.size === 0) {
      // leave scale at its markup default (0) — settled
      return;
    }

    // Raise the chaos only now that JS is known to be alive — before this
    // line (and forever, without JS) the washes rest settled.
    for (const fe of maps.values()) fe.setAttribute("scale", String(WET_SCALE));

    const rafs = new Set<number>();

    const settle = (svg: SVGSVGElement) => {
      const fe = maps.get(svg);
      if (!fe) return;
      const t0 = performance.now();
      const tick = (now: number) => {
        const p = Math.min((now - t0) / SETTLE_MS, 1);
        const ease = 1 - (1 - p) * (1 - p) * (1 - p); // cubic out — a slow bloom
        fe.setAttribute("scale", String(WET_SCALE * (1 - ease)));
        if (p < 1) rafs.add(requestAnimationFrame(tick));
      };
      rafs.add(requestAnimationFrame(tick));
    };

    const io = new IntersectionObserver(
      (hits) => {
        for (const hit of hits) {
          if (!hit.isIntersecting) continue;
          const svg = hit.target as SVGSVGElement;
          io.unobserve(svg);
          settle(svg);
        }
      },
      { threshold: 0.25 },
    );
    for (const svg of svgs) io.observe(svg);

    return () => {
      io.disconnect();
      for (const id of rafs) cancelAnimationFrame(id);
      // hand the filters back to their markup default (settled)
      for (const fe of maps.values()) fe.setAttribute("scale", "0");
    };
  }, [disabled]);

  return ref;
}
