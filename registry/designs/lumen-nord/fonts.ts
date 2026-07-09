import { Hahmlet, Sora } from "next/font/google";

/**
 * The two voices of the bureau:
 * Hahmlet — a variable serif drawn for Hangul and Latin together; the
 * bulletin's display voice. Korean never leaves this face.
 * Sora — the duty officer's instrument panel: body copy, labels, readings.
 *
 * styles.css consumes these as var(--font-hahmlet) / var(--font-sora);
 * page.tsx applies the .variable classes on the entry root. The body stack
 * runs Sora first so Hangul falls through into Hahmlet — Korean body text
 * is deliberately serif, which keeps the page out of SaaS-glass territory.
 */
export const hahmlet = Hahmlet({
  subsets: ["latin"],
  variable: "--font-hahmlet",
  display: "swap",
});

export const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  display: "swap",
});
