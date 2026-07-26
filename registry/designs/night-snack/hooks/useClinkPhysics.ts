"use client";

import { useEffect, useRef } from "react";

export type Clink = {
  /** x of the clink in the shared stage's local px space (for the spark) */
  x: number;
  /** y of the clink in the shared stage's local px space (for the spark) */
  y: number;
  /** monotonic id so React keys + a cleanup timer can find it */
  id: number;
};

type Body = {
  el: HTMLElement;
  x: number;
  y: number;
  vx: number;
  vy: number;
  /** rest position in local px */
  restX: number;
  restY: number;
  /** radius for overlap/clink detection, in px */
  r: number;
  dragging: boolean;
};

type Pointer = {
  id: number;
  body: Body | null;
  /** last pointer pos in local px, for velocity sampling */
  px: number;
  py: number;
};

/**
 * Drag physics — the `drag-physics` technique. Powers the soju glasses and
 * skewers you can drag around the table and "clink". Several draggable bodies
 * share one stage; each carries its own rest position, and on release it
 * coasts on inertia (velocity captured from the last pointer move) then
 * springs back home. When two bodies' circles overlap, a *clink* fires — a
 * callback hands the clink coordinate to React so a spark SFX can render, and
 * the two bodies get a small knockback impulse so the clink feels physical
 * instead of pass-through.
 *
 * Physics, tuned by hand:
 *  - velocity decay 0.86/frame (coast dies in ~half a second)
 *  - spring stiffness 0.18, damping 0.78 (overshoots just once, then settles)
 *  - clink knockback: each body takes the unit vector away from the other ×
 *    a fixed impulse (6 px/frame), applied to velocity, so a hard drag-in
 *    clinks harder than a graze
 *
 * The loop runs a single rAF for the whole stage, writing `transform:
 * translate3d()` per body (transform-only — never layout). It parks itself
 * when every body is at rest and un-dragged, so an idle table costs zero
 * frames. It pauses on `visibilitychange` (hidden) and never runs under
 * reduced motion or on coarse pointers — under either, the glasses sit at
 * rest and the clink is a no-op (touch users still see the full table; the
 * drag is a flourish, not a gate).
 *
 * `onClink` is called from inside rAF; React state updates are batched and
 * fine here because clinks are rare (a few per session). The hook owns no
 * state itself — it returns a ref to attach to the stage element and expects
 * every `[data-clink]` child to expose its rest position via `data-rest-x` /
 * `data-rest-y` (in px, local to the stage) at mount.
 */
