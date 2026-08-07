"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import "./styles.css";
import { baloo2, gowunDodum } from "./fonts";
import { useReveal } from "./hooks/useReveal";
import { usePrefersReducedMotion } from "./hooks/usePrefersReducedMotion";

const TITLE = "CLAY";

/**
 * CLAY 클레이 — a 3D-clay product studio on warm cream. The signature is
 * claymorphism: surfaces built from layered box-shadows (a soft inset top
 * highlight + a chunky dark drop) that SQUASH on press to 0.96 with a
 * spring transition (`cubic-bezier(0.34, 1.56, 0.64, 1)` overshoot on
 * release). The pointer adds a gentle parallax tilt to the cards. The
 * wordmark "CLAY" is extruded clay — stacked same-color offset shadows
 * plus an inset top highlight and a darker stroke.
 *
 * `.clay-js` is added on mount so the no-JS markup is the finished page.
 */
export default function ClayPage() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const reduced = usePrefersReducedMotion();
  const revealRef = useReveal<HTMLDivElement>();
  const stageRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    root.classList.add("clay-js");
    const id = requestAnimationFrame(() => root.classList.add("is-mounted"));
    window.parent?.postMessage({ type: "oneshot:ready", slug: "clay" }, "*");
    return () => cancelAnimationFrame(id);
  }, []);

  // Pointer parallax — cards lean gently toward the cursor (input-only).
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || reduced) return;
    let raf = 0;
    const onMove = (ev: PointerEvent) => {
      const r = stage.getBoundingClientRect();
      if (r.width < 4) return;
      const nx = (ev.clientX - r.left) / r.width - 0.5; // -0.5..0.5
      const ny = (ev.clientY - r.top) / r.height - 0.5;
      if (!Number.isFinite(nx) || !Number.isFinite(ny)) return;
      stage.style.setProperty("--cy-px", `${(nx * 10).toFixed(1)}`);
      stage.style.setProperty("--cy-py", `${(ny * 10).toFixed(1)}`);
      if (!raf) raf = requestAnimationFrame(() => { raf = 0; });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [reduced]);

  return (
    <div ref={rootRef} className={`${baloo2.variable} ${gowunDodum.variable} clay-root`}>
      <div className="clay-bg" aria-hidden="true" />
      <div ref={revealRef} className="clay-doc">
        <header ref={stageRef} className="clay-hero">
          <p className="clay-kicker">
            <span lang="ko">클레이 스튜디오</span> · SHAPES YOU SCULPT · 2026
          </p>
          <h1 className="clay-title" aria-label={TITLE}>
            <span className="clay-extrude" aria-hidden="true">
              {TITLE.split("").map((ch, i) => (
                <span key={i} className="clay-glyph" style={{ "--cy-i": i } as CSSProperties}>
                  {ch}
                </span>
              ))}
            </span>
          </h1>
          <p className="clay-title__ko" lang="ko">클레이</p>
          <p className="clay-sub">
            <span lang="ko">빚는 형태.</span> Shapes you sculpt.
          </p>
          <p className="clay-hint" lang="ko">눌러 보세요 — 쫀득하게 눌립니다.</p>
        </header>

        <main>
          <section className="clay-grid">
            {[
              { ko: "부드러운 둥근 모서리", en: "Soft rounded edges", n: "01" },
              { ko: "인셋 하이라이트", en: "Inset highlight", n: "02" },
              { ko: "스프링 눌림", en: "Spring press", n: "03" },
            ].map((c, i) => (
              <article
                key={i}
                className="clay-card clay-press"
                data-reveal
                style={{ "--cy-d": i * 90 } as CSSProperties}
              >
                <span className="clay-card__n">{c.n}</span>
                <span className="clay-card__en">{c.en}</span>
                <span className="clay-card__ko" lang="ko">{c.ko}</span>
              </article>
            ))}
          </section>

          <section className="clay-actions" data-reveal>
            <button type="button" className="clay-btn clay-press">
              <span lang="ko">만들기</span> · Sculpt
            </button>
            <button type="button" className="clay-btn clay-btn--ghost clay-press">
              <span lang="ko">굽기</span> · Bake
            </button>
          </section>

          <section className="clay-lead" data-reveal>
            <p className="clay-lead__p">
              <span lang="ko">
                우리는 형태를 만들지 않는다. 빚는다. 손끝의 힘으로 —
                누르면 쫀득하고, 놓으면 도로 부풀어 오르는 부드러운 물질.
              </span>{" "}
              We don't make forms. We sculpt them. By the hand — a soft matter
              that squishes when pressed and puffs back when let go.
            </p>
          </section>
        </main>

        <footer className="clay-foot">
          <span>CLAY · 2026</span>
          <span lang="ko">클레이 — 서울</span>
        </footer>
      </div>
    </div>
  );
}
