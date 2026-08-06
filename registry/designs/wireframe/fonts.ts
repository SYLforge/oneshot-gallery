import { JetBrains_Mono, Noto_Sans_KR } from "next/font/google";

/**
 * The two voices of WIREFRAME 와이어프레임 — a 3D wireframe studio.
 *
 * JetBrains Mono — the wire voice. A sharp monospaced grotesque that reads
 *   like the vertex/edge labels of a CAD viewport; it carries the wordmark
 *   (drawn as outlined glyphs, transparent fill, green stroke — a literal
 *   wireframe of the letters) and every technical label.
 *
 * Noto Sans KR — every Hangul glyph. A clean modern grotesque so the Korean
 *   reads contemporary, not the heavy brush of a traditional studio.
 *
 * styles.css consumes these as var(--font-jetbrains-mono) /
 * var(--font-noto-sans-kr); page.tsx applies the .variable classes on the
 * entry root.
 */
export const jetbrainsMono = JetBrains_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const notoSansKR = Noto_Sans_KR({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-noto-sans-kr",
  display: "swap",
});
