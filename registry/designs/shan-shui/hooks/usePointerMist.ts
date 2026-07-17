"use client";

import { useEffect, useRef } from "react";

export type PointerSample = {
  /** Pointer x in stage-local CSS px (set when a hand is present). */
  x: number;
  /** Pointer y in stage-local CSS px. */
  y: number;
  /** Presence energy 0..1 — the canvas lerps this with attack/release. */
  e: number;
  /** performance.now() of the last pointermove. */
  t: number;
};

/**
 * Tracks a fine pointer (mouse/pen) into a ref, never re-rendering React.
 *
 * The canvas reads `target` each frame and lerps its own `ptr` toward it with
 * the asymmetric attack/release in tokens.json (pointer-breath): the painting
 * notices a hand within a quarter-second and takes a few seconds to forget it.
 * Touch is deliberately ignored — the mist self-drifts on touch devices so
 * nothing meaningful lives behind a hover. When the hand goes quiet (or never
 * existed) the canvas's autonomous breeze takes back over.
 *
 * `stageRef` is attached to the landscape stage; coordinates are reported
 * stage-local so the canvas needs no further translation.
 */
export function usePointerMist<T extends HTMLElement>() {
  const stageRef = useRef<T | null>(null);
  const target = useRef<PointerSample>({ x: 0, y: 0, e: 0, t: -1e9 });

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const fine = window.matchMedia(
      "(hover: hover) and (pointer: fine)",
    ).matches;
    if (!fine) return;

    const onMove = (ev: PointerEvent) => {
      if (ev.pointerType !== "mouse" && ev.pointerType !== "pen") return;
      const rect = stage.getBoundingClientRect();
      const x = ev.clientX - rect.left;
      const y = ev.clientY - rect.top;
      if (x < -60 || x > rect.width + 60 || y < -60 || y > rect.height + 60)
        return;
      target.current = { x, y, e: 1, t: performance.now() };
    };

    stage.addEventListener("pointermove", onMove);
    return () => stage.removeEventListener("pointermove", onMove);
  }, []);

  return { stageRef, target };
}
