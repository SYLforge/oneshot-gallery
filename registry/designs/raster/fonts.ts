import { Archivo, IBM_Plex_Sans_KR, Space_Mono } from "next/font/google";

/**
 * The three voices of the bureau:
 * Archivo — the standard itself, loaded as a variable font with the width
 *   axis (wdth 62–125). The width axis is the entry's whole expressive
 *   budget; everything else stays put.
 * IBM Plex Sans KR — the Korean clause hand: dry, engineered, official.
 * Space Mono — annotations, coordinates, tabular figures; the inspector's
 *   pencil.
 *
 * styles.css consumes these as var(--font-archivo) / var(--font-plex-kr) /
 * var(--font-space-mono); page.tsx applies the .variable classes on the
 * entry root.
 */
export const archivo = Archivo({
  weight: "variable",
  axes: ["wdth"],
  subsets: ["latin"],
  variable: "--font-archivo",
  display: "swap",
});

export const ibmPlexSansKR = IBM_Plex_Sans_KR({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-plex-kr",
  display: "swap",
});

export const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-space-mono",
  display: "swap",
});
