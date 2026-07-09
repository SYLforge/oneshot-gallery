"use client";

import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

const PHASES = [
  { ko: "들이쉬세요", en: "breathe in" },
  { ko: "머금으세요", en: "hold" },
  { ko: "내쉬세요", en: "breathe out" },
] as const;

const PHASE_MS = 4000;
const CYCLE_MS = PHASE_MS * 3;

/**
 * 03 — a usable 4·4·4 breathing guide. One rAF clock drives both the orb
 * (a `--sup-breath` scale variable, half-sine eased) and the phase/count
 * text, so they can never drift apart. The instruction itself never
 * depends on the motion: a plain written sentence above the orb carries
 * the whole exercise, the animated readout is aria-hidden decoration on
 * top of it, and under reduced motion the orb holds still while the
 * text-only count remains available behind the same button.
 */
export default function BreathingGuide() {
  const reduced = usePrefersReducedMotion();
  const stageRef = useRef<HTMLDivElement | null>(null);
  /** Where in the 12s cycle we paused, so resuming never snaps. */
  const offsetRef = useRef(0);
  /**
   * The visitor's explicit choice, if any. Until they press the button the
   * guide follows the OS: already breathing for motion users, resting (a
   * text-only count away) for reduced-motion users.
   */
  const [choice, setChoice] = useState<boolean | null>(null);
  const [phase, setPhase] = useState(0);
  const [count, setCount] = useState(4);
  const running = choice ?? !reduced;

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || !running) return;

    let raf = 0;
    let on = false;
    let inView = true;
    let anchor = 0;
    let lastPhase = -1;
    let lastCount = -1;
    const easeSine = (u: number) => 0.5 - 0.5 * Math.cos(Math.PI * u);

    const step = (now: number) => {
      raf = requestAnimationFrame(step);
      const t = (now - anchor) % CYCLE_MS;
      offsetRef.current = t;
      const p = Math.floor(t / PHASE_MS);
      const u = (t % PHASE_MS) / PHASE_MS;
      const c = 4 - Math.floor(u * 4);
      if (p !== lastPhase) {
        lastPhase = p;
        setPhase(p);
      }
      if (c !== lastCount) {
        lastCount = c;
        setCount(c);
      }
      if (!reduced) {
        const v = p === 0 ? easeSine(u) : p === 1 ? 1 : 1 - easeSine(u);
        stage.style.setProperty("--sup-breath", v.toFixed(4));
      }
    };

    const start = () => {
      if (on) return;
      on = true;
      anchor = performance.now() - offsetRef.current;
      raf = requestAnimationFrame(step);
    };
    const stop = () => {
      on = false;
      cancelAnimationFrame(raf);
    };

    const io = new IntersectionObserver((hits) => {
      inView = hits[hits.length - 1].isIntersecting;
      if (inView && !document.hidden) start();
      else stop();
    });
    io.observe(stage);

    const onVisibility = () => {
      if (document.hidden) stop();
      else if (inView) start();
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      stop();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [running, reduced]);

  return (
    <section id="sup-breath" className="sup-breath" aria-labelledby="sup-breath-title">
      <div className="sup-sec" data-reveal>
        <span className="sup-sec__no" lang="ko" aria-hidden="true">
          둘
        </span>
        <h2 className="sup-sec__title" id="sup-breath-title">
          one breath{" "}
          <span lang="ko" className="sup-sec__ko">
            숨
          </span>
        </h2>
      </div>

      <p className="sup-breath__how" data-reveal>
        <em>In for four, hold for four, out for four — the forest counts with you.</em>
        <span lang="ko">
          넷을 세며 들이쉬고, 넷을 머금고, 넷을 세며 내쉬세요. 숲이 함께 세어
          줍니다.
        </span>
      </p>

      <div ref={stageRef} className="sup-breath__stage" data-reveal>
        <div className="sup-breath__halo" aria-hidden="true" />
        <div className="sup-breath__orb" aria-hidden="true" />
        <div className="sup-breath__readout" aria-hidden="true">
          {running ? (
            <>
              <span lang="ko" className="sup-breath__word">
                {PHASES[phase].ko}
              </span>
              <span className="sup-breath__word-en">{PHASES[phase].en}</span>
              <span className="sup-breath__count">{count}</span>
            </>
          ) : (
            <>
              <span lang="ko" className="sup-breath__word">
                쉬는 중
              </span>
              <span className="sup-breath__word-en">resting</span>
              <span className="sup-breath__count">·</span>
            </>
          )}
        </div>
      </div>

      <button
        type="button"
        className="sup-breath__toggle"
        aria-pressed={running}
        onClick={() => setChoice(!running)}
      >
        {running ? (
          <>
            <span lang="ko">잠시 멈춤</span> · rest the count
          </>
        ) : (
          <>
            <span lang="ko">숨 세기 시작</span> · start the count
          </>
        )}
      </button>

      <p className="sup-breath__note" data-reveal>
        <em>There is no correct way to breathe here.</em>{" "}
        <span lang="ko">여기서는 숨에 정답이 없습니다.</span>
      </p>
    </section>
  );
}
