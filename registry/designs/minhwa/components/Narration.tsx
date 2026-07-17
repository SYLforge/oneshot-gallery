"use client";

import type { CSSProperties } from "react";

type NarrationProps = {
  /** The full, real string — exposed to AT and find-in-page exactly once. */
  text: string;
  /** BCP-47 language tag for the string (sets the lang on both spans). */
  lang?: string;
  className?: string;
  /** ms between glyphs — the curator's reading pace. */
  step?: number;
  /** ms before the first glyph. */
  start?: number;
};

/**
 * Accessible split text for the gallery's narration lines — the symbolic
 * meaning of each motif, read aloud by an imagined curator.
 *
 * The real string lives in a visually-hidden span (screen readers and
 * find-in-page get it whole, once); the animated copy is aria-hidden, one
 * span per glyph, each carrying its own transition-delay as a custom
 * property. The glyphs' pre-reveal state is gated behind the `.minhwa-js`
 * root class and the panel's `is-visible` class — so without JavaScript, or
 * under reduced motion, the line is simply there, whole.
 *
 * Split with Array.from so Hangul syllables and jamo clusters survive as
 * single code points; spaces become no-break spaces so a glyph never
 * collapses at a line edge.
 */
export default function Narration({
  text,
  lang,
  className,
  step = 42,
  start = 0,
}: NarrationProps) {
  const glyphs = Array.from(text);
  return (
    <span className={`minhwa-narration ${className ?? ""}`} lang={lang}>
      <span className="minhwa-sr">{text}</span>
      <span aria-hidden="true" className="minhwa-narration__row">
        {glyphs.map((g, i) => (
          <span
            key={i}
            className="minhwa-narration__g"
            style={{ "--pn": `${start + i * step}ms` } as CSSProperties}
          >
            {g === " " ? "\u00A0" : g}
          </span>
        ))}
      </span>
    </span>
  );
}
