"use client";

import { useRef } from "react";
import { CHAPTERS } from "./chapters";
import ChapterSpread from "./ChapterSpread";
import { useChapterProgress } from "../hooks/useChapterProgress";

/**
 * The signature moment — the book held open and turned by scrolling.
 *
 * The outer section is tall on purpose: its height in CSS is
 * `(CHAPTERS + 1) × 100vh`, giving one viewport of runway per spread plus a
 * closing beat. Its inner `.chapter-spreads__sticky` is
 * `position: sticky; top: 0; height: 100vh` — the book held open while you
 * scroll. As you scroll the runway, `useChapterProgress` writes a smoothed
 * `--chapter-spread` (0 → 1) and a `data-spreadstate` (0..N-1) onto the sticky
 * stage; CSS crossfades the spreads so each holds, dissolves into the next,
 * and the editorial frame never moves — the page genuinely *turns*.
 *
 * A top chrome band carries the folio counter (01 / 06) and a bottom hint
 * that names the gesture: scroll to turn. Every spread is present in the DOM
 * and readable in source order without JavaScript; the crossfade is a reveal
 * of already-present content, so it stays live (un-smoothed) under reduced
 * motion.
 */
export default function ChapterSpreads() {
  const pinRef = useRef<HTMLElement | null>(null);
  useChapterProgress(pinRef, CHAPTERS.length);

  return (
    <section
      className="chapter-spreads"
      aria-labelledby="chapter-spreads-title"
      ref={pinRef}
    >
      <h2 id="chapter-spreads-title" className="chapter-vh">
        The six hours · 여섯때의 챕터
      </h2>

      <div className="chapter-spreads__sticky">
        <div className="chapter-spreads__chrome" aria-hidden="true">
          <span className="chapter-folio">
            <span lang="ko">시간의 책</span>
            <span className="chapter-spreads__counter">01</span>
            {" / "}
            {String(CHAPTERS.length).padStart(2, "0")}
          </span>
        </div>

        <div className="chapter-spreads__progress" aria-hidden="true" />

        <div className="chapter-spreads__book" role="list">
          {CHAPTERS.map((chapter) => (
            <ChapterSpread key={chapter.no} chapter={chapter} />
          ))}
        </div>

        <p className="chapter-spreads__hint" aria-hidden="true">
          scroll to turn · <span lang="ko">스크롤이 곧 페이지 넘김</span>
        </p>
      </div>
    </section>
  );
}
