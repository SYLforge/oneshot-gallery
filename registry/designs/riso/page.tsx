"use client";

import { useEffect, useRef } from "react";
import "./styles.css";
import { lora, notoSerifKR, spaceMono } from "./fonts";
import Hero from "./components/Hero";
import ThePress from "./components/ThePress";
import BookGrid from "./components/BookGrid";
import RegistrationMarks from "./components/RegistrationMarks";
import RisoFooter from "./components/RisoFooter";

/**
 * RISO — an independent press and art-house cinema rendered as a risograph
 * print: uncoated paper ground, three fluorescent spot-color drums
 * (pink / blue / yellow) that overprint with mix-blend-mode: multiply,
 * halftone-dot fields, registration marks at the corners, and a static
 * feTurbulence paper grain over the whole sheet. A literary serif voice
 * (Noto Serif KR + Lora) sets it apart from the gallery's brutalist riso
 * sibling (blunt): blunt is one-ink, hard-shadow, anti-easing; riso is
 * three-drum, halftone-textured, overprint-built, serif-led.
 *
 * `.riso-js` is added on mount so every JS-dependent style (the misregis-
 * tration drift, the clip-path reveals, the scrubbed press build) is gated
 * — with JavaScript disabled the page is simply a finished three-color
 * print: every layer down, everything readable, nothing moving.
 */
export default function RisoPage() {
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Imperative on purpose: the class is a signal to CSS that JS is alive,
    // not React state — and it never changes once set.
    rootRef.current?.classList.add("riso-js");
    window.parent?.postMessage({ type: "oneshot:ready", slug: "riso" }, "*");
  }, []);

  return (
    <div
      id="riso-top"
      ref={rootRef}
      className={`${notoSerifKR.variable} ${lora.variable} ${spaceMono.variable} riso-root`}
    >
      <RegistrationMarks />

      <Hero />
      <main>
        <ThePress />
        <BookGrid />
      </main>
      <RisoFooter />

      {/* Paper grain: static feTurbulence noise, multiplied over the sheet.
          Sparse dark fiber — never animated; pointer-transparent.
          Distinguish from blunt's grain: that is heavier alpha (0.1) over a
          warmer sheet; this is lighter (0.07) over cooler uncoated stock. */}
      <div className="riso-grain" aria-hidden="true">
        <svg width="100%" height="100%" preserveAspectRatio="none">
          <filter id="riso-grain-f" x="0" y="0" width="100%" height="100%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.9"
              numOctaves="2"
              seed="11"
              stitchTiles="stitch"
            />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.07 0"
            />
          </filter>
          <rect width="100%" height="100%" filter="url(#riso-grain-f)" />
        </svg>
      </div>
    </div>
  );
}
