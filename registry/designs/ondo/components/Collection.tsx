"use client";

import { useEffect, useRef } from "react";
import type { KeyboardEvent, PointerEvent as ReactPointerEvent } from "react";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

type Stop = { offset: string; color: string; opacity: number };

type Scent = {
  id: string;
  temp: string;
  tempKo: string;
  name: string;
  nameKo: string;
  line: string;
  lineKo: string;
  /** 0 = coldest … 1 = warmest; sets the gradation line in the swatch. */
  level: number;
  dir: "v" | "h";
  stops: Stop[];
};

/** Five readings — every scent is a temperature, taken once. */
const SCENTS: Scent[] = [
  {
    id: "body",
    temp: "36.5°",
    tempKo: "36.5도",
    name: "Body",
    nameKo: "체온",
    line: "skin, remembered at its own warmth.",
    lineKo: "제 온기로 기억되는 피부.",
    level: 0.52,
    dir: "v",
    stops: [
      { offset: "0%", color: "#16130f", opacity: 0 },
      { offset: "55%", color: "#d8c39a", opacity: 0.34 },
      { offset: "100%", color: "#9c6b3f", opacity: 0.78 },
    ],
  },
  {
    id: "snow",
    temp: "−2°",
    tempKo: "영하 2도",
    name: "First Snow",
    nameKo: "초설",
    line: "first snow holds its breath over the river.",
    lineKo: "첫눈이 강 위에서 숨을 참는다.",
    level: 0.12,
    dir: "v",
    stops: [
      { offset: "0%", color: "#efe9df", opacity: 0.5 },
      { offset: "45%", color: "#efe9df", opacity: 0.12 },
      { offset: "100%", color: "#efe9df", opacity: 0 },
    ],
  },
  {
    id: "dawn",
    temp: "17°",
    tempKo: "17도",
    name: "Dawn Window",
    nameKo: "새벽 창",
    line: "a window opens before the city wakes.",
    lineKo: "도시가 깨기 전, 창이 먼저 열린다.",
    level: 0.3,
    dir: "h",
    stops: [
      { offset: "0%", color: "#efe9df", opacity: 0.3 },
      { offset: "55%", color: "#16130f", opacity: 0 },
      { offset: "100%", color: "#d8c39a", opacity: 0.14 },
    ],
  },
  {
    id: "ondol",
    temp: "45°",
    tempKo: "45도",
    name: "Ondol",
    nameKo: "온돌",
    line: "the floor keeps yesterday’s fire.",
    lineKo: "바닥은 어제의 불을 기억한다.",
    level: 0.72,
    dir: "v",
    stops: [
      { offset: "0%", color: "#16130f", opacity: 0 },
      { offset: "62%", color: "#9c6b3f", opacity: 0.4 },
      { offset: "100%", color: "#9c6b3f", opacity: 0.92 },
    ],
  },
  {
    id: "pour",
    temp: "62°",
    tempKo: "62도",
    name: "First Pour",
    nameKo: "찻김",
    line: "steam climbs from the first cup.",
    lineKo: "첫 잔에서 김이 오른다.",
    level: 0.88,
    dir: "v",
    stops: [
      { offset: "0%", color: "#d8c39a", opacity: 0.52 },
      { offset: "55%", color: "#d8c39a", opacity: 0.16 },
      { offset: "100%", color: "#d8c39a", opacity: 0 },
    ],
  },
];

/**
 * A scent’s image-area: an SVG gradient swatch evoking its temperature,
 * with a hairline gradation whose height IS the temperature — the coldest
 * scent reads low, the warmest high. Decorative; the text carries meaning.
 */
function Swatch({ scent }: { scent: Scent }) {
  const gid = `ondo-sw-${scent.id}`;
  const y = 322 - scent.level * 286;
  const horizontal = scent.dir === "h";
  return (
    <svg
      className="ondo-card__svg"
      viewBox="0 0 280 340"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient
          id={gid}
          x1="0"
          y1="0"
          x2={horizontal ? "1" : "0"}
          y2={horizontal ? "0" : "1"}
        >
          {scent.stops.map((s) => (
            <stop
              key={s.offset}
              offset={s.offset}
              stopColor={s.color}
              stopOpacity={s.opacity}
            />
          ))}
        </linearGradient>
      </defs>
      <rect width="280" height="340" fill="#1a1511" />
      <rect width="280" height="340" fill={`url(#${gid})`} />
      <line
        x1="20"
        y1={y}
        x2="252"
        y2={y}
        stroke="#d8c39a"
        strokeOpacity="0.5"
        strokeWidth="1"
      />
      <circle cx="260" cy={y} r="2.5" fill="#d8c39a" />
    </svg>
  );
}

