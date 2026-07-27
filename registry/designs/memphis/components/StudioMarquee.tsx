"use client";

import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

type Slogan = [en: string, ko: string];

const ROW_A: Slogan[] = [
  ["FORM IS FREE", "형태는 자유롭게"],
  ["RULES ARE HARD", "규칙은 단단하게"],
  ["EVERY SQUIGGLE EARNS ITS PLACE", "물결 하나에도 이유가 있다"],
];

const ROW_B: Slogan[] = [
  ["COLOR FIRST", "색이 먼저"],
  ["GEOMETRY ALWAYS", "기하는 언제나"],
  ["MAXIMUM JOY, MINIMUM WASTE", "최대의 기쁨, 최소의 낭비"],
];

/** Base drift in px/ms (~50 px/s). Capped constant; no scroll coupling here. */
const SPEED = 0.05;

/** Keep an offset in (-w, 0] so the duplicated groups tile seamlessly. */
function wrap(v: number, w: number): number {
  const r = v % w;
  return r > 0 ? r - w : r;
}

function Row({
  items,
  mod,
  dir,
  trackRef,
  groupRef,
}: {
  items: Slogan[];
  mod: "a" | "b";
  dir: 1 | -1;
  trackRef: React.RefObject<HTMLDivElement | null>;
  groupRef: React.RefObject<HTMLSpanElement | null>;
}) {
  return (
    <div className={`mp-marquee__row mp-marquee__row--${mod}`} aria-hidden="true">
      <div className="mp-marquee__track" ref={trackRef}>
        {[0, 1, 2, 3].map((n) => (
          <span
            key={n}
            className="mp-marquee__group"
            ref={n === 0 ? groupRef : undefined}
          >
            {items.map(([en, ko], i) => (
              <span key={i} className="mp-marquee__item">
                <span className="mp-marquee__en">{en}</span>{" "}
                <span lang="ko" className="mp-marquee__ko">
                  {ko}
                </span>
                <span className="mp-marquee__sep" aria-hidden="true">
                  ◆
                </span>
              </span>
            ))}
          </span>
        ))}
      </div>
    </div>
  );
}

/**
 * A two-row slogan band between sections — a Memphis voice ticker. Two rows
 * run in opposite directions at a constant gentle pace; the studio's
 * manifesto as moving type. Reduced motion: both rows stand still.
 *
 * The moving rows are aria-hidden; every slogan is delivered once in a
 * visually hidden paragraph before them.
 */
export default function StudioMarquee() {
  const reduced = usePrefersReducedMotion();
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
      offA = wrap(offA - SPEED * dt, wA);
      offB = wrap(offB + SPEED * dt, wB);
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

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
    };
  }, [reduced]);

  return (
    <div className="mp-marquee" ref={bandRef}>
      <p className="mp-vh">
        {[...ROW_A, ...ROW_B].map(([en, ko]) => `${en} ${ko}`).join(" · ")}
      </p>
      <Row items={ROW_A} mod="a" dir={1} trackRef={trackA} groupRef={groupA} />
      <Row items={ROW_B} mod="b" dir={-1} trackRef={trackB} groupRef={groupB} />
    </div>
  );
}
