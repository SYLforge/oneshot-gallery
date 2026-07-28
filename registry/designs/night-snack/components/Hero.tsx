"use client";

import { useRef } from "react";
import { useInView } from "../hooks/useInView";

/**
 * Chapter 01 — the establishing shot. The pojangmacha at 1 AM, drawn entirely
 * in CSS: an orange tarp roof with a neon amber ridge, a striped awning, a
 * row of five paper lanterns that sway on mutually-prime cycles, a counter
 * with a breathing grill-ember band, and three rising steam plumes. No image
 * payload — `media.source: "code"`.
 *
 * The hero carries no JS-driven motion of its own (the lanterns, grill, and
 * steam are pure CSS ambient animations, dead under reduced motion). The only
 * JS touch here is the IntersectionObserver that latches `.is-lit` once, so
 * the status dot's pulse can begin — mirroring the gallery's reveal grammar.
 *
 * Without JS the panel is a finished, lit tent: every ambient animation still
 * runs (they're CSS), the wordmark glows, and the copy reads whole.
 */
export default function Hero() {
  const heroRef = useRef<HTMLElement | null>(null);
  const { seen } = useInView<HTMLElement>(heroRef, { threshold: 0.2 });

  return (
    <header
      className={`ns-hero${seen ? " is-lit" : ""}`}
      aria-labelledby="ns-title"
      ref={heroRef}
    >
      {/* The ambient alley — a generated painterly night-food-street photo
          blurred deep behind the CSS diorama, so the tent reads as sitting
          in a real back-alley at 1 AM. The code illustration stays the
          foreground; this is atmosphere, not a replacement for it. */}
      <img
        className="ns-hero__alley"
        src="/media/night-snack/alley.avif"
        alt=""
        aria-hidden="true"
        draggable="false"
      />

      {/* The CSS diorama. Decorative — the accessible name rides on the h1. */}
      <div className="ns-hero__scene" aria-hidden="true">
        <div className="ns-hero__roof" />
        <div className="ns-hero__awning" />
        <div className="ns-hero__lanterns">
          <span className="ns-lantern" />
          <span className="ns-lantern" />
          <span className="ns-lantern" />
          <span className="ns-lantern" />
          <span className="ns-lantern" />
        </div>
        <div className="ns-hero__steam">
          <span />
          <span />
          <span />
        </div>
        <div className="ns-hero__counter">
          <div className="ns-hero__grill" />
        </div>
      </div>

      <div className="ns-hero__inner">
        <p className="ns-hero__kicker">
          <span lang="ko">새벽 한 시 · 종로 뒷골목</span>
          <span className="ns-mono">· 1 AM · BACK-ALLEY OF JONGNO</span>
        </p>

        <h1 className="ns-hero__title" id="ns-title">
          <span className="ns-hero__title-ko" lang="ko">
            야식!
          </span>
          <span className="ns-hero__title-en">NIGHT-SNACK</span>
        </h1>

        <p className="ns-hero__lede" lang="ko">
          불은 꺼지지 않는다. 김은 피어오르고, 잔은 부딪친다.
        </p>
        <p className="ns-hero__lede-en">
          The lights never go out. Steam rises, the glasses clink — this is
          the tent at the hour the city stops pretending it is asleep.
        </p>

        <p className="ns-hero__status">
          <span className="ns-hero__statusdot" aria-hidden="true" />
          <span lang="ko">영업 중</span>
          <span className="ns-mono">· OPEN · 밤 9시 — 새벽 4시</span>
        </p>
      </div>

      <p className="ns-hero__hint">
        <span lang="ko">아래로</span>
        <span className="ns-mono">SCROLL TO READ THE CHAPTER</span>
      </p>
    </header>
  );
}
