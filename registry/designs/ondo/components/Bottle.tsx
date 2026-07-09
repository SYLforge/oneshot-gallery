"use client";

import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

/** Backing-store resolution cap. */
const MAX_DPR = 2;
/** Skip frames that arrive faster than ~64fps (high-refresh displays). */
const FRAME_MS = 15.5;
/** Displacement caps in CSS px — refraction, never distortion. */
const AMP_X = 7;
const AMP_Y = 4;
/** Per-frame lerp factors, normalized to 60fps inside the loop. */
const POINTER_LERP = 0.08;
const ENERGY_ATTACK = 0.05;
const ENERGY_RELEASE = 0.02;
/** Pointer silence before the autonomous shimmer takes back over (ms). */
const IDLE_MS = 2800;
/** Hand-picked timestamp for the reduced-motion still frame. */
const STILL_T = 4200;

const NOISE_N = 1024;
const LATTICE = 64;

/** Deterministic PRNG so the glass ripples the same way every visit. */
function mulberry32(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let z = Math.imul(s ^ (s >>> 15), 1 | s);
    z = (z + Math.imul(z ^ (z >>> 7), 61 | z)) ^ z;
    return ((z ^ (z >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * The precomputed noise field of the refraction: 1024 samples over 64
 * smooth-stepped lattice cells, two octaves, built once per mount.
 * Values ≈ [-1, 1]; the LUT wraps, so the drift never pops.
 */
function buildNoise(seed: number): Float32Array {
  const rand = mulberry32(seed);
  const lat = new Float32Array(LATTICE);
  for (let i = 0; i < LATTICE; i++) lat[i] = rand() * 2 - 1;

  const smooth = (u: number): number => {
    const i = Math.floor(u);
    const f = u - i;
    const s = f * f * (3 - 2 * f);
    const a = lat[i & (LATTICE - 1)];
    const b = lat[(i + 1) & (LATTICE - 1)];
    return a + (b - a) * s;
  };

  const out = new Float32Array(NOISE_N);
  for (let i = 0; i < NOISE_N; i++) {
    const u = (i / NOISE_N) * LATTICE;
    out[i] = smooth(u) * 0.68 + smooth(u * 3.7 + 11.3) * 0.32;
  }
  return out;
}

/** Sample the LUT; `u` is in lattice-cell units (~one undulation each). */
function noiseAt(lut: Float32Array, u: number): number {
  const x = u * (NOISE_N / LATTICE);
  const i = Math.floor(x);
  const f = x - i;
  const a = lut[i & (NOISE_N - 1)];
  const b = lut[(i + 1) & (NOISE_N - 1)];
  return a + (b - a) * f;
}

/**
 * Section 01 — the signature moment. The bottle is drawn purely in SVG
 * gradients (no raster image anywhere in this entry — deliberate). Over it
 * hangs a hairline-framed canvas pane: the inline SVG is serialized, drawn
 * to an offscreen canvas, and re-rendered every frame through a two-pass
 * strip displacement (rows shifted horizontally, then columns vertically)
 * driven by the precomputed noise field. The warp's lens follows the
 * pointer — lerped, capped — so the pane behaves like a sheet of old glass
 * held between you and the bottle. On touch, or when the pointer goes
 * quiet, a gentle autonomous shimmer takes over. Reduced motion renders a
 * single composed still frame and stops.
 */
export default function Bottle() {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const stage = stageRef.current;
    const svg = svgRef.current;
    const canvas = canvasRef.current;
    if (!stage || !svg || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Offscreens: `art` holds the flat render (stage bg + bottle SVG),
    // `mid` holds pass 1, padded vertically so pass 2 never samples a gap.
    const art = document.createElement("canvas");
    const mid = document.createElement("canvas");
    const artCtx = art.getContext("2d");
    const midCtx = mid.getContext("2d");
    if (!artCtx || !midCtx) return;

    const lut = buildNoise(365);
    const fine = window.matchMedia(
      "(hover: hover) and (pointer: fine)",
    ).matches;

    let disposed = false;
    let running = false;
    let inView = false;
    let ready = false;
    let live = false;
    let raf = 0;
    let last = 0;
    let t = reduced ? STILL_T : 0;

    let dpr = 1;
    let paneW = 0;
    let paneH = 0;
    let padY = 8;
    let offX = 0;
    let offY = 0;
    let rowH = 2;
    let colW = 3;
    let bg = "#16130f";

    const ptr = { x: 0.5, y: 0.42, e: reduced ? 0.35 : 0 };
    const target = { x: 0.5, y: 0.42, e: 0 };
    let lastMove = -1e9;

    const img = new Image();

    const renderArt = () => {
      artCtx.setTransform(1, 0, 0, 1, 0, 0);
      artCtx.fillStyle = bg;
      artCtx.fillRect(0, 0, art.width, art.height);
      if (ready) artCtx.drawImage(img, 0, 0, art.width, art.height);
    };

    const resize = () => {
      const svgRect = svg.getBoundingClientRect();
      const paneRect = canvas.getBoundingClientRect();
      if (svgRect.width < 4 || paneRect.width < 4) return;
      dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      paneW = Math.max(1, Math.round(paneRect.width * dpr));
      paneH = Math.max(1, Math.round(paneRect.height * dpr));
      padY = Math.ceil(AMP_Y * dpr) + 2;
      rowH = Math.max(2, Math.round(1.5 * dpr));
      colW = Math.max(3, Math.round(2 * dpr));
      canvas.width = paneW;
      canvas.height = paneH;
      art.width = Math.max(paneW, Math.round(svgRect.width * dpr));
      art.height = Math.max(paneH + padY * 2, Math.round(svgRect.height * dpr));
      mid.width = paneW;
      mid.height = paneH + padY * 2;
      offX = Math.round((paneRect.left - svgRect.left) * dpr);
      offY = Math.round((paneRect.top - svgRect.top) * dpr);
      bg = getComputedStyle(stage).backgroundColor || bg;
      renderArt();
    };

    const draw = () => {
      // Pass 1 — horizontal refraction: art rows → mid, offset by the field.
      const capX = AMP_X * dpr;
      const maxSX = art.width - paneW;
      for (let my = 0; my < mid.height; my += rowH) {
        const y01 = my / mid.height;
        const dyP = y01 - ptr.y;
        const lens = Math.exp(-(dyP * dyP) / 0.055);
        const n = noiseAt(lut, y01 * 3.2 + t * 0.00022);
        let dx =
          n * (0.9 + 7 * ptr.e * lens) * dpr +
          (ptr.x - 0.5) * 6 * dpr * lens * ptr.e;
        if (dx > capX) dx = capX;
        else if (dx < -capX) dx = -capX;
        let sx = offX + dx;
        if (sx < 0) sx = 0;
        else if (sx > maxSX) sx = maxSX;
        let sy = offY - padY + my;
        if (sy < 0) sy = 0;
        else if (sy > art.height - rowH) sy = art.height - rowH;
        midCtx.drawImage(art, sx, sy, paneW, rowH, 0, my, paneW, rowH);
      }
      // Pass 2 — vertical refraction: mid columns → screen.
      const capY = padY - 1;
      for (let x = 0; x < paneW; x += colW) {
        const x01 = x / paneW;
        const dxP = x01 - ptr.x;
        const lens = Math.exp(-(dxP * dxP) / 0.06);
        const n = noiseAt(lut, x01 * 2.4 - t * 0.00017 + 21.4);
        let dy = n * (0.7 + 4.5 * ptr.e * lens) * dpr;
        if (dy > capY) dy = capY;
        else if (dy < -capY) dy = -capY;
        ctx.drawImage(mid, x, padY + dy, colW, paneH, x, 0, colW, paneH);
      }
      if (!live) {
        live = true;
        canvas.classList.add("is-live");
      }
    };

    const step = (now: number) => {
      raf = requestAnimationFrame(step);
      if (now - last < FRAME_MS) return;
      const dt = Math.min(now - last, 48);
      last = now;
      t += dt;

      // Autonomous shimmer on touch, or when the pointer goes quiet.
      if (!fine || now - lastMove > IDLE_MS) {
        target.x = 0.5 + 0.3 * Math.sin(t * 0.00019);
        target.y = 0.42 + 0.24 * Math.sin(t * 0.00031 + 1.3);
        target.e = 0.3 + 0.12 * Math.sin(t * 0.00043);
      }
      const k = dt / 16.7; // frame-rate normalization
      ptr.x += (target.x - ptr.x) * POINTER_LERP * k;
      ptr.y += (target.y - ptr.y) * POINTER_LERP * k;
      const ek = target.e > ptr.e ? ENERGY_ATTACK : ENERGY_RELEASE;
      ptr.e += (target.e - ptr.e) * ek * k;

      if (ready) draw();
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
      const rect = canvas.getBoundingClientRect();
      if (rect.width < 1) return;
      target.x = (ev.clientX - rect.left) / rect.width;
      target.y = (ev.clientY - rect.top) / rect.height;
      target.e = 1;
      lastMove = performance.now();
    };
    const onPointerLeave = () => {
      lastMove = -1e9;
    };

    img.onload = () => {
      if (disposed) return;
      ready = true;
      renderArt();
      // Paints even before the observer starts the loop — and this is the
      // single composed frame under reduced motion.
      draw();
    };
    img.onerror = () => {
      if (disposed) return;
      // The crisp SVG simply stays; the page loses nothing but the ripple.
      canvas.style.display = "none";
    };

    resize();
    img.src =
      "data:image/svg+xml;charset=utf-8," +
      encodeURIComponent(new XMLSerializer().serializeToString(svg));

    let io: IntersectionObserver | null = null;
    const onVisibility = () => {
      if (document.hidden) stop();
      else if (inView) start();
    };

    const ro = new ResizeObserver(() => {
      resize();
      if (ready && !running) draw();
    });
    ro.observe(stage);

    if (!reduced) {
      if (fine) {
        stage.addEventListener("pointermove", onPointerMove);
        stage.addEventListener("pointerleave", onPointerLeave);
      }
      // Only burn frames while the pane is anywhere near the viewport.
      io = new IntersectionObserver(
        (hits) => {
          inView = hits[hits.length - 1].isIntersecting;
          if (inView && !document.hidden) start();
          else stop();
        },
        { rootMargin: "120px 0px" },
      );
      io.observe(stage);
      document.addEventListener("visibilitychange", onVisibility);
    }

    return () => {
      disposed = true;
      stop();
      ro.disconnect();
      if (io) io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      stage.removeEventListener("pointermove", onPointerMove);
      stage.removeEventListener("pointerleave", onPointerLeave);
      img.onload = null;
      img.onerror = null;
    };
  }, [reduced]);

  return (
    <section className="ondo-bottle" aria-labelledby="ondo-bottle-title">
      <div className="ondo-sechead" data-reveal="fade">
        <p className="ondo-eyebrow">01 — the vessel</p>
        <h2 id="ondo-bottle-title" className="ondo-sechead__title">
          The vessel{" "}
          <span lang="ko" className="ondo-sechead__ko">
            병
          </span>
        </h2>
        <p className="ondo-sechead__line">
          36.5° — the temperature at which skin becomes a story.{" "}
          <span lang="ko" className="ondo-sechead__lineko">
            36.5도 — 피부가 이야기가 되는 온도.
          </span>
        </p>
      </div>

      <figure className="ondo-bottle__fig" data-reveal="fade">
        <p className="ondo-bottle__degree" aria-hidden="true">
          36.5°
        </p>
        <div ref={stageRef} className="ondo-bottle__stage">
          <svg
            ref={svgRef}
            className="ondo-bottle__svg"
            viewBox="0 0 360 560"
            width={360}
            height={560}
            role="img"
            aria-label="A perfume bottle drawn entirely in gradients: a slender glass flacon, its liquid filled exactly to the 36.5-degree mark of a hairline thermometer, sealed with a faceted stopper. 그라디언트만으로 그린 향수병 — 가는 온도계의 36.5도 눈금까지 차오른 액체, 다면으로 깎인 마개."
          >
            <defs>
              <radialGradient id="ondo-g-halo" cx="50%" cy="55%" r="60%">
                <stop offset="0%" stopColor="#9c6b3f" stopOpacity="0.18" />
                <stop offset="55%" stopColor="#9c6b3f" stopOpacity="0.07" />
                <stop offset="100%" stopColor="#9c6b3f" stopOpacity="0" />
              </radialGradient>
              <linearGradient id="ondo-g-glass" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#2b2318" stopOpacity="0.92" />
                <stop offset="14%" stopColor="#1c1712" stopOpacity="0.92" />
                <stop offset="50%" stopColor="#16130f" stopOpacity="0.94" />
                <stop offset="86%" stopColor="#1c1712" stopOpacity="0.92" />
                <stop offset="100%" stopColor="#2b2318" stopOpacity="0.92" />
              </linearGradient>
              <linearGradient id="ondo-g-liquid" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#d8c39a" stopOpacity="0.62" />
                <stop offset="45%" stopColor="#b9905c" stopOpacity="0.72" />
                <stop offset="100%" stopColor="#9c6b3f" stopOpacity="0.88" />
              </linearGradient>
              <linearGradient id="ondo-g-collar" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#c9a06a" />
                <stop offset="55%" stopColor="#9c6b3f" />
                <stop offset="100%" stopColor="#6f4a28" />
              </linearGradient>
              <linearGradient id="ondo-g-stopper" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#efe9df" stopOpacity="0.85" />
                <stop offset="45%" stopColor="#d8c39a" stopOpacity="0.55" />
                <stop offset="100%" stopColor="#9c6b3f" stopOpacity="0.65" />
              </linearGradient>
              <linearGradient id="ondo-g-spec" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#efe9df" stopOpacity="0" />
                <stop offset="30%" stopColor="#efe9df" stopOpacity="0.34" />
                <stop offset="75%" stopColor="#efe9df" stopOpacity="0.1" />
                <stop offset="100%" stopColor="#efe9df" stopOpacity="0" />
              </linearGradient>
              <radialGradient id="ondo-g-floor" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#000000" stopOpacity="0.55" />
                <stop offset="70%" stopColor="#9c6b3f" stopOpacity="0.12" />
                <stop offset="100%" stopColor="#9c6b3f" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* warm aura + floor shadow */}
            <ellipse cx="180" cy="320" rx="168" ry="212" fill="url(#ondo-g-halo)" />
            <ellipse cx="180" cy="512" rx="112" ry="13" fill="url(#ondo-g-floor)" />

            {/* glass body — shoulders taper into the neck */}
            <path
              d="M162 132 L162 190
                 C162 212 122 216 112 242
                 C106 259 105 278 105 298
                 L105 468
                 C105 490 119 500 141 500
                 L219 500
                 C241 500 255 490 255 468
                 L255 298
                 C255 278 254 259 248 242
                 C238 216 198 212 198 190
                 L198 132 Z"
              fill="url(#ondo-g-glass)"
              stroke="#d8c39a"
              strokeOpacity="0.35"
              strokeWidth="1"
            />

            {/* the liquid, filled exactly to the 36.5° line */}
            <path
              d="M118 266 L118 468 C118 484 128 492 142 492 L218 492 C232 492 242 484 242 468 L242 266 Z"
              fill="url(#ondo-g-liquid)"
            />
            <ellipse cx="180" cy="266" rx="62" ry="5.5" fill="#d8c39a" fillOpacity="0.5" />

            {/* inner wall hairline */}
            <path
              d="M118 254 L118 468 C118 484 128 492 142 492 L218 492 C232 492 242 484 242 468 L242 254"
              fill="none"
              stroke="#efe9df"
              strokeOpacity="0.08"
              strokeWidth="1"
            />

            {/* speculars */}
            <rect x="128" y="218" width="10" height="266" rx="5" fill="url(#ondo-g-spec)" opacity="0.55" />
            <rect x="216" y="230" width="4" height="240" rx="2" fill="url(#ondo-g-spec)" opacity="0.3" />
            <rect x="167" y="140" width="4" height="56" rx="2" fill="url(#ondo-g-spec)" opacity="0.45" />

            {/* vermeil collar */}
            <rect x="154" y="112" width="52" height="20" rx="2.5" fill="url(#ondo-g-collar)" />
            <line x1="154" y1="117" x2="206" y2="117" stroke="#efe9df" strokeOpacity="0.25" strokeWidth="1" />

            {/* faceted stopper */}
            <path
              d="M180 36 L213 68 L205 112 L155 112 L147 68 Z"
              fill="url(#ondo-g-stopper)"
              stroke="#efe9df"
              strokeOpacity="0.22"
              strokeWidth="1"
            />
            <path d="M180 36 L180 112" stroke="#efe9df" strokeOpacity="0.16" strokeWidth="1" />
            <path d="M147 68 L213 68" stroke="#efe9df" strokeOpacity="0.12" strokeWidth="1" />
            <path d="M180 36 L166 112" stroke="#efe9df" strokeOpacity="0.08" strokeWidth="1" />
            <path d="M180 36 L194 112" stroke="#efe9df" strokeOpacity="0.08" strokeWidth="1" />

            {/* the thermometer — the filled dot marks 36.5°, at the liquid line */}
            <g stroke="#d8c39a" strokeOpacity="0.3" strokeWidth="1">
              <line x1="272" y1="216" x2="282" y2="216" />
              <line x1="272" y1="266" x2="286" y2="266" strokeOpacity="0.7" />
              <line x1="272" y1="316" x2="282" y2="316" />
              <line x1="272" y1="366" x2="282" y2="366" />
              <line x1="272" y1="416" x2="282" y2="416" />
              <line x1="272" y1="466" x2="282" y2="466" />
            </g>
            <line
              x1="242"
              y1="266"
              x2="272"
              y2="266"
              stroke="#d8c39a"
              strokeOpacity="0.18"
              strokeWidth="1"
              strokeDasharray="1 4"
            />
            <circle cx="292" cy="266" r="2.5" fill="#d8c39a" />
          </svg>

          <canvas ref={canvasRef} className="ondo-bottle__pane" aria-hidden="true" />
          <div className="ondo-bottle__frame" aria-hidden="true" />
        </div>
        <figcaption className="ondo-bottle__caption">
          Look through the pane — the glass bends the light it keeps.{" "}
          <span lang="ko" className="ondo-bottle__captionko">
            유리 너머를 보라. 유리는 제 안의 빛을 구부린다.
          </span>
        </figcaption>
      </figure>
    </section>
  );
}
