"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import "./styles.css";
import { syne, notoSansKR } from "./fonts";
import { useReveal } from "./hooks/useReveal";
import { usePrefersReducedMotion } from "./hooks/usePrefersReducedMotion";

const TITLE = "PRISM GLAZE";
const CHIPS = [
  { ko: "굴절률 1.52", en: "Refractive index 1.52" },
  { ko: "두께 0.4mm", en: "Thickness 0.4mm" },
  { ko: "오로라 워시", en: "Aurora wash" },
  { ko: "스펙큘러 트래킹", en: "Specular tracking" },
];

/**
 * PRISM GLAZE 프리즘 글레이즈 — a liquid-glass house. The signature is a panel
 * material: backdrop-filter glass over a drifting aurora wash, with a specular
 * highlight that follows the pointer (the surface is a lens that remembers
 * light). The wordmark is a beveled glass cut — hairline above, bold below,
 * split per glyph and revealed on scroll.
 *
 * `.prism-glaze-js` is added on mount so the no-JS markup is the finished
 * page: panels are solid, the aurora is a static gradient, the wordmark sits.
 */
export default function PrismGlazePage() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const reduced = usePrefersReducedMotion();
  const revealRef = useReveal<HTMLDivElement>();
  const stageRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    root.classList.add("prism-glaze-js");
    // Defer one frame so the glyph pre-state (opacity 0) applies before reveal.
    const id = requestAnimationFrame(() => root.classList.add("is-mounted"));
    window.parent?.postMessage({ type: "oneshot:ready", slug: "prism-glaze" }, "*");
    return () => cancelAnimationFrame(id);
  }, []);

  // Specular highlight: write the pointer position as CSS vars on the stage
  // so each glass panel's ::before highlight follows the cursor. Lerped +
  // gated off under reduced motion (the highlight then sits top-left, static).
  useEffect(() => {
    if (reduced) return;
    const stage = stageRef.current;
    if (!stage) return;
    let raf = 0;
    let tx = 0.3;
    let ty = 0.25;
    let cx = tx;
    let cy = ty;
    const onMove = (e: PointerEvent) => {
      const r = stage.getBoundingClientRect();
      tx = (e.clientX - r.left) / r.width;
      ty = (e.clientY - r.top) / r.height;
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const tick = () => {
      cx += (tx - cx) * 0.12;
      cy += (ty - cy) * 0.12;
      stage.style.setProperty("--pg-x", cx.toFixed(3));
      stage.style.setProperty("--pg-y", cy.toFixed(3));
      if (Math.abs(tx - cx) > 0.001 || Math.abs(ty - cy) > 0.001) {
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
    <div
      ref={rootRef}
      className={`${syne.variable} ${notoSansKR.variable} prism-glaze-root`}
    >
      <div ref={revealRef} className="prism-glaze-doc">
        <header className="prism-glaze-hero">
          <div className="prism-glaze-aurora" aria-hidden="true" />
          <p className="prism-glaze-kicker">
            <span lang="ko">액체 유리 하우스</span> · LIQUID GLASS HOUSE · 서울
          </p>
          <h1 className="prism-glaze-title" aria-label={TITLE}>
            {TITLE.split("").map((ch, i) => (
              <span
                key={i}
                aria-hidden="true"
                className={ch === " " ? "prism-glaze-glyph prism-glaze-glyph--space" : "prism-glaze-glyph"}
                style={{ "--pg-i": i } as CSSProperties}
              >
                {ch}
              </span>
            ))}
          </h1>
          <p className="prism-glaze-title__ko" lang="ko">프리즘 글레이즈</p>
          <p className="prism-glaze-sub">
            <span lang="ko">유리를 붓듯.</span> Glass, poured.
          </p>
        </header>

        <main>
          <section ref={stageRef} className="prism-glaze-stage" data-reveal>
            <article className="prism-glaze-panel prism-glaze-panel--lg">
              <h2 className="prism-glaze-panel__h">
                <span lang="ko">빛을 굴절하는 패널.</span> A panel that bends light.
              </h2>
              <p className="prism-glaze-panel__p">
                <span lang="ko">
                  면 위를 흐르는 오로라 워시. 포인터를 따라 움직이는 하이라이트.
                  패널은 렌즈다 — 보는 각도마다 다른 색.
                </span>{" "}
                An aurora wash drifts across the surface; a highlight tracks the
                pointer. The panel is a lens — a different color at every angle.
              </p>
            </article>

            <div className="prism-glaze-grid">
              {CHIPS.map((c, i) => (
                <article
                  key={i}
                  className="prism-glaze-panel prism-glaze-panel--chip"
                  style={{ "--pg-d": i * 90 } as CSSProperties}
                >
                  <span className="prism-glaze-chip__en">{c.en}</span>
                  <span className="prism-glaze-chip__ko" lang="ko">{c.ko}</span>
                </article>
              ))}
            </div>
          </section>

          <section className="prism-glaze-lead" data-reveal>
            <p className="prism-glaze-lead__p">
              <span lang="ko">
                우리는 인터페이스를 재료로 생각한다 — 두께, 굴절률, 빛. 화면을
                유리로 부어, 손가락이 닿는 자리마다 작은 무지개가 인다.
              </span>{" "}
              We think of interface as material — thickness, index, light. We pour
              the screen as glass, and where a finger lands, a small rainbow blooms.
            </p>
          </section>
        </main>

        <footer className="prism-glaze-foot">
          <span>PRISM GLAZE · 2026</span>
          <span lang="ko">프리즘 글레이즈 — 서울 성수</span>
        </footer>
      </div>
    </div>
  );
}
