import { Nanum_Myeongjo, Noto_Serif_KR, JetBrains_Mono } from "next/font/google";

/**
 * The three voices of the hanok atelier — Korean is the first language:
 *
 * Noto Serif KR — the structural face: section titles, the hanja and
 * Hangul of the building's parts (처마, 대들보, 기둥, 마루, 주춧돌). A serif
 * reads as architectural — load-bearing, cut into the wood, not floating.
 *
 * Nanum Myeongjo — display Hangul for the hero name 한옥 and zone headings;
 * a heavier, more carved-serif myungjo than Noto Serif KR's body voice.
 *
 * JetBrains Mono — the blueprint/joinery annotations: layer callouts,
 * mortise-and-tenon dimensions, season labels. The draftsman's pencil.
 *
 * styles.css consumes these as var(--font-noto-kr) / var(--font-nanum) /
 * var(--font-jbmono); page.tsx applies the .variable classes on the root.
 * All three declare ["latin"] for subsetting; Hangul ships via unicode-range
 * CSS so nothing preloadable is missed.
 */
export const notoSerifKr = Noto_Serif_KR({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-noto-kr",
  display: "swap",
});

export const nanumMyeongjo = Nanum_Myeongjo({
  weight: ["400", "700", "800"],
  subsets: ["latin"],
  variable: "--font-nanum",
  display: "swap",
});

export const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jbmono",
  display: "swap",
});
