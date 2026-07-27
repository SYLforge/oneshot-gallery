"use client";

import { useEffect, useRef } from "react";
import NumeralMark from "./NumeralMark";

/**
 * Plate 00 — the cover sheet. The atelier wordmark is set in oversized
 * thin Inter; on load each glyph fades and rises with a 40ms stagger
 * (char-split, aria-safe). A baseline grid of faint hairlines and the
 * fixed column overlay carry the construction. A title block in the
 * corner carries the project metadata the way an architectural drawing
 * carries its stamp — coordinates, scale, date, drawn-by.
 *
 * No pointer instrument (that was RASTER's crosshair). The atelier's
 * hero is still: a drawing pinned to the wall, not an instrument under
 * inspection.
 */
export default function Hero() {
  const heroRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    heroRef.current?.classList.add("is-on");
  }, []);

  return (
    <header ref={heroRef} className="grid-hero" aria-labelledby="grid-title">
      <div className="grid-frame grid-hero__inner">
        <p className="grid-hero__kicker grid-mono">
          <span>grid — atelier of measured form · est. 2011</span>
          <span lang="ko">그리드 — 측정된 형태의 사무소</span>
          <span>plate 00 · cover · 도판 00 · 표지</span>
        </p>

        <div className="grid-hero__titlewrap">
          <h1 className="grid-hero__title" id="grid-title" aria-label="GRID">
            <NumeralMark text="GRID" />
          </h1>
          <p className="grid-hero__ko" lang="ko">
            그리드 — 측정된 형태의 사무소
          </p>
        </div>

        <div className="grid-grid grid-hero__foot">
          <div className="grid-hero__spec" data-flip>
            <p>
              the grid is not the subject of our work. it is the instrument
              we measure the subject with.
              <span lang="ko">
                그리드는 우리 작업의 주제가 아니다. 주제를 재는 도구다.
              </span>
            </p>
            <p>
              we publish our buildings as plates — drawn, dimensioned, and
              set on a 12-column field at 1:200.
              <span lang="ko">
                우리는 건물을 도판으로 출판한다 — 그리고, 치수를 붙이고,
                12단 필드 위에 1:200으로 조판한다.
              </span>
            </p>
          </div>

          <dl className="grid-hero__titleblock" data-flip>
            <div>
              <dt className="grid-mono">project · 사무소</dt>
              <dd>grid atelier</dd>
            </div>
            <div>
              <dt className="grid-mono">plate · 도판</dt>
              <dd>00 / cover</dd>
            </div>
            <div>
              <dt className="grid-mono">scale · 축척</dt>
              <dd>1 : 200</dd>
            </div>
            <div>
              <dt className="grid-mono">drawn · 작도</dt>
              <dd>27.07.2026</dd>
            </div>
            <div>
              <dt className="grid-mono">lat / lon</dt>
              <dd className="grid-mono">37.5717 / 126.9834</dd>
            </div>
          </dl>
        </div>

        <p className="grid-hero__cue grid-mono" aria-hidden="true">
          begin reading ↓ 도면 읽기 시작
        </p>
      </div>
    </header>
  );
}
