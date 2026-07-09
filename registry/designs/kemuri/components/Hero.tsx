"use client";

import type { CSSProperties } from "react";
import Cadence from "./Cadence";
import SmokeCanvas from "./SmokeCanvas";

const LETTERS = ["K", "E", "M", "U", "R", "I"];

/**
 * The hero: one viewport of washi, a censer at the bottom hem, and the
 * smoke rising through the wordmark. The title is split per letter
 * (aria-hidden glyphs behind the h1's aria-label) and resolves on the
 * incense clock's cadence once the loader lifts — `entered` arrives as a
 * prop and becomes the `is-entered` class, which styles.css uses as the
 * cadence trigger. Everything here is legible with JavaScript off: the
 * pre-reveal state only exists under `.kemuri-js`.
 *
 * Layering, bottom to top: censer SVG (0) — text (1) — smoke canvas (2).
 * The smoke passes in front of the letters; that is the screenshot.
 */
export default function Hero({ entered }: { entered: boolean }) {
  return (
    <header
      className={`kemuri-hero ${entered ? "is-entered" : ""}`}
      aria-labelledby="kemuri-title"
    >
      <div className="kemuri-hero__inner">
        <p className="kemuri-hero__kicker">
          An hour of stillness{" "}
          <span lang="ja" className="kemuri-hero__kickerja">
            静けさを、一時間
          </span>
        </p>

        <h1 className="kemuri-hero__title" id="kemuri-title" aria-label="KEMURI">
          {LETTERS.map((ch, i) => (
            <span
              key={`${ch}-${i}`}
              aria-hidden="true"
              className="kemuri-hero__glyph"
              style={{ "--kd": `${180 + i * 110}ms` } as CSSProperties}
            >
              {ch}
            </span>
          ))}
        </h1>

        <p className="kemuri-hero__sub">
          <Cadence text="煙 · 香の間" lang="ja" step={90} start={900} />
        </p>

        <div className="kemuri-hero__rule" aria-hidden="true" />

        <p className="kemuri-hero__line">
          The smoke does not hurry. Neither should you.{" "}
          <span lang="ja" className="kemuri-hero__lineja">
            煙は急がない。あなたも。
          </span>
        </p>

        <p className="kemuri-hero__est">
          Incense atelier — Kyoto, est.&nbsp;1927{" "}
          <span lang="ja">京都・香房 · 昭和二年創業</span>
        </p>
      </div>

      {/* The censer. Its stick tip must stay at (86,26)/160×120, bottom 44px,
          centered — SmokeCanvas spawns the plume from exactly there. */}
      <svg
        className="kemuri-censer"
        viewBox="0 0 160 120"
        width={160}
        height={120}
        aria-hidden="true"
        focusable="false"
      >
        {/* bowl */}
        <path
          d="M42 62 C42 84 58 94 80 94 C102 94 118 84 118 62 Z"
          fill="#1c1814"
          fillOpacity="0.9"
        />
        <ellipse
          cx="80"
          cy="62"
          rx="38"
          ry="7"
          fill="#1c1814"
          fillOpacity="0.9"
        />
        <ellipse cx="80" cy="61" rx="32" ry="5" fill="#e3d7c0" />
        {/* gold rim — a hairline of lamplight on the lip */}
        <path
          d="M44 60 C50 56 66 54 80 54 C94 54 110 56 116 60"
          fill="none"
          stroke="#b08d4a"
          strokeOpacity="0.8"
          strokeWidth="1.4"
        />
        {/* legs */}
        <path d="M56 92 L52 108" stroke="#1c1814" strokeWidth="4" strokeLinecap="round" />
        <path d="M80 95 L80 111" stroke="#1c1814" strokeWidth="4" strokeLinecap="round" />
        <path d="M104 92 L108 108" stroke="#1c1814" strokeWidth="4" strokeLinecap="round" />
        {/* the mound of ash, and hours already burned */}
        <ellipse cx="80" cy="60" rx="17" ry="3.4" fill="#8a8178" fillOpacity="0.55" />
        {/* one stick, leaning the way the morning leans */}
        <path
          d="M80 60 L86 26"
          stroke="#1c1814"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        {/* the ember — CSS breathes it; reduced motion holds it lit */}
        <circle className="kemuri-censer__ember" cx="86" cy="26" r="2.3" fill="#c96f2e" />
      </svg>

      <p className="kemuri-hero__hint" aria-hidden="true">
        <span lang="ja">下へ</span> the hour begins below
      </p>

      <SmokeCanvas />
    </header>
  );
}
