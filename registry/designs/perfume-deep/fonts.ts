import { Cormorant_Garamond, Noto_Serif_KR } from "next/font/google";

/**
 * PERFUME DEEP 퍼퓸 딥 — a deep scent, a house of expensive silence. The voice
 * is hairline serif, slow, gold on near-black. Cormorant Garamond — a high-
 * contrast galleon serif that at weight 300 reads like engraved stationery;
 * it carries the wordmark with huge letter-spacing and the English copy.
 * Noto Serif KR (300/400) — the quiet Hangul serif that sits in candlelight.
 *
 * styles.css consumes these as var(--font-cormorant-garamond) /
 * var(--font-noto-serif-kr); page.tsx applies the .variable classes on the
 * entry root.
 */
export const cormorantGaramond = Cormorant_Garamond({
  weight: ["300", "400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-cormorant-garamond",
  display: "swap",
});

export const notoSerifKR = Noto_Serif_KR({
  weight: ["300", "400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-noto-serif-kr",
  display: "swap",
});
