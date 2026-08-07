"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import "./styles.css";
import { outfit, notoSansKR } from "./fonts";
import { useReveal } from "./hooks/useReveal";
import { usePrefersReducedMotion } from "./hooks/usePrefersReducedMotion";

const TITLE = "AURORA PAINT";

/** Ribbon hues (mint / violet / cyan / spring) for the additive aurora. */
const RIBBONS = [
  { hue: 158, sat: 92, light: 70 }, // mint
  { hue: 270, sat: 88, light: 72 }, // violet
  { hue: 188, sat: 95, light: 66 }, // cyan
  { hue: 140, sat: 90, light: 74 }, // spring green
];

/**
 * AURORA PAINT 오로라 페인트 — a paint studio whose medium is light. The
 * signature is a canvas aurora: several sine-driven ribbons of additive
 * light (mint / violet / cyan) flow across the canvas using `lighter`
 * compositing so they bloom where they overlap. The pointer adds a brush
 * stroke of light that trails the cursor. Under reduced motion the canvas
 * is composed once at a chosen phase and frozen — a still of light.
 *
 * The wordmark "AURORA PAINT" carries the same spectrum as a clipped text
 * gradient with a soft glow. `.aurora-paint-js` is added on mount so the
 * no-JS markup is the finished page.
 */
