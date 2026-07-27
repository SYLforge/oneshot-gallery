"use client";

import { useEffect, useRef } from "react";
import "./styles.css";
import { inter, notoSansKR } from "./fonts";
import { useReveal } from "./hooks/useReveal";
import { usePrefersReducedMotion } from "./hooks/usePrefersReducedMotion";

export default function NoirPage() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const reduced = usePrefersReducedMotion();
  const revealRef = useReveal<HTMLDivElement>();

  useEffect(() => {
    rootRef.current?.classList.add("noir-js");
    window.parent?.postMessage({ type: "oneshot:ready", slug: "noir" }, "*");
  }, []);

  return (
    <div ref={rootRef} className={`${inter.variable} ${notoSansKR.variable} noir-root`}>
      <div ref={revealRef} className="noir-doc">
        <header className="noir-hero" data-reveal="">
          <p className="noir-kicker"><span lang="ko">흑백 영화</span> · BLACK AND WHITE CINEMA</p>
          <h1 className="noir-title">NOIR <span lang="ko">느와르</span></h1>
          <p className="noir-sub" data-reveal=""><span lang="ko">블라인드. 거친 활자.</span> Venetian blinds. Hard-boiled type.</p>
        </header>
        <section className="noir-body" data-reveal="">
          <p className="noir-body__text">
            <span lang="ko">이 엔트리는 갤러리 50개 로스터의 일부로, 순수 코드로 제작되었습니다. cinematic-dark 패밀리의 세 번째 엔트리로, HALFLIGHT와 REEL과 시각적으로 구별됩니다.</span>
            {" "}This entry is part of the gallery&rsquo;s 50-entry roster, built in pure code. The third cinematic-dark entry, distinct from HALFLIGHT and REEL.
          </p>
        </section>
        <footer className="noir-foot" data-reveal="">
          <p>© 2026 NOIR · MIT</p>
          <p><span lang="ko">끝</span> · the end</p>
        </footer>
      </div>
    </div>
  );
}
