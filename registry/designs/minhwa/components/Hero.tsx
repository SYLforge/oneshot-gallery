"use client";

import { type CSSProperties } from "react";
import Picture from "./Picture";
import Narration from "./Narration";
import SealMark from "./SealMark";

/**
 * Section 01 — the establishing shot. 호작도 (hojakdo): a tiger under a pine,
 * a magpie chattering above. In minhwa this pairing is a wish — the magpie
 * is 기쁜 소식 (good news arriving) and the tiger is 삿된 것을 물리치는
 * 수호 (protection against ill). The page opens on that wish.
 *
 * The painting is the hero, mounted on aged hanji with a hairline border.
 * The sun and moon discs (the sun-moon longevity image arrives later) are
 * previewed as small obangsaek accents floating in the corner of the hero —
 * a hint that this gallery is structured by the five-color system. They
 * drift on mutually-prime ambient cycles so the picture breathes but never
 * loops.
 *
 * The title 민화 is split per Hangul syllable (aria-label on the h1) — and
 * lands with a spring-press pop, not an ink-settle: minhwa is cheerful.
 * Below it, the hojakdo's meaning is narrated glyph-by-glyph.
 *
 * The painting carries no text by design, so the wordmark and every caption
 * are real HTML/SVG — crisp Hangul at any resolution.
 */
export default function Hero() {
  // Title split per Hangul syllable + Latin letter, accessible (aria-label
  // on the h1); animated copies only. Pre-reveal state is gated behind
  // .minhwa-js in styles.css.
  const KR = ["민", "화"];
  const EN = ["M", "I", "N", "H", "W", "A"];

  return (
    <header
      className="minhwa-hero"
      aria-labelledby="minhwa-hero-title"
      data-reveal="panel"
    >
      {/* The painting, mounted. data-reveal="panel" so it gets is-visible,
          but the art itself is visible from the first paint — only the
          caption narration and the floating accents wait for the panel. */}
      <div className="minhwa-hero__mount" data-reveal="panel">
        <Picture
          className="minhwa-hero__art"
          stem="hero-tiger-magpie"
          width={832}
          height={1216}
          loading="eager"
          decoding="sync"
          alt="호작도 — 소나무 아래 호랑이, 그 위에 까치 한 마리. 민화에서 이 짝은 기쁜 소식과 액막이의 소원을 담는다. / Hojakdo, tiger and magpie: in minhwa this pair carries the wish for good news and for protection."
        />

        {/* The obangsaek sun + moon, floating in the hero's corner — a hint
            that the gallery is structured by the five-color system. Sun =
            황 (hwang, center/soil), Moon = 청 (cheong, east/sky). Decorative;
            aria-hidden; they drift on ambient cycles in styles.css. */}
        <span className="minhwa-hero__sun" aria-hidden="true">
          <span className="minhwa-hero__disc" />
        </span>
        <span className="minhwa-hero__moon" aria-hidden="true">
          <span className="minhwa-hero__disc minhwa-hero__disc--moon" />
        </span>
      </div>

      {/* Title block — Korean first (the wordmark), English subtitle beneath.
          Over the hanji ground where ink-black holds 13.6:1 contrast. */}
      <div className="minhwa-hero__text">
        <p className="minhwa-hero__kicker">
          소원을 그린 그림{" "}
          <span lang="en" className="minhwa-hero__kicker-en">
            a gallery of wishes
          </span>
        </p>

        <h1
          className="minhwa-hero__title"
          id="minhwa-hero-title"
          aria-label="민화 MINHWA"
        >
          <span className="minhwa-hero__title-kr" lang="ko">
            {KR.map((ch, i) => (
              <span
                key={`kr-${i}`}
                aria-hidden="true"
                className="minhwa-hero__glyph minhwa-hero__glyph--stamp"
                style={{ "--pn": `${140 + i * 200}ms` } as CSSProperties}
              >
                {ch}
              </span>
            ))}
          </span>
          <span className="minhwa-hero__title-en" lang="en">
            {EN.map((ch, i) => (
              <span
                key={`en-${i}`}
                aria-hidden="true"
                className="minhwa-hero__glyph"
                style={{ "--pn": `${640 + i * 65}ms` } as CSSProperties}
              >
                {ch}
              </span>
            ))}
          </span>
        </h1>

        <p className="minhwa-hero__lede">
          <Narration
            text="호랑이는 기쁜 소식, 까치는 좋은 낭문."
            lang="ko"
            start={1100}
            step={65}
          />
        </p>
        <p className="minhwa-hero__lede-en" lang="en">
          <span className="minhwa-sr">
            The tiger brings the glad tidings; the magpie, the good letter.
          </span>
          <span aria-hidden="true">
            The tiger brings the glad tidings; the magpie, the good letter.
          </span>
        </p>
      </div>

      {/* A small corner seal on the hero — the painter's first mark. It is
          decorative here (the interactive seal lives in its own section);
          it lands with the hero panel. */}
      <div className="minhwa-hero__seal" aria-hidden="true" data-reveal="stamp">
        <SealMark />
      </div>

      <p className="minhwa-hero__hint" aria-hidden="true">
        아래로 스크롤 · <span lang="en">scroll the wishes</span>
      </p>
    </header>
  );
}
