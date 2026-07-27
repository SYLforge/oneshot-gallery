import { JetBrains_Mono, Noto_Sans_KR } from "next/font/google";

/**
 * The two voices of the deck.
 *
 * JetBrains Mono — the data voice: Latin display, body, the spectrum axis,
 *   tabular numbers, the marquee ticker. A code/grotesque monospace,
 *   deliberately distinct from PALE.SIGNAL's VT323 (a CRT terminal face) and
 *   from GLITCH's Space Mono (a typewriter grotesque). JetBrains reads as
 *   engineering tooling — the right register for an analytics terminal.
 * Noto Sans KR — every Hangul glyph. The ideal Korean *mono* is D2Coding, but
 *   it is not in the Google Fonts catalog (would require self-hosting a
 *   payload). Noto Sans KR keeps Korean first-class and ships via next/font
 *   with no asset weight; styles.css pins it on the JetBrains rhythm through
 *   :lang(ko) so Hangul sits cleanly on the data baseline. Distinct from
 *   GLITCH (which uses the same family) by voice and pairing, not by face.
 *
 * styles.css consumes these as var(--font-wave-mono) / var(--font-wave-ko);
 * page.tsx applies the .variable classes on the entry root.
 */
export const jetbrainsMono = JetBrains_Mono({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-wave-mono",
  display: "swap",
});

export const notoSansKR = Noto_Sans_KR({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-wave-ko",
  display: "swap",
});
