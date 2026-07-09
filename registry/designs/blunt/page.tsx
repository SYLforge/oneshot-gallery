"use client";

import { useEffect, useRef } from "react";
import "./styles.css";
import { archivoBlack, doHyeon, ibmPlexMono } from "./fonts";
import Hero from "./components/Hero";
import MarqueeBand from "./components/MarqueeBand";
import StickerBoard from "./components/StickerBoard";
import PriceList from "./components/PriceList";
import ShopFooter from "./components/ShopFooter";

/**
 * BLUNT — riso print works, Euljiro, Seoul.
 * A two-person risograph co-op that hates minimalism and prints LOUD.
 * Paper background, ink black type, acid yellow / riso blue / fluorescent
 * red plates that multiply where they overlap — plus a feTurbulence paper
 * grain over the whole sheet.
 *
 * `.blunt-js` is added on mount so every JS-dependent style (grab cursors,
 * the misregistration twitch) is gated — with JavaScript disabled the page
 * is simply a finished print: everything readable, nothing moving.
 */
export default function BluntPage() {
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Imperative on purpose: the class is a signal to CSS that JS is alive,
    // not React state — and it never changes once set.
    rootRef.current?.classList.add("blunt-js");
    window.parent?.postMessage({ type: "oneshot:ready", slug: "blunt" }, "*");
  }, []);

  return (
    <div
      ref={rootRef}
      className={`${archivoBlack.variable} ${doHyeon.variable} ${ibmPlexMono.variable} blunt-root`}
    >
      <Hero />
      <main>
        <MarqueeBand />
        <StickerBoard />
        <PriceList />
      </main>
      <ShopFooter />

      {/* Paper grain: static feTurbulence noise, multiplied over the sheet.
          Purely decorative, pointer-transparent. */}
      <div className="blunt-grain" aria-hidden="true">
        <svg width="100%" height="100%" preserveAspectRatio="none">
          <filter id="blunt-grain-f" x="0" y="0" width="100%" height="100%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.8"
              numOctaves="2"
              stitchTiles="stitch"
            />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.1 0"
            />
          </filter>
          <rect width="100%" height="100%" filter="url(#blunt-grain-f)" />
        </svg>
      </div>
    </div>
  );
}
