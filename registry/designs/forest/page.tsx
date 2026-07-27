"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import "./styles.css";
import { inter, notoSansKR } from "./fonts";
import { useReveal } from "./hooks/useReveal";
import { usePrefersReducedMotion } from "./hooks/usePrefersReducedMotion";
import { useScrollProgress } from "./hooks/useScrollProgress";
import { usePointerParallax } from "./hooks/usePointerParallax";

/**
 * FOREST — 숲, 깊은 수관의 은신처. Organic-nature entry where the canopy
 * darkens as you scroll deeper (scroll-scrub-pinned via --forest-depth),
 * dappled light filters through feTurbulence leaves (feturbulence-texture),
 * and the canopy layers drift toward the pointer (pointer-parallax).
 */
export default function ForestPage() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const reduced = usePrefersReducedMotion();
  const revealRef = useReveal<HTMLDivElement>();
  const depthRef = useScrollProgress<HTMLDivElement>(reduced);
  const canopyRef = usePointerParallax<HTMLDivElement>(reduced);

  useEffect(() => {
    rootRef.current?.classList.add("forest-js");
    window.parent?.postMessage({ type: "oneshot:ready", slug: "forest" }, "*");
  }, []);

  return (
    <div ref={rootRef} className={`${inter.variable} ${notoSansKR.variable} forest-root`}>
      <div ref={revealRef} className="forest-doc">
        {/* pointer-parallax canopy layers */}
        <div ref={canopyRef} className="forest-canopy" aria-hidden="true">
          <div className="forest-canopy__layer forest-canopy__layer--far" />
          <div className="forest-canopy__layer forest-canopy__layer--mid" />
          <div className="forest-canopy__layer forest-canopy__layer--near" />
        </div>

        <header className="forest-hero" data-reveal="">
          <p className="forest-kicker"><span lang="ko">깊은 수관의 은신처</span> · DEEP CANOPY RETREAT</p>
          <h1 className="forest-title">
            FOREST <span lang="ko">숲</span>
          </h1>
          <p className="forest-sub"><span lang="ko">내려갈수록 수관이 어두워진다.</span> The canopy darkens as you descend.</p>
        </header>

        {/* scroll-scrub-pinned: the descent */}
        <section ref={depthRef} className="forest-descent" data-reveal="">
          <div className="forest-descent__inner">
            <p className="forest-descent__word" lang="ko">빛이 줄어든다</p>
            <p className="forest-descent__word" lang="ko">이끼가 늘어난다</p>
            <p className="forest-descent__word" lang="ko">숨이 깊어진다</p>
            <p className="forest-descent__en"><em>Light thins · moss thickens · breath deepens</em></p>
          </div>
        </section>

        {/* feturbulence-texture: dappled leaf overlay */}
        <svg className="forest-dapple" aria-hidden="true" focusable="false">
          <filter id="forest-leaf-f">
            <feTurbulence type="fractalNoise" baseFrequency="0.02 0.04" numOctaves="3" seed="7" stitchTiles="stitch" />
            <feColorMatrix type="matrix" values="0 0 0 0 0.08  0 0 0 0 0.12  0 0 0 0 0.04  0 0 0 0.12 0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#forest-leaf-f)" />
        </svg>

        <footer className="forest-foot" data-reveal="">
          <p>© 2026 FOREST · <span lang="ko">숲</span> · MIT</p>
          <p><span lang="ko">깊이 숨쉬어라 — 숲은 기다린다.</span> breathe deep — the forest waits.</p>
        </footer>
      </div>
    </div>
  );
}
