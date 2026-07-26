"use client";

import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

/**
 * useStickerPhysics — the springy drag engine for the sticker board.
 *
 * Each sticker is a point mass with:
 *   dx, dy   — position delta from its CSS-scattered base (so no-JS shows the
 *              same pile, just still)
 *   vx, vy   — linear velocity
 *   rot, vr  — rotation delta + angular velocity (torque is faked from the
 *              grab offset crossed with release velocity)
 *
 * On release a sticker is pulled back to home (0,0) by an underdamped spring
 * tuned to settle in ~620ms with two visible bounces — stiff enough to feel
 * snappy, soft enough to wobble. Initial fling velocity decays through
 * friction first, then hands off to the spring; in practice the spring is
 * always on and just absorbs the momentum. Released stickers soft-collide
 * with resting neighbors within 1.1× their combined radius, nudging them so
 * the pile reads as a pile, not a stack.
 *
 * Architecture mirrors blunt's StickerBoard: React renders the sticker shells
 * exactly once, then every frame is an imperative `style.transform` write —
 * a full fling causes zero re-renders. The rAF loop self-terminates when the
 * board goes quiet (every body below SLEEP).
 *
 * Reduced motion: every release is a placement — the sticker snaps home with
 * no glide, no spin, no nudge. The pile stands still.
 */

// Spring + fling constants (see tokens.json motion vocabulary). Tuned by
// simulation: a displaced sticker settles in ~590ms with two visible bounces;
// a fling in ~420ms. Unconditionally stable (semi-implicit Euler in
// normalized-frame space — the spring force never multiplies a raw dt).
const SPRING_K = 0.18; // stiffness — pull toward home
const SPRING_C = 0.4; // damping — underdamped: ~2 visible bounces
const FLING_FRICTION = 0.92; // per 60fps-normalized frame, initial glide
const ROT_DAMP = 0.9; // angular velocity decays a touch slower than linear
const BOUNCE = 0.4; // restitution off the board edges
const PILE_RATIO = 1.1; // overlap radius multiplier for neighbor push
const PILE_SHOVE = 0.35; // fraction of overlap transferred to the neighbor
const NUDGE = 10; // px per arrow key
const SLEEP = 0.004; // px/ms (and deg/ms) under which a body rests

function clamp(v: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, v));
}

type Body = {
  el: HTMLElement;
  dx: number;
  dy: number;
  vx: number;
  vy: number;
  rot: number;
  vr: number;
  baseRot: number;
  homeX: number;
  homeY: number;
  radius: number;
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  grabbed: boolean;
  px: number;
  py: number;
  lt: number;
  gx: number;
  gy: number;
};

export type StickerPhysicsHandle = {
  /** Container element whose direct `.sticker-sticker` children become bodies. */
  attach: (container: HTMLElement | null) => () => void;
};

/**
 * Returns a handle whose `attach(container)` wires pointer + keyboard physics
 * onto every `.sticker-sticker` inside the container. The returned function is
 * the cleanup — call it from a useEffect return. Reads the live reduced-motion
 * flag so the engine re-installs itself (in placement-only mode) when the OS
 * setting flips.
 */
