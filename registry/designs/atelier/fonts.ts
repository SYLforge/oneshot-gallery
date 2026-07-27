import { Bodoni_Moda, Noto_Serif_KR } from "next/font/google";

/**
 * The two voices of the maison:
 * Bodoni Moda — the Latin Didone display serif. The cover masthead, the look
 * numbers, the section titles, the editorial pull quotes. It carries the
 * signature hairline thins and sudden swells of a Vogue cover, set in the
 * 700/900 display optical sizes and an italic for the editor's letter.
 * Noto Serif KR — every Hangul glyph and all body text; the quieter, warmer
 * voice that actually reports the season. Set in 300/400 so hangul sits at
 * the same optical weight as Bodoni's display setting.
 *
 * styles.css consumes these as var(--font-bodoni) / var(--font-noto-serif-kr);
 * page.tsx applies the .variable classes on the entry root.
 *
 * Korean is first-class: display stacks place Noto Serif KR after Bodoni so
 * any hangul inside a display heading falls through to it, and `:lang(ko)`
 * additionally pins the family and softens the tracking.
 */
export const bodoni = Bodoni_Moda({
  weight: ["400", "500", "700", "900"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-bodoni",
  display: "swap",
});

export const notoSerifKr = Noto_Serif_KR({
  weight: ["200", "300", "400"],
  subsets: ["latin"],
  variable: "--font-noto-serif-kr",
  display: "swap",
});
