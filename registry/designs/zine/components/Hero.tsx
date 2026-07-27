"use client";

import type { CSSProperties } from "react";

const MASTHEAD = "잡지".split("");

/**
 * The cover — a photocopied masthead. Where a literary journal's masthead
 * is restraint, a zine's masthead is a poster: a 2px ink frame, the word
 * 잡지 split into aria-hidden spans behind an aria-label so the headline
 * reveals per-glyph (the char-split-reveal), a rule-heavy dateline, a
 * highlighter-stroked dek, a red POSTAGE stamp, and a folio. Dense,
 * collaged, loud. The whole thing is set in Oswald condensed display for
 * the Latin voice and Noto Serif KR for the Korean.
 *
 * All headline choreography is CSS keyframes gated behind `.zine-js`;
 * without JavaScript (or with reduced motion) the masthead is simply,
 * fully there.
 */
export default function Hero() {
  return (
    <header className="zine-hero" aria-labelledby="zine-masthead">
      <div className="zine-hero__frame">
        <div className="zine-hero__topline">
          <span className="zine-hero__folio" aria-hidden="true">
            NO. 32
          </span>
          <span className="zine-hero__dateline">
            <span lang="ko">2026년 7월 18일 토요일</span> · SAT 18 JUL 2026
          </span>
          <span className="zine-hero__price" aria-hidden="true">
            ₩3,000 / FREE
          </span>
        </div>

        <div className="zine-hero__id">
          <h1
            id="zine-masthead"
            className="zine-hero__wordmark"
            lang="ko"
            aria-label="잡지 — ZINE, the photocopy underground"
          >
            <span className="zine-hero__wordmark-ko" aria-hidden="true">
              {MASTHEAD.map((ch, i) => (
                <span
                  key={`${ch}-${i}`}
                  className="zine-hero__ch"
                  style={{ "--z-ci": i } as CSSProperties}
                >
                  {ch}
                </span>
              ))}
            </span>
            <span className="zine-hero__wordmark-en" aria-hidden="true">
              ZINE
            </span>
          </h1>
          <div className="zine-hero__rule" aria-hidden="true" />
          <p className="zine-hero__dek">
            <mark className="zine-hero__hl">
              <span lang="ko">복사기 지하의 독립지</span> · THE PHOTOCOPY
              UNDERGROUND
            </mark>
          </p>
        </div>

        <div className="zine-hero__grid">
          <p className="zine-hero__lede" lang="ko">
            종이를 접고, 복사기를 두드리고, 한밤중에 스테이플러를 누른다. 이
            잡지는 그렇게 만들어졌다. 도수는 두 색, 부수는 천 장, 사과는
            없다.
          </p>
          <div className="zine-hero__stamp" role="img" aria-label="고무인 — 복사기는 총이다. Rubber stamp: the photocopier is a gun.">
            <span className="zine-hero__stamp-en">PHOTOCOPIER</span>
            <span className="zine-hero__stamp-ko" lang="ko">
              복사기는 총이다
            </span>
          </div>
          <p className="zine-hero__mast">
            <span className="zine-hero__mast-label">EST.</span>
            <span className="zine-hero__mast-year">2019</span>
            <span className="zine-hero__mast-city">
              <span lang="ko">서울·홍대</span> · HONGDAE
            </span>
          </p>
        </div>

        <div className="zine-hero__begin">
          <a className="zine-link" href="#zine-features">
            <span lang="ko">본문으로</span> · Jump in ↓
          </a>
        </div>
      </div>
    </header>
  );
}
