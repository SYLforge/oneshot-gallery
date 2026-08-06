import { Fredoka, Noto_Sans_KR } from "next/font/google";

/**
 * MARSH 마쉬 — a squishy marshmallow confectionery. The voice is pillowy,
 * candy-soft, rounded. Fredoka — a soft rounded sans with a friendly bounce,
 * perfect for the marshmallow wordmark and headings. Noto Sans KR (400/500/700)
 * — the Hangul weight.
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
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-noto-sans-kr",
  display: "swap",
});
