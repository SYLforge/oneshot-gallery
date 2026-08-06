import { Sora, Noto_Sans_KR } from "next/font/google";

/**
 * MESH 메쉬 — a gradient studio. The voice is chromatic and modern. Sora — a
 * geometric display with strong even weight, letting the multi-color mesh glow
 * do the talking on the wordmark. Noto Sans KR (300/500/700) — the Hangul
 * weight.
 *
 * styles.css consumes these as var(--font-sora) / var(--font-noto-sans-kr);
 * page.tsx applies the .variable classes on the entry root.
 */
export const sora = Sora({
  weight: ["300", "400", "600", "800"],
  subsets: ["latin"],
  variable: "--font-sora",
  display: "swap",
});

export const notoSansKR = Noto_Sans_KR({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-noto-sans-kr",
  display: "swap",
});
