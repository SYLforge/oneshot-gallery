"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import "./styles.css";
import { orbitron, notoSansKR } from "./fonts";
import { useReveal } from "./hooks/useReveal";
import { usePrefersReducedMotion } from "./hooks/usePrefersReducedMotion";

const TITLE = "CYBER GRID";

/**
 * CYBER GRID 사이버 그리드 — a cyberpunk HUD interface. The signature is a
 * perspective CSS grid floor: a repeating-linear-gradient of cyan/green lines
 * on a tilted plane (perspective + rotateX) that recedes to a vanishing point,
 * with the lines slowly scrolling toward the viewer for motion. HUD corner
 * brackets frame the hero and a repeating-linear-gradient scan-line overlay
 * sits over everything (CRT). The wordmark "CYBER GRID" is cyan with a cyan
 * glow and a red/blue chromatic offset. The pointer adds a gentle parallax to
 * the grid + brackets (input-only, lerped).
 *
 * `.cyber-grid-js` is added on mount so the no-JS markup is the finished page.
 */
export default function CyberGridPage() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const reduced = usePrefersReducedMotion();
  const revealRef = useReveal<HTMLDivElement>();
  const stageRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    root.classList.add("cyber-grid-js");
    const id = requestAnimationFrame(() => root.classList.add("is-mounted"));
    window.parent?.postMessage({ type: "oneshot:ready", slug: "cyber-grid" }, "*");
    return () => cancelAnimationFrame(id);
  }, []);

  // Pointer parallax — grid + HUD lean gently toward the cursor (input-only).
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || reduced) return;
    let raf = 0;
    let tx = 0;
    let ty = 0;
    let cx = 0;
    let cy = 0;
    const onMove = (ev: PointerEvent) => {
      const r = stage.getBoundingClientRect();
      if (r.width < 4) return;
      tx = ((ev.clientX - r.left) / r.width - 0.5) * 2; // -1..1
      ty = ((ev.clientY - r.top) / r.height - 0.5) * 2;
      if (!Number.isFinite(tx) || !Number.isFinite(ty)) return;
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const tick = () => {
      cx += (tx - cx) * 0.08;
      cy += (ty - cy) * 0.08;
      stage.style.setProperty("--cg-rx", `${(cy * -4).toFixed(2)}deg`);
      stage.style.setProperty("--cg-ry", `${(cx * 6).toFixed(2)}deg`);
      if (Math.abs(tx - cx) > 0.01 || Math.abs(ty - cy) > 0.01) {
        raf = requestAnimationFrame(tick);
      } else {
        raf = 0;
      }
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [reduced]);

  return (
    <div ref={rootRef} className={`${orbitron.variable} ${notoSansKR.variable} cyber-grid-root`}>
      <div className="cyber-grid-bg" aria-hidden="true">
        <div ref={stageRef} className="cyber-grid-floor" />
        <div className="cyber-grid-haze" />
      </div>
      <div className="cyber-grid-scan" aria-hidden="true" />

      <div ref={revealRef} className="cyber-grid-doc">
        <header className="cyber-grid-hero">
          <div className="cyber-grid-hud" aria-hidden="true">
            <span className="cyber-grid-corner cyber-grid-corner--tl" />
            <span className="cyber-grid-corner cyber-grid-corner--tr" />
            <span className="cyber-grid-corner cyber-grid-corner--bl" />
            <span className="cyber-grid-corner cyber-grid-corner--br" />
          </div>
          <p className="cyber-grid-kicker">
            <span lang="ko">사이버 그리드</span> · THE FUTURE AS HUD · 2026
          </p>
          <h1 className="cyber-grid-title" aria-label={TITLE}>
            <span className="cyber-grid-chroma" aria-hidden="true">
              {TITLE.split("").map((ch, i) => (
                <span key={i} className="cyber-grid-glyph" style={{ "--cg-i": i } as CSSProperties}>
                  {ch === " " ? "\u00A0" : ch}
                </span>
              ))}
            </span>
          </h1>
          <p className="cyber-grid-title__ko" lang="ko">사이버 그리드</p>
          <p className="cyber-grid-sub">
            <span lang="ko">HUD 미래.</span> The future as HUD.
          </p>
          <p className="cyber-grid-hint" lang="ko">SYS.ONLINE — 시스템 정상 작동 중.</p>
        </header>

        <main>
          <section className="cyber-grid-grid">
            {[
              { ko: "원근 그리드", en: "Perspective grid", n: "01" },
              { ko: "스캔라인", en: "Scan-line", n: "02" },
              { ko: "색수차 글로우", en: "Chroma glow", n: "03" },
            ].map((c, i) => (
              <article
                key={i}
                className="cyber-grid-card"
                data-reveal
                style={{ "--cg-d": i * 90 } as CSSProperties}
              >
                <span className="cyber-grid-card__n">{c.n}</span>
                <span className="cyber-grid-card__en">{c.en}</span>
                <span className="cyber-grid-card__ko" lang="ko">{c.ko}</span>
              </article>
            ))}
          </section>

          <section className="cyber-grid-lead" data-reveal>
            <p className="cyber-grid-lead__p">
              <span lang="ko">
                우리는 화면이 아니라 인터페이스를 그린다. 원근의 선이 소실점으로
                달리고, 스캔라인이 위를 흐른다 — 미래는 곧 HUD다.
              </span>{" "}
              We don't draw a screen, we draw an interface. Perspective lines run
              to the vanishing point, scan-lines flow overhead — the future is a
              HUD.
            </p>
          </section>
        </main>

        <footer className="cyber-grid-foot">
          <span>CYBER GRID · 2026</span>
          <span lang="ko">사이버 그리드 — 서울</span>
        </footer>
      </div>
    </div>
  );
}
