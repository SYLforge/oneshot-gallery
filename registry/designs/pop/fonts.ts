import { Fredoka, Gaegu } from "next/font/google";

/**
 * POP 팝 — a bubble-comic store. The voice is round, chunky, friendly.
 * Fredoka — a soft geometric Latin display with rounded terminals; the
 * wordmark, kickers, and bubble labels. Gaegu (400/700) — a round handwritten
 * Hangul whose soft terminals match the bubble-comic voice.
 *
 * styles.css consumes these as var(--font-fredoka) / var(--font-gaegu);
 * page.tsx applies the .variable classes on the entry root.
 */
export const fredoka = Fredoka({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-fredoka",
  display: "swap",
});

export const gaegu = Gaegu({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-gaegu",
  display: "swap",
});
