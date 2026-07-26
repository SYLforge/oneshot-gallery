"use client";

import { useEffect, useRef } from "react";

/** Spring presets, each tuned for a specific BOUNCE gesture. */
export type SpringPreset = "press" | "card" | "char";

type Config = { stiffness: number; damping: number; mass: number };

const CONFIGS: Record<SpringPreset, Config> = {
  // Buttons: fast squash on press, slightly underdamped so the release
  // overshoots ~6% and wobbles once before settling — the rubber snap.
  press: { stiffness: 380, damping: 14, mass: 1 },
  // Cards: a touch softer; the bounce-in settle after reveal.
  card: { stiffness: 220, damping: 18, mass: 1 },
  // Per-glyph headline reveal: snappier, more overshoot, lands loud.
  char: { stiffness: 320, damping: 12, mass: 1 },
};

type SpringState = {
  /** Two independent values so a press can squash (sx≠sy) and recover. */
  sx: number;
  sy: number;
  tx: number;
  ty: number;
  vx: number;
  vy: number;
  vangle: number;
  angle: number;
};

/** One body animated toward its target by one rAF step. */
function integrate(
  s: SpringState,
  target: Partial<SpringState>,
  cfg: Config,
  dt: number,
): boolean {
  const f = dt / 1000;
  let alive = false;

  const stepAxis = (
    pos: number,
    vel: number,
    goal: number,
  ): [number, number, boolean] => {
    const k = cfg.stiffness;
    const c = cfg.damping;
    const m = cfg.mass;
    // semi-implicit Euler: v += a*dt; x += v*dt
    const a = (-k * (pos - goal) - c * vel) / m;
    const nv = vel + a * f;
    const nx = pos + nv * f;
    const moving = Math.abs(nx - goal) > 0.0008 || Math.abs(nv) > 0.0008;
    return [nx, nv, moving];
  };

  if (target.sx !== undefined) {
    const [nx, nv, m] = stepAxis(s.sx, s.vx, target.sx);
    s.sx = nx;
    s.vx = nv;
    if (m) alive = true;
  }
  if (target.sy !== undefined) {
    const [nx, nv, m] = stepAxis(s.sy, s.vy, target.sy);
    s.sy = nx;
    s.vy = nv;
    if (m) alive = true;
  }
  if (target.ty !== undefined) {
    const [nx, nv, m] = stepAxis(s.ty, s.vangle, target.ty);
    s.ty = nx;
    s.vangle = nv;
    if (m) alive = true;
  }
  return alive;
}

/**
 * Attaches spring-press behaviour to a pressable element (button, link,
 * card). On pointer-down the element SQUASHES (wide and short); on release
 * a critically-underdamped spring snaps it back, overshooting slightly
 * (tall and thin) before it settles — the squash-and-stretch that says
 * "rubber".
 *
 * The spring writes only `transform` (scale + translate), never layout.
 * Under reduced motion the squash is replaced by a tiny static press-down
 * (no oscillation), and keyboard `:active` is covered by the CSS fallback.
 *
 * Returns a ref to attach to the element.
 */
export function useSpringPress<T extends HTMLElement>(disabled: boolean) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (disabled) return; // CSS handles a static press-down

    const cfg = CONFIGS.press;
    const s: SpringState = {
      sx: 1,
      sy: 1,
      tx: 0,
      ty: 0,
      vx: 0,
      vy: 0,
      vangle: 0,
      angle: 0,
    };
    let raf = 0;
    let last = 0;
    let pressing = false;
    let target: Partial<SpringState> = { sx: 1, sy: 1 };

    const write = () => {
      // translate is only used to nest a tiny press-down so the squash
      // looks like it pushes into the page; main motion is scale.
      el.style.transform = `translate3d(0, ${s.ty.toFixed(2)}px, 0) scale(${s.sx.toFixed(4)}, ${s.sy.toFixed(4)})`;
    };

    const tick = (now: number) => {
      const dt = last ? Math.min(48, now - last) : 16.7;
      last = now;
      const alive = integrate(s, target, cfg, dt);
      write();
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

    const onDown = (e: PointerEvent) => {
      if (e.pointerType === "keyboard") return;
      pressing = true;
      // Squash: wider and shorter, like a rubber stamp being pressed.
      target = { sx: 1.12, sy: 0.82, ty: 2 };
      s.vy = 0;
      wake();
    };
    const onUp = () => {
      if (!pressing) return;
      pressing = false;
      // Release: spring back through 1 with overshoot (the underdamped
      // spring naturally overshoots on the way to rest).
      target = { sx: 1, sy: 1, ty: 0 };
      wake();
    };

    el.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    el.addEventListener("blur", onUp);

    return () => {
      el.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      el.removeEventListener("blur", onUp);
      cancelAnimationFrame(raf);
      el.style.transform = "";
    };
  }, [disabled]);

  return ref;
}
