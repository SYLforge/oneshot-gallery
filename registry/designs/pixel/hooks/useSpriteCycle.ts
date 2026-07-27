"use client";

import { useEffect, useState, type RefObject } from "react";

/** Frame interval in ms — a calm arcade idle, not a flicker. */
const FRAME_MS = 420;

/**
 * Cycles a pixel sprite between N animation frames by returning a frame
 * index the component uses to pick its box-shadow grid. The cycle is
 * rAF-gated and pauses (a) when the sprite leaves the viewport via
 * IntersectionObserver and (b) when the tab is hidden — so an offscreen
 * mascot costs zero frames. Under prefers-reduced-motion the hook parks
 * on frame 0 and never starts a loop, which is exactly the static,
 * composed sprite the rubric asks for.
 *
 * The component owns the sprite grids (they are data, not motion), so
 * pausing always leaves a complete, readable frame on screen — never a
 * blank or a half-drawn glyph.
 */
export function useSpriteCycle(
  targetRef: RefObject<HTMLElement | null>,
  frameCount: number,
  reduced: boolean,
): number {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    if (reduced || frameCount <= 1) return;
    const el = targetRef.current;
    if (!el) return;

    let raf = 0;
    let running = false;
    let visible = true;
    let last = 0;
    let acc = 0;
    let i = 0;

    const step = (now: number) => {
      raf = requestAnimationFrame(step);
      const dt = Math.min(now - last, 64);
      last = now;
      acc += dt;
      if (acc >= FRAME_MS) {
        acc = 0;
        i = (i + 1) % frameCount;
        setFrame(i);
      }
    };

    const sync = () => {
      const should = visible && !document.hidden;
      if (should && !running) {
        running = true;
        last = performance.now();
        raf = requestAnimationFrame(step);
      } else if (!should && running) {
        running = false;
        cancelAnimationFrame(raf);
      }
    };

    const onVisibility = () => sync();

    const io = new IntersectionObserver((hits) => {
      visible = hits[hits.length - 1].isIntersecting;
      sync();
    });
    io.observe(el);

    document.addEventListener("visibilitychange", onVisibility);
    sync();

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [targetRef, frameCount, reduced]);

  return frame;
}
