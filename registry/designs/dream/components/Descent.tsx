"use client";

import type { CSSProperties } from "react";
import { growCloud, starField, type Cloud } from "./cloudShapes";
import { useScrollDescent } from "../hooks/useScrollDescent";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

/**
 * The signature moment: a pinned sky that slowly dissolves from pale
 * cloud-white into deep indigo as you scroll "down into" sleep. One
 * scroll-progress variable (--drm-descent, 0→1) drives every visual:
 *  - the cloud layers fade out (opacity 1 → 0.18)
 *  - the sky background lerps cloud → mist → indigo through 4 stops
 *  - the star pinpoints fade in (opacity 0 → 0.9)
 *  - the haze's lavender tint deepens
 * The pinned element is tall (220vh) and position:sticky in styles.css, so
 * the visitor scrolls through one viewport-height of the same scene while it
 * transforms. Without JS or under reduced motion the section shows its day
 * composition (descent = 0).
 */
const FADE_CLOUDS: Cloud[] = [
  growCloud(501, 6, 520, 230),
  growCloud(602, 5, 420, 200),
  growCloud(703, 4, 320, 160),
];
const STARS = starField(909, 36, 1440, 900);

export default function Descent() {
  const reduced = usePrefersReducedMotion();
  const descentRef = useScrollDescent<HTMLDivElement>(reduced);

  return (
    <section
      id="dream-descent"
      className="dream-descent"
      aria-labelledby="dream-descent-title"
    >
      {/* The sticky inner stage: it stays put while the outer section scrolls,
          so the whole 220vh feels like one slowly darkening frame. */}
      <div ref={descentRef} className="dream-descent__pin">
        {/* sky color is a lerp driven by --drm-descent (styles.css) */}
        <div className="dream-descent__sky" aria-hidden="true" />

        {/* stars fade in as we descend */}
        <svg
          className="dream-descent__stars"
          viewBox="0 0 1440 900"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden="true"
          focusable="false"
        >
          <defs>
            <radialGradient id="dream-star-glow">
              <stop offset="0%" stopColor="#f8f4ff" stopOpacity="1" />
              <stop offset="100%" stopColor="#f8f4ff" stopOpacity="0" />
            </radialGradient>
          </defs>
          {STARS.map((s, i) => (
            <circle
              key={i}
              cx={s.x}
              cy={s.y}
              r={s.r * 4}
              fill="url(#dream-star-glow)"
              className="dream-descent__star"
              style={{ "--delay": s.delay } as CSSProperties}
            />
          ))}
        </svg>

        {/* clouds fade out as we descend */}
        <div className="dream-descent__clouds" aria-hidden="true">
          {FADE_CLOUDS.map((c, i) => (
            <svg
              key={i}
              className="dream-descent__cloud"
              viewBox={c.viewBox}
              preserveAspectRatio="xMidYMid meet"
              aria-hidden="true"
              focusable="false"
              style={{ "--i": i } as CSSProperties}
            >
              <path d={c.d} />
            </svg>
          ))}
        </div>

        <div className="dream-descent__copy">
          <div className="dream-sec dream-descent__head" data-reveal>
            <span className="dream-sec__no" lang="ko" aria-hidden="true">
              둘
            </span>
            <h2 className="dream-sec__title" id="dream-descent-title">
              the descent{" "}
              <span lang="ko" className="dream-sec__ko">
                잠으로의 하강
              </span>
            </h2>
          </div>

          <p className="dream-descent__lede">
            <em>Scroll, and the sky slowly closes for you.</em>
            <span lang="ko">
              스크롤을 내리면, 하늘이 천천히 당신을 위해 감깁니다.
            </span>
          </p>

          <ul className="dream-descent__stages">
            <li>
              <span className="dream-descent__stage-no">01</span>
              <span lang="ko">구름이 흐려진다</span>
              <span className="dream-descent__stage-en">
                the clouds thin out
              </span>
            </li>
            <li>
              <span className="dream-descent__stage-no">02</span>
              <span lang="ko">하늘이 짙어진다</span>
              <span className="dream-descent__stage-en">
                the sky deepens
              </span>
            </li>
            <li>
              <span className="dream-descent__stage-no">03</span>
              <span lang="ko">별이 떠오른다</span>
              <span className="dream-descent__stage-en">
                the first stars arrive
              </span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
