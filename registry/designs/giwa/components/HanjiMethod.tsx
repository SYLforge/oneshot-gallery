"use client";

import { usePointerParallax } from "../hooks/usePointerParallax";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

type Step = {
  no: string;
  nameKo: string;
  hanja: string | null;
  bodyKo: string;
  bodyEn: string;
};

const STEPS: Step[] = [
  {
    no: "一",
    nameKo: "가칠",
    hanja: "假漆",
    bodyKo:
      "뇌록과 석간주로 바탕을 고르게 앉힌다. 아직 문양은 없다 — 색이 숨 쉴 바탕이 먼저다. 옛 층을 걷어낸 자리일수록 가칠은 얇게, 여러 번.",
    bodyEn:
      "The ground coat: noerok green and seokganju laid even and thin. No pattern yet — first, a surface the colors can breathe on.",
  },
  {
    no: "二",
    nameKo: "출초·타초",
    hanja: "出草打草",
    bodyKo:
      "문양을 그린 본에 바늘로 구멍을 내고, 호분 주머니로 가볍게 두드린다. 흰 점선이 나무 위에 내려앉는다 — 모든 단청은 이 점선에서 시작한다.",
    bodyEn:
      "The stencil is pricked along its lines and pounced with a powder bag: a white dotted drawing settles onto the wood. Every dancheong begins as these dots.",
  },
  {
    no: "三",
    nameKo: "채색",
    hanja: "彩色",
    bodyKo:
      "오방색을 밝은 색부터 층층이 올린다. 한 붓이 한 색 — 단청장은 색마다 손을 바꾸고, 발판 위의 순서는 백 년 전과 같다.",
    bodyEn:
      "Color, lightest first, one brush per pigment. The order of hands on the scaffold is the same as it was a century ago.",
  },
  {
    no: "四",
    nameKo: "빛넣기·먹기화",
    hanja: null,
    bodyKo:
      "색과 색 사이에 흰 숨을 넣고, 마지막에 먹선을 긋는다. 검은 윤곽이 모든 색을 제자리에 앉히면 — 비계를 내리고, 마르기를 기다린다.",
    bodyEn:
      "White breath between the colors, then the final ink line that seats them all. The scaffold comes down; the guild waits for the drying.",
  },
];

/**
 * Section 04 — the method, set on layered hanji.
 *
 * Three feTurbulence layers (coarse fiber, long horizontal fiber, fleck)
 * multiply over the paper and drift a few pixels with the pointer — capped
 * in CSS, lerped in the hook, absent on touch and under reduced motion.
 */
export default function HanjiMethod() {
  const reduced = usePrefersReducedMotion();
  const stageRef = usePointerParallax<HTMLDivElement>(reduced);

  return (
    <section className="giwa-method" aria-labelledby="giwa-method-title">
      <div className="giwa-method__stage" ref={stageRef}>
        <div className="giwa-method__paper" aria-hidden="true">
          <div className="giwa-method__layer giwa-method__layer--a">
            <svg width="100%" height="100%" preserveAspectRatio="none">
              <filter id="giwa-hanji-a" x="0" y="0" width="100%" height="100%">
                <feTurbulence
                  type="fractalNoise"
                  baseFrequency="0.9"
                  numOctaves="2"
                  seed="7"
                  stitchTiles="stitch"
                />
                <feColorMatrix
                  type="matrix"
                  values="0 0 0 0 0.32  0 0 0 0 0.27  0 0 0 0 0.2  0 0 0 0.08 0"
                />
              </filter>
              <rect width="100%" height="100%" filter="url(#giwa-hanji-a)" />
            </svg>
          </div>
          <div className="giwa-method__layer giwa-method__layer--b">
            <svg width="100%" height="100%" preserveAspectRatio="none">
              <filter id="giwa-hanji-b" x="0" y="0" width="100%" height="100%">
                <feTurbulence
                  type="fractalNoise"
                  baseFrequency="0.008 0.18"
                  numOctaves="3"
                  seed="21"
                  stitchTiles="stitch"
                />
                <feColorMatrix
                  type="matrix"
                  values="0 0 0 0 0.3  0 0 0 0 0.25  0 0 0 0 0.18  0 0 0 0.1 0"
                />
              </filter>
              <rect width="100%" height="100%" filter="url(#giwa-hanji-b)" />
            </svg>
          </div>
          <div className="giwa-method__layer giwa-method__layer--c">
            <svg width="100%" height="100%" preserveAspectRatio="none">
              <filter id="giwa-hanji-c" x="0" y="0" width="100%" height="100%">
                <feTurbulence
                  type="turbulence"
                  baseFrequency="0.05"
                  numOctaves="1"
                  seed="42"
                  stitchTiles="stitch"
                />
                <feColorMatrix
                  type="matrix"
                  values="0 0 0 0 0.55  0 0 0 0 0.45  0 0 0 0 0.3  0 0 0 0.05 0"
                />
              </filter>
              <rect width="100%" height="100%" filter="url(#giwa-hanji-c)" />
            </svg>
          </div>
        </div>

        <div className="giwa-method__inner">
          <div className="giwa-sechead" data-reveal>
            <span className="giwa-sechead__no" lang="en" aria-hidden="true">
              04
            </span>
            <h2 className="giwa-sechead__title" id="giwa-method-title">
              법식{" "}
              <span className="giwa-sechead__en" lang="en">
                how an eave is repainted
              </span>
            </h2>
          </div>

          <p className="giwa-method__intro" data-reveal>
            복원은 덧칠이 아니라 다시 앉히는 일이다. 옛 안료의 층을 읽고,
            같은 순서로 돌아간다 — 바탕, 점선, 색, 그리고 마지막의 먹선.
          </p>
          <p className="giwa-method__intro-en" lang="en" data-reveal>
            Restoration is not repainting over; it is seating the colors
            again — ground, dots, color, and last of all the ink line.
          </p>

          <ol className="giwa-method__steps">
            {STEPS.map((s) => (
              <li key={s.no} className="giwa-method__step" data-reveal>
                <span className="giwa-method__step-no" aria-hidden="true">
                  {s.no}
                </span>
                <h3 className="giwa-method__step-name">
                  {s.nameKo}
                  {s.hanja ? (
                    <span className="giwa-method__step-hanja"> {s.hanja}</span>
                  ) : null}
                </h3>
                <p className="giwa-method__step-body">{s.bodyKo}</p>
                <p className="giwa-method__step-en" lang="en">
                  {s.bodyEn}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
