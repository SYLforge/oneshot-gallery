"use client";

import { useEffect, useRef } from "react";
import "./styles.css";
import { gowunDodum, instrumentSerif } from "./fonts";
import Hero from "./components/Hero";
import WindField from "./components/WindField";
import BreathingGuide from "./components/BreathingGuide";
import Retreats from "./components/Retreats";
import Footer from "./components/Footer";
import { usePrefersReducedMotion } from "./hooks/usePrefersReducedMotion";
import { useReveal } from "./hooks/useReveal";

/**
 * 숲 SUP — forest bathing retreats.
 * A Korean forest-bathing house below a birch ridge in Gangwon-do. The page
 * is the walk itself: an L-system tree draws itself in as you arrive, a
 * canvas meadow bends under the breeze your pointer makes, and a 4·4·4
 * breathing guide counts with you. Everything green is drawn by code —
 * there is not one raster image here.
 *
 * `.sup-js` is added on mount so every pre-reveal style is JS-gated — with
 * JavaScript disabled the full page (plants grown, meadow resting) is
 * simply visible.
 */
export default function SupPage() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const reduced = usePrefersReducedMotion();
  const revealRef = useReveal<HTMLDivElement>(reduced);

  useEffect(() => {
    // Imperative on purpose: the class is a signal to CSS that JS is alive,
    // not React state — and it never changes once set.
    rootRef.current?.classList.add("sup-js");
    window.parent?.postMessage({ type: "oneshot:ready", slug: "sup" }, "*");
  }, []);

  return (
    <div
      id="sup-top"
      ref={rootRef}
      className={`${instrumentSerif.variable} ${gowunDodum.variable} sup-root`}
    >
      <div ref={revealRef} className="sup-ground">
        <Hero />
        <main>
          <WindField />
          <BreathingGuide />
          <Retreats />
        </main>
        <Footer />
      </div>
    </div>
  );
}
