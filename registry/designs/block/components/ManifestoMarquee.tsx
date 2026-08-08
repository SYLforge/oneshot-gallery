"use client";

import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

type Slogan = [en: string, ko: string];

const ROW_A: Slogan[] = [
  ["POETRY IS CONCRETE", "시는 콘크리트"],
  ["WORDS ARE WALLS", "단어가 벽"],
  ["WALLS ARE POEMS", "벽이 시"],
];

const ROW_B: Slogan[] = [
  ["EVERY LINE IS 3PX", "모든 선은 3픽셀"],
  ["NO GRADIENT", "그라데이션 없음"],
  ["DO NOT DEMOLISH", "무너뜨리지 마라"],
];

/** 기본 표류 속도 px/ms (~52 px/s). 고정 상수; 스크롤 연결 없음. */
const SPEED = 0.052;

/** offset 을 (-w, 0] 에 두어 복제 그룹이 매끄럽게 이어지도록. */
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
  trackRef: React.RefObject<HTMLDivElement | null>;
  groupRef: React.RefObject<HTMLSpanElement | null>;
}) {
  return (
    <div className={`bk-marquee__row bk-marquee__row--${mod}`} aria-hidden="true">
      <div className="bk-marquee__track" ref={trackRef}>
        {[0, 1, 2, 3].map((n) => (
          <span
            key={n}
            className="bk-marquee__group"
            ref={n === 0 ? groupRef : undefined}
          >
            {items.map(([en, ko], i) => (
              <span key={i} className="bk-marquee__item">
                <span className="bk-marquee__en">{en}</span>{" "}
                <span lang="ko" className="bk-marquee__ko">
                  {ko}
                </span>
                <span className="bk-marquee__sep" aria-hidden="true">
                  ▮
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
 * 섹션 사이의 슬로건 밴드 — 출판의 voice ticker. 두 줄이 반대 방향으로
 * 일정한 속도로 흐른다; 출판의 선언이 움직이는 활자. 동작 감소: 두 줄 다
 * 멈춘다.
 *
 * 움직이는 줄은 aria-hidden; 모든 슬로건은 그 앞의 visually-hidden
 * 단락에 한 번 전달된다.
 */
export default function ManifestoMarquee() {
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
    <div className="bk-marquee" ref={bandRef}>
      <p className="bk-vh">
        {[...ROW_A, ...ROW_B].map(([en, ko]) => `${en} ${ko}`).join(" · ")}
      </p>
      <Row items={ROW_A} mod="a" trackRef={trackA} groupRef={groupA} />
      <Row items={ROW_B} mod="b" trackRef={trackB} groupRef={groupB} />
    </div>
  );
}
