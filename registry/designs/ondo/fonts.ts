import { Italiana, Noto_Serif_KR } from "next/font/google";

/**
 * The two voices of the house:
 * Italiana — the Latin hairline display serif; the wordmark, the degree
 * numerals, the section titles. It has exactly one weight, which is the point.
 * Noto Serif KR — every Hangul glyph and all body text; the quieter,
 * warmer voice that actually says things.
 *
 * styles.css consumes these as var(--font-italiana) / var(--font-noto-serif-kr);
 * page.tsx applies the .variable classes on the entry root.
 */
export const italiana = Italiana({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-italiana",
  display: "swap",
});

export const notoSerifKr = Noto_Serif_KR({
  weight: ["200", "300", "400"],
  subsets: ["latin"],
  variable: "--font-noto-serif-kr",
  display: "swap",
});
