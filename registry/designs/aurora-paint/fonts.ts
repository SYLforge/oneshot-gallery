import { Outfit, Noto_Sans_KR } from "next/font/google";

/**
 * AURORA PAINT 오로라 페인트 — a fictional paint studio whose medium is light.
 * The voice is luminous and airy. Outfit — a clean geometric sans with a soft
 * even color that lets the flowing aurora gradient do the talking on the
 * wordmark. Noto Sans KR (300/500) — the calm Hangul weight for the bilingual
 * copy.
 *
 * styles.css consumes these as var(--font-outfit) / var(--font-noto-sans-kr);
 * page.tsx applies the .variable classes on the entry root.
 */
export const outfit = Outfit({
  weight: ["300", "400", "600", "800"],
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const notoSansKR = Noto_Sans_KR({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-noto-sans-kr",
  display: "swap",
});
