"use client";

import type { CSSProperties } from "react";

type CadenceProps = {
  text: string;
  lang?: string;
  className?: string;
  /** ms between glyphs — the tick of a brush, not a cursor. */
  step?: number;
  /** ms before the first glyph. */
  start?: number;
};

/**
 * Accessible split text. The real string lives in a visually-hidden span
 * (screen readers and find-in-page get it whole, once); the animated copy is
 * aria-hidden, one span per glyph, each carrying its own transition-delay as
 * a custom property. The glyphs' pre-reveal state is gated behind `.shan-js`
 * in styles.css, so without JavaScript — or under reduced motion — the text
 * is simply there.
 *
 * Split with Array.from so CJK / surrogate pairs survive; spaces become
 * no-break spaces so a glyph never collapses at a line edge.
 */
export default function Cadence({
  text,
  lang,
  className,
  step = 80,
  start = 0,
}: CadenceProps) {
  const glyphs = Array.from(text);
  return (
    <span className={`shan-cadence ${className ?? ""}`} lang={lang}>
      <span className="shan-sr">{text}</span>
      <span aria-hidden="true" className="shan-cadence__row">
        {glyphs.map((g, i) => (
          <span
            key={i}
            className="shan-cadence__g"
            style={{ "--kd": `${start + i * step}ms` } as CSSProperties}
          >
            {g === " " ? "\u00A0" : g}
          </span>
        ))}
      </span>
    </span>
  );
}
