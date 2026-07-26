"use client";

import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

/**
 * Section 01 — the shout. A massive stacked wordmark RAVE / 2099
 * (Archivo Black, huge) sitting on pure black with a strobing electric-blue
 * under-plate (CSS pseudo-element, `content: attr(data-text) / ""` so it is
 * silent to screen readers). The blue plate breathes 1.0 → 0.55 on a 2.6s
 * ease-in-out loop — that is the entire ambient motion budget of the hero
 * (plus the scanline drift). Under `.rave-js`; dead under reduced motion.
 *
 * CRT scanline overlay (the `crt-scanline` technique): a fixed-in-hero
 * repeating-linear-gradient grid at 3px pitch, drifting one line per 8s,
 * gated to reduced-motion-off. It tints the hero, not the whole page.
 */
export default function Hero() {
  const reduced = usePrefersReducedMotion();
  const rootRef = useRef<HTMLElement | null>(null);

  // The scanline layer is decorative; we only need to know whether motion is
  // allowed so CSS can stop the drift. The class is added here (not in CSS)
  // because the hero is the only place the overlay lives.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    root.classList.toggle("rave-hero--strobe", !reduced);
  }, [reduced]);

  return (
    <header className="rave-hero" ref={rootRef}>
      {/* CRT scanline overlay — decorative, pointer-transparent, hero-only. */}
      <div className="rave-hero__scanlines" aria-hidden="true" />

      <p className="rave-hero__kicker">
        <span lang="ko">이태원 · 폐인쇄공장 · 원나잇</span>
        <span>22:00 — 06:00 · 22 NOV 2099</span>
      </p>

      <h1 className="rave-wordmark">
        <span className="rave-word" data-text="RAVE">
          <span className="rave-word__ink">RAVE</span>
        </span>
        <span className="rave-word rave-word--deck" data-text="/ 2099 /">
          <span className="rave-word__ink">/ 2099 /</span>
        </span>
      </h1>

      <p className="rave-hero__ko" lang="ko">
        레이브 2099
      </p>

      <div className="rave-hero__stack">
        <p className="rave-hero__shout">
          <span className="rave-hl">DOORS AT 22:00.</span>{" "}
          <span lang="ko">밤 10시, 문이 열린다.</span>
        </p>
        <p className="rave-hero__sub">
          NO CAMERA. NO LIST. NO QUIET.{" "}
          <span lang="ko">카메라 금지, 리스트 없음, 조용함 없음.</span>
        </p>
        <a className="rave-btn rave-press" href="#rave-tickets">
          GET A WRISTBAND <span lang="ko">밴드 받기</span> →
        </a>
      </div>
    </header>
  );
}
