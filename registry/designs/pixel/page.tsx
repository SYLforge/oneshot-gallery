"use client";

import { useEffect, useRef } from "react";
import "./styles.css";
import { gugi, pressStart2P, vt323 } from "./fonts";
import Hero from "./components/Hero";
import HighScoreMarquee from "./components/HighScoreMarquee";
import GameGrid from "./components/GameGrid";
import PixelFooter from "./components/PixelFooter";
import CRTOverlay from "./components/CRTOverlay";
import { usePrefersReducedMotion } from "./hooks/usePrefersReducedMotion";
import { useScrollRush } from "./hooks/useScrollRush";

/**
 * PIXEL — an 8-bit arcade studio landing page.
 * A retro indie-game studio for games that fit in 32 kilobytes. The page is
 * a 2003 arcade that still believes someone is playing: a hero mascot drawn
 * one CSS box-shadow per pixel, a CRT scanline + chromatic-aberration glow
 * that breathes on idle and smears when you scroll, and a chiptune
 * high-score marquee. Saturated dopamine color — bubblegum, cyan, chrome,
 * acid — and the warm optimism of a CRT, not vaporwave's melancholic mauve.
 *
 * `.pixel-js` is added on mount so every enhancement (CRT flicker, sprite
 * cycle, scroll-rush aberration, marquee motion) is JS-gated — with
 * JavaScript disabled the full page reads top to bottom: static sprites,
 * a static scanline grille, static scores.
 */
export default function PixelPage() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const reduced = usePrefersReducedMotion();
  const energyRef = useScrollRush(rootRef, reduced);

  useEffect(() => {
    // Imperative on purpose: the class is a signal to CSS that JS is alive,
    // not React state — and it never changes once set.
    rootRef.current?.classList.add("pixel-js");
    window.parent?.postMessage(
      { type: "oneshot:ready", slug: "pixel" },
      "*",
    );
  }, []);

  return (
    <div
      id="pixel-top"
      ref={rootRef}
      className={`${pressStart2P.variable} ${gugi.variable} ${vt323.variable} pixel-root`}
    >
      <CRTOverlay reduced={reduced} />
      <Hero reduced={reduced} />
      <HighScoreMarquee reduced={reduced} energyRef={energyRef} />
      <main>
        <GameGrid />
      </main>
      <PixelFooter />
    </div>
  );
}
