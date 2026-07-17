"use client";

import { useCharSplit } from "../hooks/useCharSplit";

/**
 * Section 01 — the curved-eave frame over the hanok's name.
 *
 * Two earned techniques on the hero:
 *  - char-split-reveal: the title 한옥 settles glyph by glyph (accessible —
 *    aria-label on the h1 holds the full string, the spans are aria-hidden).
 *  - text-path: the bilingual subline rides the curved-eave path (처마),
 *    the eave-red dancheong trim line drawn once with stroke-dashoffset.
 *
 * The eave curve is a single SVG path bowed like a real hanok 처마
 * (the upturned, gently curved roof edge). The textPath follows its arc.
 * Below it sits a small silhouette of the building's gable — ridge, two
 * eave hooks, columns — drawn in the structural palette so the hero
 * already announces "this is a building, and it is the layout".
 *
 * Reduced-motion (handled in CSS): glyphs park at rest, the eave is drawn
 * immediately, the season is frozen. No-JS: same — the page is a finished
 * title card.
 */
const TITLE = "HANOK";

export default function Hero() {
  const glyphs = useCharSplit(TITLE);

  return (
    <header className="hanok-hero" aria-labelledby="hanok-hero-title">
      <p className="hanok-hero__overline">
        <span>
          JIPDAM ATELIER <span lang="ko">집담 아틀리에</span>
        </span>
        <span>
          HANOK DOCUMENTATION <span lang="ko">한옥 기록실</span>
        </span>
      </p>

      <h1 className="hanok-hero__title" id="hanok-hero-title" aria-label="HANOK 한옥">
        {/* aria-hidden spans carry the per-glyph animation; the label above
            is what a screen reader announces. */}
        <span aria-hidden="true">
          {glyphs.map((t, i) => (
            <span
              key={t.key}
              className="hanok-char"
              style={{ "--d": `${200 + i * 90}ms` } as React.CSSProperties}
            >
              {t.ch}
            </span>
          ))}
        </span>
        <span className="hanok-hero__sub" lang="ko">
          한옥 · 집이 곧 레이아웃
        </span>
      </h1>

      <p className="hanok-hero__tagline">
        A building whose wooden structure is the page itself.
        <span lang="ko">집의 목조 구조가 곧 페이지의 구조인 건축.</span>
      </p>

      {/* The curved eave (처마) — the eave-red dancheong trim line drawn
          once, with the bilingual subline riding it via textPath. */}
      <svg
        className="hanok-hero__eave"
        viewBox="0 0 560 120"
        role="img"
        aria-label="A curved eave line, the 처마, drawn in dancheong red, with the words 'mortise and tenon, no nails · 장부이음, 못 없는 집' following its arc. 처마 선을 따라 흐르는 글."
      >
        {/* the eave path — a broad, shallow upward bow like a hanok roof edge.
            pathLength=1 so the dash math is unit-free. */}
        <path
          id="hanok-eave-path"
          className="hanok-eave__curve"
          d="M 24 78 Q 120 30, 280 38 Q 440 46, 536 18"
          pathLength={1}
          fill="none"
        />
        <text className="hanok-eave__text">
          <textPath href="#hanok-eave-path" startOffset="50%" textAnchor="middle">
            MORTISE &amp; TENON · NO NAILS · 장부이음 · 못 없는 집
          </textPath>
        </text>
      </svg>

      {/* the gable silhouette — ridge + two curved eave hooks + columns,
          a small structural mark that telegraphs "building as layout". */}
      <svg
        className="hanok-hero__eave"
        viewBox="0 0 320 120"
        role="img"
        aria-label="The hanok's gable silhouette: a ridge beam, two upward-curving eaves, and four columns. 한옥的山墙 실루엣 — 용마루, 처마, 기둥."
        style={{ marginTop: "clamp(0.4rem, 1.5vh, 1.2rem)", width: "min(320px, 60vw)" }}
      >
        {/* ridge */}
        <line x1="40" y1="36" x2="280" y2="36" stroke="var(--hanok-ink)" strokeWidth="3" strokeLinecap="round" />
        {/* left eave hook curving up */}
        <path d="M 40 36 Q 24 34, 16 50 Q 12 60, 26 64" fill="none" stroke="var(--hanok-beam)" strokeWidth="2.4" strokeLinecap="round" />
        {/* right eave hook curving up */}
        <path d="M 280 36 Q 296 34, 304 50 Q 308 60, 294 64" fill="none" stroke="var(--hanok-beam)" strokeWidth="2.4" strokeLinecap="round" />
        {/* the dancheong eave trim — the one red, on both upturned tips */}
        <circle cx="26" cy="64" r="3" fill="var(--hanok-red)" />
        <circle cx="294" cy="64" r="3" fill="var(--hanok-red)" />
        {/* four columns */}
        <line x1="56" y1="64" x2="56" y2="104" stroke="var(--hanok-beam)" strokeWidth="3" strokeLinecap="round" />
        <line x1="124" y1="64" x2="124" y2="104" stroke="var(--hanok-beam)" strokeWidth="3" strokeLinecap="round" />
        <line x1="196" y1="64" x2="196" y2="104" stroke="var(--hanok-beam)" strokeWidth="3" strokeLinecap="round" />
        <line x1="264" y1="64" x2="264" y2="104" stroke="var(--hanok-beam)" strokeWidth="3" strokeLinecap="round" />
        {/* foundation stones (주춧돌) */}
        <rect x="48" y="104" width="16" height="6" fill="var(--hanok-stone)" />
        <rect x="116" y="104" width="16" height="6" fill="var(--hanok-stone)" />
        <rect x="188" y="104" width="16" height="6" fill="var(--hanok-stone)" />
        <rect x="256" y="104" width="16" height="6" fill="var(--hanok-stone)" />
      </svg>

      <p className="hanok-hero__specline">
        5 structural layers · 3 climate zones · 4 seasons{" "}
        <span lang="ko">다섯 층 · 세 기후 구역 · 네 계절</span>
      </p>

      <p className="hanok-hero__hint" aria-hidden="true">
        scroll <span lang="ko">아래로</span>
      </p>
    </header>
  );
}
