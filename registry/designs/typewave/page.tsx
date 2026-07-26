"use client";

import { useEffect, useRef } from "react";
import "./styles.css";
import { archivo, blackHanSans, notoSansKR, spaceMono } from "./fonts";
import Hero from "./components/Hero";
import ScrubWordmark from "./components/ScrubWordmark";
import MarqueeBands from "./components/MarqueeBands";
import TrackList from "./components/TrackList";
import KineticFooter from "./components/KineticFooter";
import { usePrefersReducedMotion } from "./hooks/usePrefersReducedMotion";
import { useReveal } from "./hooks/useReveal";
import { useScrollVelocity } from "./hooks/useScrollVelocity";

/**
 * TYPEWAVE — type that plays like a track.
 * An electronic artist's landing where typography is the instrument. The
 * wordmark stretches on scroll velocity, scrubs across its full width/weight
 * range in a pinned section, and runs lyric ticker bands at crossed speeds.
 * Pure black ground, one acid-green accent, Korean-first copy — the whole
 * page reads like a visualizer for a track you cannot hear.
 *
 * `.typewave-js` is added on mount so every entrance, scrub, marquee, and
 * velocity stretch is JS-gated — with JavaScript disabled the full page is
 * simply readable: the wordmark stands at its resting width, the scrub
 * corridor is normal flow, the marquees sit static, the tracklist is a plain
 * list.
 *
 * A single shared velocity ref (`velRef`) is the page's amplitude bus: the
 * scroll-velocity hook writes to it on scroll, and the hero + tracklist
 * heads read it inside their own rAF loops to drive per-glyph stretch and
 * tracking — one source of truth, no React renders per frame.
 */
export default function TypewavePage() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const reduced = usePrefersReducedMotion();
  const revealRef = useReveal<HTMLElement>(reduced);
  // The amplitude bus: enabled only when motion is allowed. Under reduced
  // motion the ref stays at 0 and the consumers rest at their static state.
  const velRef = useScrollVelocity(!reduced);

  useEffect(() => {
    // Imperative on purpose: the class is a signal to CSS that JS is alive,
    // not React state — and it never changes once set.
    rootRef.current?.classList.add("typewave-js");
    window.parent?.postMessage({ type: "oneshot:ready", slug: "typewave" }, "*");
  }, []);

  return (
    <div
      id="typewave-top"
      ref={rootRef}
      className={`${archivo.variable} ${blackHanSans.variable} ${notoSansKR.variable} ${spaceMono.variable} typewave-root`}
    >
      <main className="typewave-stage" ref={revealRef}>
        <Hero velRef={velRef} />
        <ScrubWordmark />
        <MarqueeBands />
        <TrackList velRef={velRef} />
        <KineticFooter />
      </main>
    </div>
  );
}
