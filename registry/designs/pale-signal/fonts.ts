import { Nanum_Gothic_Coding, VT323 } from "next/font/google";

/**
 * The two voices of the station:
 * VT323 — the CRT tube speaking Latin, digits, and box-drawing dots.
 * Nanum Gothic Coding — the operator's hand, Korean monospace.
 *
 * styles.css consumes these as var(--font-vt323) / var(--font-nanum-coding);
 * page.tsx applies the .variable classes on the entry root.
 */
export const vt323 = VT323({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-vt323",
  display: "swap",
});

export const nanumGothicCoding = Nanum_Gothic_Coding({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-nanum-coding",
  display: "swap",
});
