import { Lora, Noto_Serif_KR, Space_Mono } from "next/font/google";

/**
 * The three plates of RISO's voice:
 * Noto Serif KR — the literary serif that sets every Hangul glyph AND the
 *   Korean display. A book publisher sets Korean in a serif first.
 * Lora — the Latin body and section serif, paired so EN/KR share a serif
 *   register (the publisher hand-sets both languages in the same family
 *   of letter, just different foundries).
 * Space Mono — folios, captions, the registration-mark annotations, the
 *   press-operator's ledger hand.
 *
 * styles.css consumes these as var(--font-noto-serif-kr) /
 * var(--font-lora) / var(--font-space-mono); page.tsx applies the
 * .variable classes on the root.
 */
export const notoSerifKR = Noto_Serif_KR({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-noto-serif-kr",
  display: "swap",
});

export const lora = Lora({
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-lora",
  display: "swap",
});

export const spaceMono = Space_Mono({
  weight: ["400", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-space-mono",
  display: "swap",
});
