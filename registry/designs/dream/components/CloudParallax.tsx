"use client";

import type { CSSProperties } from "react";
import { growCloud, mulberry32, type Cloud } from "./cloudShapes";
import { usePointerParallax } from "../hooks/usePointerParallax";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

/**
 * A field of puffs that answers the pointer at three depths. Unlike the hero
 * (where parallax is layered behind the title), this section makes the
 * technique legible: a wide stage, a single instruction, and puffs tagged
 * far / mid / near so the visitor can see the depth working. Move your hand
 * and the nearest layer drifts most, the far one least — weightless, never
 * tracking. On touch the layers rest and an autonomous cloud-bob keeps them
 * alive. Reduced motion: one composed still frame.
 */
const FIELD: { cloud: Cloud; depth: 0 | 1 | 2; left: number; top: number }[] = (() => {
  const rnd = mulberry32(31415);
  const out: { cloud: Cloud; depth: 0 | 1 | 2; left: number; top: number }[] = [];
  const specs = [
    { count: 4, depth: 0 as const, n: 5, size: 260 },
    { count: 5, depth: 1 as const, n: 4, size: 420 },
    { count: 6, depth: 2 as const, n: 3, size: 560 },
  ];
  for (const s of specs) {
    for (let i = 0; i < s.n; i++) {
      const seed = 1000 + s.depth * 100 + i;
      out.push({
        cloud: growCloud(seed, s.count, s.size, Math.round(s.size * 0.45)),
        depth: s.depth,
        left: Math.round(rnd() * 88 + 2),
        top: Math.round(rnd() * 60 + 10),
      });
    }
  }
  return out;
})();

export default function CloudParallax() {
  const reduced = usePrefersReducedMotion();
  const stageRef = usePointerParallax<HTMLDivElement>(reduced);

  return (
    <section className="dream-clouds-sec" aria-labelledby="dream-clouds-title">
      <div className="dream-sec" data-reveal>
        <span className="dream-sec__no" lang="ko" aria-hidden="true">
          하나
        </span>
        <h2 className="dream-sec__title" id="dream-clouds-title">
          weightless{" "}
          <span lang="ko" className="dream-sec__ko">
            무게 없이
          </span>
        </h2>
      </div>

      <p className="dream-clouds-sec__lede" data-reveal>
        <em>Drift your hand across the sky — the clouds settle after it.</em>{" "}
        <span lang="ko">
          하늘 위로 손을 흘려보내세요. 구름이 손이 지나간 자리에 가라앉습니다.
        </span>
      </p>

      <div
        ref={stageRef}
        className="dream-clouds-sec__stage"
        role="img"
        aria-label="Pastel clouds floating in three layers of depth that drift toward the pointer. 포인터를 따라 세 겹의 깊이로 흐르는 파스텔 구름."
      >
        {FIELD.map((f, i) => (
          <svg
            key={i}
            className={`dream-puff dream-puff--d${f.depth}`}
            viewBox={f.cloud.viewBox}
            preserveAspectRatio="xMidYMid meet"
            aria-hidden="true"
            focusable="false"
            style={
              {
                "--i": i,
                left: `${f.left}%`,
                top: `${f.top}%`,
                width: `${[18, 26, 34][f.depth]}%`,
              } as CSSProperties
            }
          >
            <path className="dream-puff__path" d={f.cloud.d} />
          </svg>
        ))}
      </div>

      <p className="dream-clouds-sec__caption">
        On touch the clouds bob on their own — depth still reads, your hand
        isn&rsquo;t needed.{" "}
        <span lang="ko">
          터치에서도 구름은 스스로 떠오른다 — 깊이는 그대로 읽히고, 손은 필요하지
          않다.
        </span>
      </p>
    </section>
  );
}
