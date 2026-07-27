import { Inter, Noto_Sans_KR, Space_Grotesk } from "next/font/google";

/**
 * The three voices of AURORA — all geometric sans, by design. Where LUMEN
 * NORD pairs a variable serif (Hahmlet) with an instrument sans to read as
 * an old institution, AURORA commits to sans end to end: it is a product
 * launch page, and the type should feel assembled today.
 *
 * Space Grotesk — the launch voice: display headlines, kickers, the mast.
 *   Slightly idiosyncratic letterforms (the `a`, the `G`) keep it out of
 *   the Inter-everywhere default.
 * Inter — the interface voice: body copy, labels, CTAs, UI chrome.
 * Noto Sans KR — every Hangul glyph on the page. Korean never falls through
 *   into a Latin geometric and never gets a system-sans fallback.
 *
 * styles.css consumes these as var(--font-display) / var(--font-body) /
 * var(--font-kr); page.tsx applies the .variable classes on the entry root.
 * Both Latin working stacks put Noto Sans KR last, so Hangul routes into it
 * with no markup at all — and :lang(ko) additionally tightens tracking and
 * sets word-break: keep-all so Korean phrases stay whole.
 */
export const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const notoSansKR = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-kr",
  display: "swap",
});
