import { Cormorant_Garamond, Noto_Serif_KR } from "next/font/google";

/**
 * The two voices of the studio:
 *
 * Noto Serif KR — the Korean serif; the studio's first language. Every
 *   Hangul glyph lives here: the wordmark 늘어, the pose names 산·하늘·
 *   나무, the studio note. Noto Serif KR draws its vertical metrics
 *   deliberately, so when the type stretches on scroll (transform:
 *   scaleY) the Hangul reads as a body reaching in a pose, not as a
 *   distorted font. Weight 700 for the wordmark and pose names, 400 for
 *   the body note.
 * Cormorant Garamond — the tall Latin voice. STRETCH, the EN answers,
 *   captions, ordinals. Cormorant carries long ascenders and a narrow
 *   set, which is exactly the morphology that elongates gracefully as
 *   scaleY grows — the letters look like they were drawn to be
 *   stretched, never strained. Weights 400/500/600, with italics for the
 *   EN transcreations so they answer at half a step quieter.
 *
 * styles.css consumes these as var(--font-noto-kr) /
 * var(--font-cormorant); page.tsx applies the .variable classes on the
 * entry root. The body stack runs Cormorant → Noto Serif KR → serif so
 * Latin resolves in Cormorant and Hangul falls through into Noto Serif KR
 * with no markup; :lang(ko) additionally pins Noto Serif KR, applies
 * word-break: keep-all, and loosens leading.
 */
export const notoSerifKR = Noto_Serif_KR({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-noto-kr",
  display: "swap",
});

export const cormorantGaramond = Cormorant_Garamond({
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-cormorant",
  display: "swap",
});
