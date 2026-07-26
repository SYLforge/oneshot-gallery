"use client";

import { useEffect, useRef } from "react";
import "./styles.css";
import { fredoka, gaegu } from "./fonts";
import Hero from "./components/Hero";
import SpringCards from "./components/SpringCards";
import FloatingShapes from "./components/FloatingShapes";
import KidsFooter from "./components/KidsFooter";
import { usePrefersReducedMotion } from "./hooks/usePrefersReducedMotion";
import { useBounceReveal } from "./hooks/useBounceReveal";

/**
 * BOUNCE — 통통, a story studio for small humans.
 * A children's-book brand site where every UI element is made of rubber:
 * buttons squash-and-stretch on press, headline letters bounce in
 * one-by-one with overshoot, cards pop in on reveal, and soft pastel
 * shapes drift toward your pointer. Reactive springs — you don't drag
 * anything here, you just touch it and it bounces back.
 *
 * `.bounce-js` is added on mount so every pre-reveal style (glyphs hidden
 * before their bounce, cards waiting below) is JS-gated — with JavaScript
 * disabled, or under reduced motion, the full page simply sits in its
 * resting state: everything readable, nothing moving.
 */
export default function BouncePage() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const reduced = usePrefersReducedMotion();
  const revealRef = useBounceReveal<HTMLDivElement>(reduced);

  useEffect(() => {
    // Imperative on purpose: the class is a signal to CSS that JS is alive,
    // not React state — and it never changes once set.
    rootRef.current?.classList.add("bounce-js");
    window.parent?.postMessage({ type: "oneshot:ready", slug: "bounce" }, "*");
  }, []);

  return (
    <div
      ref={rootRef}
      className={`${fredoka.variable} ${gaegu.variable} bounce-root`}
    >
      <FloatingShapes />

      <div ref={revealRef} className="bounce-stage">
        <Hero />
        <main>
          <SpringCards />
        </main>
        <KidsFooter />
      </div>
    </div>
  );
}
