"use client";

import { useEffect, useRef } from "react";
import "./styles.css";
import { syne, hangul, mono } from "./fonts";
import Hero from "./components/Hero";
import Manifesto from "./components/Manifesto";
import ProductLine from "./components/ProductLine";
import ChromeFooter from "./components/ChromeFooter";
import { usePrefersReducedMotion } from "./hooks/usePrefersReducedMotion";
import { useReveal } from "./hooks/useReveal";

/**
 * CHROME — liquid metal beauty, Seoul.
 * A Y2K beauty house that pours its lip glosses in chrome and seals every
 * card in holographic foil. Chrome silver #c8d0d8 over a holographic
 * mist-sky-pink-mint gradient, deep chrome shadow #2a2a3a as the ink.
 * The chrome headline is a WebGL fragment shader (liquid metal that ripples
 * to the pointer); the foil is layered CSS whose rainbow sheen drifts with
 * the pointer; the wordmark glyphs reveal in a metallic sweep. Where
 * PIXEL is pixel-art arcade, CHROME is liquid chrome beauty — glossy,
 * metallic, reflective, and never blocky.
 *
 * `.chrome-js` is added on mount so every pre-reveal style is JS-gated —
 * with JavaScript disabled the full page is simply visible, the headline
 * resting in its CSS chrome-gradient fill, the foil in its neutral rainbow.
 */
export default function ChromePage() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const reduced = usePrefersReducedMotion();
  const revealRef = useReveal<HTMLDivElement>(reduced);

  useEffect(() => {
    // Imperative on purpose: the class is a signal to CSS that JS is alive,
    // not React state — and it never changes once set.
    rootRef.current?.classList.add("chrome-js");
    window.parent?.postMessage({ type: "oneshot:ready", slug: "chrome" }, "*");
  }, []);

  return (
    <div
      id="chrome-top"
      ref={rootRef}
      className={`${syne.variable} ${hangul.variable} ${mono.variable} chrome-root`}
    >
      <div ref={revealRef} className="chrome-sheet">
        <Hero />
        <main>
          <Manifesto />
          <ProductLine />
        </main>
        <ChromeFooter />
      </div>
    </div>
  );
}
