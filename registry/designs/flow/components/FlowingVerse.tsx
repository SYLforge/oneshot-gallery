"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { VERSES } from "./words";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

/** Per-frame lerp toward the scroll target, normalized to 60fps. */
const SCROLL_LERP = 0.09;

/**
 * 흐르는 시 — the pinned verse where the stanzas flow past.
 *
 * The page's scroll-scrub-pinned technique made legible. The outer section
 * is tall (400vh — one viewport per stanza plus a little), and the inner
 * stage is `position: sticky`, so the visitor scrolls through four
 * verse-heights of the same scene. One scroll-progress value
 * (`--flow-scrub`, 0→1) drives everything:
 *   - each verse dissolves in as its quarter of the scroll arrives, and
 *     dissolves out as the next quarter takes over;
 *   - a single ambient wordmark above the verses shifts its letter-spacing
 *     from tight to open as the scroll deepens — the river widening.
 *
 * Without JS, and under reduced motion (where this hook does nothing),
 * every verse is shown stacked and readable, and `--flow-scrub` defaults to
 * 1 — the river, already at the sea.
 */
export default function FlowingVerse() {
  const reduced = usePrefersReducedMotion();
  const pinRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = pinRef.current;
    if (!el) return;

    // Always set a value; default 1 = "fully scrolled", the no-JS / reduced
    // state shows the last verse (memory, "all into the same sea").
    el.style.setProperty("--flow-scrub", reduced ? "1" : "0");
    if (reduced) return;

    let raf = 0;
    let running = false;
    let inView = false;
    let value = 0;
    let last = 0;

    const compute = (): number => {
      const rect = el.getBoundingClientRect();
      const span = Math.max(1, rect.height - window.innerHeight);
      const traveled = Math.min(Math.max(-rect.top, 0), span);
      return traveled / span;
    };

    const step = (now: number) => {
      raf = requestAnimationFrame(step);
      const dt = Math.min(now - last, 48);
      last = now;
      const target = compute();
      const next = value + (target - value) * SCROLL_LERP * (dt / 16.7);
      if (Math.abs(next - value) < 0.0002) return;
      value = next;
      el.style.setProperty("--flow-scrub", value.toFixed(4));
    };

    const start = () => {
      if (running) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(step);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    const io = new IntersectionObserver(
      (hits) => {
        inView = hits[hits.length - 1].isIntersecting;
        if (inView && !document.hidden) start();
        else stop();
      },
      { rootMargin: "40px 0px 40px 0px" },
    );
    io.observe(el);

    const onVisibility = () => {
      if (document.hidden) stop();
      else if (inView) start();
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      stop();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      el.style.removeProperty("--flow-scrub");
    };
  }, [reduced]);

  return (
    <section
      id="flow-verse"
      className="flow-verse"
      aria-labelledby="flow-verse-title"
    >
      <div ref={pinRef} className="flow-verse__pin">
        <div className="flow-verse__head" data-reveal="">
          <p className="flow-kicker">
            <span lang="ko">흐르는 시</span> · FLOWING VERSE
          </p>
          <h2 id="flow-verse-title" className="flow-verse__title">
            <span lang="ko">물은 아래로, 글자는 옆으로.</span>
          </h2>
          <p className="flow-verse__lede">
            <em>Scroll, and the verses flow past — one river, four readings.</em>
            <span lang="ko">스크롤하면 시가 흘러간다 — 하나의 강, 네 번의 읽기.</span>
          </p>
        </div>

        <ol className="flow-verse__stages">
          {VERSES.map((v) => {
            // Each stanza owns a quarter of the scroll. Its dissolve window is
            // centred on its quarter, so it fades in slightly early and out
            // slightly late — a soft crossfade, not a hard cut.
            const center = (v.stage + 0.5) / VERSES.length;
            const half = 0.5 / VERSES.length + 0.04;
            return (
              <li
                key={v.stage}
                className="flow-verse__stage"
                style={
                  {
                    "--flow-c": center.toFixed(4),
                    "--flow-h": half.toFixed(4),
                  } as CSSProperties
                }
              >
                <p className="flow-verse__no">
                  <span lang="ko">{v.ko}</span>
                  <span className="flow-verse__no-en"> · {v.en}</span>
                </p>
                <div className="flow-verse__lines">
                  {v.lines.map((ln, i) => (
                    <p key={i} className="flow-verse__line">
                      <span className="flow-verse__ko" lang="ko">
                        {ln.ko}
                      </span>
                      <span className="flow-verse__en">{ln.en}</span>
                    </p>
                  ))}
                </div>
              </li>
            );
          })}
        </ol>

        <p className="flow-verse__caption">
          <span lang="ko">네 편의 시가 같은 강물을 흐른다.</span>{" "}
          <em>Four verses, one current.</em>
        </p>
      </div>
    </section>
  );
}
