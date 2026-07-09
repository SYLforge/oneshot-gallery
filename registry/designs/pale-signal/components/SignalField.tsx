"use client";

import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

/** Density ramp — index 0 draws nothing; the rest go dim → bright. */
const RAMP = " .:-=+*#%@";
/** Grid cell size in CSS px. */
const CELL = 14;
/** Backing-store resolution cap. */
const MAX_DPR = 2;
/** Throttle: skip frames that arrive faster than ~64fps (144Hz displays). */
const FRAME_MS = 15.5;

/** Per-frame lerp factors, normalized to 60fps inside the loop. */
const POINTER_LERP = 0.085;
const ENERGY_ATTACK = 0.06;
const ENERGY_RELEASE = 0.025;

/** char index → palette bucket (0 = dim-trace … 3 = glare). */
const BUCKET_OF = [0, 0, 0, 1, 1, 2, 2, 2, 3, 3];

/** Deterministic per-cell hash so the star field is stable across frames. */
function hash(cx: number, cy: number): number {
  let n = cx * 374761393 + cy * 668265263;
  n = Math.imul(n ^ (n >>> 13), 1274126177);
  return ((n ^ (n >>> 16)) >>> 0) / 4294967296;
}

/**
 * Section 03 — the signature moment. A canvas rasterizes tonight's sky into
 * a character-density field: a sparse twinkling star hash plus a slow radio
 * carrier (three stacked sines), plus a pointer-following bloom. With a fine
 * pointer the bloom chases your hand (lerped); on touch, or after 2.6s of
 * idle, an autonomous lissajous drift takes over. Reduced motion renders one
 * composed static frame and stops.
 */
