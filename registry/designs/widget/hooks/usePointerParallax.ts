"use client";

import { useEffect, type RefObject } from "react";

/**
 * usePointerParallax — the spatial-depth signature.
 *
 * Each `[data-tilt]` widget inside the root leans in 3D toward the pointer
 * like a piece of held glass — a subtle rotateX/rotateY plus a forward
 * translateZ — by writing four custom properties (`--w-rx`, `--w-ry`,
 * `--w-lift`, `--w-float`) straight onto the element. No React state, no
 * re-render.
 *
 * DEPTH. Each card declares `data-depth` ∈ {near,mid,far} (or a number 1–3).
 * A near card tilts the most and lifts furthest; a far card barely moves —
 * so the field reads as real parallax, the near widgets floating forward
 * while the distant ones drift. This is the visionOS spatial cue: depth,
 * not just rotation.
 *
 * LOOP. The loop is shared and rAF-coalesced: a single requestAnimationFrame
 * lerps every card toward its target each frame (trailing the cursor — glass,
 * not cursor) and parks itself once all have settled. An idle page costs
 * nothing. On `pointerleave` of the root the targets reset to flat and the
 * cards ease back to rest.
 *
 * REDUCED MOTION. The hook never starts; the CSS resting transform (no tilt)
 * is the whole experience, so touch and keyboard users lose nothing — every
 * widget is fully readable flat, the dashboard complete without parallax.
 */

/** Trail factor per 60fps-normalized frame — cards lag the cursor like glass. */
const LERP = 0.12;
/** Max tilt in degrees each axis — caps the lean so cards tilt, not flip. */
const MAX_TILT = 9;
/** Max forward translate (px). The nearer the depth, the more it lifts. */
const MAX_LIFT = 64;
/** Below this delta from target the loop parks — costs zero frames at rest. */
const SETTLE = 0.04;

/** Depth multipliers: near tilts/lifts most, far least. visionOS parallax. */
const DEPTH = {
  near: { tilt: 1.0, lift: 1.0 },
  mid: { tilt: 0.62, lift: 0.58 },
  far: { tilt: 0.34, lift: 0.32 },
} as const;

function depthOf(el: HTMLElement): { tilt: number; lift: number } {
  const raw = el.dataset.depth ?? "mid";
  if (raw in DEPTH) return DEPTH[raw as keyof typeof DEPTH];
  const n = Number(raw);
  if (!Number.isNaN(n)) {
    // numeric 1..3 map: 3 = near, 1 = far (legacy compatibility).
    if (n >= 3) return DEPTH.near;
    if (n >= 2) return DEPTH.mid;
    return DEPTH.far;
  }
  return DEPTH.mid;
}

export function usePointerParallax(
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
      tilt: number; // depth tilt multiplier
      liftMul: number; // depth lift multiplier
      rx: number; // smoothed rotateX (deg)
      ry: number; // smoothed rotateY (deg)
      lift: number; // smoothed translateZ (px)
      trx: number; // target rotateX
      try_: number; // target rotateY
      tlift: number; // target lift
    };

    const state: Card[] = cards.map((el) => {
      const d = depthOf(el);
      return {
        el,
        tilt: d.tilt,
        liftMul: d.lift,
        rx: 0,
        ry: 0,
        lift: 0,
        trx: 0,
        try_: 0,
        tlift: 0,
      };
    });

    let px = 0;
    let py = 0;
    let hasPointer = false;
    let raf = 0;
    let running = false;

    const apply = (c: Card) => {
      c.el.style.setProperty("--w-rx", `${c.rx.toFixed(2)}deg`);
      c.el.style.setProperty("--w-ry", `${c.ry.toFixed(2)}deg`);
      c.el.style.setProperty("--w-lift", `${c.lift.toFixed(1)}px`);
    };

    const step = () => {
      raf = requestAnimationFrame(step);
      let settled = true;
      for (const c of state) {
        const drx = c.trx - c.rx;
        const dry = c.try_ - c.ry;
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
          c.try_ = 0;
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
        // pointer to the right → right side dips (positive rotateY). Capped
        // and scaled by depth — near cards lean fully, far cards barely.
        c.trx = Math.max(
          -MAX_TILT,
          Math.min(MAX_TILT, -dy * MAX_TILT * 2.4 * c.tilt),
        );
        c.try_ = Math.max(
          -MAX_TILT,
          Math.min(MAX_TILT, dx * MAX_TILT * 2.4 * c.tilt),
        );
        // Lift scales with how directly the pointer hovers the card, and with
        // depth — a near card under the cursor rises fully toward the visitor.
        const insideX = px >= r.left && px <= r.right;
        const insideY = py >= r.top && py <= r.bottom;
        const hover = insideX && insideY ? 1 : 0.3;
        c.tlift = MAX_LIFT * hover * c.liftMul;
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
