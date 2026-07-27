"use client";

import { useEffect, useRef } from "react";
import "./styles.css";
import { inter, notoSansKR } from "./fonts";
import { useReveal } from "./hooks/useReveal";
import { usePrefersReducedMotion } from "./hooks/usePrefersReducedMotion";

export default function BlockPage() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const reduced = usePrefersReducedMotion();
  const revealRef = useReveal<HTMLDivElement>();

  useEffect(() => {
    rootRef.current?.classList.add("block-js");
    window.parent?.postMessage({ type: "oneshot:ready", slug: "block" }, "*");
  }, []);

  return (
    <div ref={rootRef} className={`${inter.variable} ${notoSansKR.variable} block-root`}>
      <div ref={revealRef} className="block-doc">
        <header className="block-hero" data-reveal="">
          <p className="block-kicker"><span lang="ko">콘크리트 시 출판</span> · CONCRETE POETRY PRESS</p>
          <h1 className="block-title">BLOCK <span lang="ko">블록</span></h1>
          <p className="block-sub" data-reveal=""><span lang="ko">단단한 그리드. 무거운 활자.</span> Stark grids. Heavy type.</p>
        </header>
        <section className="block-body" data-reveal="">
          <p className="block-body__text">
            <span lang="ko">이 엔트리는 갤러리 50개 로스터의 일부로, 순수 코드로 제작되었습니다. neo-brutalist 패밀리의 세 번째 엔트리로, BLUNT와 RAVE와 시각적으로 구별됩니다.</span>
            {" "}This entry is part of the gallery&rsquo;s 50-entry roster, built in pure code. The third neo-brutalist entry, distinct from BLUNT and RAVE.
          </p>
        </section>
        <footer className="block-foot" data-reveal="">
          <p>© 2026 BLOCK · MIT</p>
          <p><span lang="ko">이징 없음</span> · no easing</p>
        </footer>
      </div>
    </div>
  );
}
