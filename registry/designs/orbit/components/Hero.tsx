"use client";

import ProductTurntable from "./ProductTurntable";
import type { Colorway } from "./sneaker";

type Props = {
  colorway: Colorway["id"];
  reduced: boolean;
};

/**
 * Section 01 — the studio floor. The turntable holds the signature sneaker
 * under the seamless cyclorama; the masthead sits in the negative space.
 * The "studio" is three DOM layers: the seamless (CSS radial-gradient
 * cyclorama, always painted), a key-light pool warm stage-right, and a rim
 * pool cool stage-left — the no-JS view and the read of "lit product, not
 * flat product".
 *
 * The hero copy stays out of the turntable's way on narrow screens (stacks
 * above the stage); on wide screens it claims the left third and the product
 * takes the right two-thirds, the way a real configurator composes.
 */
export default function Hero({ colorway, reduced }: Props) {
  return (
    <header className="orbit-hero" aria-label="ORBIT">
      {/* The seamless — cyclorama floor rising into backdrop */}
      <div className="orbit-hero__seamless" aria-hidden="true">
        <div className="orbit-hero__key" />
        <div className="orbit-hero__rim" />
        <div className="orbit-hero__vignette" />
      </div>

      <div className="orbit-hero__inner">
        <div className="orbit-hero__copy">
          <p className="orbit-kicker">
            STUDIO CONFIGURATOR ·{" "}
            <span lang="ko" className="orbit-kicker__ko">
              스튜디오 컨피규레이터
            </span>
          </p>

          <h1 className="orbit-title">
            ORBIT
            <span lang="ko" className="orbit-title__ko">
              궤도
            </span>
          </h1>

          <p className="orbit-lede">
            One silhouette, three colorways, a full turn. The studio drops a
            single shoe at a time — turn it, light it, take it apart.
            <span lang="ko" className="orbit-lede__ko">
              실루엣 하나, 컬러웨이 셋, 한 바퀴. 스튜디오는 한 번에 한 켤레만
              내려놓는다 — 돌리고, 비추고, 분해한다.
            </span>
          </p>

          <dl className="orbit-spec">
            <div>
              <dt>Drop</dt>
              <dd>ORBIT 001 · <span lang="ko">1차 드롭</span></dd>
            </div>
            <div>
              <dt>Last</dt>
              <dd>Halla-7 · <span lang="ko">할라-7 라스트</span></dd>
            </div>
            <div>
              <dt>Mass</dt>
              <dd>238 g · <span lang="ko">238그램</span></dd>
            </div>
          </dl>

          <p className="orbit-hero__scrollhint" aria-hidden="true">
            scroll — take it apart · 스크롤하면 분해된다
          </p>
        </div>

        <div className="orbit-hero__stage">
          <ProductTurntable colorway={colorway} reduced={reduced} />
        </div>
      </div>
    </header>
  );
}
