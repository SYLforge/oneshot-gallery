"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import "./styles.css";
import { bricolageGrotesque, notoSansKR } from "./fonts";
import { useReveal } from "./hooks/useReveal";
import { usePrefersReducedMotion } from "./hooks/usePrefersReducedMotion";

const TITLE = "MORPH";

/**
 * MORPH 모프 — letters that transform. The signature is the per-glyph morph:
 * the wordmark splits into spans and each letter runs its own staggered CSS
 * animation (rotate / skew / scale on different periods) so the type is never
 * still. A chromatic edge splits each glyph into cyan and magenta ghosts; a
 * soft purple glow sits underneath. Under reduced motion the glyphs hold a
 * composed pose (the morph paused at a readable frame).
 *
 * `.morph-js` is added on mount so the no-JS markup is the finished page:
 * wordmark lit, copy readable, the morph held at rest.
 */
export default function MorphPage() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const reduced = usePrefersReducedMotion();
  const revealRef = useReveal<HTMLDivElement>();

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    root.classList.add("morph-js");
    const id = requestAnimationFrame(() => root.classList.add("is-mounted"));
    window.parent?.postMessage({ type: "oneshot:ready", slug: "morph" }, "*");
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div
      ref={rootRef}
      className={`${bricolageGrotesque.variable} ${notoSansKR.variable} morph-root`}
    >
      <div className="mp-aurora" aria-hidden="true" />
      <div ref={revealRef} className="mp-doc">
        <header className="mp-hero" data-reveal="">
          <p className="mp-kicker">
            <span lang="ko">키네틱 타이포그래피</span> · KINETIC TYPE · 60fps morph
          </p>
          <h1 className="mp-title" aria-label={TITLE}>
            <span aria-hidden="true" className="mp-title__row">
              {TITLE.split("").map((ch, i) => (
                <span
                  key={i}
                  className="morph-glyph"
                  style={{ "--mp-i": i, "--mp-n": i % 3 } as CSSProperties}
                >
                  <span className="mp-glyph__ghost mp-glyph__ghost--cyan" aria-hidden="true">
                    {ch}
                  </span>
                  <span className="mp-glyph__ghost mp-glyph__ghost--mag" aria-hidden="true">
                    {ch}
                  </span>
                  <span className="mp-glyph__core">{ch}</span>
                </span>
              ))}
            </span>
            <span lang="ko" className="mp-title__kr" aria-hidden="true">
              모프
            </span>
          </h1>
          <p className="mp-sub" data-reveal="">
            <span lang="ko">변형하는 글자.</span> Letters that transform — every
            glyph morphs on its own clock, never the same shape twice.
          </p>
        </header>

        <section className="mp-modes" aria-labelledby="mp-modes-title">
          <div className="mp-sechead" data-reveal="">
            <p className="mp-eyebrow">
              02 — <span lang="ko">세 가지 움직임</span> · the motions
            </p>
            <h2 id="mp-modes-title" className="mp-secthead__title">
              three motions
            </h2>
            <p className="mp-secthead__kr" lang="ko">
              회전, 기울임, 확대 — 글자마다 다른 박자로.
            </p>
          </div>
          <div className="mp-modegrid">
            <article className="mp-modecard" data-reveal="">
              <p className="mp-modecard__demo mp-modecard__demo--spin" aria-hidden="true">A</p>
              <p className="mp-modecard__h">
                01 — <span lang="ko">회전</span> rotate
              </p>
              <p className="mp-modecard__b">
                <span lang="ko">글자가 제자리에서 돈다.</span> The glyph spins
                on its own axis, a slow orbit.
              </p>
            </article>
            <article className="mp-modecard" data-reveal="">
              <p className="mp-modecard__demo mp-modecard__demo--skew" aria-hidden="true">A</p>
              <p className="mp-modecard__h">
                02 — <span lang="ko">기울임</span> skew
              </p>
              <p className="mp-modecard__b">
                <span lang="ko">형태가 비틀리고 펴진다.</span> The form twists
                and straightens, leaning then settling.
              </p>
            </article>
            <article className="mp-modecard" data-reveal="">
              <p className="mp-modecard__demo mp-modecard__demo--scale" aria-hidden="true">A</p>
              <p className="mp-modecard__h">
                03 — <span lang="ko">확대</span> scale
              </p>
              <p className="mp-modecard__b">
                <span lang="ko">작았다 커진다.</span> It breathes — shrinking
                small, swelling large, on a long period.
              </p>
            </article>
          </div>
        </section>

        <section className="mp-chroma" aria-labelledby="mp-chroma-title">
          <div className="mp-sechead" data-reveal="">
            <p className="mp-eyebrow">
              03 — <span lang="ko">색수차</span> · the edge
            </p>
            <h2 id="mp-chroma-title" className="mp-secthead__title">
              chromatic edge
            </h2>
            <p className="mp-secthead__kr" lang="ko">
              시안과 마젠타 고스트가 보라를 감싼다.
            </p>
          </div>
          <p className="mp-chroma-demo" data-reveal="" aria-hidden="true">
            <span className="mp-chroma-glyph">
              <span className="mp-glyph__ghost mp-glyph__ghost--cyan">M</span>
              <span className="mp-glyph__ghost mp-glyph__ghost--mag">M</span>
              <span className="mp-glyph__core">M</span>
            </span>
          </p>
          <p className="mp-chroma-cap" data-reveal="">
            <span lang="ko">두 고스트가 어긋나면 색수차 엣지.</span> Two offset
            ghosts make the chromatic edge — the type refracts like glass.
          </p>
        </section>

        <footer className="mp-foot" data-reveal="">
          <p className="mp-foot__brand">
            MORPH <span lang="ko">모프</span> ·{" "}
            <span lang="ko">변형하는 글자</span>
          </p>
          <p className="mp-foot__line">
            <span lang="ko">순수 코드 — 이미지 없음.</span> Pure code · no
            images · MIT
          </p>
        </footer>
      </div>
    </div>
  );
}
