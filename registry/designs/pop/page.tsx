"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import "./styles.css";
import { fredoka, notoSansKR } from "./fonts";
import { useReveal } from "./hooks/useReveal";
import { usePrefersReducedMotion } from "./hooks/usePrefersReducedMotion";
import { usePointerParallax } from "./hooks/usePointerParallax";

const TITLE = "POP";
const COMICS = [
  { ko: "풍선이 빵! 하고 터진다.", en: "The bubble goes POP!" },
  { ko: "만화가 짠! 하고 펼쳐진다.", en: "The comic unfurls!" },
  { ko: "색깔이 쨍! 하고 퍼진다.", en: "Color splashes!" },
];

/**
 * POP — 팝, 풍선 만화 가게. Playful-pop entry where bubbles pop on click
 * (spring-press), headlines bounce in (char-split-reveal), and floating
 * shapes drift toward the pointer (pointer-parallax).
 */
export default function PopPage() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const reduced = usePrefersReducedMotion();
  const revealRef = useReveal<HTMLDivElement>();
  const stageRef = usePointerParallax<HTMLDivElement>(reduced);
  const [popped, setPopped] = useState<number[]>([]);

  useEffect(() => {
    rootRef.current?.classList.add("pop-js");
    window.parent?.postMessage({ type: "oneshot:ready", slug: "pop" }, "*");
  }, []);

  const togglePop = (i: number) => {
    setPopped((prev) => (prev.includes(i) ? prev.filter((p) => p !== i) : [...prev, i]));
  };

  return (
    <div ref={rootRef} className={`${fredoka.variable} ${notoSansKR.variable} pop-root`}>
      <div ref={revealRef} className="pop-doc">
        <header className="pop-hero">
          <p className="pop-kicker"><span lang="ko">풍선 만화 가게</span> · BUBBLE COMIC STORE</p>
          <h1 className="pop-title" aria-label="POP 팝">
            {TITLE.split("").map((ch, i) => (
              <span key={i} aria-hidden="true" className="pop-glyph" style={{ "--pop-i": i } as CSSProperties}>{ch}</span>
            ))}
          </h1>
          <p className="pop-title__ko" lang="ko">팝!</p>
          <p className="pop-sub"><span lang="ko">터지는 풍선, 펼쳐지는 만화.</span> Bubbles that pop, comics that unfurl.</p>
        </header>

        {/* spring-press: clickable bubbles that pop */}
        <section ref={stageRef} className="pop-bubbles" data-reveal="">
          <h2 className="pop-secthead"><span lang="ko">터뜨려 보세요</span> · POP THE BUBBLES</h2>
          <div className="pop-bubble-grid">
            {COMICS.map((c, i) => (
              <button
                key={i}
                type="button"
                className={`pop-bubble ${popped.includes(i) ? "is-popped" : ""}`}
                onClick={() => togglePop(i)}
                style={{ "--pop-c": ["#f472b6", "#7dd3fc", "#fde047"][i] } as CSSProperties}
                aria-label={`${c.ko} ${c.en}`}
              >
                <span className="pop-bubble__text" lang="ko">{c.ko}</span>
                <span className="pop-bubble__sfx">{popped.includes(i) ? "빵!" : "POP!"}</span>
              </button>
            ))}
          </div>
          <p className="pop-hint"><span lang="ko">풍선을 누르면 터진다!</span> Click a bubble to pop it!</p>
        </section>

        <footer className="pop-foot" data-reveal="">
          <p>© 2026 POP · <span lang="ko">팝</span> · MIT</p>
          <p><span lang="ko">빵! — 코드로 그렸다.</span> POP! — drawn in code.</p>
        </footer>
      </div>
    </div>
  );
}
