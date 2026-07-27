"use client";

import { useEffect, useRef } from "react";
import "./styles.css";
import { majorMonoDisplay, notoSansKR, spaceMono } from "./fonts";
import GlitchHero from "./components/GlitchHero";
import Manifesto from "./components/Manifesto";
import AsciiCorrupt from "./components/AsciiCorrupt";
import TrackList from "./components/TrackList";
import GlitchFooter from "./components/GlitchFooter";
import { usePrefersReducedMotion } from "./hooks/usePrefersReducedMotion";
import { useGlitchReveal } from "./hooks/useGlitchReveal";

/**
 * GLITCH — corrupted-signal studio.
 * A VFX & experimental-music studio that ships the artifacts other studios
 * delete: datamoshed type, RGB-split wordmarks, scanline + noise overlays,
 * ASCII that scrambles itself periodically. Where PALE.SIGNAL is clean
 * phosphor poetry, GLITCH is corrupted, broken-beautiful — failing hardware
 * made intentional.
 *
 * `.gl-js` is added on mount so every clip-path tear and scramble is
 * JS-gated: with JavaScript disabled the full page is simply visible.
 */
export default function GlitchPage() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const reduced = usePrefersReducedMotion();
  const revealRef = useGlitchReveal<HTMLDivElement>(reduced);

  useEffect(() => {
    // Imperative on purpose: the class signals that JS is alive; className
    // never changes, so it sticks. Every pre-reveal / scramble style is
    // gated behind .gl-js, so no-JS renders the completed page.
    rootRef.current?.classList.add("gl-js");
    window.parent?.postMessage(
      { type: "oneshot:ready", slug: "glitch" },
      "*",
    );
  }, []);

  return (
    <div
      id="gl-top"
      ref={rootRef}
      className={`${majorMonoDisplay.variable} ${spaceMono.variable} ${notoSansKR.variable} gl-root`}
    >
      <div className="gl-screen" ref={revealRef}>
        <GlitchHero />
        <Manifesto />
        <AsciiCorrupt />
        <TrackList />
        <GlitchFooter />
      </div>

      {/* Glass: dense scanlines + datamosh noise grain + RGB-split vignette.
          Purely decorative, pointer-transparent. */}
      <div className="gl-glass" aria-hidden="true">
        <div className="gl-glass__scan" />
        <div className="gl-glass__noise" />
        <div className="gl-glass__vignette" />
      </div>
    </div>
  );
}
