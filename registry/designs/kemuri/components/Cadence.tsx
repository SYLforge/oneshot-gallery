"use client";

import type { CSSProperties } from "react";

type CadenceProps = {
  text: string;
  lang?: string;
  className?: string;
  /** ms between glyphs — the tick of the incense clock. */
  step?: number;
  /** ms before the first glyph. */
  start?: number;
};

/**
 * Accessible split text. The real string lives in a visually-hidden span
 * (screen readers and find-in-page get it whole, once); the animated copy is
 * aria-hidden, one span per glyph, each carrying its own transition-delay as
 * a custom property. The glyphs' pre-reveal state is gated behind
 * `.kemuri-js` in styles.css, so without JavaScript — or under reduced
 * motion — the text is simply there.
 *
 * Split with Array.from so surrogate pairs survive; spaces become no-break
 * spaces so a glyph never collapses at a line edge. Lines that must wrap
 * should be split per line upstream — the poem and the wordmark both are.
 */
export default function Cadence({
  text,
  lang,
  className,
  step = 55,
  start = 0,
}: CadenceProps) {
  const glyphs = Array.from(text);
  return (
    <span className={`kemuri-cadence ${className ?? ""}`} lang={lang}>
      <span className="kemuri-sr">{text}</span>
      <span aria-hidden="true" className="kemuri-cadence__row">
        {glyphs.map((g, i) => (
          <span
            key={i}
            className="kemuri-cadence__g"
            style={{ "--kd": `${start + i * step}ms` } as CSSProperties}
          >
            {g === " " ? " " : g}
          </span>
        ))}
      </span>
    </span>
  );
}
