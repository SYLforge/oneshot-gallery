"use client";

import { useEffect, useRef } from "react";
import "./styles.css";
import { jetbrainsMono, nanumMyeongjo, notoSerifKr } from "./fonts";
import Hero from "./components/Hero";
import ExplodedAxonometric from "./components/ExplodedAxonometric";
import ClimateZones from "./components/ClimateZones";
import SeasonalLight from "./components/SeasonalLight";
import JoineryDetail from "./components/JoineryDetail";
import HanokFooter from "./components/HanokFooter";
import { useSeason } from "./hooks/useSeason";

/**
 * HANOK — 한옥 / the building is the layout.
 * A heritage atelier (Jipdam Atelier · 집담) documents a Korean hanok whose
 * wooden structure becomes the page structure: the mortise-and-tenon joinery
 * (no nails — pieces interlock) is the grid, and the page flows through
 * distinct climate zones — the warm ondol room (온돌방), the cool maru hall
 * (마루), and the open madang courtyard (마당) — under seasonal light.
 *
 * `.hanok-js` is added on mount so every animated pre-state (unsettled
 * glyphs, undrawn eave, exploded runway, unrisen zones) is JS-gated. With
 * JavaScript disabled the page is the finished structure: glyphs at rest,
 * the eave drawn, the diagram assembled and labeled, every zone visible,
 * the season fixed at spring. Nothing is hidden behind a script.
 *
 * Season state lives here so the SeasonalLight toggle and the madang zone
 * share one source of truth; it is reflected to `data-season` on the root
 * for CSS.
 */
export default function HanokPage() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const season = useSeason();

  useEffect(() => {
    // Imperative on purpose: the class is a signal to CSS that JS is alive,
    // not React state — and it never changes once set.
    rootRef.current?.classList.add("hanok-js");
    rootRef.current?.setAttribute("data-season", season.season);
    window.parent?.postMessage(
      { type: "oneshot:ready", slug: "hanok" },
      "*",
    );
  }, [season.season]);

  return (
    <div
      ref={rootRef}
      className={`${nanumMyeongjo.variable} ${notoSerifKr.variable} ${jetbrainsMono.variable} hanok-root`}
    >
      <div className="hanok-page">
        <Hero />
        <main>
          <ExplodedAxonometric />
          <ClimateZones season={season} />
          <SeasonalLight season={season} />
          <JoineryDetail />
        </main>
        <HanokFooter />
      </div>

      {/* Wood grain: one static feTurbulence sheet multiplied over the whole
          page. The long horizontal fiber direction reads as sawn pine.
          Pointer-transparent, never animated. */}
      <div className="hanok-grain" aria-hidden="true">
        <svg width="100%" height="100%" preserveAspectRatio="none">
          <filter id="hanok-grain-f" x="0" y="0" width="100%" height="100%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.012 0.48"
              numOctaves="3"
              seed="7"
              stitchTiles="stitch"
            />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0.24  0 0 0 0 0.18  0 0 0 0 0.11  0 0 0 0.06 0"
            />
          </filter>
          <rect width="100%" height="100%" filter="url(#hanok-grain-f)" />
        </svg>
      </div>
    </div>
  );
}
