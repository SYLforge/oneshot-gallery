"use client";

import { useEffect, useRef } from "react";
import "./styles.css";
import { nanumGothicCoding, vt323 } from "./fonts";
import BootSequence from "./components/BootSequence";
import LogSection from "./components/LogSection";
import SignalField from "./components/SignalField";
import Dishes from "./components/Dishes";
import StationFooter from "./components/StationFooter";
import { usePrefersReducedMotion } from "./hooks/usePrefersReducedMotion";
import { useReveal } from "./hooks/useReveal";

/**
 * PALE.SIGNAL — deep sky listening post.
 * A decommissioned radio observatory on a Korean mountain ridge that still
 * publishes nightly logs of what the sky said. This page is its public
 * terminal: phosphor green on tube black, VT323 + Nanum Gothic Coding,
 * scanlines over everything.
 *
 * `.ps-js` is added on mount so every scroll-reveal style is JS-gated —
 * with JavaScript disabled the full page is simply visible.
 */
export default function PaleSignalPage() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const reduced = usePrefersReducedMotion();
  const revealRef = useReveal<HTMLDivElement>(reduced);

  useEffect(() => {
    // Imperative on purpose: the class is a signal to CSS that JS is alive,
    // not React state — and className never changes, so it sticks.
    rootRef.current?.classList.add("ps-js");
    window.parent?.postMessage(
      { type: "oneshot:ready", slug: "pale-signal" },
      "*",
    );
  }, []);

  return (
    <div
      id="ps-top"
      ref={rootRef}
      className={`${vt323.variable} ${nanumGothicCoding.variable} ps-root`}
    >
      <div className="ps-screen" ref={revealRef}>
        <BootSequence />
        <LogSection />
        <SignalField />
        <Dishes />
        <StationFooter />
      </div>

      {/* CRT glass: scanlines, glare flicker, vignette. Purely decorative. */}
      <div className="ps-crt" aria-hidden="true">
        <div className="ps-crt__scanlines" />
        <div className="ps-crt__glare" />
        <div className="ps-crt__vignette" />
      </div>
    </div>
  );
}
