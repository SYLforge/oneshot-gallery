"use client";

import { useEffect, useRef } from "react";
import "./styles.css";
import { blackHanSans, gaegu, notoSansKR, spaceMono } from "./fonts";
import Hero from "./components/Hero";
import SteamScrub from "./components/SteamScrub";
import ClinkDrag from "./components/ClinkDrag";
import NeonSigns from "./components/NeonSigns";
import MenuBoard from "./components/MenuBoard";
import NightFooter from "./components/NightFooter";
import { usePrefersReducedMotion } from "./hooks/usePrefersReducedMotion";
import { useReveal } from "./hooks/useReveal";

/**
 * NIGHT-SNACK — 새벽 한 시의 포장마차, the third webtoon twin. Where PPANG!
 * is a cozy dawn bakery (warm cream paper, brown ink, generated art) and
 * MOONLIT is a lonely delivery ride (cold indigo night, generated art),
 * NIGHT-SNACK is the vibrant, crowded, steamy chaos of a pojangmacha street-
 * food tent at 1 AM — neon, steam, soju, laughter, skewers. Energetic and
 * social, not lonely or cozy.
 *
 * This is a PURE-CODE entry (no generated images) — unlike ppang/moonlit
 * which ship ComfyUI illustrations. NIGHT-SNACK uses CSS/SVG webtoon-style
 * illustration: flat shapes, halftone dots, speech-bubble SFX, neon glow.
 * `media.source: "code"`, no `media/` payload, budget 0.
 *
 * Three techniques, all earned on screen, all DIFFERENT from ppang's
 * (clip-path-reveal / char-split-reveal / pointer-parallax) and moonlit's
 * (typewriter / svg-line-draw / marquee):
 *  - sprite-scrub — a steam/halftone sprite sequence scrubbed by scroll (the
 *    food cooking), six code-drawn frames whose opacity is driven by
 *    `--ns-steam`.
 *  - drag-physics — draggable soju glasses / skewers you can "clink"; inertia
 *    + spring back, overlap detection fires a spark SFX.
 *  - ascii-render — three neon signs rendered as ASCII-art character fields
 *    that flicker per-glyph, each glyph a dying bulb.
 *
 * `.ns-js` is added imperatively on mount (it never changes — a CSS-only
 * signal that JS is alive, not React state): every pre-reveal style is gated
 * behind it, and with JavaScript off the full chapter stands finished — every
 * panel visible, every menu line complete, every neon sign lit.
 */
export default function NightSnackPage() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const reduced = usePrefersReducedMotion();
  const revealRef = useReveal<HTMLDivElement>(reduced);

  // One callback ref merges the two refs onto the root node — useReveal
  // observes [data-reveal] descendants.
  const setRootNode = (node: HTMLDivElement | null) => {
    rootRef.current = node;
    revealRef.current = node;
  };

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    el.classList.add("ns-js");
    window.parent?.postMessage(
      { type: "oneshot:ready", slug: "night-snack" },
      "*",
    );
  }, []);

  return (
    <div
      id="ns-top"
      ref={setRootNode}
      className={`${blackHanSans.variable} ${gaegu.variable} ${notoSansKR.variable} ${spaceMono.variable} ns-root`}
    >
      <Hero />
      <main>
        <SteamScrub />
        <ClinkDrag />
        <NeonSigns />
        <MenuBoard />
      </main>
      <NightFooter />
    </div>
  );
}
