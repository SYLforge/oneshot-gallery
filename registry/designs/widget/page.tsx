"use client";

import { useEffect, useRef, useState } from "react";
import "./styles.css";
import { inter, notoSansKR } from "./fonts";
import { useReveal } from "./hooks/useReveal";
import { usePrefersReducedMotion } from "./hooks/usePrefersReducedMotion";

/**
 * WIDGET — 공간 글래스 대시보드, visionOS 스타일. A constellation of glass
 * dashboard widgets floating in depth over a gradient. Where HANJI SLATE is a
 * single e-ink device exploding, WIDGET is spatial depth — widgets float
 * toward the pointer at different layers. Pure code.
 */
type Mode = "morning" | "focus";

export default function WidgetPage() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const reduced = usePrefersReducedMotion();
  const revealRef = useReveal<HTMLDivElement>();
  const [mode, setMode] = useState<Mode>("morning");

  useEffect(() => {
    rootRef.current?.classList.add("widget-js");
    window.parent?.postMessage({ type: "oneshot:ready", slug: "widget" }, "*");

    if (reduced) return;
    const stage = stageRef.current;
    if (!stage) return;
    const onMove = (ev: PointerEvent) => {
      const rect = stage.getBoundingClientRect();
      const x = (ev.clientX - rect.left) / rect.width - 0.5;
      const y = (ev.clientY - rect.top) / rect.height - 0.5;
      stage.style.setProperty("--widget-px", x.toFixed(3));
      stage.style.setProperty("--widget-py", y.toFixed(3));
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduced]);

  return (
    <div
      ref={rootRef}
      className={`${inter.variable} ${notoSansKR.variable} widget-root`}
      data-mode={mode}
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
            <span lang="ko">깊이 속에 떠 있는 위젯들.</span> Widgets that float
            in depth.
          </p>
        </header>

        <section className="widget-stage-section">
          <div className="widget-mode-toggle" data-reveal="">
            <button
              type="button"
              className={`widget-mode-btn ${mode === "morning" ? "is-active" : ""}`}
              onClick={() => setMode("morning")}
            >
              <span lang="ko">아침</span> Morning
            </button>
            <button
              type="button"
              className={`widget-mode-btn ${mode === "focus" ? "is-active" : ""}`}
              onClick={() => setMode("focus")}
            >
              <span lang="ko">집중</span> Focus
            </button>
          </div>

          <div className="widget-stage" ref={stageRef} data-reveal="">
            <div className="widget-card widget-card--weather" data-depth="3">
              <p className="widget-card__label">
                <span lang="ko">날씨</span> Weather
              </p>
              <p className="widget-card__value">21°</p>
              <p className="widget-card__sub">서울 · 맑음</p>
            </div>
            <div className="widget-card widget-card--calendar" data-depth="2">
              <p className="widget-card__label">
                <span lang="ko">오늘</span> Today
              </p>
              <p className="widget-card__value">3</p>
              <p className="widget-card__sub">
                <span lang="ko">회의</span> meetings
              </p>
            </div>
            <div className="widget-card widget-card--chart" data-depth="1">
              <p className="widget-card__label">
                <span lang="ko">주간 완료</span> Weekly done
              </p>
              <div className="widget-card__bars">
                {[40, 65, 30, 80, 55, 90, 45].map((h, i) => (
                  <span key={i} className="widget-bar" style={{ height: `${h}%` }} />
                ))}
              </div>
            </div>
            <div className="widget-card widget-card--music" data-depth="2">
              <p className="widget-card__label">
                <span lang="ko">재생 중</span> Now playing
              </p>
              <p className="widget-card__value-small">새벽 녹음</p>
              <p className="widget-card__sub">EP.044</p>
            </div>
          </div>
        </section>

        <footer className="widget-foot" data-reveal="">
          <p>
            © 2026 WIDGET · <span lang="ko">공간 OS</span> · MIT
          </p>
          <p>
            <span lang="ko">전부 코드로 그렸다 — 이미지 없음.</span> drawn
            entirely in code — no images.
          </p>
        </footer>
      </div>
    </div>
  );
}
