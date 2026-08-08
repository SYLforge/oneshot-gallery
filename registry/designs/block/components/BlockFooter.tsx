"use client";

import { Grid, Line } from "./Motifs";

/**
 * 섹션 04 — 초대. 잉크 위 그린 잉크의 거대한 이중언어 호출. 가상의 서울
 * 주소, 인쇄의 press-gesture CTA, 그리고 한 줄의 도형 — 푸터가 boilerplate
 * 이 아니라 한 장의 포스터로 읽히도록.
 *
 * 카피는 이중언어; 한국어가 출판의 진짜 목소리 — 단정하고 짧다.
 */
export default function BlockFooter() {
  return (
    <footer className="bk-foot" aria-labelledby="bk-foot-title">
      <div className="bk-foot__shapes" aria-hidden="true">
        <Grid className="bk-foot__sh bk-foot__sh--gr" />
        <Line className="bk-foot__sh bk-foot__sh--ln" />
      </div>

      <p className="bk-foot__giant" id="bk-foot-title">
        <span lang="ko">벽에 적어라</span>
        <span className="bk-foot__giant-en">write on the wall</span>
      </p>

      <dl className="bk-foot__grid">
        <div className="bk-foot__cell">
          <dt className="bk-foot__k">
            <span lang="ko">출판</span> · PRESS
          </dt>
          <dd className="bk-foot__v">
            <span lang="ko">서울 성수동, 콘크리트 건물 3층</span>
            <br />
            Seongsu-dong, Seoul — the concrete building, 3F
          </dd>
        </div>
        <div className="bk-foot__cell">
          <dt className="bk-foot__k">
            <span lang="ko">제본</span> · BINDERY
          </dt>
          <dd className="bk-foot__v">
            <span lang="ko">월 · 목, 13:00–18:00</span>
            <br />
            Mon · Thu, 13:00–18:00
          </dd>
        </div>
        <div className="bk-foot__cell">
          <dt className="bk-foot__k">
            <span lang="ko">원고</span> · SUBMIT
          </dt>
          <dd className="bk-foot__v">
            <a
              className="bk-btn bk-btn--press bk-btn--footer"
              href="mailto:press@block.poetry"
            >
              press@block.poetry
            </a>
          </dd>
        </div>
      </dl>

      <p className="bk-foot__legal">
        © 2026 BLOCK · <span lang="ko">블록</span> · MIT —{" "}
        <span lang="ko">코드로 지었다, 이미지는 없다.</span> Built in code,
        no images.
      </p>
    </footer>
  );
}
