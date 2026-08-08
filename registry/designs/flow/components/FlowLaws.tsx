"use client";

import type { CSSProperties } from "react";
import { FLOW_LAWS } from "./words";

/**
 * 흐름의 법칙 — the laws of flow.
 *
 * The feature section. Five real properties of liquid — rheology, surface
 * tension, laminar flow, turbulence, viscosity — each read as a property of
 * writing. The science is honest (these are the actual terms, with their
 * actual constants and the Reynolds-number threshold where flow turns
 * turbulent), and the copy turns each into an image of the journal. The
 * cards are a glass surface over the sky, with the accent as a thin top
 * hairline that brightens on hover — the same layered-shadow card the rest
 * of the gallery uses, tuned to the liquid palette.
 */
export default function FlowLaws() {
  return (
    <section
      id="flow-laws"
      className="flow-laws"
      aria-labelledby="flow-laws-title"
    >
      <div className="flow-laws__head" data-reveal="">
        <p className="flow-kicker">
          <span lang="ko">흐름의 법칙</span> · LAWS OF FLOW
        </p>
        <h2 id="flow-laws-title" className="flow-laws__title">
          <span lang="ko">물이 흐르는 다섯 가지 방식</span>
        </h2>
        <p className="flow-laws__lede">
          <em>Five ways a liquid moves — and five ways a sentence does.</em>
          <span lang="ko">액체가 움직이는 다섯 가지 법칙은, 문장이 움직이는 다섯 가지 법칙이기도 하다.</span>
        </p>
      </div>

      <ol className="flow-laws__grid">
        {FLOW_LAWS.map((law, i) => (
          <li
            key={law.en}
            className="flow-law"
            data-reveal=""
            style={{ "--flow-law-i": i } as CSSProperties}
          >
            <div className="flow-law__head">
              <span className="flow-law__no" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="flow-law__name">
                <h3 className="flow-law__ko" lang="ko">
                  {law.ko}
                </h3>
                <p className="flow-law__en">
                  <span className="flow-law__en-term">{law.en}</span>
                  <span className="flow-law__rom"> · {law.rom}</span>
                </p>
              </div>
            </div>

            <p className="flow-law__aphorism" lang="ko">
              {law.aphorism.ko}
            </p>
            <p className="flow-law__aphorism-en">{law.aphorism.en}</p>

            <div className="flow-law__body">
              <p className="flow-law__body-ko" lang="ko">
                {law.body.ko}
              </p>
              <p className="flow-law__body-en">{law.body.en}</p>
            </div>

            <p className="flow-law__detail" aria-label={law.en}>
              <span className="flow-law__detail-label" lang="ko">
                상수
              </span>
              <span className="flow-law__detail-value">{law.detail}</span>
            </p>
          </li>
        ))}
      </ol>

      <p className="flow-laws__caption" data-reveal="">
        <span lang="ko">
          레이놀즈 수(Re)가 2300 아래면 층류, 4000 위면 난류. 그 사이는 전환 영역이다.
        </span>
        <em>
          Below Re 2300 the flow is laminar; above 4000, turbulent. Between is
          transition.
        </em>
      </p>
    </section>
  );
}
