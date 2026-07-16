"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "../hooks/useInView";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import { useTypewriter } from "../hooks/useTypewriter";

/**
 * Chapter 03 — the live tracker, told as four webtoon beats. Each stage
 * (주문 접수 → 조리 중 → 배달 출발 → 배달 완료) is a row whose Korean
 * label types itself out (technique: typewriter) when it scrolls into view,
 * with the timestamp and machine copy printed beside it as plain text —
 * the way a real delivery app updates, but rendered as a chapter list.
 *
 * The connecting progress line is an SVG tube (technique: svg-line-draw)
 * whose stroke-dashoffset scrubs from full to zero as the active stage
 * advances. Reduced motion: the line is drawn once on mount, the type
 * arrives whole, and the page is fully readable.
 *
 * The component never auto-advances a stage based on time — that would lie
 * about the order. Instead the active stage is the last stage the reader has
 * scrolled past, so the progress bar is honest about what has been read.
 */

type Stage = {
  id: string;
  time: string;
  ko: string;
  en: string;
  note: string;
  noteEn: string;
};

const STAGES: Stage[] = [
  {
    id: "received",
    time: "01:47:32",
    ko: "주문 접수",
    en: "ORDER RECEIVED",
    note: "잠들지 못한 밤, 한 그릇. 접수되었습니다.",
    noteEn: "One bowl, one awake night. Received.",
  },
  {
    id: "cooking",
    time: "01:52:10",
    ko: "조리 중",
    en: "COOKING",
    note: "아직 켜져 있는 주방. 국물이, 끓기 시작했다.",
    noteEn: "The kitchen that never closed. The broth is on.",
  },
  {
    id: "dispatched",
    time: "02:08:55",
    ko: "배달 출발",
    en: "RIDER DISPATCHED",
    note: "라이더 #14, 출발. 네온 사이로, 당신에게.",
    noteEn: "Rider #14, rolling. Through the neon, to you.",
  },
  {
    id: "delivered",
    time: "02:23:41",
    ko: "배달 완료",
    en: "DELIVERED",
    note: "문 앞에, 따뜻하게. 잘 드세요. — 좋은 밤 되세요.",
    noteEn: "At your door, still warm. Eat well — and good night.",
  },
];

function StageRow({
  stage,
  index,
  active,
  reduced,
}: {
  stage: Stage;
  index: number;
  active: boolean;
  reduced: boolean;
}) {
  const rowRef = useRef<HTMLLIElement | null>(null);
  const { seen } = useInView<HTMLLIElement>(rowRef, { threshold: 0.6 });
  // Start typing once the row has been seen. Reduced motion collapses the
  // step to 1ms/glyph so the text lands in a few frames.
  const start = seen;
  const typeRef = useTypewriter<HTMLSpanElement>(
    stage.ko,
    start,
    reduced ? 1 : 60,
  );

  return (
    <li
      ref={rowRef}
      className={`moonlit-track__row${active ? " is-active" : ""}`}
      data-stage={stage.id}
      style={{ ["--moonlit-row" as string]: index }}
    >
      <span className="moonlit-track__time moonlit-mono">{stage.time}</span>
      <span className="moonlit-track__node" aria-hidden="true">
        <span className="moonlit-track__dot" />
      </span>
      <div className="moonlit-track__body">
        <h3 className="moonlit-track__label">
          <span lang="ko">
            <span className="moonlit-sr">{stage.ko}</span>
            <span aria-hidden="true" ref={typeRef} />
            <span
              className="moonlit-status__cursor is-typing"
              aria-hidden="true"
            >
              ▋
            </span>
          </span>
          <span className="moonlit-track__en moonlit-mono">{stage.en}</span>
        </h3>
        <p className="moonlit-track__note" lang="ko">
          {stage.note}
        </p>
        <p className="moonlit-track__note-en">{stage.noteEn}</p>
      </div>
    </li>
  );
}

export default function DeliveryTracker() {
  const reduced = usePrefersReducedMotion();
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [activeStage, setActiveStage] = useState(0);

  // Advance the active stage as rows enter the viewport — no timers, no lies.
  // Each row reports its index when it crosses the threshold; the active
  // stage is the max index seen so far, so the progress bar is monotonic.
  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const rows = Array.from(
      wrap.querySelectorAll<HTMLLIElement>("[data-stage]"),
    );
    if (reduced || !("IntersectionObserver" in window)) {
      setActiveStage(rows.length - 1);
      return;
    }
    const io = new IntersectionObserver(
      (hits) => {
        for (const hit of hits) {
          if (!hit.isIntersecting) continue;
          const idx = Number(
            (hit.target as HTMLElement).style.getPropertyValue(
              "--moonlit-row",
            ),
          );
          if (!Number.isNaN(idx)) {
            setActiveStage((prev) => Math.max(prev, idx));
          }
        }
      },
      { threshold: 0.65, rootMargin: "0px 0px -20% 0px" },
    );
    for (const r of rows) io.observe(r);
    return () => io.disconnect();
  }, [reduced]);

  const progress = activeStage / (STAGES.length - 1);

  return (
    <section className="moonlit-track" aria-labelledby="moonlit-track-title">
      <p className="moonlit-eyebrow moonlit-mono" data-reveal aria-hidden="true">
        CH. 03 — 실시간 배달 · LIVE TRACKER
      </p>
      <h2 className="moonlit-sechead" id="moonlit-track-title" data-reveal>
        One order, four chapters{" "}
        <span lang="ko" className="moonlit-sechead__ko">
          한 건의 주문, 네 개의 페이지
        </span>
      </h2>
      <p className="moonlit-track__intro" data-reveal>
        Below is the live tracker for order{" "}
        <span className="moonlit-mono">#A14-0238</span> — but read it like a
        webtoon chapter. Each line is a panel.{" "}
        <span lang="ko">
          아래는 주문 #A14-0238 의 실시간 배달 현황입니다. 다만, 웹툰 한 화를
          읽듯이 — 한 줄이 곧 한 패널.
        </span>
      </p>

      <div className="moonlit-track__wrap" ref={wrapRef}>
        {/* The SVG progress tube — drawn top-to-bottom as the active stage
            advances. Path length 400; dashoffset = 400 * (1 - progress). */}
        <svg
          className="moonlit-track__line"
          viewBox="0 0 4 400"
          preserveAspectRatio="none"
          aria-hidden="true"
          focusable="false"
        >
          <defs>
            <filter
              id="moonlit-track-glow"
              x="-200%"
              y="-10%"
              width="500%"
              height="120%"
            >
              <feGaussianBlur stdDeviation="1.2" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <line
            className="moonlit-track__line-bg"
            x1="2"
            y1="0"
            x2="2"
            y2="400"
            strokeWidth="2"
          />
          <line
            className="moonlit-track__line-fg"
            x1="2"
            y1="0"
            x2="2"
            y2="400"
            strokeWidth="2"
            filter="url(#moonlit-track-glow)"
            style={{ ["--moonlit-progress" as string]: progress }}
          />
        </svg>

        <ol className="moonlit-track__list">
          {STAGES.map((stage, i) => (
            <StageRow
              key={stage.id}
              stage={stage}
              index={i}
              active={i <= activeStage}
              reduced={reduced}
            />
          ))}
        </ol>
      </div>
    </section>
  );
}
