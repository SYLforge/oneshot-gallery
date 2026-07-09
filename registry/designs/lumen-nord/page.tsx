"use client";

import { useEffect, useRef } from "react";
import "./styles.css";
import { hahmlet, sora } from "./fonts";
import Hero from "./components/Hero";
import BulletinPanels from "./components/BulletinPanels";
import ForecastLog from "./components/ForecastLog";
import Footer from "./components/Footer";
import { usePrefersReducedMotion } from "./hooks/usePrefersReducedMotion";
import { useReveal } from "./hooks/useReveal";
import { useScrollTemperature } from "./hooks/useScrollTemperature";

/**
 * LUMEN NORD — aurora forecast bureau.
 * A fictional Nordic–Korean joint observatory that issues nightly aurora
 * forecasts the way other agencies issue weather: Kp readings, visibility
 * windows, and one poetic advisory per bulletin. Hahmlet speaks for the sky,
 * Sora for the instruments; a pointer-warped WebGL aurora carries the light.
 *
 * `.lumen-js` is added on mount so every scroll-reveal style is JS-gated —
 * with JavaScript disabled the full bulletin is simply readable, over the
 * CSS-gradient aurora that also serves as the WebGL fallback.
 */
export default function LumenNordPage() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const reduced = usePrefersReducedMotion();
  useReveal(rootRef, reduced);
  useScrollTemperature(rootRef);

  useEffect(() => {
    // Imperative on purpose: the class is a signal to CSS that JS is alive,
    // not React state — and it never changes once set.
    rootRef.current?.classList.add("lumen-js");
    window.parent?.postMessage(
      { type: "oneshot:ready", slug: "lumen-nord" },
      "*",
    );
  }, []);

  return (
    <div
      id="lumen-top"
      ref={rootRef}
      className={`${hahmlet.variable} ${sora.variable} lumen-root`}
    >
      <Hero reduced={reduced} />
      <main>
        <BulletinPanels />
        <ForecastLog />
      </main>
      <Footer />
    </div>
  );
}
