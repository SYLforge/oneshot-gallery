"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import "./styles.css";
import { inter, notoSansKR } from "./fonts";
import { useReveal } from "./hooks/useReveal";
import { usePrefersReducedMotion } from "./hooks/usePrefersReducedMotion";
import { useScrollProgress } from "./hooks/useScrollProgress";

const TITLE = "CHAPTER";

const CHAPTERS = [
  { no: "I", ko_title: "새벽", en_title: "Dawn", ko: "첫 장이 열린다. 잉크 냄새, 종이의 결, 창밖의 여명. 시간이 여기서 느려진다.", en: "The first page opens. Ink smell, paper grain, dawn beyond the window. Time slows here." },
  { no: "II", ko_title: "정오", en_title: "Noon", ko: "햇빛이 페이지 위에 떨어진다. 그림자가 글자 사이를 걷는다. 독자는 숨을 죽인다.", en: "Sunlight falls on the page. Shadows walk between letters. The reader holds their breath." },
  { no: "III", ko_title: "황혼", en_title: "Dusk", ko: "빛이 물러난다. 남은 것은 종이 위의 자국뿐. 읽는다는 것은 흔적을 따라가는 일이다.", en: "Light retreats. What remains are marks on paper. To read is to follow traces." },
];

/**
 * CHAPTER — 챕터, 시간의 책. Editorial-serif entry: a digital book where each
 * section is a chapter with drop caps and marginalia. scroll-scrub-pinned
 * (a pinned title page that resolves as you scroll), char-split-reveal
 * (drop-cap glyphs), clip-path-reveal (chapters wipe in).
 */
export default function ChapterPage() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const reduced = usePrefersReducedMotion();
  const revealRef = useReveal<HTMLDivElement>();
  const titleRef = useScrollProgress<HTMLDivElement>(reduced);

  useEffect(() => {
    rootRef.current?.classList.add("chapter-js");
    window.parent?.postMessage({ type: "oneshot:ready", slug: "chapter" }, "*");
  }, []);

  return (
    <div ref={rootRef} className={`${inter.variable} ${notoSansKR.variable} chapter-root`}>
      <div ref={revealRef} className="chapter-doc">
        {/* scroll-scrub-pinned: the title page */}
        <section ref={titleRef} className="chapter-titlepage">
          <p className="chapter-kicker"><span lang="ko">시간의 책</span> · THE BOOK OF HOURS</p>
          <h1 className="chapter-title" aria-label="CHAPTER 챕터">
            {TITLE.split("").map((ch, i) => (
              <span key={i} aria-hidden="true" className="chapter-glyph" style={{ "--ch-i": i } as CSSProperties}>{ch}</span>
            ))}
          </h1>
          <p className="chapter-title__ko" lang="ko">챕터</p>
          <p className="chapter-titlepage__line"><span lang="ko">각 섹션이 챕터다.</span> Each section a chapter.</p>
        </section>

        {/* Chapters with drop-cap char-split + clip-path reveal */}
        <main className="chapter-body">
          {CHAPTERS.map((c) => (
            <article key={c.no} className="chapter-chap" data-reveal="">
              <div className="chapter-chap__head">
                <span className="chapter-chap__no">{c.no}</span>
                <h2 className="chapter-chap__title">
                  <span lang="ko">{c.ko_title}</span>
                  <em className="chapter-chap__en">{c.en_title}</em>
                </h2>
              </div>
              <p className="chapter-chap__text">
                <span className="chapter-dropcap" aria-hidden="true">{c.ko_title[0]}</span>
                <span lang="ko">{c.ko}</span>
              </p>
              <p className="chapter-chap__text chapter-chap__text--en">
                <em>{c.en}</em>
              </p>
              <aside className="chapter-marginalia" data-reveal="">
                <span lang="ko">여백의 메모 — 이 챕터는 천천히 읽어야 한다.</span>
              </aside>
            </article>
          ))}
        </main>

        <footer className="chapter-foot" data-reveal="">
          <p>© 2026 CHAPTER · <span lang="ko">시간의 책</span> · MIT</p>
          <p><span lang="ko">천천히 읽어라 — 시간은 기다린다.</span> read slowly — time waits.</p>
        </footer>
      </div>
    </div>
  );
}
