"use client";

import { useEffect, useRef } from "react";
import "./styles.css";
import { blackHanSans, fraunces, notoSerifKR } from "./fonts";
import Hero from "./components/Hero";
import BakerIntro from "./components/BakerIntro";
import ProductShowcase from "./components/ProductShowcase";
import KitchenStory from "./components/KitchenStory";
import BakeryFooter from "./components/BakeryFooter";
import { usePrefersReducedMotion } from "./hooks/usePrefersReducedMotion";
import { useReveal } from "./hooks/useReveal";
import { useScrollProgress } from "./hooks/useScrollProgress";

/**
 * PPANG! — 새벽 빵집. A neighborhood Korean bakery that wakes at 4 AM so
 * the first commuters smell bread, scrolled like one chapter of a Naver
 * Webtoon. Warm cream paper, brown ink, one apricot accent. Korean-first
 * copy with an English voice beside it. The four illustrations are
 * generated (ComfyUI; recipe in image-recipe.md), revealed panel by panel
 * as you scroll, while the sky behind the hero climbs from pre-dawn indigo
 * to morning gold.
 *
 * `.ppang-js` is added imperatively on mount (it never changes — a signal
 * to CSS that JS is alive, not React state): every pre-reveal style is
 * gated behind it, and with JavaScript off the full chapter simply stands
 * finished. The scroll-tied dawn gradient and parallax are driven by
 * `useScrollProgress`, which writes two custom properties on the root and
 * flattens itself under reduced motion (the dawn is pinned at "arrived").
 *
 * The reveal observer and the scroll-progress hook both attach to the same
 * root node (the `.ppang-root`), which wraps the whole chapter — so the
 * hero panel and the footer reveal alike.
 */
export default function PpangPage() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const reduced = usePrefersReducedMotion();
  const revealRef = useReveal<HTMLDivElement>(reduced);

  // One callback ref merges the two refs onto the root node — useReveal
  // observes [data-reveal] descendants; useScrollProgress scopes its CSS
  // custom properties to the root. No state round-trip: refs only.
  const setRootNode = (node: HTMLDivElement | null) => {
    rootRef.current = node;
    revealRef.current = node;
  };

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    el.classList.add("ppang-js");
    window.parent?.postMessage({ type: "oneshot:ready", slug: "ppang" }, "*");
  }, []);

  useScrollProgress(rootRef, reduced);

  return (
    <div
      id="ppang-top"
      ref={setRootNode}
      className={`${blackHanSans.variable} ${notoSerifKR.variable} ${fraunces.variable} ppang-root`}
    >
      <Hero />
      <main>
        <BakerIntro />
        <ProductShowcase />
        <KitchenStory />
      </main>
      <BakeryFooter />

      {/* Paper grain: one static feTurbulence pass over the whole sheet.
          Warm cream fibers, never animated — the page is a page, not a
          screen. Decorative; pointer-transparent. */}
      <div className="ppang-grain" aria-hidden="true">
        <svg width="100%" height="100%" preserveAspectRatio="none">
          <filter id="ppang-grain-f" x="0" y="0" width="100%" height="100%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.6"
              numOctaves="2"
              seed="7"
              stitchTiles="stitch"
            />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0.24  0 0 0 0 0.16  0 0 0 0 0.09  0 0 0 0.06 0"
            />
          </filter>
          <rect width="100%" height="100%" filter="url(#ppang-grain-f)" />
        </svg>
      </div>
    </div>
  );
}
