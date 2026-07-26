"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import "./styles.css";
import { cormorantGaramond, notoSerifKR, shipporiMincho } from "./fonts";
import Loader from "./components/Loader";
import Hero from "./components/Hero";
import VerseScrub from "./components/VerseScrub";
import PetalField from "./components/PetalField";
import SakuraFooter from "./components/SakuraFooter";
import { usePrefersReducedMotion } from "./hooks/usePrefersReducedMotion";
import { useReveal } from "./hooks/useReveal";

/**
 * SAKURA 벚꽃 桜花 — a generative ink garden.
 * Black ink drops fall from a deep night sky, strike an invisible waterline,
 * and bloom into cherry petals that drift on a curl-noise wind. Four verses
 * of mono no aware scrub by as petals accumulate and clear with the scroll.
 * The whole garden is code — not one raster image.
 *
 * This is the ink-bloom family's flagship and the gallery's direct answer to
 * oneshot-sakura: the same premise (ink → bloom), but trilingual, installable,
 * and free. `.sakura-js` is added imperatively on mount (it never changes, so
 * it is a signal to CSS that JS is alive, not React state): every pre-reveal
 * style is gated behind it, and with JavaScript off the full page simply
 * stands finished — the garden already in bloom. The `entered` state is
 * React's, because the hero's cadence genuinely depends on the loader lifting.
 */
export default function SakuraPage() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const reduced = usePrefersReducedMotion();
  const revealRef = useReveal<HTMLDivElement>(reduced);
  const [entered, setEntered] = useState(false);
  const handleEntered = useCallback(() => setEntered(true), []);

  useEffect(() => {
    rootRef.current?.classList.add("sakura-js");
    window.parent?.postMessage({ type: "oneshot:ready", slug: "sakura" }, "*");
  }, []);

  return (
    <div
      id="sakura-top"
      ref={rootRef}
      className={`${cormorantGaramond.variable} ${notoSerifKR.variable} ${shipporiMincho.variable} sakura-root ${entered ? "is-entered" : ""}`}
    >
      <Loader onDone={handleEntered} />

      <div ref={revealRef} className="sakura-night">
        <Hero />
        <main>
          <VerseScrub />
          <PetalField />
        </main>
        <SakuraFooter />
      </div>

      {/* Night grain: one static feTurbulence pass over everything — fine
          dust suspended in night air. It never animates. */}
      <svg className="sakura-grain" aria-hidden="true" focusable="false">
        <filter id="sakura-grain-f">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.62"
            numOctaves="2"
            seed="7"
            stitchTiles="stitch"
          />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.91  0 0 0 0 0.53  0 0 0 0 0.62  0 0 0 0.04 0"
          />
        </filter>
        <rect width="100%" height="100%" filter="url(#sakura-grain-f)" />
      </svg>
    </div>
  );
}
