"use client";

import { type CSSProperties } from "react";

const TITLE = "CHAPTER";

/**
 * The title page — the book's frontispiece, the first leaf.
 *
 * A sticky centred sheet: the kicker, the split-glyph wordmark (each letter
 * drops in on its own delay via the `--ch-i` index), the Korean title, and a
 * single bilingual line of invitation. It is the *scroll-scrub-pinned* cover
 * — it stays put while the reader scrolls into the book, then yields to the
 * spreads. The glyphs are decorative (`aria-hidden`); the `aria-label` on the
 * heading carries the real title for assistive tech.
 *
 * Without JavaScript the glyphs are simply present (the pre-state is gated
 * behind `.chapter-js`), so the cover is a complete, static title page.
 */
export default function TitlePage() {
  return (
    <section className="chapter-titlepage" aria-label="CHAPTER — 시간의 책">
      <p className="chapter-kicker">
        <span lang="ko">시간의 책</span>
        <span aria-hidden="true"> · </span>
        THE BOOK OF HOURS
      </p>

      <h1 className="chapter-title" aria-label={`CHAPTER — 시간의 책`}>
        {TITLE.split("").map((ch, i) => (
          <span
            key={i}
            aria-hidden="true"
            className="chapter-glyph"
            style={{ "--ch-i": i } as CSSProperties}
          >
            {ch}
          </span>
        ))}
      </h1>

      <p className="chapter-title__ko" lang="ko">
        챕터
      </p>

      <div className="chapter-rule" aria-hidden="true" />

      <p className="chapter-title__line">
        <span lang="ko">하루를 한 권의 책으로.</span>{" "}
        <em>A day, set as a book.</em>
      </p>

      <p className="chapter-title__hint" data-reveal>
        <span lang="ko">스크롤이 곧 페이지 넘김 ·</span> scroll to turn the page
      </p>
    </section>
  );
}
