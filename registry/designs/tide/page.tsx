"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import "./styles.css";
import { unbounded, notoSansKR } from "./fonts";
import { useReveal } from "./hooks/useReveal";
import { usePrefersReducedMotion } from "./hooks/usePrefersReducedMotion";

const TITLE = "TIDE";

/**
 * TIDE 조류 — a liquid-motion studio. The signature is a metaball field drawn
 * on canvas 2D: a handful of liquid blobs that orbit, merge, and pull toward
 * the pointer. The blobs are drawn as soft radial gradients over an additive
 * threshold, so overlaps bloom into one body of water. Under reduced motion
 * the field is a single composed swell (a still you can read).
 *
 * `.tide-js` is added on mount so the no-JS markup is the finished page: the
 * field is a CSS gradient understudy, the wordmark sits, copy is readable.
 */
export default function TidePage() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const reduced = usePrefersReducedMotion();
  const revealRef = useReveal<HTMLDivElement>();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    root.classList.add("tide-js");
    const id = requestAnimationFrame(() => root.classList.add("is-mounted"));
    window.parent?.postMessage({ type: "oneshot:ready", slug: "tide" }, "*");
    return () => cancelAnimationFrame(id);
  }, []);

  // Metaball liquid field. A few orbiting blobs + one that follows the pointer.
  // Drawn as stacked radial gradients with 'lighter' compositing so overlaps
  // bloom; a vignette keeps the edge calm.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const COLORS = ["#37e2c5", "#2ec0ff", "#5d8bff", "#9b6bff"];
    let w = 0;
    let h = 0;
    let dpr = 1;
    const blobs: { x: number; y: number; r: number; phase: number; speed: number; ax: number; ay: number; ci: number }[] = [];
    const N = 7;
    for (let i = 0; i < N; i++) {
      blobs.push({
        x: 0, y: 0,
        r: 60 + Math.random() * 80,
        phase: Math.random() * Math.PI * 2,
        speed: 0.18 + Math.random() * 0.22,
        ax: 0.5 + Math.random() * 0.5,
        ay: 0.4 + Math.random() * 0.5,
        ci: i % COLORS.length,
      });
    }
    const ptr = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      ptr.tx = (e.clientX - rect.left) / rect.width;
      ptr.ty = (e.clientY - rect.top) / rect.height;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("resize", resize);

    let raf = 0;
    let t = 0;
    let last = performance.now();
    const draw = (now: number) => {
      raf = requestAnimationFrame(draw);
      const dt = Math.min(48, now - last) / 1000;
      last = now;
      t += dt;

      // pointer-follow blob eases toward target; others orbit.
      ptr.x += (ptr.tx - ptr.x) * 0.06;
      ptr.y += (ptr.ty - ptr.y) * 0.06;

      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = "#04101a";
      ctx.fillRect(0, 0, w, h);

      ctx.globalCompositeOperation = "lighter";
      for (let i = 0; i < blobs.length; i++) {
        const b = blobs[i];
        if (i === 0 && !reduced) {
          // pointer blob
          b.x = ptr.x * w;
          b.y = ptr.y * h;
        } else {
          b.phase += b.speed * dt * (reduced ? 0 : 1);
          b.x = w * (0.5 + Math.cos(b.phase) * 0.34 * b.ax);
          b.y = h * (0.5 + Math.sin(b.phase * 0.8 + i) * 0.34 * b.ay);
        }
        const r = b.r * (1 + 0.12 * Math.sin(t * 1.2 + i));
        const grad = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, r * 2.1);
        const c = COLORS[b.ci];
        grad.addColorStop(0, hexA(c, 0.9));
        grad.addColorStop(0.4, hexA(c, 0.5));
        grad.addColorStop(1, hexA(c, 0));
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(b.x, b.y, r * 2.1, 0, Math.PI * 2);
        ctx.fill();
      }

      // edge vignette so the liquid pools in the center.
      ctx.globalCompositeOperation = "source-over";
      const vg = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.2, w / 2, h / 2, Math.max(w, h) * 0.75);
      vg.addColorStop(0, "rgba(4,16,26,0)");
      vg.addColorStop(1, "rgba(4,16,26,0.86)");
      ctx.fillStyle = vg;
      ctx.fillRect(0, 0, w, h);
    };
    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", resize);
    };
  }, [reduced]);

  return (
    <div ref={rootRef} className={`${unbounded.variable} ${notoSansKR.variable} tide-root`}>
      <canvas ref={canvasRef} className="tide-field" aria-hidden="true" />
      <div className="tide-scrim" aria-hidden="true" />
      <div ref={revealRef} className="tide-doc">
        <header className="tide-hero">
          <p className="tide-kicker">
            <span lang="ko">액체 모션 스튜디오</span> · LIQUID MOTION STUDIO
          </p>
          <h1 className="tide-title" aria-label={TITLE}>
            {TITLE.split("").map((ch, i) => (
              <span
                key={i}
                aria-hidden="true"
                className="tide-glyph"
                style={{ "--td-i": i } as CSSProperties}
              >
                {ch}
              </span>
            ))}
          </h1>
          <p className="tide-title__ko" lang="ko">조류</p>
          <p className="tide-sub">
            <span lang="ko">흐르는 것을 위한 스튜디오.</span> A studio for things that flow.
          </p>
          <p className="tide-hint" lang="ko">움직여 보세요 — 물이 당신을 따라옵니다.</p>
        </header>

        <main>
          <section className="tide-lead" data-reveal>
            <p className="tide-lead__p">
              <span lang="ko">
                조류는 밀고 당기는 힘이다. 우리는 인터페이스를 액체로 생각한다 —
                합쳤다가 갈라지고, 손가락을 따라 모이고, 멈추면 잔잔한 호수가 된다.
              </span>{" "}
              A tide is a push and pull. We think of interface as liquid — merging
              and parting, gathering toward the finger, settling into a still lake
              when at rest.
            </p>
          </section>

          <section className="tide-cards">
            {[
              { ko: "유변", en: "Rheology", n: "01" },
              { ko: "표면장력", en: "Surface tension", n: "02" },
              { ko: "파동", en: "Wave", n: "03" },
            ].map((c, i) => (
              <article key={i} className="tide-card" data-reveal style={{ "--td-d": i * 90 } as CSSProperties}>
                <span className="tide-card__n">{c.n}</span>
                <span className="tide-card__en">{c.en}</span>
                <span className="tide-card__ko" lang="ko">{c.ko}</span>
              </article>
            ))}
          </section>
        </main>

        <footer className="tide-foot">
          <span>TIDE · 2026</span>
          <span lang="ko">조류 — 부산 해운대</span>
        </footer>
      </div>
    </div>
  );
}

/** hex (#rrggbb) -> rgba() with alpha. */
function hexA(hex: string, a: number): string {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${a})`;
}
