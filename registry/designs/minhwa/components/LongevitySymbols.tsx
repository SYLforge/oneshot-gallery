"use client";

import { type CSSProperties, type Ref } from "react";
import Picture from "./Picture";

type Jangsaeng = {
  id: string;
  kr: string;
  en: string;
  wish: string;
  wishEn: string;
};

/**
 * The ten 십장생 (sipjangsaeng) — ten things in nature believed not to age.
 * Painting them together is the deepest longevity wish a minhwa can make.
 * Listed in the canonical order, each with the wish it carries.
 */
const TEN: Jangsaeng[] = [
  { id: "sun", kr: "해", en: "sun", wish: "영원히 뜨는 빛", wishEn: "a light that never stops rising" },
  { id: "moon", kr: "달", en: "moon", wish: "이지러지지 않는 둥근 마음", wishEn: "a round heart that does not wane" },
  { id: "mountain", kr: "산", en: "mountain", wish: "흔들리지 않는 자리", wishEn: "a place that does not shake" },
  { id: "water", kr: "물", en: "water", wish: "마르지 않는 흐름", wishEn: "a current that does not run dry" },
  { id: "rock", kr: "돌", en: "rock", wish: "까이지 않는 단단함", wishEn: "a hardness that does not wear" },
  { id: "pine", kr: "소나무", en: "pine", wish: "늘 푸른 청춘", wishEn: "an evergreen youth" },
  { id: "herb", kr: "불로초", en: "herb of immortality", wish: "늙지 않는 약", wishEn: "the medicine against age" },
  { id: "crane", kr: "학", en: "crane", wish: "천 살을 사는 날개", wishEn: "a wing that lives a thousand years" },
  { id: "deer", kr: "사슴", en: "deer", wish: "선인의 짐승", wishEn: "the beast of the immortals" },
  { id: "turtle", kr: "거북", en: "turtle", wish: "만 살의 등껍질", wishEn: "a shell of ten thousand years" },
];

/**
 * Section 04 — 십장생, the ten longevity symbols. A scroll-scrubbed PINNED
 * sequence: the outer track is tall, the inner stage is sticky, and as the
 * visitor scrolls the ten symbols advance one position at a time. The
 * sun-moon-longevity painting is the fixed backdrop of the stage; the ten
 * symbols orbit across the foreground, each lighting up in turn.
 *
 * The active symbol, its scale, and the caption crossfade are derived purely
 * from the single `--minhwa-longevity` progress property that
 * useLongevityScrub writes on the stage — via calc()/clamp()/round() in
 * styles.css. transform and opacity only; no per-frame layout.
 *
 * Under reduced motion (or without JS) the section falls open: every symbol
 * is visible in a composed grid over the painting, and the useReveal hook
 * adds `is-visible` so nothing is stuck in a pre-state. The page is a
 * finished scroll either way.
 */
export default function LongevitySymbols({
  reduced,
  ref,
}: {
  reduced: boolean;
  ref?: Ref<HTMLElement>;
}) {
  // Each symbol's "slot" position in the orbit, advanced by --minhwa-longevity.
  // The active index is round(p * 9); styles.css owns the visual, the data
  // just needs the right --i and a stable key.
  return (
    <section
      className="minhwa-long"
      aria-labelledby="minhwa-long-title"
      data-minhwa-reduced={reduced || undefined}
      ref={ref}
    >
      <div className="minhwa-sechead minhwa-long__head" data-reveal>
        <span className="minhwa-sechead__no" lang="en" aria-hidden="true">
          04
        </span>
        <h2 className="minhwa-sechead__title" id="minhwa-long-title">
          십장생{" "}
          <span className="minhwa-sechead__en" lang="en">
            ten things that do not age
          </span>
        </h2>
      </div>

      {/* The pinned stage — sticky inside the tall track. The painting is
          the fixed ground; the ten symbols drift over it. */}
      <div className="minhwa-long__stage" data-reveal="panel">
        <div className="minhwa-long__backdrop">
          <Picture
            className="minhwa-long__art"
            stem="sun-moon-longevity"
            width={1024}
            height={768}
            alt="해와 달, 산과 물, 소나무와 학, 사슴과 거북 — 십장생 열 가지가 한 폭에 어우러진 민화. / Sun and moon, mountain and water, pine and crane, deer and turtle — the ten longevity symbols gathered in one minhwa."
          />
          <div className="minhwa-long__scrim" aria-hidden="true" />
        </div>

        {/* The ten symbols as an orbiting strip. Each carries its index so
            styles.css can light up the one round(p*9) selects. Under
            reduced motion the .minhwa-long--reduced ground (set on the
            section by [data-minhwa-reduced]) lays them out as a plain grid. */}
        <ol className="minhwa-long__orbit" aria-label="십장생 열 가지 / the ten longevity symbols">
          {TEN.map((s, i) => (
            <li
              key={s.id}
              className="minhwa-long__sym"
              style={{ "--i": `${i}` } as CSSProperties}
            >
              <span className="minhwa-long__sym-glyph" lang="ko">
                {s.kr}
              </span>
              <span className="minhwa-long__sym-en" lang="en">
                {s.en}
              </span>
            </li>
          ))}
        </ol>

        {/* The captions crossfade by the same progress: the active symbol's
            wish shows; the rest are present in the DOM for no-JS reading. */}
        <div className="minhwa-long__wishes">
          {TEN.map((s, i) => (
            <p
              key={s.id}
              className="minhwa-long__wish"
              style={{ "--i": `${i}` } as CSSProperties}
            >
              <span className="minhwa-long__wish-kr" lang="ko">
                {s.kr} — {s.wish}
              </span>
              <span className="minhwa-long__wish-en" lang="en">
                {s.en} — {s.wishEn}
              </span>
            </p>
          ))}
        </div>

        {/* Progress rail — a reading-aid that fills with --minhwa-longevity.
            Decorative; the legend above carries the meaning accessibly. */}
        <div
          className="minhwa-long__rail"
          aria-hidden="true"
          data-reveal="panel"
        >
          <span className="minhwa-long__rail-fill" />
          <span className="minhwa-long__rail-label" lang="ko">
            스크롤하면 열 가지가 차례로 {" "}
            <span lang="en">scroll to walk the ten</span>
          </span>
        </div>
      </div>
    </section>
  );
}
