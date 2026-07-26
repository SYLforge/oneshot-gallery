"use client";

import type { CSSProperties } from "react";
import { NOTES } from "./botanical";
import { useLineDraw } from "../hooks/useLineDraw";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import { useWashSettle } from "../hooks/useWashSettle";

/**
 * 둘 · The scent notes. Three botanical plates — top, heart, base — each
 * a small perfumer's illustration that draws itself stroke-by-stroke on
 * reveal (svg-line-draw), with its watercolor wash blooming behind it
 * (feturbulence-texture). The three families read left-to-right as the
 * scent's architecture: the bright opening, the floral heart, the deep
 * root.
 *
 * Each plate has its own drawing clock (useLineDraw per card) so they
 * each draw independently as you scroll into them — they are not slaved
 * to the hero's clock. Without JS or reduced motion, each stands fully
 * drawn and settled.
 */
function NoteCard({
  note,
  index,
  reduced,
}: {
  note: (typeof NOTES)[number];
  index: number;
  reduced: boolean;
}) {
  const drawRef = useLineDraw<HTMLDivElement>(reduced);
  const washRef = useWashSettle<HTMLDivElement>(reduced);
  const p = note.plate;

  return (
    <article
      className={`bloom-note bloom-note--${note.family}`}
      data-reveal=""
      style={{ "--i": index } as CSSProperties}
    >
      <div className="bloom-note__art">
        <div ref={drawRef} className="bloom-note__drawwrap">
          <div ref={washRef} className="bloom-note__washwrap">
            <svg
              className="bloom-wash-svg bloom-note__wash"
              viewBox={p.viewBox}
              preserveAspectRatio="xMidYMid meet"
              aria-hidden="true"
              focusable="false"
            >
              <defs>
                <filter
                  id={`bloom-note-${note.family}-wash`}
                  x="-25%"
                  y="-25%"
                  width="150%"
                  height="150%"
                >
                  <feTurbulence
                    type="fractalNoise"
                    baseFrequency={
                      note.family === "heart"
                        ? "0.014 0.02"
                        : note.family === "top"
                          ? "0.016 0.022"
                          : "0.01 0.016"
                    }
                    numOctaves="2"
                    seed={
                      note.family === "heart" ? 23 : note.family === "top" ? 41 : 59
                    }
                    result="wet"
                  />
                  <feDisplacementMap
                    in="SourceGraphic"
                    in2="wet"
                    scale="0"
                    xChannelSelector="R"
                    yChannelSelector="G"
                  />
                </filter>
              </defs>
              <g filter={`url(#bloom-note-${note.family}-wash)`}>
                {p.washes.map((w, i) => (
                  <path key={i} className={w.cls} d={w.d} />
                ))}
              </g>
            </svg>
          </div>
          <svg
            className="bloom-note__lines"
            viewBox={p.viewBox}
            preserveAspectRatio="xMidYMid meet"
            aria-hidden="true"
            focusable="false"
          >
            <g className="bloom-draw">
              {p.strokes.map((s, i) => (
                <path
                  key={`s${i}`}
                  className={`bloom-draw__stroke ${s.cls}`}
                  d={s.d}
                  pathLength={1}
                  strokeWidth={s.w}
                  style={
                    {
                      "--d0": s.d0,
                      "--d1": s.d1,
                    } as CSSProperties
                  }
                />
              ))}
            </g>
          </svg>
        </div>
      </div>
      <div className="bloom-note__label">
        <p className="bloom-note__family" aria-hidden="true">
          {String(index + 1).padStart(2, "0")}
        </p>
        <h3 className="bloom-note__name">
          <span lang="ko">{note.ko}</span>
          <span className="bloom-note__en">{note.en}</span>
        </h3>
        <p className="bloom-note__latin">{note.latin}</p>
        <p className="bloom-note__sense">
          {note.family === "top" && (
            <>
              <span lang="ko">처음 스치는 밝은 잎 — 귤꽃과 베르가못.</span>
              <em>The bright first leaf — neroli and bergamot.</em>
            </>
          )}
          {note.family === "heart" && (
            <>
              <span lang="ko">한가운데 피어오르는 작약 — 분홍빛 숨결.</span>
              <em>The peony that opens at the center — a pink breath.</em>
            </>
          )}
          {note.family === "base" && (
            <>
              <span lang="ko">마지막에 남는 뿌리 — 베티버와 이끼.</span>
              <em>The root that remains — vetiver and moss.</em>
            </>
          )}
        </p>
      </div>
    </article>
  );
}

export default function ScentNotes() {
  const reduced = usePrefersReducedMotion();
  return (
    <section
      className="bloom-notes"
      aria-labelledby="bloom-notes-title"
    >
      <div className="bloom-sechead" data-reveal="">
        <p className="bloom-eyebrow" aria-hidden="true">
          02 — <span lang="ko">세 개의 노트</span>
        </p>
        <h2 className="bloom-sechead__title" id="bloom-notes-title">
          <span lang="ko">향의 세 층</span>
          <span className="bloom-sechead__en">three notes, one bloom</span>
        </h2>
        <p className="bloom-sechead__line">
          <span lang="ko">
            향수는 한 번에 피지 않는다. 위에서 아래로, 천천히 핀다.
          </span>
          <em>A perfume does not bloom all at once — it opens top to base.</em>
        </p>
      </div>
      <div className="bloom-notes__row">
        {NOTES.map((note, i) => (
          <NoteCard key={note.family} note={note} index={i} reduced={reduced} />
        ))}
      </div>
    </section>
  );
}
