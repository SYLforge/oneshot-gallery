import { Black_Han_Sans, Gaegu, Fredoka } from "next/font/google";

/**
 * The three sticker-book voices:
 * Black Han Sans — the Korean display voice: the wordmark 스티커, section
 *   titles, the giant footer shout. Loud and rounded, the cover of a sticker
 *   book. Hangul glyphs ride the font file's own CJK coverage, which
 *   next/font preserves (the `latin` subset request is only for the few
 *   Latin glyphs the display face ships).
 * Gaegu — everyday Korean: captions, sticker labels, the notebook hand. A
 *   handwritten rounded face so every line reads ballpoint-on-sticker, not
 *   system-default sans.
 * Fredoka — the English voice: the wordmark subtitle, English labels, the
 *   marquee slogans. A rounded sans, warm and chunky, the way a sticker book
 *   is printed.
 *
 * styles.css consumes these as var(--font-display) / var(--font-gaegu) /
 * var(--font-fredoka); page.tsx applies the .variable classes on the root.
 *
 * Korean is load-bearing, so the family stack always lists the Korean face
 * before the Latin fallback and a `:lang(ko)` rule pins it — see styles.css.
 */
export const blackHanSans = Black_Han_Sans({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

export const gaegu = Gaegu({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-gaegu",
  display: "swap",
});

export const fredoka = Fredoka({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-fredoka",
  display: "swap",
});
