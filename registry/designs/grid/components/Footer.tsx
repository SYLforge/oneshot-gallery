"use client";

import { useEffect, useRef } from "react";
import NumeralMark from "./NumeralMark";

/**
 * Section 03 — the colophon. The closing statement is set as large and
 * thin as the wordmark: ON A GRID arrives one glyph at a time when the
 * footer enters the viewport (the same char-split primitive, armed by an
 * IntersectionObserver instead of mount). A red rule draws itself
 * underneath (SVG pathLength trick). Without JS — or under reduced
 * motion — the statement simply stands, full size, rule complete.
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
      className="grid-footer"
      aria-labelledby="grid-statement"
    >
      <div className="grid-frame">
        <header className="grid-sechead">
          <span className="grid-sechead__no" aria-hidden="true">
            03
          </span>
          <p className="grid-sechead__title">
            colophon{" "}
            <span lang="ko" className="grid-sechead__ko">
              말록
            </span>
          </p>
        </header>

        <h2
          className="grid-footer__statement"
          id="grid-statement"
          aria-label="EVERY BUILDING STANDS ON A GRID — 모든 건물은 그리드 위에 선다"
        >
          <NumeralMark text="EVERY BUILDING" />
          <br />
          <span className="grid-footer__statement-red">
            <NumeralMark text="STANDS ON A GRID" />
          </span>
        </h2>

        <svg
          className="grid-cert"
          viewBox="0 0 100 2"
          preserveAspectRatio="none"
          aria-hidden="true"
          focusable="false"
        >
          <line
            className="grid-cert__line"
            x1="0"
            y1="1"
            x2="100"
            y2="1"
            pathLength={1}
          />
        </svg>

        <p className="grid-footer__attest">
          the grid does not make the building beautiful. it makes the
          building possible, and then it gets out of the way.
          <span lang="ko">
            그리드는 건물을 아름답게 만들지 않는다. 건물을 가능하게 한 뒤
            자리를 비켜줄 뿐이다.
          </span>
        </p>

        <div className="grid-grid grid-footer__cols">
          <div className="grid-footer__block" data-flip>
            <h3 className="grid-footer__h grid-mono">atelier · 사무소</h3>
            <p>
              grid — atelier of measured form
              <br />
              plate house, hyehwa-ro 22
              <br />
              seoul 02841, kr
            </p>
            <p lang="ko">그리드 — 측정된 형태의 사무소</p>
          </div>
          <div className="grid-footer__block" data-flip>
            <h3 className="grid-footer__h grid-mono">hours · 응대</h3>
            <p>
              mon–fri, 09:00–18:00.
              <br />
              by appointment. bring your brief.
            </p>
            <p lang="ko">평일 09:00–18:00. 예약제. 설계요강을 지참할 것.</p>
          </div>
          <div className="grid-footer__block" data-flip>
            <h3 className="grid-footer__h grid-mono">license · 면허</h3>
            <p>
              architect no. 40-2011-kr.
              <br />
              renewed triennially. never amended.
            </p>
            <p lang="ko">건축사 제40-2011-kr호. 3년마다 갱신, 수정된 적 없음.</p>
          </div>
        </div>

        <p className="grid-footer__legal grid-mono">
          © 2026 grid — measured form. set in inter, on a 12-column field.{" "}
          <span lang="ko">인터로 조판, 12단 필드 위에.</span>
        </p>
      </div>
    </footer>
  );
}
