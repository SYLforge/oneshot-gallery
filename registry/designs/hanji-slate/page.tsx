"use client";

import { useEffect, useRef } from "react";
import "./styles.css";
import { hankenGrotesk, jetbrainsMono, notoSansKr } from "./fonts";
import Hero from "./components/Hero";
import BentoGrid from "./components/BentoGrid";
import ExplodedView from "./components/ExplodedView";
import SpecSheet from "./components/SpecSheet";
import SlateFooter from "./components/SlateFooter";

/**
 * HANJI SLATE — the paper computer.
 * A fictional e-ink writing slate by Onji Works, Seoul: hanji, upgraded.
 * The page is its product sheet — bento-product on warm paper, graphite
 * type, one amber, the device drawn entirely in SVG.
 *
 * `.slate-js` is added on mount so every JS-dependent style (collapsed
 * bento details, the 280vh exploded-view runway) is gated — with
 * JavaScript disabled the page is a finished print: everything readable,
 * the diagram assembled and labeled, nothing hidden.
 */
export default function HanjiSlatePage() {
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Imperative on purpose: the class is a signal to CSS that JS is alive,
    // not React state — and it never changes once set.
    rootRef.current?.classList.add("slate-js");
    window.parent?.postMessage(
      { type: "oneshot:ready", slug: "hanji-slate" },
      "*",
    );
  }, []);

  return (
    <div
      ref={rootRef}
      className={`${hankenGrotesk.variable} ${notoSansKr.variable} ${jetbrainsMono.variable} slate-root`}
    >
      <Hero />
      <main>
        <BentoGrid />
        <ExplodedView />
        <SpecSheet />
      </main>
      <SlateFooter />
    </div>
  );
}
