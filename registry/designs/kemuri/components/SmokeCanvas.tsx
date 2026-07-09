"use client";

import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import { useScrollVelocity } from "../hooks/useScrollVelocity";

/* -- rendering ------------------------------------------------------------ */
/** Backing-store resolution cap. */
const MAX_DPR = 2;
/** Skip frames that arrive faster than ~64fps (high-refresh displays). */
const FRAME_MS = 15.5;
/** One particle per this many CSS px² of stage, clamped below. */
const AREA_PER_PARTICLE = 1900;
const MIN_PARTICLES = 260;
const MAX_PARTICLES = 820;
/** Particle layout in the Float32Array: x, y, vx, vy, age, life, s0. */
const STRIDE = 7;

/* -- the curl field ------------------------------------------------------- */
/** Feature sizes of the two potential octaves (px⁻¹): broad coils, fine curls. */
const EDDY_LARGE = 1 / 150;
const EDDY_SMALL = 1 / 56;
/** The noise field itself drifts upward (px/s), so eddies travel with the smoke. */
const FIELD_RISE = 26;
/** Curl gain — converts potential slope into px/s of swirl. */
const SWIRL = 1500;
/** Finite-difference epsilon for the curl (px). */
const CURL_EPS = 2.5;

/* -- plume physics --------------------------------------------------------- */
/** Base buoyancy (px/s). */
const RISE = 46;
/** Velocity relaxation rate (s⁻¹) — smoke has inertia, not obedience. */
const VEL_RELAX = 2.4;
/** Seconds of life: min + random spread. */
const LIFE_MIN = 6.5;
const LIFE_SPREAD = 4.5;

/* -- outside influences ---------------------------------------------------- */
/** Pointer pull: px/s per px of horizontal distance, capped hard. */
const POINTER_WIND = 1.1;
const POINTER_CAP = 54;
/** Pointer energy lerps — quick to notice a hand, slow to forget it. */
const POINTER_ATTACK = 0.055;
const POINTER_RELEASE = 0.018;
/** Pointer silence before the autonomous breeze takes back over (ms). */
const IDLE_MS = 2600;
/** Scroll lag: px/s of downward drag per px/ms of scroll velocity, capped. */
const SCROLL_WIND = 210;
const SCROLL_CAP = 190;
/** Scroll smoothing rate (s⁻¹) and staleness window (ms). */
const SCROLL_SMOOTH = 6.5;
const SCROLL_STALE_MS = 140;

/* -- warmup ----------------------------------------------------------------- */
/** Pre-advection so the plume is already mid-air on first paint. */
const WARMUP_STEPS = 120;
const WARMUP_DT = 0.085;

/** Where the plume is born, relative to the stage (must match the censer CSS:
 *  the svg is 160px wide, anchored bottom: 44px, centered; the stick tip sits
 *  at (86, 26) in its 160×120 viewBox). */
const MOUTH_DX = 6;
const MOUTH_UP = 138;

function clamp(v: number, lo: number, hi: number): number {
  return v < lo ? lo : v > hi ? hi : v;
}

function smoothstep(a: number, b: number, x: number): number {
  const s = clamp((x - a) / (b - a), 0, 1);
  return s * s * (3 - 2 * s);
}

/** Deterministic PRNG — the smoke coils the same way every visit. */
function mulberry32(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let z = Math.imul(s ^ (s >>> 15), 1 | s);
    z = (z + Math.imul(z ^ (z >>> 7), 61 | z)) ^ z;
    return ((z ^ (z >>> 14)) >>> 0) / 4294967296;
  };
}

/** 256-entry permutation for the lattice hash. Seeded 1927 — est. of the house. */
function buildPerm(): Uint8Array {
  const rand = mulberry32(1927);
  const p = new Uint8Array(256);
  for (let i = 0; i < 256; i++) p[i] = i;
  for (let i = 255; i > 0; i--) {
    const j = (rand() * (i + 1)) | 0;
    const t = p[i];
    p[i] = p[j];
    p[j] = t;
  }
  return p;
}

const PERM = buildPerm();

/** Lattice hash → [0, 1). */
function latHash(ix: number, iy: number): number {
  return PERM[(ix + PERM[iy & 255]) & 255] / 255;
}

