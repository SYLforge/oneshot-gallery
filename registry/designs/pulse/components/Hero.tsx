"use client";

import NebulaField from "./NebulaField";
import type { MutableRefObject } from "react";

type Props = {
  trackRef: MutableRefObject<{ raw: number; smooth: number }>;
  reduced: boolean;
};

/**
 * Section 01 — the drop. The nebula fills the viewport behind the masthead;
 * the album title sits in the negative space over the dense core. The "void"
 * is two DOM layers: the radial ground (CSS, always painted) and the magenta
 * rim pool that intensifies on the beat — the no-JS view and the canvas
 * understudy. The canvas itself is added by NebulaField and is aria-hidden;
 * the scene carries role="img" via the wrapping section's aria-label.
 *
 * The hero copy stays legible over the densest part of the field thanks to a
 * scrim gradient behind the title; the rest of the field breathes uncovered.
 */
export default function Hero({ trackRef, reduced }: Props) {
  return (
    <header className="pulse-hero" aria-label="PULSE — Audio-Reactive Nebula">
      {/* The void — radial ground + beat-reactive rim pool. Always painted. */}
      <div className="pulse-hero__void" aria-hidden="true">
        <div className="pulse-hero__core" />
        <div className="pulse-hero__scrim" />
      </div>

      {/* The nebula — canvas, aria-hidden (the section aria-label is the alt). */}
      <NebulaField trackRef={trackRef} reduced={reduced} />

      <div className="pulse-hero__inner">
        <p className="pulse-kicker">
          <span className="pulse-kicker__en">RELEASE 001 · 120 BPM</span>
          <span lang="ko" className="pulse-kicker__ko">
            1집 · 120 BPM
          </span>
        </p>

        <h1 className="pulse-title" data-pulse-breathe>
          <span className="pulse-title__en" aria-hidden="true">
            PULSE
          </span>
          <span lang="ko" className="pulse-title__ko">
            박동
          </span>
          <span className="pulse-sr-only">
            PULSE — 박동. Audio-reactive nebula. 오디오 리액티브 성운.
          </span>
        </h1>

        <p className="pulse-lede">
          One album dropped into the dark. A generative particle nebula
          breathes to a simulated beat — no real audio, only the field moving
          as if it were listening.
          <span lang="ko" className="pulse-lede__ko">
            어둠 속에 내려놓은 한 장의 앨범. 생성적 파티클 성운이 시뮬레이션된
            비트에 맞춰 숨 쉰다 — 실제 오디오는 없다, 그저 마치 듣고 있는 것처럼
            움직이는 장일 뿐.
          </span>
        </p>

        <dl className="pulse-spec">
          <div>
            <dt>Catalog</dt>
            <dd>PULSE-001</dd>
          </div>
          <div>
            <dt>Tracks</dt>
            <dd>04 · <span lang="ko">곡 4개</span></dd>
          </div>
          <div>
            <dt>Runtime</dt>
            <dd>17:48</dd>
          </div>
          <div>
            <dt>Tempo</dt>
            <dd>120 BPM</dd>
          </div>
        </dl>

        <p className="pulse-hero__scrollhint" aria-hidden="true">
          scroll — the field shifts per track · 스크롤하면 곡마다 장이 바뀐다
        </p>
      </div>
    </header>
  );
}
