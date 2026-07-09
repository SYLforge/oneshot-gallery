"use client";

import { useEffect, useRef } from "react";
import "./styles.css";
import { libreCaslon, nanumMyeongjo } from "./fonts";
import Masthead from "./components/Masthead";
import LeadEssay from "./components/LeadEssay";
import EmptinessGallery from "./components/EmptinessGallery";
import Colophon from "./components/Colophon";
import { usePrefersReducedMotion } from "./hooks/usePrefersReducedMotion";
import { useReveal } from "./hooks/useReveal";

/**
 * 여백 YEOBAEK — The Journal of Blank Space, No. 07.
 * A bilingual literary magazine about yeobaek — negative space in Korean
 * art and life. The page is the issue itself: an ivory cover that
 * demonstrates its own subject, a lead essay whose tipped-in plates pin
 * while the text flows past, margin footnotes that arrive quietly, and a
 * gallery of mostly-empty plates. The discipline throughout is typographic
 * rhythm and the deliberate use of emptiness — whitespace is the design.
 *
 * `.yeobaek-js` is added on mount so every scroll-driven style is JS-gated:
 * with JavaScript disabled the whole issue is simply readable, strokes
 * drawn, footnotes present — a clean printed document.
 */
export default function YeobaekPage() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const reduced = usePrefersReducedMotion();
  const revealRef = useReveal<HTMLDivElement>(reduced);

  useEffect(() => {
    // Imperative on purpose: the class is a signal to CSS that JS is alive,
    // not React state — and it never changes once set.
    rootRef.current?.classList.add("yeobaek-js");
    window.parent?.postMessage({ type: "oneshot:ready", slug: "yeobaek" }, "*");
  }, []);

  return (
    <div
      id="yeobaek-top"
      ref={rootRef}
      className={`${nanumMyeongjo.variable} ${libreCaslon.variable} yeobaek-root`}
    >
      <div ref={revealRef} className="yeobaek-issue">
        <Masthead />
        <main>
          <LeadEssay />
          <EmptinessGallery />
        </main>
        <Colophon />
      </div>
    </div>
  );
}