/** Smooth-stepped bilinear value noise over the integer lattice. */
function valueNoise(x: number, y: number): number {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  let fx = x - ix;
  let fy = y - iy;
  fx = fx * fx * (3 - 2 * fx);
  fy = fy * fy * (3 - 2 * fy);
  const a = latHash(ix, iy);
  const b = latHash(ix + 1, iy);
  const c = latHash(ix, iy + 1);
  const d = latHash(ix + 1, iy + 1);
  return a + (b - a) * fx + (c - a) * fy + (a - b - c + d) * fx * fy;
}

/**
 * The scalar potential ψ. Two octaves of value noise, and the whole field
 * drifts upward over time (y is offset by t·FIELD_RISE), so the eddies rise
 * with the smoke instead of the smoke swimming through frozen turbulence.
 */
function psi(x: number, y: number, t: number): number {
  const yr = y + t * FIELD_RISE;
  return (
    valueNoise(x * EDDY_LARGE, yr * EDDY_LARGE) -
    0.5 +
    (valueNoise(x * EDDY_SMALL + 37.2, yr * (EDDY_SMALL * 1.35) + 11.8) - 0.5) *
      0.45
  );
}

/** A soft radial sprite: color core fading to transparent. */
function makeSprite(r: number, g: number, b: number, core: number): HTMLCanvasElement {
  const size = 64;
  const c = document.createElement("canvas");
  c.width = size;
  c.height = size;
  const cx = c.getContext("2d");
  if (cx) {
    const grad = cx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, `rgba(${r},${g},${b},${core})`);
    grad.addColorStop(0.4, `rgba(${r},${g},${b},${core * 0.42})`);
    grad.addColorStop(1, `rgba(${r},${g},${b},0)`);
    cx.fillStyle = grad;
    cx.fillRect(0, 0, size, size);
  }
  return c;
}

/**
 * The signature moment. A censer breathes one ribbon of smoke, advected
 * through a divergence-free curl-noise field: velocity = (∂ψ/∂y, −∂ψ/∂x),
 * so the flow can coil forever but never compress or tear — which is what
 * separates smoke from confetti. The ribbon bends downward under lerped
 * scroll velocity (it lags the page like real smoke lags a moved cup) and
 * leans toward a fine pointer, capped so it stays weather, never a cursor
 * toy. On touch, or when the hand goes quiet, an autonomous breeze keeps it
 * alive. Reduced motion pre-advects the system and paints one composed
 * still. The loop pauses offscreen and when the tab hides.
 */
