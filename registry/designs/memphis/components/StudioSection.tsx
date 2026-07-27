"use client";

import { Blob, Squiggle, Zigzag, SpottedDisc } from "./Shapes";

/**
 * Section — the studio note, set as a composed poster: a clip-path-revealed
 * cobalt panel (carries WHITE type at 5.7:1) beside the studio's principle,
 * with terrazzo chips and a squiggle as decoration. The principle copy is
 * bilingual; the Korean is the studio's actual voice — declarative, short.
 */
export default function StudioSection() {
  return (
    <section
      id="mp-studio"
      className="mp-section mp-studio"
      aria-labelledby="mp-studio-title"
    >
      <div className="mp-sec">
        <span className="mp-sec__no" aria-hidden="true">
          02
        </span>
        <h2 className="mp-sec__title" id="mp-studio-title">
          <span lang="ko">스튜디오</span>
          <span className="mp-sec__title-en">the studio</span>
        </h2>
      </div>

      <div className="mp-studio__grid">
        <div className="mp-studio__panel" data-mp-clip>
          <p className="mp-studio__panel-kicker">
            <span lang="ko">원칙</span> · PRINCIPLE
          </p>
          <p className="mp-studio__panel-body">
            <span lang="ko">
              우리는 멤피스를 복고가 아니라 방법론으로 씁니다. 1981년 밀라노,
              소트사스가 그린 의자에서 출발한 기하학 — 그 자유로운 형태가
              곧 규칙이 되는 방식. 도형은 자유롭되, 색은 다섯, 선은 3px.
            </span>
          </p>
        </div>

        <div className="mp-studio__principle">
          <div className="mp-studio__chips" aria-hidden="true">
            <Blob tone="coral" size={56} outline={false} />
            <Squiggle tone="marigold" width={90} />
            <Zigzag tone="cobalt" width={70} />
            <SpottedDisc size={70} />
          </div>
          <p className="mp-studio__rule mp-studio__rule--1">
            <span className="mp-studio__num">01</span>
            <span lang="ko">다섯 색. 그 이상도, 그 이하도 아님.</span>
          </p>
          <p className="mp-studio__rule mp-studio__rule--2">
            <span className="mp-studio__num">02</span>
            <span lang="ko">선은 언제나 3px — 만져지는 질감을 위해.</span>
          </p>
          <p className="mp-studio__rule mp-studio__rule--3">
            <span className="mp-studio__num">03</span>
            <span lang="ko">
              도형마다 할 일이 있다. 장식으로는 쓰지 않는다.
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}
