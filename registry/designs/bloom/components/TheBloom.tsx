"use client";

import type { CSSProperties } from "react";
import {
  SIGNATURE_PETALS,
  SIGNATURE_CENTER,
  SIGNATURE_WASH,
} from "./botanical";
import { useScrollProgress } from "../hooks/useScrollProgress";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

/**
 * 셋 · The bloom — the signature moment. A pinned (position: sticky) section
 * where one large eight-petal flower stays fixed in the viewport while your
 * scroll progress through the section drives `--bloom-open` from 0 → 1.
 * styles.css converts that one variable into each petal's scale (0.42 → 1)
 * and rotation (-8° → 0°), so the flower opens petal-by-petal as you
 * scroll — and closes again if you scroll back up.
 *
 * The line-art here is fully pre-drawn (this section is about OPENING, not
 * drawing — that was the hero's job); the motion is purely the petal-group
 * transforms, all transform/opacity, no layout. A faint blush watercolor
 * wash sits behind the flower and fills as it opens.
 *
 * Without JS or reduced motion, the flower simply stands fully open
 * (fallback --bloom-open: 1). The accompanying copy is plain always-visible
 * text, so the meaning ("the signature scent, opening") never depends on
 * the motion.
 */
export default function TheBloom() {
  const reduced = usePrefersReducedMotion();
  const openRef = useScrollProgress<HTMLDivElement>(reduced);

  return (
    <section
      id="bloom-the-bloom"
      className="bloom-thebloom"
      aria-labelledby="bloom-thebloom-title"
    >
      <div ref={openRef} className="bloom-thebloom__pin">
        <div className="bloom-thebloom__inner">
          <div className="bloom-thebloom__art" aria-hidden="true">
            <svg
              className="bloom-thebloom__flower"
              viewBox="0 0 600 600"
              preserveAspectRatio="xMidYMid meet"
              focusable="false"
            >
              <defs>
                {/* The blush wash fills (opacity) as the flower opens —
                    a single static feTurbulence displacement, no per-frame
                    cost. The turbulence here is texture, not animation. */}
                <filter
                  id="bloom-sig-wash"
                  x="-15%"
                  y="-15%"
                  width="130%"
                  height="130%"
                >
                  <feTurbulence
                    type="fractalNoise"
                    baseFrequency="0.013 0.019"
                    numOctaves="2"
                    seed="29"
                    result="wet"
                  />
                  <feDisplacementMap
                    in="SourceGraphic"
                    in2="wet"
                    scale="14"
                    xChannelSelector="R"
                    yChannelSelector="G"
                  />
                </filter>
              </defs>

              {/* the blush wash disc — opacity tracks open */}
              <g className="bloom-sig-wash-group" filter="url(#bloom-sig-wash)">
                <path className="bloom-wash-blush bloom-sig-wash-fill" d={SIGNATURE_WASH} />
              </g>

              {/* outer ring of 8 petals (tier 0) — behind */}
              <g className="bloom-sig-ring bloom-sig-ring--outer">
                {SIGNATURE_PETALS.filter((p) => p.tier === 0).map((p, i) => (
                  <g
                    key={`o${i}`}
                    className="bloom-sig-petal"
                    transform={`rotate(${p.rotate} 300 300)`}
                    style={{ "--pi": i } as CSSProperties}
                  >
                    <path
                      className="bloom-petal-line bloom-sig-petal-line"
                      d={p.d}
                      strokeWidth={2.4}
                      pathLength={1}
                    />
                    <path
                      className="bloom-vein bloom-sig-petal-vein"
                      d={p.vein}
                      strokeWidth={1}
                      pathLength={1}
                    />
                  </g>
                ))}
              </g>

              {/* inner ring of 5 petals (tier 1) — on top */}
              <g className="bloom-sig-ring bloom-sig-ring--inner">
                {SIGNATURE_PETALS.filter((p) => p.tier === 1).map((p, i) => (
                  <g
                    key={`i${i}`}
                    className="bloom-sig-petal"
                    transform={`rotate(${p.rotate} 300 300)`}
                    style={{ "--pi": i + 8 } as CSSProperties}
                  >
                    <path
                      className="bloom-petal-line bloom-sig-petal-line"
                      d={p.d}
                      strokeWidth={2.2}
                      pathLength={1}
                    />
                    <path
                      className="bloom-vein bloom-sig-petal-vein"
                      d={p.vein}
                      strokeWidth={1}
                      pathLength={1}
                    />
                  </g>
                ))}
              </g>

              {/* the center disc + anthers (scale slightly with open) */}
              <g className="bloom-sig-center">
                <circle
                  className="bloom-sig-disc"
                  cx="300"
                  cy="300"
                  r="20"
                />
                {SIGNATURE_CENTER.anthers.map((a, i) => (
                  <circle
                    key={i}
                    className="bloom-sig-anther"
                    cx={a.cx}
                    cy={a.cy}
                    r="3.4"
                  />
                ))}
              </g>
            </svg>
          </div>

          <div className="bloom-thebloom__copy">
            <p className="bloom-eyebrow" aria-hidden="true">
              03 — <span lang="ko">시그니처</span>
            </p>
            <h2 className="bloom-thebloom__title" id="bloom-thebloom-title">
              <span lang="ko">피다</span>
              <span className="bloom-thebloom__title-en">the signature, opening</span>
            </h2>
            <p className="bloom-thebloom__lede">
              <em>Scroll, and the house scent opens — petal by petal.</em>
              <span lang="ko">
                스크롤하면, 하우스의 향이 꽃잎을 하나씩 펼칩니다.
              </span>
            </p>
            <dl className="bloom-thebloom__notes">
              <div>
                <dt lang="ko">작약 · 페오니</dt>
                <dd>the peony — pink, the first breath</dd>
              </div>
              <div>
                <dt lang="ko">베티버 뿌리</dt>
                <dd>vetiver root — the long base</dd>
              </div>
              <div>
                <dt lang="ko">귤꽃 · 네롤리</dt>
                <dd>neroli — the bright open</dd>
              </div>
            </dl>
          </div>
        </div>

        {/* a progress hairline at the foot of the pinned view */}
        <div className="bloom-thebloom__progress" aria-hidden="true">
          <span className="bloom-thebloom__progress-fill" />
          <span className="bloom-thebloom__progress-label">
            <span lang="ko">피는 중</span> · opening
          </span>
        </div>
      </div>
    </section>
  );
}
