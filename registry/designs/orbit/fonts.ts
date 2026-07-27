import { Inter, Noto_Sans_KR, Space_Grotesk } from "next/font/google";

/**
 * The configurator's three voices:
 * Space Grotesk — the technical display: the ORBIT wordmark, section numbers,
 *   spec readouts, colorway names. It carries the configurator/instrument feel
 *   a product site needs without going monospaced.
 * Inter — English body and UI: captions, copy, labels, buttons. Pairs with the
 *   Korean body face; Hangul falls through it into Noto Sans KR.
 * Noto Sans KR — every Korean line. Korean is first-class body and subheads,
 *   never an afterthought. The body stack runs Inter-then-Noto so English
 *   stays in Inter and Hangul lands in its own face.
 *
 * styles.css consumes these as var(--font-grotesk) / var(--font-inter) /
 * var(--font-noto-kr); page.tsx applies the .variable classes on the entry
 * root.
 */
export const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-grotesk",
  display: "swap",
});

export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const notoSansKR = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-noto-kr",
  display: "swap",
});
