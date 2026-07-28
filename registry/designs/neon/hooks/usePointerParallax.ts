"use client";

import { useEffect, type RefObject } from "react";

/**
 * Pointer parallax for the NEON street scene. Writes normalized pointer
 * offsets (-0.5 → 0.5) to `--neon-px` / `--neon-py` on the referenced stage,
 * so the skyline, hanging signs, and puddle reflections drift at different
 * depths as you move. Pure input→style mapping (no animation loop), so it
 * stays live under reduced motion — only the *drift* is disabled there, the
 * scene still composes statically.
 *
 * Pointer is optional: with no pointer (touch), the scene simply sits at its
 * resting position — every layer is designed to look complete at 0,0.
 */
export function usePointerParallax(
  ref: RefObject<HTMLElement | null>,
  disabled: boolean,
): void {
  useEffect(() => {
    if (disabled) return;
    const el = ref.current;
    if (!el) return;

    const onMove = (ev: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const x = (ev.clientX - rect.left) / rect.width - 0.5;
      const y = (ev.clientY - rect.top) / rect.height - 0.5;
      el.style.setProperty("--neon-px", x.toFixed(3));
      el.style.setProperty("--neon-py", y.toFixed(3));
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [ref, disabled]);
}
