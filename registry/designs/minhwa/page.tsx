"use client";

import { useEffect, useRef } from "react";
import "./styles.css";
import { gaegu, notoSerifKR, fraunces } from "./fonts";
import Hero from "./components/Hero";
import PeonyProsperity from "./components/PeonyProsperity";
import ObangsaekNavigator from "./components/ObangsaekNavigator";
import LongevitySymbols from "./components/LongevitySymbols";
import FolkFooter from "./components/FolkFooter";
import { usePrefersReducedMotion } from "./hooks/usePrefersReducedMotion";
import { useReveal } from "./hooks/useReveal";
import { useLongevityScrub } from "./hooks/useLongevityScrub";

/**
 * MINHWA — 민화 / A Gallery of Wishes.
 *
 * A joyful folk-painting gallery where every motif is a wish: 호랑이와 까치
 * (good news + protection), 모란 (prosperity), 십장생 (long life) under 해와
 * 달. Aged hanji ground, ink-black line work, and the obangsaek five-color
 * system as the cosmology behind every painting — not decoration. Minhwa is
 * the bright opposite of austere ink: naive, vivid, generous, full of
 * meaning. The illustrations are generated (ComfyUI; recipe in
 * image-recipe.md) and carry no text — every Hangul caption, symbol meaning,
 * and seal is real HTML/SVG/CSS.
 *
 * `.minhwa-js` is added imperatively on mount (it never changes — a signal
 * to CSS that JS is alive, not React state): every pre-reveal style is
 * gated behind it, and with JavaScript off the full gallery simply stands
 * finished — every minhwa, every meaning, every seal visible. The reveal
 * observer and the longevity scrub both attach to the same root; under
 * reduced motion the scrub never runs and the longevity section opens as a
 * composed grid.
 *
 * The page is Korean-first: every pairing leads with Hangul, English is the
 * leaning subtitle. Gaegu (a naive hand-brushed face) is the display voice
 * — Black Han Sans would shout; Gaegu smiles, which is what a minhwa does.
 */
export default function MinhwaPage() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const reduced = usePrefersReducedMotion();
  const revealRef = useReveal<HTMLDivElement>(reduced);
  const longRef = useRef<HTMLElement | null>(null);

  // One callback ref merges the page-root refs (the reveal observer watches
  // [data-reveal] descendants inside the same root). The longevity section
  // ref is separate — useLongevityScrub watches its own outer track.
  const setRootNode = (node: HTMLDivElement | null) => {
    rootRef.current = node;
    revealRef.current = node;
  };

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    el.classList.add("minhwa-js");
    window.parent?.postMessage({ type: "oneshot:ready", slug: "minhwa" }, "*");
  }, []);

  useLongevityScrub(longRef, reduced);

  return (
    <div
      id="minhwa-top"
      ref={setRootNode}
      className={`${gaegu.variable} ${notoSerifKR.variable} ${fraunces.variable} minhwa-root`}
    >
      <Hero />
      <main>
        <PeonyProsperity />
        <ObangsaekNavigator />
        <LongevitySymbols reduced={reduced} ref={longRef} />
      </main>
      <FolkFooter />

      {/* Hanji grain: one static feTurbulence pass over the whole sheet.
          Warm aged fibers, never animated — the page is a sheet of paper,
          not a screen. Decorative; pointer-transparent. */}
      <div className="minhwa-grain" aria-hidden="true">
        <svg width="100%" height="100%" preserveAspectRatio="none">
          <filter id="minhwa-grain-f" x="0" y="0" width="100%" height="100%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.7"
              numOctaves="2"
              seed="11"
              stitchTiles="stitch"
            />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0.10  0 0 0 0 0.08  0 0 0 0 0.06  0 0 0 0.065 0"
            />
          </filter>
          <rect width="100%" height="100%" filter="url(#minhwa-grain-f)" />
        </svg>
      </div>
    </div>
  );
}
