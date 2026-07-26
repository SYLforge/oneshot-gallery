"use client";

import type { CSSProperties } from "react";
import { HERO_PLATE } from "./botanical";
import { useLineDraw } from "../hooks/useLineDraw";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import { useWashSettle } from "../hooks/useWashSettle";

/**
 * The arrival. A warm-cream page where a botanical stem draws itself in as
 * you settle — stroke-dashoffset windows staggered along the plate's own
 * drawing clock — while the blush and green watercolor washes behind it
 * bloom outward (feDisplacementMap scale easing from ~60 → 0) and settle.
 * Without JavaScript, or under reduced motion, the whole illustration
 * stands complete and settled: line fully drawn, wash at rest.
 *
 * This is the medium that makes BLOOM distinct from SAKURA: SAKURA scatters
 * cherry-blossom particles across a dark/pink canvas; BLOOM draws a single
 * botanical plate, stroke by stroke, on a light cream ground, then blooms
 * watercolor behind it. Same family thesis (ink → bloom), different
 * medium, different ground.
 */
export default function Hero() {
  const reduced = usePrefersReducedMotion();
  const drawRef = useLineDraw<HTMLDivElement>(reduced);
  const washRef = useWashSettle<HTMLDivElement>(reduced);
  const p = HERO_PLATE;

  return (
    <header id="bloom-hero" className="bloom-hero">
      <div className="bloom-hero__sun" aria-hidden="true" />

      <div
        ref={drawRef}
        className="bloom-hero__stage"
        aria-hidden="true"
      >
        {/* The wash layer sits behind the line-art and blooms through a
            shared feTurbulence+feDisplacementMap filter. */}
        <div ref={washRef} className="bloom-hero__washes">
          <svg
            className="bloom-wash-svg"
            viewBox={p.viewBox}
            preserveAspectRatio="xMidYMax meet"
            aria-hidden="true"
            focusable="false"
          >
            <defs>
              <filter
                id="bloom-hero-wash"
                x="-20%"
                y="-20%"
                width="140%"
                height="140%"
              >
                <feTurbulence
                  type="fractalNoise"
                  baseFrequency="0.012 0.018"
                  numOctaves="2"
                  seed="11"
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
            <g filter="url(#bloom-hero-wash)">
              {p.washes.map((w, i) => (
                <path key={i} className={w.cls} d={w.d} />
              ))}
            </g>
          </svg>
        </div>

        {/* The line-art layer — every stroke draws along the shared clock. */}
        <svg
          className="bloom-hero__lines"
          viewBox={p.viewBox}
          preserveAspectRatio="xMidYMax meet"
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
            {p.leaves.map((l, i) => (
              <g key={`l${i}`} transform={l.xform}>
                <path
                  className="bloom-draw__stroke bloom-leaf-line"
                  d={l.d}
                  pathLength={1}
                  strokeWidth={2}
                  style={
                    {
                      "--d0": l.d0,
                      "--d1": l.d1 - 0.06,
                    } as CSSProperties
                  }
                />
                <path
                  className="bloom-draw__stroke bloom-vein"
                  d={l.vein}
                  pathLength={1}
                  strokeWidth={1}
                  style={
                    {
                      "--d0": l.d1 - 0.06,
                      "--d1": l.d1,
                    } as CSSProperties
                  }
                />
              </g>
            ))}
          </g>
        </svg>
      </div>

      <div className="bloom-hero__copy">
        <p className="bloom-hero__kicker">
          <span lang="ko">식물 향수 하우스</span>{" "}
          <span aria-hidden="true">·</span> BOTANICAL PERFUME
        </p>
        <h1 className="bloom-hero__title">
          <span lang="ko" className="bloom-hero__hangul">
            피다
          </span>
          <span className="bloom-hero__latin">
            BLOOM
            <span className="bloom-hero__latin-sub">
              a perfume that opens
            </span>
          </span>
        </h1>
        <p className="bloom-hero__lede">
          <em>A scent is not a thing. It is a thing opening.</em>
          <span lang="ko">
            향기는 사물이 아닙니다. 피어나는 하나의 일입니다.
          </span>
        </p>
        <a className="bloom-hero__cta" href="#bloom-the-bloom">
          꽃이 피는 자리로 <span aria-hidden="true">·</span> go to where it opens
        </a>
      </div>

      <p className="bloom-hero__hint">
        <span lang="ko">천천히 스크롤하세요</span> — every line draws as you go
      </p>
    </header>
  );
}
