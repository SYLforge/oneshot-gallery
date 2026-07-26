"use client";

import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import { useScrollProgress } from "../hooks/useScrollProgress";

/**
 * The signature. A 320vh corridor pins a 100svh stage; scroll progress maps
 * the wordmark TYPEWAVE across the full range of Archivo's axes —
 * `font-variation-settings` interpolates 'wdth' 62 → 125 and 'wght' 100 → 900
 * as the corridor scrubs 0 → 1. It is an audio timeline: the wordmark opens
 * thin and narrow at the head, fills out and stretches wide through the
 * body, and slams to its widest/heaviest at the tail — like sweeping a
 * filter across the spectrum.
 *
 * The progress is lerped inside a single rAF (0.14/frame) so the type trails
 * the scroll with mass, never re-rendering React. A Space Mono HUD reports
 * the live `wdth`/`wght` values like a patch readout, and a vertical acid
 * playhead tracks the position with a 2.4s held pulse. An 8-row acid
 * hairline grid sits behind the wordmark as a spectrum baseline.
 *
 * Reduced motion: the wordmark is parked at one composed state (wdth 118,
 * wght 760 — late in the morph), the corridor collapses to normal height,
 * and the HUD shows the parked values. No-JS: same static state, normal
 * flow, fully readable.
 *
 * `enabled` here is `!reduced` — the hook no-ops under reduced motion.
 */
