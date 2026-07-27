"use client";

import { useRef, type CSSProperties } from "react";
import PixelSprite from "./PixelSprite";
import {
  HERO_BLINK_EYES,
  HERO_BLINK_ERASE,
  HERO_FRAME_0,
} from "./sprites";
import { useSpriteCycle } from "../hooks/useSpriteCycle";

type Props = {
  /** Pixel pitch. Hero mascot renders at 3px for ~48px tall. */
  scale?: number;
  reduced: boolean;
  className?: string;
  style?: CSSProperties;
};

/**
 * The hero mascot: a cheerful 16×16 cabinet sprite that blinks on idle.
 * The cycle is two frames — eyes-open (frame 0) and a blink — driven by
 * `useSpriteCycle`, which pauses offscreen and under reduced motion.
 *
 * Because the blink is implemented as an *overlay* of a few pixels over
 * the base frame (erase the open eyes with body color, draw two short
 * closed-eye bars), pausing always leaves a complete, legible sprite on
 * screen. Reduced motion parks on frame 0 — a real, composed still.
 */
export default function PixelCharacter({
  scale = 3,
  reduced,
  className,
  style,
}: Props) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const frame = useSpriteCycle(ref, 2, reduced);

  return (
    <span
      ref={ref}
      className={className ? `pixel-char ${className}` : "pixel-char"}
      style={style}
    >
      <PixelSprite
        pixels={HERO_FRAME_0}
        scale={scale}
        label="PIXEL — the studio mascot, a smiling bubblegum-pink arcade cabinet with a cyan screen-face, a mint cheek, and a yellow antenna lamp. 픽셀 — 스튜디오 마스코트, 미소 짓는 버블검 핑크 아케이드 캐비닛."
      />
      {frame === 1 && (
        <span className="pixel-char__blink" aria-hidden="true">
          <PixelSprite pixels={HERO_BLINK_ERASE} scale={scale} />
          <PixelSprite pixels={HERO_BLINK_EYES} scale={scale} />
        </span>
      )}
    </span>
  );
}
