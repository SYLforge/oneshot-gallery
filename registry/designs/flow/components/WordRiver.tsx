"use client";

import { useEffect, useRef } from "react";
import {
  drawRiver,
  readPalette,
  seedGlyphs,
  stepRiver,
  type FlowGlyph,
  type RiverState,
} from "./riverSim";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

/** Backing-store resolution cap — text gains little above 2× DPR. */
const MAX_DPR = 2;
/** Pointer push radius in CSS px — how close the cursor must be to nudge a word. */
const PUSH_RADIUS = 160;
/** Pointer push strength in CSS px — the maximum offset at the cursor. */
const PUSH_STRENGTH = 54;

/**
 * The river. A DPR-capped canvas draws a few dozen words drifting along
 * sine waves in three planes of depth. Far words are small, faint, and
 * slow; near words are large, crisp, and fast — the same three-depth
 * composition the dream entry uses for its clouds, restated for type.
 *
 * Pointer interaction is a soft radial push: a word within PUSH_RADIUS of
 * the cursor is nudged gently downstream of it, as if the cursor were a
 * stone parting the current. The push lerps back to zero when the pointer
 * leaves, so the river settles. Touch devices and reduced motion get the
 * still composition (the canvas drawn once at its seed frame).
 *
 * The canvas owns one rAF, paused when the river leaves the viewport and
 * when the tab hides. The palette is read from CSS custom properties on
 * the host, so the river picks up the entry's tokens without a hard-coded
 * hex in this file.
 */
export default function WordRiver() {
  const reduced = usePrefersReducedMotion();
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const palette = readPalette(wrap);

    // CSS-pixel size of the canvas, tracked across resizes.
    let cssW = wrap.clientWidth;
    let cssH = wrap.clientHeight;
    let glyphs: FlowGlyph[] = [];
    const state: RiverState = {
      t: 0,
      px: null,
      py: null,
      pushRadius: PUSH_RADIUS,
      pushStrength: PUSH_STRENGTH,
    };

    let raf = 0;
    let running = false;
    let visible = false;
    let lastT = performance.now();

    const resize = () => {
      const rect = wrap.getBoundingClientRect();
      const w = Math.max(1, Math.round(rect.width));
      const h = Math.max(1, Math.round(rect.height));
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cssW = w;
      cssH = h;
      // Re-seed only on a meaningful size change, to keep the composition
      // stable across tiny sub-pixel resizes.
      const prev = glyphs.length > 0 ? glyphs : null;
      const seeded = seedGlyphs(w, h);
      if (prev && prev.length === seeded.length) {
        // Preserve horizontal drift across a small resize so the river
        // doesn't jump; just resync the lane y to the new height.
        for (let i = 0; i < prev.length && i < seeded.length; i++) {
          seeded[i].x = prev[i].x;
          seeded[i].phase = prev[i].phase;
        }
      }
      glyphs = seeded;
    };

    const draw = (dtMs: number) => {
      stepRiver(glyphs, state, dtMs, cssW, cssH, reduced);
      drawRiver(ctx, {
        glyphs,
        state,
        palette,
        w: cssW,
        h: cssH,
        still: reduced,
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

    // First paint. Under reduced motion this single draw is the whole show.
    if (reduced) {
      draw(0);
    } else {
      draw(16);
    }

    const ro = new ResizeObserver(() => {
      resize();
      if (reduced) {
        draw(0);
      } else if (!running) {
        draw(16);
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

    // Pointer push — the stone in the current. Fine pointers only; touch
    // devices rest at the still composition (the reduced-motion branch).
    const onPointerMove = (ev: PointerEvent) => {
      if (reduced) return;
      if (ev.pointerType !== "mouse" && ev.pointerType !== "pen") return;
      const rect = wrap.getBoundingClientRect();
      if (rect.width < 4 || rect.height < 4) return;
      const nx = ev.clientX - rect.left;
      const ny = ev.clientY - rect.top;
      // NaN guard: a pointer at Infinity must never poison the river.
      state.px = Number.isFinite(nx) ? nx : null;
      state.py = Number.isFinite(ny) ? ny : null;
    };
    const onPointerLeave = () => {
      state.px = null;
      state.py = null;
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    wrap.addEventListener("pointerleave", onPointerLeave);

    if (!reduced) sync();

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("pointermove", onPointerMove);
      wrap.removeEventListener("pointerleave", onPointerLeave);
    };
  }, [reduced]);

  return (
    <div ref={wrapRef} className="flow-river" aria-hidden="true">
      <canvas ref={canvasRef} className="flow-river__canvas" />
    </div>
  );
}
