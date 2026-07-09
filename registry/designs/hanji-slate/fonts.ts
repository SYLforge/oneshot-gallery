import { Hanken_Grotesk, JetBrains_Mono, Noto_Sans_KR } from "next/font/google";

/**
 * The three voices of the slate:
 * Hanken Grotesk — the product speaking Latin: calm, geometric, unhurried.
 * Noto Sans KR — every Hangul glyph on the page; Korean is first-class here.
 * JetBrains Mono — the spec readouts: figures, units, callout labels.
 *
 * styles.css consumes these as var(--font-hanken) / var(--font-noto-kr) /
 * var(--font-jbmono); page.tsx applies the .variable classes on the root.
 * All three are variable fonts, so no weight list is pinned.
 */
export const hankenGrotesk = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-hanken",
  display: "swap",
});

export const notoSansKr = Noto_Sans_KR({
  subsets: ["latin"],
  variable: "--font-noto-kr",
  display: "swap",
});

export const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jbmono",
  display: "swap",
});
