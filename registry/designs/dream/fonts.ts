import { Gowun_Dodum, Noto_Serif_KR, Quicksand } from "next/font/google";

/**
 * The three voices of a drifting-off page:
 *
 * Noto Serif KR — every Hangul glyph that needs weight: the giant 꿈, the
 *   section titles, the bedtime lines. A soft rounded serif, the voice that
 *   reads you to sleep.
 * Gowun Dodum — all other Hangul and the Korean body; round, calm, the
 *   page at rest.
 * Quicksand — every Latin display mark (the DREAM wordmark, numerals,
 *   kickers) and English body. A round geometric sans that never raises its
 *   voice.
 *
 * styles.css consumes these as var(--font-noto-serif) / var(--font-gowun) /
 * var(--font-quicksand); page.tsx applies the .variable classes on the entry
 * root. The display stack is `Noto Serif KR, Quicksand, serif`, so the giant
 * 꿈 renders in the Korean serif and the Latin "DREAM" in Quicksand with no
 * extra markup.
 */
export const notoSerifKR = Noto_Serif_KR({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-noto-serif",
  display: "swap",
});

export const gowunDodum = Gowun_Dodum({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-gowun",
  display: "swap",
});

export const quicksand = Quicksand({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-quicksand",
  display: "swap",
});
