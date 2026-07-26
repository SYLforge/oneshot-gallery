import { Archivo, Black_Han_Sans, Noto_Sans_KR, Space_Mono } from "next/font/google";

/**
 * The four voices of TYPEWAVE — type is the instrument, so the voices are
 * instruments:
 *
 * Archivo — the synthesizer. Loaded as a variable font with the WIDTH axis
 *   (wdth 62–125) and the WEIGHT axis (wght 100–900). The width axis is the
 *   page's signature: it scrubs and stretches exactly like an audio waveform.
 *   Carries the Latin wordmark and every Latin display head.
 * Black Han Sans — the Korean drum. A heavy, blocky display face used for the
 *   Korean wordmark and section heads; its mass is what the acid accent reads
 *   against. No weight axis — it is one loud voice.
 * Noto Sans KR — the Korean body voice, for prose, captions, and track titles.
 *   Korean text never falls through to a Latin sans.
 * Space Mono — the patch sheet: BPM, timecodes, channel strips, track numbers.
 *
 * styles.css consumes these as var(--font-archivo) / var(--font-black-han) /
 * var(--font-noto-kr) / var(--font-space-mono); page.tsx applies the
 * .variable classes on the entry root. The Archivo stack lists Black Han Sans
 * after it so a Korean glyph in a display head falls through to a deliberate
 * heavy face instead of the default sans.
 */
export const archivo = Archivo({
  weight: "variable",
  // The weight axis (wght) is always bundled with a variable Archivo; `axes`
  // is only for the *extra* axes, which here is the width axis — the entry's
  // entire kinetic premise.
  axes: ["wdth"],
  subsets: ["latin"],
  variable: "--font-archivo",
  display: "swap",
});

export const blackHanSans = Black_Han_Sans({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-black-han",
  display: "swap",
});

export const notoSansKR = Noto_Sans_KR({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-noto-kr",
  display: "swap",
});

export const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-space-mono",
  display: "swap",
});
