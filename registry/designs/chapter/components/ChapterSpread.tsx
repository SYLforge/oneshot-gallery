"use client";

import { type Chapter } from "./chapters";

/**
 * A single chapter spread — one leaf of the book, held open.
 *
 * A drop-cap lead (the Korean title's first glyph, floated and oversized),
 * the chapter's prose beneath it, a single italic companion line in Latin,
 * and a marginalia note pinned to the margin like a reader's annotation.
 *
 * The spreads are stacked in a single CSS grid cell (see ChapterSpreads) so
 * that scroll can crossfade between them like turning a page — opacity plus a
 * hairline scale, never a layout property. Each spread is fully present in
 * the DOM and readable in source order without JavaScript; the crossfade is
 * a *reveal* of already-present content.
 */
export default function ChapterSpread({ chapter }: { chapter: Chapter }) {
  return (
    <article
      className="chapter-spread"
      data-spread={chapter.no}
      aria-label={`Chapter ${chapter.no} — ${chapter.ko_title} · ${chapter.en_title}`}
    >
      <div className="chapter-spread__chrome" aria-hidden="true">
        <span className="chapter-spread__hour">{chapter.hour}</span>
        <span className="chapter-spread__chrome-mid">
          <span lang="ko">제 {chapter.no}장</span>
          <span className="chapter-spread__dot">·</span>
          chapter {chapter.no}
        </span>
      </div>

      <div className="chapter-spread__leaf">
        <header className="chapter-spread__head">
          <span className="chapter-spread__no">{chapter.no}</span>
          <h2 className="chapter-spread__title">
            <span lang="ko">{chapter.ko_title}</span>
            <em className="chapter-spread__en">{chapter.en_title}</em>
          </h2>
        </header>

        <div className="chapter-spread__body">
          <p className="chapter-spread__text" lang="ko">
            <span className="chapter-dropcap" aria-hidden="true">
              {chapter.ko_title[0]}
            </span>
            {chapter.ko}
          </p>
          <p className="chapter-spread__text chapter-spread__text--en">
            <em>{chapter.en}</em>
          </p>
        </div>

        <aside className="chapter-marginalia">
          <span className="chapter-marginalia__star" aria-hidden="true">
            ※
          </span>
          <span lang="ko">{chapter.marginalia}</span>
        </aside>
      </div>
    </article>
  );
}
