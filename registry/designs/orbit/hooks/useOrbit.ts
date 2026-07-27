"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/** Inertia decay per 60fps-normalized frame. */
const INERTIA = 0.96;
/** Angular lerp toward target, per 60fps-normalized frame. */
const ANGLE_LERP = 0.32;
/** After this many ms of orbit silence, the key light drifts on its own. */
const IDLE_MS = 4000;
/** Key-light autonomous drift, radians per second. */
const KEY_DRIFT = 0.06;
/** Drag maps pointer px → radians. One full drag-width ≈ a half turn. */
const DRAG_GAIN = 0.0085;
/** Floor angular velocity (rad/s) so inertia always visibly settles. */
const MIN_VEL = 0.04;
/** Max angular velocity (rad/s) to keep a fling readable. */
const MAX_VEL = 14;
/** Angle bucket size (radians) for coarse React state updates. */
const BUCKET = Math.PI / 6; // 30°

export type OrbitState = {
  /** The orbit angle the canvas should render, in radians, wrapped to [0,2π). */
  angle: number;
  /** The key-light azimuth, in radians. The specular travels with it. */
  keyAzimuth: number;
  /** 0..1 — how much the visitor is "holding" the shoe right now. */
  grab: number;
};

/**
 * The turntable's physics. Returns:
 *   - `state`   — the latest OrbitState, for one-time React reads (the angle
 *                 readout, the "drag to orbit" hint). Updated only when the
 *                 angle crosses a 30° bucket, to avoid per-frame re-renders.
 *   - `ref`     — a mutable ref to the live OrbitState, read every animation
 *                 frame by the canvas. This is the hot path; React is not.
 *   - `setVisible` / `sync` — call from the stage's IntersectionObserver so
 *                 the rAF pauses offscreen.
 *   - `handlers`— `onPointerDown/Move/Up/Leave/Cancel` to spread on the stage.
 *
 * The drag is 1:1 with pointer delta (a turn feels like turning the shoe).
 * On release, the last drag velocity becomes inertia, decaying at INERTIA/
 * frame; under reduced motion there is no inertia and no angle lerp — the
 * shoe goes exactly where you put it, and stops.
 *
 * The loop advances the angle from inertia and eases it toward target with
 * ANGLE_LERP, advances the key light (autonomously after IDLE_MS, or held
 * while dragging), and eases `grab`. It owns one rAF, paused when the stage
 * leaves the viewport (toggled via `setVisible`) and when the tab hides.
 */
const INITIAL_ANGLE = 0.42;

