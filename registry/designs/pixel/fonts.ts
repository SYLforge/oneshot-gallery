import { Gugi, Press_Start_2P, VT323 } from "next/font/google";

/**
 * The three voices of PIXEL — an 8-bit arcade studio.
 *
 * Press Start 2P — the Latin pixel display. The wordmark over the
 *   marquee, section titles, the signage on the cabinet. It is a bitmap
 *   face redrawn as vectors, so it only has one weight (400) and only
 *   ever sits at display sizes; a paragraph set in it would be torture.
 *   Latin-only by design — every Hangul glyph falls through to Gugi.
 *
 * Gugi — every Hangul glyph on the page. A retro Korean display face that
 *   reads like the side of an arcade cabinet in a Seoul game center circa
 *   2003: round, cheerful, saturated. It is the closest thing on Google
 *   Fonts to the Korean pixel register the brief asked for (see DESIGN.md
 *   for the honest note on DungGeunMo, which is not in the Google Fonts
 *   registry and so cannot be loaded by next/font/google without shipping
 *   a binary — this entry ships zero media by design).
 *
 * VT323 — the CRT console. Drawn from the glyphs of a DEC VT320 terminal,
 *   it is the body/label/credits face: readable, monospaced, and the only
 *   one allowed near paragraph length. Both working stacks run Latin-first
 *   with Gugi second, so Hangul falls through with no markup at all.
 *
 * styles.css consumes these as var(--font-pixel-display) /
 * var(--font-pixel-ko) / var(--font-pixel-mono); page.tsx applies the
 * .variable classes on the entry root.
 */
export const pressStart2P = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-pixel-display",
  display: "swap",
});

export const gugi = Gugi({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-pixel-ko",
  display: "swap",
});

export const vt323 = VT323({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-pixel-mono",
  display: "swap",
});
