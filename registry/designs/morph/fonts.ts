import { Bricolage_Grotesque, Noto_Sans_KR } from "next/font/google";

/**
 * The two voices of MORPH 모프 — letters that transform.
 *
 * Bricolage Grotesque — the kinetic voice. A variable-ish display grotesque
 *   with a wide weight range; the wordmark splits into per-glyph spans that
 *   each morph (rotate / skew / scale) in a staggered loop, so the letters
 *   feel alive and constantly shifting. Latin-only by design.
 *
 * Noto Sans KR — every Hangul glyph. A clean modern grotesque so the Korean
 *   sub-line reads clearly against the dark purple ground.
 *
 * styles.css consumes these as var(--font-bricolage) /
 * var(--font-noto-sans-kr); page.tsx applies the .variable classes on the
 * entry root.
 */
export const bricolageGrotesque = Bricolage_Grotesque({
  weight: ["400", "700", "800"],
  subsets: ["latin"],
  variable: "--font-bricolage",
  display: "swap",
});

export const notoSansKR = Noto_Sans_KR({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-noto-sans-kr",
  display: "swap",
});
