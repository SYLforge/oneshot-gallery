import { Outfit, Noto_Sans_KR } from "next/font/google";

/**
 * NEBULA WARM 따뜻한 성운 — a warm-toned generative nebula (the warm
 * counterpart to a cool pulse). The voice is ember and dusk. Outfit — a clean
 * geometric display whose even weight lets the warm amber/coral/rose gradient
 * glow do the talking on the wordmark. Noto Sans KR (300/500) — the Hangul
 * weight.
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
