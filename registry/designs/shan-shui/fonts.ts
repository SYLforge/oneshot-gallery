import { Cormorant_Garamond, Ma_Shan_Zheng, Noto_Serif_SC } from "next/font/google";

/**
 * The three voices of the scroll:
 * Cormorant Garamond — the Latin voice. The "SHAN-SHUI" wordmark (tracked
 *   wide), section titles, the italic asides that read like a colophon.
 *   A refined serif whose hairlines behave like a brush held lightly.
 * Ma Shan Zheng — every Chinese display glyph. 山水, the seal characters,
 *   the vertical couplet. A brush-calligraphy face (硬笔行楷) whose strokes
 *   still remember the hand — the entire premise of a literati painting.
 * Noto Serif SC — Chinese prose scale, where Ma Shan Zheng's calligraphy
 *   would be illegible. The quiet mincho-voice for body 中文.
 *
 * styles.css consumes these as var(--font-cormorant) / var(--font-mashan) /
 * var(--font-notosc); page.tsx applies the .variable classes on the root.
 * The display stack is `Cormorant, Ma Shan Zheng, serif`, so the giant 山水
 * falls through the Latin face into the brush face with no markup at all.
 * `:lang(zh)` additionally sets the brush face explicitly for any inline
 * display-sized Chinese.
 */
export const cormorant = Cormorant_Garamond({
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-cormorant",
  display: "swap",
});

export const maShanZheng = Ma_Shan_Zheng({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-mashan",
  display: "swap",
});

export const notoSerifSC = Noto_Serif_SC({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-notosc",
  display: "swap",
});
