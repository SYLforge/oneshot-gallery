import { Noto_Sans_KR, Space_Grotesk } from "next/font/google";

/**
 * The release page's two voices:
 * Space Grotesk — the technical display: the PULSE wordmark, track numbers,
 *   BPM readouts, timestamps. It carries the instrument/sequencer feel a
 *   music release page needs without going monospaced.
 * Noto Sans KR — every Korean line, and the bilingual body face. Korean is
 *   first-class body and subheads, never an afterthought; Hangul never
 *   falls through to the default sans stack. The body stack runs Noto Sans
 *   KR first so English set in Space Grotesk stays in display only, and all
 *   running text lands in Noto Sans KR's even, legible Korean.
 *
 * styles.css consumes these as var(--font-grotesk) / var(--font-noto-kr);
 * page.tsx applies the .variable classes on the entry root.
 */
export const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-grotesk",
  display: "swap",
});

export const notoSansKR = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-noto-kr",
  display: "swap",
});
