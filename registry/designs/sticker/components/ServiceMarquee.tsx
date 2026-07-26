"use client";

import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

type Word = [ko: string, en: string];

const ROW_A: Word[] = [
  ["브랜딩", "BRANDING"],
  ["웹사이트", "WEBSITES"],
  ["웹툰", "WEBTOONS"],
  ["일러스트", "ILLUSTRATION"],
  ["모션", "MOTION"],
];

const ROW_B: Word[] = [
  ["재밌게", "PLAYFUL"],
  ["끈적하게", "STICKY"],
  ["통통 튀게", "BOUNCY"],
  ["기억에 남게", "MEMORABLE"],
  ["색깔 있게", "COLORFUL"],
];

/** Base drift in px/ms (~50 px/s) plus a scroll-velocity boost, capped. */
const BASE = 0.05;
const BOOST = 0.05;
const CAP = 0.3;

/** Keep an offset in (-w, 0] so the identical groups tile seamlessly. */
function wrap(v: number, w: number): number {
  const r = v % w;
  return r > 0 ? r - w : r;
}

function Row({
  items,
  mod,
  trackRef,
  groupRef,
}: {
  items: Word[];
  mod: "a" | "b";
  trackRef: React.RefObject<HTMLDivElement | null>;
  groupRef: React.RefObject<HTMLSpanElement | null>;
}) {
  return (
    <div className={`sticker-marquee__row sticker-marquee__row--${mod}`} aria-hidden="true">
      <div className="sticker-marquee__track" ref={trackRef}>
        {[0, 1, 2, 3].map((n) => (
          <span
            key={n}
            className="sticker-marquee__group"
            ref={n === 0 ? groupRef : undefined}
          >
            {items.map(([ko, en], i) => (
              <span key={i} className="sticker-marquee__item">
                <span lang="ko">{ko}</span>{" "}
                <span className="sticker-marquee__en">{en}</span>
                <span className="sticker-marquee__sep">✦</span>
              </span>
            ))}
          </span>
        ))}
      </div>
    </div>
  );
}

/**
 * Section 01 (of the body) — two cheerful scrolling bands of studio services.
 * Row A runs the disciplines, row B runs the adjectives; they scroll in
 * opposite directions, and the page's scroll direction reverses both (down:
 * A left / B right; up: flip). Scroll velocity feeds their speed through an
 * exponential lerp, so a direction reversal reads as a skid, not a teleport.
 *
 * The moving rows are aria-hidden; every service word is delivered exactly
 * once in a visually hidden paragraph before them. Reduced motion: both rows
 * stand still. The band only spends frames while on screen.
 */
export default function ServiceMarquee() {
  const reduced = usePrefersReducedMotion();
  const bandRef = useRef<HTMLDivElement | null>(null);
  const trackA = useRef<HTMLDivElement | null>(null);
  const trackB = useRef<HTMLDivElement | null>(null);
  const groupA = useRef<HTMLSpanElement | null>(null);
  const groupB = useRef<HTMLSpanElement | null>(null);
  const energyRef = useRef({ dir: 1 as 1 | -1, vel: 0 });

  useEffect(() => {
    const band = bandRef.current;
    const ta = trackA.current;
    const tb = trackB.current;
    const ga = groupA.current;
    const gb = groupB.current;
    if (!band || !ta || !tb || !ga || !gb) return;

    if (reduced) {
      ta.style.transform = "";
      tb.style.transform = "";
      return;
    }

    let raf = 0;
    let last = 0;
    let offA = 0;
    let offB = 0;
    let curA = 0;
    let curB = 0;
    let wA = Math.max(1, ga.offsetWidth);
    let wB = Math.max(1, gb.offsetWidth);
    const energy = energyRef.current;

    const ro = new ResizeObserver(() => {
      wA = Math.max(1, ga.offsetWidth);
      wB = Math.max(1, gb.offsetWidth);
    });
    ro.observe(ga);
    ro.observe(gb);

    // passive scroll listener pumps energy in; the ticker bleeds it out
    let lastY = window.scrollY;
    let lastT = performance.now();
    const onScroll = () => {
      const y = window.scrollY;
      const t = performance.now();
      const dy = y - lastY;
      const dt = Math.max(1, t - lastT);
      if (dy !== 0) energy.dir = dy > 0 ? 1 : -1;
      const v = Math.min(4, Math.abs(dy) / dt);
      energy.vel = energy.vel * 0.6 + v * 0.4;
      lastY = y;
      lastT = t;
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    const tick = (t: number) => {
      const dt = last ? Math.min(48, t - last) : 16.7;
      last = t;
      energy.vel *= Math.pow(0.94, dt / 16.7);
      const speed = Math.min(CAP, BASE + energy.vel * BOOST);
      const k = 1 - Math.pow(0.86, dt / 16.7);
      curA += (energy.dir * -speed - curA) * k;
      curB += (energy.dir * speed - curB) * k;
      offA = wrap(offA + curA * dt, wA);
      offB = wrap(offB + curB * dt, wB);
      ta.style.transform = `translate3d(${offA.toFixed(2)}px, 0, 0)`;
      tb.style.transform = `translate3d(${offB.toFixed(2)}px, 0, 0)`;
      raf = requestAnimationFrame(tick);
    };

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

    const onVisibility = () => {
      if (document.hidden && raf) {
        cancelAnimationFrame(raf);
        raf = 0;
        last = 0;
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [reduced]);

  return (
    <div className="sticker-marquee" ref={bandRef}>
      <p className="sticker-vh">
        {[...ROW_A, ...ROW_B]
          .map(([ko, en]) => `${ko} ${en}`)
          .join(" · ")}
      </p>
      <Row items={ROW_A} mod="a" trackRef={trackA} groupRef={groupA} />
      <Row items={ROW_B} mod="b" trackRef={trackB} groupRef={groupB} />
    </div>
  );
}
