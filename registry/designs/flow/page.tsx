"use client";

import { useEffect, useRef } from "react";
import "./styles.css";
import { inter, notoSansKR } from "./fonts";
import { useReveal } from "./hooks/useReveal";
import { usePrefersReducedMotion } from "./hooks/usePrefersReducedMotion";

export default function FlowPage() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const reduced = usePrefersReducedMotion();
  const revealRef = useReveal<HTMLDivElement>();

  useEffect(() => {
    rootRef.current?.classList.add("flow-js");
    window.parent?.postMessage({ type: "oneshot:ready", slug: "flow" }, "*");
  }, []);

  return (
    <div
      ref={rootRef}
      className={`${inter.variable} ${notoSansKR.variable} flow-root`}
    >
      <div ref={revealRef} className="flow-doc">
        <header className="flow-hero" data-reveal="">
          <p className="flow-kicker">
            <span lang="ko">글자의 강</span> · RIVER OF WORDS
          </p>
          <h1 className="flow-title">
            FLOW <span lang="ko">흐름</span>
          </h1>
          <p className="flow-sub" data-reveal="">
            <span lang="ko">글자가 강처럼 흐른다.</span> Letters drift like a
            stream.
          </p>
        </header>

        <section className="flow-body" data-reveal="">
          <p className="flow-body__text">
            <span lang="ko">
              이 엔트리는 갤러리 50개 로스터의 일부로, 순수 코드로 제작되었습니다.
              kinetic-typography 패밀리의 세 번째 엔트리로, TYPEWAVE와 STRETCH와
              시각적으로 구별됩니다.
            </span>{" "}
            This entry is part of the gallery&rsquo;s 50-entry roster, built in
            pure code. The third kinetic-typography entry, distinct from
            TYPEWAVE and STRETCH.
          </p>
        </section>

        <footer className="flow-foot" data-reveal="">
          <p>© 2026 FLOW · MIT</p>
          <p>
            <span lang="ko">코드로 그렸다</span> · drawn in code
          </p>
        </footer>
      </div>
    </div>
  );
}
