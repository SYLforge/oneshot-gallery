import { Playfair_Display, Noto_Serif_KR } from "next/font/google";

/**
 * DUSK 황혼 — between day and night, a cinematic dusk. The voice is a wide
 * screen, a slow sunset, italic credits. Playfair Display — a high-contrast
 * didone whose 900 italic reads like the title card of a film; the wordmark
 * carries a peach-to-coral gradient and a soft sunset glow. Noto Serif KR
 * (300/400) — the calm Hangul serif for the KO sub "황혼".
 *
 * styles.css consumes these as var(--font-playfair-display) /
 * var(--font-noto-serif-kr); page.tsx applies the .variable classes on the
 * entry root.
 */
export const playfairDisplay = Playfair_Display({
  weight: ["400", "500", "700", "800", "900"],
  subsets: ["latin"],
  variable: "--font-playfair-display",
  display: "swap",
  style: ["normal", "italic"],
});

export const notoSerifKR = Noto_Serif_KR({
  weight: ["300", "400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-noto-serif-kr",
  display: "swap",
});
