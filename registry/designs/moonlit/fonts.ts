import { Gugi, Noto_Sans_KR, Space_Grotesk, Space_Mono } from "next/font/google";

/**
 * The four voices of the night:
 *
 * Gugi — the wordmark and the big chapter cards. A Korean display face with
 *   webtoon-title weight: thick, slightly playful strokes that read as a
 *   chapter splash, the way Naver Webtoon titles do. Used sparingly, mostly
 *   for "달빛" and the section eyebrows.
 * Noto Sans KR — the page's prose voice: every Korean line of poetry, status,
 *   caption. A modern Korean sans that holds its weight in the dark.
 * Space Grotesk — the English display companion: chapter numbers, the wordmark
 *   "MOONLIT" in English, section heads. Quiet grotesque, not loud.
 * Space Mono — the machine: delivery tracker timestamps, order numbers, every
 *   line that belongs to the app rather than the story. Tabular, terminal-ish.
 *
 * The body stack runs Noto Sans KR after Space Grotesk so Hangul falls through
 * the Latin face into Korean with no markup; :lang(ko) pins the family and
 * sets word-break: keep-all. Mono and Korean are kept separate — a delivery
 * status line is half machine and half human, so the mono carries the
 * timestamp and the Korean rides its own stack underneath.
 */
export const gugi = Gugi({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-gugi",
  display: "swap",
});

export const notoSansKr = Noto_Sans_KR({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-noto-sans-kr",
  display: "swap",
});

export const spaceGrotesk = Space_Grotesk({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

export const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-space-mono",
  display: "swap",
});
