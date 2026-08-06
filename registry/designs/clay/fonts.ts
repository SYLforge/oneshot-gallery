import { Baloo_2, Noto_Sans_KR } from "next/font/google";

/**
 * CLAY 클레이 — a 3D-clay product studio on warm cream. The voice is soft,
 * rounded, squeezable. Baloo 2 — a rounded display whose chubby terminals
 * already read as extruded clay; the wordmark and headings. Noto Sans KR
 * (400/500/700) — the Hangul weight.
 *
 * styles.css consumes these as var(--font-baloo) / var(--font-noto-sans-kr);
 * page.tsx applies the .variable classes on the entry root.
 */
export const baloo2 = Baloo_2({
  weight: ["500", "600", "700", "800"],
  subsets: ["latin"],
  variable: "--font-baloo",
  display: "swap",
});

export const notoSansKR = Noto_Sans_KR({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-noto-sans-kr",
  display: "swap",
});
