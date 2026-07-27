"use client";

import { useMarquee } from "../hooks/useMarquee";

type Credit = [ko: string, en: string];

const CREDITS: Credit[] = [
  ["독립 인쇄", "INDEPENDENTLY PRINTED"],
  ["두 도수", "TWO-COLOR"],
  ["천 부 한정", "1,000 COPIES LIMITED"],
  ["사과 없음", "NO APOLOGIES"],
  ["콩기름 잡크", "SOY INK RISO"],
  ["스테이플러 제본", "STAPLE-BOUND"],
  ["핀 나가도 멋", "MISREGISTER IS A FEATURE"],
];

/**
 * The scrolling masthead band — a single ticker that runs the zine's
 * production credits in Korean + English, separated by an ink star. It
 * reverses with scroll direction and accelerates with scroll velocity
 * (the marquee technique). The moving track is aria-hidden; the credits
 * are delivered once in a visually-hidden paragraph before it.
 *
 * Under reduced motion the band holds still; without JS it is a static
 * overflow row — the credits are readable in the hidden paragraph either way.
 */
export default function MarqueeBand() {
  const { bandRef, trackRef, groupRef } = useMarquee();

  return (
    <div className="zine-marquee" ref={bandRef}>
      <p className="zine-vh">
        {CREDITS.map(([ko, en]) => `${ko} ${en}`).join(" · ")}
      </p>
      <div className="zine-marquee__row" aria-hidden="true">
        <div className="zine-marquee__track" ref={trackRef}>
          {[0, 1, 2, 3].map((n) => (
            <span
              key={n}
              className="zine-marquee__group"
              ref={n === 0 ? groupRef : undefined}
            >
              {CREDITS.map(([ko, en], i) => (
                <span key={i} className="zine-marquee__item">
                  <span lang="ko">{ko}</span>
                  <span className="zine-marquee__sep">★</span>
                  <span className="zine-marquee__en">{en}</span>
                  <span className="zine-marquee__sep">✦</span>
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
