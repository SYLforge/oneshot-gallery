"use client";

import { useEffect } from "react";
import type { PointerInkSample, InkDropRequest } from "./usePointerInk";
import type { ScrollProgress } from "./useScrollProgress";

/* -- rendering ------------------------------------------------------------ */
/** Backing-store resolution cap. */
const MAX_DPR = 2;
/** Skip frames that arrive faster than ~64fps (high-refresh displays). */
const FRAME_MS = 15.5;
/** Petal budget: one per this many CSS px² of stage, clamped. */
const AREA_PER_PETAL = 2600;
const MIN_PETALS = 120;
const MAX_PETALS = 520;
/** Maximum simultaneous falling ink drops (older drops are dropped). */
const MAX_DROPS = 14;
/** Maximum simultaneous splash micro-droplets. */
const MAX_SPLASH = 80;

/* -- the curl wind field -------------------------------------------------- */
/** Feature sizes of the two potential octaves (px⁻¹): broad gusts, fine curls. */
const GUST_LARGE = 1 / 170;
const GUST_SMALL = 1 / 64;
/** The noise field itself drifts (px/s): leftward + upward, so gusts travel. */
const FIELD_DRIFT_X = -10;
const FIELD_DRIFT_Y = -14;
/** Curl gain — converts potential slope into px/s of swirl. */
const SWIRL = 720;
/** Finite-difference epsilon for the curl (px). */
const CURL_EPS = 2.5;

/* -- ink drop physics ----------------------------------------------------- */
/** Drop acceleration (px/s²). */
const DROP_GRAVITY = 580;
/** Terminal fall velocity (px/s). */
const DROP_TERMINAL = 480;
/** Drops spawn across the top at this interval when autonomous (s). */
const AUTO_DROP_INTERVAL = 2.6;

/* -- petal physics -------------------------------------------------------- */
/** Petal buoyancy (px/s) — negative: petals sink gently, like real blossoms. */
const PETAL_SINK = -22;
/** Velocity relaxation rate (s⁻¹) — petals have inertia, not obedience. */
const PETAL_RELAX = 1.8;
/** Seconds of life: min + random spread. */
const LIFE_MIN = 7;
const LIFE_SPREAD = 6;
/** Base petal size (px) and growth over life. */
const SIZE_MIN = 7;
const SIZE_SPREAD = 9;
/** Petal rotation (rad/s). */
const ROT_MIN = 0.6;
const ROT_SPREAD = 1.8;

/* -- the bloom burst ------------------------------------------------------ */
/** Petals spawned per drop bloom. */
const BLOOM_MIN = 8;
const BLOOM_SPREAD = 6;
/** Outward velocity of the burst (px/s). */
const BURST_VEL_MIN = 40;
const BURST_VEL_SPREAD = 50;
/** Splash micro-droplets per drop. */
const SPLASH_MIN = 4;
const SPLASH_SPREAD = 3;

/* -- outside influences --------------------------------------------------- */
/** Pointer horizontal pull (px/s per px of distance), capped. */
const POINTER_WIND = 1.3;
const POINTER_CAP = 70;
/** Pointer energy lerps — quick to notice a hand, slow to forget. */
const POINTER_ATTACK = 0.06;
const POINTER_RELEASE = 0.02;
/** Autonomous breeze: two slow sines with unrelated periods. */
function breezeAt(t: number): number {
  return 18 * Math.sin(t * 0.19) + 9 * Math.sin(t * 0.43 + 1.4);
}

/* -- warmup --------------------------------------------------------------- */
/** Pre-advect the petal field so the garden is already blooming on first paint. */
const WARMUP_STEPS = 90;
const WARMUP_DT = 0.09;

/** Layout of a petal in the Float32Array: x, y, vx, vy, age, life, size, rot, vrot, tone. */
const PSTRIDE = 10;

function clamp(v: number, lo: number, hi: number): number {
  return v < lo ? lo : v > hi ? hi : v;
}

/** Deterministic PRNG — the garden blooms the same way every visit. */
function mulberry32(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let z = Math.imul(s ^ (s >>> 15), 1 | s);
    z = (z + Math.imul(z ^ (z >>> 7), 61 | z)) ^ z;
    return ((z ^ (z >>> 14)) >>> 0) / 4294967296;
  };
}

