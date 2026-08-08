"use client";

import { useCallback, useEffect, useRef } from "react";
import "./styles.css";
import { inter, notoSansKR } from "./fonts";
import SpatialStage from "./components/SpatialStage";
import { usePrefersReducedMotion } from "./hooks/usePrefersReducedMotion";
import { useReveal } from "./hooks/useReveal";
import { usePointerParallax } from "./hooks/usePointerParallax";

/**
 * WIDGET — a spatial glass dashboard, visionOS style. A constellation of
 * translucent widgets floating at different depths over an aurora ground,
 * tilting toward the pointer like held glass. Where HANJI SLATE is a single
 * e-ink device exploding, WIDGET is a field of glass suspended in 3D space.
 *
 * `.widget-js` is added on mount: every pre-reveal style is gated behind it,
 * so with JavaScript off the dashboard simply stands finished and readable.
 * The pointer-parallax hook attaches to the stage ref and drives `--w-rx/ry/
 * lift` per card — atmosphere, not input.
 */
export default function WidgetPage() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const reduced = usePrefersReducedMotion();
  const revealRef = useReveal<HTMLDivElement>();
  const registerStage = useCallback((el: HTMLDivElement | null) => {
    stageRef.current = el;
  }, []);

  usePointerParallax(stageRef, reduced);

  useEffect(() => {
    rootRef.current?.classList.add("widget-js");
    window.parent?.postMessage({ type: "oneshot:ready", slug: "widget" }, "*");
  }, []);

  return (
    <div
      ref={rootRef}
      className={`${inter.variable} ${notoSansKR.variable} widget-root`}
    >
      <div ref={revealRef} className="widget-doc">
        <header className="widget-hero" data-reveal="">
          <p className="widget-kicker">
            <span lang="ko">공간 대시보드</span> · SPATIAL DASHBOARD
          </p>
          <h1 className="widget-title">
            WIDGET <span lang="ko">위젯</span>
          </h1>
          <p className="widget-sub" data-reveal="">
            <span lang="ko">깊이 속에 떠 있는 유리 위젯들.</span> Glass
            widgets, suspended in depth.
          </p>
        </header>

        <main>
          <SpatialStage reduced={reduced} registerRoot={registerStage} />
        </main>

        <footer className="widget-foot" data-reveal="">
          <p className="widget-foot__brand">
            WIDGET <span lang="ko">위젯</span>
          </p>
          <p className="widget-foot__line">
            <span lang="ko">전부 코드로 그렸다 — 이미지 없음.</span> drawn
            entirely in code — no images.
          </p>
          <p className="widget-foot__copy">
            © 2026 WIDGET · <span lang="ko">공간 OS</span> · MIT
          </p>
        </footer>
      </div>
    </div>
  );
}
