import { Black_Han_Sans, Gaegu, Noto_Sans_KR, Space_Mono } from "next/font/google";

/**
 * The four voices of the tent — all Korean-capable where they need to be:
 *
 * Black Han Sans — the Korean display voice: the wordmark 야식!, panel titles,
 *   SFX lettering (치치칵! 냠냠!). Loud, flat, the cover of a webtoon chapter.
 *   The same face PPANG! uses for 빵!, because it is the gallery's house webtoon
 *   display — but here it shouts in neon amber over night, not dawn ink on paper.
 * Gaegu — the handwriting voice: speech bubbles, the tent ajumma's banter, the
   caption asides. A Korean handwriting face so the dialogue reads as someone
 *   talking across the counter, never as a UI label.
 * Noto Sans KR — the prose voice: every Korean body line, the menu, the hours.
 *   A modern Korean sans that holds its weight under neon and over steam.
 * Space Mono — the machine + the ASCII neon: order tickets, prices, AND the
 *   ASCII-art sign glyphs (the monospace grid is what makes ASCII render as a
 *   picture, not as text).
 *
 * Korean is load-bearing, so each Korean face ships its own `latin` subset and
 * the family stack always lists the Korean face before any Latin fallback —
 * Hangul never falls through to a default sans. See the :lang(ko) rule in
 * styles.css.
 *
 * styles.css consumes these as var(--font-display) / var(--font-hand) /
 * var(--font-kr) / var(--font-mono); page.tsx applies the .variable classes
 * on the root.
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
  variable: "--font-hand",
  display: "swap",
});

export const notoSansKR = Noto_Sans_KR({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-kr",
  display: "swap",
});

export const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});
