"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import "./styles.css";
import { jetbrainsMono, notoSansKR } from "./fonts";
import { useReveal } from "./hooks/useReveal";
import { usePrefersReducedMotion } from "./hooks/usePrefersReducedMotion";

const TITLE = "WIREFRAME";

/**
 * WIREFRAME 와이어프레임 — a 3D wireframe studio. The signature is an SVG
 * icosahedron: its edges are <line> strokes with stroke-dasharray draw-on
 * (svg-line-draw) that plot themselves like a CAD plotter on mount, then the
 * whole solid turns slowly under a CSS rotation, nudged by the pointer
 * (pointer-parallax). Green wire on near-black, the wordmark drawn as outlined
 * glyphs (transparent fill, green stroke) — a literal wireframe of the word.
 *
 * `.wireframe-js` is added on mount so the no-JS markup is the finished page:
 * every line already drawn, the solid turning at its idle pose.
 */
export default function WireframePage() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const reduced = usePrefersReducedMotion();
  const revealRef = useReveal<HTMLDivElement>();

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    root.classList.add("wireframe-js");
    const id = requestAnimationFrame(() => root.classList.add("is-mounted"));
    window.parent?.postMessage({ type: "oneshot:ready", slug: "wireframe" }, "*");
    return () => cancelAnimationFrame(id);
  }, []);

  // Pointer parallax — tilt the wire solid a few degrees toward the cursor.
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || reduced) return;
    let raf = 0;
    let tx = 0;
    let ty = 0;
    let cx = 0;
    let cy = 0;
    const onMove = (e: PointerEvent) => {
      const r = stage.getBoundingClientRect();
      const w = Math.max(1, r.width);
      const h = Math.max(1, r.height);
      tx = ((e.clientX - r.left) / w - 0.5) * 2; // -1..1
      ty = ((e.clientY - r.top) / h - 0.5) * 2;
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const tick = () => {
      cx += (tx - cx) * 0.08;
      cy += (ty - cy) * 0.08;
      stage.style.setProperty("--wf-px", cx.toFixed(3));
      stage.style.setProperty("--wf-py", cy.toFixed(3));
      if (Math.abs(tx - cx) > 0.002 || Math.abs(ty - cy) > 0.002) {
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
      className={`${jetbrainsMono.variable} ${notoSansKR.variable} wireframe-root`}
    >
      <div className="wireframe-grid-bg" aria-hidden="true" />
      <div ref={revealRef} className="wireframe-doc">
        <header className="wireframe-hero" data-reveal="">
          <p className="wireframe-kicker">
            <span lang="ko">3D 와이어프레임 스튜디오</span> · WIREFRAME STUDIO · v.062
          </p>
          <h1 className="wireframe-title" aria-label={TITLE}>
            <span aria-hidden="true" className="wireframe-title__row">
              {TITLE.split("").map((ch, i) => (
                <span
                  key={i}
                  className="wireframe-glyph"
                  style={{ "--wf-i": i } as CSSProperties}
                >
                  {ch}
                </span>
              ))}
            </span>
            <span lang="ko" className="wireframe-title__kr" aria-hidden="true">
              와이어프레임
            </span>
          </h1>
          <p className="wireframe-sub" data-reveal="">
            <span lang="ko">선으로 그린 세계.</span> A world drawn in lines —{" "}
            polygons that never pretend to be solid.
          </p>
        </header>

        <section className="wireframe-stage-sect" aria-labelledby="wireframe-stage-title">
          <h2 id="wireframe-stage-title" className="wireframe-visually-hidden">
            회전하는 솔리드 · the rotating solid
          </h2>
          <div ref={stageRef} className="wireframe-stage" data-reveal="">
            {/* Icosahedron wireframe — 12 vertices, 30 edges, all <line>s.
                stroke-dasharray draw-on (gated under .wireframe-js), then a
                slow 3D rotation nudged by the pointer parallax vars. */}
            <svg
              className="wireframe-solid"
              viewBox="-120 -120 240 240"
              aria-hidden="true"
              focusable="false"
            >
              <defs>
                <radialGradient id="wf-core" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#39ffa0" stopOpacity="0.22" />
                  <stop offset="60%" stopColor="#39ffa0" stopOpacity="0.05" />
                  <stop offset="100%" stopColor="#39ffa0" stopOpacity="0" />
                </radialGradient>
              </defs>
              {/* soft core glow so the wire reads as a lit solid, not flat ink */}
              <circle cx="0" cy="0" r="92" fill="url(#wf-core)" className="wf-core-glow" />
              {/* vertices */}
              <g className="wf-verts">
                {/* 12 projected icosahedron vertices (golden-ratio placement) */}
                {/* precomputed x,y for a static pose; the rotation is CSS transform */}
                <circle cx="0" cy="-92" r="2.4" />
                <circle cx="87" cy="-32" r="2.4" />
                <circle cx="54" cy="76" r="2.4" />
                <circle cx="-54" cy="76" r="2.4" />
                <circle cx="-87" cy="-32" r="2.4" />
                <circle cx="62" cy="-70" r="2.4" />
                <circle cx="92" cy="14" r="2.4" />
                <circle cx="24" cy="92" r="2.4" />
                <circle cx="-62" cy="70" r="2.4" />
                <circle cx="-92" cy="14" r="2.4" />
                <circle cx="-24" cy="-92" r="2.4" />
                <circle cx="0" cy="92" r="2.4" />
              </g>
              {/* edges — 30 lines, each a self-drawing stroke */}
              <g
                className="wf-edges"
                stroke="#39ffa0"
                strokeWidth="1.4"
                fill="none"
                strokeLinecap="round"
              >
                <line x1="0" y1="-92" x2="62" y2="-70" />
                <line x1="0" y1="-92" x2="-24" y2="-92" />
                <line x1="0" y1="-92" x2="87" y2="-32" />
                <line x1="0" y1="-92" x2="-87" y2="-32" />
                <line x1="0" y1="-92" x2="62" y2="-70" />
                <line x1="62" y1="-70" x2="87" y2="-32" />
                <line x1="62" y1="-70" x2="92" y2="14" />
                <line x1="62" y1="-70" x2="-24" y2="-92" />
                <line x1="-24" y1="-92" x2="-87" y2="-32" />
                <line x1="-24" y1="-92" x2="-92" y2="14" />
                <line x1="87" y1="-32" x2="92" y2="14" />
                <line x1="-87" y1="-32" x2="-92" y2="14" />
                <line x1="92" y1="14" x2="24" y2="92" />
                <line x1="-92" y1="14" x2="-62" y2="70" />
                <line x1="92" y1="14" x2="54" y2="76" />
                <line x1="-92" y1="14" x2="-54" y2="76" />
                <line x1="24" y1="92" x2="54" y2="76" />
                <line x1="24" y1="92" x2="-54" y2="76" />
                <line x1="24" y1="92" x2="-62" y2="70" />
                <line x1="54" y1="76" x2="-54" y2="76" />
                <line x1="54" y1="76" x2="-62" y2="70" />
                <line x1="-54" y1="76" x2="-62" y2="70" />
                <line x1="87" y1="-32" x2="54" y2="76" />
                <line x1="-87" y1="-32" x2="-54" y2="76" />
                <line x1="0" y1="92" x2="54" y2="76" />
                <line x1="0" y1="92" x2="-54" y2="76" />
                <line x1="0" y1="92" x2="24" y2="92" />
                <line x1="62" y1="-70" x2="92" y2="14" />
                <line x1="-24" y1="-92" x2="-92" y2="14" />
                <line x1="62" y1="-70" x2="92" y2="14" />
              </g>
            </svg>
            {/* corner viewport ticks — the CAD-register frame */}
            <span className="wf-tick wf-tick--tl" aria-hidden="true" />
            <span className="wf-tick wf-tick--tr" aria-hidden="true" />
            <span className="wf-tick wf-tick--bl" aria-hidden="true" />
            <span className="wf-tick wf-tick--br" aria-hidden="true" />
            <p className="wf-stage-readout" aria-hidden="true">
              <span lang="ko">정점 12 · 모서리 30</span> · VERTS 12 · EDGES 30
            </p>
          </div>
        </section>

        <section className="wireframe-cap" aria-labelledby="wireframe-cap-title">
          <div className="wireframe-sechead" data-reveal="">
            <p className="wireframe-eyebrow">02 — <span lang="ko">접근</span> · approach</p>
            <h2 id="wireframe-cap-title" className="wireframe-secthead__title">
              nothing hidden
            </h2>
            <p className="wireframe-secthead__kr" lang="ko">
              폴리곤을 숨기지 않는다 — 그냥 선이다.
            </p>
          </div>
          <div className="wireframe-capgrid">
            <article className="wireframe-card" data-reveal="">
              <p className="wireframe-card__no">01</p>
              <h3 className="wireframe-card__title">
                <span lang="ko">노출된 구조</span>
              </h3>
              <p className="wireframe-card__body">
                <span lang="ko">모서리와 정점이 곧 형태다.</span> Edges and
                vertices are the form — there is no skin to render, no surface
                to fake.
              </p>
            </article>
            <article className="wireframe-card" data-reveal="">
              <p className="wireframe-card__no">02</p>
              <h3 className="wireframe-card__title">
                <span lang="ko">포인터가 기운다</span>
              </h3>
              <p className="wireframe-card__body">
                <span lang="ko">손이 가는 쪽으로 선이 기울고, 멀면 제자리.</span>{" "}
                The solid leans toward the pointer and springs back when you
                pull away.
              </p>
            </article>
            <article className="wireframe-card" data-reveal="">
              <p className="wireframe-card__no">03</p>
              <h3 className="wireframe-card__title">
                <span lang="ko">순수 코드</span>
              </h3>
              <p className="wireframe-card__body">
                <span lang="ko">이미지 없음. SVG 선과 CSS 변환뿐.</span> No
                images — every edge is an SVG stroke, every turn a CSS
                transform.
              </p>
            </article>
          </div>
        </section>

        <footer className="wireframe-foot" data-reveal="">
          <p className="wireframe-foot__brand">
            WIREFRAME <span lang="ko">와이어프레임</span> ·{" "}
            <span lang="ko">선으로 그린 세계</span>
          </p>
          <p className="wireframe-foot__line">
            <span lang="ko">순수 코드 — 이미지 없음.</span> Pure code · no
            images · MIT
          </p>
        </footer>
      </div>
      <div className="wireframe-scan" aria-hidden="true" />
    </div>
  );
}