/** 256-entry permutation for the lattice hash. Seeded 718 — the bloom date. */
function buildPerm(): Uint8Array {
  const rand = mulberry32(20260718);
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
 * The scalar potential ψ for the wind. Two octaves of value noise; the whole
 * field drifts leftward + upward over time so gusts travel with the petals
 * instead of petals swimming through frozen wind. (Echoes KEMURI's smoke
 * field-rise, but in 2D and downward-left, the way spring weather moves.)
 */
function psi(x: number, y: number, t: number): number {
  const xr = x + t * FIELD_DRIFT_X;
  const yr = y + t * FIELD_DRIFT_Y;
  return (
    valueNoise(xr * GUST_LARGE, yr * GUST_LARGE) -
    0.5 +
    (valueNoise(xr * GUST_SMALL + 23.1, yr * (GUST_SMALL * 1.3) + 7.7) - 0.5) *
      0.4
  );
}

/**
 * A single cherry-petal sprite: a 5-pointed notched blossom, prerendered to a
 * small offscreen canvas so each particle is one drawImage (no per-frame path
 * building). Three tones for variety: fresh bloom, mid blossom, pale edge.
 * Built from the sheet's blossom tokens.
 */
function makePetalSprite(
  fill: string,
  notch: string,
): HTMLCanvasElement {
  const size = 48;
  const c = document.createElement("canvas");
  c.width = size;
  c.height = size;
  const cx = c.getContext("2d");
  if (cx) {
    cx.translate(size / 2, size / 2);
    // A 5-petal cherry blossom: five notched lobes around a center, drawn as
    // a single filled path. The notch at each tip is what makes it read as
    // sakura rather than a generic flower.
    const R = size * 0.42;
    const r = R * 0.42;
    cx.beginPath();
    for (let i = 0; i < 5; i++) {
      const a0 = (i / 5) * Math.PI * 2 - Math.PI / 2;
      const a1 = ((i + 0.5) / 5) * Math.PI * 2 - Math.PI / 2;
      const a2 = ((i + 1) / 5) * Math.PI * 2 - Math.PI / 2;
      // outer point with a small notch (two close points) at the petal tip
      const tipX = Math.cos(a1) * R;
      const tipY = Math.sin(a1) * R;
      const notchA = a1 - 0.12;
      const notchB = a1 + 0.12;
      if (i === 0) cx.moveTo(Math.cos(a0) * r, Math.sin(a0) * r);
      cx.quadraticCurveTo(
        Math.cos(a0 + 0.25) * R * 0.9,
        Math.sin(a0 + 0.25) * R * 0.9,
        Math.cos(notchA) * R * 0.96,
        Math.sin(notchA) * R * 0.96,
      );
      cx.lineTo(tipX * 0.78, tipY * 0.78); // notch valley
      cx.lineTo(Math.cos(notchB) * R * 0.96, Math.sin(notchB) * R * 0.96);
      cx.quadraticCurveTo(
        Math.cos(a2 - 0.25) * R * 0.9,
        Math.sin(a2 - 0.25) * R * 0.9,
        Math.cos(a2) * r,
        Math.sin(a2) * r,
      );
    }
    cx.closePath();
    cx.fillStyle = fill;
    cx.fill();
    // a soft inner highlight toward the center, in the notch tone
    const grad = cx.createRadialGradient(0, 0, 0, 0, 0, R * 0.5);
    grad.addColorStop(0, notch);
    grad.addColorStop(1, "rgba(0,0,0,0)");
    cx.fillStyle = grad;
    cx.fill();
  }
  return c;
}

/** A soft radial ink sprite: the falling drop and the splash droplets. */
function makeInkSprite(r: number, g: number, b: number, core: number): HTMLCanvasElement {
  const size = 32;
  const c = document.createElement("canvas");
  c.width = size;
  c.height = size;
  const cx = c.getContext("2d");
  if (cx) {
    const grad = cx.createRadialGradient(16, 16, 0, 16, 16, 16);
    grad.addColorStop(0, `rgba(${r},${g},${b},${core})`);
    grad.addColorStop(0.5, `rgba(${r},${g},${b},${core * 0.5})`);
    grad.addColorStop(1, `rgba(${r},${g},${b},0)`);
    cx.fillStyle = grad;
    cx.fillRect(0, 0, size, size);
  }
  return c;
}

/** A gold dust mote: the one warm grain, prerendered. */
function makeGoldSprite(): HTMLCanvasElement {
  const size = 16;
  const c = document.createElement("canvas");
  c.width = size;
  c.height = size;
  const cx = c.getContext("2d");
  if (cx) {
    const grad = cx.createRadialGradient(8, 8, 0, 8, 8, 8);
    grad.addColorStop(0, "rgba(201,168,90,0.9)");
    grad.addColorStop(0.4, "rgba(201,168,90,0.4)");
    grad.addColorStop(1, "rgba(201,168,90,0)");
    cx.fillStyle = grad;
    cx.fillRect(0, 0, size, size);
  }
  return c;
}

export type BloomCanvasOptions = {
  /** Refs from usePointerInk — wind bias + click-to-drop queue. */
  pointer: React.RefObject<PointerInkSample>;
  drops: React.RefObject<InkDropRequest[]>;
  /** Optional scroll-progress ref (verse section). When present and >0, the
   *  garden spawns extra ink-drops and holds a petal-density floor, so petals
   *  accumulate as the reader scrubs the verses. */
  progress?: React.RefObject<ScrollProgress>;
};

/**
 * The signature moment. Ink drops fall from the top of the stage (or from a
 * pointer tap), accelerate under gravity, and on striking an invisible
 * waterline (y = 0.42·H) they splash and BLOOM: a ring of 8–14 petal
 * particles spawns outward and is then advected through a divergence-free
 * curl-noise wind field (velocity = (∂ψ/∂y, −∂ψ/∂x)), so petals drift and
 * coil like real blossoms on spring air but never compress or tear. Petals
 * sink gently (negative buoyancy — cherry blossoms fall, they do not rise),
 * relax toward the field at 1.8 s⁻¹ (inertia), and fade over 7–13 s.
 *
 * The wind leans toward a fine pointer (horizontal pull capped ±70 px/s,
 * energy attack .06/release .02); on touch or idle a two-sine breeze
 * (~33 s and ~15 s periods) keeps the garden alive. Ink drops fall
 * autonomously every ~2.6 s so the page is never still even without a hand.
 *
 * If `progress` is supplied, scroll progress 0→1 raises the autonomous drop
 * rate and enforces a petal-density floor — the verse section scrubs petals
 * into being as you read, and lets them clear as you leave.
 *
 * Reduced motion pre-advects the field and paints one composed still: a
 * garden already in mid-bloom, one drop frozen mid-fall, petals resting
 * where the breeze holds them. The loop pauses offscreen and when the tab
 * hides.
 */
export function useBloomCanvas(
  stageRef: React.RefObject<HTMLDivElement | null>,
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  reduced: boolean,
  opts: BloomCanvasOptions,
) {
  useEffect(() => {
    const stage = stageRef.current;
    const canvas = canvasRef.current;
    if (!stage || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const fine = window.matchMedia(
      "(hover: hover) and (pointer: fine)",
    ).matches;
    const rand = mulberry32(718);

    // Sprites — every color a sheet token:
    // blossom #e8869e · bloom #f4c2d4 · petal-white #f6eef0 · gold #c9a85a
    // ink (the drop) uses a near-black with a warm undertone: #0e0a0f's ink.
    const petalFresh = makePetalSprite("rgba(232,134,158,0.92)", "rgba(246,238,240,0.5)");
    const petalMid = makePetalSprite("rgba(244,194,212,0.9)", "rgba(246,238,240,0.55)");
    const petalPale = makePetalSprite("rgba(246,238,240,0.85)", "rgba(244,194,212,0.4)");
    const inkDrop = makeInkSprite(20, 14, 22, 0.95);
    const inkSplash = makeInkSprite(30, 20, 32, 0.7);
    const gold = makeGoldSprite();
    const petalSprites = [petalFresh, petalMid, petalPale];

    let W = 0;
    let H = 0;
    let waterY = 0;
    let count = 0;
    let parts = new Float32Array(0);

    // Falling drops: x, y, vy, alive flag stored as separate small arrays.
    const drops: { x: number; y: number; vy: number; alive: boolean }[] = [];
    // Splash micro-droplets: x, y, vx, vy, age, life.
    const splashes: { x: number; y: number; vx: number; vy: number; age: number; life: number }[] = [];
    // Gold motes: a handful of slow drifters for warmth.
    const motes: { x: number; y: number; r: number; ph: number; vx: number; vy: number }[] = [];

    let raf = 0;
    let running = false;
    let inView = false;
    let last = 0;
    let t = 0; // simulation clock, seconds
    let autoDropTimer = 0;

    const ptr = { x: 0, y: 0, e: 0 };

    const spawnPetal = (i: number, warm: boolean, atX?: number, atY?: number) => {
      const o = i * PSTRIDE;
      parts[o] = atX ?? rand() * W;
      parts[o + 1] = atY ?? rand() * waterY;
      parts[o + 2] = (rand() - 0.5) * 20;
      parts[o + 3] = PETAL_SINK * (0.7 + rand() * 0.6);
      parts[o + 5] = LIFE_MIN + rand() * LIFE_SPREAD;
      parts[o + 4] = warm ? rand() * parts[o + 5] : 0;
      parts[o + 6] = SIZE_MIN + rand() * SIZE_SPREAD;
      parts[o + 7] = rand() * Math.PI * 2;
      parts[o + 8] = (rand() < 0.5 ? -1 : 1) * (ROT_MIN + rand() * ROT_SPREAD);
      parts[o + 9] = (rand() * 3) | 0; // tone index
    };

    const bloom = (x: number) => {
      // A drop has struck the waterline at x. Splash + spawn a ring of petals.
      const n = BLOOM_MIN + ((rand() * BLOOM_SPREAD) | 0);
      const baseAngle = rand() * Math.PI * 2;
      for (let k = 0; k < n; k++) {
        // find a dead/recyclable petal slot
        let slot = -1;
        for (let i = 0; i < count; i++) {
          const o = i * PSTRIDE;
          if (parts[o + 4] >= parts[o + 5]) {
            slot = i;
            break;
          }
        }
        if (slot < 0) break;
        const o = slot * PSTRIDE;
        const ang =
          baseAngle + (k / n) * Math.PI * 2 + (rand() - 0.5) * 0.8;
        const spd = BURST_VEL_MIN + rand() * BURST_VEL_SPREAD;
        parts[o] = x + (rand() - 0.5) * 8;
        parts[o + 1] = waterY + (rand() - 0.5) * 4;
        parts[o + 2] = Math.cos(ang) * spd;
        parts[o + 3] = Math.sin(ang) * spd * 0.6 + PETAL_SINK;
        parts[o + 5] = LIFE_MIN + rand() * LIFE_SPREAD;
        parts[o + 4] = 0;
        parts[o + 6] = SIZE_MIN + rand() * SIZE_SPREAD;
        parts[o + 7] = rand() * Math.PI * 2;
        parts[o + 8] = (rand() < 0.5 ? -1 : 1) * (ROT_MIN + rand() * ROT_SPREAD);
        parts[o + 9] = (rand() * 3) | 0;
      }
      // micro-droplets splash upward
      const sn = SPLASH_MIN + ((rand() * SPLASH_SPREAD) | 0);
      for (let k = 0; k < sn; k++) {
        if (splashes.length >= MAX_SPLASH) splashes.shift();
        const ang = -Math.PI / 2 + (rand() - 0.5) * 1.8;
        const spd = 60 + rand() * 90;
        splashes.push({
          x: x + (rand() - 0.5) * 10,
          y: waterY,
          vx: Math.cos(ang) * spd,
          vy: Math.sin(ang) * spd,
          age: 0,
          life: 0.4 + rand() * 0.3,
        });
      }
    };

    const releaseDrop = (x: number) => {
      if (drops.length >= MAX_DROPS) drops.shift();
      drops.push({ x, y: 0, vy: 40 + rand() * 30, alive: true });
    };

    const step = (dt: number) => {
      t += dt;
      const relax = 1 - Math.exp(-dt * PETAL_RELAX);
      const breeze = breezeAt(t);

      // --- advance falling drops; on hitting the waterline, bloom ---
      for (const d of drops) {
        if (!d.alive) continue;
        d.vy = Math.min(d.vy + DROP_GRAVITY * dt, DROP_TERMINAL);
        d.y += d.vy * dt;
        if (d.y >= waterY) {
          d.alive = false;
          bloom(d.x);
        }
      }
      // compact dead drops occasionally
      if (drops.length > MAX_DROPS) {
        for (let i = drops.length - 1; i >= 0; i--)
          if (!drops[i].alive) drops.splice(i, 1);
      }

      // --- advance splash micro-droplets (gravity, short life) ---
      for (let i = splashes.length - 1; i >= 0; i--) {
        const s = splashes[i];
        s.vy += 900 * dt;
        s.x += s.vx * dt;
        s.y += s.vy * dt;
        s.age += dt;
        if (s.age >= s.life || s.y > waterY + 8) splashes.splice(i, 1);
      }

      // --- gold motes drift slowly ---
      for (const m of motes) {
        m.x += m.vx * dt;
        m.y += m.vy * dt;
        if (m.x < -20) m.x = W + 20;
        if (m.x > W + 20) m.x = -20;
        if (m.y < -20) m.y = H + 20;
        if (m.y > H + 20) m.y = -20;
      }

      // --- advect petals through the curl wind field ---
      for (let i = 0; i < count; i++) {
        const o = i * PSTRIDE;
        let x = parts[o];
        let y = parts[o + 1];
        const age = parts[o + 4] + dt;
        const life = parts[o + 5];

        if (age >= life || y > H + 40 || x < -60 || x > W + 60) {
          // recycle: respawn drifting in from an edge or mid-air, unless the
          // verse-section density floor is holding us.
          spawnPetal(i, true);
          continue;
        }

        // Divergence-free flow: velocity = (∂ψ/∂y, −∂ψ/∂x).
        const cx =
          (psi(x, y + CURL_EPS, t) - psi(x, y - CURL_EPS, t)) /
          (2 * CURL_EPS);
        const cy =
          -(psi(x + CURL_EPS, y, t) - psi(x - CURL_EPS, y, t)) /
          (2 * CURL_EPS);

        let wind = breeze;
        if (ptr.e > 0.01) {
          const pull = clamp(
            (ptr.x - x) * POINTER_WIND,
            -POINTER_CAP,
            POINTER_CAP,
          );
          const reach = Math.exp(-((y - ptr.y) * (y - ptr.y)) / (H * H * 0.12));
          wind += pull * ptr.e * reach;
        }

        const tvx = cx * SWIRL + wind;
        const tvy = PETAL_SINK + cy * SWIRL * 0.7;

        const vx = parts[o + 2] + (tvx - parts[o + 2]) * relax;
        const vy = parts[o + 3] + (tvy - parts[o + 3]) * relax;
        x += vx * dt;
        y += vy * dt;

        parts[o] = x;
        parts[o + 1] = y;
        parts[o + 2] = vx;
        parts[o + 3] = vy;
        parts[o + 4] = age;
        parts[o + 7] += parts[o + 8] * dt; // rotation
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, W, H);

      // gold motes — the one warm grain, drawn first (behind petals)
      ctx.globalAlpha = reduced ? 0.5 : 0.42 + 0.12 * Math.sin(t * 0.7);
      for (const m of motes) {
        const r = m.r * (1 + 0.2 * Math.sin(t * 0.9 + m.ph));
        ctx.drawImage(gold, m.x - r, m.y - r, r * 2, r * 2);
      }
      ctx.globalAlpha = 1;

      // petals
      for (let i = 0; i < count; i++) {
        const o = i * PSTRIDE;
        const age = parts[o + 4];
        const life = parts[o + 5];
        const a01 = age / life;
        const x = parts[o];
        const y = parts[o + 1];

        const fadeIn = age > 0.5 ? 1 : age / 0.5;
        const fadeOut = (1 - a01) * Math.sqrt(1 - a01);
        const alpha = 0.8 * fadeIn * fadeOut;
        if (alpha < 0.02) continue;

        const size = parts[o + 6] * (1 + a01 * 0.4);
        const half = size / 2;
        const sprite = petalSprites[parts[o + 9] % 3] ?? petalMid;

        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.translate(x, y);
        ctx.rotate(parts[o + 7]);
        ctx.drawImage(sprite, -half, -half, size, size);
        ctx.restore();
      }
      ctx.globalAlpha = 1;

      // splash micro-droplets (ink, above the waterline)
      for (const s of splashes) {
        const a = (1 - s.age / s.life) * 0.7;
        if (a <= 0) continue;
        ctx.globalAlpha = a;
        ctx.drawImage(inkSplash, s.x - 4, s.y - 4, 8, 8);
      }
      ctx.globalAlpha = 1;

      // falling drops — the ink, descending. Reduced motion freezes one
      // mid-fall for the composed still.
      if (reduced) {
        ctx.globalAlpha = 0.95;
        ctx.drawImage(inkDrop, W * 0.5 - 8, waterY * 0.5 - 8, 16, 20);
        ctx.globalAlpha = 1;
      } else {
        for (const d of drops) {
          if (!d.alive) continue;
          ctx.globalAlpha = 0.95;
          ctx.drawImage(inkDrop, d.x - 5, d.y - 8, 10, 16);
        }
        ctx.globalAlpha = 1;
      }

      // the waterline — a faint shimmer, the only fixed geometry
      const shimmer = reduced ? 0.28 : 0.22 + 0.12 * Math.sin(t * 1.0);
      ctx.globalAlpha = shimmer;
      ctx.strokeStyle = "rgba(168,154,162,0.55)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, waterY + 0.5);
      ctx.lineTo(W, waterY + 0.5);
      ctx.stroke();
      // a soft bloom glow beneath the line
      const glow = ctx.createLinearGradient(0, waterY, 0, waterY + 24);
      glow.addColorStop(0, "rgba(232,134,158,0.12)");
      glow.addColorStop(1, "rgba(232,134,158,0)");
      ctx.fillStyle = glow;
      ctx.fillRect(0, waterY, W, 24);
      ctx.globalAlpha = 1;
    };

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (now - last < FRAME_MS) return;
      const dt = Math.min(now - last, 48) / 1000;
      last = now;

      // drain pending ink-drops from pointer taps
      const dropQueue = opts.drops.current;
      while (dropQueue.length > 0) {
        const req = dropQueue.shift()!;
        releaseDrop(clamp(req.x, 8, W - 8));
      }

      // pointer energy: decay toward 0 unless a fresh move arrived
      const ps = opts.pointer.current;
      const sinceMove = (now - ps.t) / 1000;
      if (ps.e > 0.01) {
        ptr.x = ps.x;
        ptr.y = ps.y;
        const idle = sinceMove > 2.6;
        const target = idle ? 0 : ps.e;
        const ek = target > ptr.e ? POINTER_ATTACK : POINTER_RELEASE;
        const k = clamp(dt * 60, 0, 3);
        ptr.e += (target - ptr.e) * ek * k;
      } else {
        ptr.e += (0 - ptr.e) * POINTER_RELEASE * clamp(dt * 60, 0, 3);
      }

      // autonomous drift target when no hand is present
      if (!fine || sinceMove > 2.6) {
        // nothing — breeze handles it; ptr.e decays
      }

      // scroll-progress coupling (verse section): raise drop rate + density floor
      const prog = opts.progress?.current;
      const pRaw = prog ? clamp(prog.raw, 0, 1) : 0;
      autoDropTimer -= dt;
      const dropInterval = AUTO_DROP_INTERVAL / (1 + pRaw * 2.2);
      if (autoDropTimer <= 0) {
        releaseDrop(rand() * W);
        autoDropTimer = dropInterval;
      }
      // density floor: ensure at least progress·count petals are alive
      if (pRaw > 0.05) {
        const floor = Math.round(count * pRaw * 0.7);
        let alive = 0;
        for (let i = 0; i < count; i++) {
          if (parts[i * PSTRIDE + 4] < parts[i * PSTRIDE + 5]) alive++;
        }
        let needed = floor - alive;
        let guard = 0;
        while (needed > 0 && guard < count) {
          const i = guard;
          const o = i * PSTRIDE;
          if (parts[o + 4] >= parts[o + 5]) {
            spawnPetal(i, false);
            needed--;
          }
          guard++;
        }
      }

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
      for (let i = 0; i < count; i++) spawnPetal(i, true);
      for (let i = 0; i < WARMUP_STEPS; i++) step(WARMUP_DT);
      // a couple of pre-released drops so the waterline shows life
      releaseDrop(W * 0.3);
      releaseDrop(W * 0.7);
    };

    const resize = () => {
      const rect = stage.getBoundingClientRect();
      if (rect.width < 4 || rect.height < 4) return;
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      W = rect.width;
      H = rect.height;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      waterY = H * 0.42;

      const wanted = clamp(
        Math.round((W * H) / AREA_PER_PETAL),
        MIN_PETALS,
        MAX_PETALS,
      );
      if (wanted !== count) {
        count = wanted;
        parts = new Float32Array(count * PSTRIDE);
        warmup();
      }

      // (re)seed gold motes — a handful, scaled to width
      motes.length = 0;
      const moteCount = Math.max(5, Math.round(W / 220));
      const mr = mulberry32(777);
      for (let i = 0; i < moteCount; i++) {
        motes.push({
          x: mr() * W,
          y: mr() * H,
          r: 1.4 + mr() * 2.2,
          ph: mr() * Math.PI * 2,
          vx: (mr() - 0.5) * 8,
          vy: -2 - mr() * 6,
        });
      }

      if (!running) draw();
    };

    const onVisibility = () => {
      if (document.hidden) stop();
      else if (inView) start();
    };

    resize();

    const ro = new ResizeObserver(() => resize());
    ro.observe(stage);

    let io: IntersectionObserver | null = null;
    if (reduced) {
      // one composed still: garden already blooming, one drop mid-fall
      draw();
    } else {
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
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced, stageRef, canvasRef]);
}
