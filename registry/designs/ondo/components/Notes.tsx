/**
 * Section 03 — the composition. A quiet editorial ledger: top, heart, base
 * as a vertical typographic list under hairline rules, then the house
 * credo. No interaction, almost no color — the space is the design.
 */
export default function Notes() {
  return (
    <section className="ondo-notes" aria-labelledby="ondo-notes-title">
      <div className="ondo-sechead" data-reveal="fade">
        <p className="ondo-eyebrow">03 — composition</p>
        <h2 id="ondo-notes-title" className="ondo-sechead__title">
          The note{" "}
          <span lang="ko" className="ondo-sechead__ko">
            향의 구성
          </span>
        </h2>
      </div>

      <dl className="ondo-tiers">
        <div className="ondo-tier" data-reveal="fade">
          <dt className="ondo-tier__name">
            Top{" "}
            <span lang="ko" className="ondo-tier__nameko">
              탑
            </span>
          </dt>
          <dd className="ondo-tier__notes">bergamot glacé · frozen pear</dd>
          <dd className="ondo-tier__notes ondo-tier__notes--ko" lang="ko">
            베르가못 글라세 · 언 배
          </dd>
        </div>
        <div className="ondo-tier" data-reveal="fade">
          <dt className="ondo-tier__name">
            Heart{" "}
            <span lang="ko" className="ondo-tier__nameko">
              하트
            </span>
          </dt>
          <dd className="ondo-tier__notes">white ginger · hinoki · rice steam</dd>
          <dd className="ondo-tier__notes ondo-tier__notes--ko" lang="ko">
            흰 생강 · 히노키 · 쌀의 김
          </dd>
        </div>
        <div className="ondo-tier" data-reveal="fade">
          <dt className="ondo-tier__name">
            Base{" "}
            <span lang="ko" className="ondo-tier__nameko">
              베이스
            </span>
          </dt>
          <dd className="ondo-tier__notes">warm musk · beeswax · amber</dd>
          <dd className="ondo-tier__notes ondo-tier__notes--ko" lang="ko">
            따뜻한 머스크 · 밀랍 · 앰버
          </dd>
        </div>
      </dl>

      <div className="ondo-credo" data-reveal="fade">
        <p className="ondo-credo__en">
          We do not ask what a scent resembles. We ask how warm it is.
        </p>
        <p className="ondo-credo__ko" lang="ko">
          우리는 향이 무엇을 닮았는지 묻지 않는다. 얼마나 따뜻한지 묻는다.
        </p>
        <p className="ondo-credo__en">Perfume is weather for the body.</p>
        <p className="ondo-credo__ko" lang="ko">
          향수는 몸의 날씨다.
        </p>
      </div>
    </section>
  );
}
