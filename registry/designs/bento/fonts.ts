import { Plus_Jakarta_Sans, Noto_Sans_KR } from "next/font/google";

/**
 * BENTO 벤토 — design that holds. The voice is the box itself: clean, dense,
 * confident, friendly. Plus Jakarta Sans — a soft, geometric grotesque whose
 * weight goes to 800 without going brittle; it carries the wordmark and the
 * tile labels. Noto Sans KR (400/500/700) — the calm Hangul that fits a tile.
 *
 * styles.css consumes these as var(--font-plus-jakarta-sans) /
 * var(--font-noto-sans-kr); page.tsx applies the .variable classes on the
 * entry root.
 */
export const plusJakartaSans = Plus_Jakarta_Sans({
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
  variable: "--font-plus-jakarta-sans",
  display: "swap",
});

export const notoSansKR = Noto_Sans_KR({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-noto-sans-kr",
  display: "swap",
});
