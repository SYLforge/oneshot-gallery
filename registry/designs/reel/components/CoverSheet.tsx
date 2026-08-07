"use client";

const TITLE = "REEL";

/**
 * Frame 01 — the cover sheet. The whole strip is laid on stock-black with a
 * warm light leak sweeping diagonally across it. The studio name sits as a
 * film-credit serif (Playfair Display), an accessible character-split reveal
 * (aria-label carries the word; the animated glyphs are aria-hidden). A
 * faded-red secondary leak breathes on the cover only. Both the leak sweep
 * and the character rise die under prefers-reduced-motion; without JS nothing
 * was ever hidden, because every animation is gated behind `.reel-js`.
 *
 * This is deliberately NOT a letterboxed cinema stage (that is HALFLIGHT's
 * grammar). This is the warm paper of a contact sheet under a safelight,
 * with light leaks, not projection darkness.
 */
export default function CoverSheet() {
  return (
    <header className="reel-cover" aria-labelledby="reel-title">
      <div className="reel-cover__leak reel-cover__leak--sweep" aria-hidden="true" />
      <div className="reel-cover__leak reel-cover__leak--breath" aria-hidden="true" />
      <div className="reel-cover__halation" aria-hidden="true" />

      <div className="reel-cover__inner">
        <p className="reel-cover__kicker reel-mono">
          KODAK PORTRA 400 · ROLL 31 ·{" "}
          <span lang="ko">코닥 포르트라 400 · 31번 롤</span>
        </p>

        <h1 className="reel-cover__title" id="reel-title" aria-label={TITLE}>
          <span className="reel-cover__title-inner" aria-hidden="true">
            {TITLE.split("").map((ch, i) => (
              <span
                key={`${ch}-${i}`}
                className="reel-cover__ch"
                style={{ animationDelay: `${240 + i * 60}ms` }}
              >
                {ch}
              </span>
            ))}
          </span>
        </h1>

        <p className="reel-cover__sub">
          Wedding &amp; film photography, the long way round.{" "}
          <span lang="ko">웨딩과 필름 사진, 돌아가는 길로.</span>
        </p>

        <p className="reel-cover__lede">
          Shot on 35mm and 120, developed by hand in a kitchen that smells of
          fixer. Every frame here is a gradient drawn in code &mdash; this
          page is a portfolio that refuses to ship a single photograph.
          <span lang="ko">
            {" "}
            35mm와 120 포맷으로 찍고, 정착액 냄새가 배어든 부엌에서 손으로
            현상한다. 이 페이지의 모든 프레임은 코드로 그린 그라디언트다 —
            사진 한 장도 싣지 않는 포트폴리오.
          </span>
        </p>

        <p className="reel-cover__hint reel-mono">
          FRAME 02 FOLLOWS &mdash; SCROLL{" "}
          <span lang="ko">프레임 02 — 스크롤</span>
        </p>
      </div>

      {/* Film grain over the whole cover — decorative, stepped, killed by
          prefers-reduced-motion. */}
      <div className="reel-grain" aria-hidden="true" />
    </header>
  );
}
