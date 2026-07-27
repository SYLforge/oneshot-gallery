"use client";

import { useEffect, useRef } from "react";
import "./styles.css";
import { notoSerifKR, oswald } from "./fonts";
import Hero from "./components/Hero";
import MarqueeBand from "./components/MarqueeBand";
import LeadEssay from "./components/LeadEssay";
import ArticleGrid from "./components/ArticleGrid";
import ZineFooter from "./components/ZineFooter";
import { usePrefersReducedMotion } from "./hooks/usePrefersReducedMotion";
import { useReveal } from "./hooks/useReveal";

/**
 * 잡지 ZINE — The Photocopy Underground, No. 32.
 * An independent punk-culture zine that reads like a photocopied collage:
 * a loud, dense, layered magazine where YEOBAEK (the sibling
 * editorial-serif entry) is quiet, airy, and literary. The page is the
 * issue itself — a masthead poster, a scrolling credits band, a lead
 * essay set in multi-column newsprint with a drop cap and a highlighter
 * pull quote, a dense grid of halftone-photo features that wipe in with
 * clip-path cuts, and a back-page colophon.
 *
 * `.zine-js` is added on mount so every scroll-driven style is JS-gated:
 * with JavaScript disabled the whole issue is simply readable — every
 * photo shown, every paragraph present, the marquee a static overflow row —
 * a clean printed zine.
 */
export default function ZinePage() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const reduced = usePrefersReducedMotion();
  const revealRef = useReveal<HTMLDivElement>(reduced);

  useEffect(() => {
    // Imperative on purpose: the class is a signal to CSS that JS is alive,
    // not React state — and it never changes once set.
    rootRef.current?.classList.add("zine-js");
    window.parent?.postMessage({ type: "oneshot:ready", slug: "zine" }, "*");
  }, []);

  return (
    <div
      id="zine-top"
      ref={rootRef}
      className={`${notoSerifKR.variable} ${oswald.variable} zine-root`}
    >
      <div ref={revealRef} className="zine-issue">
        <Hero />
        <MarqueeBand />
        <main>
          <LeadEssay />
          <ArticleGrid />
        </main>
        <ZineFooter />
      </div>
    </div>
  );
}