export default function AuroraPaintPage() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const reduced = usePrefersReducedMotion();
  const revealRef = useReveal<HTMLDivElement>();
  const stageRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    root.classList.add("aurora-paint-js");
    const id = requestAnimationFrame(() => root.classList.add("is-mounted"));
    window.parent?.postMessage({ type: "oneshot:ready", slug: "aurora-paint" }, "*");
    return () => cancelAnimationFrame(id);
  }, []);

  // Canvas aurora — additive light ribbons + a pointer brush.
  useEffect(() => {
    const canvas = canvasRef.current;
    const stage = stageRef.current;
    if (!canvas || !stage) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const MAX_DPR = 2;
    const EPS = 1;
    let w = 0;
    let h = 0;
    const brush = { x: 0, y: 0, tx: 0, ty: 0, life: 0 }; // pointer trail

    const resize = () => {
      const rect = stage.getBoundingClientRect();
      const ww = Math.max(EPS, rect.width);
      const hh = Math.max(EPS, rect.height);
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      canvas.width = Math.max(1, Math.round(ww * dpr));
      canvas.height = Math.max(1, Math.round(hh * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      w = ww;
      h = hh;
    };

    // Each ribbon: a vertical band swept by a sine, amplitude / speed / phase.
    const ribbons = RIBBONS.map((r, i) => ({
      ...r,
      band: 0.2 + i * 0.18, // vertical center 0..1
      amp: 0.12 + i * 0.05,
      speed: 0.0006 + i * 0.00018,
      phase: i * 1.7,
      thick: 90 + i * 26,
    }));

    let raf = 0;
    let t0 = performance.now();
    let running = false;
    let visible = false;

    const draw = (now: number) => {
      const t = now - t0;
      // Low-alpha clear leaves a soft trail so the light blooms.
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = "rgba(6, 10, 16, 0.16)";
      ctx.fillRect(0, 0, w, h);

      // Additive light — where ribbons overlap they brighten.
      ctx.globalCompositeOperation = "lighter";
      for (const rb of ribbons) {
        const yc = rb.band * h;
        const amp = rb.amp * h;
        ctx.beginPath();
        for (let x = -20; x <= w + 20; x += 8) {
          const nx = x / Math.max(EPS, w);
          const y =
            yc +
            Math.sin(nx * Math.PI * 2.4 + t * rb.speed * 1000 + rb.phase) * amp +
            Math.sin(nx * Math.PI * 5.1 + t * rb.speed * 600) * amp * 0.32;
          if (!Number.isFinite(y)) continue;
          if (x === -20) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        const grad = ctx.createLinearGradient(0, yc - amp, 0, yc + amp);
        const lw = Math.max(EPS, rb.thick);
        grad.addColorStop(0, `hsla(${rb.hue}, ${rb.sat}%, ${rb.light}%, 0)`);
        grad.addColorStop(0.5, `hsla(${rb.hue}, ${rb.sat}%, ${rb.light}%, 0.5)`);
        grad.addColorStop(1, `hsla(${rb.hue}, ${rb.sat}%, ${rb.light}%, 0)`);
        ctx.strokeStyle = grad;
        ctx.lineWidth = lw;
        ctx.lineCap = "round";
        ctx.shadowBlur = 40;
        ctx.shadowColor = `hsla(${rb.hue}, ${rb.sat}%, ${rb.light}%, 0.7)`;
        ctx.stroke();
      }
      ctx.shadowBlur = 0;

      // Pointer brush stroke of light — trails the cursor with inertia.
      brush.x += (brush.tx - brush.x) * 0.18;
      brush.y += (brush.ty - brush.y) * 0.18;
      brush.life = Math.max(0, brush.life - 0.02);
      if (brush.life > 0 && Number.isFinite(brush.x) && Number.isFinite(brush.y)) {
        const rad = Math.max(EPS, 120 * brush.life);
        const g = ctx.createRadialGradient(brush.x, brush.y, 0, brush.x, brush.y, rad);
        g.addColorStop(0, "hsla(160, 95%, 78%, 0.55)");
        g.addColorStop(0.5, "hsla(190, 90%, 70%, 0.22)");
        g.addColorStop(1, "hsla(270, 80%, 72%, 0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(brush.x, brush.y, rad, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalCompositeOperation = "source-over";
    };

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      draw(now);
    };
    const start = () => {
      if (running) return;
      running = true;
      t0 = performance.now();
      raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    const compose = () => {
      // Reduced-motion still: paint a few frames at a fixed phase, then freeze.
      resize();
      for (let k = 0; k < 28; k++) draw(t0 + k * 32);
    };

    resize();
    if (reduced) compose();
    else start();

    const ro = new ResizeObserver(() => {
      resize();
      if (reduced) compose();
    });
    ro.observe(stage);
    const io = new IntersectionObserver(
      (hits) => {
        visible = hits[hits.length - 1].isIntersecting;
        if (visible && !document.hidden && !reduced) start();
        else stop();
      },
      { rootMargin: "80px 0px" },
    );
    io.observe(stage);
    const onVis = () => {
      if (document.hidden) stop();
      else if (visible && !reduced) start();
    };
    document.addEventListener("visibilitychange", onVis);

    const onMove = (ev: PointerEvent) => {
      if (reduced) return;
      const rect = stage.getBoundingClientRect();
      if (rect.width < EPS) return;
      const nx = ev.clientX - rect.left;
      const ny = ev.clientY - rect.top;
      if (Number.isFinite(nx) && Number.isFinite(ny)) {
        brush.tx = nx;
        brush.ty = ny;
        brush.life = 1;
      }
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("pointermove", onMove);
    };
  }, [reduced]);

  return (
    <div ref={rootRef} className={`${outfit.variable} ${notoSansKR.variable} aurora-paint-root`}>
      <div ref={stageRef} className="aurora-paint-stage" aria-hidden="true">
        <canvas ref={canvasRef} className="aurora-paint-canvas" />
      </div>
      <div ref={revealRef} className="aurora-paint-doc">
        <header className="aurora-paint-hero">
          <p className="aurora-paint-kicker">
            <span lang="ko">오로라 페인트</span> · A STUDIO OF LIGHT · 2026
          </p>
          <h1 className="aurora-paint-title" aria-label={TITLE}>
            <span className="aurora-paint-foil" aria-hidden="true">
              {TITLE.split("").map((ch, i) => (
                <span key={i} className="aurora-paint-glyph" style={{ "--ap-i": i } as CSSProperties}>
                  {ch === " " ? "\u00A0" : ch}
                </span>
              ))}
            </span>
          </h1>
          <p className="aurora-paint-title__ko" lang="ko">오로라 페인트</p>
          <p className="aurora-paint-sub">
            <span lang="ko">빛을 칠하다.</span> Paint made of light.
          </p>
          <p className="aurora-paint-hint" lang="ko">움직여 보세요 — 빛이 당신을 따라 칠해집니다.</p>
        </header>

        <main>
          <section className="aurora-paint-grid">
            {[
              { ko: "민트 글로우", en: "Mint glow", n: "01" },
              { ko: "바이올렛 리본", en: "Violet ribbon", n: "02" },
              { ko: "시안 브러시", en: "Cyan brush", n: "03" },
            ].map((c, i) => (
              <article
                key={i}
                className="aurora-paint-card"
                data-reveal
                style={{ "--ap-d": i * 90 } as CSSProperties}
              >
                <span className="aurora-paint-card__n">{c.n}</span>
                <span className="aurora-paint-card__en">{c.en}</span>
                <span className="aurora-paint-card__ko" lang="ko">{c.ko}</span>
              </article>
            ))}
          </section>

          <section className="aurora-paint-lead" data-reveal>
            <p className="aurora-paint-lead__p">
              <span lang="ko">
                우리는 페인트를 팔지 않는다. 빛을 칠한다. 가산 혼합으로 —
                겹치는 곳마다 밝아지고, 흐르는 곳마다 색이 된다.
              </span>{" "}
              We don't sell paint. We paint light. By the law of addition —
              where the ribbons overlap it brightens, where they flow it becomes
              color.
            </p>
          </section>
        </main>

        <footer className="aurora-paint-foot">
          <span>AURORA PAINT · 2026</span>
          <span lang="ko">오로라 페인트 — 서울</span>
        </footer>
      </div>
    </div>
  );
}
