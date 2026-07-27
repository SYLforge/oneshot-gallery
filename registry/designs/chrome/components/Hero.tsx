"use client";

import type { CSSProperties } from "react";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import { useChromeShader } from "../hooks/useChromeShader";
import { useFoilParallax } from "../hooks/useFoilParallax";
import { useReveal } from "../hooks/useReveal";

const TITLE = ["C", "H", "R", "O", "M", "E"];

/**
 * The hero. A holographic-mist stage with a faint holo-sky → holo-pink →
 * holo-mint scrim behind everything (so no-JS and shader failure never show
 * a hole). On top:
 *
 *  - the wordmark "CHROME", split into aria-hidden glyph spans behind an
 *    aria-label, each clipping open then crossed by a chrome sweep
 *    (`char-split-reveal`, the metallic sweep);
 *  - the WebGL chrome canvas laid over the wordmark as a clipped liquid
 *    fill — the metal that ripples to the pointer (`webgl-shader`). A CSS
 *    chrome-gradient text fill sits behind the canvas as the honest
 *    fallback: the canvas is transparent until its first real frame and
 *    stays hidden entirely if WebGL is absent;
 *  - the holographic foil panels framing the stage, whose rainbow sheen
 *    drifts with the pointer (`pointer-parallax`).
 *
 * The sweep's CSS default is the finished state, so without JavaScript and
 * under reduced motion the headline simply rests, fully legible, in its
 * chrome-gradient fill.
 */
export default function Hero() {
  const reduced = usePrefersReducedMotion();
  const shaderRef = useChromeShader<HTMLCanvasElement>(reduced);
  const foilRef = useFoilParallax<HTMLDivElement>(reduced);
  const revealRef = useReveal<HTMLHeadingElement>(reduced);

  return (
    <header className="chrome-hero" aria-labelledby="chrome-hero-title">
      <div className="chrome-hero__scrim" aria-hidden="true" />

      <p className="chrome-hero__eyebrow">
        Liquid metal beauty — Seoul · 2003
      </p>

      <div className="chrome-hero__titlewrap">
        {/* Holographic foil panels — the rainbow frame, parallax-driven */}
        <div ref={foilRef} className="chrome-foil" aria-hidden="true">
          <span className="chrome-foil__band chrome-foil__band--sky" />
          <span className="chrome-foil__band chrome-foil__band--pink" />
          <span className="chrome-foil__band chrome-foil__band--mint" />
        </div>

        <h1
          ref={revealRef}
          id="chrome-hero-title"
          className="chrome-wordmark"
          aria-label="CHROME — 크롬"
        >
          <span className="chrome-wordmark__fill" aria-hidden="true">
            CHROME
          </span>
          <canvas
            ref={shaderRef}
            className="chrome-wordmark__metal"
            role="img"
            aria-label="A chrome wordmark rendered as rippling liquid metal: horizontal silver bands with a white highlight and deep shadow, displaced by sine ripples and a pointer lens. 포인터를 따라 출렁이는 액체 금속으로 그려진 크롬 워드마크 — 은색 띠와 흰 하이라이트, 깊은 그림자가 사인파 잔결과 포인터 렌즈로 출렁인다."
          />
          <span className="chrome-wordmark__glyphs" aria-hidden="true">
            {TITLE.map((ch, i) => (
              <span
                key={`${ch}-${i}`}
                className="chrome-wordmark__ch"
                style={{ "--chrome-ci": i } as CSSProperties}
              >
                {ch}
              </span>
            ))}
          </span>
        </h1>
      </div>

      <p className="chrome-hero__sub" lang="ko">
        크롬 · 액체 금속 뷰티, 서울
      </p>

      <p className="chrome-hero__line">
        Gloss poured as metal.{" "}
        <span lang="ko" className="chrome-hero__lineko">
          립을 붓듯 금속을 붓다.
        </span>
      </p>

      <p className="chrome-hero__hint" aria-hidden="true">
        move to ripple the chrome ↓
      </p>
    </header>
  );
}
