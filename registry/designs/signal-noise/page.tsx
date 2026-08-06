"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import "./styles.css";
import { jetbrainsMono, notoSansKR } from "./fonts";
import { useReveal } from "./hooks/useReveal";
import { usePrefersReducedMotion } from "./hooks/usePrefersReducedMotion";

const TITLE = "SIGNAL NOISE";

const LOG_LINES = [
  { tag: "SYS", ko: "신호 채널 개방", en: "signal channel open" },
  { tag: "RX", ko: "캐리어 910.6 MHz 잠금", en: "carrier 910.6 MHz locked" },
  { tag: "SNR", ko: "신호 대 잡음비 14.2 dB", en: "signal-to-noise 14.2 dB" },
  { tag: "GEN", ko: "잡음 층 정상 — 결이 살아 있음", en: "noise floor nominal — texture alive" },
  { tag: "EOF", ko: "수신 대기 중…", en: "awaiting next packet…" },
];

/**
 * SIGNAL NOISE 신호 잡음 — the aesthetics of noise, a living CRT signal
 * display. The signature is the grain itself: a static feTurbulence overlay
 * washes a green-phosphor field where log lines type themselves in and a
 * signal waveform breathes. JetBrains Mono carries the wordmark with a
 * phosphor glow and a scanline sweeps the whole frame. The noise is not the
 * enemy — it is the texture of a living signal.
 *
 * `.signal-noise-js` is added on mount so the no-JS markup is the finished
 * page: all log lines sit printed, the waveform stands, the glow holds.
 */
