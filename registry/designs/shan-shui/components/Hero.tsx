"use client";

import type { CSSProperties } from "react";
import Cadence from "./Cadence";
import LandscapeCanvas from "./LandscapeCanvas";
import type { ScrollSample } from "../hooks/useScrollProgress";

const LETTERS = ["S", "H", "A", "N", "·", "S", "H", "U", "I"];

/**
 * The hero: one viewport of xuan paper, the live landscape painting itself
 * behind everything, and the bilingual wordmark 山水 / SHAN-SHUI settling in
 * over the mountains once the loader lifts. The title is split per letter
 * (aria-hidden glyphs behind the h1's aria-label) and resolves on a brush
 * cadence when `entered` arrives.
 *
 * Layering, bottom to top: landscape canvas (0) — text (1). The mountains
 * stand behind the wordmark the way real mountains stand behind a colophon.
 */
export default function Hero({
  entered,
  scrollRef,
}: {
  entered: boolean;
  scrollRef: React.RefObject<ScrollSample | null>;
}) {
  return (
    <header
      className={`shan-hero ${entered ? "is-entered" : ""}`}
      aria-labelledby="shan-title"
    >
      <LandscapeCanvas scrollRef={scrollRef} />

      <div className="shan-hero__inner">
        <p className="shan-hero__kicker">
          a painted hand-scroll{" "}
          <span lang="zh" className="shan-hero__kickerzh">
            水墨手卷
          </span>
        </p>

        <h1 className="shan-hero__title" id="shan-title" aria-label="SHAN-SHUI">
          {LETTERS.map((ch, i) => (
            <span
              key={`${ch}-${i}`}
              aria-hidden="true"
              className="shan-hero__glyph"
              style={{ "--kd": `${200 + i * 95}ms` } as CSSProperties}
            >
              {ch}
            </span>
          ))}
        </h1>

        <p className="shan-hero__sub">
          <Cadence text="山水 · 山與水" lang="zh" step={110} start={950} />
        </p>

        <div className="shan-hero__rule" aria-hidden="true" />

        <p className="shan-hero__line">
          The mountains paint themselves. The scroll is the unrolling.{" "}
          <span lang="zh" className="shan-hero__linezh">
            山自生，卷自展。
          </span>
        </p>

        <p className="shan-hero__est">
          an ink landscape, drawn live · est. from noise{" "}
          <span lang="zh">水墨生成 · 以噪為骨</span>
        </p>
      </div>

      <p className="shan-hero__hint" aria-hidden="true">
        <span lang="zh">下展</span> the scroll opens below
      </p>
    </header>
  );
}
