"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import BloomCanvas from "./BloomCanvas";
import { useScrollProgress } from "../hooks/useScrollProgress";

/** The four verses of mono no aware — the gentle sorrow of transient beauty.
 *  Each is Korean (main voice) + Japanese (source) + English (subtitle).
 *  Order: arrival → bloom → fall → memory. */
const VERSES: {
  ko: string[];
  ja: string[];
  en: string;
  num: string;
}[] = [
  {
    num: "一",
    ko: ["먹방울 하나,", "밤하늘에서 떨어진다."],
    ja: ["墨のしずくひとつ、", "夜の空から落ちる。"],
    en: "One drop of ink, falling through the night.",
  },
  {
    num: "二",
    ko: ["물에 닿아,", "꽃으로 피어난다."],
    ja: ["水に触れ、", "花として咲く。"],
    en: "It meets the water, and blooms into a flower.",
  },
  {
    num: "三",
    ko: ["바람에 흩날려,", "천천히 진다."],
    ja: ["風に散り、", "ゆっくりと朽ちる。"],
    en: "It scatters on the wind, and slowly fades.",
  },
  {
    num: "四",
    ko: ["사라진 자리에,", "기억만 남는다."],
    ja: ["消えたあとに、", "記憶だけが残る。"],
    en: "Where it was, only the memory remains.",
  },
];

/** Map scroll progress (0..1) onto a verse index. Each verse owns a 0.25-wide
 *  window. */
function verseForProgress(p: number): number {
  return Math.min(VERSES.length - 1, Math.floor(p * VERSES.length));
}

/**
 * Section 02 — the pinned verses. A tall section (≈2.5 viewports) whose
 * inner stage is position: sticky for the scroll length; as progress runs
 * 0→1, the bloom canvas accumulates petals (density floor rises with
 * progress) and the four verses crossfade in sequence. Scrubbing back clears
 * them — petals are not permanent, which is the whole point of mono no aware.
 *
 * The verse marker (一二三四) sets vertically in Shippori Mincho; the Korean
 * body in Noto Serif KR is the voice that speaks; the Japanese source sits
 * beside it; the English subtitle is the quiet translation beneath. Reduced
 * motion: the first verse is shown statically, the canvas paints one composed
 * bloom — the page is a finished garden, not a paused video.
 */
export default function VerseScrub() {
  const { ref, progress } = useScrollProgress<HTMLDivElement>();

  return (
    <section
      className="sakura-verses"
      aria-labelledby="sakura-verses-title"
      ref={ref}
      style={
        { "--sakura-verse-count": VERSES.length } as CSSProperties
      }
    >
      {/* The sticky stage holds for the whole scroll length. */}
      <div className="sakura-verses__pin">
        <div className="sakura-verses__sechead" data-reveal="">
          <p className="sakura-eyebrow" aria-hidden="true">
            <span lang="ko">02 — 것의 아와레</span>{" "}
            <span lang="ja">もののあわれ</span>
          </p>
          <h2 className="sakura-verses__title" id="sakura-verses-title">
            <span lang="ko">넉 편의 시</span>{" "}
            <span lang="ja" className="sakura-verses__titleja">
              四つの句
            </span>
          </h2>
        </div>

        {/* The bloom canvas in this section reads the progress ref, so
            petals accumulate as you read and clear as you leave. */}
        <BloomCanvas
          className="sakura-verses__bloom"
          progress={progress}
          ariaLabel="스크롤에 따라 벚꽃잎이 쌓이고 지워지는 장면. Petals accumulate as you scroll through the verses, and clear as you leave."
        />

        <VerseStack progress={progress} />

        <p className="sakura-verses__caption" data-reveal>
          <span lang="ko">
            스크롤을 천천히 움직여 보세요. 꽃잎이 당신의 읽기에 맞춰 피고
            집니다.
          </span>{" "}
          <span lang="en">
            Scroll slowly. The petals bloom and clear to the pace of your
            reading — nothing here is meant to stay.
          </span>
        </p>
      </div>
    </section>
  );
}

/**
 * Renders all four verses stacked absolutely; a rAF loop writes
 * --sakura-verse-p (smoothed 0..1) onto the stack so CSS crossfades the
 * active verse. Each verse carries its index as data-i; CSS shows the one
 * whose 0.25-wide window contains p, with a soft crossfade at the edges.
 * The loop also manages aria-hidden so only the active verse is read by AT.
 */
function VerseStack({
  progress,
}: {
  progress: React.RefObject<{ p: number; raw: number; t: number }>;
}) {
  const stackRef = useRef<HTMLDivElement | null>(null);
  const smoothed = useRef(0);

  useEffect(() => {
    let raf = 0;
    let last = 0;
    const FRAME_MS = 15.5;
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      if (now - last < FRAME_MS) return;
      const dt = Math.min(now - last, 48) / 1000;
      last = now;
      const raw = progress.current?.raw ?? 0;
      // lerp smoothed toward raw, frame-rate normalized
      smoothed.current += (raw - smoothed.current) * (1 - Math.exp(-dt * 8));
      const stack = stackRef.current;
      if (!stack) return;
      stack.style.setProperty("--sakura-verse-p", String(smoothed.current));
      const active = verseForProgress(smoothed.current);
      // data-active drives the CSS that crossfades verses; set once per change.
      if (stack.getAttribute("data-active") !== String(active)) {
        stack.setAttribute("data-active", String(active));
        const verses = stack.querySelectorAll<HTMLElement>(".sakura-verse");
        verses.forEach((el, i) => {
          if (i === active) el.removeAttribute("aria-hidden");
          else el.setAttribute("aria-hidden", "true");
        });
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [progress]);

  return (
    <div className="sakura-verses__stack" ref={stackRef}>
      {VERSES.map((v, i) => (
        <article
          key={v.num}
          className="sakura-verse"
          data-i={i}
          aria-hidden={i === 0 ? undefined : "true"}
        >
          <span className="sakura-verse__num" lang="ja" aria-hidden="true">
            {v.num}
          </span>
          <div className="sakura-verse__body">
            <p className="sakura-verse__ko" lang="ko">
              {v.ko.map((line, k) => (
                <span
                  key={k}
                  className="sakura-verse__line"
                  style={
                    { "--kd": `${200 + k * 540}ms` } as CSSProperties
                  }
                >
                  {line}
                </span>
              ))}
            </p>
            <p className="sakura-verse__ja" lang="ja">
              {v.ja.map((line, k) => (
                <span key={k} className="sakura-verse__jline">
                  {line}
                </span>
              ))}
            </p>
            <p className="sakura-verse__en" lang="en">
              {v.en}
            </p>
          </div>
        </article>
      ))}
    </div>
  );
}
