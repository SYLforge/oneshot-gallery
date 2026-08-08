"use client";

import { useEffect, useRef } from "react";
import "./styles.css";
import { inter, blackHanSans } from "./fonts";
import { useReveal } from "./hooks/useReveal";
import ConcreteHero from "./components/ConcreteHero";
import ManifestoMarquee from "./components/ManifestoMarquee";
import PoemFlipGrid from "./components/PoemFlipGrid";
import Manifesto from "./components/Manifesto";
import BlockFooter from "./components/BlockFooter";

/**
 * BLOCK — 블록, 콘크리트 시 출판. neo-brutalist poetry press. 콘크리트
 * 슬래브 위에 선 무거운 활자 — 회색 벽, 녹색 잉크, hard offset shadow.
 * BLUNT(riso/종이/노랑), RAVE(암흑/스트로보/파랑) 와 구분되는 세 번째
 * 네오-브루탈리즘 — BLOCK 은 회색 콘크리트, 녹색 잉크, 구조적.
 *
 * 세 기법이 페이지를 지탱한다: 섹션이 hard clip-path 잘림으로 드러난다
 * (clip-path-reveal), 선언문이 두 줄 티커로 흐른다 (marquee), 시 그리드가
 * 필터에서 FLIP 으로 재배열된다 (flip-layout).
 *
 * `.block-js` 는 mount 에 붙어 모든 pre-reveal style (clip 이 닫힌 채
 * wipe 를 기다림) 을 JS-gate 한다 — JS 가 꺼져 있거나 동작 감소면 페이지
 * 는 그냥 완성된 상태로 앉아 있다: 모든 섹션 보이고, 모든 시 보이고,
 * 아무것도 움직이지 않는다.
 */
export default function BlockPage() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const revealRef = useReveal<HTMLDivElement>();

  useEffect(() => {
    rootRef.current?.classList.add("block-js");
    window.parent?.postMessage({ type: "oneshot:ready", slug: "block" }, "*");
  }, []);

  return (
    <div
      ref={rootRef}
      className={`${inter.variable} ${blackHanSans.variable} block-root`}
    >
      <div ref={revealRef} className="bk-doc">
        <ConcreteHero />
        <main>
          <ManifestoMarquee />
          <PoemFlipGrid />
          <Manifesto />
        </main>
        <BlockFooter />
      </div>

      {/* 콘크리트 결 — 정적 feTurbulence 노이즈, 슬래브 위에 곱하기 블렌드.
          순전히 장식, 포인터 투과. */}
      <div className="bk-grain" aria-hidden="true">
        <svg width="100%" height="100%" preserveAspectRatio="none">
          <filter id="bk-grain-f" x="0" y="0" width="100%" height="100%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.9"
              numOctaves="2"
              stitchTiles="stitch"
            />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.07 0"
            />
          </filter>
          <rect width="100%" height="100%" filter="url(#bk-grain-f)" />
        </svg>
      </div>
    </div>
  );
}
