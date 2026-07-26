"use client";

import { useEffect, useRef } from "react";
import "./styles.css";
import { cormorantGaramond, notoSerifKR } from "./fonts";
import Hero from "./components/Hero";
import TheBloom from "./components/TheBloom";
import ScentNotes from "./components/ScentNotes";
import BloomFooter from "./components/BloomFooter";
import { usePrefersReducedMotion } from "./hooks/usePrefersReducedMotion";
import { useReveal } from "./hooks/useReveal";

/**
 * 피다 BLOOM — a botanical perfume house.
 * A Korean perfume house beside a peony field in Seogwipo, Jeju. The page
 * is the scent opening: an ink-line botanical draws itself stroke-by-stroke
 * as you arrive (svg-line-draw), watercolor washes bloom outward through
 * feTurbulence displacement and settle (feturbulence-texture), and one
 * pinned signature flower opens petal-by-petal with your scroll progress
 * (scroll-scrub-pinned). Everything is drawn by code — there is not one
 * raster image here, and zero media payload.
 *
 * Medium distinction from SAKURA (the 1st ink-bloom entry): SAKURA scatters
 * cherry-blossom particles across a dark/pink canvas; BLOOM draws SVG
 * botanical line-art on a warm cream ground, then blooms watercolor behind
 * it. Same family thesis (ink → bloom), different medium (canvas-particles
 * vs svg-line-draw + wash), different ground (dark/pink vs light/cream),
 * different accent (cherry-pink vs botanical green).
 *
 * `.bloom-js` is added imperatively on mount (it never changes, so it is a
 * signal to CSS that JS is alive, not React state): every pre-reveal style
 * and every pre-draw/pre-bloom offset is gated behind it, and with
 * JavaScript off the full page simply stands finished — every line drawn,
 * every wash settled, the signature flower open. The SSR frame IS the
 * completed page.
 */
export default function BloomPage() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const reduced = usePrefersReducedMotion();
  const revealRef = useReveal<HTMLDivElement>(reduced);

  useEffect(() => {
    // Imperative on purpose: the class is a signal to CSS that JS is alive,
    // not React state — and it never changes once set.
    rootRef.current?.classList.add("bloom-js");
    window.parent?.postMessage({ type: "oneshot:ready", slug: "bloom" }, "*");
  }, []);

  return (
    <div
      id="bloom-top"
      ref={rootRef}
      className={`${cormorantGaramond.variable} ${notoSerifKR.variable} bloom-root`}
    >
      {/* Cream paper fiber — one static feTurbulence pass over everything.
          Fibers, not film grain — it never animates; it just keeps the cream
          from reading as flat #fff. Distinguish from kemuri's washi grain:
          that is ink-dark noise over a warm sheet; this is cream-on-cream. */}
      <svg className="bloom-paper" aria-hidden="true" focusable="false">
        <filter id="bloom-paper-fiber">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.9"
            numOctaves="2"
            seed="7"
            stitchTiles="stitch"
          />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.8  0 0 0 0 0.74  0 0 0 0 0.63  0 0 0 0.04 0"
          />
        </filter>
        <rect width="100%" height="100%" filter="url(#bloom-paper-fiber)" />
      </svg>

      <div ref={revealRef} className="bloom-sheet">
        <Hero />
        <main>
          <ScentNotes />
          <TheBloom />
        </main>
        <BloomFooter />
      </div>
    </div>
  );
}
