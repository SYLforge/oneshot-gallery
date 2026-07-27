"use client";

import type { CSSProperties } from "react";
import { growCloud, type Cloud } from "./cloudShapes";
import { usePointerParallax } from "../hooks/usePointerParallax";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

/**
 * Generated once at module load with fixed seeds — identical markup on the
 * server and the client, so the clouds are real SSR'd content.
 * Three depths: FAR (small, faint), MID (the readable drift), NEAR (large,
 * soft, arm's-length). All three layers answer the same --drm-px/--drm-py
 * but styles.css multiplies them at different magnitudes.
 */
const FAR: Cloud[] = [
  growCloud(20260727, 4, 320, 160),
  growCloud(711, 5, 360, 170),
];
const MID: Cloud[] = [
  growCloud(2026, 6, 520, 230),
  growCloud(404, 5, 460, 210),
  growCloud(888, 4, 300, 150),
];
const NEAR: Cloud[] = [
  growCloud(123, 7, 680, 290),
  growCloud(999, 5, 420, 200),
];

function CloudLayer({
  clouds,
  className,
  style,
}: {
  clouds: Cloud[];
  className: string;
  style?: CSSProperties;
}) {
  return (
    <div className={className} style={style} aria-hidden="true">
      {clouds.map((c, i) => (
        <svg
          key={i}
          className="dream-cloud__svg"
          viewBox={c.viewBox}
          preserveAspectRatio="xMidYMid meet"
          aria-hidden="true"
          focusable="false"
          style={{ "--i": i } as CSSProperties}
        >
          <path className="dream-cloud__path" d={c.d} />
        </svg>
      ))}
    </div>
  );
}

/**
 * The arrival. A cloud-white sky where pastel puffs drift in layered depth
 * toward the pointer — far sky barely moves, middle carries the weightless
 * drift, nearest reads at arm's length — while the title simply floats.
 * Without JavaScript, or under reduced motion, the clouds simply rest in
 * their composed positions and the ambient cloud-bob carries a slow life.
 */
export default function Hero() {
  const reduced = usePrefersReducedMotion();
  const driftRef = usePointerParallax<HTMLElement>(reduced);

  return (
    <header id="dream-hero" ref={driftRef} className="dream-hero">
      {/* the closing-eye haze: a full-sky feTurbulence veil, decorative only */}
      <svg className="dream-hero__haze" aria-hidden="true" focusable="false">
        <defs>
          <filter id="dream-haze-filter" x="0" y="0" width="100%" height="100%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.012 0.018"
              numOctaves={2}
              seed={7}
              result="noise"
            />
            <feColorMatrix
              in="noise"
              type="matrix"
              values="0 0 0 0 0.78  0 0 0 0 0.72  0 0 0 0 0.9  0 0 0 0.5 0"
            />
          </filter>
        </defs>
        <rect width="100%" height="100%" filter="url(#dream-haze-filter)" />
      </svg>

      <CloudLayer clouds={FAR} className="dream-clouds dream-clouds--far" />
      <CloudLayer clouds={MID} className="dream-clouds dream-clouds--mid" />
      <CloudLayer clouds={NEAR} className="dream-clouds dream-clouds--near" />

      <div className="dream-hero__copy">
        <p className="dream-hero__kicker">
          A SLEEP HOUSE <span aria-hidden="true">·</span>{" "}
          <span lang="ko">잠이 드는 집</span>
        </p>
        <h1 className="dream-hero__title">
          <span lang="ko" className="dream-hero__hangul">
            꿈
          </span>
          <span className="dream-hero__latin">
            DREAM
            <span className="dream-hero__latin-sub">
              the hour the sky closes
            </span>
          </span>
        </h1>
        <p className="dream-hero__lede">
          <em>
            Let your shoulders go. The sky has already started to drift for
            you.
          </em>
          <span lang="ko">
            어깨에 힘을 빼세요. 하늘이 이미 당신을 위해 떠밀리기 시작했습니다.
          </span>
        </p>
        <a className="dream-hero__cta" href="#dream-descent">
          <span lang="ko">잠으로 내려가기</span>{" "}
          <span aria-hidden="true">·</span> begin the descent
        </a>
      </div>

      <p className="dream-hero__hint">
        <span lang="ko">천천히, 무게 없이</span> — slow, and weightless
      </p>
    </header>
  );
}
