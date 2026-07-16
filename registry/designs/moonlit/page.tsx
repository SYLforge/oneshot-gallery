"use client";

import { useEffect, useRef } from "react";
import "./styles.css";
import { gugi, notoSansKr, spaceGrotesk, spaceMono } from "./fonts";
import Hero from "./components/Hero";
import RiderIntro from "./components/RiderIntro";
import DeliveryTracker from "./components/DeliveryTracker";
import StreetSequence from "./components/StreetSequence";
import DeliveryComplete from "./components/DeliveryComplete";
import ServiceFooter from "./components/ServiceFooter";
import { usePrefersReducedMotion } from "./hooks/usePrefersReducedMotion";
import { useReveal } from "./hooks/useReveal";

/**
 * MOONLIT — 달빛 배달, a late-night food delivery service as a lonely
 * cinematic webtoon. A rider crosses an empty neon city to bring one warm
 * meal to the one person still awake. The page is the chapter list of a
 * single order — chapter 01 the establishing shot, 02 the rider, 03 the
 * live tracker, 04 the empty street, 05 the handoff at dawn, 06 the hours.
 *
 * The page is the cold twin of PPANG!'s warm dawn: deep indigo nights, one
 * warm amber note reserved for the handoff alone. Three techniques, all
 * earned on screen:
 *  - typewriter — every delivery status types itself out, the way a real
 *    tracker updates.
 *  - svg-line-draw — neon signs and the tracker's progress tube brighten
 *    and draw themselves as they scroll into view, evoking passing lit signs.
 *  - marquee — headlight-trail speed lines sweep across the empty street
 *    panel, the only motion on the page that suggests the rider is moving.
 *
 * `.moonlit-js` is added on mount; every pre-reveal / pre-draw / pre-type
 * state is gated behind it. Without JavaScript the page is finished — every
 * image visible, every status line complete, every neon sign lit.
 */
export default function MoonlitPage() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const reduced = usePrefersReducedMotion();
  const revealRef = useReveal<HTMLDivElement>(reduced);

  useEffect(() => {
    // Imperative on purpose: this class is a CSS-only signal that JS is
    // alive, and it never changes, so React state is the wrong tool.
    rootRef.current?.classList.add("moonlit-js");
    window.parent?.postMessage(
      { type: "oneshot:ready", slug: "moonlit" },
      "*",
    );
  }, []);

  return (
    <div
      id="moonlit-top"
      ref={rootRef}
      className={`${gugi.variable} ${notoSansKr.variable} ${spaceGrotesk.variable} ${spaceMono.variable} moonlit-root`}
    >
      <div ref={revealRef}>
        <Hero />
        <main>
          <RiderIntro />
          <DeliveryTracker />
          <StreetSequence />
          <DeliveryComplete />
        </main>
        <ServiceFooter />
      </div>
    </div>
  );
}
