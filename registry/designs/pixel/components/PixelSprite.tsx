"use client";

import { type CSSProperties } from "react";
import { spriteSize, spriteToBoxShadow, type Pixel } from "./sprites";

type Props = {
  /** The sprite pixels to render. */
  pixels: readonly Pixel[];
  /** Pixel pitch multiplier — 1 = 1px pixels, 2 = 2px, etc. */
  scale?: number;
  /** Extra class for art direction (e.g. .pixel-hero__sprite). */
  className?: string;
  /** Inline style passthrough (positioning). */
  style?: CSSProperties;
  /** Accessible label — the sprite is decorative by default (aria-hidden). */
  label?: string;
};

/**
 * The one-element pixel renderer: a 1px×1px anchor whose `box-shadow` is the
 * whole sprite. Each lit pixel is one shadow tuple, so a 200-pixel mascot
 * is a single DOM node with a long shadow list — the browser composites it
 * once. `image-rendering: pixelated` is set in CSS so any scaling stays
 * crisp-blocky instead of bilinear-soft.
 *
 * Decorative sprites are aria-hidden; pass a `label` to expose the sprite
 * as a role="img" with a bilingual description (used on the hero mascot).
 */
export default function PixelSprite({
  pixels,
  scale = 1,
  className,
  style,
  label,
}: Props) {
  const { width, height } = spriteSize(pixels);
  const box = spriteToBoxShadow(pixels, scale);
  const anchorStyle: CSSProperties = {
    width: `${scale}px`,
    height: `${scale}px`,
    boxShadow: box,
  };
  const wrapStyle: CSSProperties = {
    width: `${width * scale}px`,
    height: `${height * scale}px`,
    ...style,
  };
  if (label) {
    return (
      <span
        className={className ? `pixel-sprite ${className}` : "pixel-sprite"}
        style={wrapStyle}
        role="img"
        aria-label={label}
      >
        <span className="pixel-sprite__anchor" style={anchorStyle} />
      </span>
    );
  }
  return (
    <span
      className={className ? `pixel-sprite ${className}` : "pixel-sprite"}
      style={wrapStyle}
      aria-hidden="true"
    >
      <span className="pixel-sprite__anchor" style={anchorStyle} />
    </span>
  );
}
