"use client";

import { useEffect, useRef, type RefObject } from "react";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import { useScrollEnergy } from "../hooks/useScrollEnergy";

type Slogan = [en: string, ko: string];

const ROW_A: Slogan[] = [
  ["WE PRINT LOUD.", "조용한 건 안 찍음."],
  ["TWO COLORS. THAT'S IT.", "두 도수면 충분하다."],
  ["MISREGISTRATION IS A FEATURE.", "핀 나가도 그게 멋."],
  ["NO GRADIENTS.", "그라데이션 사절."],
];

const ROW_B: Slogan[] = [
  ["SOY INK ONLY.", "콩기름 잉크만 씀."],
  ["MATTE OR GO HOME.", "무광 아니면 돌아가."],
  ["1,000 COPIES, ZERO APOLOGIES.", "천 장 찍고 사과는 없음."],
  ["KNOCK HARD.", "파란 문, 세게 두드릴 것."],
];

/** Base drift in px/ms (~66 px/s) plus a scroll-velocity boost, capped. */
const BASE = 0.066;
const BOOST = 0.055;
const CAP = 0.34;

/** Keep an offset in (-w, 0] so the 4 identical groups tile seamlessly. */
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
  items: Slogan[];
  mod: "a" | "b";
  trackRef: RefObject<HTMLDivElement | null>;
  groupRef: RefObject<HTMLSpanElement | null>;
}) {
  return (
    <div className={`blunt-marquee__row blunt-marquee__row--${mod}`} aria-hidden="true">
      <div className="blunt-marquee__track" ref={trackRef}>
        {[0, 1, 2, 3].map((n) => (
          <span
            key={n}
            className="blunt-marquee__group"
            ref={n === 0 ? groupRef : undefined}
          >
            {items.map(([en, ko], i) => (
              <span key={i} className="blunt-marquee__item">
                {en} <span lang="ko">{ko}</span>
                <span className="blunt-marquee__sep">★</span>
              </span>
            ))}
          </span>
        ))}
      </div>
    </div>
  );
}

/**
 * Section 02 — two shop-slogan tickers, bordered 3px top and bottom,
 * running in opposite directions. The page's scroll direction REVERSES
 * them (scroll down: row A goes left, row B right; scroll up: flip), and
 * scroll velocity feeds their speed. The signed speed approaches its
 * target through an exponential lerp, so a flip is a hard-nosed skid,
 * not a teleport. Reduced motion: both rows stand still.
 *
 * The moving rows are aria-hidden; each slogan is delivered exactly once
 * in a visually hidden paragraph before them.
 */
export default function MarqueeBand() {
  const reduced = usePrefersReducedMotion();
  const energy = useScrollEnergy();
  const bandRef = useRef<HTMLDivElement | null>(null);
  const trackA = useRef<HTMLDivElement | null>(null);
  const trackB = useRef<HTMLDivElement | null>(null);
  const groupA = useRef<HTMLSpanElement | null>(null);
  const groupB = useRef<HTMLSpanElement | null>(null);

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

    const ro = new ResizeObserver(() => {
      wA = Math.max(1, ga.offsetWidth);
      wB = Math.max(1, gb.offsetWidth);
    });
    ro.observe(ga);
    ro.observe(gb);

    const tick = (t: number) => {
      const dt = last ? Math.min(48, t - last) : 16.7;
      last = t;
      const e = energy.current;
      // The hook pumps energy in; the ticker bleeds it out.
      e.vel *= Math.pow(0.94, dt / 16.7);
      const speed = Math.min(CAP, BASE + e.vel * BOOST);
      const k = 1 - Math.pow(0.88, dt / 16.7);
      curA += (e.dir * -speed - curA) * k;
      curB += (e.dir * speed - curB) * k;
      offA = wrap(offA + curA * dt, wA);
      offB = wrap(offB + curB * dt, wB);
      ta.style.transform = `translate3d(${offA.toFixed(2)}px, 0, 0)`;
      tb.style.transform = `translate3d(${offB.toFixed(2)}px, 0, 0)`;
      raf = requestAnimationFrame(tick);
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
    };
  }, [reduced, energy]);

  return (
    <div className="blunt-marquee" ref={bandRef}>
      <p className="blunt-vh">
        {[...ROW_A, ...ROW_B].map(([en, ko]) => `${en} ${ko}`).join(" · ")}
      </p>
      <Row items={ROW_A} mod="a" trackRef={trackA} groupRef={groupA} />
      <Row items={ROW_B} mod="b" trackRef={trackB} groupRef={groupB} />
    </div>
  );
}
