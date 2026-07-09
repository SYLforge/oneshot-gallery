"use client";

import { useEffect, useRef } from "react";
import "./styles.css";
import { anton, notoSerifKr, spaceMono, spectral } from "./fonts";
import TitleCard from "./components/TitleCard";
import Reel from "./components/Reel";
import ScorePlayer from "./components/ScorePlayer";
import CueSheet from "./components/CueSheet";
import CreditsFooter from "./components/CreditsFooter";
import { usePrefersReducedMotion } from "./hooks/usePrefersReducedMotion";
import { useReveal } from "./hooks/useReveal";

/**
 * HALFLIGHT — original scores for imaginary films.
 * A composer writes music for films that were never shot; this page is the
 * studio's screening room. Every scroll section is a reel: a letterboxed
 * title card, a procedurally drawn film sequence scrubbed by scroll (no
 * video file anywhere), a cue you press play to hear (Web Audio, synthesized
 * live), a screenplay-style cue sheet, and end credits for nobody.
 *
 * `.halflight-js` is added on mount so every scroll/scrub/reveal style is
 * JS-gated — with JavaScript disabled the full page is simply readable.
 */
export default function HalflightPage() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const reduced = usePrefersReducedMotion();
  const revealRef = useReveal<HTMLElement>(reduced);

  useEffect(() => {
    // Imperative on purpose: the class is a signal to CSS that JS is alive,
    // not React state — and className never changes, so it sticks.
    rootRef.current?.classList.add("halflight-js");
    window.parent?.postMessage(
      { type: "oneshot:ready", slug: "halflight" },
      "*",
    );
  }, []);

  return (
    <div
      id="halflight-top"
      ref={rootRef}
      className={`${anton.variable} ${spectral.variable} ${spaceMono.variable} ${notoSerifKr.variable} halflight-root`}
    >
      <main className="halflight-picture" ref={revealRef}>
        <TitleCard />
        <Reel />
        <ScorePlayer />
        <CueSheet />
        <CreditsFooter />
      </main>
    </div>
  );
}
