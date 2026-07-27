"use client";

import { useEffect, useRef } from "react";
import "./styles.css";
import { inter, notoSansKR } from "./fonts";
import { useReveal } from "./hooks/useReveal";
import { usePrefersReducedMotion } from "./hooks/usePrefersReducedMotion";

export default function ForestPage() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const reduced = usePrefersReducedMotion();
  const revealRef = useReveal<HTMLDivElement>();

  useEffect(() => {
    rootRef.current?.classList.add("forest-js");
    window.parent?.postMessage({ type: "oneshot:ready", slug: "forest" }, "*");
  }, []);

  return (
    <div ref={rootRef} className={`${inter.variable} ${notoSansKR.variable} forest-root`}>
      <div ref={revealRef} className="forest-doc">
        <header className="forest-hero" data-reveal="">
          <p className="forest-kicker"><span lang="ko">깊은 수관의 은신처</span> · DEEP CANOPY RETREAT</p>
          <h1 className="forest-title">FOREST <span lang="ko">숲</span></h1>
          <p className="forest-sub" data-reveal=""><span lang="ko">내려갈수록 어두워진다.</span> Canopy darkens as you descend.</p>
        </header>
        <section className="forest-body" data-reveal="">
          <p className="forest-body__text">
            <span lang="ko">이 엔트리는 갤러리 50개 로스터의 일부로, 순수 코드로 제작되었습니다. organic-nature 패밀리의 세 번째 엔트리로, SUP과 DREAM과 시각적으로 구별됩니다.</span>
            {" "}This entry is part of the gallery&rsquo;s 50-entry roster, built in pure code. The third organic-nature entry, distinct from SUP and DREAM.
          </p>
        </section>
        <footer className="forest-foot" data-reveal="">
          <p>© 2026 FOREST · MIT</p>
          <p><span lang="ko">깊이 숨쉬어라</span> · breathe deep</p>
        </footer>
      </div>
    </div>
  );
}
