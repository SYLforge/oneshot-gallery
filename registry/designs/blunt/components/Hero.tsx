"use client";

/**
 * Section 01 — the shout. A stacked Archivo Black wordmark with a
 * misregistered riso shadow: blue and fluorescent-red copies (CSS pseudo
 * elements, `content: attr(data-text) / ""` so they are silent to screen
 * readers) sit under the ink layer with mix-blend-mode: multiply — where
 * the plates overlap they darken, exactly like a two-drum pass that came
 * out of the machine 2mm off. The offsets twitch once per 8.4s under
 * `.blunt-js`; reduced motion pins the plates still.
 */
export default function Hero() {
  return (
    <header className="blunt-hero">
      <p className="blunt-hero__kicker">
        <span>RISO PRINT CO-OP — EULJIRO, SEOUL</span>
        <span lang="ko">종이는 재생지, 목소리는 크게</span>
      </p>

      <h1 className="blunt-wordmark">
        <span className="blunt-word" data-text="BLUNT">
          <span className="blunt-word__ink">BLUNT</span>
        </span>
        <span className="blunt-word blunt-word--sub" data-text="PRINT WORKS">
          <span className="blunt-word__ink">PRINT WORKS</span>
        </span>
      </h1>

      <p className="blunt-hero__ko" lang="ko">
        을지로 리소 인쇄소
      </p>

      <p className="blunt-badge">
        SINCE 2019 · <span lang="ko">무광 전문</span>
      </p>

      <div className="blunt-hero__stack">
        <p className="blunt-hero__shout">
          <span className="blunt-hl">WE PRINT LOUD.</span>{" "}
          <span lang="ko">조용한 건 안 찍음.</span>
        </p>
        <p className="blunt-hero__sub">
          TWO PEOPLE. ONE MACHINE. NO MERCY.{" "}
          <span lang="ko">두 사람, 기계 한 대, 인정사정없음.</span>
        </p>
        <a className="blunt-btn blunt-press" href="#blunt-prices">
          GET A QUOTE <span lang="ko">견적 받기</span> ↓
        </a>
      </div>
    </header>
  );
}
