"use client";

import { useEffect, useRef } from "react";

/**
 * The lyric ticker. Three marquee bands scroll at crossed speeds and
 * directions: the top band drifts left at resting tempo, the middle band
 * drifts right faster (counterpoint), and the bottom band — the acid one —
 * scrolls left fastest and loudest. Each band's track is duplicated so the
 * `translateX(-50%)` loop is seamless.
 *
 * The marquees are pure CSS (linear transforms on transform-only properties)
 * and self-animate, so there is nothing for a pointer to do — touch-safe by
 * construction. They pause when offscreen (IntersectionObserver toggles an
 * `is-running` class) and stop entirely under reduced motion (the media query
 * cancels the animation, the bands sit static and fully readable).
 *
 * The lyric lines are real bilingual microcopy — fragments of a fictional
 * track — never lorem. Korean is first-class: the middle band leads with
 * Hangul.
 */

type Band = {
  cls: string;
  speed: "l" | "r" | "acid";
  items: { en: string; ko: string }[];
};

const BANDS: Band[] = [
  {
    cls: "typewave-marquee__band--a",
    speed: "l",
    items: [
      { en: "type as the only instrument", ko: "유일한 악기로서의 타이포" },
      { en: "the waveform is a word", ko: "파형은 곧 단어" },
      { en: "stretch until it sings", ko: "노래할 때까지 늘려라" },
      { en: "one accent on pure black", ko: "순흑 위 액센트 하나" },
      { en: "velocity is amplitude", ko: "속도가 진폭이다" },
    ],
  },
  {
    cls: "typewave-marquee__band--b",
    speed: "r",
    items: [
      { en: "every glyph is a sample", ko: "한 글자가 하나의 샘플" },
      { en: "scrub the spectrum", ko: "스펙트럼을 스크럽해라" },
      { en: "narrow to wide, thin to heavy", ko: "좁게에서 넓게, 얇게에서 무겁게" },
      { en: "the page reads like a track", ko: "페이지가 트랙처럼 읽힌다" },
      { en: "hold the letter, hold the note", ko: "글자를 잡아라, 음표를 잡아라" },
    ],
  },
  {
    cls: "typewave-marquee__band--acid",
    speed: "acid",
    items: [
      { en: "TYPEWAVE — 2026", ko: "타입웨이브 — 2026" },
      { en: "acid green at 17.8:1", ko: "산성 초록, 명암비 17.8:1" },
      { en: "variable font wdth 62–125", ko: "가변 폰트 폭 62–125" },
      { en: "scroll is the play head", ko: "스크롤이 재생 머리다" },
    ],
  },
];

export default function MarqueeBands() {
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || !("IntersectionObserver" in window)) return;
    const bands = Array.from(
      root.querySelectorAll<HTMLElement>(".typewave-marquee__band"),
    );
    const io = new IntersectionObserver(
      (hits) => {
        for (const hit of hits) {
          const el = hit.target as HTMLElement;
          el.classList.toggle("is-running", hit.isIntersecting);
        }
      },
      { rootMargin: "60px 0px" },
    );
    for (const b of bands) io.observe(b);
    return () => io.disconnect();
  }, []);

  return (
    <section
      className="typewave-marquee"
      aria-labelledby="typewave-marquee-title"
      ref={rootRef}
    >
      <h2 id="typewave-marquee-title" className="typewave-sr">
        Lyric ticker bands · 가사 티커
      </h2>
      {BANDS.map((band, bi) => (
        <div
          key={band.cls}
          className={`typewave-marquee__band ${band.cls} typewave-mono`}
          aria-hidden="true"
        >
          <div
            className={`typewave-marquee__track typewave-marquee__track--${band.speed}`}
          >
            {/* two copies for a seamless -50% loop */}
            {[0, 1].map((copy) => (
              <ul key={copy} className="typewave-marquee__list">
                {band.items.map((item, i) => (
                  <li key={`${bi}-${copy}-${i}`} className="typewave-marquee__item">
                    <span>{item.en}</span>
                    <span lang="ko">{item.ko}</span>
                    <i className="typewave-marquee__dot" aria-hidden="true" />
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
