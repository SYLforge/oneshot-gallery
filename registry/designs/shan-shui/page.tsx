"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import "./styles.css";
import { cormorant, maShanZheng, notoSerifSC } from "./fonts";
import Loader from "./components/Loader";
import Hero from "./components/Hero";
import ScrollGuide from "./components/ScrollGuide";
import SealStamp from "./components/SealStamp";
import Footer from "./components/Footer";
import { usePrefersReducedMotion } from "./hooks/usePrefersReducedMotion";
import { useReveal } from "./hooks/useReveal";
import { useScrollProgress } from "./hooks/useScrollProgress";

/**
 * 山水 SHAN-SHUI — a procedurally-generated, infinitely-scrolling Chinese
 * ink-wash landscape that paints itself live in the browser. The scroll IS
 * the unrolling of a hand scroll (手卷): page-scroll drives a world-x offset
 * through layered value-noise mountains, and distance is expressed as ink
 * density (远山如黛), not perspective. Mist pools in the valleys and leans
 * toward a fine pointer, the weather slowly cycles through the four seasons,
 * and a vermillion seal marks the scroll. Everything on screen is code — the
 * mountains are canvas, the seal is SVG. No image would be still enough.
 *
 * `.shan-js` is added imperatively on mount (it never changes, so it is a
 * signal to CSS that JS is alive, not React state): every pre-reveal style
 * is gated behind it, and with JavaScript off the full page simply stands
 * finished — the SSR landscape backdrop is already a painting. The `entered`
 * state is React's, because the hero's cadence genuinely depends on the
 * loader lifting.
 */
export default function ShanShuiPage() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const reduced = usePrefersReducedMotion();
  const revealRef = useReveal<HTMLDivElement>(reduced);
  const scrollRef = useScrollProgress();
  const [entered, setEntered] = useState(false);
  const handleEntered = useCallback(() => setEntered(true), []);

  useEffect(() => {
    rootRef.current?.classList.add("shan-js");
    window.parent?.postMessage({ type: "oneshot:ready", slug: "shan-shui" }, "*");
  }, []);

  return (
    <div
      id="shan-top"
      ref={rootRef}
      className={`${cormorant.variable} ${maShanZheng.variable} ${notoSerifSC.variable} shan-root`}
    >
      <Loader onDone={handleEntered} />

      <div ref={revealRef} className="shan-sheet">
        <Hero entered={entered} scrollRef={scrollRef} />
        <main>
          <ScrollGuide />
          <SealStamp />
        </main>
        <Footer />
      </div>

      {/* Xuan grain: one static feTurbulence pass over everything.
          Rice-paper fibers, not film grain — it never animates. */}
      <svg className="shan-grain" aria-hidden="true" focusable="false">
        <filter id="shan-grain-f">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.62"
            numOctaves="2"
            seed="8"
            stitchTiles="stitch"
          />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.102  0 0 0 0 0.09  0 0 0 0 0.078  0 0 0 0.05 0"
          />
        </filter>
        <rect width="100%" height="100%" filter="url(#shan-grain-f)" />
      </svg>
    </div>
  );
}
