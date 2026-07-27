"use client";

import { Blob, Squiggle, Zigzag, Confetti, Arch, SpottedDisc } from "./Shapes";

/**
 * Section 01 — the shout. A massive geometric wordmark MEMPHIS / 멤피스 over
 * a warm off-white sheet, exploded with Memphis shapes: a coral blob, a
 * marigold squiggle (stroke-drawn on scroll-in via data-mp-squiggle), a
 * cobalt zigzag, a teal arch, confetti scatter, and the spotted-disc mark.
 * Each shape carries `--mp-delay` so the clip-path reveal fans them in.
 *
 * The kicker is bilingual; the Korean line ("포스트모던의 해, 다시") is the
 * studio's actual voice — shorter and drier than the English.
 */
export default function Hero() {
  return (
    <header className="mp-hero" aria-labelledby="mp-hero-title">
      <p className="mp-hero__kicker">
        <span>DESIGN STUDIO · EST. 2019 · <span lang="ko">서울</span></span>
        <span lang="ko">포스트모던의 해, 다시</span>
      </p>

      {/* Shape explosion — decorative, aria-hidden, clip-path-revealed.
          Inline --mp-delay staggers each shape's wipe-in by ~70ms. */}
      <div className="mp-hero__shapes" aria-hidden="true">
        <Blob
          className="mp-shape mp-shape--blob1"
          tone="coral"
          size={150}
        />
        <Squiggle
          className="mp-shape mp-shape--sq1"
          tone="marigold"
          width={220}
          draw
        />
        <Zigzag
          className="mp-shape mp-shape--zz1"
          tone="cobalt"
          width={150}
        />
        <Arch className="mp-shape mp-shape--arch1" tone="teal" width={130} />
        <Confetti
          className="mp-shape mp-shape--dot1"
          tone="plum"
          size={30}
        />
        <Confetti
          className="mp-shape mp-shape--dot2"
          tone="cobalt"
          size={22}
        />
        <Confetti
          className="mp-shape mp-shape--dot3"
          tone="teal"
          size={26}
        />
        <SpottedDisc className="mp-shape mp-shape--disc" size={120} />
      </div>

      <h1 className="mp-wordmark" id="mp-hero-title">
        <span className="mp-word" data-mp-clip style={{ ["--mp-delay" as string]: "0ms" }}>
          <span className="mp-word__ink">MEMPHIS</span>
        </span>
        <span
          className="mp-word mp-word--ko"
          lang="ko"
          data-mp-clip
          style={{ ["--mp-delay" as string]: "90ms" }}
        >
          멤피스
        </span>
      </h1>

      <p className="mp-hero__lede">
        <span lang="ko">형태는 자유롭게, 규칙은 단단하게.</span>{" "}
        A studio that builds postmodern brand systems — every squiggle earns
        its place.
      </p>

      <div className="mp-hero__stack">
        <a className="mp-btn mp-btn--press" href="#mp-work">
          <span lang="ko">작업 보기</span> · See the work ↓
        </a>
        <a
          className="mp-btn mp-btn--press mp-btn--ghost"
          href="#mp-studio"
        >
          <span lang="ko">스튜디오 소개</span>
        </a>
      </div>
    </header>
  );
}