export default function SmokeCanvas() {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const reduced = usePrefersReducedMotion();
  const scrollRef = useScrollVelocity();

  useEffect(() => {
    const stage = stageRef.current;
    const canvas = canvasRef.current;
    if (!stage || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const fine = window.matchMedia(
      "(hover: hover) and (pointer: fine)",
    ).matches;
    const rand = mulberry32(19270701);

    // Sprites: young smoke is ink-dense, old smoke is pale; the ember is
    // the one warm thing on the page. Every color is a sheet token:
    // ink-soft #4f4a43 · smoke #8a8178 · ember #c96f2e.
    const inkSprite = makeSprite(79, 74, 67, 0.62);
    const smokeSprite = makeSprite(138, 129, 120, 0.5);
    const emberSprite = makeSprite(201, 111, 46, 0.85);

    let W = 0;
    let H = 0;
    let mouthX = 0;
    let mouthY = 0;
    let docTop = 0;
    let docLeft = 0;
    let count = 0;
    let parts = new Float32Array(0);

    let raf = 0;
    let running = false;
    let inView = false;
    let last = 0;
    let t = 0; // simulation clock, seconds

    const ptr = { x: 0, y: 0, e: 0 };
    const target = { x: 0, y: 0, e: 0 };
    let lastMove = -1e9;
    let scrollLag = 0; // smoothed, px/s

    const spawn = (i: number, warm: boolean) => {
      const o = i * STRIDE;
      // Sum of two uniforms ≈ triangular — a soft-shouldered plume base.
      parts[o] = mouthX + (rand() + rand() - 1) * 8;
      parts[o + 1] = mouthY + rand() * 5;
      parts[o + 2] = 0;
      parts[o + 3] = -RISE * 0.6;
      parts[o + 5] = LIFE_MIN + rand() * LIFE_SPREAD;
      parts[o + 4] = warm ? rand() * parts[o + 5] : 0;
      parts[o + 6] = 5 + rand() * 6;
    };

    const step = (dt: number) => {
      t += dt;
      const relax = 1 - Math.exp(-dt * VEL_RELAX);
      // The breeze: two slow sines with unrelated periods (~30s and ~13s).
      const breeze =
        22 * Math.sin(t * 0.21) + 12 * Math.sin(t * 0.47 + 1.9);

      for (let i = 0; i < count; i++) {
        const o = i * STRIDE;
        let x = parts[o];
        let y = parts[o + 1];
        const age = parts[o + 4] + dt;
        const life = parts[o + 5];

        if (age >= life || y < -50 || x < -90 || x > W + 90) {
          spawn(i, false);
          parts[i * STRIDE + 4] = 0;
          continue;
        }

        // Divergence-free flow: velocity = (∂ψ/∂y, −∂ψ/∂x).
        const cx =
          (psi(x, y + CURL_EPS, t) - psi(x, y - CURL_EPS, t)) / (2 * CURL_EPS);
        const cy =
          -(psi(x + CURL_EPS, y, t) - psi(x - CURL_EPS, y, t)) /
          (2 * CURL_EPS);

        const h01 = clamp(1 - y / H, 0, 1);
        const hw = 0.15 + 0.85 * h01 * h01; // the base stays anchored

        let wind = breeze;
        if (ptr.e > 0.01) {
          const pull = clamp(
            (ptr.x - x) * POINTER_WIND,
            -POINTER_CAP,
            POINTER_CAP,
          );
          const reach = Math.exp(
            -((y - ptr.y) * (y - ptr.y)) / (H * H * 0.09),
          );
          wind += pull * ptr.e * reach;
        }

        const tvx = cx * SWIRL + wind * hw;
        const tvy =
          -RISE * (0.78 + 0.04 * parts[o + 6]) +
          cy * SWIRL * 0.65 +
          scrollLag * (0.2 + 0.8 * h01);

        const vx = parts[o + 2] + (tvx - parts[o + 2]) * relax;
        const vy = parts[o + 3] + (tvy - parts[o + 3]) * relax;
        x += vx * dt;
        y += vy * dt;

        parts[o] = x;
        parts[o + 1] = y;
        parts[o + 2] = vx;
        parts[o + 3] = vy;
        parts[o + 4] = age;
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, W, H);

      // The censer's ember, breathing under the plume.
      const pulse = reduced ? 0.55 : 0.45 + 0.16 * Math.sin(t * 1.7);
      ctx.globalAlpha = pulse;
      ctx.drawImage(emberSprite, mouthX - 15, mouthY - 13, 30, 30);

      for (let i = 0; i < count; i++) {
        const o = i * STRIDE;
        const age = parts[o + 4];
        const life = parts[o + 5];
        const a01 = age / life;
        const x = parts[o];
        const y = parts[o + 1];

        const fadeIn = age > 0.6 ? 1 : age / 0.6;
        const fadeOut = (1 - a01) * Math.sqrt(1 - a01);
        const topFade = clamp(y / (H * 0.14), 0, 1);
        const alpha = 0.088 * fadeIn * fadeOut * topFade;
        if (alpha < 0.004) continue;

        const size = parts[o + 6] * (1 + a01 * 4.6) * 3.2;
        const half = size / 2;
        // Ink → pale-smoke crossfade as the ribbon disperses.
        const m = smoothstep(0.12, 0.48, a01);
        if (m < 1) {
          ctx.globalAlpha = alpha * (1 - m) * 1.2;
          ctx.drawImage(inkSprite, x - half, y - half, size, size);
        }
        if (m > 0) {
          ctx.globalAlpha = alpha * m;
          ctx.drawImage(smokeSprite, x - half, y - half, size, size);
        }
        // A dying ember glint rides the first half-second of each particle.
        if (age < 0.55) {
          ctx.globalAlpha = (1 - age / 0.55) * 0.4 * fadeIn;
          const es = parts[o + 6] * 1.6;
          ctx.drawImage(emberSprite, x - es / 2, y - es / 2, es, es);
        }
      }
      ctx.globalAlpha = 1;
    };

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (now - last < FRAME_MS) return;
      const dt = Math.min(now - last, 48) / 1000;
      last = now;

      // Scroll velocity: stale samples mean the page has stopped.
      const s = scrollRef.current;
      const eff = now - s.t < SCROLL_STALE_MS ? s.v : 0;
      const lagTarget = clamp(eff * SCROLL_WIND, -SCROLL_CAP, SCROLL_CAP);
      scrollLag += (lagTarget - scrollLag) * (1 - Math.exp(-dt * SCROLL_SMOOTH));

      // Autonomous drift when there is no hand to follow.
      if (!fine || now - lastMove > IDLE_MS) {
        target.x = mouthX + W * 0.16 * Math.sin(t * 0.13);
        target.y = H * (0.45 + 0.1 * Math.sin(t * 0.29 + 1.1));
        target.e = 0.32 + 0.1 * Math.sin(t * 0.37);
      }
      const k = clamp(dt * 60, 0, 3); // frame-rate normalization
      ptr.x += (target.x - ptr.x) * 0.085 * k;
      ptr.y += (target.y - ptr.y) * 0.085 * k;
      const ek = target.e > ptr.e ? POINTER_ATTACK : POINTER_RELEASE;
      ptr.e += (target.e - ptr.e) * ek * k;

      step(dt);
      draw();
    };

    const start = () => {
      if (running || reduced) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    const warmup = () => {
      for (let i = 0; i < count; i++) spawn(i, true);
      for (let i = 0; i < WARMUP_STEPS; i++) step(WARMUP_DT);
    };

    const resize = () => {
      const rect = stage.getBoundingClientRect();
      if (rect.width < 4 || rect.height < 4) return;
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      W = rect.width;
      H = rect.height;
      docTop = rect.top + window.scrollY;
      docLeft = rect.left + window.scrollX;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      mouthX = W / 2 + MOUTH_DX;
      mouthY = H - MOUTH_UP;

      const wanted = clamp(
        Math.round((W * H) / AREA_PER_PARTICLE),
        MIN_PARTICLES,
        MAX_PARTICLES,
      );
      if (wanted !== count) {
        count = wanted;
        parts = new Float32Array(count * STRIDE);
        ptr.x = mouthX;
        ptr.y = H * 0.5;
        target.x = mouthX;
        target.y = H * 0.5;
        warmup();
      }
      if (!running) draw();
    };

    const onPointerMove = (ev: PointerEvent) => {
      if (ev.pointerType !== "mouse" && ev.pointerType !== "pen") return;
      const x = ev.clientX - (docLeft - window.scrollX);
      const y = ev.clientY - (docTop - window.scrollY);
      if (x < -40 || x > W + 40 || y < -40 || y > H + 40) return;
      target.x = x;
      target.y = y;
      target.e = 1;
      lastMove = performance.now();
    };

    const onVisibility = () => {
      if (document.hidden) stop();
      else if (inView) start();
    };

    resize();

    const ro = new ResizeObserver(() => {
      resize();
    });
    ro.observe(stage);

    let io: IntersectionObserver | null = null;
    if (!reduced) {
      if (fine) window.addEventListener("pointermove", onPointerMove);
      io = new IntersectionObserver(
        (hits) => {
          inView = hits[hits.length - 1].isIntersecting;
          if (inView && !document.hidden) start();
          else stop();
        },
        { rootMargin: "80px 0px" },
      );
      io.observe(stage);
      document.addEventListener("visibilitychange", onVisibility);
    }

    return () => {
      stop();
      ro.disconnect();
      if (io) io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pointermove", onPointerMove);
    };
  }, [reduced, scrollRef]);

  return (
    <div
      ref={stageRef}
      className="kemuri-smoke"
      role="img"
      aria-label="A single ribbon of incense smoke rises from a bronze censer, coiling and untying itself as it climbs, leaning gently toward your hand. 香炉から一筋の煙が立ちのぼり、ほどけては結び直しながら、そっと手のほうへ傾く。"
    >
      <canvas ref={canvasRef} className="kemuri-smoke__canvas" aria-hidden="true" />
    </div>
  );
}
