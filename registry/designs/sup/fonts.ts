import { Gowun_Dodum, Instrument_Serif } from "next/font/google";

/**
 * The two voices of the forest:
 * Instrument Serif — the Latin display voice; the "SUP" wordmark, section
 * titles, and the italic asides that read like a guide speaking softly.
 * Gowun Dodum — every Hangul glyph and all body text; round, unhurried,
 * the voice that actually leads the breathing.
 *
 * styles.css consumes these as var(--font-instrument) / var(--font-gowun);
 * page.tsx applies the .variable classes on the entry root. The display
 * stack is `Instrument Serif, Gowun Dodum, serif`, so the giant 숲 falls
 * through the Latin face into Gowun Dodum with no extra markup.
 */
export const instrumentSerif = Instrument_Serif({
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-instrument",
  display: "swap",
});

export const gowunDodum = Gowun_Dodum({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-gowun",
  display: "swap",
});
