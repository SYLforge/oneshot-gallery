"use client";

import { useSpringPress } from "../hooks/useSpring";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

/**
 * The arrival. A warm butter sky with a giant bouncing wordmark — "통통"
 * above "BOUNCE" — whose glyphs spring up one-by-one with overshoot as you
 * land (`char-split-reveal`, handled by useBounceReveal on the page root).
 * The sub-line and the CTA sit below. The CTA is a spring-press button:
 * press it and it squashes wide-and-short; let go and a critically-
 * underdamped spring snaps it back with a small overshoot — rubber, not a
 * snap.
 *
 * The wordmark keeps an `aria-label` (the full headline) so the per-glyph
 * spans stay silent to assistive tech; under reduced motion the glyphs
 * simply render at rest, no bounce.
 */
export default function Hero() {
  const reduced = usePrefersReducedMotion();
  const ctaRef = useSpringPress<HTMLAnchorElement>(reduced);

  return (
    <header className="bounce-hero" id="bounce-top">
      <p className="bounce-hero__kicker">
        <span lang="ko">꼬마들을 위한 이야기 스튜디오</span>{" "}
        <span className="bounce-hero__kicker-sep" aria-hidden="true">
          ·
        </span>{" "}
        a story studio for small humans
      </p>

      <h1 className="bounce-wordmark">
        <span
          className="bounce-word bounce-word--ko"
          data-bounce-text
          aria-label="통통 튀는 이야기"
        >
          <span lang="ko">통통 튀는 이야기</span>
        </span>
        <span
          className="bounce-word bounce-word--en"
          data-bounce-text
          aria-label="BOUNCE"
        >
          BOUNCE
        </span>
      </h1>

      <p className="bounce-hero__lede">
        <span lang="ko">
          종이 위에서 통통. 화면 위에서도 통통. 우리가 만드는 이야기는 늘
          살짝 튀어오릅니다 — 만지면 눌리고, 놓으면 다시 둥실.
        </span>
        <span className="bounce-hero__lede-en">
          We make picture books, story apps, and tiny games for the
          under-seven crowd — everything we ship has a little boing in it.
        </span>
      </p>

      <div className="bounce-hero__actions">
        <a
          ref={ctaRef}
          className="bounce-btn bounce-btn--spring"
          href="#bounce-books"
        >
          <span lang="ko">이야기 보러가기</span>
          <span className="bounce-btn__sep" aria-hidden="true">
            ·
          </span>
          <span>read a story</span>
        </a>
        <a className="bounce-btn bounce-btn--ghost" href="#bounce-about">
          <span lang="ko">우리 소개</span>
          <span className="bounce-btn__sep" aria-hidden="true">
            ·
          </span>
          <span>about us</span>
        </a>
      </div>

      <p className="bounce-hero__hint" aria-hidden="true">
        <span lang="ko">눌러보세요 →</span>
        <span className="bounce-hero__hint-en">press me →</span>
      </p>
    </header>
  );
}
