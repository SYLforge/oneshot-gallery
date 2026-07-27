"use client";

import { useEffect, useRef, useState } from "react";

/** Glitch glyph pool — half-width block elements + symbols. */
const POOL = " ▖▚▞▟█▓▒░#%=+*<>{}[]/\\|~^";
/** The stable characters that are never replaced (the figure must stay legible). */
const STABLE = " .:-=+*#%@_/\\|";

/**
 * Periodically corrupt a slice of an ASCII block and resolve it back.
 *
 * `lines` is the clean ASCII art. Every `intervalMs`, a `slicePct` fraction of
 * the non-space cells are swapped for a random glyph from POOL; after
 * `resolveMs` the original returns. 65% of the cells are never touched (they
 * sit in STABLE), so the figure remains readable through the noise — this is
 * corruption as ornament, not destruction.
 *
 * Returns the *clean* lines when `disabled` (reduced motion) or before JS
 * mounts, so SSR / no-JS shows the pristine figure.
 */
export function useAsciiScramble(
  lines: string[],
  opts?: { intervalMs?: number; slicePct?: number; resolveMs?: number },
  disabled?: boolean,
): string[] {
  const intervalMs = opts?.intervalMs ?? 2600;
  const slicePct = opts?.slicePct ?? 0.35;
  const resolveMs = opts?.resolveMs ?? 220;

  const [out, setOut] = useState<string[]>(lines);
  const raf = useRef(0);

  useEffect(() => {
    if (disabled) return;
    let alive = true;

    const corrupted = (): string[] =>
      lines.map((row) =>
        row
          .split("")
          .map((ch) => {
            if (ch === " " || ch === "\n") return ch;
            if (STABLE.includes(ch) && Math.random() > slicePct) return ch;
            return POOL[(Math.random() * POOL.length) | 0];
          })
          .join(""),
      );

    const cycle = () => {
      if (!alive) return;
      setOut(corrupted());
      // resolve back to clean after the burst
      window.setTimeout(() => {
        if (alive) setOut(lines);
      }, resolveMs);
    };

    const id = window.setInterval(cycle, intervalMs);
    return () => {
      alive = false;
      window.clearInterval(id);
      cancelAnimationFrame(raf.current);
    };
  }, [lines, intervalMs, slicePct, resolveMs, disabled]);

  return out;
}
