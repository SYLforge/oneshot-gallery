"use client";

import { type CSSProperties } from "react";
import { useSpriteScrub } from "../hooks/useSpriteScrub";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

/**
 * Chapter 02 — the cooking sprite sequence. The `sprite-scrub` technique,
 * with code-drawn sprites instead of an image strip (this is a `media.source:
 * "code"` entry). A stack of frames — each a pure CSS drawing of the steam
 * plume + halftone-dot heat field at a different phase of cooking — sits
 * inside a pinned-tall stage; as you scroll through the stage, `useSpriteScrub`
 * writes `--ns-steam` ∈ [0,1] and styles.css maps that to each frame's
 * opacity (a triangular window per frame, so only ~3 are ever meaningfully
 * visible — a crossfade, not a flip).
 *
 * Six frames: raw (no steam) → warming (faint plume, sparse dots) → searing
 * (tall plume, dense dots, 치치칵! SFX) → cooking → almost-done → plated
 * (food darker via per-frame filter, plume settling, 냠냠! SFX). Each frame
 * carries its own `--ns-c` (center, where it peaks) and `--ns-h`
 * (half-window). The opacity math lives in styles.css.
 *
 * Under reduced motion the hook never attaches; styles.css pins `--ns-steam`
 * at 1 (the plated/cooked end state), so the final frame is fully visible and
 * the food is done. Without JS, `--ns-steam` stays at its declared 0 (raw),
 * which is also a legitimate, readable frame — the grill is on, the food is
 * going on.
 *
 * The scrub rail on the right is the page's honesty: this is scrubbed by your
 * scroll, not by a timer.
 */
const FRAMES = [
  {
    c: 0.0,
    h: 0.18,
    phase: { ko: "01 · 생고기", en: "RAW" },
    sfx: "",
    plume: { opacity: 0, scale: 0.6 },
    dotSize: 1,
    dotOpacity: 0.08,
  },
  {
    c: 0.2,
    h: 0.16,
    phase: { ko: "02 · 불 올라간다", en: "FIRE ON" },
    sfx: "",
    plume: { opacity: 0.4, scale: 0.75 },
    dotSize: 1.2,
    dotOpacity: 0.18,
  },
  {
    c: 0.4,
    h: 0.15,
    phase: { ko: "03 · 지지는 소리", en: "SEARING" },
    sfx: "치치칵!",
    plume: { opacity: 0.85, scale: 1 },
    dotSize: 1.6,
    dotOpacity: 0.34,
  },
  {
    c: 0.6,
    h: 0.15,
    phase: { ko: "04 · 굽는 중", en: "COOKING" },
    sfx: "츄아아—",
    plume: { opacity: 0.9, scale: 1.1 },
    dotSize: 1.8,
    dotOpacity: 0.4,
  },
  {
    c: 0.8,
    h: 0.15,
    phase: { ko: "05 · 다 됐다", en: "ALMOST DONE" },
    sfx: "",
    plume: { opacity: 0.6, scale: 1.05 },
    dotSize: 1.5,
    dotOpacity: 0.28,
  },
  {
    c: 1.0,
    h: 0.18,
    phase: { ko: "06 · 한 접시 · 나왔습니다", en: "PLATED" },
    sfx: "냠냠!",
    plume: { opacity: 0.3, scale: 0.9 },
    dotSize: 1.2,
    dotOpacity: 0.16,
  },
] as const;

export default function SteamScrub() {
  const reduced = usePrefersReducedMotion();
  const stageRef = useSpriteScrub<HTMLDivElement>(reduced);

  return (
    <section
      className="ns-cook"
      aria-labelledby="ns-cook-title"
      data-reveal="panel"
    >
      <div className="ns-cook__intro">
        <p className="ns-eyebrow" data-reveal>
          <span lang="ko">02화 · 불 앞에서</span>
          <span>CH. 02 — AT THE GRILL</span>
        </p>
        <h2 className="ns-sechead" id="ns-cook-title" data-reveal>
          <span className="ns-sechead__ko" lang="ko">
            스크롤하면 익어간다
          </span>
          <span className="ns-sechead__en">Scroll to cook the skewer</span>
        </h2>
        <p data-reveal>
          <span lang="ko">
            한 꼬치가 불에 올라가 한 접시가 되기까지, 여섯 장면. 스크롤이 곧
            시간이다 — 비디오가 아니라, 코드로 그린 스프라이트 여섯 장을 당신의
            스크롤이 스크럽한다.
          </span>
          Six frames from skewer-on-the-grill to a plated dish. The scroll is
          the timeline — no video, just six code-drawn sprite frames your scroll
          scrubs through.
        </p>
      </div>

      <div className="ns-cook__stage" ref={stageRef}>
        {/* the grill + skewers — present in every frame, the anchor */}
        <div className="ns-cook__grill" aria-hidden="true" />
        <div className="ns-cook__skewer" aria-hidden="true" />
        <div className="ns-cook__skewer ns-cook__skewer--2" aria-hidden="true" />
        <div className="ns-cook__skewer ns-cook__skewer--3" aria-hidden="true" />

        {/* the sprite frames — each a CSS steam plume + halftone heat field.
            opacity is driven by --ns-steam via the per-frame --ns-c / --ns-h. */}
        {FRAMES.map((f, i) => (
          <div
            key={i}
            className="ns-cook__frame"
            aria-hidden="true"
            style={
              {
                "--ns-c": f.c,
                "--ns-h": f.h,
              } as CSSProperties
            }
          >
            <div
              className="ns-cook__plume"
              style={{
                opacity: f.plume.opacity,
                transform: `translateX(-50%) scale(${f.plume.scale})`,
              }}
            />
            <div
              className="ns-cook__heat"
              style={{
                backgroundSize: `${14 / f.dotSize}px ${14 / f.dotSize}px`,
                opacity: f.dotOpacity,
              }}
            />
          </div>
        ))}

        {/* the per-frame phase labels + SFX, same opacity math */}
        <div className="ns-cook__labels">
          {FRAMES.map((f, i) =>
            f.phase.en ? (
              <p
                key={i}
                className="ns-cook__label ns-cook__phase"
                style={
                  {
                    "--ns-c": f.c,
                    "--ns-h": f.h,
                  } as CSSProperties
                }
              >
                <span lang="ko">{f.phase.ko}</span>{" "}
                <span className="ns-mono">· {f.phase.en}</span>
              </p>
            ) : null,
          )}
        </div>
        {FRAMES.map((f, i) =>
          f.sfx ? (
            <div
              key={i}
              className="ns-cook__sfx"
              lang="ko"
              style={
                {
                  "--ns-c": f.c,
                  "--ns-h": f.h,
                } as CSSProperties
              }
            >
              {f.sfx}
            </div>
          ) : null,
        )}

        {/* the honesty rail: a vertical progress bar = how cooked */}
        <div className="ns-cook__rail" aria-hidden="true">
          <div className="ns-cook__rail-fill" />
        </div>
      </div>

      <p className="ns-cook__hint">
        <span lang="ko">스크롤이 익힌다</span>
        <span className="ns-mono">SCROLL = COOK · 0% RAW → 100% PLATED</span>
      </p>
    </section>
  );
}
