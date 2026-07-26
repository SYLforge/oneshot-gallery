"use client";

import type { CSSProperties } from "react";

const WORD = ["S", "T", "R", "E", "T", "C", "H"];
const WORD_KO = ["늘", "어"];

/**
 * The cover. A yoga studio's first impression should be a long exhale: a
 * vast warm field, the wordmark STRETCH split into per-glyph spans that
 * rise and gently reach (scaleY 0.78 → 1, with a 6% overshoot on settle),
 * the Korean 늘어 sitting in dialogue, one clay hairline that grows
 * across, and a single studio line. Almost everything is air.
 *
 * The split wordmark keeps "STRETCH" in the h1's aria-label; the animated
 * spans are aria-hidden, each carrying its index as --st-gi so CSS can
 * stagger the rise. All cover choreography is CSS keyframes gated behind
 * .stretch-js; without JavaScript (or with reduced motion) the wordmark
 * is simply, fully there — already stretched, already filled.
 */
export default function Hero() {
  return (
    <header className="stretch-cover">
      <p className="stretch-cover__folio" aria-hidden="true">
        <span lang="ko">늘어남</span> · No. 01 · The Reach
      </p>

      <div className="stretch-cover__id">
        <h1 className="stretch-wordmark" aria-label="STRETCH · 늘어">
          <span className="stretch-wordmark__latin" aria-hidden="true">
            {WORD.map((ch, i) => (
              <span
                key={`l-${ch}-${i}`}
                className="stretch-wordmark__ch"
                style={{ "--st-gi": i } as CSSProperties}
              >
                {ch}
              </span>
            ))}
          </span>
          <span
            className="stretch-wordmark__ko"
            lang="ko"
            aria-hidden="true"
          >
            {WORD_KO.map((ch, i) => (
              <span
                key={`k-${ch}-${i}`}
                className="stretch-wordmark__ch stretch-wordmark__ch--ko"
                style={{ "--st-gi": i + WORD.length } as CSSProperties}
              >
                {ch}
              </span>
            ))}
          </span>
        </h1>
        <p className="stretch-cover__deck" data-reveal>
          <span lang="ko">숨 쉬는 스튜디오</span> · A Studio That Breathes
        </p>
        <div className="stretch-cover__rule" aria-hidden="true" />
        <p className="stretch-cover__issue" data-reveal lang="ko">
          서울 성수동 · 아침 여섯시부터 밤열시까지 · 매일 숨 한번
        </p>
      </div>

      <div className="stretch-cover__foot">
        <p className="stretch-cover__begin" data-reveal>
          <a className="stretch-cover__cta" href="#st-sequence">
            <span lang="ko">자세로</span> — Begin the sequence
          </a>
        </p>
        <p className="stretch-cover__epigraph" data-reveal>
          <span lang="ko">늘어나는 것은 부드러운 일이다.</span>{" "}
          <em>Lengthening is a soft act.</em>
        </p>
      </div>
    </header>
  );
}