export function useClinkPhysics(
  disabled: boolean,
  onClink: (c: Clink) => void,
) {
  const stageRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || disabled) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const bodies: Body[] = [];
    const pointers = new Map<number, Pointer>();
    let raf = 0;
    let running = false;
    let clinkId = 0;
    // Debounce clinks: the same pair can't clink again within this many ms.
    let lastClinkAt = 0;

    // Snapshot every draggable child. Rest positions are read from data attrs
    // so the markup stays declarative and survives re-render.
    const nodes = Array.from(
      stage.querySelectorAll<HTMLElement>("[data-clink]"),
    );
    for (const el of nodes) {
      const restX = Number(el.dataset.restX ?? 0);
      const restY = Number(el.dataset.restY ?? 0);
      const r = Number(el.dataset.clinkR ?? 28);
      const body: Body = {
        el,
        x: restX,
        y: restY,
        vx: 0,
        vy: 0,
        restX,
        restY,
        r,
        dragging: false,
      };
      bodies.push(body);
      el.style.transform = `translate3d(${restX}px, ${restY}px, 0)`;
    }
    if (bodies.length < 2) return;

    const write = (b: Body) => {
      b.el.style.transform = `translate3d(${b.x}px, ${b.y}px, 0)`;
    };

    const stageRect = () => stage.getBoundingClientRect();

    const localPoint = (clientX: number, clientY: number) => {
      const r = stageRect();
      return { x: clientX - r.left, y: clientY - r.top };
    };

    const hit = (lx: number, ly: number): Body | null => {
      // Topmost-first (last in DOM paints on top).
      for (let i = bodies.length - 1; i >= 0; i--) {
        const b = bodies[i];
        const dx = lx - b.x;
        const dy = ly - b.y;
        if (dx * dx + dy * dy <= b.r * b.r) return b;
      }
      return null;
    };

    const onDown = (e: PointerEvent) => {
      if (e.button !== undefined && e.button !== 0) return;
      const p = localPoint(e.clientX, e.clientY);
      const body = hit(p.x, p.y);
      if (!body) return;
      body.dragging = true;
      body.vx = 0;
      body.vy = 0;
      pointers.set(e.pointerId, {
        id: e.pointerId,
        body,
        px: p.x,
        py: p.y,
      });
      stage.setPointerCapture(e.pointerId);
      body.el.classList.add("is-grabbed");
      wake();
    };

    const onMove = (e: PointerEvent) => {
      const ptr = pointers.get(e.pointerId);
      if (!ptr || !ptr.body) return;
      const p = localPoint(e.clientX, e.clientY);
      const b = ptr.body;
      // Velocity from the last move, smoothed so a single jump doesn't fling.
      b.vx = (b.vx + (p.x - ptr.px)) * 0.5;
      b.vy = (b.vy + (p.y - ptr.py)) * 0.5;
      b.x = p.x;
      b.y = p.y;
      ptr.px = p.x;
      ptr.py = p.y;
      write(b);
    };

    const onUp = (e: PointerEvent) => {
      const ptr = pointers.get(e.pointerId);
      if (!ptr) return;
      if (ptr.body) {
        ptr.body.dragging = false;
        ptr.body.el.classList.remove("is-grabbed");
      }
      pointers.delete(e.pointerId);
      try {
        stage.releasePointerCapture(e.pointerId);
      } catch {
        /* pointer capture may already be gone */
      }
      wake();
    };

    const tryClink = (a: Body, b: Body) => {
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const dist = Math.hypot(dx, dy);
      const reach = a.r + b.r;
      if (dist >= reach) return false;
      const now = performance.now();
      if (now - lastClinkAt < 180) return false;
      lastClinkAt = now;
      // Clack: midpoint between the two, in stage-local px.
      const cx = (a.x + b.x) / 2;
      const cy = (a.y + b.y) / 2;
      // Knockback away from each other.
      const nx = dx / (dist || 1);
      const ny = dy / (dist || 1);
      const impulse = 6;
      if (!a.dragging) {
        a.vx -= nx * impulse;
        a.vy -= ny * impulse;
      }
      if (!b.dragging) {
        b.vx += nx * impulse;
        b.vy += ny * impulse;
      }
      clinkId += 1;
      onClink({ x: cx, y: cy, id: clinkId });
      return true;
    };

    const step = () => {
      running = true;
      // Integrate. Velocity decay, then spring toward rest, then position.
      let active = false;
      // Clink check across all pairs (n is tiny — 2–4 glasses).
      for (let i = 0; i < bodies.length; i++) {
        for (let j = i + 1; j < bodies.length; j++) {
          tryClink(bodies[i], bodies[j]);
        }
      }
      for (const b of bodies) {
        if (b.dragging) {
          active = true;
          continue;
        }
        // Decay (coast).
        b.vx *= 0.86;
        b.vy *= 0.86;
        // Spring toward rest.
        const sx = (b.restX - b.x) * 0.18;
        const sy = (b.restY - b.y) * 0.18;
        b.vx = (b.vx + sx) * 0.78 + sx * 0.22;
        b.vy = (b.vy + sy) * 0.78 + sy * 0.22;
        b.x += b.vx;
        b.y += b.vy;
        // Settle threshold — stop writing when sub-pixel.
        const moving =
          Math.abs(b.vx) > 0.05 ||
          Math.abs(b.vy) > 0.05 ||
          Math.abs(b.restX - b.x) > 0.2 ||
          Math.abs(b.restY - b.y) > 0.2;
        if (moving) active = true;
        write(b);
      }
      if (active) {
        raf = window.requestAnimationFrame(step);
      } else {
        running = false;
      }
    };

    const wake = () => {
      if (running) return;
      running = true;
      raf = window.requestAnimationFrame(step);
    };

    const onVisibility = () => {
      if (document.hidden) {
        if (raf) window.cancelAnimationFrame(raf);
        running = false;
      }
    };

    stage.addEventListener("pointerdown", onDown);
    stage.addEventListener("pointermove", onMove);
    stage.addEventListener("pointerup", onUp);
    stage.addEventListener("pointercancel", onUp);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      stage.removeEventListener("pointerdown", onDown);
      stage.removeEventListener("pointermove", onMove);
      stage.removeEventListener("pointerup", onUp);
      stage.removeEventListener("pointercancel", onUp);
      document.removeEventListener("visibilitychange", onVisibility);
      if (raf) window.cancelAnimationFrame(raf);
      for (const b of bodies) {
        b.el.style.transform = "";
        b.el.classList.remove("is-grabbed");
      }
    };
  }, [disabled, onClink]);

  return stageRef;
}
