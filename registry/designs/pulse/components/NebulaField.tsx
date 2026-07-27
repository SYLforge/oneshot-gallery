"use client";

import { useEffect, useRef } from "react";
import {
  drawNebula,
  seedParticles,
  stepNebula,
  stepParticles,
  type NebulaState,
} from "./nebula";

/** Backing-store resolution cap — a particle field gains little above 2. */
const MAX_DPR = 2;
/** Particle count — a few hundred is cheap at 60fps and reads as a nebula. */
const PARTICLE_COUNT = 360;
/** World-space half-extent the field spans. */
const SPAN = 1.0;
/** Focal length for the perspective divide. */
const FOCAL = 1.6;
/** Trail alpha — how much of the previous frame survives. */
const TRAIL = 0.22;
/** Max camera tilt (radians) — the nebula leans, never spins. */
const MAX_TILT = 0.13;
/** Pointer→tilt gain. */
const TILT_GAIN = 0.22;

type Props = {
  /** A ref the page writes the scroll-driven track value into (0..1). */
  trackRef: React.MutableRefObject<{ raw: number; smooth: number }>;
  /** True under prefers-reduced-motion — the field composes a still. */
  reduced: boolean;
};

/**
 * The nebula. A DPR-capped canvas draws a few hundred 3D-projected points
 * every frame, breathing to a simulated 120 BPM beat (no real audio). The
 * camera tilts with pointer parallax (rotX/rotY from pointer offset, lerped
 * and capped at MAX_TILT). A low-alpha clear leaves a motion trail.
 *
 * The canvas owns one rAF, paused when the field leaves the viewport and
 * when the tab hides. Under reduced motion the field is composed once at a
 * chosen frame (mid-beat, neutral camera) and frozen — not a blank.
 *
 * Pointer parallax is input-only and degrades gracefully: on touch, with no
 * pointer, the camera drifts gently on its own so the field is never still
 * (the autonomous idle drift, gated off under reduced motion).
 */
export default function NebulaField({ trackRef, reduced }: Props) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const particles = seedParticles(PARTICLE_COUNT, SPAN);

    const state: NebulaState = {
      rotX: 0,
      rotY: 0,
      targetRotX: 0,
      targetRotY: 0,
      beat: 0.35,
      t: 0,
      track: 0,
      trackRaw: 0,
    };

    let raf = 0;
    let running = false;
    let visible = false;
    let lastT = performance.now();
    let lastPointerT = -1e9;
    // Autonomous idle drift phase (touch / no-pointer fallback).
    let idlePhase = 0;

    const resize = () => {
      const rect = wrap.getBoundingClientRect();
      if (rect.width < 4 || rect.height < 4) return;
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = (dtMs: number) => {
      // Pull the scroll-driven track value (written by useScrollProgress via
      // the shared ref) into the nebula state each frame.
      state.track = trackRef.current.smooth;
      state.trackRaw = trackRef.current.raw;

      stepNebula(state, dtMs, reduced);
      stepParticles(particles, dtMs, reduced);

      // Autonomous idle camera drift when the pointer has been quiet (touch /
      // unattended). Gated off under reduced motion.
      if (!reduced) {
        const now = performance.now();
        if (now - lastPointerT > 3500) {
          idlePhase += dtMs / 1000;
          state.targetRotX = Math.sin(idlePhase * 0.31) * MAX_TILT * 0.55;
          state.targetRotY = Math.cos(idlePhase * 0.23) * MAX_TILT * 0.7;
        }
      }

      const rect = wrap.getBoundingClientRect();
      drawNebula(ctx, {
        state,
        particles,
        focal: FOCAL,
        span: SPAN,
        w: rect.width,
        h: rect.height,
        trail: TRAIL,
        still: false,
      });
    };

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = now - lastT;
      lastT = now;
      draw(dt);
    };

    const start = () => {
      if (running) return;
      running = true;
      lastT = performance.now();
      raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };
    const sync = () => {
      const should = visible && !document.hidden;
      if (should) start();
      else stop();
    };

    resize();
    // First paint — also the reduced-motion still (mid-beat, neutral camera).
    if (reduced) {
      state.beat = 0.35;
      stepParticles(particles, 0, true);
      const rect = wrap.getBoundingClientRect();
      drawNebula(ctx, {
        state,
        particles,
        focal: FOCAL,
        span: SPAN,
        w: rect.width,
        h: rect.height,
        trail: TRAIL,
        still: true,
      });
    } else {
      draw(16);
    }

    const ro = new ResizeObserver(() => {
      resize();
      if (!running && !reduced) draw(16);
      else if (reduced) {
        const rect = wrap.getBoundingClientRect();
        drawNebula(ctx, {
          state,
          particles,
          focal: FOCAL,
          span: SPAN,
          w: rect.width,
          h: rect.height,
          trail: TRAIL,
          still: true,
        });
      }
    });
    ro.observe(wrap);

    const io = new IntersectionObserver(
      (hits) => {
        visible = hits[hits.length - 1].isIntersecting;
        sync();
      },
      { rootMargin: "80px 0px" },
    );
    io.observe(wrap);

    const onVis = () => sync();
    document.addEventListener("visibilitychange", onVis);

    // Pointer parallax — the camera leans with the pointer, lerped + capped.
    // Touch devices without a pointer fall back to the idle drift above.
    const onPointerMove = (ev: PointerEvent) => {
      if (reduced) return;
      const rect = wrap.getBoundingClientRect();
      if (rect.width < 4 || rect.height < 4) return;
      const nx = (ev.clientX - rect.left) / rect.width - 0.5;
      const ny = (ev.clientY - rect.top) / rect.height - 0.5;
      state.targetRotY = Math.max(-MAX_TILT, Math.min(MAX_TILT, nx * TILT_GAIN));
      state.targetRotX = Math.max(-MAX_TILT, Math.min(MAX_TILT, ny * TILT_GAIN));
      lastPointerT = performance.now();
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    if (!reduced) sync();

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("pointermove", onPointerMove);
    };
  }, [trackRef, reduced]);

  return (
    <div ref={wrapRef} className="pulse-nebula" aria-hidden="true">
      <canvas ref={canvasRef} className="pulse-nebula__canvas" />
    </div>
  );
}
