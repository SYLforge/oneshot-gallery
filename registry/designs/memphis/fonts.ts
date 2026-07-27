import { Space_Grotesk, Black_Han_Sans } from "next/font/google";

/**
 * The two geometric voices of MEMPHIS:
 * Space Grotesk — every Latin glyph on the page; a geometric sans with a
 *   structural, slightly engineered feel (the studio drafts by hand and by
 *   machine in the same hand). Carries display, body, and labels through its
 *   weight range.
 * Black Han Sans — every Hangul glyph; a heavy geometric Korean face whose
 *   blocky letterforms read like cut paper, never a system fallback. The
 *   studio's Korean voice is as loud and geometric as its Latin one.
 *
 * styles.css consumes these as var(--font-grotesk) / var(--font-han); page.tsx
 * applies the .variable classes on the entry root. The display stack is
 * `Space Grotesk, Black Han Sans, sans-serif`, so a Korean glyph inside a
 * Latin headline falls through into Black Han Sans with no extra markup, and
 * `:lang(ko)` additionally pins it and tunes tracking for hangul.
 */
export const spaceGrotesk = Space_Grotesk({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-grotesk",
  display: "swap",
});

export const blackHanSans = Black_Han_Sans({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-han",
  display: "swap",
});
