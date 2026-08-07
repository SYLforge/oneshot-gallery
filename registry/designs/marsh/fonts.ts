import { Fredoka, Gaegu } from "next/font/google";

/**
 * MARSH 마쉬 — a squishy marshmallow confectionery. The voice is pillowy,
 * candy-soft, rounded. Fredoka — a soft rounded sans with a friendly bounce,
 * perfect for the marshmallow wordmark and headings. Gaegu (400/700) — a round
 * handwritten Hangul that keeps the squishy, candy-soft voice.
 *
 * styles.css consumes these as var(--font-fredoka) / var(--font-gaegu);
 * page.tsx applies the .variable classes on the entry root.
 */
export const fredoka = Fredoka({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-fredoka",
  display: "swap",
});

export const gaegu = Gaegu({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-gaegu",
  display: "swap",
});
