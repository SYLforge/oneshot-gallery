"use client";

import { Square, Triangle, Circle, Stack } from "./Motifs";

/**
 * 섹션 03 — 대형 선언문. 잉크 바탕 위에 흰 활자. clip-path-reveal: 이
 * 섹션이 viewport 에 들어오면 hard cut 으로 드러난다. 출판의 신조 다섯
 * 줄이 네모/세모/동그라미 마크와 함께 나열된다.
 *
 * 한국어가 원문 — 짧고 단정. 영문은 그 복각. 잉크 위 흰색 = 21:1 (AAA).
 */
const RULES: Array<{ n: string; ko: string; en: string }> = [
  {
    n: "01",
    ko: "우리는 부드러움을 거부한다.",
    en: "We reject softness.",
  },
  {
    n: "02",
    ko: "시는 벽이다. 벽은 서 있어야 한다.",
    en: "A poem is a wall. A wall must stand.",
  },
  {
    n: "03",
    ko: "모든 선은 3픽셀. 타협하지 않는다.",
    en: "Every line is three pixels. No compromise.",
  },
  {
    n: "04",
    ko: "이미지 없이 코드로 짠다.",
    en: "Drawn in code, with no images.",
  },
  {
    n: "05",
    ko: "한국어가 먼저. 영어는 복각이다.",
    en: "Korean first. English is the echo.",
  },
];

export default function Manifesto() {
  return (
    <section
      id="bk-manifesto"
      className="bk-section bk-manifesto"
      aria-labelledby="bk-manifesto-title"
    >
      <div className="bk-manifesto__shapes" aria-hidden="true">
        <Square className="bk-manifesto__sh bk-manifesto__sh--sq" />
        <Triangle className="bk-manifesto__sh bk-manifesto__sh--tr" />
        <Circle className="bk-manifesto__sh bk-manifesto__sh--ci" />
        <Stack className="bk-manifesto__sh bk-manifesto__sh--st" />
      </div>

      <div className="bk-sec bk-sec--on-ink">
        <span className="bk-sec__no" aria-hidden="true">
          03
        </span>
        <h2 className="bk-sec__title" id="bk-manifesto-title">
          <span lang="ko">선언문</span>
          <span className="bk-sec__title-en">the manifesto</span>
        </h2>
      </div>

      <p className="bk-manifesto__giant">
        <span lang="ko">시는 콘크리트다.</span>
        <span className="bk-manifesto__giant-en">POETRY IS CONCRETE.</span>
      </p>

      <ol className="bk-manifesto__rules">
        {RULES.map((r) => (
          <li key={r.n} className="bk-rule">
            <span className="bk-rule__n">{r.n}</span>
            <p className="bk-rule__text">
              <span lang="ko">{r.ko}</span>
              <span className="bk-rule__en">{r.en}</span>
            </p>
          </li>
        ))}
      </ol>

      <p className="bk-manifesto__seal">
        <span lang="ko">이 출판은 타협하지 않는다.</span>
        <span className="bk-manifesto__seal-en">
          This press does not compromise.
        </span>
      </p>
    </section>
  );
}
