"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

/** Deterministic n-spike star polygon for the 쾅! burst — SSR-stable. */
function starPoints(
  cx: number,
  cy: number,
  spikes: number,
  outer: number,
  inner: number,
): string {
  const pts: string[] = [];
  for (let i = 0; i < spikes * 2; i += 1) {
    const r = i % 2 === 0 ? outer : inner;
    const a = (Math.PI * i) / spikes - Math.PI / 2;
    pts.push(
      `${(cx + Math.cos(a) * r).toFixed(1)},${(cy + Math.sin(a) * r).toFixed(1)}`,
    );
  }
  return pts.join(" ");
}

const BANG_POINTS = starPoints(60, 60, 11, 57, 37);

type StickerDef = {
  id: string;
  label: string;
  className: string;
  art: ReactNode;
};

/**
 * Every sticker is CSS/SVG — no images. `--ink` stickers are solid ink
 * passes and get mix-blend-mode: multiply (overlaps darken like real riso
 * layers); the rest are paper-backed decals and stay opaque, because a
 * paper sticker occludes what it lands on.
 */
const STICKERS: StickerDef[] = [
  {
    id: "smiley",
    label: "Yellow smiley sticker. 웃는 얼굴 스티커.",
    className: "blunt-sticker--smiley blunt-sticker--ink",
    art: (
      <svg viewBox="0 0 96 96" width="92" height="92" aria-hidden="true" focusable="false">
        <circle cx="48" cy="48" r="43" fill="var(--blunt-yellow)" stroke="var(--blunt-ink)" strokeWidth="5" />
        <rect x="29" y="30" width="9" height="19" fill="var(--blunt-ink)" />
        <rect x="58" y="30" width="9" height="19" fill="var(--blunt-ink)" />
        <path d="M28 60 Q48 79 68 60" fill="none" stroke="var(--blunt-ink)" strokeWidth="6" strokeLinecap="square" />
      </svg>
    ),
  },
  {
    id: "arrow",
    label: "Blue arrow sticker pointing right. 오른쪽을 가리키는 파란 화살표.",
    className: "blunt-sticker--arrow blunt-sticker--ink",
    art: (
      <svg viewBox="0 0 140 64" width="128" height="59" aria-hidden="true" focusable="false">
        <path
          d="M4 22 H84 V5 L136 32 L84 59 V42 H4 Z"
          fill="var(--blunt-blue)"
          stroke="var(--blunt-ink)"
          strokeWidth="4"
          strokeLinejoin="miter"
        />
      </svg>
    ),
  },
  {
    id: "rush",
    label: "Red rush-order tag. 급함 — 급한 주문 표.",
    className: "blunt-sticker--rush blunt-sticker--ink",
    art: (
      <span className="blunt-rush" aria-hidden="true">
        <span className="blunt-rush__ko" lang="ko">
          급함
        </span>
        <span className="blunt-rush__en">RUSH ORDER</span>
      </span>
    ),
  },
  {
    id: "barcode",
    label: "Barcode sticker. 바코드 스티커.",
    className: "blunt-sticker--barcode",
    art: (
      <svg viewBox="0 0 120 56" width="118" height="55" aria-hidden="true" focusable="false">
        <rect width="120" height="56" fill="var(--blunt-paper)" stroke="var(--blunt-ink)" strokeWidth="3" />
        <g fill="var(--blunt-ink)">
          <rect x="10" y="8" width="3" height="32" />
          <rect x="16" y="8" width="2" height="32" />
          <rect x="21" y="8" width="5" height="32" />
          <rect x="29" y="8" width="2" height="32" />
          <rect x="34" y="8" width="4" height="32" />
          <rect x="41" y="8" width="2" height="32" />
          <rect x="47" y="8" width="6" height="32" />
          <rect x="56" y="8" width="3" height="32" />
          <rect x="62" y="8" width="2" height="32" />
          <rect x="68" y="8" width="5" height="32" />
          <rect x="76" y="8" width="2" height="32" />
          <rect x="81" y="8" width="4" height="32" />
          <rect x="88" y="8" width="2" height="32" />
          <rect x="93" y="8" width="6" height="32" />
          <rect x="102" y="8" width="3" height="32" />
          <rect x="108" y="8" width="2" height="32" />
        </g>
        <text x="60" y="50" textAnchor="middle" className="blunt-barcode__digits">
          8 809 2019 0002
        </text>
      </svg>
    ),
  },
  {
    id: "bang",
    label: "쾅! comic burst sticker. 만화 효과음 스티커.",
    className: "blunt-sticker--bang blunt-sticker--ink",
    art: (
      <svg viewBox="0 0 120 120" width="112" height="112" aria-hidden="true" focusable="false">
        <polygon points={BANG_POINTS} fill="var(--blunt-red)" stroke="var(--blunt-ink)" strokeWidth="4" />
        <text x="60" y="74" textAnchor="middle" lang="ko" className="blunt-bang__text">
          쾅!
        </text>
      </svg>
    ),
  },
  {
    id: "tag",
    label: "Price tag sticker, B2 twelve thousand won. 가격표 스티커.",
    className: "blunt-sticker--tag",
    art: (
      <span className="blunt-tagart" aria-hidden="true">
        <span className="blunt-tagart__hole" />
        <span className="blunt-tagart__txt">B2 · ₩12,000</span>
      </span>
    ),
  },
  {
    id: "halftone",
    label: "Blue halftone dot circle. 파란 망점 원.",
    className: "blunt-sticker--halftone blunt-sticker--ink",
    art: <span className="blunt-halftone" aria-hidden="true" />,
  },
  {
    id: "wet",
    label: "Wet ink warning label. 잉크 조심 라벨.",
    className: "blunt-sticker--wet",
    art: (
      <span className="blunt-wet" aria-hidden="true">
        <span className="blunt-wet__stripes" />
        <span className="blunt-wet__txt">
          WET INK <span lang="ko">잉크 조심</span>
        </span>
      </span>
    ),
  },
  {
    id: "stamp",
    label: "Matte OK round stamp. 무광 오케이 도장.",
    className: "blunt-sticker--stamp blunt-sticker--ink",
    art: (
      <span className="blunt-stampart" aria-hidden="true">
        <span lang="ko">무광</span> OK
      </span>
    ),
  },
  {
    id: "over",
    label: "Two-color overprint test dot. 2도 겹침 인쇄 테스트.",
    className: "blunt-sticker--over blunt-sticker--ink",
    art: (
      <span className="blunt-over" aria-hidden="true">
        <span className="blunt-over__c blunt-over__c--blue" />
        <span className="blunt-over__c blunt-over__c--red" />
        <span className="blunt-over__txt">
          <span lang="ko">2도</span> OVERPRINT
        </span>
      </span>
    ),
  },
];

