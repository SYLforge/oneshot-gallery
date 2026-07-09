import { EB_Garamond, Zen_Old_Mincho } from "next/font/google";

/**
 * The two voices of the atelier:
 * EB Garamond — the Latin voice; the wordmark, the hours, the English koans.
 *   400 for prose, 500 for the few display moments, italic for translation —
 *   the register of someone writing slowly with a good pen.
 * Zen Old Mincho — every Japanese glyph on the page: the vertical poem, the
 *   blend names, the sign-off. An old-style mincho whose strokes still
 *   remember the brush, which is the entire premise.
 *
 * styles.css consumes these as var(--font-garamond) / var(--font-mincho);
 * page.tsx applies the .variable classes on the entry root. The family stack
 * runs Garamond first, so kanji and kana fall through it into the mincho
 * with no extra markup.
 */
export const ebGaramond = EB_Garamond({
  weight: ["400", "500"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-garamond",
  display: "swap",
});

export const zenOldMincho = Zen_Old_Mincho({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-mincho",
  display: "swap",
});
