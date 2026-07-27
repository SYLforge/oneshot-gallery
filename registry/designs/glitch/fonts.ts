import { Major_Mono_Display, Noto_Sans_KR, Space_Mono } from "next/font/google";

/**
 * The three voices of the studio. Deliberately distinct from PALE.SIGNAL
 * (which is VT323 + Nanum Gothic Coding — a clean phosphor tube). GLITCH is
 * corrupted hardware: a clean grotesque mono plus a glitchy display, and a
 * modern Korean grotesque — none of the CRT-tube nostalgia.
 *
 * Major Mono Display — the corrupted wordmark. Geometric, wide, single-case
 *   glyphs that read like a broken broadcast ident. Used for the RGB-split
 *   title and section display only; its metrics are too theatrical for body.
 * Space Mono — the machine voice: body copy, track ledger, log lines,
 *   tabular timestamps. A grotesque monospace, not a terminal face.
 * Noto Sans KR — every Hangul glyph. A clean modern grotesque (not the
 *   old coding face Nanum uses), so Korean reads contemporary, not vintage.
 *
 * styles.css consumes these as var(--font-glitch-display) /
 * var(--font-glitch-mono) / var(--font-glitch-ko); page.tsx applies the
 * .variable classes on the entry root.
 */
export const majorMonoDisplay = Major_Mono_Display({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-glitch-display",
  display: "swap",
});

export const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-glitch-mono",
  display: "swap",
});

export const notoSansKR = Noto_Sans_KR({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-glitch-ko",
  display: "swap",
});
