"use client";

import { useEffect, useRef } from "react";
import SplitText from "./SplitText";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import type { RefObject } from "react";

const TITLE = "TYPEWAVE";

/**
 * The cover. The wordmark is the instrument: each glyph of TYPEWAVE rises in
 * on load (char-split, aria-safe, 45ms stagger), then — under a fine pointer
 * and without reduced motion — the page's scroll velocity writes the glyphs'
 * scaleX. The faster you scroll, the more the letters stretch, exactly like
 * a waveform reacting to amplitude. Scroll velocity is read from the shared
 * ref (no React renders per frame) and written imperatively per glyph in a
 * single rAF, transform-only.
 *
 * The velocity stretch is gated behind `.typewave-js` and behind the velocity
 * hook's `enabled` flag, so under reduced motion (and on no-JS, and on touch
 * where the hero scrubs with the page) the wordmark rests at scaleX(1) — the
 * finished, readable state. The hero is never blank; the letters are always
 * there, fully styled, with or without motion.
 *
 * `velRef` is passed in from the page so the velocity signal is shared with
 * the section heads that also react to amplitude — one source of truth.
 */
export default function Hero({
  velRef,
}: {
  velRef: RefObject<number>;
}) {
  const heroRef = useRef<HTMLElement | null>(null);
  const reduced = usePrefersReducedMotion();

  // Arm the entrance animation (char rise). Without JS the class never lands
  // and the wordmark is simply complete and readable.
  useEffect(() => {
    heroRef.current?.classList.add("is-on");
  }, []);

  // Velocity → per-glyph scaleX stretch, transform-only, in a single rAF.
  // The glyphs are queried inside the effect (SplitText renders the spans as
  // aria-hidden visuals; the h1 carries the real accessible name).
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;
    if (reduced) return;
    // Only the hero reacts to velocity on fine pointers; on touch the page
    // scroll itself is the interaction and an extra stretch fights the scroll.
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      return;
    }
    const glyphs = Array.from(
      hero.querySelectorAll<HTMLSpanElement>(
        ".typewave-hero__title .typewave-split__ch",
      ),
    );
    if (glyphs.length === 0) return;

    let raf = 0;
    const VEL_GAIN = 0.42; // max added stretch per unit velocity (amplitude)
    const DECAY_PER_FRAME = 0.16; // how fast the visual stretch releases

    let shown = 0; // the displayed amplitude (lerped), 0 at rest
    const stretch = () => {
      raf = 0;
      const target = Math.min(velRef.current, 1);
      // approach while scrolling, decay while at rest
      if (target > shown) shown += (target - shown) * 0.35;
      else shown *= 1 - DECAY_PER_FRAME;
      if (shown < 0.001) shown = 0;
      const amp = shown * VEL_GAIN;
      // a small per-glyph phase so the stretch reads as a moving wave, not a
      // uniform bulge — alternating glyphs pull slightly opposite
      for (let i = 0; i < glyphs.length; i++) {
        const phase = (i % 2 === 0 ? 1 : -0.7) * amp;
        glyphs[i].style.transform = `scaleX(${(1 + phase).toFixed(4)})`;
      }
      if (shown > 0.0005) {
        raf = requestAnimationFrame(stretch);
      }
    };

    let armed = false;
    const arm = () => {
      if (armed) return;
      armed = true;
      if (!raf) raf = requestAnimationFrame(stretch);
    };
    // the velocity hook updates velRef on scroll; we just need to wake the
    // loop whenever the page scrolls and let it run until it settles.
    window.addEventListener("scroll", arm, { passive: true });
    return () => {
      window.removeEventListener("scroll", arm);
      if (raf) cancelAnimationFrame(raf);
      for (const g of glyphs) g.style.transform = "";
      armed = false;
      shown = 0;
    };
  }, [reduced, velRef]);

  return (
    <header
      ref={heroRef}
      className="typewave-hero"
      aria-labelledby="typewave-title"
    >
      {/* A generated waveform render deep behind the cover — the ambient
         sound-field the wordmark plays against. Pure-black base preserved;
         only thin acid lines bleed through, so the page stays Swiss/minimal. */}
      <img
        className="typewave-hero__field"
        src="/media/typewave/waveform.avif"
        alt=""
        aria-hidden="true"
        draggable="false"
      />

      <div className="typewave-frame typewave-hero__inner">
        <p className="typewave-hero__kicker typewave-mono">
          <span>typewave — type that plays like a track · 2026</span>
          <span lang="ko">타입웨이브 — 연주되는 타이포그래피</span>
        </p>

        <h1 className="typewave-hero__title" id="typewave-title" aria-label={TITLE}>
          <SplitText text={TITLE} />
        </h1>

        <p className="typewave-hero__ko" lang="ko">
          타입웨이브
        </p>

        <div className="typewave-hero__wave" aria-hidden="true">
          <span className="typewave-hero__zero typewave-mono">0.000s · 0dB</span>
          <i className="typewave-hero__line" />
        </div>

        <div className="typewave-hero__foot">
          <p className="typewave-hero__lede">
            An electronic artist whose only instrument is the typeface.
            Scroll, and the wordmark behaves like a waveform — stretched by
            velocity, scrubbed by hand, set to one acid accent on pure black.
            <span lang="ko">
              악기가 오직 타이포그래피뿐인 전자음악 아티스트. 스크롤하면 워드마크가
              파형처럼 움직인다 — 속도로 늘어나고, 손으로 스크럽되고, 완전한 검정
              위 산성 초록 하나로 세팅된다.
            </span>
          </p>
          <p className="typewave-hero__meta typewave-mono">
            <span>single · TYPEWAVE / 03:12</span>
            <span>variable font · wdth 62–125</span>
            <span lang="ko">스크롤이 재생입니다</span>
          </p>
        </div>

        <p className="typewave-hero__cue typewave-mono" aria-hidden="true">
          ↓ scroll to play · 스크롤 = 재생
        </p>
      </div>
    </header>
  );
}
