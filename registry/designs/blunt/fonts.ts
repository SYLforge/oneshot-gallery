import { Archivo_Black, Do_Hyeon, IBM_Plex_Mono } from "next/font/google";

/**
 * The three voices of the shop:
 * Archivo Black — the wordmark shouting in Latin.
 * Do Hyeon — every Hangul glyph on the page, condensed and deadpan.
 * IBM Plex Mono — price tags, annotations, the co-op's ledger hand.
 *
 * styles.css consumes these as var(--font-archivo) / var(--font-dohyeon) /
 * var(--font-plex-mono); page.tsx applies the .variable classes on the root.
 */
export const archivoBlack = Archivo_Black({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-archivo",
  display: "swap",
});

export const doHyeon = Do_Hyeon({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-dohyeon",
  display: "swap",
});

export const ibmPlexMono = IBM_Plex_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-plex-mono",
  display: "swap",
});