export default function SignalNoisePage() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const reduced = usePrefersReducedMotion();
  const revealRef = useReveal<HTMLDivElement>();
  const termRef = useRef<HTMLDivElement | null>(null);
  // Reduced motion shows every line immediately (lazy initial state, so the
  // reduced branch needs no setState inside the effect below).
  const [printed, setPrinted] = useState<string[]>(() =>
    reduced ? LOG_LINES.map((l) => `${l.tag}  ${l.en}`) : [],
  );

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    root.classList.add("signal-noise-js");
    const id = requestAnimationFrame(() => root.classList.add("is-mounted"));
    window.parent?.postMessage({ type: "oneshot:ready", slug: "signal-noise" }, "*");
    return () => cancelAnimationFrame(id);
  }, []);

  // Typewriter: print each log line into the terminal, one after another.
  // Reduced motion is handled by the lazy initial state above, so here we only
  // run the typing animation. All timers are cleared on exit.
  useEffect(() => {
    if (reduced) return;
    const term = termRef.current;
    if (!term) return;
    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const reveal = (io: IntersectionObserver) => {
      io.disconnect();
      let acc = 0;
      LOG_LINES.forEach((line, idx) => {
        const full = `${line.tag}  ${line.en}`;
        acc += 380;
        timers.push(
          setTimeout(() => {
            if (cancelled) return;
            // type the line char by char
            let i = 0;
            const step = () => {
              if (cancelled) return;
              i += 1;
              setPrinted((prev) => {
                const next = [...prev];
                next[idx] = full.slice(0, i);
                return next;
              });
              if (i < full.length) {
                timers.push(setTimeout(step, 26 + Math.random() * 30));
              }
            };
            step();
          }, acc),
        );
        acc += full.length * 42 + 320;
      });
    };
    if (!("IntersectionObserver" in window)) {
      reveal(new IntersectionObserver(() => {}));
    } else {
      const io = new IntersectionObserver(
        (hits) => {
          for (const h of hits) if (h.isIntersecting) reveal(io);
        },
        { threshold: 0.25 },
      );
      io.observe(term);
    }
    return () => {
      cancelled = true;
      for (const t of timers) clearTimeout(t);
    };
  }, [reduced]);

  return (
    <div
      ref={rootRef}
      className={`${jetbrainsMono.variable} ${notoSansKR.variable} signal-noise-root`}
    >
      <div className="signal-noise-bg" aria-hidden="true" />
      {/* phosphor scanline sweep */}
      <div className="signal-noise-scan" aria-hidden="true" />
      {/* static-noise grain overlay */}
      <svg className="signal-noise-grain" aria-hidden="true" focusable="false">
        <filter id="sn-noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" seed="7" stitchTiles="stitch" />
          <feColorMatrix type="matrix" values="0 0 0 0 0.24  0 0 0 0 1  0 0 0 0 0.62  0 0 0 0.5 0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#sn-noise)" />
      </svg>

      <div ref={revealRef} className="signal-noise-doc">
        <header className="signal-noise-hero">
          <p className="signal-noise-kicker">
            <span lang="ko">노이즈의 미학</span> · THE AESTHETICS OF NOISE · CH/910.6
          </p>
          <h1 className="signal-noise-title" aria-label={TITLE}>
            {TITLE.split("").map((ch, i) => (
              <span
                key={i}
                aria-hidden="true"
                className={`signal-noise-glyph${ch === " " ? " signal-noise-glyph--sp" : ""}`}
                style={{ "--sn-i": i } as CSSProperties}
              >
                {ch}
              </span>
            ))}
          </h1>
          <p className="signal-noise-title__ko" lang="ko">신호 잡음</p>
          <p className="signal-noise-sub">
            <span lang="ko">잡음은 적이 아니다 — 살아 있는 신호의 결이다.</span>{" "}
            Noise is not the enemy — it is the texture of a living signal.
          </p>
        </header>

        <main>
          <section className="signal-noise-stage" data-reveal>
            {/* signal waveform */}
            <div className="sn-wave" aria-hidden="true">
              <svg viewBox="0 0 600 120" preserveAspectRatio="none">
                <path
                  className="sn-wave__grid"
                  d="M0,60 H600"
                  fill="none"
                  stroke="rgba(62,255,160,0.18)"
                  strokeWidth="1"
                />
                <path
                  className="sn-wave__line"
                  d="M0,60 L12,52 L24,68 L36,40 L48,80 L60,46 L72,74 L84,38 L96,82 L108,50 L120,70 L132,36 L144,84 L156,48 L168,72 L180,42 L192,78 L204,52 L216,66 L228,34 L240,86 L252,50 L264,70 L276,40 L288,80 L300,60 L312,44 L324,76 L336,38 L348,82 L360,52 L372,68 L384,42 L396,78 L408,48 L420,72 L432,36 L444,84 L456,50 L468,70 L480,40 L492,80 L504,54 L516,66 L528,38 L540,82 L552,48 L564,72 L576,44 L600,60"
                  fill="none"
                  stroke="#3effa0"
                  strokeWidth="2"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            {/* terminal log */}
            <div ref={termRef} className="sn-term" role="log" aria-live="off">
              <pre className="sn-term__pre">
                {LOG_LINES.map((l, idx) => {
                  const text = printed[idx] ?? "";
                  const done = text.length >= `${l.tag}  ${l.en}`.length;
                  return (
                    <div key={idx} className="sn-term__line">
                      <span className="sn-term__tag">{text.slice(0, l.tag.length) || l.tag}</span>
                      <span className="sn-term__body">{text.slice(l.tag.length)}</span>
                      {reduced || done ? null : <span className="sn-term__caret" />}
                    </div>
                  );
                })}
              </pre>
            </div>

            {/* KO gloss row */}
            <ul className="sn-gloss">
              {LOG_LINES.map((l, i) => (
                <li key={i} className="sn-gloss__item" data-reveal style={{ "--sn-d": i * 80 } as CSSProperties}>
                  <span className="sn-gloss__tag">[{l.tag}]</span>
                  <span className="sn-gloss__ko" lang="ko">{l.ko}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="signal-noise-lead" data-reveal>
            <p className="signal-noise-lead__p">
              <span lang="ko">
                우리는 잡음을 지우려 애쓰지 않는다. 정적의 결, 미세한 지터, 살짝
                흔들리는 파형 — 그 모든 것이 신호가 살아 있다는 증거다. 완전히
                깨끗한 선은 죽어 있는 것이다.
              </span>{" "}
              We do not labour to erase the noise. The grain of static, the faint
              jitter, the waveform that trembles — each is proof the signal is
              alive. A perfectly clean line is a dead one.
            </p>
          </section>
        </main>

        <footer className="signal-noise-foot">
          <span>SIGNAL NOISE · 2026 · EOF</span>
          <span lang="ko">신호 잡음 — 관측소 K-12</span>
        </footer>
      </div>
    </div>
  );
}
