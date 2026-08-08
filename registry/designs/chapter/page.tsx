"use client";

import { useEffect, useRef } from "react";
import "./styles.css";
import { inter, notoSerifKR } from "./fonts";
import { useReveal } from "./hooks/useReveal";
import TitlePage from "./components/TitlePage";
import ChapterSpreads from "./components/ChapterSpreads";
import Colophon from "./components/Colophon";

/**
 * CHAPTER — 시간의 책, The Book of Hours.
 *
 * An editorial-serif entry: a digital book where a day is set as six hours,
 * each hour a chapter. scroll-scrub-pinned (the spreads are pinned and
 * crossfade as you scroll, like turning a page), char-split-reveal (the
 * cover glyphs drop in), clip-path-reveal (the marginalia notes wipe in).
 *
 * The page is the orchestrator only: it mounts the root, hands a reveal ref
 * to the document, and composes the three leaves — the title page, the pinned
 * spreads (the signature moment), and the colophon. `.chapter-js` is added on
 * mount so every scroll-driven style is JS-gated; with JavaScript disabled the
 * whole book is simply readable — every chapter present, the title page
 * complete, the colophon set down — a clean printed book.
 */
export default function ChapterPage() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const revealRef = useReveal<HTMLDivElement>();

  useEffect(() => {
    // Imperative on purpose: the class is a signal to CSS that JS is alive,
    // not React state — and it never changes once set.
    rootRef.current?.classList.add("chapter-js");
    window.parent?.postMessage({ type: "oneshot:ready", slug: "chapter" }, "*");
  }, []);

  return (
    <div
      id="chapter-top"
      ref={rootRef}
      className={`${inter.variable} ${notoSerifKR.variable} chapter-root`}
    >
      <div ref={revealRef} className="chapter-doc">
        <TitlePage />
        <main>
          <ChapterSpreads />
        </main>
        <Colophon />
      </div>
    </div>
  );
}
