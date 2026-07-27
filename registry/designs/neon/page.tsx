"use client";

import { useEffect, useRef } from "react";
import "./styles.css";
import { blackHanSans, notoSansKR, orbitron } from "./fonts";
import { useReveal } from "./hooks/useReveal";
import { usePrefersReducedMotion } from "./hooks/usePrefersReducedMotion";

/**
 * NEON — 빗 젖은 사이버펑크 도시, 2087. Rain-slick neon signs reflecting in
 * puddles, holographic storefront marquees, retrowave grid horizon. Where
 * GRADIENT-PLAZA is an open vaporwave mall, NEON is a claustrophobic vertical
 * city in the rain. Pure code.
 */
export default function NeonPage() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const reduced = usePrefersReducedMotion();
  const revealRef = useReveal<HTMLDivElement>();

  useEffect(() => {
    rootRef.current?.classList.add("neon-js");
    window.parent?.postMessage({ type: "oneshot:ready", slug: "neon" }, "*");
  }, []);

  return (
    <div
      ref={rootRef}
      className={`${blackHanSans.variable} ${notoSansKR.variable} ${orbitron.variable} neon-root`}
    >
      <div ref={revealRef} className="neon-doc">
        <header className="neon-hero" data-reveal="">
          <p className="neon-kicker">
            <span lang="ko">사이버펑크 거리 · 2087</span> · CYBERPUNK STREET
          </p>
          <h1 className="neon-title">
            <span className="neon-title__glow neon-title__glow--magenta">NEON</span>
            <span lang="ko" className="neon-title__kr">
              네온
            </span>
          </h1>
          <p className="neon-sub" data-reveal="">
            <span lang="ko">비가 내리고, 사인이 번진다.</span> The rain falls; the
            signs bleed.
          </p>
        </header>

        <section className="neon-signs" aria-labelledby="neon-signs-title">
          <h2 id="neon-signs-title" className="neon-secthead" data-reveal="">
            <span lang="ko">상점 간판</span> · storefronts
          </h2>
          <div className="neon-signgrid">
            <div className="neon-sign neon-sign--magenta" data-reveal="">
              <pre className="neon-sign__ascii" aria-label="Neon sign: 라면 RAMEN">
                {` ▄▄▄▄▄ ▄▄▄ ▄▄ ▄▄▄▄ \n█     █  █ █  █   █\n█  ▄  █  █ █  █▀▀▀█\n█ █▄█ █  █ █  █   █\n █▀▀▀  █▀█ █▀ █▀▀▀`}
              </pre>
              <p className="neon-sign__cap" lang="ko">
                라면 — 24시간
              </p>
            </div>
            <div className="neon-sign neon-sign--cyan" data-reveal="">
              <pre className="neon-sign__ascii" aria-label="Neon sign: 술 BAR">
                {`▄▄▄▄ ▄▄ ▄▄▄\n█  █ █  █  █\n█▀█  █  █▀█ \n█ █  █  █ █ \n█▀▀  █▀▀ █▀▀`}
              </pre>
              <p className="neon-sign__cap" lang="ko">
                술 — 새벽까지
              </p>
            </div>
            <div className="neon-sign neon-sign--purple" data-reveal="">
              <pre className="neon-sign__ascii" aria-label="Neon sign: 전자 ELECTRONICS">
                {`▄▄▄▄ ▄▄▄ ▄▄▄ ▄▄ ▄▄▄▄▄\n█    █  █ █    █  █     \n█▀▀  █▀█ █▀▀  █  █▀▀▀ \n█    █ █ █    █  █    \n█▀▀  █▀█ █▀▀  █▀▀ █▀▀▀`}
              </pre>
              <p className="neon-sign__cap" lang="ko">
                전자 — 수리
              </p>
            </div>
          </div>
        </section>

        <div className="neon-marquee" aria-hidden="true">
          <span className="neon-marquee__track">
            ◆ <span lang="ko">환영</span> WELCOME TO DISTRICT 9 ·{" "}
            <span lang="ko">조심히 걸으세요</span> WATCH YOUR STEP ·{" "}
            <span lang="ko">24시간 영업</span> OPEN 24H ·◆
          </span>
        </div>

        <footer className="neon-foot" data-reveal="">
          <p>
            © 2087 NEON · <span lang="ko">제9구역</span> · MIT
          </p>
          <p>
            <span lang="ko">전부 코드로 그렸다 — 이미지 없음.</span> drawn
            entirely in code — no images.
          </p>
        </footer>
      </div>

      {/* Rain + scanline overlays */}
      <div className="neon-rain" aria-hidden="true" />
      <div className="neon-scanlines" aria-hidden="true" />
    </div>
  );
}
