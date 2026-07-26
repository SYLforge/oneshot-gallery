import { Cormorant_Garamond, Noto_Serif_KR, Shippori_Mincho } from "next/font/google";

/**
 * The three voices of the chashitsu (tea room):
 *
 * Shippori Mincho — every Japanese glyph on the page: the tategaki ceremony
 *   headers (茶道, 一期一会, 和敬清寂), the scroll text in the tokonoma, the
 *   four-beat breath labels, the bowl's name. Shippori is a mincho whose
 *   vertical metrics were drawn first; it is the face of a poem hung in
 *   an alcove, and it carries vertical-rl text without complaint.
 * Noto Serif KR — the Korean voice. The gallery is bilingual ko/en, so the
 *   main reading lines set in a Korean serif that matches the mincho's
 *   restraint — a brush-remembering serif for Hangul.
 * Cormorant Garamond — the Latin voice: the wordmark, the English
 *   annotations, the colophon, the breath cue's romanized beats. A quiet
 *   noble serif with a long ascender — the register of someone writing a
 *   slow letter from Kyoto, never shouting.
 *
 * styles.css consumes these as var(--font-mincho) / var(--font-kr) /
 * var(--font-cormorant); page.tsx applies the .variable classes on the entry
 * root. The body stack runs Cormorant → Korean → mincho so each script
 * falls through into its own voice; :lang(ja) and :lang(ko) pin their faces
 * and tune tracking.
 */
export const shipporiMincho = Shippori_Mincho({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-mincho",
  display: "swap",
});

export const notoSerifKR = Noto_Serif_KR({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-kr",
  display: "swap",
});

export const cormorantGaramond = Cormorant_Garamond({
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-cormorant",
  display: "swap",
});