/**
 * Section 02 — the collection. A horizontal rail of five scents. Cards
 * reveal through a clip-path wipe (cubic-bezier(.77,0,.18,1)) as they enter
 * the viewport; the rail scrolls by touch, drag (mouse), wheel (vertical
 * intent is translated sideways, edges hand back to the page), and keyboard
 * (the rail is a focusable region; arrows step one card).
 */
export default function Collection() {
  const reduced = usePrefersReducedMotion();
  const railRef = useRef<HTMLDivElement | null>(null);
  const dragRef = useRef({ active: false, startX: 0, startLeft: 0 });

  // Wheel: vertical intent becomes horizontal travel — but only while the
  // rail can still move in that direction; at the edges the page scrolls.
  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
      const max = rail.scrollWidth - rail.clientWidth;
      if (max <= 0) return;
      const at = rail.scrollLeft;
      if ((e.deltaY > 0 && at >= max - 1) || (e.deltaY < 0 && at <= 1)) return;
      e.preventDefault();
      rail.scrollLeft = Math.min(Math.max(at + e.deltaY, 0), max);
    };
    rail.addEventListener("wheel", onWheel, { passive: false });
    return () => rail.removeEventListener("wheel", onWheel);
  }, []);

  const cardStep = (): number => {
    const rail = railRef.current;
    if (!rail) return 300;
    const card = rail.querySelector<HTMLElement>(".ondo-card");
    return card
      ? Math.round(card.getBoundingClientRect().width + 24)
      : Math.round(rail.clientWidth * 0.7);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const rail = railRef.current;
    if (!rail) return;
    let to: number | null = null;
    if (e.key === "ArrowRight") to = rail.scrollLeft + cardStep();
    else if (e.key === "ArrowLeft") to = rail.scrollLeft - cardStep();
    else if (e.key === "Home") to = 0;
    else if (e.key === "End") to = rail.scrollWidth;
    if (to === null) return;
    e.preventDefault();
    rail.scrollTo({ left: to, behavior: reduced ? "auto" : "smooth" });
  };

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return; // touch scrolls natively
    const rail = railRef.current;
    if (!rail) return;
    dragRef.current = {
      active: true,
      startX: e.clientX,
      startLeft: rail.scrollLeft,
    };
    rail.setPointerCapture(e.pointerId);
    rail.classList.add("is-dragging");
  };

  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragRef.current.active) return;
    const rail = railRef.current;
    if (!rail) return;
    rail.scrollLeft =
      dragRef.current.startLeft - (e.clientX - dragRef.current.startX);
  };

  const endDrag = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragRef.current.active) return;
    dragRef.current.active = false;
    const rail = railRef.current;
    if (!rail) return;
    rail.classList.remove("is-dragging");
    if (rail.hasPointerCapture(e.pointerId)) {
      rail.releasePointerCapture(e.pointerId);
    }
  };

  return (
    <section className="ondo-collection" aria-labelledby="ondo-collection-title">
      <div className="ondo-sechead" data-reveal="fade">
        <p className="ondo-eyebrow">02 — the collection</p>
        <h2 id="ondo-collection-title" className="ondo-sechead__title">
          Five readings{" "}
          <span lang="ko" className="ondo-sechead__ko">
            다섯 번의 온도
          </span>
        </h2>
        <p className="ondo-sechead__line">
          Each scent is a temperature, taken once.{" "}
          <span lang="ko" className="ondo-sechead__lineko">
            향 하나가 온도 하나를 기억한다.
          </span>
        </p>
      </div>

      <div
        ref={railRef}
        className="ondo-rail"
        role="region"
        aria-label="The collection — five scents. Scroll sideways. 컬렉션 — 옆으로 넘겨 보세요."
        tabIndex={0}
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        <ul className="ondo-rail__list">
          {SCENTS.map((s) => (
            <li key={s.id} className="ondo-card" data-reveal="clip">
              <div className="ondo-card__art">
                <Swatch scent={s} />
              </div>
              <div className="ondo-card__body">
                <h3 className="ondo-card__temp">
                  {s.temp}{" "}
                  <span lang="ko" className="ondo-card__tempko">
                    {s.tempKo}
                  </span>
                </h3>
                <p className="ondo-card__name">
                  {s.name}{" "}
                  <span lang="ko" className="ondo-card__nameko">
                    {s.nameKo}
                  </span>
                </p>
                <p className="ondo-card__line">{s.line}</p>
                <p className="ondo-card__line" lang="ko">
                  {s.lineKo}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <p className="ondo-rail__hint" aria-hidden="true">
        drag · wheel · arrow keys —{" "}
        <span lang="ko">끌거나, 굴리거나, 방향키로</span>
      </p>
    </section>
  );
}
