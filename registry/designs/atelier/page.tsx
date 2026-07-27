"use client";

import { useEffect, useRef } from "react";
import "./styles.css";
import { bodoni, notoSerifKr } from "./fonts";
import Masthead from "./components/Masthead";
import Manifesto from "./components/Manifesto";
import Lookbook from "./components/Lookbook";
import { usePrefersReducedMotion } from "./hooks/usePrefersReducedMotion";
import { useReveal } from "./hooks/useReveal";

/**
 * ATELIER — high-fashion maison, the RESERVE collection. The page is a
 * magazine cover made interactive: oversized Bodoni, expensive silence, one
 * rare antique-gold accent. Where ONDO is a single perfume bottle, ATELIER is
 * a full collection lookbook — the editorial-spread-as-website.
 *
 * `.atelier-js` is added imperatively on mount (a signal to CSS that JS is
 * alive, never React state): every pre-reveal style is gated behind it, and
 * with JavaScript off the full lookbook simply stands finished.
 */
export default function AtelierPage() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const reduced = usePrefersReducedMotion();
  const revealRef = useReveal<HTMLDivElement>(reduced);

  useEffect(() => {
    rootRef.current?.classList.add("atelier-js");
    window.parent?.postMessage({ type: "oneshot:ready", slug: "atelier" }, "*");
  }, []);

  return (
    <div
      ref={rootRef}
      className={`${bodoni.variable} ${notoSerifKr.variable} atelier-root`}
    >
      <div ref={revealRef} className="atelier-doc">
        <Masthead />
        <main>
          <Manifesto />
          <Lookbook />
        </main>
        <footer className="atelier-foot">
          <p className="atelier-foot__brand">
            ATELIER <span lang="ko">아틀리에</span>
          </p>
          <p className="atelier-foot__line">
            <span lang="ko">RESERVE 2026 — 한 벌 한 벌, 손으로.</span>{" "}
            RESERVE 2026 — one at a time, by hand.
          </p>
          <p className="atelier-foot__copy">
            © 2026 ATELIER · <span lang="ko">서울</span> Seoul
          </p>
        </footer>
      </div>
    </div>
  );
}
