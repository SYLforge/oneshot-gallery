"use client";

import { useEffect, useRef } from "react";
import DeviceArt from "./DeviceArt";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

/**
 * Section 01 — the calm warm stage.
 * Name, one tagline, one spec line, and the device on a soft shadow.
 *
 * Pointer parallax: on fine pointers the slate drifts up to ±7px toward
 * the cursor while its shadow drifts the opposite way at half depth —
 * two planes, lerped (k = 0.09 per 60fps-normalized frame), capped, and
 * self-stopping: the rAF loop parks itself once both planes settle.
 * Touch devices and prefers-reduced-motion never start the loop; the CSS
 * float on the SVG itself (also reduced-motion-gated) keeps the device
 * feeling lighter than air without any pointer at all.
 */
export default function Hero() {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const deviceRef = useRef<HTMLDivElement | null>(null);
  const shadowRef = useRef<HTMLDivElement | null>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      return;
    }
    const stage = stageRef.current;
    const device = deviceRef.current;
    const shadow = shadowRef.current;
    if (!stage || !device || !shadow) return;

    let raf = 0;
    let running = false;
    let last = 0;
    let tx = 0; // target, -1..1
    let ty = 0;
    let cx = 0; // current
    let cy = 0;

    const frame = (now: number) => {
      const dt = last === 0 ? 16.7 : Math.min(48, now - last);
      last = now;
      const k = 1 - Math.pow(1 - 0.09, dt / 16.7);
      cx += (tx - cx) * k;
      cy += (ty - cy) * k;
      device.style.transform = `translate3d(${(cx * 7).toFixed(2)}px, ${(cy * 5).toFixed(2)}px, 0)`;
      shadow.style.transform = `translate3d(${(cx * -4).toFixed(2)}px, ${(cy * -2).toFixed(2)}px, 0)`;
      if (Math.abs(tx - cx) + Math.abs(ty - cy) > 0.001) {
        raf = window.requestAnimationFrame(frame);
      } else {
        running = false;
        last = 0;
      }
    };

    const wake = () => {
      if (running) return;
      running = true;
      last = 0;
      raf = window.requestAnimationFrame(frame);
    };

    const onMove = (e: PointerEvent) => {
      const r = stage.getBoundingClientRect();
      tx = Math.max(-1, Math.min(1, ((e.clientX - r.left) / r.width) * 2 - 1));
      ty = Math.max(-1, Math.min(1, ((e.clientY - r.top) / r.height) * 2 - 1));
      wake();
    };

    const onLeave = () => {
      tx = 0;
      ty = 0;
      wake();
    };

    stage.addEventListener("pointermove", onMove);
    stage.addEventListener("pointerleave", onLeave);
    return () => {
      stage.removeEventListener("pointermove", onMove);
      stage.removeEventListener("pointerleave", onLeave);
      window.cancelAnimationFrame(raf);
      device.style.transform = "";
      shadow.style.transform = "";
    };
  }, [reduced]);

  return (
    <header className="slate-hero" aria-labelledby="slate-hero-title">
      <p className="slate-hero__overline">
        <span className="slate-hero__maker">
          ONJI WORKS <span lang="ko">온지 워크스</span>
        </span>
        <span className="slate-hero__kind">
          E-INK WRITING SLATE <span lang="ko">전자잉크 필기 슬레이트</span>
        </span>
      </p>

      <h1 className="slate-hero__title" id="slate-hero-title">
        HANJI SLATE
      </h1>
      <p className="slate-hero__sub" lang="ko">
        한지 슬레이트 · 종이 컴퓨터
      </p>
      <p className="slate-hero__tagline">
        Paper that remembers. <span lang="ko">기억하는 종이.</span>
      </p>

      <div className="slate-hero__stage" ref={stageRef}>
        <div className="slate-hero__shadow" ref={shadowRef} aria-hidden="true" />
        <div className="slate-hero__device" ref={deviceRef}>
          <DeviceArt />
        </div>
      </div>

      <p className="slate-hero__specline">
        6.8&Prime; e-ink · 300 ppi · reads like the real thing{" "}
        <span lang="ko">진짜 종이처럼 읽힌다</span>
      </p>

      <p className="slate-hero__hint" aria-hidden="true">
        scroll <span lang="ko">아래로</span>
      </p>
    </header>
  );
}
