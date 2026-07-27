import { Noto_Serif_KR, Oswald } from "next/font/google";

/**
 * The two voices of the zine — punk typography, Korean-first.
 *
 * Oswald — the condensed Latin display face. Every headline, masthead,
 * folio, kicker, marquee band: the loud poster voice of a photocopied
 * underground magazine. Tall, narrow, all-caps, shouted.
 *
 * Noto Serif KR — the Korean serif, and the structural body face. Every
 * Hangul glyph (the masthead 잡지, every essay), the Korean-first running
 * text, the marginalia. A magazine is read as much as it is looked at, so
 * the body is a serif with weight: 400/500/700/900.
 *
 * styles.css consumes these as var(--font-noto-serif-kr) /
 * var(--font-oswald). The body stack puts Noto Serif KR first so Hangul
 * and Latin serif both resolve there; Oswald is applied by class on the
 * display elements that need it. :lang(ko) pins Noto Serif KR explicitly.
 */
export const notoSerifKR = Noto_Serif_KR({
  weight: ["400", "500", "700", "900"],
  subsets: ["latin"],
  variable: "--font-noto-serif-kr",
  display: "swap",
});

export const oswald = Oswald({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-oswald",
  display: "swap",
});
