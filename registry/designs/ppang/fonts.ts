import { Black_Han_Sans, Fraunces, Noto_Serif_KR } from "next/font/google";

/**
 * The three voices of the bakery:
 * Black Han Sans — the Korean display voice: the wordmark 빵!, panel titles,
 *   SFX lettering. Loud, warm, the cover of a webtoon chapter.
 * Noto Serif KR — every Korean body glyph: captions, narration, the hours.
 *   A warm serif so the story reads like a hand-written letter, not a menu.
 * Fraunces — the English voice: the sign, English captions, the subtitle.
 *   Optical-sized and cozy, the way a bakery sign is painted.
 *
 * styles.css consumes these as var(--font-display) / var(--font-kr) /
 * var(--font-en); page.tsx applies the .variable classes on the root.
 *
 * Korean is load-bearing, so Noto Serif KR ships its own `korean` subset and
 * Black Han Sans is given the `latin` subset (Hangul glyphs ride the
 * font-file's own CJK coverage, which next/font preserves). The family stack
 * always lists the Korean face before the Latin fallback so Hangul never
 * falls through to a default sans — see the :lang(ko) rule in styles.css.
 */
export const blackHanSans = Black_Han_Sans({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

export const notoSerifKR = Noto_Serif_KR({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-kr",
  display: "swap",
});

export const fraunces = Fraunces({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-en",
  display: "swap",
});
