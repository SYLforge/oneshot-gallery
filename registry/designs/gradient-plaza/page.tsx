"use client";

import { useEffect, useRef } from "react";
import "./styles.css";
import { azeretMono, gugi, monoton } from "./fonts";
import Hero from "./components/Hero";
import PAMarquee from "./components/PAMarquee";
import Announcements from "./components/Announcements";
import RadioWindows from "./components/RadioWindows";
import Schedule from "./components/Schedule";
import Footer from "./components/Footer";
import { usePrefersReducedMotion } from "./hooks/usePrefersReducedMotion";
import { useScrollEnergy } from "./hooks/useScrollEnergy";

/**
 * GRADIENT PLAZA — midnight mall radio.
 * A 24-hour station broadcasting from a shopping mall that only exists
 * after closing. The page is the mall at 3:33 AM: a perspective grid floor
 * that rushes when you scroll, PA announcements that smear like a
 * de-converged CRT at speed, and the booth itself — draggable retro-OS
 * windows playing a song nobody hears. No audio is ever played; the radio
 * is a picture of a sound.
 *
 * `.plaza-js` is added on mount so every enhancement (grid canvas, ticker
 * motion, absolute window positions) is JS-gated — with JavaScript disabled
 * the full page simply reads top to bottom.
 */
export default function GradientPlazaPage() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const reduced = usePrefersReducedMotion();
  const energyRef = useScrollEnergy(rootRef, reduced);

  useEffect(() => {
    // Imperative on purpose: the class is a signal to CSS that JS is alive,
    // not React state — and it never changes once set.
    rootRef.current?.classList.add("plaza-js");
    window.parent?.postMessage(
      { type: "oneshot:ready", slug: "gradient-plaza" },
      "*",
    );
  }, []);

  return (
    <div
      id="plaza-top"
      ref={rootRef}
      className={`${monoton.variable} ${gugi.variable} ${azeretMono.variable} plaza-root`}
    >
      <Hero reduced={reduced} energyRef={energyRef} />
      <PAMarquee reduced={reduced} energyRef={energyRef} />
      <main>
        <Announcements />
        <RadioWindows reduced={reduced} />
        <Schedule />
      </main>
      <Footer />
    </div>
  );
}
