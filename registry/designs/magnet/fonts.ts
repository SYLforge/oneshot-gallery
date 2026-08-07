import { Archivo_Black, Do_Hyeon } from "next/font/google";

/**
 * The two voices of MAGNET 마그넷 — things that pull.
 *
 * Archivo Black — the heavy voice. A single ultra-heavy display weight; the
 *   wordmark and the magnetic pill buttons sit at full saturation so each
 *   glyph reads as a solid block the pointer can pull on. Latin-only.
 *
 * Do Hyeon — every Hangul glyph. A heavy, wide Korean display so the Korean
 *   sub-line matches Archivo Black's solid-block weight on the bright pink
 *   ground.
 *
 * styles.css consumes these as var(--font-archivo-black) /
 * var(--font-do-hyeon); page.tsx applies the .variable classes on the
 * entry root.
 */
export const archivoBlack = Archivo_Black({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-archivo-black",
  display: "swap",
});

export const doHyeon = Do_Hyeon({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-do-hyeon",
  display: "swap",
});
