import { Azeret_Mono, Gugi, Monoton } from "next/font/google";

/**
 * The three voices of the station:
 * Monoton — the neon signage over the entrance; Latin display only, always
 * glowing, never used for anything a visitor must read quickly.
 * Gugi — every Hangul glyph on the page; a retro Korean display face that
 * sounds like a PA speaker in a tiled atrium.
 * Azeret Mono — the broadcast console: labels, schedules, window chrome,
 * and all reading text.
 *
 * styles.css consumes these as var(--font-monoton) / var(--font-gugi) /
 * var(--font-azeret); page.tsx applies the .variable classes on the entry
 * root. Both working stacks put Gugi after the Latin face, so Hangul falls
 * through Monoton or Azeret Mono into Gugi with no markup at all.
 */
export const monoton = Monoton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-monoton",
  display: "swap",
});

export const gugi = Gugi({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-gugi",
  display: "swap",
});

export const azeretMono = Azeret_Mono({
  subsets: ["latin"],
  variable: "--font-azeret",
  display: "swap",
});
