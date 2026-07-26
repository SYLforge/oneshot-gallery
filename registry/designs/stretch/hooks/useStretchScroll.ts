"use client";

import { useEffect, useRef } from "react";

/**
 * The pinned pose-sequence's engine. Writes a `--st-scrub` custom property
 * (0→1) onto the pinned scene's element, measured against the *tall spacer*
 * that wraps it: as the reader scrolls through the spacer, the pinned
 * headline of the active pose elongates (scaleY grows) and its name writes
 * itself, exactly as far as the reader has scrolled — then the scene
 * releases when the spacer ends.
 *
 * This is the kinetic-typography signature: the type stretches vertically
 * like a body reaching in a pose, driven by how long you hold the scroll.
 * Slow lerp, long reach, calm.
 *
 * Discipline:
 * - One read (the spacer's rect), one write (the custom property) per
 *   frame — read before write, no layout thrash.
 * - Raw progress is lerp-smoothed with a dt-normalized, deliberately slow
 *   factor (0.88 → half-life ≈ 5.4 frames) so the catch-up feels like a
 *   held breath rather than a snap.
 * - An IntersectionObserver starts/stops the loop; an offscreen sequence
 *   costs zero frames. The loop also pauses when the tab is hidden.
 * - Disabled (reduced motion) or never mounted (no JS): CSS defaults
 *   `--st-scrub` to 1 — every pose is at full reach, fully written, a
 *   finished static page.
 */
export function useStretchScroll<T extends HTMLElement>(disabled: boolean) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (disabled) {
      el.style.setProperty("--st-scrub", "1");
      return;
    }

    let raf = 0;
    let last = 0;
    let value: number | null = null;

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(Math.max(now - last, 1), 48);
      last = now;

      // The tall spacer IS the element we measure; the pinned scene sits
      // inside it. The scrub runs from "spacer top at 18vh" to "spacer
      // bottom at 82vh" — a long, calm span that lets each pose breathe.
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const span = Math.max(rect.height - vh * 0.64, 1);
      const raw = (vh * 0.18 - rect.top) / span;
      const target = Math.min(1, Math.max(0, raw));

      if (value === null) {
        value = target;
      } else {
        value += (target - value) * (1 - Math.pow(0.88, dt / 16.7));
        if (Math.abs(target - value) < 0.0005) value = target;
      }

      el.style.setProperty("--st-scrub", value.toFixed(4));
    };

    const start = () => {
      if (raf) return;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      if (!raf) return;
      cancelAnimationFrame(raf);
      raf = 0;
    };

    const onVisibility = () => {
      if (document.hidden) stop();
      else {
        // Re-evaluate via the observer the next tick.
        start();
      }
    };

    if (!("IntersectionObserver" in window)) {
      start();
      document.addEventListener("visibilitychange", onVisibility);
      return () => {
        stop();
        document.removeEventListener("visibilitychange", onVisibility);
      };
    }

    const io = new IntersectionObserver(
      (hits) => {
        for (const hit of hits) {
          if (hit.isIntersecting && !document.hidden) start();
          else stop();
        }
      },
      { rootMargin: "20% 0px 20% 0px" },
    );
    io.observe(el);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      stop();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [disabled]);

  return ref;
}
