"use client";

import { useEffect, useRef } from "react";

type HeroProps = {
  reduced: boolean;
};

/**
 * Accessible char-split wordmark. The container carries the real text in an
 * `aria-label`; the visible text is per-glyph `aria-hidden` spans that rise
 * into place behind an overflow-clip mask on a 44ms stagger. The markup is
 * IDENTICAL on the server and the client (no hydration mismatch); only the
 * animation pre-state is gated — it lives behind the `.aurora-js` root class
 * (added on mount) and a locally-added `.is-visible`. So in the no-JS view,
 * under SSR, and under reduced motion, the wordmark is simply present.
 *
 * This is the char-split-reveal technique: one word, animated per glyph,
 * accessibility held by the label/hidden-span contract.
 */
function SplitWord({ text }: { text: string }) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const glyphs = Array.from(text);

  useEffect(() => {
    // Reveal on the next frame so the JS-gated pre-state (glyphs translated
    // down) paints first, then the transition runs. cancelled on unmount.
    const id = requestAnimationFrame(() => {
      ref.current?.classList.add("is-visible");
    });
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <span className="aurora-split" ref={ref} aria-label={text}>
      <span className="aurora-split__line" aria-hidden="true">
        {glyphs.map((ch, i) => (
          <span
            key={`${ch}-${i}`}
            className="aurora-split__glyph"
            style={{ transitionDelay: `${i * 44}ms` }}
          >
            {ch}
          </span>
        ))}
      </span>
    </span>
  );
}

/**
 * Section 01 — the masthead over the living sky. A full-viewport morphing
 * CSS mesh gradient (five radial blobs on mutually-prime cycles) sits behind
 * the launch wordmark, a char-split headline, and the primary CTA. The mesh
 * is the signature: it breathes on its own, never reacts to the pointer.
 * A deep-space scrim keeps the masthead copy at AA over the brightest blob.
 *
 * Under reduced motion the mesh holds one composed frame (its keyframes are
 * paused) and the headline is simply visible.
 */
export default function Hero({ reduced }: HeroProps) {
  const meshRef = useRef<HTMLDivElement | null>(null);

  // Pause the ambient mesh when the hero is scrolled fully out of view, so
  // an offscreen animation costs nothing (gate G3). One IO, no rAF.
  useEffect(() => {
    const mesh = meshRef.current;
    if (!mesh || reduced) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        mesh.style.animationPlayState = entry.isIntersecting
          ? "running"
          : "paused";
      },
      { threshold: 0 },
    );
    io.observe(mesh);
    return () => io.disconnect();
  }, [reduced]);

  return (
    <header className="aurora-hero" aria-label="AURORA">
      <div className="aurora-mesh" ref={meshRef} aria-hidden="true">
        <div className="aurora-mesh__layer aurora-mesh__layer--violet" />
        <div className="aurora-mesh__layer aurora-mesh__layer--fuchsia" />
        <div className="aurora-mesh__layer aurora-mesh__layer--cyan" />
        <div className="aurora-mesh__layer aurora-mesh__layer--emerald" />
        <div className="aurora-mesh__layer aurora-mesh__layer--blend" />
        <div className="aurora-mesh__sweep" />
        <div className="aurora-mesh__grain" />
      </div>
      <div className="aurora-hero__scrim" aria-hidden="true" />

      <div className="aurora-hero__inner">
        <p className="aurora-kicker">
          <span className="aurora-kicker__dot" aria-hidden="true" />
          NOW IN PRIVATE BETA ·{" "}
          <span lang="ko" className="aurora-kicker__ko">
            프라이빗 베타 진행 중
          </span>
        </p>

        <h1 className="aurora-title">
          <span className="aurora-title__word">
            <SplitWord text="AURORA" />
          </span>
          <span className="aurora-title__sub" data-reveal>
            The thinking surface for product teams.
            <span lang="ko" className="aurora-title__ko">
              프로덕트 팀을 위한 생각의 표면.
            </span>
          </span>
        </h1>

        <p className="aurora-lede" data-reveal>
          A single canvas where notes become specs, specs become tasks, and
          tasks ship — while a context that remembers everything keeps pace
          behind you. Built for the team that ships on Tuesday.
          <span lang="ko" className="aurora-lede__ko">
            메모가 스펙이 되고, 스펙이 작업이 되고, 작업이 출시되는 하나의
            캔버스. 모든 맥락을 기억하는 문맥이 당신 뒤에서 보폭을 맞춘다.
            화요일마다 출시하는 팀을 위해.
          </span>
        </p>

        <div className="aurora-hero__cta" data-reveal>
          <a
            className="aurora-btn aurora-btn--primary"
            href="#features"
            data-tilt
          >
            Request access
            <span lang="ko" className="aurora-btn__ko">
              액세스 요청
            </span>
          </a>
          <a className="aurora-btn aurora-btn--ghost" href="#manifesto">
            Read the manifesto
            <span lang="ko" className="aurora-btn__ko">
              매니페스트 읽기
            </span>
          </a>
        </div>

        <p className="aurora-hero__hint" aria-hidden="true">
          scroll — the sky keeps moving · 스크롤 — 하늘은 계속 움직인다
        </p>
      </div>
    </header>
  );
}