export default function ScrubWordmark() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const wordRef = useRef<HTMLSpanElement | null>(null);
  const wdthRef = useRef<HTMLSpanElement | null>(null);
  const wghtRef = useRef<HTMLSpanElement | null>(null);
  const playheadRef = useRef<HTMLSpanElement | null>(null);
  const targetPRef = useRef(0);
  const reduced = usePrefersReducedMotion();

  // Reduced-motion parked state: a composed late-morph frame. The parked
  // wdth/wght (118/760) is set in styles.css under the reduced-motion media
  // query and as the default .typewave-scrub__word value; JS only drives the
  // morph when motion is allowed. STILL_P selects where on the corridor the
  // reduced HUD reads land.
  const STILL_P = 0.8;

  useScrollProgress(
    sectionRef,
    (p) => {
      targetPRef.current = p;
    },
    !reduced,
  );

  useEffect(() => {
    const section = sectionRef.current;
    const word = wordRef.current;
    if (!section || !word) return;

    let raf = 0;
    let running = false;
    let visible = true;
    let disposed = false;
    let last = 0;
    const shownP = reduced ? STILL_P : 0;

    // map scrub progress → axis values
    const WDTH_MIN = 62;
    const WDTH_MAX = 125;
    const WGHT_MIN = 100;
    const WGHT_MAX = 900;
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const ease = (t: number) => t * t * (3 - 2 * t); // smoothstep, so the
    // morph's middle travels fastest — like a filter sweep spending the least
    // time at its midpoint

    const apply = (p: number) => {
      const e = ease(p);
      const wdth = lerp(WDTH_MIN, WDTH_MAX, e);
      const wght = lerp(WGHT_MIN, WGHT_MAX, e);
      word.style.fontVariationSettings = `'wdth' ${wdth.toFixed(1)}, 'wght' ${wght.toFixed(0)}`;
      if (wdthRef) wdthRef.current!.textContent = `wdth ${wdth.toFixed(0)}`;
      if (wghtRef) wghtRef.current!.textContent = `wght ${wght.toFixed(0)}`;
      if (playheadRef) {
        playheadRef.current!.style.left = `${(p * 100).toFixed(2)}%`;
        playheadRef.current!.setAttribute(
          "aria-valuenow",
          String(Math.round(p * 100)),
        );
      }
    };

    if (reduced) {
      // corridor collapsed in CSS; nothing to drive. Pin the HUD to the exact
      // parked values the stylesheet paints under reduced motion (wdth 118,
      // wght 760 at 80% of the corridor) so the readout matches the wordmark.
      if (wdthRef.current) wdthRef.current.textContent = "wdth 118";
      if (wghtRef.current) wghtRef.current.textContent = "wght 760";
      if (playheadRef.current) {
        playheadRef.current.style.left = "80%";
        playheadRef.current.setAttribute("aria-valuenow", "80");
      }
      return;
    }

    apply(shownP); // first paint — the morph's head (wdth 62, wght 100)

    let currentP = 0;
    const SCRUB_LERP = 0.14;
    const step = (now: number) => {
      raf = requestAnimationFrame(step);
      const dt = Math.min(now - last, 48);
      last = now;
      const k = dt / 16.7; // frame-rate normalized
      currentP += (targetPRef.current - currentP) * SCRUB_LERP * k;
      if (Math.abs(targetPRef.current - currentP) > 0.0004 || visible) {
        apply(currentP);
      }
    };

    const shouldRun = () => visible && !document.hidden;
    const sync = () => {
      if (disposed) return;
      if (shouldRun()) {
        if (!running) {
          running = true;
          last = performance.now();
          raf = requestAnimationFrame(step);
        }
      } else if (running) {
        running = false;
        cancelAnimationFrame(raf);
      }
    };
    const onVisibility = () => sync();

    const io = new IntersectionObserver(
      (hits) => {
        visible = hits[hits.length - 1].isIntersecting;
        sync();
      },
      { rootMargin: "120px 0px" },
    );
    io.observe(section);
    document.addEventListener("visibilitychange", onVisibility);
    sync();

    return () => {
      disposed = true;
      running = false;
      cancelAnimationFrame(raf);
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [reduced]);

  return (
    <section
      ref={sectionRef}
      className="typewave-scrub"
      aria-labelledby="typewave-scrub-title"
    >
      <div className="typewave-scrub__sticky">
        <header className="typewave-scrub__head">
          <p className="typewave-sechead__no typewave-mono" aria-hidden="true">
            TRACK 02 · SCRUB
          </p>
          <h2 className="typewave-sechead" id="typewave-scrub-title">
            THE MORPH
            <span lang="ko" className="typewave-sechead__ko">
              늘어남
            </span>
          </h2>
          <p className="typewave-scrub__slug">
            Scroll scrubs the wordmark across its full width and weight range
            — a filter sweeping the spectrum.
            <span lang="ko">
              스크롤이 워드마크의 폭과 굵기 전 범위를 스크럽한다 — 스펙트럼을
              쓸고 지나가는 필터.
            </span>
          </p>
        </header>

        <div
          className="typewave-scrub__stage"
          role="img"
          aria-label="The wordmark TYPEWAVE morphing across its variable-font width and weight axes, scrubbed by scroll: narrow and thin at the head, wide and heavy at the tail, like an audio timeline. 스크롤로 스크럽되는 워드마크 TYPEWAVE — 가변 폰트의 폭과 굵기 축을 따라 좁고 얇은 시작에서 넓고 무거운 끝으로 변형된다. 오디오 타임라인처럼."
        >
          {/* spectrum baseline: 8 faint acid hairlines */}
          <div className="typewave-scrub__grid" aria-hidden="true">
            {Array.from({ length: 8 }).map((_, i) => (
              <i key={i} />
            ))}
          </div>

          {/* the timeline playhead, vertical acid, pulsing */}
          <span
            ref={playheadRef}
            className="typewave-scrub__playhead"
            aria-hidden="true"
          />

          {/* the morphing wordmark */}
          <span ref={wordRef} className="typewave-scrub__word">
            TYPEWAVE
          </span>
          <span className="typewave-scrub__wordko" lang="ko">
            타입웨이브
          </span>

          {/* patch readout */}
          <dl className="typewave-scrub__hud typewave-mono" aria-hidden="true">
            <div>
              <dt>axis</dt>
              <dd ref={wdthRef}>wdth 62</dd>
            </div>
            <div>
              <dt>weight</dt>
              <dd ref={wghtRef}>wght 100</dd>
            </div>
            <div>
              <dt>position</dt>
              <dd>0 → 1 · scrub</dd>
            </div>
          </dl>
        </div>

        <p className="typewave-scrub__note">
          Hold anywhere; the type holds with you. The wordmark has no clock of
          its own — only your scroll.
          <span lang="ko">
            멈추면 글자도 함께 멈춘다. 워드마크에는 자기 시계가 없다 — 오직
            당신의 스크롤뿐.
          </span>
        </p>
      </div>
    </section>
  );
}
