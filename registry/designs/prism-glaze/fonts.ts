import { Syne, Noto_Sans_KR } from "next/font/google";

/**
 * PRISM GLAZE 프리즘 글레이즈 — a liquid-glass house. The voice is a poured
 * glaze: cool, refractive, a little syrupy. Syne — a sharp, slightly quirky
 * geometric display whose hairline-to-bold range reads like a bevel; the
 * wordmark and kickers. Noto Sans KR (300/500) — the calm Hangul weights that
 * sit cleanly behind a glass panel.
 *
 * styles.css consumes these as var(--font-syne) / var(--font-noto-sans-kr);
 * page.tsx applies the .variable classes on the entry root.
 */
export const syne = Syne({
  weight: ["400", "600", "700", "800"],
  subsets: ["latin"],
  variable: "--font-syne",
  display: "swap",
});

export const notoSansKR = Noto_Sans_KR({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-noto-sans-kr",
  display: "swap",
});
