import { Libre_Caslon_Text, Nanum_Myeongjo } from "next/font/google";

/**
 * The two voices of the journal:
 * Nanum Myeongjo — the Korean serif; every Hangul glyph, the masthead 여백,
 * the essay's first language. It is the journal's own hand.
 * Libre Caslon Text — the Latin text face; transcreations, folios (italic),
 * the drop cap, captions. It answers, it never interrupts.
 *
 * styles.css consumes these as var(--font-nanum-myeongjo) /
 * var(--font-libre-caslon); page.tsx applies the .variable classes on the
 * entry root. The body stack puts Caslon first so Latin resolves there and
 * Hangul falls through into Myeongjo even without a lang attribute.
 */
export const nanumMyeongjo = Nanum_Myeongjo({
  weight: ["400", "700", "800"],
  subsets: ["latin"],
  variable: "--font-nanum-myeongjo",
  display: "swap",
});

export const libreCaslon = Libre_Caslon_Text({
  weight: ["400", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-libre-caslon",
  display: "swap",
});
