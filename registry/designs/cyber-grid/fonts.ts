import { Orbitron, Noto_Sans_KR } from "next/font/google";

/**
 * CYBER GRID 사이버 그리드 — a cyberpunk HUD interface. The voice is sharp,
 * futuristic, electric. Orbitron — a geometric techno display built for HUDs,
 * the wordmark and kickers. Noto Sans KR (300/500) — the calm Hangul weight.
 *
 * styles.css consumes these as var(--font-orbitron) / var(--font-noto-sans-kr);
 * page.tsx applies the .variable classes on the entry root.
 */
export const orbitron = Orbitron({
  weight: ["500", "700", "900"],
  subsets: ["latin"],
  variable: "--font-orbitron",
  display: "swap",
});

export const notoSansKR = Noto_Sans_KR({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-noto-sans-kr",
  display: "swap",
});
