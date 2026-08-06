import { Fraunces, Noto_Serif_KR } from "next/font/google";

/**
 * PAPER FOLD 종이접기 — folding hands, a papercraft atelier. The voice is
 * warm paper, hand-pressed, with a soft orange ink. Fraunces — an opsz-aware
 * contemporary serif with a warm, sculpted body and gentle optical swell;
 * it carries the wordmark and English headings at a cosy display size.
 * Noto Serif KR (400/500) — the calm Hangul serif that sits on washi.
 *
 * styles.css consumes these as var(--font-fraunces) /
 * var(--font-noto-serif-kr); page.tsx applies the .variable classes on the
 * entry root.
 */
export const fraunces = Fraunces({
  weight: ["300", "400", "500", "600", "700", "900"],
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

export const notoSerifKR = Noto_Serif_KR({
  weight: ["300", "400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-noto-serif-kr",
  display: "swap",
});
