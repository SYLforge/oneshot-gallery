"use client";

import { useEffect, useRef } from "react";
import "./styles.css";
import { inter, notoSansKR } from "./fonts";
import { useReveal } from "./hooks/useReveal";
import { usePrefersReducedMotion } from "./hooks/usePrefersReducedMotion";

export default function RipPage() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const reduced = usePrefersReducedMotion();
  const revealRef = useReveal<HTMLDivElement>();

  useEffect(() => {
    rootRef.current?.classList.add("rip-js");
    window.parent?.postMessage({ type: "oneshot:ready", slug: "rip" }, "*");
  }, []);

  return (
    <div ref={rootRef} className={`${inter.variable} ${notoSansKR.variable} rip-root`}>
      <div ref={revealRef} className="rip-doc">
        <header className="rip-hero" data-reveal="">
          <p className="rip-kicker"><span lang="ko">잉크 물방울 연못</span> · INK RIPPLE POND</p>
          <h1 className="rip-title">RIP <span lang="ko">물방울</span></h1>
          <p className="rip-sub" data-reveal=""><span lang="ko">손길에 잉크가 퍼진다.</span> Ink ripples from touch.</p>
        </header>
        <section className="rip-body" data-reveal="">
          <p className="rip-body__text">
            <span lang="ko">이 엔트리는 갤러리 50개 로스터의 일부로, 순수 코드로 제작되었습니다. ink-bloom 패밀리의 세 번째 엔트리로, SAKURA와 BLOOM과 시각적으로 구별됩니다.</span>
            {" "}This entry is part of the gallery&rsquo;s 50-entry roster, built in pure code. The third ink-bloom entry, distinct from SAKURA and BLOOM.
          </p>
        </section>
        <footer className="rip-foot" data-reveal="">
          <p>© 2026 RIP · MIT</p>
          <p><span lang="ko">잔잔</span> · still water</p>
        </footer>
      </div>
    </div>
  );
}
