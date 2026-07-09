import { Anton, Noto_Serif_KR, Space_Mono, Spectral } from "next/font/google";

/**
 * The four hands on this production:
 * Anton — the title card: condensed display capitals, one weight, no apology.
 * Spectral — the prose voice: screen directions and program notes in serif.
 * Space Mono — the machine: timecodes, frame counters, cue sheets, credits.
 * Noto Serif KR — every Hangul glyph; the Korean line is a serif, not a gloss.
 *
 * styles.css consumes these as var(--font-anton) / var(--font-spectral) /
 * var(--font-space-mono) / var(--font-noto-serif-kr); page.tsx applies the
 * .variable classes on the entry root. Body and mono stacks list Noto Serif
 * KR after the Latin face so Hangul falls through without markup; :lang(ko)
 * additionally pins it explicitly.
 */
export const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-anton",
  display: "swap",
});

export const spectral = Spectral({
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-spectral",
  display: "swap",
});

export const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-space-mono",
  display: "swap",
});

export const notoSerifKr = Noto_Serif_KR({
  weight: ["400", "600"],
  subsets: ["latin"],
  variable: "--font-noto-serif-kr",
  display: "swap",
});
