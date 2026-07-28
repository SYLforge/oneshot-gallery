import { Fredoka, Noto_Sans_KR } from "next/font/google";

/**
 * POP 팝 — a bubble-comic store. The voice is round, chunky, friendly.
 * Fredoka — a soft geometric Latin display with rounded terminals; the
 * wordmark, kickers, and bubble labels. Noto Sans KR (700) — the chunkiest
 * Hangul in the stack so Korean keeps the same playful weight.
 *
 * styles.css consumes these as var(--font-fredoka) / var(--font-noto-sans-kr);
 * page.tsx applies the .variable classes on the entry root.
 */
export const fredoka = Fredoka({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-fredoka",
  display: "swap",
});

export const notoSansKR = Noto_Sans_KR({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-noto-sans-kr",
  display: "swap",
});
