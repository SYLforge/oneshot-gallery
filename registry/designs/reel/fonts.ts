import { Playfair_Display, Noto_Serif_KR, Space_Mono } from "next/font/google";

/**
 * The three hands on this contact sheet:
 * Playfair Display — the cover-line and section display: a high-contrast
 *   display serif with film-credit weight, italic when the page speaks as a
 *   caption. It reads as the title on a printed proof sheet.
 * Noto Serif KR — every Hangul glyph; the Korean line is its own serif voice,
 *   never a gloss. Also the body stack's hangul fallback.
 * Space Mono — the machine: frame numbers, exposure data, sprocket labels,
 *   and the colophon's metadata. Read at a distance, like a strip's edge print.
 *
 * styles.css consumes these as var(--font-playfair) / var(--font-noto-serif-kr)
 * / var(--font-space-mono); page.tsx applies the .variable classes on the
 * entry root. Body and mono stacks list Noto Serif KR after the Latin face so
 * Hangul falls through without markup; :lang(ko) additionally pins it.
 *
 * (Playfair Display ships an italic axis but next/font selects by weight +
 * style; a single 400-normal and 400-italic call is enough — we keep weight
 * arrays tight to match the file-size discipline of the rest of the entry.)
 */
export const playfair = Playfair_Display({
  weight: ["400", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const notoSerifKr = Noto_Serif_KR({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-noto-serif-kr",
  display: "swap",
});

export const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-space-mono",
  display: "swap",
});
