"use client";

import { useEffect, useRef } from "react";
import "./styles.css";
import { playfair, notoSerifKr, spaceMono } from "./fonts";
import CoverSheet from "./components/CoverSheet";
import ContactSheet from "./components/ContactSheet";
import ProcessNotes from "./components/ProcessNotes";
import Colophon from "./components/Colophon";
import { usePrefersReducedMotion } from "./hooks/usePrefersReducedMotion";
import { useReveal } from "./hooks/useReveal";

/**
 * REEL — analog film-leak photography.
 * A wedding & film photographer's portfolio laid out as a contact sheet come
 * to life: a warm Kodak-toned cover with a sweeping light leak, a pinned
 * contact-sheet section whose frames "develop" (clip-path wipe) as you scroll
 * — like pulling a print from the developer tray — process notes set like a
 * darkroom log, and a colophon printed on the strip's edge. Every still is a
 * CSS gradient; no photograph is shipped anywhere in the entry.
 *
 * `.reel-js` is added on mount so every scrub/reveal/leak state is JS-gated
 * — with JavaScript disabled the full page is simply readable, every still
 * already developed.
 */
export default function ReelPage() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const reduced = usePrefersReducedMotion();
  const revealRef = useReveal<HTMLElement>(reduced);

  useEffect(() => {
    // Imperative on purpose: the class is a signal to CSS that JS is alive,
    // not React state — and className never changes, so it sticks.
    rootRef.current?.classList.add("reel-js");
    window.parent?.postMessage(
      { type: "oneshot:ready", slug: "reel" },
      "*",
    );
  }, []);

  return (
    <div
      id="reel-top"
      ref={rootRef}
      className={`${playfair.variable} ${notoSerifKr.variable} ${spaceMono.variable} reel-root`}
    >
      <main className="reel-strip" ref={revealRef}>
        <CoverSheet />
        <ContactSheet />
        <ProcessNotes />
        <Colophon />
      </main>
    </div>
  );
}
