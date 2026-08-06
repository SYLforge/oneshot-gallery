import { Space_Grotesk, Noto_Sans_KR } from "next/font/google";

/**
 * HOLOGRAPH 홀로그래프 — a holographic card house. The voice is a foil:
 * shifting, prismatic, never one color. Space Grotesk — a clean technical
 * grotesque whose even color lets the holographic gradient do the talking;
 * the wordmark and kickers. Noto Sans KR (300/500) — the calm Hangul weight.
 *
 * styles.css consumes these as var(--font-space) / var(--font-noto-sans-kr);
 * page.tsx applies the .variable classes on the entry root.
 */
export const spaceGrotesk = Space_Grotesk({
  weight: ["300", "500", "700"],
  subsets: ["latin"],
  variable: "--font-space",
  display: "swap",
});

export const notoSansKR = Noto_Sans_KR({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-noto-sans-kr",
  display: "swap",
});
