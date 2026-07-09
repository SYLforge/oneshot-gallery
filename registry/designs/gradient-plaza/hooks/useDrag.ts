"use client";

import {
  useRef,
  type KeyboardEvent,
  type PointerEvent,
  type RefObject,
} from "react";

/** Keyboard nudge in px; hold Shift for fine placement. */
const KEY_STEP = 24;
const KEY_STEP_FINE = 4;
/** Inertia: exponential decay per 60fps-normalized frame. */
const FRICTION = 0.9;
/** Glide parks below this speed (px/ms). */
const STOP_SPEED = 0.02;
/** How far a window may tuck past the stage's side/bottom edges. */
const EDGE = 16;

type Bounds = { minX: number; maxX: number; minY: number; maxY: number };

type DragOptions = {
  /** The element that gets translated (the whole window). */
  windowRef: RefObject<HTMLElement | null>;
  /** The positioned stage the window is clamped inside. */
  stageRef: RefObject<HTMLElement | null>;
  /** Reduced motion: dragging still works (user-driven), inertia does not. */
  reduced: boolean;
  /** Called on grab / keyboard move — the parent raises the window. */
  onActivate?: () => void;
};

export type DragHandlers = {
  onPointerDown: (e: PointerEvent<HTMLElement>) => void;
  onPointerMove: (e: PointerEvent<HTMLElement>) => void;
  onPointerUp: (e: PointerEvent<HTMLElement>) => void;
  onPointerCancel: (e: PointerEvent<HTMLElement>) => void;
  onKeyDown: (e: KeyboardEvent<HTMLElement>) => void;
};

/**
 * Pointer + keyboard dragging for the retro OS windows, transform-only.
 *
 * The grip captures its pointer (setPointerCapture), so moves keep arriving
 * even when the cursor leaves the title bar; position is written as
 * translate3d on the window element — never left/top, so a drag costs the
 * compositor, not layout. Release keeps a little momentum (friction 0.9 per
 * normalized frame) unless reduced motion asked for none. Arrow keys move
 * the focused grip in 24px tiles (Shift = 4px), Home sends the window back
 * to its spawn point. Bounds are measured once per grab, not per move.
 */
export function useDrag({
  windowRef,
  stageRef,
  reduced,
  onActivate,
}: DragOptions): DragHandlers {
  const pos = useRef({ x: 0, y: 0 });
  const vel = useRef({ x: 0, y: 0 });
  const rafRef = useRef(0);
  const bounds = useRef<Bounds>({ minX: -1e5, maxX: 1e5, minY: -1e5, maxY: 1e5 });
  const grab = useRef<{
    id: number;
    px: number;
    py: number;
    bx: number;
    by: number;
    lx: number;
    ly: number;
    lt: number;
  } | null>(null);

  const measure = () => {
    const el = windowRef.current;
    const stage = stageRef.current;
    if (!el || !stage) return;
    const minX = -el.offsetLeft - EDGE;
    const minY = -el.offsetTop;
    bounds.current = {
      minX,
      maxX: Math.max(minX, stage.clientWidth - el.offsetLeft - el.offsetWidth + EDGE),
      minY,
      maxY: Math.max(minY, stage.clientHeight - el.offsetTop - el.offsetHeight + EDGE),
    };
  };

  const apply = () => {
    const el = windowRef.current;
    if (el) {
      el.style.transform = `translate3d(${pos.current.x.toFixed(2)}px, ${pos.current.y.toFixed(2)}px, 0)`;
    }
  };

  /** Clamp into bounds; reports which axes hit a wall (to kill momentum). */
  const clampPos = () => {
    const b = bounds.current;
    const p = pos.current;
    const cx = Math.min(b.maxX, Math.max(b.minX, p.x));
    const cy = Math.min(b.maxY, Math.max(b.minY, p.y));
    const hit = { x: cx !== p.x, y: cy !== p.y };
    p.x = cx;
    p.y = cy;
    return hit;
  };

  const stopGlide = () => cancelAnimationFrame(rafRef.current);

  const glide = () => {
    let lastT = performance.now();
    const step = (now: number) => {
      // Window unmounted mid-glide: nothing left to move — stop quietly.
      if (!windowRef.current) return;
      const dt = Math.min(Math.max(now - lastT, 1), 64);
      lastT = now;
      pos.current.x += vel.current.x * dt;
      pos.current.y += vel.current.y * dt;
      const hit = clampPos();
      if (hit.x) vel.current.x = 0;
      if (hit.y) vel.current.y = 0;
      const decay = Math.pow(FRICTION, dt / 16.7);
      vel.current.x *= decay;
      vel.current.y *= decay;
      apply();
      if (Math.hypot(vel.current.x, vel.current.y) > STOP_SPEED) {
        rafRef.current = requestAnimationFrame(step);
      }
    };
    rafRef.current = requestAnimationFrame(step);
  };

  const onPointerDown = (e: PointerEvent<HTMLElement>) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    onActivate?.();
    stopGlide();
    measure();
    e.currentTarget.setPointerCapture(e.pointerId);
    grab.current = {
      id: e.pointerId,
      px: e.clientX,
      py: e.clientY,
      bx: pos.current.x,
      by: pos.current.y,
      lx: e.clientX,
      ly: e.clientY,
      lt: performance.now(),
    };
    vel.current = { x: 0, y: 0 };
  };

  const onPointerMove = (e: PointerEvent<HTMLElement>) => {
    const g = grab.current;
    if (!g || e.pointerId !== g.id) return;
    pos.current.x = g.bx + (e.clientX - g.px);
    pos.current.y = g.by + (e.clientY - g.py);
    clampPos();
    apply();
    const now = performance.now();
    const dt = now - g.lt;
    if (dt > 12) {
      vel.current = { x: (e.clientX - g.lx) / dt, y: (e.clientY - g.ly) / dt };
      g.lx = e.clientX;
      g.ly = e.clientY;
      g.lt = now;
    }
  };

  const endDrag = (e: PointerEvent<HTMLElement>) => {
    const g = grab.current;
    if (!g || e.pointerId !== g.id) return;
    grab.current = null;
    if (!reduced && Math.hypot(vel.current.x, vel.current.y) > STOP_SPEED * 3) {
      glide();
    }
  };

  const onKeyDown = (e: KeyboardEvent<HTMLElement>) => {
    const step = e.shiftKey ? KEY_STEP_FINE : KEY_STEP;
    let dx = 0;
    let dy = 0;
    switch (e.key) {
      case "ArrowLeft":
        dx = -step;
        break;
      case "ArrowRight":
        dx = step;
        break;
      case "ArrowUp":
        dy = -step;
        break;
      case "ArrowDown":
        dy = step;
        break;
      case "Home": {
        e.preventDefault();
        onActivate?.();
        stopGlide();
        pos.current = { x: 0, y: 0 };
        apply();
        return;
      }
      default:
        return;
    }
    e.preventDefault();
    onActivate?.();
    stopGlide();
    measure();
    pos.current.x += dx;
    pos.current.y += dy;
    clampPos();
    apply();
  };

  return {
    onPointerDown,
    onPointerMove,
    onPointerUp: endDrag,
    onPointerCancel: endDrag,
    onKeyDown,
  };
}
