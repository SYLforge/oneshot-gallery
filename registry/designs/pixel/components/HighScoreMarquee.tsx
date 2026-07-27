"use client";

import { useEffect, useRef, type RefObject } from "react";

/** Ticker speed in px/second: resting drift, and what full rush adds. */
const BASE_PX_S = 44;
const RUSH_PX_S = 240;

/**
 * Chiptune credits + high-score table, one continuous line. Each entry is
 * a real fictional score with a real fictional player initial, written in
 * the arcade's bilingual voice — cheerful, competitive, a little boastful.
 */
const ROWS = [
  { rank: "1UP", score: "9999990", name: "PIX", ko: "최고기록" },
  { rank: "2UP", score: "0842300", name: "KYU", ko: "은메달" },
  { rank: "3UP", score: "0710042", name: "NEO", ko: "동메달" },
  { rank: "4UP", score: "0500128", name: "ARI", ko: "콤보 마스터" },
  { rank: "5UP", score: "0299001", name: "ZAI", ko: "숨은 주인공" },
  { rank: "6UP", score: "0128000", name: "MOO", ko: "계속 도전 중" },
] as const;

const CREDITS = [
  "PIXEL ARCADE STUDIO · EST. 2003 · SEOUL",
  "SOUND DRIVER — DUNGEON SOUND TEAM",
  "PIXEL ART — ARI & KYU",
  "DESIGN — NEO",
  "SPECIAL THANKS — EVERY QUARTER YOU SPENT",
] as const;

type Props = {
  reduced: boolean;
  /** Live scroll rush energy 0→1 from useScrollRush — read inside rAF. */
  energyRef: RefObject<number>;
};

/**
 * The high-score marquee: one JS-driven ticker whose speed is coupled to
 * scroll rush — read slowly and the credits drift by; scroll and the
 * scoreboard hurries after you. The moving track is aria-hidden and
 * duplicated once for a seamless wrap; screen readers get the scores and
 * credits exactly once from a visually-hidden list. Without JavaScript
 * (or with reduced motion) the strip is simply a static line.
 */
export default function HighScoreMarquee({ reduced, energyRef }: Props) {
  const clipRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (reduced) return;
    const clip = clipRef.current;
    const track = trackRef.current;
    if (!clip || !track) return;

    let raf = 0;
    let running = false;
    let visible = true;
    let x = 0;
    let runW = 0;
    let last = 0;

    const measure = () => {
      runW = track.scrollWidth / 2; // two identical runs
    };

    const step = (now: number) => {
      raf = requestAnimationFrame(step);
      const dt = Math.min(now - last, 64);
      last = now;
      x -= (dt / 1000) * (BASE_PX_S + energyRef.current * RUSH_PX_S);
      if (runW > 0 && -x >= runW) x += runW;
      track.style.transform = `translate3d(${x.toFixed(2)}px, 0, 0)`;
    };

    const sync = () => {
      const should = visible && !document.hidden;
      if (should && !running) {
        running = true;
        last = performance.now();
        raf = requestAnimationFrame(step);
      } else if (!should && running) {
        running = false;
        cancelAnimationFrame(raf);
      }
    };

    const onVisibility = () => sync();

    const io = new IntersectionObserver((hits) => {
      visible = hits[hits.length - 1].isIntersecting;
      sync();
    });
    io.observe(clip);

    const ro = new ResizeObserver(measure);
    ro.observe(track);

    document.addEventListener("visibilitychange", onVisibility);
    measure();
    sync();

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      track.style.transform = "";
    };
  }, [reduced, energyRef]);

  return (
    <section className="pixel-marquee" aria-label="High scores and credits">
      <ul className="pixel-sr">
        {ROWS.map((r) => (
          <li key={r.rank}>
            {r.rank} {r.score} {r.name} —{" "}
            <span lang="ko">{r.ko}</span>
          </li>
        ))}
        {CREDITS.map((c) => (
          <li key={c}>{c}</li>
        ))}
      </ul>
      <div ref={clipRef} className="pixel-marquee__clip" aria-hidden="true">
        <div ref={trackRef} className="pixel-marquee__track">
          {[0, 1].map((copy) => (
            <div key={copy} className="pixel-marquee__run">
              {ROWS.map((r) => (
                <span key={r.rank} className="pixel-marquee__score">
                  <span className="pixel-marquee__rank">{r.rank}</span>
                  <span className="pixel-marquee__num">{r.score}</span>
                  <span className="pixel-marquee__name">{r.name}</span>
                  <span className="pixel-marquee__ko" lang="ko">
                    {r.ko}
                  </span>
                </span>
              ))}
              {CREDITS.map((c, i) => (
                <span key={i} className="pixel-marquee__credit">
                  <span className="pixel-marquee__star">★</span>
                  {c}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
