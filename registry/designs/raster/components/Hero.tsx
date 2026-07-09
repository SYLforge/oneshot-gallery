"use client";

import { useEffect, useRef } from "react";
import WidthMark from "./WidthMark";
import { useGrid } from "./GridProvider";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

const CENTER_READOUT = "x 0.500 y 0.500 — certified center · 인증된 중심";

/**
 * Sheet 00 — the cover. The wordmark demonstrates the standard: Archivo's
 * width axis runs 62 → 125 per glyph on load (char-split, aria-safe), the
 * certification stamp draws itself in, and a crosshair instrument reports
 * raw pointer coordinates plus the column under the cursor.
 *
 * The instrument does not smooth its data — no lerp, no easing; it reports.
 * Fine pointers only: on touch, and under reduced motion, the crosshair
 * stands at the certified center of the sheet.
 */
export default function Hero() {
  const heroRef = useRef<HTMLElement | null>(null);
  const vlineRef = useRef<HTMLDivElement | null>(null);
  const hlineRef = useRef<HTMLDivElement | null>(null);
  const chipRef = useRef<HTMLDivElement | null>(null);
  const readRef = useRef<HTMLSpanElement | null>(null);
  const { cols } = useGrid();
  const reduced = usePrefersReducedMotion();

  // Arm the entrance animations (wordmark width axis, stamp line-draw).
  // Without JS the class never lands and the hero is simply complete.
  useEffect(() => {
    heroRef.current?.classList.add("is-on");
  }, []);

  useEffect(() => {
    const hero = heroRef.current;
    const vline = vlineRef.current;
    const hline = hlineRef.current;
    const chip = chipRef.current;
    const read = readRef.current;
    if (!hero || !vline || !hline || !chip || !read) return;
    if (reduced) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      return;
    }

    let raf = 0;
    let cx = 0;
    let cy = 0;

    const pad = (n: number) => String(Math.round(n)).padStart(4, "0");

    const update = () => {
      raf = 0;
      // One read, then writes — measured inside rAF, never during layout.
      const rect = hero.getBoundingClientRect();
      const x = Math.min(Math.max(cx - rect.left, 0), rect.width);
      const y = Math.min(Math.max(cy - rect.top, 0), rect.height);
      const col = Math.min(
        cols,
        Math.max(1, Math.ceil((x / rect.width) * cols)),
      );
      vline.style.transform = `translate3d(${x}px, 0, 0)`;
      hline.style.transform = `translate3d(0, ${y}px, 0)`;
      const chipX = Math.max(8, Math.min(x + 16, rect.width - 232));
      const chipY = Math.max(8, Math.min(y + 14, rect.height - 44));
      chip.style.transform = `translate3d(${chipX}px, ${chipY}px, 0)`;
      read.textContent = `x ${pad(x)} y ${pad(y)} — col ${String(col).padStart(2, "0")}/${cols}`;
    };

    const move = (e: PointerEvent) => {
      cx = e.clientX;
      cy = e.clientY;
      // First contact (or re-arm after a grid toggle while the pointer is
      // already inside): paint synchronously so the lines never flash at
      // the origin before the first rAF.
      if (!hero.classList.contains("is-live")) {
        hero.classList.add("is-live");
        update();
        return;
      }
      if (!raf) raf = requestAnimationFrame(update);
    };
    const leave = () => {
      hero.classList.remove("is-live");
      if (raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
      vline.style.transform = "";
      hline.style.transform = "";
      chip.style.transform = "";
      read.textContent = CENTER_READOUT;
    };

    hero.addEventListener("pointermove", move);
    hero.addEventListener("pointerleave", leave);
    return () => {
      hero.removeEventListener("pointermove", move);
      hero.removeEventListener("pointerleave", leave);
      if (raf) cancelAnimationFrame(raf);
      hero.classList.remove("is-live");
      vline.style.transform = "";
      hline.style.transform = "";
      chip.style.transform = "";
      read.textContent = CENTER_READOUT;
    };
  }, [reduced, cols]);

  return (
    <header
      ref={heroRef}
      className="raster-hero"
      aria-labelledby="raster-title"
    >
      <div className="raster-frame raster-hero__inner">
        <p className="raster-hero__kicker raster-mono">
          <span>raster — bureau for grid systems · est. 1957</span>
          <span lang="ko">라스터 — 그리드 시스템 인증국</span>
          <span>standard sheet no. 10 · 표준 명세 제10호</span>
        </p>

        <h1 className="raster-hero__title" id="raster-title" aria-label="RASTER">
          <WidthMark text="RASTER" />
        </h1>

        <p className="raster-hero__sub" lang="ko">
          그리드 시스템 인증국
        </p>

        <div className="raster-grid raster-hero__foot">
          <div className="raster-hero__spec" data-flip>
            <p>
              grid no. 04. approved 1972. still correct.
              <span lang="ko">그리드 제4호. 1972년 승인. 지금도 유효함.</span>
            </p>
            <p>
              clause 1.1 — a grid is correct, or it is not a grid.
              <span lang="ko">
                제1조 1항 — 그리드는 정확하거나, 그리드가 아니다.
              </span>
            </p>
            <p>
              this sheet is set on grid no. 04. deviations: none recorded.
              <span lang="ko">
                본 명세서는 그리드 제4호 위에 조판되었다. 이탈: 기록된 바 없음.
              </span>
            </p>
          </div>

          <div className="raster-hero__stampcell" data-flip>
            {/* Decorative seal: the accessible certification claim is the
                spec text beside it, so the stamp stays aria-hidden. */}
            <svg
              className="raster-stamp"
              viewBox="0 0 132 132"
              aria-hidden="true"
              focusable="false"
            >
              <circle
                className="raster-stamp__draw"
                cx="66"
                cy="66"
                r="62"
                pathLength={1}
              />
              <circle
                className="raster-stamp__draw raster-stamp__draw--d2"
                cx="66"
                cy="66"
                r="44"
                pathLength={1}
              />
              <line
                className="raster-stamp__draw raster-stamp__draw--d3"
                x1="66"
                y1="4"
                x2="66"
                y2="18"
                pathLength={1}
              />
              <line
                className="raster-stamp__draw raster-stamp__draw--d3"
                x1="66"
                y1="114"
                x2="66"
                y2="128"
                pathLength={1}
              />
              <line
                className="raster-stamp__draw raster-stamp__draw--d3"
                x1="4"
                y1="66"
                x2="18"
                y2="66"
                pathLength={1}
              />
              <line
                className="raster-stamp__draw raster-stamp__draw--d3"
                x1="114"
                y1="66"
                x2="128"
                y2="66"
                pathLength={1}
              />
              <text className="raster-stamp__txt" x="66" y="56">
                RASTER
              </text>
              <text className="raster-stamp__txt" x="66" y="72">
                NO. 04 — 1972
              </text>
              <text className="raster-stamp__txt" x="66" y="88">
                인증필
              </text>
            </svg>
          </div>
        </div>

        <p className="raster-hero__cue raster-mono" aria-hidden="true">
          begin inspection ↓ 검수 시작
        </p>
      </div>

      {/* The instrument. Purely decorative; centered without a fine pointer. */}
      <div className="raster-cross" aria-hidden="true">
        <div ref={vlineRef} className="raster-cross__v" />
        <div ref={hlineRef} className="raster-cross__h" />
        <div ref={chipRef} className="raster-cross__chip">
          <span ref={readRef}>{CENTER_READOUT}</span>
        </div>
      </div>
    </header>
  );
}