export default function SignalField() {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const stage = stageRef.current;
    const canvas = canvasRef.current;
    if (!stage || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const style = getComputedStyle(canvas);
    const fontFamily = style.fontFamily || "monospace";
    const token = (name: string, fallback: string) =>
      style.getPropertyValue(name).trim() || fallback;
    const palette = [
      token("--ps-dim-trace", "#1d5c31"),
      token("--ps-phosphor-dim", "rgba(51, 255, 102, 0.72)"),
      token("--ps-phosphor", "#33ff66"),
      token("--ps-glare", "#c8ffd9"),
    ];

    const fine = window.matchMedia("(hover: hover) and (pointer: fine)")
      .matches;

    let cols = 0;
    let rows = 0;
    let raf = 0;
    let running = false;
    let disposed = false;
    let last = 0;
    // Reduced motion gets a hand-picked timestamp where the carrier composes
    // nicely across the band instead of a dead-flat t=0 wave.
    let t = reduced ? 47_000 : 0;

    const ptr = { x: 0.5, y: 0.45, e: reduced ? 0.5 : 0 };
    let target = { x: 0.5, y: 0.45, e: 0 };
    let lastMove = -1e9;

    /** Reused per-frame buckets: flat [x, y, rampIndex, ...] per color. */
    const buckets: number[][] = [[], [], [], []];

    const resize = () => {
      const rect = stage.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      cols = Math.max(1, Math.floor(rect.width / CELL));
      rows = Math.max(1, Math.floor(rect.height / CELL));
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.font = `${CELL + 1}px ${fontFamily}`;
      ctx.textBaseline = "top";
    };

    const fieldValue = (cx: number, cy: number): number => {
      const x = cx / cols;
      const y = cy / rows;
      let v = 0;

      // sparse star field — each star twinkles at its own hashed rate
      const r = hash(cx, cy);
      if (r > 0.962) {
        const tw = 0.5 + 0.5 * Math.sin(t * (0.0006 + r * 0.0011) + r * 251);
        v += ((r - 0.962) / 0.038) * (0.22 + 0.55 * tw);
      }

      // the carrier: three stacked sines drifting at unrelated rates
      const wave =
        Math.sin(x * 8.3 + t * 0.00093) * 0.36 +
        Math.sin(x * 21.1 - t * 0.00061) * 0.17 +
        Math.sin(x * 3.4 + t * 0.00037) * 0.47;
      const bandY = 0.58 + wave * 0.15;
      const d = ((y - bandY) * rows) / 7.5;
      v +=
        Math.exp(-d * d) *
        (0.42 + 0.3 * (0.5 + 0.5 * Math.sin(x * 26 + t * 0.0016)));

      // pointer (or drift) bloom, aspect-corrected gaussian
      const dx = (cx - ptr.x * cols) / (cols * 0.14);
      const dy = (cy - ptr.y * rows) / (rows * 0.2);
      v += Math.exp(-(dx * dx + dy * dy)) * ptr.e;

      return v;
    };

    const draw = () => {
      ctx.clearRect(0, 0, cols * CELL, rows * CELL);
      for (const b of buckets) b.length = 0;

      for (let cy = 0; cy < rows; cy++) {
        for (let cx = 0; cx < cols; cx++) {
          let idx = (fieldValue(cx, cy) * RAMP.length) | 0;
          if (idx <= 0) continue;
          if (idx >= RAMP.length) idx = RAMP.length - 1;
          buckets[BUCKET_OF[idx]].push(cx * CELL, cy * CELL, idx);
        }
      }
      // one fillStyle per bucket instead of thousands of switches per frame
      for (let i = 0; i < buckets.length; i++) {
        const b = buckets[i];
        if (b.length === 0) continue;
        ctx.fillStyle = palette[i];
        for (let j = 0; j < b.length; j += 3) {
          ctx.fillText(RAMP[b[j + 2]], b[j], b[j + 1]);
        }
      }
    };

    const step = (now: number) => {
      raf = requestAnimationFrame(step);
      if (now - last < FRAME_MS) return;
      const dt = Math.min(now - last, 48);
      last = now;
      t += dt;

      // autonomous drift takes over on touch, or when the pointer goes idle
      if (!fine || now - lastMove > 2600) {
        target = {
          x: 0.5 + 0.34 * Math.sin(t * 0.00021),
          y: 0.46 + 0.26 * Math.sin(t * 0.00033 + 1.7),
          e: 0.55 + 0.15 * Math.sin(t * 0.00047),
        };
      }

      const k = dt / 16.7; // frame-rate normalization
      ptr.x += (target.x - ptr.x) * POINTER_LERP * k;
      ptr.y += (target.y - ptr.y) * POINTER_LERP * k;
      const ek = target.e > ptr.e ? ENERGY_ATTACK : ENERGY_RELEASE;
      ptr.e += (target.e - ptr.e) * ek * k;

      draw();
    };

    const start = () => {
      if (running || reduced) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(step);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    const onPointerMove = (ev: PointerEvent) => {
      if (ev.pointerType !== "mouse" && ev.pointerType !== "pen") return;
      const rect = stage.getBoundingClientRect();
      target = {
        x: (ev.clientX - rect.left) / rect.width,
        y: (ev.clientY - rect.top) / rect.height,
        e: 1,
      };
      lastMove = performance.now();
    };
    const onPointerLeave = () => {
      lastMove = -1e9;
    };

    resize();
    if (reduced) {
      draw();
    } else if (fine) {
      stage.addEventListener("pointermove", onPointerMove);
      stage.addEventListener("pointerleave", onPointerLeave);
    }

    // Redraw once the real fonts arrive (matters for the static frame).
    document.fonts.ready.then(() => {
      if (disposed) return;
      resize();
      if (!running) draw();
    });

    // Only burn frames while the stage is anywhere near the viewport.
    const io = new IntersectionObserver(
      (hits) => {
        const hit = hits[hits.length - 1];
        if (hit.isIntersecting) start();
        else stop();
      },
      { rootMargin: "120px 0px" },
    );
    io.observe(stage);

    const ro = new ResizeObserver(() => {
      resize();
      if (!running) draw();
    });
    ro.observe(stage);

    return () => {
      disposed = true;
      stop();
      io.disconnect();
      ro.disconnect();
      stage.removeEventListener("pointermove", onPointerMove);
      stage.removeEventListener("pointerleave", onPointerLeave);
    };
  }, [reduced]);

  return (
    <section className="ps-signal" aria-labelledby="ps-signal-title">
      <div className="ps-signal__head">
        <div className="ps-sechead" data-reveal>
          <span className="ps-sechead__no" aria-hidden="true">
            03
          </span>
          <h2 className="ps-sechead__title" id="ps-signal-title">
            live receive{" "}
            <span lang="ko" className="ps-sechead__ko">
              실시간 수신
            </span>
          </h2>
        </div>
        <p className="ps-signal__meta" aria-hidden="true">
          RX 1420.4057 MHz · GAIN 34 dB · INTEG 16 ms
        </p>
      </div>

      <div
        ref={stageRef}
        className="ps-signal__stage"
        role="img"
        aria-label="Animated ASCII rendering of tonight's sky: a slow radio waveform crossing a field of twinkling characters, brightening near your pointer. 오늘 밤 하늘의 ASCII 렌더링 — 느린 전파 파형이 반짝이는 문자들 사이를 지나갑니다."
      >
        <canvas ref={canvasRef} className="ps-signal__canvas" aria-hidden="true" />
      </div>

      <p className="ps-signal__caption">
        bring your hand near the sky — it leans in.{" "}
        <span lang="ko">
          하늘 가까이 손을 대어 보세요. 하늘이 몸을 기울입니다.
        </span>
      </p>
    </section>
  );
}
