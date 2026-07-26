"use client";

import { useEffect, useRef } from "react";
import "./styles.css";
import { blackHanSans, archivoBlack, spaceMono } from "./fonts";
import Hero from "./components/Hero";
import LineupMarquee from "./components/LineupMarquee";
import TicketBlock from "./components/TicketBlock";
import VenueMap from "./components/VenueMap";
import RaveFooter from "./components/RaveFooter";

/**
 * RAVE — an underground electronic-music festival / one-night club night in
 * an abandoned Itaewon printworks. Pure black ground, white blocks, ONE
 * strobing accent (electric blue #0066ff), massive type, hard offset
 * shadows. Brutalism for nightlife, not craft: where BLUNT is paper and
 * riso misregistration in daylight, RAVE is the dark room at 02:00.
 *
 * `.rave-js` is added on mount so every JS-dependent style (the strobe, the
 * scanline drift, the pre-reveal clip-path hidden state) is gated — with
 * JavaScript disabled the page is simply a finished flyer: everything
 * readable, the strobe frozen on, the clips open.
 */
export default function RavePage() {
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Imperative on purpose: the class is a signal to CSS that JS is alive,
    // not React state — and it never changes once set.
    rootRef.current?.classList.add("rave-js");
    window.parent?.postMessage({ type: "oneshot:ready", slug: "rave" }, "*");
  }, []);

  return (
    <div
      ref={rootRef}
      className={`${blackHanSans.variable} ${archivoBlack.variable} ${spaceMono.variable} rave-root`}
    >
      <Hero />
      <main>
        <LineupMarquee />
        <TicketBlock />
        <VenueMap />
      </main>
      <RaveFooter />
    </div>
  );
}
