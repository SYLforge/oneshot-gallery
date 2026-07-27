"use client";

/**
 * Section 01 — the masthead. A literary serif wordmark "RISO" set in three
 * overprinting halftone plates: a fluorescent-pink copy, a riso-blue copy,
 * and a riso-yellow copy, each slightly misregistered and blended with
 * mix-blend-mode: multiply, so where they cross the colors stack toward
 * ink exactly like a three-drum riso pass. The plates are CSS pseudo-
 * elements using `content: attr(data-text) / ""` so screen readers hear
 * the word once. The ink layer sits on top and carries the contrast.
 *
 * Beside it: a clip-path-reveal poster — a "now printing" sheet that wipes
 * open from a hard press cut (the inset polygon grows from the center) on
 * mount under `.riso-js`. Under reduced motion / no-JS the poster simply
 * stands printed. The poster is pure SVG (a cinema marquee over a halftone
 * field), no images.
 */
export default function Hero() {
  return (
    <header className="riso-hero">
      <div className="riso-hero__masthead">
        <p className="riso-hero__kicker">
          <span>EST. 2014 · MAPONAMPO, SEOUL</span>
          <span lang="ko">독립 출판 · 아트시네마</span>
        </p>

        <h1 className="riso-wordmark">
          <span className="riso-word" data-text="RISO">
            <span className="riso-word__ink">RISO</span>
          </span>
        </h1>

        <p className="riso-hero__ko" lang="ko">
          리소 — 종이 위에 쌓이는 빛
        </p>

        <p className="riso-hero__lede">
          <span lang="ko">세 개의 도수, 한 장의 종이.</span>{" "}
          We print books and screen films the same way — one drum at a time,
          fluorescent on uncoated stock, the overlap doing all the work.
        </p>

        <div className="riso-hero__cta">
          <a className="riso-btn" href="#riso-press">
            <span>See the press</span>
            <span lang="ko">인쇄기 보기</span>
          </a>
          <a className="riso-link" href="#riso-books">
            Browse the catalogue <span lang="ko">목록 보기</span> →
          </a>
        </div>
      </div>

      {/* The "now printing" sheet — clip-path reveal. */}
      <figure className="riso-poster" aria-labelledby="riso-poster-cap">
        <span className="riso-poster__sheet">
          {/* halftone field */}
          <span className="riso-poster__halftone riso-poster__halftone--pink" aria-hidden="true" />
          <span className="riso-poster__halftone riso-poster__halftone--blue" aria-hidden="true" />
          <svg className="riso-poster__art" viewBox="0 0 320 420" width="320" height="420" aria-hidden="true" focusable="false">
            {/* cinema marquee frame */}
            <rect x="24" y="40" width="272" height="340" fill="none" stroke="var(--riso-ink)" strokeWidth="2.5" />
            <rect x="34" y="50" width="252" height="56" fill="var(--riso-ink)" />
            <text x="160" y="86" textAnchor="middle" className="riso-poster__marquee">NOW SHOWING</text>
            {/* a projected beam, dotted */}
            <g stroke="var(--riso-ink)" strokeWidth="1.4">
              <line x1="160" y1="120" x2="70" y2="360" strokeDasharray="2 5" />
              <line x1="160" y1="120" x2="250" y2="360" strokeDasharray="2 5" />
            </g>
            {/* screen */}
            <rect x="120" y="120" width="80" height="60" fill="var(--riso-yellow)" stroke="var(--riso-ink)" strokeWidth="2" />
            {/* seats */}
            <g fill="var(--riso-ink)">
              <rect x="70" y="340" width="24" height="20" />
              <rect x="108" y="340" width="24" height="20" />
              <rect x="188" y="340" width="24" height="20" />
              <rect x="226" y="340" width="24" height="20" />
            </g>
          </svg>
          <span className="riso-poster__folio">№ 014 · 3C RISO</span>
        </span>
        <figcaption className="riso-poster__cap" id="riso-poster-cap">
          <span lang="ko">현재 상영중</span> · A three-color overprint,
          fluorescent pink, riso blue, riso yellow — pulled by hand.
        </figcaption>
      </figure>
    </header>
  );
}
