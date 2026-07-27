"use client";

/**
 * Section 02 — the studio manifesto, revealed through jagged clip-path
 * tears rather than clean fades. Each panel opens with a polygon wipe whose
 * edge carries a deliberate 6px step (see styles.css @keyframes gl-tear),
 * so the reveal reads as torn paper / datamosh, not a wipe transition.
 *
 * Every panel is a real <article>; the eyebrow tags use role="img" + aria
 * so the glitch glyphs are decorative. SSR / no-JS shows all panels open.
 */
type Panel = {
  no: string;
  glyph: string;
  en: string;
  ko: string;
};

const PANELS: Panel[] = [
  {
    no: "01",
    glyph: "▚ ERROR 0xC0FFEE",
    en: "we don't fix the artifact. the artifact is the product. a compression block that breathes, a dropped frame that lands on the beat — that is the take.",
    ko: "우리는 아티팩트를 고치지 않는다. 아티팩트가 곧 결과물이다. 숨을 쉬는 압축 블록, 비트 위에 떨어지는 드롭 프레임 — 그게 바로 그 테이크다.",
  },
  {
    no: "02",
    glyph: "▞ DATAMOSH OK",
    en: "pixel sort the skyline until the windows bleed into the river. push the codec until it confesses. the render farm runs hot on purpose.",
    ko: "강변 빌딩의 창이 물에 번질 때까지 픽셀 정렬을 돌린다. 코덱이 실토할 때까지 밀어붙인다. 렌더팜은 일부러 뜨겁게 돈다.",
  },
  {
    no: "03",
    glyph: "▚ CHANNEL DRIFT",
    en: "red left, blue right, never the same frame twice. chromatic aberration is not a bug report — it is the house style, signed in light.",
    ko: "빨강은 왼쪽, 파랑은 오른쪽, 같은 프레임은 두 번 없다. 색수차는 버그 리포트가 아니라 빛으로 서명한 스튜디오의 서체다.",
  },
];

export default function Manifesto() {
  return (
    <section className="gl-manifesto" aria-labelledby="gl-manifesto-title">
      <div className="gl-sechead" data-tear>
        <span className="gl-sechead__no" aria-hidden="true">
          02
        </span>
        <h2 className="gl-sechead__title" id="gl-manifesto-title">
          manifesto{" "}
          <span lang="ko" className="gl-sechead__ko">
            선언
          </span>
        </h2>
      </div>

      <div className="gl-panels">
        {PANELS.map((p) => (
          <article key={p.no} className="gl-panel" data-tear>
            <p className="gl-panel__tag" role="img" aria-label={`panel ${p.no}`}>
              <span aria-hidden="true">{p.glyph}</span>
            </p>
            <p className="gl-panel__no" aria-hidden="true">
              {p.no}
            </p>
            <p className="gl-panel__en">{p.en}</p>
            <p className="gl-panel__ko" lang="ko">
              {p.ko}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
