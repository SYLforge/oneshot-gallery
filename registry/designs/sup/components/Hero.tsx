"use client";

import type { CSSProperties } from "react";
import { growPlant, leafPath, type Plant } from "./plant";
import { useGrowth } from "../hooks/useGrowth";
import { usePointerDrift } from "../hooks/usePointerDrift";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

/**
 * Generated once at module load with fixed seeds — identical markup on the
 * server and the client, so the plants are real SSR'd content.
 * MAIN is the hero tree (5 L-system iterations); BACK is the smaller
 * understory shrub that drifts the other way under the pointer.
 */
const MAIN = growPlant(20260710, 5, 560, 720, 0.62);
const BACK = growPlant(1207, 3, 560, 720, 0.9);

function PlantSvg({ plant, className }: { plant: Plant; className: string }) {
  return (
    <svg
      className={className}
      viewBox={plant.viewBox}
      preserveAspectRatio="xMidYMax meet"
      aria-hidden="true"
      focusable="false"
    >
      <g className="sup-growth">
        {plant.branches.map((b, i) => (
          <path
            key={`b${i}`}
            className={`sup-growth__branch sup-growth__branch--t${Math.min(b.depth, 3)}`}
            d={b.d}
            pathLength={1}
            strokeWidth={b.w}
            style={
              {
                "--t1": b.t1,
                "--tw": Math.round((b.t1 - b.t0) * 1000) / 1000,
              } as CSSProperties
            }
          />
        ))}
        {plant.leaves.map((l, i) => (
          <g key={`l${i}`} transform={`translate(${l.x} ${l.y}) rotate(${l.ang})`}>
            <path
              className={`sup-growth__leaf sup-growth__leaf--${l.tone}`}
              d={leafPath(l.size)}
              style={{ "--lt": l.t } as CSSProperties}
            />
          </g>
        ))}
      </g>
    </svg>
  );
}

/**
 * The arrival. A cream clearing where an L-system tree draws itself in as
 * you settle — stroke-dashoffset windows staggered along the plant's own
 * growth clock — while the title simply waits. Without JavaScript, or under
 * reduced motion, both plants stand fully grown from the first paint.
 */
export default function Hero() {
  const reduced = usePrefersReducedMotion();
  const driftRef = usePointerDrift<HTMLElement>(reduced);
  const growRef = useGrowth<HTMLDivElement>(reduced);

  return (
    <header id="sup-hero" ref={driftRef} className="sup-hero">
      <div className="sup-hero__sun" aria-hidden="true" />

      <div ref={growRef} className="sup-hero__stage" aria-hidden="true">
        <PlantSvg plant={BACK} className="sup-hero__plant sup-hero__plant--back" />
        <PlantSvg plant={MAIN} className="sup-hero__plant sup-hero__plant--main" />
      </div>

      <div className="sup-hero__copy">
        <p className="sup-hero__kicker">
          FOREST BATHING <span aria-hidden="true">·</span>{" "}
          <span lang="ko">산림욕 리트릿</span>
        </p>
        <h1 className="sup-hero__title">
          <span lang="ko" className="sup-hero__hangul">
            숲
          </span>
          <span className="sup-hero__latin">
            SUP<span className="sup-hero__latin-sub">the forest, plainly</span>
          </span>
        </h1>
        <p className="sup-hero__lede">
          <em>Breathe in for four. The forest is already breathing with you.</em>
          <span lang="ko">
            넷을 세며 들이쉬세요. 숲은 이미 당신과 함께 숨 쉬고 있습니다.
          </span>
        </p>
        <a className="sup-hero__cta" href="#sup-breath">
          숨 고르러 가기 <span aria-hidden="true">·</span> begin with one breath
        </a>
      </div>

      <p className="sup-hero__hint">
        <span lang="ko">천천히 내려오세요</span> — nothing here is in a hurry
      </p>
    </header>
  );
}
