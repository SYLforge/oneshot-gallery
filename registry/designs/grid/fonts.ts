import { Inter, Noto_Sans_KR, JetBrains_Mono } from "next/font/google";

/**
 * The three instruments of the atelier — all sans, by discipline.
 *
 * Inter — the drawing hand. A neo-grotesque whose thin weights (200/300)
 *   are the entry's entire expressive budget: hairline numerals,
 *   architectural labels, body. Where RASTER spends expression on
 *   Archivo's width axis, GRID spends it on weight — thin, thinner,
 *   and a single display weight.
 * Noto Sans KR — every Hangul glyph, at the same thin weights. Korean is
 *   first-class copywriting, never a fallback; it is set in the same
 *   hairline register so a bilingual plate reads as one drawing.
 * JetBrains Mono — the architect's pencil: plate numbers, coordinates,
 *   dimensions, the running title block. Tabular figures so every
 *   measurement on a plate aligns.
 *
 * styles.css consumes these as var(--grid-sans) / var(--grid-kr) /
 * var(--grid-mono); page.tsx applies the .variable classes on the entry
 * root. Both Latin stacks put Noto Sans KR last so Hangul routes into it
 * with no markup; :lang(ko) additionally pins the family.
 */
export const inter = Inter({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500"],
  variable: "--grid-sans",
  display: "swap",
});

export const notoSansKR = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--grid-kr",
  display: "swap",
});

export const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--grid-mono",
  display: "swap",
});
