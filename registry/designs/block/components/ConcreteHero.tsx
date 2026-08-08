"use client";

import { Square, Triangle, Circle, Stack, Line, Grid } from "./Motifs";

/**
 * 섹션 01 — 외침. 거대한 워드마크 BLOCK / 블록이 콘크리트 슬래브 위에
 * 서 있다. char-split-reveal: BLOCK의 각 글자가 data-bk-char 로 표시되고,
 * useReveal 이 루트에 is-revealed 를 붙이면 CSS 가 글자별로 stagger 하여
 * hard cut 으로 드러낸다 (brutalist — 부드러운 fade 없음, clip-path 잘림).
 *
 * 주변의 기하 형태(네모/세모/동그라미/쌓기/선/격자)는 출판의 어휘를
 * 보여주는 장식 — aria-hidden, 포인터 투과. hard offset shadow 가 이
 * 출판의 서명이다.
 */
const WORD = "BLOCK";

export default function ConcreteHero() {
  return (
    <header className="bk-hero" aria-labelledby="bk-hero-title">
      {/* 기하 형태 폭발 — 장식, clip-path 리빌. */}
      <div className="bk-hero__shapes" aria-hidden="true">
        <Square className="bk-shape bk-shape--sq1" />
        <Triangle className="bk-shape bk-shape--tr1" />
        <Circle className="bk-shape bk-shape--ci1" />
        <Stack className="bk-shape bk-shape--st1" />
        <Line className="bk-shape bk-shape--ln1" />
        <Grid className="bk-shape bk-shape--gr1" />
      </div>

      <p className="bk-hero__kicker">
        <span lang="ko">콘크리트 시 출판</span>
        <span className="bk-hero__kicker-sep" aria-hidden="true">
          ·
        </span>
        <span>CONCRETE POETRY PRESS · EST. 2026</span>
      </p>

      <h1 className="bk-wordmark" id="bk-hero-title">
        <span className="bk-wordmark__latin" aria-label="BLOCK">
          {WORD.split("").map((ch, i) => (
            <span
              key={i}
              className="bk-char"
              data-bk-char=""
              style={{ ["--bk-char-i" as string]: i }}
              aria-hidden="true"
            >
              {ch}
            </span>
          ))}
        </span>
        <span className="bk-wordmark__ko" lang="ko" data-bk-char="">
          블록
        </span>
      </h1>

      <p className="bk-hero__lede">
        <span lang="ko">단단한 그리드. 무거운 활자. 타협 없음.</span>
        <span className="bk-hero__lede-en">
          Hard grid. Heavy type. Zero apology.
        </span>
      </p>

      <div className="bk-hero__stack">
        <a className="bk-btn bk-btn--press" href="#bk-works">
          <span lang="ko">시 읽기</span>
          <span className="bk-hero__cta-en">· Read the poems ↓</span>
        </a>
        <a
          className="bk-btn bk-btn--press bk-btn--ghost"
          href="#bk-manifesto"
        >
          <span lang="ko">선언문</span>
          <span className="bk-hero__cta-en">· Manifesto</span>
        </a>
      </div>

      {/* 콘크리트 칩 메타 — 출판의 숫자. */}
      <dl className="bk-hero__meta">
        <div className="bk-hero__cell">
          <dt className="bk-hero__cell-k">
            <span lang="ko">제</span> · ISSUE
          </dt>
          <dd className="bk-hero__cell-v">01</dd>
        </div>
        <div className="bk-hero__cell">
          <dt className="bk-hero__cell-k">
            <span lang="ko">시</span> · POEMS
          </dt>
          <dd className="bk-hero__cell-v">08</dd>
        </div>
        <div className="bk-hero__cell">
          <dt className="bk-hero__cell-k">
            <span lang="ko">이미지</span> · IMAGES
          </dt>
          <dd className="bk-hero__cell-v">00</dd>
        </div>
        <div className="bk-hero__cell">
          <dt className="bk-hero__cell-k">
            <span lang="ko">선</span> · STROKE
          </dt>
          <dd className="bk-hero__cell-v">3px</dd>
        </div>
      </dl>
    </header>
  );
}
