"use client";

import { useEffect, useRef } from "react";

export type PointerInkSample = {
  /** Pointer x in stage-local CSS px (0 if no fine pointer / never moved). */
  x: number;
  /** Pointer y in stage-local CSS px. */
  y: number;
  /** Pointer energy 0..1 — attack on move, decay on stillness. */
  e: number;
  /** performance.now() of the last move. */
  t: number;
};

export type InkDropRequest = {
  /** Stage-local x where ink should bloom. */
  x: number;
  /** Stage-local y where the drop should be released (top of fall). */
  y: number;
  /** performance.now() — lets the canvas coalesce rapid taps. */
  t: number;
};

/**
 * Tracks fine-pointer position into a ref (for the canvas wind field) and
 * exposes a queue of pending ink-drop requests that a click/tap enqueues.
 *
 * The hook never re-renders React. The canvas's own rAF loop reads
 * `pointer.current` for the wind bias, and drains `drops.current` to spawn
 * fresh ink on pointer-down. This keeps pointer reactivity off the React
 * render path entirely — the same pattern KEMURI's pointer-lean uses.
 *
 * Energy (e) lerps are intentionally the consumer's job: the rAF loop sees
 * dt and can frame-rate-normalize the attack/release. Here we only record
 * raw position + a 0..1 target (1 on move, decaying toward 0 on stillness
 * via the consumer). For simplicity and because the consumer already lerps,
 * we set e=1 on each move and let the consumer decay it — identical to how
 * SmokeCanvas treats lastMove.
 *
 * Clicks/taps push an InkDropRequest into `drops`. The canvas owns draining
 * (shift on consume) so a rapid double-tap yields two blooms, not one
 * coalesced.
 *
 * `enabled=false` (reduced motion, or no fine pointer) still wires
 * pointer-down for taps — touch users should be able to drop ink — but
 * pointer-move wind bias is left to the canvas to ignore when e stays 0.
 */
export function usePointerInk<T extends HTMLElement>(stageRef: React.RefObject<T | null>) {
  const pointer = useRef<PointerInkSample>({ x: 0, y: 0, e: 0, t: -1e9 });
  const drops = useRef<InkDropRequest[]>([]);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const fine = window.matchMedia(
      "(hover: hover) and (pointer: fine)",
    ).matches;

    const localXY = (clientX: number, clientY: number) => {
      const rect = stage.getBoundingClientRect();
      return { x: clientX - rect.left, y: clientY - rect.top };
    };

    const onPointerMove = (ev: PointerEvent) => {
      if (ev.pointerType !== "mouse" && ev.pointerType !== "pen") return;
      const { x, y } = localXY(ev.clientX, ev.clientY);
      const rect = stage.getBoundingClientRect();
      // ignore moves well outside the stage so the wind only answers a hand
      // actually over the garden.
      if (x < -60 || x > rect.width + 60 || y < -60 || y > rect.height + 60)
        return;
      pointer.current = { x, y, e: 1, t: performance.now() };
    };

    const onPointerDown = (ev: PointerEvent) => {
      const { x } = localXY(ev.clientX, ev.clientY);
      // Drop ink from the top of the stage above the tap, so it falls and
      // blooms where the user touched — the signature interaction.
      drops.current.push({ x, y: 0, t: performance.now() });
    };

    if (fine) stage.addEventListener("pointermove", onPointerMove);
    stage.addEventListener("pointerdown", onPointerDown);

    return () => {
      if (fine) stage.removeEventListener("pointermove", onPointerMove);
      stage.removeEventListener("pointerdown", onPointerDown);
    };
  }, [stageRef]);

  return { pointer, drops };
}
