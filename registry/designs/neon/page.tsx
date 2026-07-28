"use client";

import { useEffect, useRef } from "react";
import "./styles.css";
import { blackHanSans, notoSansKR, orbitron } from "./fonts";
import { useReveal } from "./hooks/useReveal";
import { usePrefersReducedMotion } from "./hooks/usePrefersReducedMotion";
import { usePointerParallax } from "./hooks/usePointerParallax";

/**
 * NEON 네온 — 빗 젖은 사이버펑크 도시, 2087. Rain-slick neon signs reflecting
 * in puddles, holographic storefront marquees, a retrowave grid horizon, and
 * a street-scene cinemagraph. Where GRADIENT-PLAZA is an open vaporwave mall,
 * NEON is a claustrophobic vertical city in the rain. Pure code, no images.
 *
 * `.neon-js` is added imperatively on mount (a signal to CSS that JS is alive,
 * never React state): pre-reveal styles gate behind it, and with JavaScript
 * off the full street stands finished, lit.
 */
export default function NeonPage() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const sceneRef = useRef<HTMLDivElement | null>(null);
  const reduced = usePrefersReducedMotion();
  const revealRef = useReveal<HTMLDivElement>();
  usePointerParallax(sceneRef, reduced);

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
        {/* Hero — the rain-soaked street, the title bleeding through it */}
        <header className="neon-hero" data-reveal="">
          <p className="neon-kicker">
            <span lang="ko">사이버펑크 거리 · 2087</span> · CYBERPUNK STREET
            · DISTRICT 9
          </p>
          <h1 className="neon-title" aria-label="NEON 네온">
            <span className="neon-title__glow">NEON</span>
            <span lang="ko" className="neon-title__kr">
              네온
            </span>
          </h1>
          <p className="neon-sub" data-reveal="">
            <span lang="ko">비가 내리고, 사인이 번진다.</span> The rain falls; the
            signs bleed into the wet asphalt and never quite dry.
          </p>
          <p className="neon-hero__cue" aria-hidden="true">
            <span lang="ko">아래로 — 거리로 내려가다</span> ↓ descend into the
            street
          </p>
        </header>

        {/* The street scene — buildings, signs, puddle. Pointer parallax. */}
        <section
          className="neon-scene"
          aria-label="거리 씬 — 빗물에 번지는 네온. The rain-slick street scene."
          ref={sceneRef}
        >
          {/* A generated rain-city render deep behind the CSS skyline — the
              real Blade-Runner city the code buildings sit in front of.
              Darkened and blurred; the hanging signs + puddle stay focal. */}
          <img
            className="neon-scene__city"
            src="/media/neon/rain-city.avif"
            alt=""
            aria-hidden="true"
            draggable="false"
          />
          <div className="neon-skyline" aria-hidden="true">
            <span className="neon-bldg neon-bldg--1" />
            <span className="neon-bldg neon-bldg--2" />
            <span className="neon-bldg neon-bldg--3" />
            <span className="neon-bldg neon-bldg--4" />
            <span className="neon-bldg neon-bldg--5" />
            <span className="neon-bldg neon-bldg--6" />
            {/* lit windows — a city that never sleeps */}
            <span className="neon-win neon-win--a" />
            <span className="neon-win neon-win--b" />
            <span className="neon-win neon-win--c" />
            <span className="neon-win neon-win--d" />
            <span className="neon-win neon-win--e" />
            <span className="neon-win neon-win--f" />
          </div>

          <div className="neon-puddle" aria-hidden="true">
            <span className="neon-puddle__refl neon-puddle__refl--magenta" />
            <span className="neon-puddle__refl neon-puddle__refl--cyan" />
          </div>

          {/* floating vertical neon signs hanging off the buildings */}
          <div className="neon-hang neon-hang--magenta" aria-hidden="true">
            <span lang="ko">면</span>
          </div>
          <div className="neon-hang neon-hang--cyan" aria-hidden="true">
            <span lang="ko">술</span>
          </div>
          <div className="neon-hang neon-hang--purple" aria-hidden="true">
            <span lang="ko">24H</span>
          </div>
        </section>

        {/* Holographic marquee — the storefront ticker */}
        <div className="neon-marquee" aria-hidden="true">
          <span className="neon-marquee__track">
            ◆ <span lang="ko">환영</span> WELCOME TO DISTRICT 9 ·{" "}
            <span lang="ko">조심히 걸으세요</span> WATCH YOUR STEP ·{" "}
            <span lang="ko">24시간 영업</span> OPEN 24H ·{" "}
            <span lang="ko">비 계속</span> RAIN CONTINUES ·◆{" "}
            <span lang="ko">환영</span> WELCOME TO DISTRICT 9 ·{" "}
            <span lang="ko">조심히 걸으세요</span> WATCH YOUR STEP ·{" "}
            <span lang="ko">24시간 영업</span> OPEN 24H ·{" "}
            <span lang="ko">비 계속</span> RAIN CONTINUES ·◆
          </span>
        </div>

        {/* Sign gallery — the storefronts */}
        <section className="neon-signs" aria-labelledby="neon-signs-title">
          <div className="neon-sechead" data-reveal="">
            <p className="neon-eyebrow">02 — 간판 · signage</p>
            <h2 id="neon-signs-title" className="neon-secthead__title">
              storefronts
            </h2>
            <p className="neon-secthead__kr" lang="ko">
              비에 젖은 간판들이 도시의 전부다.
            </p>
          </div>

          <div className="neon-signgrid">
            <article className="neon-sign neon-sign--magenta" data-reveal="">
              <pre
                className="neon-sign__ascii"
                aria-label="Neon sign: 라면 RAMEN — 24 hours"
              >{` ▄▄▄▄▄ ▄▄▄ ▄▄ ▄▄▄▄
█     █  █ █  █   █
█  ▄  █  █ █  █▀▀▀█
█ █▄█ █  █ █  █   █
 █▀▀▀  █▀█ █▀ █▀▀▀`}</pre>
              <p className="neon-sign__cap">
                <span lang="ko">라면</span> · RAMEN
              </p>
              <p className="neon-sign__hours" lang="ko">
                24시간 — 국물이 끓지 않는다
              </p>
            </article>

            <article className="neon-sign neon-sign--cyan" data-reveal="">
              <pre
                className="neon-sign__ascii"
                aria-label="Neon sign: 술 BAR — until dawn"
              >{`▄▄▄▄ ▄▄ ▄▄▄
█  █ █  █  █
█▀█  █  █▀█
█ █  █  █ █
█▀▀  █▀▀ █▀▀`}</pre>
              <p className="neon-sign__cap">
                <span lang="ko">술</span> · BAR
              </p>
              <p className="neon-sign__hours" lang="ko">
                새벽까지 — 마지막 손님이 불 끈다
              </p>
            </article>

            <article className="neon-sign neon-sign--purple" data-reveal="">
              <pre
                className="neon-sign__ascii"
                aria-label="Neon sign: 전자 ELECTRONICS — repair"
              >{`▄▄▄▄ ▄▄▄ ▄▄▄ ▄▄ ▄▄▄▄▄
█    █  █ █    █  █
█▀▀  █▀█ █▀▀  █  █▀▀▀
█    █ █ █    █  █
█▀▀  █▀█ █▀▀  █▀▀ █▀▀▀`}</pre>
              <p className="neon-sign__cap">
                <span lang="ko">전자</span> · ELECTRONICS
              </p>
              <p className="neon-sign__hours" lang="ko">
                수리 — 부품은 없다, 솜씨만
              </p>
            </article>

            <article className="neon-sign neon-sign--amber" data-reveal="">
              <pre
                className="neon-sign__ascii"
                aria-label="Neon sign: 이발 BARBER"
              >{`▄▄▄▄ ▄▄ ▄▄▄ ▄▄ ▄▄
█  █ █  █  █ █  █  █
█▀█  █  █▀█  █  █▀█
█ █  █  █ █  █  █ █
█▀▀  █▀▀ █▀▀ █▀▀ █▀▀`}</pre>
              <p className="neon-sign__cap">
                <span lang="ko">이발</span> · BARBER
              </p>
              <p className="neon-sign__hours" lang="ko">
                예약 없음 — 앉으면 깎는다
              </p>
            </article>
          </div>
        </section>

        {/* Retrowave grid horizon — the city's edge */}
        <section className="neon-grid-sect" aria-labelledby="neon-grid-title">
          <div className="neon-sechead neon-sechead--center" data-reveal="">
            <p className="neon-eyebrow">03 — 지평선 · horizon</p>
            <h2 id="neon-grid-title" className="neon-secthead__title">
              the grid
            </h2>
            <p className="neon-secthead__kr neon-secthead__kr--center" lang="ko">
              도시가 끝나는 곳, 비가 시작되는 곳.
            </p>
          </div>
          <div className="neon-grid" aria-hidden="true">
            <div className="neon-grid__floor" />
            <div className="neon-grid__sun" />
          </div>
        </section>

        {/* Street poem — the city's voice */}
        <section className="neon-poem" aria-labelledby="neon-poem-title">
          <p className="neon-eyebrow">04 — 시 · a street poem</p>
          <h2 id="neon-poem-title" className="neon-visually-hidden">
            거리의 시 · a poem of the street
          </h2>
          <blockquote className="neon-poem__body" data-reveal="">
            <p lang="ko">비는 멈추지 않고,</p>
            <p>the rain does not stop,</p>
            <p lang="ko">사인은 꺼지지 않는다.</p>
            <p>and the signs do not go dark.</p>
            <p lang="ko">이 도시가 잠드는 법은 —</p>
            <p>the way this city sleeps —</p>
            <p lang="ko">그냥, 조금 덜 밝아질 뿐.</p>
            <p>is only to grow a little less bright.</p>
          </blockquote>
        </section>

        <footer className="neon-foot" data-reveal="">
          <p className="neon-foot__brand">
            NEON <span lang="ko">네온</span> ·{" "}
            <span lang="ko">제9구역</span> DISTRICT 9
          </p>
          <p className="neon-foot__line">
            <span lang="ko">2087 · 비가 내리는 밤.</span> 2087 · a rainy night,
            drawn entirely in code.
          </p>
          <p className="neon-foot__copy">© 2087 NEON · MIT · no images</p>
        </footer>
      </div>

      {/* Rain + scanline overlays — fixed, over everything */}
      <div className="neon-rain" aria-hidden="true" />
      <div className="neon-scanlines" aria-hidden="true" />
      <div className="neon-vignette" aria-hidden="true" />
    </div>
  );
}
