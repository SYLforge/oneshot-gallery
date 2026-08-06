"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import "./styles.css";
import { sora, notoSansKR } from "./fonts";
import { useReveal } from "./hooks/useReveal";
import { usePrefersReducedMotion } from "./hooks/usePrefersReducedMotion";

const TITLE = "MESH";

/**
 * MESH 메쉬 — a gradient studio. The signature is an animated CSS mesh: five
 * large radial color blobs (coral, violet, teal, gold, magenta) on a dark
 * backdrop, each drifting on its own @keyframes so the field slowly breathes.
 * No canvas — it's pure layered radial gradients in DOM. The pointer adds a
 * gentle parallax to the blob layer (input-only). The wordmark "MESH" is
 * white with a stacked multi-color text-shadow glow drawn from the mesh hues.
 *
 * `.mesh-js` is added on mount so the no-JS markup is the finished page.
 */
export default function MeshPage() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const reduced = usePrefersReducedMotion();
  const revealRef = useReveal<HTMLDivElement>();
  const stageRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    root.classList.add("mesh-js");
    const id = requestAnimationFrame(() => root.classList.add("is-mounted"));
    window.parent?.postMessage({ type: "oneshot:ready", slug: "mesh" }, "*");
    return () => cancelAnimationFrame(id);
  }, []);

  // Pointer parallax — the blob layer drifts gently with the cursor.
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
      stage.style.setProperty("--ms-px", `${(cx * 3).toFixed(1)}vmax`);
      stage.style.setProperty("--ms-py", `${(cy * 3).toFixed(1)}vmax`);
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
    <div ref={rootRef} className={`${sora.variable} ${notoSansKR.variable} mesh-root`}>
      <div ref={stageRef} className="mesh-field" aria-hidden="true">
        <span className="mesh-blob mesh-blob--coral" />
        <span className="mesh-blob mesh-blob--violet" />
        <span className="mesh-blob mesh-blob--teal" />
        <span className="mesh-blob mesh-blob--gold" />
        <span className="mesh-blob mesh-blob--magenta" />
      </div>
      <div ref={revealRef} className="mesh-doc">
        <header className="mesh-hero">
          <p className="mesh-kicker">
            <span lang="ko">그라디언트 스튜디오</span> · A FIELD OF COLOR · 2026
          </p>
          <h1 className="mesh-title" aria-label={TITLE}>
            <span className="mesh-glow" aria-hidden="true">
              {TITLE.split("").map((ch, i) => (
                <span key={i} className="mesh-glyph" style={{ "--ms-i": i } as CSSProperties}>
                  {ch}
                </span>
              ))}
            </span>
          </h1>
          <p className="mesh-title__ko" lang="ko">메쉬</p>
          <p className="mesh-sub">
            <span lang="ko">색의 장.</span> A field of color.
          </p>
          <p className="mesh-hint" lang="ko">움직여 보세요 — 색의 장이 흐릅니다.</p>
        </header>

        <main>
          <section className="mesh-grid">
            {[
              { ko: "코랄", en: "Coral", n: "01" },
              { ko: "바이올렛", en: "Violet", n: "02" },
              { ko: "티얼", en: "Teal", n: "03" },
              { ko: "골드", en: "Gold", n: "04" },
              { ko: "마젠타", en: "Magenta", n: "05" },
            ].map((c, i) => (
              <article
                key={i}
                className="mesh-card"
                data-reveal
                style={{ "--ms-d": i * 80 } as CSSProperties}
              >
                <span className="mesh-card__n">{c.n}</span>
                <span className="mesh-card__en">{c.en}</span>
                <span className="mesh-card__ko" lang="ko">{c.ko}</span>
              </article>
            ))}
          </section>

          <section className="mesh-lead" data-reveal>
            <p className="mesh-lead__p">
              <span lang="ko">
                우리는 색을 섞지 않는다, 겹친다. 다섯 개의 빛이 각자의 속도로
                떠다니며 만나는 곳마다 새로운 장이 된다.
              </span>{" "}
              We don't mix color — we layer it. Five lights drift at their own
              pace, and where they meet a new field begins.
            </p>
          </section>
        </main>

        <footer className="mesh-foot">
          <span>MESH · 2026</span>
          <span lang="ko">메쉬 — 서울</span>
        </footer>
      </div>
    </div>
  );
}
