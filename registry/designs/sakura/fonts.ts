import { Cormorant_Garamond, Noto_Serif_KR, Shippori_Mincho } from "next/font/google";

/**
 * The three voices of the ink garden — trilingual, per the gallery's i18n
 * policy: Korean is the main reading voice, Japanese is the decorative
 * source glyph, English is the subtitle.
 *
 * Shippori Mincho — every Japanese glyph: the vertical 桜花 title (tategaki),
 *   the verse markers (一 二 三 四), the seal stamps. A mincho whose vertical
 *   metrics were drawn first; it is the face of a poem hung in an alcove, and
 *   it carries writing-mode: vertical-rl without complaint. The source voice
 *   of the sakura motif, which is Japanese at its root.
 * Noto Serif KR — the Korean main voice. 벚꽃, the verse body, the ledes and
 *   footers. A Korean serif whose strokes remember the brush, matching the
 *   mincho's restraint so the two scripts read as one family. This is the
 *   voice that actually speaks — 한국어 메인.
 * Cormorant Garamond — the Latin subtitle voice: the wordmark SAKURA, the
 *   English subtitle beneath the title, the captions and colophon. A quiet
 *   noble serif with a long ascender — the register of a slow letter, never
 *   shouting. Also the numerals (verse count, year) for their lining figures.
 *
 * styles.css consumes these as var(--font-mincho) / var(--font-kr) /
 * var(--font-cormorant); page.tsx applies the .variable classes on the entry
 * root. The body stack runs Cormorant → Korean → mincho so each script falls
 * through into its own voice; :lang(ja) and :lang(ko) pin their faces and
 * tune tracking.
 */
export const shipporiMincho = Shippori_Mincho({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-mincho",
  display: "swap",
});

export const notoSerifKR = Noto_Serif_KR({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-kr",
  display: "swap",
});

export const cormorantGaramond = Cormorant_Garamond({
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-cormorant",
  display: "swap",
});
