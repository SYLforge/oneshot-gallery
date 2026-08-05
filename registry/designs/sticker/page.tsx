"use client";

import { useEffect, useRef } from "react";
import "./styles.css";
import { blackHanSans, gaegu, inter } from "./fonts";
import Hero from "./components/Hero";
import ServiceMarquee from "./components/ServiceMarquee";
import StickerBoard from "./components/StickerBoard";
import StudioFooter from "./components/StudioFooter";

/**
 * STICKER — studio of bouncy things.
 * A playful design studio whose entire website is built from draggable,
 * springy stickers. Warm white ground, saturated sticker colors, chunky black
 * outlines, and a service marquee that scrolls like a fridge full of magnets.
 *
 * `.sticker-js` is added on mount so every JS-dependent style (grab cursors,
 * reveal-hide initial states, the rest wobble) is gated — with JavaScript
 * disabled the page is a finished sticker pile: everything readable, the
 * stickers sitting at their default scatter, nothing moving.
 */
export default function StickerPage() {
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Imperative on purpose: the class is a signal to CSS that JS is alive,
    // not React state — and it never changes once set.
    rootRef.current?.classList.add("sticker-js");
    window.parent?.postMessage({ type: "oneshot:ready", slug: "sticker" }, "*");
  }, []);

  return (
    <div
      ref={rootRef}
      className={`${blackHanSans.variable} ${gaegu.variable} ${inter.variable} sticker-root`}
    >
      <Hero />
      <main>
        <ServiceMarquee />
        <StickerBoard />
      </main>
      <StudioFooter />

      {/* Paper warmth + dotted backing sheet: static feTurbulence noise and a
          radial dot grid, multiplied over the desk. Purely decorative,
          pointer-transparent. */}
      <div className="sticker-grain" aria-hidden="true">
        <svg width="100%" height="100%" preserveAspectRatio="none">
          <filter id="sticker-grain-f" x="0" y="0" width="100%" height="100%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.9"
              numOctaves="2"
              seed="3"
              stitchTiles="stitch"
            />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.05 0"
            />
          </filter>
          <rect width="100%" height="100%" filter="url(#sticker-grain-f)" />
        </svg>
      </div>
    </div>
  );
}
