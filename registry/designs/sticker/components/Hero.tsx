"use client";

import { useRef, type ReactNode } from "react";
import { usePointerParallax } from "../hooks/usePointerParallax";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

/**
 * Deterministic n-spike star burst polygon for the 쾅/POP SFX — SSR-stable
 * (same math on server and client, so no hydration drift).
 */
function starPoints(
  cx: number,
  cy: number,
  spikes: number,
  outer: number,
  inner: number,
): string {
  const pts: string[] = [];
  for (let i = 0; i < spikes * 2; i += 1) {
    const r = i % 2 === 0 ? outer : inner;
    const a = (Math.PI * i) / spikes - Math.PI / 2;
    pts.push(
      `${(cx + Math.cos(a) * r).toFixed(1)},${(cy + Math.sin(a) * r).toFixed(1)}`,
    );
  }
  return pts.join(" ");
}

const POP_POINTS = starPoints(60, 60, 12, 58, 36);

/**
 * Section 01 — the shout. A stacked bilingual wordmark (스티커 / STICKER)
 * styled as the biggest sticker on the desk, scattered with a small pile of
 * draggable accent stickers floating at three parallax depths. The hero IS a
 * miniature sticker board: you can grab anything here too. Pointer movement
 * pushes the layers at different rates so the pile reads as a real pile, not
 * a flat cluster. Reduced motion: the pile sits still.
 */
export default function Hero() {
  const reduced = usePrefersReducedMotion();
  const heroRef = useRef<HTMLElement | null>(null);
  usePointerParallax(heroRef, reduced);

  return (
    <header className="sticker-hero" ref={heroRef}>
      <p className="sticker-hero__kicker">
        <span data-sticker-parallax="0.04">STUDIO OF BOUNCY THINGS — SEOUL</span>
        <span lang="ko" data-sticker-parallax="0.04">
          끈적한 종이와 튀어오르는 색
        </span>
      </p>

      <div className="sticker-hero__stage">
        {/* far parallax layer: ghost outline stickers, behind everything */}
        <span
          className="sticker-hero__ghost sticker-hero__ghost--a"
          aria-hidden="true"
          data-sticker-parallax="0.04"
        >
          ★
        </span>
        <span
          className="sticker-hero__ghost sticker-hero__ghost--b"
          aria-hidden="true"
          data-sticker-parallax="0.04"
        >
          ♥
        </span>

        {/* mid layer: small draggable accent stickers around the wordmark */}
        <HeroSticker
          depth={0.08}
          className="sticker-sticker sticker-sticker--lime sticker-hero__decal sticker-hero__decal--lime"
          rot={-9}
          label="초록 READY sticker. Green ready sticker."
        >
          <span lang="ko" className="sticker-pill__ko">
            초록
          </span>
          <span className="sticker-pill__en">READY</span>
        </HeroSticker>

        <HeroSticker
          depth={0.08}
          className="sticker-sticker sticker-sticker--sky sticker-hero__decal sticker-hero__decal--sky"
          rot={7}
          label="파란 별 sticker. Blue star sticker."
        >
          <span className="sticker-star" aria-hidden="true">
            ★★★
          </span>
        </HeroSticker>

        {/* front layer: the wordmark sticker itself */}
        <h1 className="sticker-wordmark" data-sticker-parallax="0.14">
          <span className="sticker-wordmark__ko" lang="ko">
            스티커
          </span>
          <span className="sticker-wordmark__en">STICKER</span>
        </h1>

        {/* the POP SFX burst, a sticker in its own right */}
        <HeroSticker
          depth={0.20}
          className="sticker-sticker sticker-sticker--tangerine sticker-hero__pop"
          rot={14}
          label="뿅! 효과음 스티커. POP sound-effect sticker."
        >
          <svg
            viewBox="0 0 120 120"
            width="124"
            height="124"
            aria-hidden="true"
            focusable="false"
          >
            <polygon
              points={POP_POINTS}
              fill="var(--sticker-tangerine)"
              stroke="var(--sticker-ink)"
              strokeWidth="4"
              strokeLinejoin="round"
            />
            <text
              x="60"
              y="76"
              textAnchor="middle"
              lang="ko"
              className="sticker-pop__text"
            >
              뿅!
            </text>
          </svg>
        </HeroSticker>

        <HeroSticker
          depth={0.20}
          className="sticker-sticker sticker-sticker--bubble sticker-hero__decal sticker-hero__decal--heart"
          rot={-12}
          label="분홍 하트 sticker. Pink heart sticker."
        >
          <svg viewBox="0 0 64 56" width="68" height="59" aria-hidden="true" focusable="false">
            <path
              d="M32 52 C4 34 4 12 18 8 C26 6 32 12 32 20 C32 12 38 6 46 8 C60 12 60 34 32 52 Z"
              fill="var(--sticker-bubble)"
              stroke="var(--sticker-ink)"
              strokeWidth="4"
              strokeLinejoin="round"
            />
          </svg>
        </HeroSticker>
      </div>

      <div className="sticker-hero__stack" data-sticker-parallax="0.14">
        <p className="sticker-hero__shout">
          <span className="sticker-hl">우리는 스티커를 만들어요.</span>{" "}
          <span>We make things that stick.</span>
        </p>
        <p className="sticker-hero__sub">
          <span lang="ko">잡고, 던지고, 통통 튀는 웹사이트.</span>{" "}
          <span>Grab it. Fling it. Watch it bounce home.</span>
        </p>
        <a className="sticker-btn sticker-press" href="#sticker-board">
          <span lang="ko">스티커 만지기</span> · PLAY WITH THEM ↓
        </a>
      </div>

      <p className="sticker-hero__badge">
        EST. 2024 · <span lang="ko">접착력 좋음</span>
      </p>
    </header>
  );
}

/** HeroSticker is a draggable sticker in the hero pile. The depth drives
 *  parallax; the sticker-sticker class makes it a body for the physics
 *  engine (so the hero pile is grabbable too, not just decorative). */
function HeroSticker({
  depth,
  className,
  rot,
  label,
  children,
}: {
  depth: number;
  className: string;
  rot: number;
  label: string;
  children: ReactNode;
}) {
  return (
    <span
      className={className}
      style={
        {
          "--sticker-rot": `${rot}deg`,
          "--sticker-depth": depth,
        } as React.CSSProperties
      }
      data-sticker-parallax={depth}
      role="button"
      tabIndex={0}
      aria-roledescription="draggable sticker"
      aria-label={label}
      aria-describedby="sticker-board-hint"
    >
      {children}
    </span>
  );
}
