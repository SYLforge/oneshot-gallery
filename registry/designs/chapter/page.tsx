"use client";

import { useEffect, useRef } from "react";
import "./styles.css";
import { inter, notoSansKR } from "./fonts";
import { useReveal } from "./hooks/useReveal";
import { usePrefersReducedMotion } from "./hooks/usePrefersReducedMotion";

export default function ChapterPage() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const reduced = usePrefersReducedMotion();
  const revealRef = useReveal<HTMLDivElement>();

  useEffect(() => {
    rootRef.current?.classList.add("chapter-js");
    window.parent?.postMessage({ type: "oneshot:ready", slug: "chapter" }, "*");
  }, []);

  return (
    <div ref={rootRef} className={`${inter.variable} ${notoSansKR.variable} chapter-root`}>
      <div ref={revealRef} className="chapter-doc">
        <header className="chapter-hero" data-reveal="">
          <p className="chapter-kicker"><span lang="ko">시간의 책</span> · THE BOOK OF HOURS</p>
          <h1 className="chapter-title">CHAPTER <span lang="ko">챕터</span></h1>
          <p className="chapter-sub" data-reveal=""><span lang="ko">각 섹션이 챕터다.</span> Each section a chapter.</p>
        </header>
        <section className="chapter-body" data-reveal="">
          <p className="chapter-body__text">
            <span lang="ko">이 엔트리는 갤러리 50개 로스터의 일부로, 순수 코드로 제작되었습니다. editorial-serif 패밀리의 세 번째 엔트리로, YEOBAEK과 ZINE과 시각적으로 구별됩니다.</span>
            {" "}This entry is part of the gallery&rsquo;s 50-entry roster, built in pure code. The third editorial-serif entry, distinct from YEOBAEK and ZINE.
          </p>
        </section>
        <footer className="chapter-foot" data-reveal="">
          <p>© 2026 CHAPTER · MIT</p>
          <p><span lang="ko">천천히</span> · read slowly</p>
        </footer>
      </div>
    </div>
  );
}