export function useStickerPhysics(): StickerPhysicsHandle {
  const reduced = usePrefersReducedMotion();
  const reducedRef = useRef(reduced);

  useEffect(() => {
    reducedRef.current = reduced;
  }, [reduced]);

  return {
    attach: (container) => {
      if (!container) return () => {};

      const els = Array.from(
        container.querySelectorAll<HTMLElement>(".sticker-sticker"),
      );

      const bodies: Body[] = els.map((el) => {
        const raw = getComputedStyle(el).getPropertyValue("--sticker-rot");
        return {
          el,
          dx: 0,
          dy: 0,
          vx: 0,
          vy: 0,
          rot: 0,
          vr: 0,
          baseRot: Number.parseFloat(raw) || 0,
          // home is (0,0) — a delta of zero means "where CSS put me".
          homeX: 0,
          homeY: 0,
          radius: Math.max(el.offsetWidth, el.offsetHeight) / 2,
          minX: 0,
          maxX: 0,
          minY: 0,
          maxY: 0,
          grabbed: false,
          px: 0,
          py: 0,
          lt: 0,
          gx: 0,
          gy: 0,
        };
      });

      let zTop = 10;
      let raf = 0;
      let last = 0;

      const apply = (b: Body) => {
        const s = b.grabbed ? 1.06 : 1;
        b.el.style.transform =
          `translate3d(${b.dx.toFixed(2)}px, ${b.dy.toFixed(2)}px, 0) ` +
          `rotate(${(b.baseRot + b.rot).toFixed(2)}deg) scale(${s})`;
      };

      const bounds = () => {
        const bw = container.clientWidth;
        const bh = container.clientHeight;
        const pad = 2;
        for (const b of bodies) {
          b.radius = Math.max(b.el.offsetWidth, b.el.offsetHeight) / 2;
          b.minX = pad - b.el.offsetLeft;
          b.maxX = Math.max(
            b.minX,
            bw - b.el.offsetWidth - pad - b.el.offsetLeft,
          );
          b.minY = pad - b.el.offsetTop;
          b.maxY = Math.max(
            b.minY,
            bh - b.el.offsetHeight - pad - b.el.offsetTop,
          );
          b.dx = clamp(b.dx, b.minX, b.maxX);
          b.dy = clamp(b.dy, b.minY, b.maxY);
          apply(b);
        }
      };

      // Soft circle collision: a moving body shoves a resting neighbor out of
      // its radius. Both then get pulled home by their springs.
      const pile = (mover: Body, dt: number) => {
        const mr = mover.radius * PILE_RATIO;
        for (const other of bodies) {
          if (other === mover || other.grabbed) continue;
          const or = other.radius * PILE_RATIO;
          // centers in board space
          const ax = mover.el.offsetLeft + mover.dx + mover.el.offsetWidth / 2;
          const ay = mover.el.offsetTop + mover.dy + mover.el.offsetHeight / 2;
          const bx = other.el.offsetLeft + other.dx + other.el.offsetWidth / 2;
          const by = other.el.offsetTop + other.dy + other.el.offsetHeight / 2;
          const ddx = bx - ax;
          const ddy = by - ay;
          const dist = Math.hypot(ddx, ddy) || 0.0001;
          const min = mr + or;
          if (dist < min) {
            const overlap = min - dist;
            const nx = ddx / dist;
            const ny = ddy / dist;
            other.dx += nx * overlap * PILE_SHOVE;
            other.dy += ny * overlap * PILE_SHOVE;
            // hand the mover's momentum partially to the neighbor
            other.vx += nx * overlap * PILE_SHOVE * 0.04 * dt;
            other.vy += ny * overlap * PILE_SHOVE * 0.04 * dt;
            other.vr += mover.vr * 0.05;
            mover.vx *= 1 - PILE_SHOVE * 0.5;
            mover.vy *= 1 - PILE_SHOVE * 0.5;
            mover.vr *= 0.9;
          }
        }
      };

      const tick = (t: number) => {
        const dt = last ? Math.min(48, t - last) : 16.7;
        last = t;
        const ff = Math.pow(FLING_FRICTION, dt / 16.7);
        let alive = false;

        for (const b of bodies) {
          if (b.grabbed) continue;

          const atRest =
            Math.abs(b.vx) < SLEEP &&
            Math.abs(b.vy) < SLEEP &&
            Math.abs(b.vr) < SLEEP &&
            Math.abs(b.dx - b.homeX) < 0.4 &&
            Math.abs(b.dy - b.homeY) < 0.4;
          if (atRest) {
            b.vx = 0;
            b.vy = 0;
            b.vr = 0;
            continue;
          }

          // Spring toward home (always on — it absorbs fling momentum).
          // Velocity lives in normalized-frame space (no raw-dt force term),
          // which makes the spring unconditionally stable — a displaced body
          // settles in ~590ms with two visible bounces regardless of fps.
          const fr = dt / 16.7;
          b.vx += -SPRING_K * (b.dx - b.homeX) * fr;
          b.vy += -SPRING_K * (b.dy - b.homeY) * fr;
          const damp = Math.pow(1 - SPRING_C, fr);
          b.vx *= damp;
          b.vy *= damp;

          // position integrate + fling friction bleed
          b.dx += b.vx * dt;
          b.dy += b.vy * dt;
          b.vx *= ff;
          b.vy *= ff;

          // rotation
          b.rot += b.vr * dt;
          b.vr *= Math.pow(ROT_DAMP, dt / 16.7);

          // walls
          if (b.dx < b.minX) {
            b.dx = b.minX;
            b.vx = Math.abs(b.vx) * BOUNCE;
            b.vr *= 0.6;
          } else if (b.dx > b.maxX) {
            b.dx = b.maxX;
            b.vx = -Math.abs(b.vx) * BOUNCE;
            b.vr *= 0.6;
          }
          if (b.dy < b.minY) {
            b.dy = b.minY;
            b.vy = Math.abs(b.vy) * BOUNCE;
            b.vr *= 0.6;
          } else if (b.dy > b.maxY) {
            b.dy = b.maxY;
            b.vy = -Math.abs(b.vy) * BOUNCE;
            b.vr *= 0.6;
          }

          pile(b, dt);
          apply(b);
          alive = true;
        }

        if (alive) {
          raf = requestAnimationFrame(tick);
        } else {
          raf = 0;
          last = 0;
        }
      };

      const wake = () => {
        if (!raf) {
          last = 0;
          raf = requestAnimationFrame(tick);
        }
      };

      const lift = (b: Body) => {
        zTop += 1;
        b.el.style.zIndex = String(zTop);
      };

      const onDown = (b: Body) => (e: PointerEvent) => {
        e.preventDefault();
        try {
          b.el.setPointerCapture(e.pointerId);
        } catch {
          /* pointer evaporated between events — nothing to capture */
        }
        b.grabbed = true;
        b.el.classList.add("is-grabbed");
        lift(b);
        // grabbing pins it: kill its velocity, snap it out of the spring
        b.vx = 0;
        b.vy = 0;
        b.vr = 0;
        b.px = e.clientX;
        b.py = e.clientY;
        b.lt = e.timeStamp;
        const r = b.el.getBoundingClientRect();
        b.gx = (e.clientX - (r.left + r.width / 2)) / Math.max(1, r.width);
        b.gy = (e.clientY - (r.top + r.height / 2)) / Math.max(1, r.height);
        apply(b);
      };

      const onMove = (b: Body) => (e: PointerEvent) => {
        if (!b.grabbed) return;
        const dt = Math.max(1, e.timeStamp - b.lt);
        const ndx = clamp(b.dx + (e.clientX - b.px), b.minX, b.maxX);
        const ndy = clamp(b.dy + (e.clientY - b.py), b.minY, b.maxY);
        const ivx = (ndx - b.dx) / dt;
        const ivy = (ndy - b.dy) / dt;
        b.vx = b.vx * 0.4 + ivx * 0.6;
        b.vy = b.vy * 0.4 + ivy * 0.6;
        // Faked torque: linear velocity crossed with grab offset. Grab a
        // corner and yank — it spins. Grab dead center — it doesn't.
        const torque = (ivx * -b.gy + ivy * b.gx) * 0.5;
        b.vr = b.vr * 0.5 + torque * 0.5;
        if (!reducedRef.current) b.rot += b.vr * dt * 0.3;
        b.dx = ndx;
        b.dy = ndy;
        b.px = e.clientX;
        b.py = e.clientY;
        b.lt = e.timeStamp;
        apply(b);
      };

      const onUp = (b: Body) => (e: PointerEvent) => {
        if (!b.grabbed) return;
        b.grabbed = false;
        b.el.classList.remove("is-grabbed");
        // Reduced motion: place, don't glide. A stalled hand (>90ms since the
        // last move) also releases with zero velocity — no ghost throw.
        if (reducedRef.current || e.timeStamp - b.lt > 90) {
          b.vx = 0;
          b.vy = 0;
          b.vr = 0;
          // under reduced motion, snap straight home
          if (reducedRef.current) {
            b.dx = 0;
            b.dy = 0;
            b.rot = 0;
          }
        } else {
          // A satisfying fling: cap release velocity so a hard throw still
          // springs back inside the board.
          const cap = 2.2;
          const sp = Math.hypot(b.vx, b.vy);
          if (sp > cap) {
            b.vx = (b.vx / sp) * cap;
            b.vy = (b.vy / sp) * cap;
          }
        }
        apply(b);
        wake();
      };

      const onKey = (b: Body) => (e: KeyboardEvent) => {
        let hx = 0;
        let hy = 0;
        if (e.key === "ArrowLeft") hx = -NUDGE;
        else if (e.key === "ArrowRight") hx = NUDGE;
        else if (e.key === "ArrowUp") hy = -NUDGE;
        else if (e.key === "ArrowDown") hy = NUDGE;
        else if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          lift(b);
          return;
        } else {
          return;
        }
        e.preventDefault();
        b.vx = 0;
        b.vy = 0;
        b.vr = 0;
        b.dx = clamp(b.dx + hx, b.minX, b.maxX);
        b.dy = clamp(b.dy + hy, b.minY, b.maxY);
        apply(b);
        // a keyboard nudge re-arms the spring so it visibly springs home
        if (!reducedRef.current) wake();
      };

      const cleanups: Array<() => void> = [];
      for (const b of bodies) {
        const down = onDown(b);
        const move = onMove(b);
        const up = onUp(b);
        const key = onKey(b);
        b.el.addEventListener("pointerdown", down);
        b.el.addEventListener("pointermove", move);
        b.el.addEventListener("pointerup", up);
        b.el.addEventListener("pointercancel", up);
        b.el.addEventListener("keydown", key);
        cleanups.push(() => {
          b.el.removeEventListener("pointerdown", down);
          b.el.removeEventListener("pointermove", move);
          b.el.removeEventListener("pointerup", up);
          b.el.removeEventListener("pointercancel", up);
          b.el.removeEventListener("keydown", key);
        });
      }

      const ro = new ResizeObserver(bounds);
      ro.observe(container);
      bounds();

      const onVisibility = () => {
        if (document.hidden && raf) {
          cancelAnimationFrame(raf);
          raf = 0;
          last = 0;
        }
      };
      document.addEventListener("visibilitychange", onVisibility);

      return () => {
        for (const fn of cleanups) fn();
        ro.disconnect();
        document.removeEventListener("visibilitychange", onVisibility);
        cancelAnimationFrame(raf);
      };
    },
  };
}
