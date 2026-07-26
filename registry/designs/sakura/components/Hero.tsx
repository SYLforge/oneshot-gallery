"use client";

import type { CSSProperties } from "react";
import BloomCanvas from "./BloomCanvas";

const LETTERS = ["S", "A", "K", "U", "R", "A"];

/**
 * The arrival. A full viewport of deep ink night; behind the title, the
 * bloom canvas is already running — ink drops falling, striking the
 * waterline, blooming into petals that drift across the wordmark. The title
 * is layered:
 *   - 桜花 (vertical, tategaki, Shippori Mincho) — the decorative source
 *     glyph, set in writing-mode: vertical-rl to the right of the wordmark.
 *   - 벚꽃 (Noto Serif KR) — the Korean main voice, the headline that speaks.
 *   - SAKURA (Cormorant Garamond) — the Latin subtitle, split per letter
 *     (aria-hidden glyphs behind the h1's aria-label) resolving on the
 *     bloom cadence once mounted.
 *
 * Everything is legible with JavaScript off: the pre-reveal state only
 * exists under `.sakura-js`. Click/tap anywhere on the hero to drop fresh
 * ink that blooms — the signature interaction.
 *
 * Layering, bottom to top: bloom canvas (0) — text (1).
 */
export default function Hero() {
  return (
    <header className="sakura-hero" aria-labelledby="sakura-title">
      <BloomCanvas
        className="sakura-hero__bloom"
        ariaLabel="검은 먹방울이 밤하늘에서 떨어져 수면에 닿아, 벚꽃잎으로 피어나는 장면. Black ink drops fall from a night sky, strike an unseen waterline, and bloom into drifting cherry petals."
      />

      <div className="sakura-hero__inner">
        <p className="sakura-hero__kicker">
          <span lang="ko">잉크와 개화</span>{" "}
          <span lang="ja" className="sakura-hero__kickerja">
            墨と花咲
          </span>
          <span lang="en" className="sakura-hero__kickeren">
            {" "}· ink &amp; bloom
          </span>
        </p>

        <div className="sakura-hero__titlewrap">
          {/* The decorative source glyph — Japanese, vertical (tategaki). */}
          <p
            className="sakura-hero__kanji"
            lang="ja"
            aria-hidden="true"
          >
            桜花
          </p>

          {/* The wordmark — Latin subtitle, split per letter. */}
          <h1
            className="sakura-hero__title"
            id="sakura-title"
            aria-label="SAKURA"
          >
            {LETTERS.map((ch, i) => (
              <span
                key={`${ch}-${i}`}
                aria-hidden="true"
                className="sakura-hero__glyph"
                style={{ "--kd": `${200 + i * 95}ms` } as CSSProperties}
              >
                {ch}
              </span>
            ))}
          </h1>
        </div>

        {/* The Korean main voice — the headline that actually speaks. */}
        <p className="sakura-hero__ko" lang="ko">
          벚꽃
        </p>

        <div className="sakura-hero__rule" aria-hidden="true" />

        <p className="sakura-hero__sub">
          <span lang="ko">먹이 지고, 꽃이 피어난다</span>
          <span lang="en" className="sakura-hero__suben">
            {" "}— ink falls, the blossom opens
          </span>
        </p>

        <p className="sakura-hero__est">
          <span lang="ko">생성적 잉크 정원 · 2026</span>{" "}
          <span lang="en">a generative ink garden</span>{" "}
          <span lang="ja">墨の庭 · 春</span>
        </p>
      </div>

      <p className="sakura-hero__hint" aria-hidden="true">
        <span lang="ko">화면을 두드리면 잉크가 피어납니다</span>{" "}
        <span lang="ja">画面を叩くと墨が咲く</span>
        <span lang="en"> — tap to bloom ink</span>
      </p>
    </header>
  );
}
