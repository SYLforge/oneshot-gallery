import { Noto_Sans_KR, Recursive } from "next/font/google";

/**
 * The two voices of VARIFLEX 바리플렉스 — type that stretches.
 *
 * Recursive — the variable voice. A single variable font with weight (300..900)
 *   and slant (0..-15) axes; the wordmark physically morphs from thin-extended
 *   to bold-condensed as the CSS custom properties --vf-w (font-weight) and
 *   --vf-s (slnt) are driven by the pointer. The hero IS the axis morph.
 *
 * Noto Sans KR — every Hangul glyph. A clean modern grotesque so the Korean
 *   sub-line reads clearly on the warm light ground.
 *
 * styles.css consumes these as var(--font-recursive) / var(--font-noto-sans-kr);
 * page.tsx applies the .variable classes on the entry root.
 */
export const recursive = Recursive({
  // Recursive is a variable font; request the full variable instance so the
  // weight + slnt axes can be driven live from CSS (font-weight / font-style).
  // next/font exposes non-weight variable axes via `axes`.
  weight: "variable",
  axes: ["slnt", "CASL", "MONO", "CRSV"],
  subsets: ["latin"],
  variable: "--font-recursive",
  display: "swap",
});

export const notoSansKR = Noto_Sans_KR({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-noto-sans-kr",
  display: "swap",
});
