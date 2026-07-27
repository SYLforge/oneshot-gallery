"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import "./styles.css";
import { inter, notoSansKR } from "./fonts";
import { useReveal } from "./hooks/useReveal";
import { usePrefersReducedMotion } from "./hooks/usePrefersReducedMotion";
import { useScrollProgress } from "./hooks/useScrollProgress";
import { usePointerParallax } from "./hooks/usePointerParallax";

const TITLE = "FLOW";

/**
 * FLOW — 흐름, 글자의 강. A journaling app whose signature is typography that
 * drifts like water. The hero wordmark's letters drift sideways tied to
 * scroll velocity (char-split-reveal); a pinned verse section holds while the
 * stream of words flows past (scroll-scrub-pinned); and the whole page leans
 * gently toward the pointer (pointer-parallax).
 *
 * `flow-js` is added on mount; without JS the page is a finished, readable
 * journal.
 */
export default function FlowPage() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const reduced = usePrefersReducedMotion();
  const revealRef = useReveal<HTMLDivElement>();
  const verseRef = useScrollProgress<HTMLDivElement>(reduced);
  const parallaxRef = usePointerParallax<HTMLDivElement>(reduced);

  useEffect(() => {
    rootRef.current?.classList.add("flow-js");
    window.parent?.postMessage({ type: "oneshot:ready", slug: "flow" }, "*");
  }, []);

  return (
    <div
      ref={rootRef}
      className={`${inter.variable} ${notoSansKR.variable} flow-root`}
    >
      <div ref={parallaxRef} className="flow-parallax" data-reveal="">
        <header className="flow-hero">
          <p className="flow-kicker">
            <span lang="ko">글자의 강</span> · RIVER OF WORDS
          </p>
          <h1 className="flow-title" aria-label="FLOW 흐름">
            {TITLE.split("").map((ch, i) => (
              <span
                key={i}
                aria-hidden="true"
                className="flow-glyph"
                style={{ "--flow-i": i } as CSSProperties}
              >
                {ch}
              </span>
            ))}
            <span lang="ko" className="flow-title__ko">흐름</span>
          </h1>
          <p className="flow-sub">
            <span lang="ko">글자가 강처럼 흐른다. 멈추지 않고, 서두르지 않고.</span>
            <br />
            Letters drift like a stream — never stopping, never hurrying.
          </p>
        </header>
      </div>

      {/* scroll-scrub-pinned: the pinned verse where words flow past */}
      <section ref={verseRef} className="flow-verse" aria-labelledby="flow-verse-title">
        <div className="flow-verse__inner" data-reveal="">
          <p className="flow-kicker">
            <span lang="ko">흐르는 시</span> · FLOWING VERSE
          </p>
          <h2 id="flow-verse-title" className="flow-verse__title">
            <span lang="ko">물은 아래로, 글자는 옆으로.</span>
          </h2>
          <div className="flow-verse__stream">
            <p className="flow-verse__word" lang="ko">새벽</p>
            <p className="flow-verse__word" lang="ko">비</p>
            <p className="flow-verse__word" lang="ko">창문</p>
            <p className="flow-verse__word" lang="ko">종이</p>
            <p className="flow-verse__word" lang="ko">잉크</p>
            <p className="flow-verse__word" lang="ko">강</p>
            <p className="flow-verse__word" lang="ko">바다</p>
          </div>
          <p className="flow-verse__en">
            <em>
              Dawn · rain · window · paper · ink · river · sea — the journal
              writes itself downstream.
            </em>
          </p>
        </div>
      </section>

      <section className="flow-features" data-reveal="">
        <div className="flow-feature">
          <h3 className="flow-feature__h">
            <span lang="ko">일기</span> · Journal
          </h3>
          <p className="flow-feature__p">
            <span lang="ko">하루 한 줄, 물처럼 흘러.</span> One line a day, like
            water flowing.
          </p>
        </div>
        <div className="flow-feature">
          <h3 className="flow-feature__h">
            <span lang="ko">물결</span> · Ripple
          </h3>
          <p className="flow-feature__p">
            <span lang="ko">글자가 터치에 반응해 일렁인다.</span> Letters ripple
            at your touch.
          </p>
        </div>
        <div className="flow-feature">
          <h3 className="flow-feature__h">
            <span lang="ko">강물</span> · Stream
          </h3>
          <p className="flow-feature__p">
            <span lang="ko">지난 날들이 아래로 흘러간다.</span> Past days drift
            downstream.
          </p>
        </div>
      </section>

      <footer className="flow-foot" data-reveal="">
        <p>© 2026 FLOW · <span lang="ko">흐름</span> · MIT</p>
        <p>
          <span lang="ko">코드로 그렸다 — 물은 멈추지 않는다.</span> drawn in code
          — the water never stops.
        </p>
      </footer>
    </div>
  );
}
