"use client";

import { useCallback, useRef, type RefObject } from "react";

/**
 * FLIP (First, Last, Invert, Play) for the 6↔12 column re-certification.
 *
 * `flip(mutate)` measures every `[data-flip]` element inside the scope,
 * runs `mutate` (which must apply the new layout synchronously — the caller
 * wraps its setState in `flushSync`), measures again, then inverts each
 * element with a transform and releases it on the next frame so the CSS
 * `transition: transform` in styles.css plays it home.
 *
 * All reads are batched before all writes — the whole measure/invert pass
 * costs exactly two layout passes, both user-initiated (never during
 * scroll). Re-toggling mid-flight is safe: First is measured from the
 * element's *visual* rect (getBoundingClientRect includes the in-flight
 * transform), so the new animation starts where the eye currently is.
 */
export function useFlip(scopeRef: RefObject<HTMLElement | null>) {
  const rafRef = useRef(0);

  return useCallback(
    (mutate: () => void) => {
      const scope = scopeRef.current;
      if (!scope) {
        mutate();
        return;
      }

      // A pending release from a previous toggle must not clobber the
      // inversion we are about to write.
      cancelAnimationFrame(rafRef.current);

      const targets = Array.from(
        scope.querySelectorAll<HTMLElement>("[data-flip]"),
      );

      // FIRST — visual rects, including any in-flight transform.
      const first = targets.map((el) => el.getBoundingClientRect());

      // Clear in-flight transforms (silently — transitions locked) so LAST
      // is measured from clean layout.
      for (const el of targets) {
        el.style.transition = "none";
        el.style.transform = "";
      }

      // The caller flips the data-grid state here, synchronously.
      mutate();

      // LAST + INVERT.
      const viewTop = -window.innerHeight * 1.5;
      const viewBottom = window.innerHeight * 2.5;
      targets.forEach((el, i) => {
        const f = first[i];
        const l = el.getBoundingClientRect();
        if (l.width === 0 || l.height === 0) return;
        // Blocks that were and remain far offscreen animate for nobody.
        if (
          (f.bottom < viewTop && l.bottom < viewTop) ||
          (f.top > viewBottom && l.top > viewBottom)
        ) {
          return;
        }
        const dx = f.left - l.left;
        const dy = f.top - l.top;
        const sx = f.width / l.width;
        const sy = f.height / l.height;
        if (
          Math.abs(dx) < 0.5 &&
          Math.abs(dy) < 0.5 &&
          Math.abs(sx - 1) < 0.003 &&
          Math.abs(sy - 1) < 0.003
        ) {
          return;
        }
        el.style.transformOrigin = "0 0";
        el.style.transform = `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})`;
      });

      // PLAY — two frames so the inverted state is committed to paint before
      // the inline transition lock is lifted and styles.css takes over.
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = requestAnimationFrame(() => {
          for (const el of targets) {
            el.style.transition = "";
            el.style.transform = "";
          }
        });
      });
    },
    [scopeRef],
  );
}
