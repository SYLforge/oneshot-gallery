"use client";

import { useRef } from "react";
import { useScrubProgress } from "../hooks/useScrubProgress";

/**
 * Section 02 — the section drawing, built by scroll.
 *
 * A pinned plate holds an architectural section drawing. As the page
 * scrolls through the parent's extra height, the drawing builds itself:
 * ground line first, then the floor slabs, then the columns, then the
 * roof, then the dimensions — each stroke interpolating its
 * stroke-dashoffset 1 → 0 from a fraction of scrub progress, so the
 * drawing assembles in the order an architect inks it. Dimension labels
 * fade in as their lines complete.
 *
 * The scrub is lerp-smoothed (the smoothing is the whole point — a
 * building being drawn should not stutter), driven by useScrubProgress.
 * A mono readout reports the build percentage. Under reduced motion, or
 * without JS, the drawing renders fully built.
 *
 * Distinct from RASTER's modular-scale scrub (which drove font scale):
 * this is a pinned section whose *timeline* is the scroll, not a scroll-
 * scaled transform on inline elements.
 */
export default function SectionBuild() {
  const parentRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const readRef = useRef<HTMLSpanElement | null>(null);

  useScrubProgress(parentRef, containerRef, (p) => {
    if (readRef.current) {
      const pct = Math.round(p * 100);
      readRef.current.textContent = `build ${pct.toString().padStart(2, "0")}% · 진행도 ${pct}%`;
    }
  });

  return (
    <section className="grid-section" aria-labelledby="grid-section-title">
      <div className="grid-frame">
        <header className="grid-sechead">
          <span className="grid-sechead__no" aria-hidden="true">
            02
          </span>
          <h2 className="grid-sechead__title" id="grid-section-title">
            section, drawn in order{" "}
            <span lang="ko" className="grid-sechead__ko">
              단면도, 순서대로
            </span>
          </h2>
        </header>

        <div className="grid-grid grid-section__lead">
          <div className="grid-section__spec" data-flip>
            <p>
              a section is not drawn all at once. the ground comes first,
              then the slabs it carries, then the columns that hold the
              slabs, then the roof, then the dimensions that argue with it
              all. scroll, and the drawing assembles itself in that order.
            </p>
            <p lang="ko">
              단면은 한꺼번에 그려지지 않는다. 먼저 땅이 오고, 땅이 받치는
              슬래브, 슬래브를 드는 기둥, 지붕, 그 모든 것과 다투는 치수가
              뒤따른다. 스크롤하면, 도면이 그 순서로 스스로 모인다.
            </p>
          </div>
          <p className="grid-section__read grid-mono" aria-hidden="true">
            <span ref={readRef}>build 00% · 진행도 0%</span>
          </p>
        </div>
      </div>

      {/* The pinned stage. The parent carries extra height so there is
          travel to scrub through while the sticky child holds still. */}
      <div ref={parentRef} className="grid-section__stage-wrap">
        <div ref={containerRef} className="grid-section__stage">
          <div className="grid-frame">
            <div className="grid-section__plate" data-flip>
              <span className="grid-section__plate-id grid-mono">
                section A-A · scale 1:200
              </span>
              <span className="grid-section__baselines" aria-hidden="true" />

              <svg
                className="grid-section__drawing"
                viewBox="0 0 1200 600"
                preserveAspectRatio="xMidYMid meet"
                role="img"
                aria-label="Section drawing A-A, a four-storey building drawn line by line: ground, slabs, columns, roof, then dimensions. The signal-red line marks the single cut."
              >
                {/* Each group starts its dashoffset draw at a fraction of
                    scrub progress, set via CSS using calc() on the
                    --grid-scrub variable written by the hook. The order is
                    the inking order: ground → slabs → columns → roof → dims. */}

                {/* 1. ground line — starts at p=0.00 */}
                <g className="grid-build" data-start="0.00">
                  <line className="grid-build__ln" x1="120" y1="500" x2="1080" y2="500" pathLength={1} />
                  <line className="grid-build__ln" x1="120" y1="500" x2="120" y2="520" pathLength={1} />
                  <line className="grid-build__ln" x1="1080" y1="500" x2="1080" y2="520" pathLength={1} />
                </g>

                {/* 2. floor slabs — starts at p=0.18 */}
                <g className="grid-build" data-start="0.18">
                  <line className="grid-build__ln" x1="180" y1="420" x2="1020" y2="420" pathLength={1} />
                  <line className="grid-build__ln" x1="180" y1="340" x2="1020" y2="340" pathLength={1} />
                  <line className="grid-build__ln" x1="180" y1="260" x2="1020" y2="260" pathLength={1} />
                  <line className="grid-build__ln" x1="180" y1="180" x2="1020" y2="180" pathLength={1} />
                </g>

                {/* 3. columns — starts at p=0.40 */}
                <g className="grid-build" data-start="0.40">
                  <line className="grid-build__ln" x1="180" y1="180" x2="180" y2="500" pathLength={1} />
                  <line className="grid-build__ln" x1="380" y1="180" x2="380" y2="500" pathLength={1} />
                  <line className="grid-build__ln" x1="600" y1="180" x2="600" y2="500" pathLength={1} />
                  <line className="grid-build__ln" x1="820" y1="180" x2="820" y2="500" pathLength={1} />
                  <line className="grid-build__ln" x1="1020" y1="180" x2="1020" y2="500" pathLength={1} />
                </g>

                {/* 4. roof — the single signal-red line, the cut itself */}
                <g className="grid-build" data-start="0.62">
                  <line className="grid-build__ln grid-build__ln--red" x1="150" y1="150" x2="1050" y2="150" pathLength={1} />
                  <line className="grid-build__ln" x1="150" y1="150" x2="180" y2="180" pathLength={1} />
                  <line className="grid-build__ln" x1="1050" y1="150" x2="1020" y2="180" pathLength={1} />
                </g>

                {/* 5. dimensions — fade in last */}
                <g className="grid-build grid-build--dims" data-start="0.80">
                  <line className="grid-build__ln" x1="80" y1="180" x2="80" y2="500" pathLength={1} />
                  <line className="grid-build__ln" x1="74" y1="180" x2="86" y2="180" pathLength={1} />
                  <line className="grid-build__ln" x1="74" y1="500" x2="86" y2="500" pathLength={1} />
                  <line className="grid-build__ln" x1="180" y1="540" x2="1020" y2="540" pathLength={1} />
                  <line className="grid-build__ln" x1="180" y1="534" x2="180" y2="546" pathLength={1} />
                  <line className="grid-build__ln" x1="1020" y1="534" x2="1020" y2="546" pathLength={1} />
                </g>

                {/* dimension labels — fade in with their lines */}
                <text className="grid-build__txt" x="600" y="560" data-start="0.80">42.00</text>
                <text className="grid-build__txt" x="60" y="345" data-start="0.80">12.40</text>
                <text className="grid-build__txt grid-build__txt--red" x="600" y="138" data-start="0.62">cut line · 절단선</text>
                <text className="grid-build__txt" x="600" y="492" data-start="0.00">ground line · 지반선</text>
              </svg>

              <dl className="grid-section__legend">
                <div>
                  <dt className="grid-mono">01</dt>
                  <dd>
                    ground · 지반
                    <span className="grid-section__frac grid-mono">p 0.00</span>
                  </dd>
                </div>
                <div>
                  <dt className="grid-mono">02</dt>
                  <dd>
                    slabs · 슬래브
                    <span className="grid-section__frac grid-mono">p 0.18</span>
                  </dd>
                </div>
                <div>
                  <dt className="grid-mono">03</dt>
                  <dd>
                    columns · 기둥
                    <span className="grid-section__frac grid-mono">p 0.40</span>
                  </dd>
                </div>
                <div>
                  <dt className="grid-mono">04</dt>
                  <dd>
                    roof — the cut · 지붕, 절단
                    <span className="grid-section__frac grid-mono">p 0.62</span>
                  </dd>
                </div>
                <div>
                  <dt className="grid-mono">05</dt>
                  <dd>
                    dimensions · 치수
                    <span className="grid-section__frac grid-mono">p 0.80</span>
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
