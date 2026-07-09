"use client";

import { useEffect, useRef } from "react";
import "./styles.css";
import { fraunces, gowunBatang, songMyung } from "./fonts";
import Hero from "./components/Hero";
import Obangsaek from "./components/Obangsaek";
import PatternGallery from "./components/PatternGallery";
import HanjiMethod from "./components/HanjiMethod";
import GuildFooter from "./components/Footer";
import { usePrefersReducedMotion } from "./hooks/usePrefersReducedMotion";
import { useReveal } from "./hooks/useReveal";

/**
 * GIWA — 처마 아래 단청 / Under Painted Eaves.
 * A palace-eave restoration guild documenting dancheong — the five-color
 * painting under Korean roof eaves — and the obangsaek color system it is
 * built from. Hanji-light, Korean-led, every pattern drawn as SVG.
 *
 * `.giwa-js` is added on mount so every animated pre-state (undrawn ink,
 * unflooded paint, hidden reveals) is JS-gated — with JavaScript disabled
 * the page is simply the finished document: painted, legible, still.
 */
export default function GiwaPage() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const reduced = usePrefersReducedMotion();
  const revealRef = useReveal<HTMLDivElement>(reduced);

  useEffect(() => {
    // Imperative on purpose: the class is a signal to CSS that JS is alive,
    // not React state — and it never changes once set.
    rootRef.current?.classList.add("giwa-js");
    window.parent?.postMessage({ type: "oneshot:ready", slug: "giwa" }, "*");
  }, []);

  return (
    <div
      ref={rootRef}
      lang="ko"
      className={`${songMyung.variable} ${gowunBatang.variable} ${fraunces.variable} giwa-root`}
    >
      <div className="giwa-page" ref={revealRef}>
        <Hero />
        <main>
          <Obangsaek />
          <PatternGallery />
          <HanjiMethod />
        </main>
        <GuildFooter />
      </div>

      {/* Hanji fiber: one static feTurbulence sheet multiplied over the
          whole page. Purely decorative, pointer-transparent. */}
      <div className="giwa-grain" aria-hidden="true">
        <svg width="100%" height="100%" preserveAspectRatio="none">
          <filter id="giwa-grain-f" x="0" y="0" width="100%" height="100%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.75"
              numOctaves="2"
              seed="3"
              stitchTiles="stitch"
            />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0.28  0 0 0 0 0.23  0 0 0 0 0.16  0 0 0 0.07 0"
            />
          </filter>
          <rect width="100%" height="100%" filter="url(#giwa-grain-f)" />
        </svg>
      </div>
    </div>
  );
}
