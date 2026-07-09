"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";

const DURATION_MS = 420;
const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

export type FlipController = {
  /** Ref-callback factory for the morphing outer boxes. */
  setOuter: (id: string) => (el: HTMLElement | null) => void;
  /** Ref-callback factory for the counter-scaled content wrappers. */
  setInner: (id: string) => (el: HTMLElement | null) => void;
  /** Call synchronously BEFORE the layout-changing state update (First). */
  capture: () => void;
  /** Call in useLayoutEffect AFTER React commits the new layout (Last-Invert-Play). */
  play: () => void;
};

type Moved = { id: string; outer: HTMLElement; inner?: HTMLElement };

/**
 * Last + Invert, in one pass: measure each tile's new rect, and transform
 * any tile that moved back onto its old one (translate + scale, origin
 * 0 0) with transitions disabled. Inner wrappers get the inverse scale so
 * type never stretches mid-morph. getBoundingClientRect includes
 * in-flight transforms, so interrupting a running morph retargets
 * smoothly from wherever the tile visually is.
 */
function invertMoved(
  outers: ReadonlyMap<string, HTMLElement>,
  inners: ReadonlyMap<string, HTMLElement>,
  firstRects: ReadonlyMap<string, DOMRect>,
): Moved[] {
  const moved: Moved[] = [];
  for (const [id, el] of outers) {
    const before = firstRects.get(id);
    if (!before) continue;
    const after = el.getBoundingClientRect();
    const dx = before.left - after.left;
    const dy = before.top - after.top;
    const sx = after.width > 0 ? before.width / after.width : 1;
    const sy = after.height > 0 ? before.height / after.height : 1;
    if (
      Math.abs(dx) < 0.5 &&
      Math.abs(dy) < 0.5 &&
      Math.abs(sx - 1) < 0.003 &&
      Math.abs(sy - 1) < 0.003
    ) {
      continue; // did not move — leave it alone
    }

    const inner = inners.get(id);
    el.style.transition = "none";
    el.style.transformOrigin = "0 0";
    el.style.transform = `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})`;
    el.style.willChange = "transform";
    if (inner) {
      inner.style.transition = "none";
      inner.style.transformOrigin = "0 0";
      inner.style.transform = `scale(${1 / sx}, ${1 / sy})`;
      inner.style.willChange = "transform";
    }
    moved.push({ id, outer: el, inner });
  }
  return moved;
}

/**
 * Play: two rAFs later (the inverted frame must reach the compositor
 * first) transitions come on and the transforms are released, letting the
 * browser tween every tile to identity. Inline styles are cleaned up
 * after the tween so hover/CSS rules regain control.
 */
function releaseMoved(moved: Moved[], timers: Map<string, number>): void {
  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(() => {
      for (const { id, outer, inner } of moved) {
        outer.style.transition = `transform ${DURATION_MS}ms ${EASE}`;
        outer.style.transform = "";
        if (inner) {
          inner.style.transition = `transform ${DURATION_MS}ms ${EASE}`;
          inner.style.transform = "";
        }
        const old = timers.get(id);
        if (old !== undefined) window.clearTimeout(old);
        timers.set(
          id,
          window.setTimeout(() => {
            for (const el of [outer, inner]) {
              if (!el) continue;
              el.style.transition = "";
              el.style.transform = "";
              el.style.transformOrigin = "";
              el.style.willChange = "";
            }
            timers.delete(id);
          }, DURATION_MS + 80),
        );
      }
    });
  });
}

/**
 * Shared-element FLIP for a set of sibling tiles whose grid placement
 * changes together.
 *
 *   First  — capture() reads every registered outer rect before the state
 *            update.
 *   Last   — play() (from useLayoutEffect, i.e. post-layout, pre-paint)
 *            reads the new rects.
 *   Invert — see invertMoved().
 *   Play   — see releaseMoved().
 *
 * Transform-only by construction: layout happens once, at the React
 * commit; the animation itself never touches layout again.
 */
export function useFlip(): FlipController {
  const outers = useRef(new Map<string, HTMLElement>());
  const inners = useRef(new Map<string, HTMLElement>());
  const first = useRef<Map<string, DOMRect> | null>(null);
  const timers = useRef(new Map<string, number>());

  useEffect(() => {
    const pending = timers.current;
    return () => {
      for (const t of pending.values()) window.clearTimeout(t);
      pending.clear();
    };
  }, []);

  const setOuter = useCallback(
    (id: string) => (el: HTMLElement | null) => {
      if (el) outers.current.set(id, el);
      else outers.current.delete(id);
    },
    [],
  );

  const setInner = useCallback(
    (id: string) => (el: HTMLElement | null) => {
      if (el) inners.current.set(id, el);
      else inners.current.delete(id);
    },
    [],
  );

  const capture = useCallback(() => {
    const rects = new Map<string, DOMRect>();
    for (const [id, el] of outers.current) {
      rects.set(id, el.getBoundingClientRect());
    }
    first.current = rects;
  }, []);

  const play = useCallback(() => {
    const firstRects = first.current;
    first.current = null;
    if (!firstRects) return; // nothing captured — instant layout change

    const moved = invertMoved(outers.current, inners.current, firstRects);
    if (moved.length === 0) return;
    releaseMoved(moved, timers.current);
  }, []);

  return useMemo(
    () => ({ setOuter, setInner, capture, play }),
    [setOuter, setInner, capture, play],
  );
}
