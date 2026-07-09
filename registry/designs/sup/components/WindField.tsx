"use client";

import { useEffect, useRef } from "react";
import { mulberry32 } from "./plant";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

/** Backing-store resolution cap. */
const MAX_DPR = 2;
/** Throttle: skip frames that arrive faster than ~64fps (144Hz displays). */
const FRAME_MS = 15.5;
/** Resolution of the 1-D wind field the pointer writes into. */
const WIND_N = 96;
/** How far the wind spreads sideways per frame (diffusion). */
const WIND_SPREAD = 0.22;
/** How quickly a gust is forgotten per frame. */
const WIND_DECAY = 0.945;
/** Static timestamp for the reduced-motion frame — a mid-gust that composes well. */
const STILL_T = 8.4;

type Blade = {
  x: number;
  y: number;
  h: number;
  /** Resting lean — no blade stands at attention. */
  lean: number;
  /** How much of the ambient breeze this blade feels. */
  sway: number;
  stiff: number;
  damp: number;
  bend: number;
  vel: number;
};

type Band = {
  blades: Blade[][];
  widths: number;
  tones: [string, string];
};

/** The ambient breeze: three unrelated sine drifts plus a traveling gust. */
function ambient(nx: number, ts: number): number {
  const base =
    0.2 * Math.sin(nx * 2.4 + ts * 0.5) +
    0.11 * Math.sin(nx * 5.9 - ts * 0.31) +
    0.06 * Math.sin(nx * 13 + ts * 0.83);
  const gc = ((ts * 0.041) % 1.6) - 0.3;
  const ge = Math.exp(-(((nx - gc) / 0.15) ** 2));
  const gs = Math.max(0, Math.sin(ts * 0.19 + 1.2)) * 0.55;
  return base + ge * gs;
}

/**
 * 02 — the signature moment. A canvas meadow of ~450 instanced grass blades,
 * each one a quadratic curve with its own spring. Moving the pointer writes
 * a velocity impulse into a 1-D wind field that diffuses and decays, so a
 * flick of the hand sends a visible breeze traveling across the grass, and
 * every blade bends and recovers on its own spring constant. On touch, or
 * with no pointer at all, an autonomous gust cycle keeps the field alive.
 * Reduced motion renders one composed mid-breeze frame and stops.
 */
