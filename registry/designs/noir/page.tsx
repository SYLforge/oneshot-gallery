"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import "./styles.css";
import { inter, notoSansKR } from "./fonts";
import { useReveal } from "./hooks/useReveal";
import { usePrefersReducedMotion } from "./hooks/usePrefersReducedMotion";
import { useScrollProgress } from "./hooks/useScrollProgress";

const TITLE = "NOIR";
const SCENES = [
  { ko: "사무실, 밤 11시. 블라인드 사이로 가로등 빛이 줄무늬를 만든다.", en: "The office, 11 PM. Streetlight through the blinds makes stripes." },
  { ko: "재떨이에 꽁초가 세 개. 커피는 식었다. 사건은 식지 않았다.", en: "Three butts in the ashtray. Coffee cold. The case wasn't." },
  { ko: "비가 온다. 늘 비가 온다. 이 도시에서 진실은 젖어 있다.", en: "It rains. It always rains. In this city, truth is wet." },
];

/**
 * NOIR — 느와르, 흑백 영화. Cinematic-dark entry in pure black and white:
 * venetian-blind shadows (clip-path-reveal), hard-boiled title glyphs
 * (char-split-reveal), and a pinned scene sequence (scroll-scrub-pinned).
 * Distinct from HALFLIGHT (color procedural) and REEL (warm analog).
 */
export default function NoirPage() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const reduced = usePrefersReducedMotion();
  const revealRef = useReveal<HTMLDivElement>();
  const sceneRef = useScrollProgress<HTMLDivElement>(reduced);

  useEffect(() => {
    rootRef.current?.classList.add("noir-js");
    window.parent?.postMessage({ type: "oneshot:ready", slug: "noir" }, "*");
  }, []);

  return (
    <div ref={rootRef} className={`${inter.variable} ${notoSansKR.variable} noir-root`}>
      {/* venetian-blind shadow overlay — clip-path-reveal signature */}
      <div className="noir-blinds" aria-hidden="true" />

      <div ref={revealRef} className="noir-doc">
        <header className="noir-hero">
          <p className="noir-kicker"><span lang="ko">흑백 영화</span> · BLACK AND WHITE CINEMA</p>
          <h1 className="noir-title" aria-label="NOIR 느와르">
            {TITLE.split("").map((ch, i) => (
              <span key={i} aria-hidden="true" className="noir-glyph" style={{ "--noir-i": i } as CSSProperties}>{ch}</span>
            ))}
          </h1>
          <p className="noir-title__ko" lang="ko">느와르</p>
          <p className="noir-sub"><span lang="ko">블라인드. 담배 연기. 거친 활자.</span> Venetian blinds. Cigarette smoke. Hard-boiled type.</p>
        </header>

        {/* scroll-scrub-pinned: the scene sequence */}
        <section ref={sceneRef} className="noir-scenes">
          {SCENES.map((s, i) => (
            <div key={i} className="noir-scene" data-reveal="" style={{ "--noir-scene": i } as CSSProperties}>
              <p className="noir-scene__no">{String(i + 1).padStart(2, "0")}</p>
              <p className="noir-scene__text" lang="ko">{s.ko}</p>
              <p className="noir-scene__en"><em>{s.en}</em></p>
            </div>
          ))}
        </section>

        <footer className="noir-foot" data-reveal="">
          <p>© 2026 NOIR · <span lang="ko">느와르</span> · MIT</p>
          <p><span lang="ko">끝 — 화면은 어둡다.</span> THE END — fade to black.</p>
        </footer>
      </div>
    </div>
  );
}
