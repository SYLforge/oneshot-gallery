"use client";

import { useEffect, useRef } from "react";
import "./styles.css";
import { italiana, notoSerifKr } from "./fonts";
import Hero from "./components/Hero";
import Bottle from "./components/Bottle";
import Collection from "./components/Collection";
import Notes from "./components/Notes";
import Footer from "./components/Footer";
import { usePrefersReducedMotion } from "./hooks/usePrefersReducedMotion";
import { useReveal } from "./hooks/useReveal";

/**
 * ONDO — perfume atelier, Seoul.
 * A house that titles its scents by temperature: 36.5° (the body), first
 * snow, the warm floor of an ondol room. Noir, champagne, cream, vermeil;
 * Italiana hairlines over Noto Serif KR. There is deliberately not one
 * raster image on this page — the bottle is SVG gradients, and the "glass"
 * over it is a canvas re-rendering that SVG through a noise displacement
 * field. Luxury as arithmetic, not stock photography.
 *
 * `.ondo-js` is added on mount so every pre-reveal style is JS-gated —
 * with JavaScript disabled the full page (bottle included) is simply
 * visible, resting in its final airy state.
 */
export default function OndoPage() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const reduced = usePrefersReducedMotion();
  const revealRef = useReveal<HTMLDivElement>(reduced);

  useEffect(() => {
    // Imperative on purpose: the class is a signal to CSS that JS is alive,
    // not React state — and it never changes once set.
    rootRef.current?.classList.add("ondo-js");
    window.parent?.postMessage({ type: "oneshot:ready", slug: "ondo" }, "*");
  }, []);

  return (
    <div
      id="ondo-top"
      ref={rootRef}
      className={`${italiana.variable} ${notoSerifKr.variable} ondo-root`}
    >
      <div ref={revealRef} className="ondo-sheet">
        <Hero />
        <main>
          <Bottle />
          <Collection />
          <Notes />
        </main>
        <Footer />
      </div>
    </div>
  );
}
