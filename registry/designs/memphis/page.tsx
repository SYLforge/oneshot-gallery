"use client";

import { useEffect, useRef } from "react";
import "./styles.css";
import { spaceGrotesk, blackHanSans } from "./fonts";
import Hero from "./components/Hero";
import ShapeParallax from "./components/ShapeParallax";
import ProjectFlipGrid from "./components/ProjectFlipGrid";
import StudioMarquee from "./components/StudioMarquee";
import StudioSection from "./components/StudioSection";
import MemphisFooter from "./components/MemphisFooter";
import { usePrefersReducedMotion } from "./hooks/usePrefersReducedMotion";
import { useClipReveal } from "./hooks/useClipReveal";

/**
 * MEMPHIS — 멤피스, a postmodern design-studio portfolio in full
 * Sottsass/Memphis 80s style. Squiggles, terrazzo, confetti, blobs, and
 * zigzags in teal / coral / marigold / cobalt over warm off-white stock.
 * The studio is maximalist but disciplined: every shape has a job, the
 * palette is exactly five, every line is 3px.
 *
 * Three techniques carry the page: shapes wipe in via geometric clip-path
 * cuts on scroll (clip-path-reveal), the shape field drifts toward the
 * pointer at layered depths (pointer-parallax), and the project grid
 * FLIP-rearranges on filter (flip-layout).
 *
 * `.memphis-js` is added on mount so every pre-reveal style (clips closed
 * before their wipe, squiggle dashoffsets seeded) is JS-gated — with
 * JavaScript disabled, or under reduced motion, the full page simply sits
 * in its finished state: every shape visible, every squiggle drawn,
 * nothing moving.
 */
export default function MemphisPage() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const reduced = usePrefersReducedMotion();
  const revealRef = useClipReveal<HTMLDivElement>(reduced);

  useEffect(() => {
    // Imperative on purpose: the class signals JS is alive to CSS, and it
    // never changes once set.
    rootRef.current?.classList.add("memphis-js");
    window.parent?.postMessage({ type: "oneshot:ready", slug: "memphis" }, "*");
  }, []);

  return (
    <div
      ref={rootRef}
      className={`${spaceGrotesk.variable} ${blackHanSans.variable} memphis-root`}
    >
      <ShapeParallax />

      <div ref={revealRef} className="memphis-stage">
        <Hero />
        <main>
          <ProjectFlipGrid />
          <StudioMarquee />
          <StudioSection />
        </main>
        <MemphisFooter />
      </div>

      {/* Paper tooth: static feTurbulence noise, multiplied over the sheet.
          Purely decorative, pointer-transparent. */}
      <div className="memphis-grain" aria-hidden="true">
        <svg width="100%" height="100%" preserveAspectRatio="none">
          <filter id="memphis-grain-f" x="0" y="0" width="100%" height="100%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.9"
              numOctaves="2"
              stitchTiles="stitch"
            />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.08 0"
            />
          </filter>
          <rect width="100%" height="100%" filter="url(#memphis-grain-f)" />
        </svg>
      </div>
    </div>
  );
}
