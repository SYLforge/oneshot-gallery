import { Archivo_Black, Noto_Sans_KR } from "next/font/google";

/**
 * The two voices of MAGNET 마그넷 — things that pull.
 *
 * Archivo Black — the heavy voice. A single ultra-heavy display weight; the
 *   wordmark and the magnetic pill buttons sit at full saturation so each
 *   glyph reads as a solid block the pointer can pull on. Latin-only.
 *
 * Noto Sans KR — every Hangul glyph. A clean modern grotesque so the Korean
 *   sub-line reads clearly on the bright pink ground.
 *
 * styles.css consumes these as var(--font-archivo-black) /
 * var(--font-noto-sans-kr); page.tsx applies the .variable classes on the
 * entry root.
 */
export const archivoBlack = Archivo_Black({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-archivo-black",
  display: "swap",
});

export const notoSansKR = Noto_Sans_KR({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-noto-sans-kr",
  display: "swap",
});