export default function WindField() {
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
    const token = (name: string, fallback: string) =>
      style.getPropertyValue(name).trim() || fallback;
    const lit = token("--sup-grass-lit", "#c9d2ab");
    const back = token("--sup-grass-back", "#a8b89a");
    const mid = token("--sup-grass-mid", "#7d9465");
    const front = token("--sup-grass-front", "#55693f");
    const pollenTone = token("--sup-pollen", "#d9cd8f");

    let W = 0;
    let H = 0;
    let raf = 0;
    let running = false;
    let last = 0;
    let t = reduced ? STILL_T * 1000 : 0;

    const wind = new Float32Array(WIND_N);
    const windTmp = new Float32Array(WIND_N);
    const windAt = (nx: number): number => {
      const f = Math.min(Math.max(nx, 0), 0.9999) * (WIND_N - 1);
      const i = f | 0;
      const u = f - i;
      return wind[i] * (1 - u) + wind[i + 1] * u;
    };

    /** Two tone groups per band so a frame costs six strokeStyle changes. */
    const bands: Band[] = [
      { blades: [[], []], widths: 1.1, tones: [back, lit] },
      { blades: [[], []], widths: 1.5, tones: [mid, back] },
      { blades: [[], []], widths: 2.1, tones: [front, mid] },
    ];
    const pollen: { x: number; y: number; r: number; ph: number }[] = [];

    const build = () => {
      const rnd = mulberry32(1207);
      const rect = stage.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      W = rect.width;
      H = rect.height;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.lineCap = "round";

      const spec = [
        { n: W / 6, y0: 0.78, y1: 0.87, h0: 0.16, h1: 0.28 },
        { n: W / 8, y0: 0.87, y1: 0.94, h0: 0.24, h1: 0.4 },
        { n: W / 13, y0: 0.95, y1: 1.02, h0: 0.34, h1: 0.56 },
      ];
      // Blades are born already posed in the current breeze, so the first
      // frame (and the only frame, under reduced motion) is composed.
      const ts0 = t * 0.001;
      for (let b = 0; b < 3; b++) {
        bands[b].blades[0].length = 0;
        bands[b].blades[1].length = 0;
        const s = spec[b];
        const count = Math.max(24, Math.round(s.n));
        for (let i = 0; i < count; i++) {
          const x = ((i + rnd()) / count) * (W + 20) - 10;
          const sway = 0.75 + rnd() * 0.5;
          const blade: Blade = {
            x,
            y: (s.y0 + rnd() * (s.y1 - s.y0)) * H,
            h: (s.h0 + rnd() * (s.h1 - s.h0)) * H,
            lean: (rnd() - 0.5) * 0.3,
            sway,
            stiff: 0.03 + rnd() * 0.03,
            damp: 0.88 + rnd() * 0.05,
            bend: ambient(x / W, ts0) * sway,
            vel: 0,
          };
          bands[b].blades[rnd() < 0.24 ? 1 : 0].push(blade);
        }
      }

      pollen.length = 0;
      for (let i = 0; i < 22; i++) {
        pollen.push({
          x: rnd(),
          y: 0.3 + rnd() * 0.45,
          r: 0.8 + rnd() * 1.3,
          ph: rnd() * Math.PI * 2,
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      const ts = t * 0.001;

      ctx.globalAlpha = 0.55;
      ctx.fillStyle = pollenTone;
      for (const p of pollen) {
        const px = ((p.x + ts * (0.005 + p.r * 0.002)) % 1.04) - 0.02;
        const py = p.y + Math.sin(ts * 0.4 + p.ph) * 0.018;
        ctx.beginPath();
        ctx.arc(px * W, py * H, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      for (const band of bands) {
        for (let g = 0; g < 2; g++) {
          const blades = band.blades[g];
          if (blades.length === 0) continue;
          ctx.beginPath();
          for (const bl of blades) {
            const bend = bl.bend + bl.lean;
            const tipX = bl.x + bend * bl.h * 0.62;
            const tipY = bl.y - bl.h * (1 - Math.abs(bend) * 0.22);
            ctx.moveTo(bl.x, bl.y);
            ctx.quadraticCurveTo(
              bl.x + bend * bl.h * 0.08,
              bl.y - bl.h * 0.55,
              tipX,
              tipY,
            );
          }
          ctx.strokeStyle = band.tones[g];
          ctx.lineWidth = band.widths;
          ctx.stroke();
        }
      }
    };

    const settle = (k: number) => {
      // wind field: diffuse sideways, then decay toward calm
      for (let i = 0; i < WIND_N; i++) {
        const l = wind[Math.max(0, i - 1)];
        const r = wind[Math.min(WIND_N - 1, i + 1)];
        windTmp[i] = wind[i] + (l + r - 2 * wind[i]) * WIND_SPREAD * k;
      }
      const decay = Math.pow(WIND_DECAY, k);
      for (let i = 0; i < WIND_N; i++) wind[i] = windTmp[i] * decay;

      const ts = t * 0.001;
      for (let b = 0; b < 3; b++) {
        const reach = 1.15 - b * 0.18; // the near rows feel the pointer most
        for (const group of bands[b].blades) {
          for (const bl of group) {
            const nx = bl.x / W;
            const target =
              ambient(nx, ts) * bl.sway + windAt(nx) * reach * bl.sway;
            bl.vel += (target - bl.bend) * bl.stiff * k;
            bl.vel *= Math.pow(bl.damp, k);
            bl.bend += bl.vel * k;
            if (bl.bend > 1.4) bl.bend = 1.4;
            else if (bl.bend < -1.4) bl.bend = -1.4;
          }
        }
      }
    };

    const step = (now: number) => {
      raf = requestAnimationFrame(step);
      if (now - last < FRAME_MS) return;
      const dt = Math.min(now - last, 48);
      last = now;
      t += dt;
      settle(dt / 16.7);
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

    /** A pass of the hand writes its horizontal velocity into the wind. */
    let lastPX = -1;
    let lastPT = 0;
    const deposit = (nx: number, v: number) => {
      const c = nx * WIND_N;
      const from = Math.max(0, Math.floor(c - 7));
      const to = Math.min(WIND_N - 1, Math.ceil(c + 7));
      for (let i = from; i <= to; i++) {
        wind[i] += v * Math.exp(-(((i - c) / 3.2) ** 2)) * 0.5;
      }
    };
    const onPointerMove = (ev: PointerEvent) => {
      const rect = stage.getBoundingClientRect();
      const now = performance.now();
      if (lastPX >= 0 && now - lastPT < 120) {
        const v = Math.max(
          -2.4,
          Math.min(2.4, (ev.clientX - lastPX) / Math.max(now - lastPT, 8)),
        );
        deposit((ev.clientX - rect.left) / rect.width, v * 1.4);
      }
      lastPX = ev.clientX;
      lastPT = now;
    };
    const onPointerLeave = () => {
      lastPX = -1;
    };
    const onPointerDown = (ev: PointerEvent) => {
      // a touch (or press) parts the grass outward from the fingertip
      const rect = stage.getBoundingClientRect();
      const c = ((ev.clientX - rect.left) / rect.width) * WIND_N;
      for (let i = 0; i < WIND_N; i++) {
        const d = (i - c) / 4;
        wind[i] += Math.sign(d) * Math.exp(-d * d) * 0.9;
      }
    };

    build();
    if (reduced) {
      // one composed frame: a mid-gust, blades resting where the breeze holds them
      draw();
    } else {
      stage.addEventListener("pointermove", onPointerMove);
      stage.addEventListener("pointerleave", onPointerLeave);
      stage.addEventListener("pointerdown", onPointerDown);
    }

    let inView = false;
    const io = new IntersectionObserver(
      (hits) => {
        inView = hits[hits.length - 1].isIntersecting;
        if (inView && !document.hidden) start();
        else stop();
      },
      { rootMargin: "120px 0px" },
    );
    io.observe(stage);

    const onVisibility = () => {
      if (document.hidden) stop();
      else if (inView) start();
    };
    document.addEventListener("visibilitychange", onVisibility);

    const ro = new ResizeObserver(() => {
      build();
      if (!running) draw();
    });
    ro.observe(stage);

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      stage.removeEventListener("pointermove", onPointerMove);
      stage.removeEventListener("pointerleave", onPointerLeave);
      stage.removeEventListener("pointerdown", onPointerDown);
    };
  }, [reduced]);

  return (
    <section className="sup-wind" aria-labelledby="sup-wind-title">
      <div className="sup-sec" data-reveal>
        <span className="sup-sec__no" lang="ko" aria-hidden="true">
          하나
        </span>
        <h2 className="sup-sec__title" id="sup-wind-title">
          the wind field{" "}
          <span lang="ko" className="sup-sec__ko">
            바람의 들
          </span>
        </h2>
      </div>

      <p className="sup-wind__lede" data-reveal>
        <em>Wind you can see — we call it grass.</em>{" "}
        <span lang="ko">눈에 보이는 바람을, 우리는 풀이라고 부릅니다.</span>
      </p>

      <div
        ref={stageRef}
        className="sup-wind__stage"
        role="img"
        aria-label="A meadow of drawn grass blades bending under a breeze that follows your hand. 손을 따라 바람이 지나가고, 풀잎이 눕고 다시 일어서는 들판."
      >
        <canvas ref={canvasRef} className="sup-wind__canvas" aria-hidden="true" />
      </div>

      <p className="sup-wind__caption">
        Pass your hand across the field — the grass answers.{" "}
        <span lang="ko">
          손을 스치듯 움직여 보세요. 풀이 대답합니다. 손이 없어도 바람은
          스스로 다녀갑니다.
        </span>
      </p>
    </section>
  );
}
