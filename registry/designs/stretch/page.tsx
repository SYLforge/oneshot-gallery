"use client";

import { useEffect, useRef } from "react";
import "./styles.css";
import { cormorantGaramond, notoSerifKR } from "./fonts";
import Hero from "./components/Hero";
import PoseSequence from "./components/PoseSequence";
import BreathCircle from "./components/BreathCircle";
import StudioFooter from "./components/StudioFooter";
import { usePrefersReducedMotion } from "./hooks/usePrefersReducedMotion";
import { useReveal } from "./hooks/useReveal";

/**
 * 늘어남 STRETCH — A Studio That Breathes.
 * A bilingual (KO-first) yoga & wellness studio site where the typography
 * itself stretches: the hero wordmark reaches on mount, the pinned
 * pose-sequence elongates each asana's name as you scroll, and
 * breathing-circle backgrounds drift behind it all. The product of the
 * studio — lengthening, breath, calm — is the motion of the page.
 *
 * `.stretch-js` is added on mount so every scroll-driven style is
 * JS-gated: with JavaScript disabled the whole studio is simply
 * readable — wordmark stretched, poses at full reach, names written, a
 * finished static poster.
 */
export default function StretchPage() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const reduced = usePrefersReducedMotion();
  const revealRef = useReveal<HTMLDivElement>(reduced);

  useEffect(() => {
    // Imperative on purpose: the class signals JS is alive to CSS, and it
    // never changes once set.
    rootRef.current?.classList.add("stretch-js");
    window.parent?.postMessage({ type: "oneshot:ready", slug: "stretch" }, "*");
  }, []);

  return (
    <div
      id="stretch-top"
      ref={rootRef}
      className={`${notoSerifKR.variable} ${cormorantGaramond.variable} stretch-root`}
    >
      <BreathCircle />
      <div ref={revealRef} className="stretch-issue">
        <Hero />
        <main>
          <PoseSequence />
        </main>
        <StudioFooter />
      </div>
    </div>
  );
}
