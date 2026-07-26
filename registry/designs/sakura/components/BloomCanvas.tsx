"use client";

import { useRef } from "react";
import { useBloomCanvas } from "../hooks/useBloomCanvas";
import { usePointerInk } from "../hooks/usePointerInk";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import type { ScrollProgress } from "../hooks/useScrollProgress";

type BloomCanvasProps = {
  /** Optional scroll-progress ref; when supplied, petals accumulate with scroll. */
  progress?: React.RefObject<ScrollProgress>;
  /** Accessible bilingual description of the scene. */
  ariaLabel: string;
  className?: string;
};

/**
 * The ink-bloom canvas: a DPR-aware stage where ink drops fall, strike the
 * waterline, and bloom into drifting petals. This thin wrapper owns the three
 * refs the physics needs (stage, canvas, pointer) and hands them to
 * useBloomCanvas; all the simulation lives in the hook.
 *
 * The stage is role="img" with a bilingual description (EN + JA), and the
 * canvas itself is aria-hidden — the meaning is conveyed by the label, the
 * motion by the pixels.
 */
export default function BloomCanvas({
  progress,
  ariaLabel,
  className,
}: BloomCanvasProps) {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const reduced = usePrefersReducedMotion();
  const { pointer, drops } = usePointerInk(stageRef);

  useBloomCanvas(stageRef, canvasRef, reduced, { pointer, drops, progress });

  return (
    <div
      ref={stageRef}
      className={className ?? "sakura-bloom"}
      role="img"
      aria-label={ariaLabel}
    >
      <canvas ref={canvasRef} className="sakura-bloom__canvas" aria-hidden="true" />
    </div>
  );
}
