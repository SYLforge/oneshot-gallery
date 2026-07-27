"use client";

import { useEffect, useRef } from "react";
import "./styles.css";
import { inter, notoSansKR } from "./fonts";
import { useReveal } from "./hooks/useReveal";
import { usePrefersReducedMotion } from "./hooks/usePrefersReducedMotion";

export default function PrismPage() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const reduced = usePrefersReducedMotion();
  const revealRef = useReveal<HTMLDivElement>();

  useEffect(() => {
    rootRef.current?.classList.add("prism-js");
    window.parent?.postMessage({ type: "oneshot:ready", slug: "prism" }, "*");
  }, []);

  return (
    <div ref={rootRef} className={`${inter.variable} ${notoSansKR.variable} prism-root`}>
      <div ref={revealRef} className="prism-doc">
        <header className="prism-hero" data-reveal="">
          <p className="prism-kicker"><span lang="ko">빛의 굴절 스튜디오</span> · LIGHT REFRACTION STUDIO</p>
          <h1 className="prism-title">PRISM <span lang="ko">프리즘</span></h1>
          <p className="prism-sub" data-reveal=""><span lang="ko">유리가 빛을 굴절시킨다.</span> Glass refracts a beam.</p>
        </header>
        <section className="prism-body" data-reveal="">
          <p className="prism-body__text">
            <span lang="ko">이 엔트리는 갤러리 50개 로스터의 일부로, 순수 코드로 제작되었습니다. glass-futurism 패밀리의 세 번째 엔트리로, LUMEN NORD와 AURORA와 시각적으로 구별됩니다.</span>
            {" "}This entry is part of the gallery&rsquo;s 50-entry roster, built in pure code. The third glass-futurism entry, distinct from LUMEN NORD and AURORA.
          </p>
        </section>
        <footer className="prism-foot" data-reveal="">
          <p>© 2026 PRISM · MIT</p>
          <p><span lang="ko">코드로 그렸다</span> · drawn in code</p>
        </footer>
      </div>
    </div>
  );
}
