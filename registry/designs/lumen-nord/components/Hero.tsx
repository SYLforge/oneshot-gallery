"use client";

import { useRef, useState } from "react";
import AuroraCanvas from "./AuroraCanvas";

type Props = {
  reduced: boolean;
};

/**
 * Section 01 — the sky itself. A full-viewport WebGL aurora (with a CSS
 * gradient understudy) behind the bureau's masthead and tonight's headline
 * probability. The pause button satisfies WCAG 2.2.2 for the ambient shader;
 * it is display-gated behind `.lumen-js` and hidden under reduced motion,
 * where there is nothing left to pause.
 */
export default function Hero({ reduced }: Props) {
  const stageRef = useRef<HTMLElement | null>(null);
  const [paused, setPaused] = useState(false);

  return (
    <header ref={stageRef} className="lumen-hero" aria-label="LUMEN NORD">
      <AuroraCanvas stageRef={stageRef} reduced={reduced} paused={paused} />
      <div className="lumen-hero__scrim" aria-hidden="true" />

      <div className="lumen-hero__inner">
        <p className="lumen-kicker">
          NIGHTLY AURORA FORECAST ·{" "}
          <span lang="ko" className="lumen-kicker__ko">
            야간 오로라 예보
          </span>
        </p>

        <h1 className="lumen-title">
          LUMEN NORD
          <span lang="ko" className="lumen-title__ko">
            오로라 예보국
          </span>
        </h1>

        <p className="lumen-lede">
          TONIGHT — 78% chance the sky remembers it is a curtain.
          <span lang="ko" className="lumen-lede__ko">
            오늘 밤, 하늘은 자신이 커튼이었음을 기억할 확률 78%.
          </span>
        </p>

        <p className="lumen-issue">
          BULLETIN NO. 2189 · ISSUED 21:00 KST / 13:00 CET · NORDFJELL RIDGE
          69.3°N
        </p>

        <p className="lumen-hero__hint" aria-hidden="true">
          scroll — the night deepens · 스크롤할수록 밤이 깊어진다
        </p>
      </div>

      {!reduced && (
        <button
          type="button"
          className="lumen-skybtn"
          aria-pressed={paused}
          onClick={() => setPaused((p) => !p)}
        >
          {paused ? (
            <>
              resume the sky · <span lang="ko">하늘 재생</span>
            </>
          ) : (
            <>
              pause the sky · <span lang="ko">하늘 멈춤</span>
            </>
          )}
        </button>
      )}
    </header>
  );
}
