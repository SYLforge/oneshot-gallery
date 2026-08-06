import { JetBrains_Mono, Noto_Sans_KR } from "next/font/google";

/**
 * The two voices of ASCII 아스키 — pictures drawn in characters.
 *
 * JetBrains Mono — the terminal voice. The wordmark, the ASCII frame, and
 *   every label set in a sharp monospaced grotesque so each glyph cell is
 *   identical — the same grid the ASCII density field is plotted on. Latin.
 *
 * Noto Sans KR — every Hangul glyph. A clean modern grotesque so the
 *   Korean sub-line reads clearly against the terminal-black ground.
 *
 * styles.css consumes these as var(--font-jetbrains-mono) /
 * var(--font-noto-sans-kr); page.tsx applies the .variable classes on the
 * entry root.
 */
export const jetbrainsMono = JetBrains_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const notoSansKR = Noto_Sans_KR({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-noto-sans-kr",
  display: "swap",
});
