"use client";

import { useEffect, useRef, useState } from "react";
import "./styles.css";
import { inter, blackHanSans } from "./fonts";
import { useReveal } from "./hooks/useReveal";
import { usePrefersReducedMotion } from "./hooks/usePrefersReducedMotion";

const TITLE = "BLOCK";
const POEMS = [
  { ko: "시는 콘크리트다.", en: "Poetry is concrete.", no: "01" },
  { ko: "단어가 벽이 되고,", en: "Words become walls,", no: "02" },
  { ko: "벽이 시가 된다.", en: "walls become poems.", no: "03" },
  { ko: "무너뜨리지 마라.", en: "Do not demolish.", no: "04" },
];

type Mode = "ko" | "en";

/**
 * BLOCK — 블록, 콘크리트 시 출판. Neo-brutalist poetry press. Stark concrete
 * grids, heavy type, zero easing. The signature: clip-path-reveal (sections
 * wipe in with hard geometric cuts), marquee (scrolling manifesto ticker),
 * flip-layout (KO/EN mode toggle FLIP-rearranges the poems). Distinct from
 * BLUNT (riso/paper/yellow) and RAVE (dark/strobe/blue) — BLOCK is grey
 * concrete, green ink, structural.
 */
export default function BlockPage() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const reduced = usePrefersReducedMotion();
  const revealRef = useReveal<HTMLDivElement>();
  const [mode, setMode] = useState<Mode>("ko");

  useEffect(() => {
    rootRef.current?.classList.add("block-js");
    window.parent?.postMessage({ type: "oneshot:ready", slug: "block" }, "*");
  }, []);

  return (
    <div
      ref={rootRef}
      className={`${inter.variable} ${blackHanSans.variable} block-root`}
      data-mode={mode}
    >
      <div ref={revealRef} className="block-doc">
        <header className="block-hero" data-reveal="">
          <p className="block-kicker">
            <span lang="ko">콘크리트 시 출판</span> · CONCRETE POETRY PRESS
          </p>
          <h1 className="block-title" aria-label="BLOCK 블록">
            {TITLE}
            <span lang="ko" className="block-title__ko">블록</span>
          </h1>
          <p className="block-sub">
            <span lang="ko">단단한 그리드. 무거운 활자. 타협 없음.</span>
          </p>
        </header>

        {/* marquee — scrolling manifesto ticker */}
        <div className="block-marquee" aria-hidden="true">
          <span className="block-marquee__track">
            ◆ <span lang="ko">시는 콘크리트</span> POETRY IS CONCRETE ◆{" "}
            <span lang="ko">단어가 벽</span> WORDS ARE WALLS ◆{" "}
            <span lang="ko">벽이 시</span> WALLS ARE POEMS ◆{" "}
            <span lang="ko">무너뜨리지 마라</span> DO NOT DEMOLISH ◆
          </span>
        </div>

        {/* flip-layout — KO/EN mode toggle rearranges poems */}
        <section className="block-poems" aria-labelledby="block-poems-title">
          <div className="block-poems__head" data-reveal="">
            <h2 id="block-poems-title" className="block-secthead">
              <span lang="ko">작품</span> · WORKS
            </h2>
            <div className="block-mode-toggle">
              <button
                type="button"
                className={`block-mode-btn ${mode === "ko" ? "is-active" : ""}`}
                onClick={() => setMode("ko")}
              >
                <span lang="ko">한글</span>
              </button>
              <button
                type="button"
                className={`block-mode-btn ${mode === "en" ? "is-active" : ""}`}
                onClick={() => setMode("en")}
              >
                EN
              </button>
            </div>
          </div>

          <ol className="block-poem-list">
            {POEMS.map((p) => (
              <li key={p.no} className="block-poem" data-reveal="">
                <span className="block-poem__no">{p.no}</span>
                <div className="block-poem__body">
                  <p className="block-poem__ko" lang="ko">
                    {p.ko}
                  </p>
                  <p className="block-poem__en">
                    {p.en}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* clip-path-reveal — manifesto wipes in with hard cuts */}
        <section className="block-manifesto" data-reveal="">
          <p className="block-manifesto__text">
            <span lang="ko">
              우리는 부드러움을 거부한다. 시는 벽이다. 벽은 서 있어야 한다.
            </span>
          </p>
          <p className="block-manifesto__text block-manifesto__text--en">
            We reject softness. Poetry is a wall. A wall must stand.
          </p>
        </section>

        <footer className="block-foot" data-reveal="">
          <p>© 2026 BLOCK · <span lang="ko">블록</span> · MIT</p>
          <p>
            <span lang="ko">이징 없음 — 코드로 지었다.</span> no easing — built
            in code.
          </p>
        </footer>
      </div>
    </div>
  );
}
