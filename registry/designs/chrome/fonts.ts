import { Syne, Black_Han_Sans, Major_Mono_Display } from "next/font/google";

/**
 * The three voices of the house — Y2K chrome, three registers:
 *
 * Syne — the Latin chrome display. A geometric face with a heavy 800 that
 * fills like poured metal; the wordmark, the hero headline, the section
 * titles. Latin only, so Hangul typed in a display heading falls through
 * into Black Han Sans with no markup.
 *
 * Black Han Sans — every Hangul glyph on the page. A chunky, confident
 * Korean display face that reads like the lettering on a 2003 flip-phone
 * casing: bold, glossy, never timid. The Korean voice.
 *
 * Major Mono Display — the chrome console: monospaced spec numerals, shade
 * codes, eyebrow labels, every "technical" readout. Its even advance width
 * is the rhythm of a product spec sheet stamped into foil.
 *
 * styles.css consumes these as var(--font-syne) / var(--font-hangul) /
 * var(--font-mono); page.tsx applies the .variable classes on the entry
 * root. Both display stacks put the Hangul face second, so Korean inside a
 * display setting falls through the Latin face into the Korean one.
 */
export const syne = Syne({
  weight: ["400", "600", "800"],
  subsets: ["latin"],
  variable: "--font-syne",
  display: "swap",
});

export const hangul = Black_Han_Sans({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-hangul",
  display: "swap",
});

export const mono = Major_Mono_Display({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});
