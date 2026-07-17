"use client";

import { useMemo } from "react";

export type CharToken = {
  /** the visible glyph (a single char, or whitespace collapsed to a space) */
  ch: string;
  /** true for non-space glyphs — only these get the per-glyph animation */
  glyph: boolean;
  /** stable key */
  key: string;
};

/**
 * Splits a string into per-glyph tokens for the character-split reveal
 * (technique tag `char-split-reveal`). Whitespace is preserved as a single
 * space token (no animation) so words keep their internal rhythm; every
 * other char becomes a glyph token.
 *
 * Accessibility contract (held by the caller):
 *   - the container carries the full text in `aria-label`,
 *   - the rendered spans are `aria-hidden="true"`,
 *   so a screen reader announces the string once, intact, while sighted
 *   visitors see each glyph settle into place. This hook only produces the
 *   token array; it does not render.
 */
export function useCharSplit(text: string): CharToken[] {
  return useMemo(() => {
    const out: CharToken[] = [];
    let i = 0;
    for (const ch of Array.from(text)) {
      // Array.from splits on code points — safe for Hangul syllables and
      // combining marks; a Hangul jamo cluster is rare in copy and the
      // fallback (whole syllable as one glyph) is the right granularity.
      if (/\s/.test(ch)) {
        out.push({ ch: " ", glyph: false, key: `s${i}` });
      } else {
        out.push({ ch, glyph: true, key: `g${i}` });
      }
      i += 1;
    }
    return out;
  }, [text]);
}
