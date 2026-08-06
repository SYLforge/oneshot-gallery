"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import "./styles.css";
import { outfit, notoSansKR } from "./fonts";
import { useReveal } from "./hooks/useReveal";
import { usePrefersReducedMotion } from "./hooks/usePrefersReducedMotion";

const TITLE = "NEBULA";

/** Warm hues (amber / coral / gold / rose) — deliberately NOT blue. */
const WARM = [
  { r: 255, g: 179, b: 71 }, // amber
  { r: 255, g: 110, b: 90 }, // coral
  { r: 255, g: 206, b: 84 }, // gold
  { r: 255, g: 130, b: 160 }, // rose
  { r: 255, g: 159, b: 60 }, // tangerine
];

/**
 * NEBULA WARM 따뜻한 성운 — a warm-toned generative nebula. The signature is
 * a canvas 2D particle field: a few hundred soft glowing points in amber,
 * coral, gold and rose (NOT blue) that drift and breathe, drawn with additive
 * `lighter` compositing so they bloom where they cluster. Pointer parallax
 * tilts the whole field (a subtle perspective shift via a CSS transform on the
 * canvas wrapper, lerped + capped). All canvas math is NaN-guarded: dimensions
 * are clamped with Math.max and every interpolated value is checked with
 * Number.isFinite before use.
 *
 * Under reduced motion the field is composed once at a chosen phase and frozen.
 * `.nebula-warm-js` is added on mount so the no-JS markup is the finished page.
 */
