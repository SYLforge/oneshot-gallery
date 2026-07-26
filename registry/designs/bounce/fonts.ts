import { Fredoka, Gaegu } from "next/font/google";

/**
 * The two round voices of BOUNCE:
 * Fredoka — the Latin display and body hand; soft, chunky, the roundest
 * sans on Google Fonts. Every English word on the page wears it.
 * Gaegu — every Hangul glyph; a hand-drawn rounded Korean face that reads
 * like a children's-book page, never a system fallback.
 *
 * styles.css consumes these as var(--font-fredoka) / var(--font-gaegu);
 * page.tsx applies the .variable classes on the entry root. The display
 * stack is `Fredoka, Gaegu, sans-serif`, so a Korean glyph inside a
 * Fredoka headline falls through into Gaegu with no extra markup, and
 * `:lang(ko)` additionally pins it and loosens tracking for hangul.
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
