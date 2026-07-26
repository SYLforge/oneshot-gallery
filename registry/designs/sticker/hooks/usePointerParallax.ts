"use client";

import { useEffect, useRef, type RefObject } from "react";

type LayerSpec = {
  /** The translate multiplier applied to this layer (0..1). Far layers are
   * smaller; near layers are bigger. */
  depth: number;
};

type Layer = LayerSpec & {
  el: HTMLElement;
};

/**
 * usePointerParallax — layered depth that drifts toward the pointer.
 *
 * Pass a container ref; every descendant carrying `data-sticker-parallax`
 * (with a numeric value 0..1) becomes a parallax layer. Each frame the layers
 * ease toward a target derived from the pointer offset from the container
 * center, capped at ±18px so the page never lurches. The approach is an
 * exponential lerp (`1 − 0.82^(dt/16.7)`) — the layers follow with a soft
 * lag, which is the whole point: parallax reads as depth only when it trails.
 *
 * Reduced motion: no layers move; the hook returns without attaching. No-JS:
 * nothing depends on this — layers sit at their CSS rest positions.
 */
export function usePointerParallax(
  containerRef: RefObject<HTMLElement | null>,
  reduced: boolean,
): void {
  const layersRef = useRef<Layer[]>([]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || reduced) return;

    const els = Array.from(
      container.querySelectorAll<HTMLElement>("[data-sticker-parallax]"),
    );
    const layers: Layer[] = els
      .map((el) => {
        const raw = el.getAttribute("data-sticker-parallax") ?? "0";
        const depth = clamp01(Number.parseFloat(raw) || 0);
        return { el, depth };
      })
      // far layers first so near layers paint on top during the transform
      .sort((a, b) => a.depth - b.depth);
    layersRef.current = layers;

    const CAP = 18; // px — the page never lurches
    let targetX = 0;
    let targetY = 0;
    let curX = 0;
    let curY = 0;
    let raf = 0;
    let last = 0;

    const apply = () => {
      for (const l of layers) {
        l.el.style.transform =
          `translate3d(${(curX * l.depth).toFixed(2)}px, ${(curY * l.depth).toFixed(2)}px, 0)`;
      }
    };

    const tick = (t: number) => {
      const dt = last ? Math.min(48, t - last) : 16.7;
      last = t;
      const k = 1 - Math.pow(0.82, dt / 16.7);
      curX += (targetX - curX) * k;
      curY += (targetY - curY) * k;
      apply();
      // keep running while we haven't settled onto the target
      if (Math.abs(targetX - curX) > 0.05 || Math.abs(targetY - curY) > 0.05) {
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

    const onMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      // pointer offset from container center, normalized to ±0.5
      const nx = (e.clientX - (rect.left + rect.width / 2)) / rect.width;
      const ny = (e.clientY - (rect.top + rect.height / 2)) / rect.height;
      targetX = clamp(nx * 2 * CAP, -CAP, CAP);
      targetY = clamp(ny * 2 * CAP, -CAP, CAP);
      wake();
    };

    const onLeave = () => {
      targetX = 0;
      targetY = 0;
      wake();
    };

    const onVisibility = () => {
      if (document.hidden && raf) {
        cancelAnimationFrame(raf);
        raf = 0;
        last = 0;
      }
    };

    container.addEventListener("pointermove", onMove);
    container.addEventListener("pointerout", onLeave);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      container.removeEventListener("pointermove", onMove);
      container.removeEventListener("pointerout", onLeave);
      document.removeEventListener("visibilitychange", onVisibility);
      cancelAnimationFrame(raf);
      // reset transforms so a later reduced-motion flip starts clean
      if (layersRef.current) {
        for (const l of layersRef.current) l.el.style.transform = "";
      }
    };
  }, [containerRef, reduced]);
}

function clamp(v: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, v));
}
function clamp01(v: number): number {
  return clamp(v, 0, 1);
}
