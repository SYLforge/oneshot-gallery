"use client";

import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import { useScrollProgress } from "../hooks/useScrollProgress";

/** The reel is 480 frames at 24fps — a 20-second sequence. */
const TOTAL_FRAMES = 480;
/** Backing-store resolution cap — grain gains nothing above 2. */
const MAX_DPR = 2;
/** Scrub smoothing per 60fps-normalized frame. */
const SCRUB_LERP = 0.12;
/** Grain re-seeds at ~12fps — film cadence, not display cadence. */
const GRAIN_MS = 83;
/** Reduced motion renders exactly one still, late in the dissolve. */
const STILL_P = 0.78;
/** Size of the pre-rendered grain tile (device px before scaling). */
const GRAIN_SIZE = 160;

/** Deterministic per-frame hash: same frame number, same wear, forever. */
function hash(n: number, salt: number): number {
  let x = (n * 374761393 + salt * 668265263) | 0;
  x = Math.imul(x ^ (x >>> 13), 1274126177);
  return ((x ^ (x >>> 16)) >>> 0) / 4294967296;
}

function frameOf(p: number): number {
  return Math.min(TOTAL_FRAMES - 1, Math.max(0, Math.floor(p * TOTAL_FRAMES)));
}

/**
 * Reel 02 — the signature. There is no video file anywhere in this entry:
 * the "footage" is drawn procedurally on a 2.39:1 canvas — two grayscale
 * shots (light through blinds crossing a room; a pale disc rising over a
 * night sea) dissolved into each other, under a wear pass of grain, dust,
 * scratches, gate weave, and lamp flicker. Scroll position is position in
 * the reel: the sticky stage holds while 380vh of scroll scrubs 480 frames.
 *
 * The rAF loop pauses offscreen (IntersectionObserver) and on hidden tabs
 * (visibilitychange); DPR is capped at 2. Reduced motion draws exactly one
 * composed still and never starts the loop.
 */
