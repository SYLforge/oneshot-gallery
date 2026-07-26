"use client";

import { type CSSProperties } from "react";
import { useNeonFlicker } from "../hooks/useNeonFlicker";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

/**
 * Chapter 04 — the ASCII neon signboard. The `ascii-render` technique. Three
 * neon signs are rendered as ASCII-art character fields: the glyphs are laid
 * out in a monospace grid (Space Mono) so the density of characters forms a
 * picture — a soju bottle, a fish (오뎅), a bowl rising with steam. Each
 * non-space glyph is its own cell (`.ns-ascii__c`) carrying a neon glow via
 * `text-shadow`; `useNeonFlicker` periodically dims a small random subset of
 * cells so the sign reads as a bank of dying bulbs, not a printed string.
 *
 * Three signs, three neon colors (amber / pink / green), three mutually-prime
 * flicker periods — the buzz of overworked tent bulbs.
 *
 * Under reduced motion the hook never attaches; styles.css holds every sign
 * at full, steady brightness. Without JS the signs are fully lit from the
 * first paint (the `is-dim` class is only ever added by JS, and the pre-state
 * for `[data-reveal]` is gated behind `.ns-js`). The ASCII is also plain text
 * inside a `<pre>`, so it is fully readable and copy-pasteable with JS off.
 *
 * The ASCII strings are written by hand here (in-component) so they ship as
 * real text — no canvas rasterization, no image. Each glyph is wrapped so the
 * flicker hook can address it; spaces become invisible cells so the grid
 * stays intact.
 */

/* The three ASCII signs. Each line is the same width; spaces are part of the
   picture. Hand-tuned to read at a glance at ~10–13px monospace. */
const SIGN_AMBER = [
  "       ___       ",
  "      |   |      ",
  "      |   |      ",
  "      |___|      ",
  "      |   |      ",
  "      |   |      ",
  "     /|   |\\     ",
  "    / |___| \\    ",
  "   /  |   |  \\   ",
  "  /   |   |   \\  ",
  "  ~~~~~~~~~~~~~  ",
  "   HOT  OFF  THE ",
  "     GRILL ·     ",
];

const SIGN_PINK = [
  "     .----.      ",
  "    /      \\     ",
  "   |  ()()  |    ",
  "   |  ()()  |    ",
  "    \\      /     ",
  "     '----'      ",
  "       |         ",
  "       |         ",
  "       |         ",
  "   ~~~~~~~~~~    ",
  "   COLD DRINKS   ",
  "   시원한 음료    ",
];

const SIGN_GREEN = [
  "         w        ",
  "        / \\       ",
  "       /   \\      ",
  "      / o   \\     ",
  "     /       \\    ",
  "    /         \\   ",
  "    \\         /   ",
  "     \\~~~~~~~/    ",
  "      \\~~~~~/     ",
  "       ~~~~~      ",
  "   FRESH ODENG    ",
  "   따끈 오뎅       ",
];

const SIGNS = [
  {
    key: "amber",
    cls: "ns-ascii--amber",
    art: SIGN_AMBER,
    head: { ko: "간판 01 · 불 앞", en: "SIGN 01 — GRILL" },
    caption: {
      ko: "치치칵! 소리와 함께 올라오는 한 꼬치.",
      en: "A skewer straight off the sizzle.",
    },
  },
  {
    key: "pink",
    cls: "ns-ascii--pink",
    art: SIGN_PINK,
    head: { ko: "간판 02 · 차가운 표", en: "SIGN 02 — COLD CASE" },
    caption: {
      ko: "얼음 서리가 앉은 차가운 한 잔.",
      en: "A cold glass, frost still on it.",
    },
  },
  {
    key: "green",
    cls: "ns-ascii--green",
    art: SIGN_GREEN,
    head: { ko: "간판 03 · 김 오르는 가마", en: "SIGN 03 — STEAM POT" },
    caption: {
      ko: "국물이 끓어오르는 따끈한 오뎅.",
      en: "Odeng out of the still-bubbling broth.",
    },
  },
] as const;

/** Split an ASCII string into per-glyph cells so the flicker hook can dim
 *  individual "bulbs". Spaces stay in-grid as invisible cells. */
function cellsFor(line: string) {
  return Array.from(line).map((ch, i) => ({
    key: i,
    char: ch,
    space: ch === " ",
  }));
}

export default function NeonSigns() {
  const reduced = usePrefersReducedMotion();

  return (
    <section
      className="ns-signs"
      aria-labelledby="ns-signs-title"
      data-reveal="panel"
    >
      <div className="ns-signs__intro">
        <p className="ns-eyebrow" data-reveal>
          <span lang="ko">04화 · 네온 간판</span>
          <span>CH. 04 — NEON SIGNS</span>
        </p>
        <h2 className="ns-sechead" id="ns-signs-title" data-reveal>
          <span className="ns-sechead__ko" lang="ko">
            글자로 그린 네온
          </span>
          <span className="ns-sechead__en">Neon, drawn in characters</span>
        </h2>
        <p data-reveal>
          <span lang="ko">
            네온 사인 세 개. 그림이 아니라 글자다 — 모노스페이스 격자에 글자
            밀도로 그린 그림. 한 글자가 한 전구이고, 몇 전구는 품이 다해
            깜빡인다.
          </span>
          Three neon signs — not pictures but text, a picture made of character
          density on a monospace grid. Each glyph is a bulb, and a few bulbs
          flicker because they are tired.
        </p>
      </div>

      <div className="ns-signs__grid">
        {SIGNS.map((sign) => (
          <SignCard key={sign.key} sign={sign} reduced={reduced} />
        ))}
      </div>
    </section>
  );
}

/** One sign card. Splits the art into cells and wires the flicker hook. */
function SignCard({
  sign,
  reduced,
}: {
  sign: (typeof SIGNS)[number];
  reduced: boolean;
}) {
  const ref = useNeonFlicker<HTMLPreElement>(reduced);
  return (
    <article className={`ns-ascii ${sign.cls}`} data-reveal>
      <p className="ns-ascii__head">
        <span lang="ko">{sign.head.ko}</span>
        <span className="ns-mono">· {sign.head.en}</span>
      </p>
      <pre className="ns-ascii__pre" ref={ref} aria-hidden="true">
        {sign.art.map((line, li) => (
          <span key={li} style={{ display: "block" }}>
            {cellsFor(line).map((c) => (
              <span
                key={c.key}
                className={`ns-ascii__c${c.space ? " is-space" : ""}`}
              >
                {c.space ? "\u00A0" : c.char}
              </span>
            ))}
          </span>
        ))}
      </pre>
      <p className="ns-ascii__caption" style={{ "--ns-c": 0 } as CSSProperties}>
        <span lang="ko">{sign.caption.ko}</span>
        <span>{sign.caption.en}</span>
      </p>
    </article>
  );
}
