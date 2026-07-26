import { Archivo_Black, Black_Han_Sans, Space_Mono } from "next/font/google";

/**
 * The three voices of the rave:
 * Black Han Sans — every Hangul glyph on the page. A single weight (400)
 *   that reads as a solid block: the closest thing on Google Fonts to a
 *   Korean face with brutalist weight. It is the wordmark as much as the
 *   body of the flyer.
 * Archivo Black — the Latin display. Stacks AFTER Black Han Sans so any
 *   Latin glyph that the Korean face does not cover falls through into a
 *   matching Latin slab. (Black Han Sans covers basic Latin but its
 *   metrics there are thin; Archivo Black takes the wordmark and section
 *   titles so the two scripts read at the same visual weight.)
 * Space Mono — timestamps, BPM, ticket ledger, the venue co-ordinates.
 *   Monospace keeps the schedule tabular without a <table>.
 *
 * styles.css consumes these as var(--font-rave-han) / var(--font-rave-arch) /
 * var(--font-rave-mono); page.tsx applies the .variable classes on the root.
 */
export const blackHanSans = Black_Han_Sans({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-rave-han",
  display: "swap",
});

export const archivoBlack = Archivo_Black({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-rave-arch",
  display: "swap",
});

export const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-rave-mono",
  display: "swap",
});
