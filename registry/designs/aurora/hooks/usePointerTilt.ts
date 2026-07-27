"use client";

import { useEffect, type RefObject } from "react";

/** Pointer-follow lerp per 60fps-normalized frame. Cards trail the cursor
 *  like held glass, not like a cursor — atmosphere, not input. */
const LERP = 0.12;
/** Max tilt in degrees each axis. Caps the effect so cards lean, not flip. */
const MAX_TILT = 7;
/** Max forward translate in px. The closer card lifts toward the visitor. */
const MAX_LIFT = 60;
/** Below this delta from target, the loop parks to cost zero frames at rest. */
const SETTLE = 0.04;

/**
 * The pointer-parallax technique. Each `[data-tilt]` element within the root
 * tilts in 3D toward the pointer — a subtle rotateX/rotateY plus a small
 * translateZ — by writing three custom properties (`--aurora-rx`, `--aurora-ry`,
 * `--aurora-lift`) straight onto the element. No React state, no re-render.
 *
 * The loop is shared and rAF-coalesced: a single requestAnimationFrame lerps
 * every card toward its target each frame and parks itself once all have
 * settled. An idle page costs nothing. On `pointerleave` of the root the
 * targets reset to flat and the cards ease back to rest.
 *
 * Under reduced motion the hook never starts; the CSS resting transform
 * (no tilt) is the whole experience, so touch and keyboard users lose
 * nothing — every card is fully readable flat.
 */
export function usePointerTilt(
  rootRef: RefObject<HTMLElement | null>,
  reduced: boolean,
): void {
  useEffect(() => {
    const root = rootRef.current;
    if (!root || reduced) return;

    const cards = Array.from(
      root.querySelectorAll<HTMLElement>("[data-tilt]"),
    );
    if (cards.length === 0) return;

    type Card = {
      el: HTMLElement;
      rx: number; // current smoothed rotateX (deg)
      ry: number; // current smoothed rotateY (deg)
      lift: number; // current smoothed translateZ (px)
      trx: number; // target rotateX
      tryR: number; // target rotateY
      tlift: number; // target lift
    };

    const state: Card[] = cards.map((el) => ({
      el,
      rx: 0,
      ry: 0,
      lift: 0,
      trx: 0,
      tryR: 0,
      tlift: 0,
    }));

    let px = 0; // pointer client coords
    let py = 0;
    let hasPointer = false;
    let raf = 0;
    let running = false;

    const apply = (c: Card) => {
      c.el.style.setProperty("--aurora-rx", `${c.rx.toFixed(2)}deg`);
      c.el.style.setProperty("--aurora-ry", `${c.ry.toFixed(2)}deg`);
      c.el.style.setProperty("--aurora-lift", `${c.lift.toFixed(1)}px`);
    };

    const step = () => {
      raf = requestAnimationFrame(step);
      let settled = true;
      for (const c of state) {
        const drx = c.trx - c.rx;
        const dry = c.tryR - c.ry;
        const dl = c.tlift - c.lift;
        c.rx += drx * LERP;
        c.ry += dry * LERP;
        c.lift += dl * LERP;
        apply(c);
        if (
          Math.abs(drx) > SETTLE ||
          Math.abs(dry) > SETTLE ||
          Math.abs(dl) > SETTLE
        ) {
          settled = false;
        }
      }
      if (settled) {
        running = false;
        cancelAnimationFrame(raf);
      }
    };

    const wake = () => {
      if (!running) {
        running = true;
        raf = requestAnimationFrame(step);
      }
    };

    const updateTargets = () => {
      for (const c of state) {
        if (!hasPointer) {
          c.trx = 0;
          c.tryR = 0;
          c.tlift = 0;
          continue;
        }
        const r = c.el.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        // Direction from card center toward the pointer, in viewport units.
        const dx = (px - cx) / window.innerWidth;
        const dy = (py - cy) / window.innerHeight;
        // Pointer above the card → top tips toward it (negative rotateX);
        // pointer to the right → right side dips (positive rotateY). Capped.
        c.trx = Math.max(-MAX_TILT, Math.min(MAX_TILT, -dy * MAX_TILT * 2.4));
        c.tryR = Math.max(-MAX_TILT, Math.min(MAX_TILT, dx * MAX_TILT * 2.4));
        // Lift scales with how directly the pointer hovers the card.
        const insideX = px >= r.left && px <= r.right;
        const insideY = py >= r.top && py <= r.bottom;
        c.tlift = insideX && insideY ? MAX_LIFT : MAX_LIFT * 0.28;
      }
      wake();
    };

    const onMove = (ev: PointerEvent) => {
      px = ev.clientX;
      py = ev.clientY;
      hasPointer = true;
      updateTargets();
    };

    const onLeave = () => {
      hasPointer = false;
      updateTargets();
    };

    const onVisibility = () => {
      if (document.hidden && running) {
        running = false;
        cancelAnimationFrame(raf);
      }
    };

    root.addEventListener("pointermove", onMove, { passive: true });
    root.addEventListener("pointerleave", onLeave);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      root.removeEventListener("pointermove", onMove);
      root.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", onVisibility);
      cancelAnimationFrame(raf);
    };
  }, [rootRef, reduced]);
}
