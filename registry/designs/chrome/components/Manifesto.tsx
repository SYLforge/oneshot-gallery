"use client";

import HoloFoil from "./HoloFoil";

/**
 * Section 01 — the manifesto. A holographic-foil plaque carrying the
 * house creed in large chrome type, then a short bilingual ledger of the
 * three rules the house keeps. The chrome type uses layered text-shadows
 * (white top highlight, dark bottom shadow) to fake the beveled metal
 * edge on a flat chrome-silver fill — chrome type, no shader needed.
 */
export default function Manifesto() {
  return (
    <section
      className="chrome-manifesto"
      aria-labelledby="chrome-manifesto-title"
    >
      <div className="chrome-sechead" data-reveal="fade">
        <p className="chrome-eyebrow">01 — the creed · 신조</p>
        <h2 id="chrome-manifesto-title" className="chrome-sechead__title">
          Metal, not makeup{" "}
          <span lang="ko" className="chrome-sechead__ko">
            화장이 아니라 금속
          </span>
        </h2>
      </div>

      <div className="chrome-manifesto__plaque" data-reveal="fade">
        <HoloFoil>
          <p className="chrome-credo">
            We do not sell a color. We sell the way light bends off a surface
            that refuses to be flat.
          </p>
          <p className="chrome-credo" lang="ko">
            우리는 색을 팔지 않는다. 납작해지기를 거부하는 표면 위로 빛이
            구부러지는 방식을 판다.
          </p>
          <p className="chrome-credo">
            Every pour is a metal. Every metal is a light.
          </p>
          <p className="chrome-credo" lang="ko">
            모든 붓은 금속이고, 모든 금속은 빛이다.
          </p>
        </HoloFoil>
      </div>

      <dl className="chrome-rules">
        <div className="chrome-rule" data-reveal="fade">
          <dt className="chrome-rule__num">01</dt>
          <dd className="chrome-rule__name">
            It must ripple{" "}
            <span lang="ko" className="chrome-rule__nameko">
              출렁여야 한다
            </span>
          </dd>
          <dd className="chrome-rule__line">
            A chrome that sits still is paint. Ours answers your hand.
          </dd>
          <dd className="chrome-rule__line" lang="ko">
            가만히 있는 크롬은 페인트다. 우리의 것은 손에 답한다.
          </dd>
        </div>
        <div className="chrome-rule" data-reveal="fade">
          <dt className="chrome-rule__num">02</dt>
          <dd className="chrome-rule__name">
            It must foil{" "}
            <span lang="ko" className="chrome-rule__nameko">
              무지개빛이어야 한다
            </span>
          </dd>
          <dd className="chrome-rule__line">
            One angle is a lie. The metal shifts because the light does.
          </dd>
          <dd className="chrome-rule__line" lang="ko">
            한 각도는 거짓이다. 빛이 바뀌니 금속도 바뀐다.
          </dd>
        </div>
        <div className="chrome-rule" data-reveal="fade">
          <dt className="chrome-rule__num">03</dt>
          <dd className="chrome-rule__name">
            It must keep its shadow{" "}
            <span lang="ko" className="chrome-rule__nameko">
              그림자를 지켜야 한다
            </span>
          </dd>
          <dd className="chrome-rule__line">
            The deep chrome shadow is what makes the highlight read as wet.
          </dd>
          <dd className="chrome-rule__line" lang="ko">
            깊은 크롬 그림자가 하이라이트를 젖은 것으로 읽힌다.
          </dd>
        </div>
      </dl>
    </section>
  );
}
