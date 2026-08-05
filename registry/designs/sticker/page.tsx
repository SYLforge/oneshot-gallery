import { blackHanSans, gaegu, inter } from "./fonts";
import Hero from "./components/Hero";
import ServiceMarquee from "./components/ServiceMarquee";
import StickerBoard from "./components/StickerBoard";
import StudioFooter from "./components/StudioFooter";
import StickerShell from "./components/StickerShell";

/**
 * STICKER — studio of bouncy things.
 * A playful design studio whose entire website is built from draggable,
 * springy stickers. Warm white ground, saturated sticker colors, chunky black
 * outlines, and a service marquee that scrolls like a fridge full of magnets.
 *
 * `.sticker-js` is added on mount so every JS-dependent style (grab cursors,
 * reveal-hide initial states, the rest wobble) is gated — with JavaScript
 * disabled the page is a finished sticker pile: everything readable, the
 * stickers sitting at their default scatter, nothing moving.
 *
 * This page is a SERVER component so `./styles.css` lands in the layout chunk
 * (a Next 16 Turbopack quirk had dropped the CSS chunk for this entry when it
 * was a dynamic-import client component). The shell holds the client-only
 * mount effect; everything else renders on the server.
 */
export default function StickerPage() {
  return (
    <StickerShell
      className={`${blackHanSans.variable} ${gaegu.variable} ${inter.variable} sticker-root`}
    >
      <Hero />
      <main>
        <ServiceMarquee />
        <StickerBoard />
      </main>
      <StudioFooter />

      {/* Paper warmth + dotted backing sheet: static feTurbulence noise and a
          radial dot grid, multiplied over the desk. Purely decorative,
          pointer-transparent. */}
      <div className="sticker-grain" aria-hidden="true">
        <svg width="100%" height="100%" preserveAspectRatio="none">
          <filter id="sticker-grain-f" x="0" y="0" width="100%" height="100%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.9"
              numOctaves="2"
              seed="3"
              stitchTiles="stitch"
            />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.05 0"
            />
          </filter>
          <rect width="100%" height="100%" filter="url(#sticker-grain-f)" />
        </svg>
      </div>
    </StickerShell>
  );
}
