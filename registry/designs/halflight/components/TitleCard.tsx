"use client";

const TITLE = "HALFLIGHT";

/**
 * Reel 01 — the title card. A black cinema stage under letterbox bars: the
 * kicker, the name in condensed capitals, and a screenplay slug line. The
 * title is a character-split reveal (aria-label carries the word; the
 * animated glyphs are aria-hidden) and the whole word sits on a gate-weave
 * wrapper — a stepped micro-jitter, like film held loosely in a projector
 * gate. Both die under prefers-reduced-motion; without JS nothing was ever
 * hidden, because every animation is gated behind `.halflight-js`.
 */
export default function TitleCard() {
  return (
    <header className="halflight-hero" aria-labelledby="halflight-title">
      <div
        className="halflight-hero__bar halflight-hero__bar--top"
        aria-hidden="true"
      />

      <div className="halflight-hero__frame">
        <p className="halflight-hero__kicker halflight-mono">
          ORIGINAL SCORES FOR IMAGINARY FILMS ·{" "}
          <span lang="ko">존재하지 않는 영화의 음악</span>
        </p>

        <h1 className="halflight-title" id="halflight-title" aria-label={TITLE}>
          <span className="halflight-title__weave" aria-hidden="true">
            {TITLE.split("").map((ch, i) => (
              <span
                key={`${ch}-${i}`}
                className="halflight-title__ch"
                style={{ animationDelay: `${220 + i * 55}ms` }}
              >
                {ch}
              </span>
            ))}
          </span>
        </h1>

        <p className="halflight-hero__slug halflight-mono">
          INT. MEMORY — NIGHT. <span lang="ko">내부. 기억 — 밤.</span>
        </p>

        <p className="halflight-hero__lede">
          The films do not exist. The music remembers them anyway.{" "}
          <span lang="ko">영화는 없다. 음악은 그래도 기억한다.</span>
        </p>

        <p className="halflight-hero__hint halflight-mono">
          REEL 02 FOLLOWS — SCROLL <span lang="ko">릴 02 — 스크롤</span>
        </p>
      </div>

      {/* Reel-change cue mark: the one red thing on an all-gray screen. */}
      <span className="halflight-cuedot" aria-hidden="true" />

      {/* Film grain over the stage — decorative, stepped, killed by
          prefers-reduced-motion. */}
      <div className="halflight-grain" aria-hidden="true" />

      <div
        className="halflight-hero__bar halflight-hero__bar--bottom"
        aria-hidden="true"
      />
    </header>
  );
}
