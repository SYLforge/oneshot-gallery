import { Cormorant_Garamond, Noto_Serif_KR } from "next/font/google";

/**
 * The two voices of the house:
 * Cormorant Garamond — the Latin voice; the wordmark, the section titles,
 *   and the italic asides that read like a perfumer's handwritten note. A
 *   high-contrast display serif whose strokes still remember the steel nib,
 *   which is the whole premise (ink, drawn, then bloomed into watercolor).
 *   400 for the display and italic voices, 500 for the few load-bearing
 *   moments — the register of someone writing a formula slowly.
 * Noto Serif KR — the Korean voice, and the first-class script of the page.
 *   The gallery is Korean-first bilingual, so every Hangul reading line —
 *   the main voice, the scent names, the sign-off — sets in a serif whose
 *   brush-weight strokes match the Cormorant's restraint. A Korean serif
 *   that also remembers the brush.
 *
 * styles.css consumes these as var(--font-cormorant) / var(--font-kr);
 * page.tsx applies the .variable classes on the entry root. The display
 * stack runs Cormorant first, then Korean, then the system serif, so the
 * giant 피다 falls through the Latin face into Noto Serif KR with no extra
 * markup — the title's Hangul weight is a font-stack accident made
 * load-bearing.
 */
export const cormorantGaramond = Cormorant_Garamond({
  weight: ["400", "500"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-cormorant",
  display: "swap",
});

export const notoSerifKR = Noto_Serif_KR({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-kr",
  display: "swap",
});
