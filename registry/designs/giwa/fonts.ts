import { Fraunces, Gowun_Batang, Song_Myung } from "next/font/google";

/**
 * The three hands of the guild:
 * Song Myung — the display serif that carves 단청 into the page; Korean leads.
 * Gowun Batang — the body serif, the museum-label hand for every paragraph.
 * Fraunces — Latin accents only: the subtitle, folio labels, catalog numbers.
 *
 * styles.css consumes these as var(--font-song-myung) / var(--font-gowun) /
 * var(--font-fraunces); page.tsx applies the .variable classes on the root.
 * Song Myung exposes no `subsets` option (its Hangul ships via
 * unicode-range CSS, nothing preloadable); the other two declare ["latin"].
 */
export const songMyung = Song_Myung({
  weight: "400",
  variable: "--font-song-myung",
  display: "swap",
});

export const gowunBatang = Gowun_Batang({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-gowun",
  display: "swap",
});

export const fraunces = Fraunces({
  weight: ["400", "600"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});
