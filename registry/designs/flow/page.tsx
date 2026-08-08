"use client";

import { useEffect, useRef } from "react";
import "./styles.css";
import { inter, notoSansKR } from "./fonts";
import FlowHero from "./components/FlowHero";
import FlowingVerse from "./components/FlowingVerse";
import FlowLaws from "./components/FlowLaws";
import FlowFooter from "./components/FlowFooter";
import { useReveal } from "./hooks/useReveal";
import { usePrefersReducedMotion } from "./hooks/usePrefersReducedMotion";

/**
 * FLOW — 흐름, 글자의 강. A journaling app whose whole identity is that
 * letters flow like water. The hero wordmark drifts in over a living canvas
 * river (char-split-reveal, each glyph settling sideways); a pinned verse
 * section holds while four stanzas flow past with the scroll
 * (scroll-scrub-pinned); and the title leans gently toward the pointer
 * over the river (pointer-parallax). The feature section names five real
 * laws of liquid — rheology, surface tension, laminar flow, turbulence,
 * viscosity — and reads each as a law of writing.
 *
 * `flow-js` is added on mount; without JS the page is a finished, readable
 * journal — the river replaced by a CSS sky wash, the verses stacked in
 * full, the laws a static list. The whole entry is pure code: no images,
 * no audio, no dependencies beyond the two fontsource families.
 */
export default function FlowPage() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const reduced = usePrefersReducedMotion();
  // One reveal observer on the root scrolls every [data-reveal] in as it
  // enters — the sections opt in individually by carrying the attribute.
  const revealRef = useReveal<HTMLDivElement>(reduced);

  useEffect(() => {
    // Imperative on purpose: the class signals to CSS that JS is alive, and
    // never changes once set. SSR markup stays the finished page.
    rootRef.current?.classList.add("flow-js");
    window.parent?.postMessage({ type: "oneshot:ready", slug: "flow" }, "*");
  }, []);

  return (
    <div
      id="flow-top"
      ref={rootRef}
      className={`${inter.variable} ${notoSansKR.variable} flow-root`}
    >
      <div ref={revealRef} className="flow-sky">
        <FlowHero />
        <main>
          <FlowingVerse />
          <FlowLaws />
        </main>
        <FlowFooter />
      </div>
    </div>
  );
}
