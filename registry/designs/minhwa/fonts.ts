import { Gaegu, Noto_Serif_KR, Fraunces } from "next/font/google";

/**
 * The three voices of the minhwa gallery:
 * Gaegu — the Korean display voice: the wordmark 민화, motif titles, seal
 *   captions, SFX. A naive hand-brushed face ( Gaegu is literally the
 *   rounded, folk handwriting of a village painter), so the headings read
 *   like they were brushed onto hanji, not set in a corporate sans. This is
 *   the page's folk/charming register — Black Han Sans would shout; Gaegu
 *   smiles.
 * Noto Serif KR — every Korean body glyph: the symbol-meaning narration,
 *   the obangsaek notes, the colophon. A warm serif so the captions read
 *   like a museum label written by someone who loves the painting.
 * Fraunces — the English voice: the subtitle, English captions, folio
 *   numbers. Optical-sized, cozy, the way an English museum card is set.
 *
 * styles.css consumes these as var(--font-display) / var(--font-kr) /
 * var(--font-en); page.tsx applies the .variable classes on the root.
 *
 * Korean is load-bearing, so Noto Serif KR ships with weight variants; Gaegu
 * is given the `latin` subset (its Hangul coverage rides the font file's own
 * CJK glyphs, which next/font preserves). Family stacks always lead with the
 * Korean face so Hangul never falls through to a default sans — see the
 * :lang(ko) rule in styles.css.
 */
export const gaegu = Gaegu({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

export const notoSerifKR = Noto_Serif_KR({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-kr",
  display: "swap",
});

export const fraunces = Fraunces({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-en",
  display: "swap",
});
