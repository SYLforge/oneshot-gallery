"use client";

import { useEffect, useRef } from "react";
import "./styles.css";
import { notoSansKR, spaceGrotesk } from "./fonts";
import Hero from "./components/Hero";
import Tracklist from "./components/Tracklist";
import PulseFooter from "./components/PulseFooter";
import { usePrefersReducedMotion } from "./hooks/usePrefersReducedMotion";
import { useReveal } from "./hooks/useReveal";

/**
 * PULSE — audio-reactive nebula. A fictional record label that drops one
 * album into the dark at a time; the page IS the listening. A generative
 * particle nebula (vanilla canvas 2D, 3D-projected by hand) breathes to a
 * simulated 120 BPM beat — no real audio. The camera tilts with pointer
 * parallax, and a pinned tracklist shifts the nebula's color and intensity
 * per track as you scroll.
 *
 * `.pulse-js` is added on mount so every scroll-reveal pre-state is
 * JS-gated — with JavaScript disabled the full page is simply readable,
 * the nebula replaced by its CSS void understudy (radial ground + rim pool),
 * and the tracklist is a static ordered list.
 *
 * The hero's NebulaField and the Tracklist share a `trackRef` so the
 * scroll-driven 0→1 track value flows from the pinned section into the
 * nebula's palette mixer without React re-renders on the hot path.
 */
export default function PulsePage() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const reduced = usePrefersReducedMotion();
  // Shared hot-path ref: useScrollProgress (in Tracklist) writes the live
  // track value here; NebulaField reads it every frame. React state is never
  // touched on the scroll path.
  const trackRef = useRef<{ raw: number; smooth: number }>({
    raw: 0,
    smooth: 0,
  });

  useReveal(rootRef, reduced);

  useEffect(() => {
    rootRef.current?.classList.add("pulse-js");
    window.parent?.postMessage(
      { type: "oneshot:ready", slug: "pulse" },
      "*",
    );
  }, []);

  return (
    <div
      id="pulse-top"
      ref={rootRef}
      className={`${notoSansKR.variable} ${spaceGrotesk.variable}`}
      // `pulse-js` is NOT in the className on purpose: it is added on mount
      // by the effect above so the SSR/ no-JS markup is the completed page,
      // and every reveal pre-state (gated behind .pulse-js) stays hidden
      // only when JavaScript is actually alive.
    >
      <Hero trackRef={trackRef} reduced={reduced} />
      <main>
        <Tracklist trackRef={trackRef} />
      </main>
      <PulseFooter />
    </div>
  );
}
