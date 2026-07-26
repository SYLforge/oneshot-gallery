"use client";

import { useEffect, useRef } from "react";
import type { RefObject } from "react";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

type Track = {
  no: string;
  title: { en: string; ko: string };
  bpm: string;
  dur: string;
  note: { en: string; ko: string };
};

const TRACKS: Track[] = [
  {
    no: "01",
    title: { en: "OPENING SIGNAL", ko: "시작 신호" },
    bpm: "92",
    dur: "1:48",
    note: {
      en: "The wordmark enters narrow. A single width axis, a single breath.",
      ko: "좁게 들어오는 워드마크. 폭 축 하나, 호흡 하나.",
    },
  },
  {
    no: "02",
    title: { en: "THE MORPH", ko: "늘어남" },
    bpm: "128",
    dur: "3:12",
    note: {
      en: "Scrubbed by hand. Width 62 to 125, weight 100 to 900 — the whole range in one sweep.",
      ko: "손으로 스크럽. 폭 62에서 125, 굵기 100에서 900 — 한 번의 쓸기에 전 범위.",
    },
  },
  {
    no: "03",
    title: { en: "VELOCITY / AMPLITUDE", ko: "속도 / 진폭" },
    bpm: "140",
    dur: "2:37",
    note: {
      en: "The faster you scroll, the harder the glyphs pull. Effort becomes amplitude.",
      ko: "빠를수록 글자가 세게 당겨진다. 노력이 진폭이 된다.",
    },
  },
  {
    no: "04",
    title: { en: "CROSSED TICKERS", ko: "엇갈리는 티커" },
    bpm: "104",
    dur: "2:04",
    note: {
      en: "Three lyric bands at three speeds, two directions. Counterpoint made of type.",
      ko: "세 속도, 두 방향의 가사 띠 세 줄. 타이포로 만든 대위법.",
    },
  },
  {
    no: "05",
    title: { en: "HOLD THE LETTER", ko: "글자를 잡아라" },
    bpm: "76",
    dur: "4:21",
    note: {
      en: "Pause anywhere. The type holds with you — it has no clock of its own.",
      ko: "아무 데서나 멈춰라. 글자는 당신과 함께 멈춘다 — 자기 시계가 없다.",
    },
  },
];

/**
 * The tracklist. A real playlist for the fictional single — track numbers,
 * titles, BPM, durations, and one line of bilingual liner notes each. The
 * section head reacts to scroll velocity (the shared `velRef`): under a fine
 * pointer and without reduced motion, the head's letter-spacing opens up
 * with amplitude — a restrained echo of the hero's stretch, written in rAF
 * to `letter-spacing` via a CSS variable (no layout thrash: tracking on a
 * single short line is cheap, and it is the one place on the page that uses
 * a non-transform animatable — deliberately, because kinetic typography is
 * the premise and letter-spacing IS type).
 *
 * Each row reveals as it enters (opacity + translate, gated behind
 * `.typewave-js`). Reduced motion / no-JS: the list is a plain, complete,
 * readable table.
 */
export default function TrackList({
  velRef,
}: {
  velRef: RefObject<number>;
}) {
  const headRef = useRef<HTMLHeadingElement | null>(null);
  const reduced = usePrefersReducedMotion();

  // Velocity → head letter-spacing, via a CSS var, in rAF.
  useEffect(() => {
    const head = headRef.current;
    if (!head) return;
    if (reduced) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      return;
    }

    let raf = 0;
    let shown = 0;
    const MAX_TRACK = 0.12; // em of added letter-spacing at full velocity
    const tick = () => {
      raf = 0;
      const target = Math.min(velRef.current, 1);
      if (target > shown) shown += (target - shown) * 0.3;
      else shown *= 0.82;
      if (shown < 0.001) shown = 0;
      head.style.setProperty("--tw-track", `${(shown * MAX_TRACK).toFixed(4)}em`);
      if (shown > 0.0005) raf = requestAnimationFrame(tick);
    };
    let armed = false;
    const arm = () => {
      if (armed) return;
      armed = true;
      if (!raf) raf = requestAnimationFrame(tick);
    };
    window.addEventListener("scroll", arm, { passive: true });
    return () => {
      window.removeEventListener("scroll", arm);
      if (raf) cancelAnimationFrame(raf);
      head.style.removeProperty("--tw-track");
      armed = false;
      shown = 0;
    };
  }, [reduced, velRef]);

  return (
    <section
      className="typewave-tracks typewave-frame"
      aria-labelledby="typewave-tracks-title"
    >
      <header className="typewave-tracks__head">
        <p className="typewave-sechead__no typewave-mono" aria-hidden="true">
          TRACKLIST · 05
        </p>
        <h2
          ref={headRef}
          className="typewave-sechead typewave-tracks__title"
          id="typewave-tracks-title"
          style={{ "--tw-track": "0em" } as React.CSSProperties}
        >
          THE TRACKS
          <span lang="ko" className="typewave-sechead__ko">
            트랙리스트
          </span>
        </h2>
      </header>

      <ol className="typewave-tracks__list">
        {TRACKS.map((t) => (
          <li key={t.no} className="typewave-tracks__row" data-reveal>
            <span className="typewave-tracks__no typewave-mono">{t.no}</span>
            <div className="typewave-tracks__body">
              <h3 className="typewave-tracks__name">
                {t.title.en}
                <span lang="ko" className="typewave-tracks__nameko">
                  {t.title.ko}
                </span>
              </h3>
              <p className="typewave-tracks__note">
                {t.note.en}
                <span lang="ko">{t.note.ko}</span>
              </p>
            </div>
            <dl className="typewave-tracks__meta typewave-mono">
              <div>
                <dt>BPM</dt>
                <dd>{t.bpm}</dd>
              </div>
              <div>
                <dt>LEN</dt>
                <dd>{t.dur}</dd>
              </div>
            </dl>
          </li>
        ))}
      </ol>

      <p className="typewave-tracks__ledger">
        Total runtime 13:42 · one accent · zero audio files. The tracklist is
        the page; the page is the tracklist.
        <span lang="ko">
          총 재생시간 13:42 · 액센트 하나 · 오디오 파일 없음. 트랙리스트가 곧
          페이지고, 페이지가 곧 트랙리스트다.
        </span>
      </p>
    </section>
  );
}