export default function Reel() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const frameRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const frameNoRef = useRef<HTMLSpanElement | null>(null);
  const tcRef = useRef<HTMLSpanElement | null>(null);
  const cueRef = useRef<HTMLSpanElement | null>(null);
  const targetPRef = useRef(0);
  const reduced = usePrefersReducedMotion();

  useScrollProgress(
    sectionRef,
    (p) => {
      targetPRef.current = p;
    },
    !reduced,
  );

  useEffect(() => {
    const section = sectionRef.current;
    const frame = frameRef.current;
    const canvas = canvasRef.current;
    const frameNo = frameNoRef.current;
    const tc = tcRef.current;
    const cue = cueRef.current;
    if (!section || !frame || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let raf = 0;
    let running = false;
    let visible = true;
    let disposed = false;
    let last = 0;
    let lastGrain = -1e9;
    let grainX = 0.31;
    let grainY = 0.67;
    let shownP = reduced ? STILL_P : 0;
    let lastFrameDrawn = -1;

    // -- grain tile: built once, re-offset at film cadence -----------------
    const grain = document.createElement("canvas");
    grain.width = GRAIN_SIZE;
    grain.height = GRAIN_SIZE;
    const gctx = grain.getContext("2d");
    if (gctx) {
      const img = gctx.createImageData(GRAIN_SIZE, GRAIN_SIZE);
      const d = img.data;
      for (let i = 0; i < d.length; i += 4) {
        const r = Math.random();
        if (r > 0.82) {
          d[i] = d[i + 1] = d[i + 2] = 225;
          d[i + 3] = 30 + Math.floor(Math.random() * 70);
        } else if (r < 0.16) {
          d[i] = d[i + 1] = d[i + 2] = 8;
          d[i + 3] = 30 + Math.floor(Math.random() * 80);
        }
      }
      gctx.putImageData(img, 0, 0);
    }

    const resize = () => {
      const rect = frame.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      w = Math.max(1, rect.width);
      h = Math.max(1, rect.height);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    // -- shot A: INT. MEMORY — NIGHT. Light through blinds crosses a room. -
    const drawShotA = (q: number) => {
      const base = ctx.createLinearGradient(0, 0, 0, h);
      base.addColorStop(0, "#0a0a0c");
      base.addColorStop(0.7, "#101013");
      base.addColorStop(1, "#08080a");
      ctx.fillStyle = base;
      ctx.fillRect(0, 0, w, h);

      // atmosphere follows the light across the room, left to right
      const lightX = w * (0.12 + q * 0.76);
      const air = ctx.createRadialGradient(
        lightX,
        h * 0.42,
        0,
        lightX,
        h * 0.42,
        w * 0.5,
      );
      air.addColorStop(0, "rgba(216, 212, 202, 0.16)");
      air.addColorStop(1, "rgba(216, 212, 202, 0)");
      ctx.fillStyle = air;
      ctx.fillRect(0, 0, w, h);

      // blind slats: tilted bright bands sweeping with the scrub
      ctx.save();
      ctx.translate(w * 0.5, h * 0.5);
      ctx.rotate(-0.42 + q * 0.14);
      const gap = w * 0.085;
      const sweep = (q - 0.5) * w * 0.9;
      for (let i = -8; i <= 8; i++) {
        const bx = i * gap + sweep * 0.4;
        const bw = gap * (0.32 + 0.1 * Math.sin(i * 1.7));
        const dxs = bx - sweep;
        const a = 0.05 + 0.09 * Math.exp(-(dxs * dxs) / (w * w * 0.02));
        const band = ctx.createLinearGradient(0, -h * 0.8, 0, h * 0.8);
        band.addColorStop(0, "rgba(226, 222, 212, 0)");
        band.addColorStop(0.45, `rgba(226, 222, 212, ${a.toFixed(3)})`);
        band.addColorStop(1, "rgba(226, 222, 212, 0)");
        ctx.fillStyle = band;
        ctx.fillRect(bx, -h, bw, h * 2);
      }
      ctx.restore();

      // the pool of light the floor catches
      const pool = ctx.createRadialGradient(
        lightX,
        h * 0.82,
        0,
        lightX,
        h * 0.82,
        w * 0.3,
      );
      pool.addColorStop(0, "rgba(216, 212, 202, 0.1)");
      pool.addColorStop(1, "rgba(216, 212, 202, 0)");
      ctx.fillStyle = pool;
      ctx.fillRect(0, h * 0.5, w, h * 0.5);
    };

    // -- shot B: EXT. SHORELINE — DUSK. A pale disc rises over the sea. ----
    const drawShotB = (q: number) => {
      const horizon = h * 0.64;

      const sky = ctx.createLinearGradient(0, 0, 0, horizon);
      sky.addColorStop(0, "#08080a");
      sky.addColorStop(1, "#1a191c");
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, w, horizon);

      const sea = ctx.createLinearGradient(0, horizon, 0, h);
      sea.addColorStop(0, "#111013");
      sea.addColorStop(1, "#050506");
      ctx.fillStyle = sea;
      ctx.fillRect(0, horizon, w, h - horizon);

      const dx = w * (0.5 + (q - 0.5) * 0.06);
      const dy = horizon + h * 0.16 - q * h * 0.34;
      const dr = h * 0.085;

      const halo = ctx.createRadialGradient(dx, dy, 0, dx, dy, dr * 6);
      halo.addColorStop(0, "rgba(226, 222, 212, 0.30)");
      halo.addColorStop(0.35, "rgba(226, 222, 212, 0.10)");
      halo.addColorStop(1, "rgba(226, 222, 212, 0)");
      ctx.fillStyle = halo;
      ctx.fillRect(0, 0, w, h);

      // the disc itself only exists above the waterline
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, 0, w, horizon);
      ctx.clip();
      const disc = ctx.createRadialGradient(dx, dy, dr * 0.2, dx, dy, dr);
      disc.addColorStop(0, "rgba(232, 228, 218, 0.95)");
      disc.addColorStop(0.85, "rgba(226, 222, 212, 0.85)");
      disc.addColorStop(1, "rgba(226, 222, 212, 0)");
      ctx.fillStyle = disc;
      ctx.beginPath();
      ctx.arc(dx, dy, dr, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // broken reflection: widening bars of shimmer under the disc
      const glow = dy < horizon ? 1 : 0.35;
      const barH = Math.max(1, h * 0.006);
      for (let i = 0; i < 26; i++) {
        const ry = horizon + ((i + 0.5) / 26) * (h - horizon);
        const spread = (ry - horizon) / (h - horizon);
        const half =
          dr *
          (0.5 + spread * 2.2) *
          (0.7 + 0.3 * Math.sin(i * 2.3 + q * 9));
        const a =
          0.1 * glow * (1 - spread) * (0.6 + 0.4 * Math.sin(i * 1.7 + q * 14));
        if (a <= 0.004) continue;
        ctx.fillStyle = `rgba(226, 222, 212, ${a.toFixed(3)})`;
        ctx.fillRect(dx - half, ry, half * 2, barH);
      }

      // a far headland, screen-left
      ctx.fillStyle = "#040405";
      ctx.beginPath();
      ctx.moveTo(0, horizon);
      ctx.quadraticCurveTo(w * 0.16, horizon - h * 0.035, w * 0.34, horizon);
      ctx.closePath();
      ctx.fill();
    };

    // -- wear pass: dust and scratches, all hashed off the frame number ----
    const drawWear = (f: number) => {
      const life = Math.floor(f / 3); // a scratch survives ~3 frames
      if (hash(life, 5) > 0.8) {
        const sx = hash(life, 6) * w;
        ctx.strokeStyle = "rgba(232, 228, 218, 0.07)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(sx + (hash(f, 8) - 0.5) * 3, 0);
        ctx.lineTo(sx + (hash(f, 9) - 0.5) * 3, h);
        ctx.stroke();
      }
      const n = Math.floor(hash(f, 12) * 4);
      for (let i = 0; i < n; i++) {
        const px = hash(f, 20 + i) * w;
        const py = hash(f, 30 + i) * h;
        const pr = 0.5 + hash(f, 40 + i) * 1.6;
        ctx.fillStyle =
          hash(f, 50 + i) > 0.5
            ? "rgba(232, 228, 218, 0.10)"
            : "rgba(0, 0, 0, 0.35)";
        ctx.beginPath();
        ctx.arc(px, py, pr, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const setHud = (f: number) => {
      if (frameNo) frameNo.textContent = `FR ${String(f).padStart(4, "0")}`;
      if (tc) {
        const s = Math.floor(f / 24);
        const ff = f % 24;
        tc.textContent = `00:00:${String(s).padStart(2, "0")}:${String(
          ff,
        ).padStart(2, "0")}`;
      }
      // the reel-change cue mark lights up just before the reel runs out
      if (cue) cue.style.opacity = shownP > 0.94 ? "1" : "0";
    };

    const draw = () => {
      const p = shownP;
      const f = frameOf(p);
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = "#060607";
      ctx.fillRect(0, 0, w, h);

      // gate weave: the frame sits ~1px loose in the projector gate
      const wv = reduced ? 0 : 1;
      const gx = (hash(f, 11) - 0.5) * 2.4 * wv;
      const gy = (hash(f, 7) - 0.5) * 3.2 * wv;

      ctx.save();
      ctx.translate(gx, gy);
      const qa = Math.min(1, p / 0.55);
      if (p < 0.62) drawShotA(qa);
      if (p > 0.45) {
        const x = Math.min(1, (p - 0.45) / 0.15);
        ctx.globalAlpha = x * x * (3 - 2 * x); // smoothstepped dissolve
        drawShotB(Math.min(1, (p - 0.45) / 0.55));
        ctx.globalAlpha = 1;
      }
      ctx.restore();

      // lamp flicker: per-frame exposure wobble
      const flick = 0.03 + 0.05 * hash(f, 3);
      ctx.fillStyle = `rgba(0, 0, 0, ${flick.toFixed(3)})`;
      ctx.fillRect(0, 0, w, h);

      drawWear(f);

      // grain tiles, re-offset at ~12fps
      ctx.save();
      ctx.globalAlpha = 0.45;
      ctx.globalCompositeOperation = "overlay";
      const ox = -Math.floor(grainX * GRAIN_SIZE);
      const oy = -Math.floor(grainY * GRAIN_SIZE);
      for (let ty = oy; ty < h; ty += GRAIN_SIZE) {
        for (let tx = ox; tx < w; tx += GRAIN_SIZE) {
          ctx.drawImage(grain, tx, ty);
        }
      }
      ctx.restore();

      // vignette
      const vig = ctx.createRadialGradient(
        w / 2,
        h / 2,
        Math.min(w, h) * 0.32,
        w / 2,
        h / 2,
        Math.max(w, h) * 0.72,
      );
      vig.addColorStop(0, "rgba(0, 0, 0, 0)");
      vig.addColorStop(1, "rgba(0, 0, 0, 0.62)");
      ctx.fillStyle = vig;
      ctx.fillRect(0, 0, w, h);
    };

    const step = (now: number) => {
      raf = requestAnimationFrame(step);
      const dt = Math.min(now - last, 48);
      last = now;
      const k = dt / 16.7; // frame-rate normalization
      shownP += (targetPRef.current - shownP) * SCRUB_LERP * k;

      const grainDue = now - lastGrain >= GRAIN_MS;
      const f = frameOf(shownP);
      const moving = Math.abs(targetPRef.current - shownP) > 0.0004;
      if (!grainDue && !moving && f === lastFrameDrawn) return;

      if (grainDue) {
        lastGrain = now;
        grainX = Math.random();
        grainY = Math.random();
      }
      if (f !== lastFrameDrawn) {
        lastFrameDrawn = f;
        setHud(f);
      }
      draw();
    };

    const shouldRun = () => !reduced && visible && !document.hidden;
    const sync = () => {
      if (disposed) return;
      if (shouldRun()) {
        if (!running) {
          running = true;
          last = performance.now();
          raf = requestAnimationFrame(step);
        }
      } else if (running) {
        running = false;
        cancelAnimationFrame(raf);
      }
    };
    const onVisibility = () => sync();

    resize();
    draw(); // first frame now — also the one still frame under reduced motion
    setHud(frameOf(shownP));

    const io = new IntersectionObserver(
      (hits) => {
        visible = hits[hits.length - 1].isIntersecting;
        sync();
      },
      { rootMargin: "120px 0px" },
    );
    io.observe(section);

    const ro = new ResizeObserver(() => {
      resize();
      if (!running) draw();
    });
    ro.observe(frame);

    document.addEventListener("visibilitychange", onVisibility);
    sync();

    return () => {
      disposed = true;
      running = false;
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [reduced]);

  return (
    <section
      className="halflight-reel"
      aria-labelledby="halflight-reel-title"
      ref={sectionRef}
    >
      <div className="halflight-reel__sticky">
        <header className="halflight-reel__head">
          <p className="halflight-sechead__no halflight-mono" aria-hidden="true">
            REEL 02
          </p>
          <h2 className="halflight-sechead" id="halflight-reel-title">
            THE SEQUENCE{" "}
            <span lang="ko" className="halflight-sechead__ko">
              시퀀스
            </span>
          </h2>
          <p className="halflight-reel__slug halflight-mono">
            EXT. SHORELINE — DUSK. <span lang="ko">외부. 해안 — 황혼.</span>
          </p>
        </header>

        <div
          className="halflight-reel__stage"
          role="img"
          aria-label="A procedurally drawn grayscale film sequence, scrubbed by scroll: light through blinds crosses a dark room, then dissolves to a pale disc rising over a night sea, under film grain and scratches. 스크롤로 스크럽하는 절차적 흑백 필름 시퀀스 — 블라인드 사이의 빛이 어두운 방을 건너가고, 밤바다 위로 창백한 원반이 떠오른다. 그레인과 스크래치는 코드로 그렸다."
        >
          <div className="halflight-reel__frame" ref={frameRef}>
            <canvas
              ref={canvasRef}
              className="halflight-reel__canvas"
              aria-hidden="true"
            />
            <div className="halflight-reel__hud halflight-mono" aria-hidden="true">
              <span>REEL 02 · 2.39:1</span>
              <span ref={frameNoRef}>FR 0000</span>
              <span ref={tcRef}>00:00:00:00</span>
            </div>
            <span
              className="halflight-cuedot halflight-cuedot--reel"
              ref={cueRef}
              aria-hidden="true"
            />
          </div>
        </div>

        <p className="halflight-reel__note">
          Scroll is the projector. Hold anywhere; the frame holds with you.{" "}
          <span lang="ko">
            스크롤이 곧 영사기다. 멈추면, 프레임도 함께 멈춘다.
          </span>
        </p>
      </div>
    </section>
  );
}
