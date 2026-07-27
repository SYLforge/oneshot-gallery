"use client";

import { useEffect, useRef, type RefObject } from "react";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

/**
 * Drives a single horizontal marquee band via a rAF translate3d loop.
 *
 * The band carries the zine's masthead & credits — a scrolling ticker that
 * reverses with scroll direction and speeds up with scroll velocity, so a
 * reader scrolling fast feels the band accelerate and skid. The signed
 * speed approaches its target through an exponential lerp (dt-normalized
 * so a 120Hz display doesn't run twice as fast as a 60Hz one), which makes
 * a scroll-direction flip read as a hard skid, not a teleport.
 *
 * Discipline:
 * - Four identical groups tile seamlessly; the offset is kept in (−w, 0].
 * - An IntersectionObserver starts/stops the loop, so an offscreen band
 *   costs zero frames.
 * - A ResizeObserver re-measures group width on viewport change so the
 *   seam stays invisible.
 * - `prefers-reduced-motion`: the band holds still (the static zine reads
 *   fine without it). No JS: the band is a static overflow row.
 *
 * Returns refs to attach: the band (observer target) and the track (the
 * moving element). The component renders the four groups; this hook only
 * moves the track.
 */
export function useMarquee(): {
  bandRef: RefObject<HTMLDivElement | null>;
  trackRef: RefObject<HTMLDivElement | null>;
  groupRef: RefObject<HTMLSpanElement | null>;
} {
  const reduced = usePrefersReducedMotion();
  const bandRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const groupRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const band = bandRef.current;
    const track = trackRef.current;
    const group = groupRef.current;
    if (!band || !track || !group) return;

    if (reduced) {
      track.style.transform = "";
      return;
    }

    /** Base drift in px/ms (~50 px/s) plus a scroll-velocity boost, capped. */
    const BASE = 0.05;
    const BOOST = 0.04;
    const CAP = 0.32;

    let raf = 0;
    let last = 0;
    let offset = 0;
    let cur = 0; // signed smoothed speed
    let dir = 1; // 1 = scrolling down, -1 = up; starts drifting left
    let vel = 0; // smoothed |scroll speed| in px/ms
    let width = Math.max(1, group.offsetWidth);

    const ro = new ResizeObserver(() => {
      width = Math.max(1, group.offsetWidth);
    });
    ro.observe(group);

    const onScroll = () => {
      // The hook pumps energy in (dir + vel); the ticker bleeds it out.
      const y = window.scrollY;
      const t = performance.now();
      const dt = Math.max(1, t - lastScrollT);
      const dy = y - lastScrollY;
      if (dy !== 0) dir = dy > 0 ? 1 : -1;
      vel = vel * 0.6 + (Math.min(4, Math.abs(dy) / dt)) * 0.4;
      lastScrollY = y;
      lastScrollT = t;
    };
    let lastScrollY = window.scrollY;
    let lastScrollT = performance.now();
    window.addEventListener("scroll", onScroll, { passive: true });

    /** Keep an offset in (−w, 0] so the 4 identical groups tile seamlessly. */
    const wrap = (v: number): number => {
      const r = v % width;
      return r > 0 ? r - width : r;
    };

    const tick = (t: number) => {
      raf = requestAnimationFrame(tick);
      const dt = last ? Math.min(48, t - last) : 16.7;
      last = t;
      vel *= Math.pow(0.94, dt / 16.7); // bleed velocity out
      const target = dir * -1 * (BASE + vel * BOOST); // scroll down → drift left
      const k = 1 - Math.pow(0.88, dt / 16.7);
      cur += (Math.max(-CAP, Math.min(CAP, target)) - cur) * k;
      offset = wrap(offset + cur * dt);
      track.style.transform = `translate3d(${offset.toFixed(2)}px, 0, 0)`;
    };

    // Only spend frames while the band is on screen.
    const io = new IntersectionObserver(
      ([hit]) => {
        if (hit.isIntersecting && !raf) {
          last = 0;
          raf = requestAnimationFrame(tick);
        } else if (!hit.isIntersecting && raf) {
          cancelAnimationFrame(raf);
          raf = 0;
        }
      },
      { rootMargin: "80px" },
    );
    io.observe(band);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, [reduced]);

  return { bandRef, trackRef, groupRef };
}
