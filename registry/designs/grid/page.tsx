"use client";

import { useEffect, useRef } from "react";
import "./styles.css";
import { inter, notoSansKR, jetbrainsMono } from "./fonts";
import PlateScope from "./components/PlateScope";
import Hero from "./components/Hero";
import PlateBoard from "./components/PlateBoard";
import SectionBuild from "./components/SectionBuild";
import Footer from "./components/Footer";

/**
 * GRID — atelier of measured form.
 * A fictional architecture practice that publishes its work as large-format
 * typographic plates. Three colors (paper, ink, one signal red), one type
 * family whose thin weights do all the talking, and a 12-column field the
 * plates move across as the typology filter changes. The grid is the
 * instrument, not the subject.
 *
 * `.grid-js` is added on mount so every entrance animation, the FLIP
 * repack, and the scroll-scrub are JS-gated — with JavaScript disabled the
 * page is simply the finished portfolio: all eight plates shown, the
 * section drawing fully built.
 */
export default function GridPage() {
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Imperative on purpose: the class is a signal to CSS that JS is alive,
    // not React state — and it never changes once set.
    rootRef.current?.classList.add("grid-js");
    window.parent?.postMessage({ type: "oneshot:ready", slug: "grid" }, "*");
  }, []);

  return (
    <div
      ref={rootRef}
      className={`${inter.variable} ${notoSansKR.variable} ${jetbrainsMono.variable} grid-root`}
    >
      <PlateScope>
        <Hero />
        <main>
          <PlateBoard />
          <SectionBuild />
        </main>
        <Footer />
      </PlateScope>
    </div>
  );
}
