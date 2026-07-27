"use client";

const EQUIPMENT: Array<{ label: string; labelKo: string; value: string; valueKo: string }> = [
  {
    label: "CAMERA",
    labelKo: "기기",
    value: "PENTAX MX · MAMIYA RB67",
    valueKo: "펜탁스 MX · 마미야 RB67",
  },
  {
    label: "STOCK",
    labelKo: "필름",
    value: "KODAK PORTRA 400 · ILFORD HP5+",
    valueKo: "코닥 포르트라 400 · 일포드 HP5+",
  },
  {
    label: "DEVELOPER",
    labelKo: "현상",
    value: "HC-110 DILUTION B · 20°C",
    valueKo: "HC-110 희석 B · 20°C",
  },
  {
    label: "PRINTED ON",
    labelKo: "인화",
    value: "ILFORD MULTIGRADE FB",
    valueKo: "일포드 멀티그레이드 FB",
  },
  {
    label: "BASED IN",
    labelKo: "근거지",
    value: "A KITCHEN IN SEOUL",
    valueKo: "서울의 부엌 하나",
  },
  {
    label: "BOOKING",
    labelKo: "예약",
    value: "2027 SEASON — TWO ROLLS LEFT",
    valueKo: "2027 시즌 — 롤 두 개 남음",
  },
];

/**
 * Frame 04 — the colophon, printed on the strip's edge. Equipment and stock,
 * set like the edge print of a roll of film: tracked mono labels, the warm
 * base underneath. A final grease-pencil note, then the footer.
 */
export default function Colophon() {
  return (
    <>
      <section
        className="reel-colophon"
        aria-labelledby="reel-colophon-title"
      >
        <header className="reel-colophon__head" data-reveal>
          <p className="reel-sechead__no reel-mono" aria-hidden="true">
            FRAME 04
          </p>
          <h2 className="reel-sechead" id="reel-colophon-title">
            Edge print{" "}
            <span lang="ko" className="reel-sechead__ko">
              필름 가장자리 인쇄
            </span>
          </h2>
        </header>

        <dl className="reel-colophon__list">
          {EQUIPMENT.map((row) => (
            <div className="reel-edge" key={row.label} data-reveal>
              <dt className="reel-edge__label reel-mono">
                {row.label} · <span lang="ko">{row.labelKo}</span>
              </dt>
              <dd className="reel-edge__value">
                {row.value}{" "}
                <span lang="ko" className="reel-edge__valueko">
                  {row.valueKo}
                </span>
              </dd>
            </div>
          ))}
        </dl>

        <p className="reel-colophon__note" data-reveal>
          The best frame on the roll is always the one I almost didn&rsquo;t take.{" "}
          <span lang="ko">롤에서 가장 좋은 프레임은, 늘 거의 안 찍을 뻔했던 그 한 장이다.</span>
        </p>
      </section>

      <footer className="reel-footer">
        <div className="reel-footer__leak" aria-hidden="true" />
        <p className="reel-footer__mark reel-mono">
          REEL · END OF ROLL <span lang="ko">릴 · 롤 끝</span>
        </p>
        <p className="reel-footer__copy">
          &copy; 2026 REEL &mdash; shot on film, developed by hand, no
          photograph shipped.{" "}
          <span lang="ko">필름으로 찍고, 손으로 현상하고, 사진은 한 장도 싣지 않았다.</span>
        </p>
        <p className="reel-footer__nav reel-mono">
          <a className="reel-link" href="mailto:hello@reel-studio.example">
            HELLO@REEL-STUDIO.EXAMPLE
          </a>{" "}
          <a className="reel-link" href="#reel-top">
            BACK TO THE COVER · <span lang="ko">처음으로</span>
          </a>
        </p>
      </footer>
    </>
  );
}