export default function NebulaWarmPage() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const reduced = usePrefersReducedMotion();
  const revealRef = useReveal<HTMLDivElement>();
  const stageRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    root.classList.add("nebula-warm-js");
    const id = requestAnimationFrame(() => root.classList.add("is-mounted"));
    window.parent?.postMessage({ type: "oneshot:ready", slug: "nebula-warm" }, "*");
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const stage = stageRef.current;
    if (!canvas || !stage) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const MAX_DPR = 2;
    const EPS = 1;
    const COUNT = 320;
    const MAX_TILT = 0.14;
    let w = 0;
    let h = 0;

    type P = { x: number; y: number; r: number; c: number; vx: number; vy: number; ph: number; tw: number };
    let particles: P[] = [];

    const seed = () => {
      particles = [];
      for (let i = 0; i < COUNT; i++) {
        const c = Math.floor(Math.random() * WARM.length);
        particles.push({
          x: Math.random(),
          y: Math.random(),
          r: 0.6 + Math.random() * 2.8,
          c,
          vx: (Math.random() - 0.5) * 0.0004,
          vy: (Math.random() - 0.5) * 0.0004,
          ph: Math.random() * Math.PI * 2,
          tw: 0.4 + Math.random() * 1.2, // twinkle speed
        });
      }
    };

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

    let t = 0;
    let raf = 0;
    let running = false;
    let visible = false;
    let tiltX = 0;
    let tiltY = 0;
    let targetTiltX = 0;
    let targetTiltY = 0;

    const draw = (dtMs: number) => {
      t += dtMs / 1000;
      // Slow fade leaves a soft trail so the field blooms.
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = "rgba(22, 10, 5, 0.14)";
      ctx.fillRect(0, 0, w, h);

      ctx.globalCompositeOperation = "lighter";
      for (const p of particles) {
        p.x += p.vx * dtMs;
        p.y += p.vy * dtMs;
        if (p.x < -0.05) p.x = 1.05;
        if (p.x > 1.05) p.x = -0.05;
        if (p.y < -0.05) p.y = 1.05;
        if (p.y > 1.05) p.y = -0.05;

        const px = p.x * w;
        const py = p.y * h;
        if (!Number.isFinite(px) || !Number.isFinite(py)) continue;
        const twinkle = 0.5 + 0.5 * Math.sin(t * p.tw + p.ph);
        const rad = Math.max(EPS, p.r * (0.8 + twinkle * 0.6) * 3);
        const col = WARM[p.c];
        const alpha = 0.18 + twinkle * 0.42;
        const g = ctx.createRadialGradient(px, py, 0, px, py, rad);
        g.addColorStop(0, `rgba(${col.r}, ${col.g}, ${col.b}, ${alpha})`);
        g.addColorStop(0.5, `rgba(${col.r}, ${col.g}, ${col.b}, ${alpha * 0.4})`);
        g.addColorStop(1, `rgba(${col.r}, ${col.g}, ${col.b}, 0)`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(px, py, rad, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalCompositeOperation = "source-over";

      // Lerp the tilt toward target for smooth parallax.
      tiltX += (targetTiltX - tiltX) * 0.08;
      tiltY += (targetTiltY - tiltY) * 0.08;
      if (Number.isFinite(tiltX) && Number.isFinite(tiltY)) {
        stage.style.setProperty("--nw-rx", `${(tiltY * 6).toFixed(2)}deg`);
        stage.style.setProperty("--nw-ry", `${(tiltX * 8).toFixed(2)}deg`);
      }
    };

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(48, now - lastT); // clamp huge frame gaps
      lastT = now;
      draw(dt);
    };
    let lastT = performance.now();
    const start = () => {
      if (running) return;
      running = true;
      lastT = performance.now();
      raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };
    const compose = () => {
      resize();
      for (let k = 0; k < 30; k++) draw(16);
    };

    seed();
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
      const nx = (ev.clientX - rect.left) / rect.width - 0.5;
      const ny = (ev.clientY - rect.top) / rect.height - 0.5;
      if (!Number.isFinite(nx) || !Number.isFinite(ny)) return;
      targetTiltX = Math.max(-MAX_TILT, Math.min(MAX_TILT, nx * 0.9));
      targetTiltY = Math.max(-MAX_TILT, Math.min(MAX_TILT, ny * 0.9));
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
    <div ref={rootRef} className={`${outfit.variable} ${notoSansKR.variable} nebula-warm-root`}>
      <div ref={stageRef} className="nebula-warm-stage" aria-hidden="true">
        <canvas ref={canvasRef} className="nebula-warm-canvas" />
      </div>
      <div ref={revealRef} className="nebula-warm-doc">
        <header className="nebula-warm-hero">
          <p className="nebula-warm-kicker">
            <span lang="ko">따뜻한 성운</span> · THE WARM SPECTRUM · 2026
          </p>
          <h1 className="nebula-warm-title" aria-label={TITLE}>
            <span className="nebula-warm-foil" aria-hidden="true">
              {TITLE.split("").map((ch, i) => (
                <span key={i} className="nebula-warm-glyph" style={{ "--nw-i": i } as CSSProperties}>
                  {ch}
                </span>
              ))}
            </span>
          </h1>
          <p className="nebula-warm-title__ko" lang="ko">따뜻한 성운</p>
          <p className="nebula-warm-sub">
            <span lang="ko">온기의 스펙트럼.</span> The warm spectrum.
          </p>
          <p className="nebula-warm-hint" lang="ko">움직여 보세요 — 따뜻한 별빛이 기웁니다.</p>
        </header>

        <main>
          <section className="nebula-warm-grid">
            {[
              { ko: "앰버 글로우", en: "Amber glow", n: "01" },
              { ko: "코랄 먼지", en: "Coral dust", n: "02" },
              { ko: "로즈 잔광", en: "Rose ember", n: "03" },
            ].map((c, i) => (
              <article
                key={i}
                className="nebula-warm-card"
                data-reveal
                style={{ "--nw-d": i * 90 } as CSSProperties}
              >
                <span className="nebula-warm-card__n">{c.n}</span>
                <span className="nebula-warm-card__en">{c.en}</span>
                <span className="nebula-warm-card__ko" lang="ko">{c.ko}</span>
              </article>
            ))}
          </section>

          <section className="nebula-warm-lead" data-reveal>
            <p className="nebula-warm-lead__p">
              <span lang="ko">
                우리는 차가운 우주에 따뜻한 장을 그린다. 앰버와 코랄, 골드와 로즈 —
                온기만의 스펙트럼으로 별빛을 다시 입힌다.
              </span>{" "}
              We paint a warm field in a cold universe. Amber and coral, gold and
              rose — reclothing the starlight in the spectrum of warmth alone.
            </p>
          </section>
        </main>

        <footer className="nebula-warm-foot">
          <span>NEBULA WARM · 2026</span>
          <span lang="ko">따뜻한 성운 — 서울</span>
        </footer>
      </div>
    </div>
  );
}
