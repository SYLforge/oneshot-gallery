"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import "./styles.css";
import { ebGaramond, zenOldMincho } from "./fonts";
import Loader from "./components/Loader";
import Hero from "./components/Hero";
import Poem from "./components/Poem";
import InkPlates from "./components/InkPlates";
import IncenseMenu from "./components/IncenseMenu";
import CTAFooter from "./components/CTAFooter";
import { usePrefersReducedMotion } from "./hooks/usePrefersReducedMotion";
import { useReveal } from "./hooks/useReveal";

/**
 * KEMURI — incense atelier, Kyoto, est. 1927. The house sells an hour of
 * stillness; the page is that hour, rehearsed. Washi and sumi, ember and
 * gold leaf; EB Garamond speaking English slowly, Zen Old Mincho holding
 * the Japanese upright. One censer, one ribbon of curl-noise smoke, three
 * sumi-e plates that settle out of water, a ledger of hours, and a dark
 * room at the end. The smoke is canvas, the washi grain and censer are
 * SVG, and the three plates are generated sumi-e paintings embedded as
 * SVG <image> so the ink-settle displacement filter still owns them.
 *
 * `.kemuri-js` is added imperatively on mount (it never changes, so it is a
 * signal to CSS that JS is alive, not React state): every pre-reveal style
 * is gated behind it, and with JavaScript off the full page simply stands
 * finished. The `entered` state is React's, because the hero's cadence
 * genuinely depends on the loader lifting.
 */
export default function KemuriPage() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const reduced = usePrefersReducedMotion();
  const revealRef = useReveal<HTMLDivElement>(reduced);
  const [entered, setEntered] = useState(false);
  const handleEntered = useCallback(() => setEntered(true), []);

  useEffect(() => {
    rootRef.current?.classList.add("kemuri-js");
    window.parent?.postMessage({ type: "oneshot:ready", slug: "kemuri" }, "*");
  }, []);

  return (
    <div
      id="kemuri-top"
      ref={rootRef}
      className={`${ebGaramond.variable} ${zenOldMincho.variable} kemuri-root`}
    >
      <Loader onDone={handleEntered} />

      <div ref={revealRef} className="kemuri-sheet">
        <Hero entered={entered} />
        <main>
          <Poem />
          <InkPlates />
          <IncenseMenu />
        </main>
        <CTAFooter />
      </div>

      {/* Washi grain: one static feTurbulence pass over everything.
          Fibers, not film grain — it never animates. */}
      <svg className="kemuri-grain" aria-hidden="true" focusable="false">
        <filter id="kemuri-grain-f">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.55"
            numOctaves="2"
            seed="9"
            stitchTiles="stitch"
          />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.11  0 0 0 0 0.094  0 0 0 0 0.078  0 0 0 0.05 0"
          />
        </filter>
        <rect width="100%" height="100%" filter="url(#kemuri-grain-f)" />
      </svg>
    </div>
  );
}