const FRICTION = 0.93; // per 60fps-normalized frame
const BOUNCE = 0.45; // restitution off the table edges
const NUDGE = 10; // px per arrow key
const SLEEP = 0.004; // px/ms (and deg/ms) under which a body rests

function clamp(v: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, v));
}

type Body = {
  el: HTMLElement;
  /** Physics state is a DELTA from the CSS-scattered base position, so the
   *  no-JS layout is the same mess, just still. */
  dx: number;
  dy: number;
  vx: number;
  vy: number;
  rot: number;
  vr: number;
  baseRot: number;
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  grabbed: boolean;
  px: number;
  py: number;
  lt: number;
  gx: number;
  gy: number;
};

/**
 * Section 03 — the work table. 10 draggable stickers with hand-rolled
 * inertia: velocity sampled on release, exponential friction, rotation from
 * a faked torque (release velocity crossed with the grab offset), restitution
 * off the table edges. Everything is written imperatively into
 * `style.transform` — React renders the shells exactly once.
 *
 * Keyboard: every sticker is focusable; arrows nudge 10px, Enter/Space
 * brings it to the top of the pile. Reduced motion: drop is placement,
 * no glide, no spin.
 */
export default function StickerBoard() {
  const reduced = usePrefersReducedMotion();
  const boardRef = useRef<HTMLDivElement | null>(null);
  const reducedRef = useRef(reduced);

  useEffect(() => {
    reducedRef.current = reduced;
  }, [reduced]);

  useEffect(() => {
    const board = boardRef.current;
    if (!board) return;

    const els = Array.from(
      board.querySelectorAll<HTMLElement>(".blunt-sticker"),
    );

    const bodies: Body[] = els.map((el) => {
      const raw = getComputedStyle(el).getPropertyValue("--blunt-rot");
      return {
        el,
        dx: 0,
        dy: 0,
        vx: 0,
        vy: 0,
        rot: 0,
        vr: 0,
        baseRot: Number.parseFloat(raw) || 0,
        minX: 0,
        maxX: 0,
        minY: 0,
        maxY: 0,
        grabbed: false,
        px: 0,
        py: 0,
        lt: 0,
        gx: 0,
        gy: 0,
      };
    });

    let zTop = 10;
    let raf = 0;
    let last = 0;

    const apply = (b: Body) => {
      const s = b.grabbed ? 1.06 : 1;
      b.el.style.transform = `translate3d(${b.dx.toFixed(2)}px, ${b.dy.toFixed(2)}px, 0) rotate(${(b.baseRot + b.rot).toFixed(2)}deg) scale(${s})`;
    };

    const bounds = () => {
      const bw = board.clientWidth;
      const bh = board.clientHeight;
      const pad = 2;
      for (const b of bodies) {
        b.minX = pad - b.el.offsetLeft;
        b.maxX = Math.max(b.minX, bw - b.el.offsetWidth - pad - b.el.offsetLeft);
        b.minY = pad - b.el.offsetTop;
        b.maxY = Math.max(b.minY, bh - b.el.offsetHeight - pad - b.el.offsetTop);
        b.dx = clamp(b.dx, b.minX, b.maxX);
        b.dy = clamp(b.dy, b.minY, b.maxY);
        apply(b);
      }
    };

    const tick = (t: number) => {
      const dt = last ? Math.min(48, t - last) : 16.7;
      last = t;
      const f = Math.pow(FRICTION, dt / 16.7);
      let alive = false;

      for (const b of bodies) {
        if (b.grabbed) continue;
        if (
          Math.abs(b.vx) < SLEEP &&
          Math.abs(b.vy) < SLEEP &&
          Math.abs(b.vr) < SLEEP
        ) {
          b.vx = 0;
          b.vy = 0;
          b.vr = 0;
          continue;
        }
        b.dx += b.vx * dt;
        b.dy += b.vy * dt;
        b.rot += b.vr * dt;
        b.vx *= f;
        b.vy *= f;
        b.vr *= f;
        if (b.dx < b.minX) {
          b.dx = b.minX;
          b.vx = Math.abs(b.vx) * BOUNCE;
          b.vr *= 0.6;
        } else if (b.dx > b.maxX) {
          b.dx = b.maxX;
          b.vx = -Math.abs(b.vx) * BOUNCE;
          b.vr *= 0.6;
        }
        if (b.dy < b.minY) {
          b.dy = b.minY;
          b.vy = Math.abs(b.vy) * BOUNCE;
          b.vr *= 0.6;
        } else if (b.dy > b.maxY) {
          b.dy = b.maxY;
          b.vy = -Math.abs(b.vy) * BOUNCE;
          b.vr *= 0.6;
        }
        apply(b);
        alive = true;
      }

      if (alive) {
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

    const lift = (b: Body) => {
      zTop += 1;
      b.el.style.zIndex = String(zTop);
    };

    const onDown = (b: Body) => (e: PointerEvent) => {
      e.preventDefault();
      try {
        b.el.setPointerCapture(e.pointerId);
      } catch {
        /* pointer evaporated between events — nothing to capture */
      }
      b.grabbed = true;
      b.el.classList.add("is-grabbed");
      lift(b);
      b.vx = 0;
      b.vy = 0;
      b.vr = 0;
      b.px = e.clientX;
      b.py = e.clientY;
      b.lt = e.timeStamp;
      const r = b.el.getBoundingClientRect();
      b.gx = (e.clientX - (r.left + r.width / 2)) / Math.max(1, r.width);
      b.gy = (e.clientY - (r.top + r.height / 2)) / Math.max(1, r.height);
      apply(b);
    };

    const onMove = (b: Body) => (e: PointerEvent) => {
      if (!b.grabbed) return;
      const dt = Math.max(1, e.timeStamp - b.lt);
      const ndx = clamp(b.dx + (e.clientX - b.px), b.minX, b.maxX);
      const ndy = clamp(b.dy + (e.clientY - b.py), b.minY, b.maxY);
      const ivx = (ndx - b.dx) / dt;
      const ivy = (ndy - b.dy) / dt;
      b.vx = b.vx * 0.4 + ivx * 0.6;
      b.vy = b.vy * 0.4 + ivy * 0.6;
      // Faked torque: linear velocity crossed with the grab offset. Grab a
      // corner and yank — it spins. Grab dead center — it doesn't.
      const torque = (ivx * -b.gy + ivy * b.gx) * 0.6;
      b.vr = b.vr * 0.5 + torque * 0.5;
      if (!reducedRef.current) b.rot += b.vr * dt * 0.4;
      b.dx = ndx;
      b.dy = ndy;
      b.px = e.clientX;
      b.py = e.clientY;
      b.lt = e.timeStamp;
      apply(b);
    };

    const onUp = (b: Body) => (e: PointerEvent) => {
      if (!b.grabbed) return;
      b.grabbed = false;
      b.el.classList.remove("is-grabbed");
      // Reduced motion: place, don't glide. A stalled hand (>90ms since the
      // last move) also releases with zero velocity — no ghost throws.
      if (reducedRef.current || e.timeStamp - b.lt > 90) {
        b.vx = 0;
        b.vy = 0;
        b.vr = 0;
      }
      apply(b);
      wake();
    };

    const onKey = (b: Body) => (e: KeyboardEvent) => {
      let hx = 0;
      let hy = 0;
      if (e.key === "ArrowLeft") hx = -NUDGE;
      else if (e.key === "ArrowRight") hx = NUDGE;
      else if (e.key === "ArrowUp") hy = -NUDGE;
      else if (e.key === "ArrowDown") hy = NUDGE;
      else if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        lift(b);
        return;
      } else {
        return;
      }
      e.preventDefault();
      b.vx = 0;
      b.vy = 0;
      b.vr = 0;
      b.dx = clamp(b.dx + hx, b.minX, b.maxX);
      b.dy = clamp(b.dy + hy, b.minY, b.maxY);
      apply(b);
    };

    const cleanups: Array<() => void> = [];
    for (const b of bodies) {
      const down = onDown(b);
      const move = onMove(b);
      const up = onUp(b);
      const key = onKey(b);
      b.el.addEventListener("pointerdown", down);
      b.el.addEventListener("pointermove", move);
      b.el.addEventListener("pointerup", up);
      b.el.addEventListener("pointercancel", up);
      b.el.addEventListener("keydown", key);
      cleanups.push(() => {
        b.el.removeEventListener("pointerdown", down);
        b.el.removeEventListener("pointermove", move);
        b.el.removeEventListener("pointerup", up);
        b.el.removeEventListener("pointercancel", up);
        b.el.removeEventListener("keydown", key);
      });
    }

    const ro = new ResizeObserver(bounds);
    ro.observe(board);
    bounds();

    return () => {
      for (const fn of cleanups) fn();
      ro.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section className="blunt-section blunt-tablezone" aria-labelledby="blunt-board-title">
      <div className="blunt-sechead">
        <span className="blunt-sechead__no" aria-hidden="true">
          01
        </span>
        <h2 className="blunt-sechead__title" id="blunt-board-title">
          THE WORK TABLE <span lang="ko">작업대</span>
        </h2>
        <p className="blunt-sechead__note">
          DRAG THE MESS. <span lang="ko">어지르세요.</span>
        </p>
      </div>

      <p className="blunt-vh" id="blunt-board-hint">
        Arrow keys nudge a sticker 10 pixels. Enter or Space brings it to the
        top of the pile. 방향키로 스티커를 10픽셀씩 밀고, 엔터나 스페이스로 맨
        위에 올립니다.
      </p>

      <div
        className="blunt-board"
        ref={boardRef}
        role="group"
        aria-label="Sticker work table — drag the stickers, or focus one and use arrow keys. 스티커 작업대 — 끌거나, 포커스한 뒤 방향키로 미세요."
      >
        {STICKERS.map((s) => (
          <div
            key={s.id}
            role="button"
            tabIndex={0}
            aria-roledescription="draggable sticker"
            aria-label={s.label}
            aria-describedby="blunt-board-hint"
            className={`blunt-sticker ${s.className}`}
          >
            {s.art}
          </div>
        ))}
      </div>

      <p className="blunt-board__caption">
        STICKERS DO NOT LEAVE THE TABLE.{" "}
        <span lang="ko">스티커는 작업대 밖으로 못 나감.</span>
      </p>
    </section>
  );
}
