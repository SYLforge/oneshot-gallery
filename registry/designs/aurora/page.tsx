"use client";

import { useEffect, useRef } from "react";
import "./styles.css";
import { inter, notoSansKR, spaceGrotesk } from "./fonts";
import Hero from "./components/Hero";
import FeatureGlass from "./components/FeatureGlass";
import CTASection from "./components/CTASection";
import AuroraFooter from "./components/AuroraFooter";
import { usePrefersReducedMotion } from "./hooks/usePrefersReducedMotion";
import { useReveal } from "./hooks/useReveal";
import { usePointerTilt } from "./hooks/usePointerTilt";

/**
 * AURORA — a SaaS launch site that breathes.
 * A slow morphing CSS mesh gradient (violet → fuchsia → cyan → emerald)
 * drifts behind translucent glass cards that assemble as you scroll and lean
 * toward the cursor. The signature is the living gradient, not pointer
 * reactivity — where LUMEN NORD is a pointer-warped WebGL aurora over
 * frosty glass, AURORA is a self-breathing mesh over floating cards.
 *
 * `.aurora-js` is added on mount so every enhancement (char-split reveal,
 * pinned scrub, card tilt) is JS-gated — with JavaScript disabled the full
 * page is simply readable, over the (still-animated) CSS mesh that also
 * serves as the reduced-motion fallback when its keyframes are paused.
 */
export default function AuroraPage() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const reduced = usePrefersReducedMotion();
  useReveal(rootRef, reduced);
  usePointerTilt(rootRef, reduced);

  useEffect(() => {
    // Imperative on purpose: the class is a signal to CSS that JS is alive,
    // not React state — and it never changes once set.
    rootRef.current?.classList.add("aurora-js");
    window.parent?.postMessage(
      { type: "oneshot:ready", slug: "aurora" },
      "*",
    );
  }, []);

  return (
    <div
      id="aurora-top"
      ref={rootRef}
      className={`${spaceGrotesk.variable} ${inter.variable} ${notoSansKR.variable} aurora-root`}
    >
      <Hero reduced={reduced} />
      <main>
        <FeatureGlass reduced={reduced} />
        <CTASection />
      </main>
      <AuroraFooter />
    </div>
  );
}
