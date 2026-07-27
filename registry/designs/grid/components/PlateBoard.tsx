"use client";

import { usePlate } from "./PlateScope";
import { PROJECTS, TYPOLOGIES, type Project } from "./projects";

/**
 * Section 01 — the plate index. A keyboard-operable segmented control
 * filters the board by typology (all / residential / cultural / urban);
 * every visible plate returns to its lawful cell via the FLIP in
 * useFlip.ts. The status line is a live region, so the repack is
 * announced, not just seen.
 *
 * Each plate is an architectural "drawing plate": a pure-white surface
 * on the warm sheet, carrying its number, name, place, year, GFA,
 * status, and one literary line. The visible grid (column overlay +
 * baseline hairlines inside each plate) is the decoration — the grid
 * IS the hero here, more literally than in RASTER.
 *
 * Spans re-pack on filter:
 *   all 8 → [6,6][8,4][6,6][4,4]... (dense, mixed)
 *   residential 3 → [6,4][6]
 *   cultural 3 → [6,6][6]
 *   urban 2 → [8][8] (stacked, generous)
 */
export default function PlateBoard() {
  const { filter, setFilter } = usePlate();
  const shown = PROJECTS.filter(
    (p) => filter === "all" || p.typology === filter,
  );

  return (
    <section className="grid-section" aria-labelledby="grid-index-title">
      <div className="grid-frame">
        <header className="grid-sechead">
          <span className="grid-sechead__no" aria-hidden="true">
            01
          </span>
          <h2 className="grid-sechead__title" id="grid-index-title">
            index of works{" "}
            <span lang="ko" className="grid-sechead__ko">
              작품 도판 목록
            </span>
          </h2>
        </header>

        <div className="grid-grid grid-index__lead">
          <div className="grid-index__spec" data-flip>
            <p>
              eight projects, three typologies, one field. filter the board;
              every plate re-finds its place on the grid. tolerance: 0 px.
            </p>
            <p lang="ko">
              여덟 프로젝트, 세 유형, 하나의 필드. 보드를 걸러 보라. 모든
              도판이 그리드 위 제자리를 다시 찾는다. 허용 오차: 0픽셀.
            </p>
          </div>

          <div
            className="grid-filter"
            role="group"
            aria-label="typology — 유형"
            data-flip
          >
            <span className="grid-filter__label" aria-hidden="true">
              filter · 유형
            </span>
            <div className="grid-filter__btns">
              {TYPOLOGIES.map((t) => {
                const active = filter === t.key;
                return (
                  <button
                    key={t.key}
                    type="button"
                    className="grid-filter__btn"
                    aria-pressed={active}
                    onClick={() => setFilter(t.key)}
                  >
                    <span className="grid-filter__count grid-mono">
                      {t.count}
                    </span>
                    <span className="grid-filter__en">{t.label.en}</span>
                    <span lang="ko" className="grid-filter__ko">
                      {t.label.ko}
                    </span>
                  </button>
                );
              })}
            </div>
            <p className="grid-filter__state" role="status">
              <span className="grid-mono">{shown.length.toString().padStart(2, "0")}</span>{" "}
              {filter === "all" ? "plates on the board" : `plates · ${filter}`}{" "}
              <span lang="ko">
                {filter === "all" ? "도판" : `${filter} 유형`}
              </span>
            </p>
          </div>
        </div>

        <ul className="grid-grid grid-index__board">
          {shown.map((p) => (
            <Plate key={p.id} project={p} />
          ))}
        </ul>

        <p className="grid-index__note grid-mono">
          fig. 01 — plates are pure white on the warm sheet; the grid (column
          overlay + baseline hairlines) is the only ornament.{" "}
          <span lang="ko">
            도판 01 — 따뜻한 종이 위 순백 도판; 그리드(단 오버레이 + 베이스라인
            헤어라인)만이 유일한 장식이다.
          </span>
        </p>
      </div>
    </section>
  );
}

/**
 * A single project plate. The plate's white surface carries an internal
 * drawing (a plan-elevation-section diagram in hairline ink, with the
 * signal-red used for exactly one accent line per plate), plus the
 * title-block metadata. `data-flip` lets the FLIP repack it.
 *
 * The diagram is decorative — the project's real content is the text — so
 * it is aria-hidden. Status marks are red geometry doubled by ink text.
 */
function Plate({ project }: { project: Project }) {
  return (
    <li
      className={`grid-plate grid-plate--span-${project.span} grid-plate--${project.tier}`}
      data-flip
    >
      <span className="grid-plate__corner grid-mono">{project.id}</span>

      <div className="grid-plate__drawing" aria-hidden="true">
        {/* baseline grid hairlines — the plate wears its own grid */}
        <span className="grid-plate__baselines" />
        {/* a minimal plan-elevation-section diagram, one red accent line */}
        <svg
          className="grid-plate__diagram"
          viewBox="0 0 100 100"
          preserveAspectRatio="xMidYMid meet"
          focusable="false"
        >
          {/* plan: nested rectangles */}
          <rect
            className="grid-draw"
            x="14"
            y="22"
            width="72"
            height="56"
            pathLength={1}
          />
          <rect
            className="grid-draw"
            x="26"
            y="34"
            width="48"
            height="32"
            pathLength={1}
          />
          <rect
            className="grid-draw"
            x="38"
            y="44"
            width="24"
            height="12"
            pathLength={1}
          />
          {/* elevation: the single red accent line — a section cut */}
          <line
            className="grid-draw grid-draw--red"
            x1="14"
            y1="50"
            x2="86"
            y2="50"
            pathLength={1}
          />
          {/* dimension ticks */}
          <line className="grid-draw" x1="14" y1="14" x2="86" y2="14" pathLength={1} />
          <line className="grid-draw" x1="14" y1="10" x2="14" y2="18" pathLength={1} />
          <line className="grid-draw" x1="86" y1="10" x2="86" y2="18" pathLength={1} />
        </svg>
        <span className="grid-plate__dim grid-mono">72.00</span>
      </div>

      <div className="grid-plate__body">
        <h3 className="grid-plate__name">
          {project.name.en}{" "}
          <span lang="ko" className="grid-plate__name-ko">
            {project.name.ko}
          </span>
        </h3>
        <p className="grid-plate__line">
          {project.line.en}
          <span lang="ko">{project.line.ko}</span>
        </p>
        <dl className="grid-plate__meta">
          <div>
            <dt className="grid-mono">place · 위치</dt>
            <dd>
              {project.place.en}
              <span lang="ko">{project.place.ko}</span>
            </dd>
          </div>
          <div>
            <dt className="grid-mono">year · 연도</dt>
            <dd className="grid-mono">{project.year}</dd>
          </div>
          <div>
            <dt className="grid-mono">area · 면적</dt>
            <dd className="grid-mono">{project.area}</dd>
          </div>
          <div>
            <dt className="grid-mono">status · 상태</dt>
            <dd>
              <span
                className={`grid-status grid-status--${project.status}`}
              >
                <i aria-hidden="true" />
                {project.statusLabel.en} —{" "}
                <span lang="ko">{project.statusLabel.ko}</span>
              </span>
            </dd>
          </div>
        </dl>
      </div>
    </li>
  );
}
