"use client";

import { useEffect, useRef } from "react";
import WidthMark from "./WidthMark";

/**
 * Section 04 — certification. The verdict, set as wide as the standard
 * allows: STILL CORRECT runs the width axis 62 → 125 when the footer enters
 * the viewport, and the red certification rule draws itself underneath
 * (SVG pathLength trick, same as the hero stamp). Without JS — or under
 * reduced motion — the verdict simply stands, full width, rule complete.
 */
export default function Footer() {
  const footRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = footRef.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) {
      el.classList.add("is-on");
      return;
    }
    const io = new IntersectionObserver(
      (hits) => {
        for (const hit of hits) {
          if (hit.isIntersecting) {
            el.classList.add("is-on");
            io.disconnect();
          }
        }
      },
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <footer
      ref={footRef}
      className="raster-footer"
      aria-labelledby="raster-verdict"
    >
      <div className="raster-frame">
        <header className="raster-sechead">
          <span className="raster-sechead__no" aria-hidden="true">
            04
          </span>
          <p className="raster-sechead__title">
            certification{" "}
            <span lang="ko" className="raster-sechead__ko">
              인증
            </span>
          </p>
        </header>

        <h2
          className="raster-footer__verdict"
          id="raster-verdict"
          aria-label="STILL CORRECT — 지금도 유효함"
        >
          <WidthMark text="STILL CORRECT" />
        </h2>

        <svg
          className="raster-cert"
          viewBox="0 0 100 2"
          preserveAspectRatio="none"
          aria-hidden="true"
          focusable="false"
        >
          <line
            className="raster-cert__line"
            x1="0"
            y1="1"
            x2="100"
            y2="1"
            pathLength={1}
          />
        </svg>

        <p className="raster-footer__attest">
          examined at 6 and at 12 columns. re-examined annually since 1972.
          finding unchanged.
          <span lang="ko">
            6단과 12단에서 검수하였다. 1972년 이래 매년 재검수. 소견 변동 없음.
          </span>
        </p>

        <div className="raster-grid raster-footer__cols">
          <div className="raster-footer__block" data-flip>
            <h3 className="raster-footer__h raster-mono">bureau · 인증국</h3>
            <p>
              raster — bureau for grid systems
              <br />
              grid house, hallwylstrasse 04
              <br />
              ch-3005 bern
            </p>
            <p lang="ko">라스터 — 그리드 시스템 인증국</p>
          </div>
          <div className="raster-footer__block" data-flip>
            <h3 className="raster-footer__h raster-mono">hours · 응대</h3>
            <p>
              mon–fri, 08:30–17:00.
              <br />
              by appointment. bring your grid.
            </p>
            <p lang="ko">평일 08:30–17:00. 예약제. 그리드를 지참할 것.</p>
          </div>
          <div className="raster-footer__block" data-flip>
            <h3 className="raster-footer__h raster-mono">certificate · 인증서</h3>
            <p>
              certificate no. 0004-1972.
              <br />
              renewed annually. never amended.
            </p>
            <p lang="ko">인증서 제0004-1972호. 매년 갱신, 수정된 적 없음.</p>
          </div>
        </div>

        <p className="raster-footer__legal raster-mono">
          © 2026 raster — the grid does not negotiate.{" "}
          <span lang="ko">그리드는 협상하지 않는다.</span>
        </p>
      </div>
    </footer>
  );
}
