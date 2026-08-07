import { Unbounded, Noto_Sans_KR } from "next/font/google";

/**
 * TIDE 물결 — a liquid-motion studio. The voice is a swell: round, full,
 * gravitational. Unbounded — a heavy, slightly inflated geometric display
 * that reads like a droplet catching light; the wordmark and kickers.
 * Noto Sans KR (300/500) — the clean Hangul weight that floats on water.
 *
 * styles.css consumes these as var(--font-unbounded) / var(--font-noto-sans-kr);
 * page.tsx applies the .variable classes on the entry root.
 */
export const unbounded = Unbounded({
  weight: ["300", "500", "700", "900"],
  subsets: ["latin"],
  variable: "--font-unbounded",
  display: "swap",
});

export const notoSansKR = Noto_Sans_KR({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-noto-sans-kr",
  display: "swap",
});
