"use client";

/**
 * Section 01 — the hero. The wordmark GLITCH resolves as a three-channel
 * chromatic-aberration ident: a clean white base layer plus red and blue
 * channels offset by a few px, which burst apart one frame every 4.2s and
 * rest at a ±0.6px micro-shift. Beneath it, a scrambled ASCII ident block
 * shivers. Reduced motion renders the resolved static wordmark.
 *
 * The SSR / no-JS state is the completed hero — pre-burst styles are gated
 * behind `.gl-js` so nothing is hidden without JavaScript.
 */
export default function GlitchHero() {
  return (
    <header className="gl-hero" id="gl-top">
      <p className="gl-hero__eyebrow" data-tear>
        <span aria-hidden="true">▚▚▚</span> corrupted-signal studio ·{" "}
        <span lang="ko">파손된 신호의 스튜디오</span>{" "}
        <span aria-hidden="true">▞▞▞</span>
      </p>

      <h1 className="gl-wordmark" aria-label="GLITCH">
        {/* aria-hidden layers — the readable label is on the <h1> */}
        <span aria-hidden="true" className="gl-wordmark__layer gl-wordmark__red">
          GLITCH
        </span>
        <span
          aria-hidden="true"
          className="gl-wordmark__layer gl-wordmark__blue"
        >
          GLITCH
        </span>
        <span className="gl-wordmark__base">GLITCH</span>
      </h1>

      <p className="gl-hero__sub" lang="ko" data-tear>
        글리치 — 고장을 완성으로.
      </p>
      <p className="gl-hero__sub-en" data-tear>
        a VFX &amp; experimental-music studio. we ship the artifacts other
        studios delete.
      </p>

      <dl className="gl-hero__meta" data-tear>
        <div>
          <dt>status</dt>
          <dd>
            RENDERING <span lang="ko">렌더 중</span>
          </dd>
        </div>
        <div>
          <dt>build</dt>
          <dd>
            3.1.4 — <span lang="ko">불안정, 의도됨</span>
          </dd>
        </div>
        <div>
          <dt>signal</dt>
          <dd>
            <span aria-hidden="true">▮▮▮▯▯</span> 03:00 / decode
            <span lang="ko"> 양호</span>
          </dd>
        </div>
      </dl>

      <p className="gl-hero__hint" aria-hidden="true">
        ▼ <span lang="ko">아래로 — 손상된 영역으로</span>
      </p>
    </header>
  );
}