export function useOrbit(reduced: boolean) {
  const live = useRef<OrbitState>({
    angle: INITIAL_ANGLE,
    keyAzimuth: 0.5,
    grab: 0,
  });
  const target = useRef<number>(INITIAL_ANGLE);
  const vel = useRef<number>(0);
  const dragging = useRef(false);
  const lastDragX = useRef(0);
  const lastDragT = useRef(0);
  const lastMoveT = useRef(-1e9);
  const visible = useRef(true);
  const raf = useRef(0);
  const running = useRef(false);
  const frameRef = useRef<(now: number) => void>(() => {});

  // React-facing bucketed state (only fires on coarse changes). Seeded from
  // the same initial constants as the refs above (not from ref reads, which
  // the lint rule forbids at render).
  const [state, setState] = useState<OrbitState>({
    angle: INITIAL_ANGLE,
    keyAzimuth: 0.5,
    grab: 0,
  });
  const lastBucket = useRef(Math.round(INITIAL_ANGLE / BUCKET));

  const setVisible = useCallback((v: boolean) => {
    visible.current = v;
  }, []);

  // Wire frame into sync via a ref so sync never closes over a stale frame.
  const sync = useCallback(() => {
    const should = visible.current && !document.hidden;
    if (should && !running.current) {
      running.current = true;
      raf.current = requestAnimationFrame((t) => frameRef.current(t));
    } else if (!should && running.current) {
      running.current = false;
      cancelAnimationFrame(raf.current);
    }
  }, []);

  const frame = useCallback(
    (now: number) => {
      raf.current = requestAnimationFrame((t) => frameRef.current(t));
      const s = live.current;

      // Angle: inertia + lerp toward target. rAF cadence is the clock; the
      // constants are tuned for ~60fps, and dt clamping is unnecessary
      // because inertia decays per-frame regardless of wall time.
      if (!reduced) {
        if (Math.abs(vel.current) > MIN_VEL) {
          target.current += vel.current * (1 / 60);
          vel.current *= INERTIA;
        } else {
          vel.current = 0;
        }
      }
      const lerpK = reduced ? 1 : ANGLE_LERP;
      s.angle += (target.current - s.angle) * lerpK;
      if (s.angle < 0) s.angle += Math.PI * 2;
      if (s.angle >= Math.PI * 2) s.angle -= Math.PI * 2;

      // Key light: held while dragging, autonomous drift after idle.
      const idle = now - lastMoveT.current > IDLE_MS;
      if (idle && !reduced) s.keyAzimuth += KEY_DRIFT / 60;

      // Grab ease.
      const grabTarget = dragging.current ? 1 : 0;
      s.grab += (grabTarget - s.grab) * (reduced ? 1 : 0.18);

      // Coarse state push — only when the 30° bucket changes.
      const bucket = Math.round(s.angle / BUCKET);
      if (bucket !== lastBucket.current) {
        lastBucket.current = bucket;
        setState({ angle: s.angle, keyAzimuth: s.keyAzimuth, grab: s.grab });
      }
    },
    [reduced],
  );

  // Keep the ref current without reading it during render.
  useEffect(() => {
    frameRef.current = frame;
  }, [frame]);

  // Visibility + tab-hidden handling.
  useEffect(() => {
    const onVis = () => sync();
    document.addEventListener("visibilitychange", onVis);
    return () => {
      document.removeEventListener("visibilitychange", onVis);
      running.current = false;
      cancelAnimationFrame(raf.current);
    };
  }, [sync]);

  // Pointer handlers — spread on the stage element.
  const onPointerDown = useCallback(
    (ev: React.PointerEvent) => {
      dragging.current = true;
      lastDragX.current = ev.clientX;
      lastDragT.current = performance.now();
      lastMoveT.current = performance.now();
      vel.current = 0;
      (ev.target as Element).setPointerCapture?.(ev.pointerId);
      sync();
    },
    [sync],
  );

  const onPointerMove = useCallback((ev: React.PointerEvent) => {
    if (!dragging.current) return;
    const now = performance.now();
    const dx = ev.clientX - lastDragX.current;
    const dt = Math.max(8, now - lastDragT.current);
    lastDragX.current = ev.clientX;
    lastDragT.current = now;
    lastMoveT.current = now;
    // Apply the delta to the live angle immediately (1:1 drag feel) and to
    // the target; track velocity for the inertia on release.
    const delta = dx * DRAG_GAIN;
    target.current += delta;
    live.current.angle += delta;
    const v = (delta / dt) * 1000; // rad/s
    vel.current = Math.max(-MAX_VEL, Math.min(MAX_VEL, v));
  }, []);

  const endDrag = useCallback(
    (ev: React.PointerEvent) => {
      if (!dragging.current) return;
      dragging.current = false;
      (ev.target as Element).releasePointerCapture?.(ev.pointerId);
      if (reduced) vel.current = 0;
      sync();
    },
    [reduced, sync],
  );

  /** Keyboard nudge: step the angle directly (arrow keys / Home reset). */
  const nudge = useCallback((delta: number) => {
    live.current.angle += delta;
    if (live.current.angle < 0) live.current.angle += Math.PI * 2;
    if (live.current.angle >= Math.PI * 2) live.current.angle -= Math.PI * 2;
    target.current = live.current.angle;
  }, []);

  /** Reset to the home angle. */
  const reset = useCallback(() => {
    live.current.angle = INITIAL_ANGLE;
    target.current = INITIAL_ANGLE;
  }, []);

  return {
    state,
    ref: live,
    setVisible,
    sync,
    nudge,
    reset,
    handlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp: endDrag,
      onPointerLeave: endDrag,
      onPointerCancel: endDrag,
    },
  };
}
