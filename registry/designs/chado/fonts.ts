import { Cormorant_Garamond, Shippori_Mincho } from "next/font/google";

/**
 * The two voices of the chashitsu (tea room):
 *
 * Shippori Mincho — every CJK glyph on the page: the tategaki ceremony
 *   headers (茶道, 一期一会, 和敬清寂), the scroll text in the tokonoma, the
 *   four-beat breath labels, the bowl's name. Shippori is a mincho whose
 *   vertical metrics were drawn first; it is the face of a poem hung in
 *   an alcove, and it carries vertical-rl text without complaint. It
 *   also covers the Latin fallback, so the page never breaks if a glyph
 *   arrives without a lang hint.
 * Cormorant Garamond — the Latin voice: the wordmark, the English
 *   annotations, the colophon, the breath cue's romanized beats. A quiet
 *   noble serif with a long ascender — the register of someone writing a
 *   slow letter from Kyoto, never shouting.
 *
 * styles.css consumes these as var(--font-mincho) / var(--font-cormorant);
 * page.tsx applies the .variable classes on the entry root. The body stack
 * runs Cormorant first so CJK glyphs fall through it into Shippori with no
 * extra markup; :lang(ja) additionally pins Shippori and tightens tracking.
 */
export const shipporiMincho = Shippori_Mincho({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-mincho",
  display: "swap",
});

export const cormorantGaramond = Cormorant_Garamond({
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-cormorant",
  display: "swap",
});
