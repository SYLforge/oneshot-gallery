"use client";

import { useEffect, useRef } from "react";
import "./styles.css";
import { gowunDodum, notoSerifKR, quicksand } from "./fonts";
import Hero from "./components/Hero";
import CloudParallax from "./components/CloudParallax";
import Descent from "./components/Descent";
import NightField from "./components/NightField";
import Footer from "./components/Footer";
import { usePrefersReducedMotion } from "./hooks/usePrefersReducedMotion";
import { useReveal } from "./hooks/useReveal";

/**
 * 꿈 DREAM — a sleep house.
 * A Jeju sleep-and-wellness house above a slow-cloud hill. The page is the
 * hour before sleep: pastel clouds drift in layered depth toward your
 * pointer, a pinned descent slowly dissolves the sky into deep indigo as
 * you scroll down into rest, and a soft feTurbulence haze breathes over
 * everything like the veil of a closing eye. Where its sister SUP is
 * grounded (grass, growth, earth, green), DREAM is airborne — clouds,
 * drift, weightless pastel.
 *
 * `.dream-js` is added on mount so every pre-reveal style is JS-gated —
 * with JavaScript disabled the full page (clouds resting, descent shown at
 * its awake composition) is simply visible.
 */
export default function DreamPage() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const reduced = usePrefersReducedMotion();
  const revealRef = useReveal<HTMLDivElement>(reduced);

  useEffect(() => {
    // Imperative on purpose: the class is a signal to CSS that JS is alive,
    // not React state — and it never changes once set.
    rootRef.current?.classList.add("dream-js");
    window.parent?.postMessage({ type: "oneshot:ready", slug: "dream" }, "*");
  }, []);

  return (
    <div
      id="dream-top"
      ref={rootRef}
      className={`${notoSerifKR.variable} ${gowunDodum.variable} ${quicksand.variable} dream-root`}
    >
      <div ref={revealRef} className="dream-sky">
        <Hero />
        <main>
          <CloudParallax />
          <Descent />
          <NightField />
        </main>
        <Footer />
      </div>
    </div>
  );
}
