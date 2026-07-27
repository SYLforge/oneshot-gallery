"use client";

import { useEffect, useRef } from "react";
import "./styles.css";
import { inter, notoSansKR } from "./fonts";
import { useReveal } from "./hooks/useReveal";
import { usePrefersReducedMotion } from "./hooks/usePrefersReducedMotion";

export default function PopPage() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const reduced = usePrefersReducedMotion();
  const revealRef = useReveal<HTMLDivElement>();

  useEffect(() => {
    rootRef.current?.classList.add("pop-js");
    window.parent?.postMessage({ type: "oneshot:ready", slug: "pop" }, "*");
  }, []);

  return (
    <div ref={rootRef} className={`${inter.variable} ${notoSansKR.variable} pop-root`}>
      <div ref={revealRef} className="pop-doc">
        <header className="pop-hero" data-reveal="">
          <p className="pop-kicker"><span lang="ko">풍선 만화 가게</span> · BUBBLE COMIC STORE</p>
          <h1 className="pop-title">POP <span lang="ko">팝</span></h1>
          <p className="pop-sub" data-reveal=""><span lang="ko">터지는 풍선.</span> Bubbles that pop.</p>
        </header>
        <section className="pop-body" data-reveal="">
          <p className="pop-body__text">
            <span lang="ko">이 엔트리는 갤러리 50개 로스터의 일부로, 순수 코드로 제작되었습니다. playful-pop 패밀리의 세 번째 엔트리로, STICKER와 BOUNCE와 시각적으로 구별됩니다.</span>
            {" "}This entry is part of the gallery&rsquo;s 50-entry roster, built in pure code. The third playful-pop entry, distinct from STICKER and BOUNCE.
          </p>
        </section>
        <footer className="pop-foot" data-reveal="">
          <p>© 2026 POP · MIT</p>
          <p><span lang="ko">빵</span> · pop!</p>
        </footer>
      </div>
    </div>
  );
}
