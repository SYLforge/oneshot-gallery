"use client";

import { type CSSProperties, useRef } from "react";
import Picture from "./Picture";
import Sign from "./Sign";
import Narration from "./Narration";
import { usePointerParallax } from "../hooks/usePointerParallax";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

/**
 * Section 01 — the establishing shot. The page opens at 4 AM: the bakery at
 * dawn, its sign just lit, the city still asleep. Four layers of depth drift
 * at different rates as you scroll (the webtoon's parallax) — the sky slowest,
 * the sign fastest — driven by the scroll-progress hook's --ppang-sky-y.
 *
 * On fine pointers the same layers also lean toward the cursor (capped,
 * lerped), so the hero reads as a diorama, not a flat frame. On touch and
 * under reduced motion the parallax flattens; everything is simply there.
 *
 * The dawn sky is a separate layered element whose gradient is scrubbed by
 * --ppang-dawn (set in page.tsx from useScrollProgress): indigo → blush →
 * gold. With JS off, --ppang-dawn is unset and the sky falls back to a fixed
 * composed pre-dawn-to-gold gradient, so the page never shows a blank sky.
 *
 * The illustration carries no text, so the actual signage (빵!) is the
 * <Sign> SVG painted over the awning — crisp Hangul at any resolution.
 */
export default function Hero() {
  const reduced = usePrefersReducedMotion();
  const sceneRef = usePointerParallax<HTMLDivElement>(reduced);

  // The hero title is split per Hangul syllable / Latin letter, accessible
  // (aria-label on the h1) — animated copies only. Pre-reveal state is gated
  // behind .ppang-js in styles.css.
  const KR = ["빵", "!"];
  const EN = ["P", "P", "A", "N", "G", "!"];

  const skyRef = useRef<HTMLDivElement | null>(null);

  return (
    <header className="ppang-hero" aria-labelledby="ppang-hero-title">
      {/* The dawn sky — three layered phases crossfaded by --ppang-dawn:
          indigo → blush → gold. Each phase is its own element so all three
          can coexist; opacity is the only thing that changes. With JS off,
          --ppang-dawn stays at 0 (full indigo, the chapter's opening); under
          reduced motion the reduced-motion block pins it at 1 (gold). */}
      <div ref={skyRef} className="ppang-hero__sky" aria-hidden="true" />
      <div className="ppang-hero__gold" aria-hidden="true" />

      {/* Parallax diorama. data-reveal="panel" so it gets is-visible, but the
          hero art itself is visible from the first paint — only the caption
          narration waits for the panel class. */}
      <div ref={sceneRef} className="ppang-hero__scene" data-reveal="panel">
        {/* far layer — a soft hill silhouette, slowest drift */}
        <svg
          className="ppang-hero__far"
          viewBox="0 0 1200 300"
          preserveAspectRatio="none"
          aria-hidden="true"
          focusable="false"
        >
          <path
            d="M0 220 C 180 180, 320 200, 480 190 C 660 180, 820 210, 1000 188 C 1100 176, 1160 184, 1200 178 L1200 300 L0 300 Z"
            fill="#6b513a"
            opacity="0.22"
          />
          <path
            d="M0 252 C 200 232, 360 246, 540 240 C 720 234, 900 250, 1200 238 L1200 300 L0 300 Z"
            fill="#3d2817"
            opacity="0.16"
          />
        </svg>

        <Picture
          className="ppang-hero__art"
          stem="hero-dawn-bakery"
          width={832}
          height={1216}
          loading="eager"
          decoding="sync"
          alt="새벽 빵집 전경 — 감청색 하늘 아래, 아직 불이 켜지기 직전의 골목 빵집. 간판의 작은 불빛 하나가 유일하게 따뜻하다. / Dawn bakery establishing shot — a neighborhood bakery under an indigo pre-dawn sky; the small lamp on its sign is the only warm light."
        />

        {/* The sign, painted over the awning. Crisp Hangul because the
            illustration has none. */}
        <div className="ppang-hero__sign">
          <Sign />
        </div>
      </div>

      {/* Title block — Korean first, the wordmark; English subtitle beneath.
          Sits over the lower sky where contrast is held (paper-on-indigo). */}
      <div className="ppang-hero__text">
        <p className="ppang-hero__kicker">
          새벽 4시 · 도시가 잠든 사이{" "}
          <span lang="en" className="ppang-hero__kicker-en">
            4 AM · while the city sleeps
          </span>
        </p>

        <h1 className="ppang-hero__title" id="ppang-hero-title" aria-label="빵! PPANG!">
          <span className="ppang-hero__title-kr" lang="ko">
            {KR.map((ch, i) => (
              <span
                key={`kr-${i}`}
                aria-hidden="true"
                className="ppang-hero__glyph"
                style={{ "--pn": `${120 + i * 140}ms` } as CSSProperties}
              >
                {ch}
              </span>
            ))}
          </span>
          <span className="ppang-hero__title-en" lang="en">
            {EN.map((ch, i) => (
              <span
                key={`en-${i}`}
                aria-hidden="true"
                className="ppang-hero__glyph"
                style={{ "--pn": `${620 + i * 70}ms` } as CSSProperties}
              >
                {ch}
              </span>
            ))}
          </span>
        </h1>

        <p className="ppang-hero__lede">
          <Narration
            text="빵이 깨어난다."
            lang="ko"
            start={1100}
            step={70}
          />{" "}
          <span lang="en" className="ppang-hero__lede-en">
            the bread wakes up.
          </span>
        </p>
      </div>

      <p className="ppang-hero__hint" aria-hidden="true">
        아래로 스크롤 · <span lang="en">scroll the chapter</span>
      </p>
    </header>
  );
}
