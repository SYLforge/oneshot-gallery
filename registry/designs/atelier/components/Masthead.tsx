"use client";

import type { CSSProperties } from "react";
import { useMasthead } from "../hooks/useMasthead";

const MASTHEAD = ["A", "T", "E", "L", "I", "E", "R"];
const KOREAN = "아 틀 리 에";

/**
 * The cover. A near-black field with a faint paper wash, the maison name set
 * across the full width in oversized Bodoni, and a single gold hairline
 * beneath it — the only gold on the cover. The name reveals per glyph: each
 * letter is an `aria-hidden` span behind the h1's `aria-label`, lifted from
 * the baseline and un-clipped by a per-index stagger. The CSS default state
 * IS the finished one, so without JavaScript and under reduced motion the
 * masthead is simply there, fully set.
 *
 * Below: the season, the collection name in both languages, and the one-line
 * editor's standfirst — written as the magazine would write it, present
 * tense, no adjectives doubled, Korean transcreated (never translated).
 */
export default function Masthead() {
  const ref = useMasthead<HTMLHeadingElement>(false);

  return (
    <header className="atelier-cover" aria-labelledby="atelier-masthead">
      <div className="atelier-cover__topline">
        <span className="atelier-folio">SÉOUL · MMXXVI</span>
        <span className="atelier-folio atelier-folio--mid">
          No. 39 · RESERVE
        </span>
        <span className="atelier-folio atelier-folio--right">
          f/w · 가을/겨울
        </span>
      </div>

      <p className="atelier-cover__eyebrow" data-reveal="fade">
        The maison lookbook ·{" "}
        <span lang="ko">메종 룩북</span>
      </p>

      <h1
        id="atelier-masthead"
        ref={ref}
        className="atelier-masthead"
        aria-label="ATELIER"
      >
        {MASTHEAD.map((ch, i) => (
          <span
            key={`${ch}-${i}`}
            aria-hidden="true"
            className="atelier-masthead__ch"
            style={{ "--atelier-ci": i } as CSSProperties}
          >
            {ch}
          </span>
        ))}
      </h1>

      <p className="atelier-cover__ko" aria-hidden="true">
        {KOREAN}
      </p>

      <div className="atelier-cover__rule" aria-hidden="true" />

      <p className="atelier-cover__stand" data-reveal="fade">
        Five looks, set in silence, for the season the light turns inward.{" "}
        <span lang="ko" className="atelier-cover__standko">
          빛이 안으로 돌아드는 계절을 위해, 침묵 속에 깎은 다섯 벌.
        </span>
      </p>

      <p className="atelier-cover__scroll" aria-hidden="true">
        turn the page ↓
      </p>
    </header>
  );
}
