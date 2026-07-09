"use client";

import type { CSSProperties } from "react";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import { useBreath } from "../hooks/useBreath";

const LETTERS = ["O", "N", "D", "O"];

/**
 * The hero: a near-black stage, the wordmark, one hairline vermeil rule.
 *
 * The wordmark's letter-spacing "breath" — tight (0.02em apparent) opening
 * to airy (0.4em) — is done with per-character transforms, not by animating
 * the letter-spacing property. The CSS layout is set at the FINAL airy
 * tracking; each split character carries a translateX in em that pulls it
 * toward the center by exactly the missing tracking, scaled by
 * (1 − --ondo-breath). The animation is therefore compositor-only and the
 * line never reflows. Characters are aria-hidden behind the h1's aria-label.
 */
export default function Hero() {
  const reduced = usePrefersReducedMotion();
  const wordmarkRef = useBreath<HTMLHeadingElement>(reduced);

  return (
    <header className="ondo-hero">
      <p className="ondo-hero__eyebrow">Perfume atelier — Seoul</p>

      <h1 ref={wordmarkRef} className="ondo-wordmark" aria-label="ONDO">
        {LETTERS.map((ch, i) => (
          <span
            key={`${ch}-${i}`}
            aria-hidden="true"
            className="ondo-wordmark__ch"
            style={{ "--ondo-ci": i } as CSSProperties}
          >
            {ch}
          </span>
        ))}
      </h1>

      <p className="ondo-hero__sub" lang="ko">
        온도 · 향의 아틀리에, 서울
      </p>

      <div className="ondo-hero__rule" aria-hidden="true" />

      <p className="ondo-hero__line">
        Scent, read as temperature.{" "}
        <span lang="ko" className="ondo-hero__lineko">
          향을 온도로 읽는다.
        </span>
      </p>

      <p className="ondo-hero__hint" aria-hidden="true">
        36.5° ↓
      </p>
    </header>
  );
}
