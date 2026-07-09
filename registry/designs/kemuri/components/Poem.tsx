"use client";

import type { CSSProperties } from "react";
import Cadence from "./Cadence";

/** The poem, one column per line. vertical-rl reads them right to left,
 *  so DOM order is reading order. */
const JP_LINES = [
  "香を一本、立てる。",
  "煙がほどけて、のぼる。",
  "時間は灰になって、落ちる。",
  "坐って、それを見ている。",
  "それだけの一時間。",
];

const EN_LINES = [
  "Light one stick of incense.",
  "The smoke unties itself, and rises.",
  "The hour becomes ash, and falls.",
  "Sit. Watch only this.",
  "That is the whole hour.",
];

/** ms between columns; glyphs inside a column tick every 60ms. */
const LINE_STAGGER = 620;

/**
 * Section 02 — the poem. The Japanese stands in vertical-rl, Zen Old
 * Mincho, and appears glyph by glyph at the pace of an incense clock; the
 * English sits beside it in Garamond italic, arriving line by line, half a
 * breath behind. The wrapper is data-reveal="scene": the container itself
 * never animates, it only hands `is-visible` to the choreography inside.
 * A ruby-red seal — 静, stillness — is pressed at the poem's foot, tilted
 * the way a real hand tilts a stamp.
 */
export default function Poem() {
  return (
    <section className="kemuri-poem" aria-labelledby="kemuri-poem-title">
      <div className="kemuri-sechead" data-reveal="">
        <p className="kemuri-eyebrow" aria-hidden="true">
          02 — 香時計
        </p>
        <h2 className="kemuri-sechead__title" id="kemuri-poem-title">
          The incense clock{" "}
          <span lang="ja" className="kemuri-sechead__ja">
            香時計
          </span>
        </h2>
        <p className="kemuri-sechead__line">
          Before clocks had hands, temples measured the afternoon in smoke.
          One stick, one hour. We still do.{" "}
          <span lang="ja" className="kemuri-sechead__lineja">
            時計に針が生まれる前、寺は午後を煙で計った。一本で、一時間。
            私たちは今もそうしている。
          </span>
        </p>
      </div>

      <div className="kemuri-poem__stage" data-reveal="scene">
        <div className="kemuri-poem__en" lang="en">
          {EN_LINES.map((line, i) => (
            <p
              key={line}
              className="kemuri-poem__enline"
              style={{ "--kd": `${300 + i * LINE_STAGGER}ms` } as CSSProperties}
            >
              {line}
            </p>
          ))}
        </div>

        <div
          className="kemuri-poem__jp"
          role="group"
          aria-label="同じ詩の日本語原文、縦書き。 The same poem in Japanese, set vertically."
        >
          {JP_LINES.map((line, i) => (
            <div key={line} className="kemuri-poem__jpline">
              <Cadence
                text={line}
                lang="ja"
                step={60}
                start={i * LINE_STAGGER}
              />
            </div>
          ))}
        </div>

        {/* the seal — 静, stillness — pressed slightly off-true */}
        <svg
          className="kemuri-poem__seal"
          viewBox="0 0 72 72"
          width={72}
          height={72}
          aria-hidden="true"
          focusable="false"
        >
          <rect x="4" y="4" width="64" height="64" rx="3" fill="#c96f2e" />
          <rect
            x="9.5"
            y="9.5"
            width="53"
            height="53"
            rx="1.5"
            fill="none"
            stroke="#efe7d8"
            strokeOpacity="0.5"
            strokeWidth="1"
          />
          <text
            className="kemuri-sealglyph"
            x="36"
            y="50"
            textAnchor="middle"
            fontSize="34"
            fill="#efe7d8"
          >
            静
          </text>
        </svg>
      </div>
    </section>
  );
}
