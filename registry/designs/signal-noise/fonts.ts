import { JetBrains_Mono, Noto_Sans_KR } from "next/font/google";

/**
 * SIGNAL NOISE 신호 잡음 — the aesthetics of noise, a living CRT signal
 * display. The voice is a green-phosphor terminal: technical, precise, alive.
 * JetBrains Mono — a crisp monospaced engineer's face whose 700 carries the
 * wordmark with a steady grid; the logs, the wordmark, the readouts.
 * Noto Sans KR (400/500/700) — the clean Hangul that survives a scanline.
 *
 * styles.css consumes these as var(--font-jetbrains-mono) /
 * var(--font-noto-sans-kr); page.tsx applies the .variable classes on the
 * entry root.
 */
export const jetbrainsMono = JetBrains_Mono({
  weight: ["400", "500", "700", "800"],
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const notoSansKR = Noto_Sans_KR({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-noto-sans-kr",
  display: "swap",
});
