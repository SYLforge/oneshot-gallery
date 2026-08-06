import { Noto_Sans_KR, VT323 } from "next/font/google";

/**
 * The two voices of CRT DREAM CRT 드림 — the warm light of 2003.
 *
 * VT323 — the phosphor voice. Drawn from the glyphs of a DEC VT320
 *   terminal, it is the wordmark, the readouts, and every label — set at
 *   large sizes where its fuzzy amber glow (stacked text-shadows) reads as
 *   a real CRT tube, not a font. Latin-only by design.
 *
 * Noto Sans KR — every Hangul glyph. A clean modern grotesque so the
 *   Korean sub-line reads clearly against the warm scanlined ground.
 *
 * styles.css consumes these as var(--font-vt323) / var(--font-noto-sans-kr);
 * page.tsx applies the .variable classes on the entry root.
 */
export const vt323 = VT323({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-vt323",
  display: "swap",
});

export const notoSansKR = Noto_Sans_KR({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-noto-sans-kr",
  display: "swap",
});
