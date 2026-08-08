"use client";

import { useEffect, useRef, useState } from "react";
import "./styles.css";
import { jetbrainsMono, notoSansKR } from "./fonts";
import { usePrefersReducedMotion } from "./hooks/usePrefersReducedMotion";
import { useTypewriter } from "./hooks/useTypewriter";

/**
 * WAVE — a podcast/music-network analytics dashboard whose signature is a
 * live ASCII spectrum analyzer. Where PALE.SIGNAL is poetry/logs and GLITCH
 * is corruption, WAVE is data-visualization — a functional terminal dashboard
 * with a real equalizer in text. Calm, technical, beautiful data.
 *
 * `.wave-js` is added imperatively on mount: every pre-reveal style is gated
 * behind it, and with JavaScript off the dashboard simply stands finished.
 */
const BARS = 48;
const GLYPHS = "▁▂▃▄▅▆▇█";

export default function WavePage() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const reduced = usePrefersReducedMotion();
  const [spectrum, setSpectrum] = useState<number[]>(
    () => Array.from({ length: BARS }, () => 0.2),
  );
  // Peak-hold caps — the slow-decaying amber markers above each bar that make
  // the meter read as a real LED analyzer, not a single line of text-shadow.
  const [peaks, setPeaks] = useState<number[]>(
    () => Array.from({ length: BARS }, () => 0.2),
  );
  const peaksRef = useRef<number[]>(Array.from({ length: BARS }, () => 0.2));
  const raf = useRef(0);
  const phase = useRef(0);

  // The simulated audio beat — a few sine layers driving bar heights.
  useEffect(() => {
    rootRef.current?.classList.add("wave-js");
    window.parent?.postMessage({ type: "oneshot:ready", slug: "wave" }, "*");

    if (reduced) return;
    const tick = () => {
      raf.current = requestAnimationFrame(tick);
      phase.current += 0.04;
      const t = phase.current;
      const next = Array.from({ length: BARS }, (_, i) => {
        const center = BARS / 2;
        const dist = Math.abs(i - center) / center;
        const env = Math.max(0.08, 1 - dist * 0.7);
        const beat =
          0.5 +
          0.3 * Math.sin(t * 2.0 + i * 0.3) +
          0.2 * Math.sin(t * 5.0 + i * 0.7);
        return Math.max(0.05, Math.min(1, beat * env));
      });
      setSpectrum(next);
      // Peak-hold: grab the new high, otherwise decay slowly. The 0.985 factor
      // + 0.001 floor gives a graceful LED-meter fall, ~1.5s from full.
      const nextPeaks = next.map((v, i) =>
        Math.max(peaksRef.current[i] * 0.985 - 0.001, v),
      );
      peaksRef.current = nextPeaks;
      setPeaks(nextPeaks);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [reduced]);

  const tagline = useTypewriter(
    ["◎ WAVE — 지금 재생 중: 새벽 녹음, EP.044"],
    !reduced,
  );
  const taglineText = tagline.settled[0] ?? tagline.typing ?? "";

  return (
    <div
      ref={rootRef}
      className={`${jetbrainsMono.variable} ${notoSansKR.variable} wave-root`}
    >
      <header className="wave-hero" data-reveal="">
        <p className="wave-kicker">
          <span lang="ko">오디오 네트워크 분석</span> · AUDIO NETWORK ANALYTICS
        </p>
        <h1 className="wave-title">
          WAVE <span lang="ko">파동</span>
        </h1>
        <p className="wave-tagline">{taglineText}</p>
      </header>

      <section className="wave-spectrum-section" aria-labelledby="wave-spec-title">
        <h2 id="wave-spec-title" className="wave-secthead" data-reveal="">
          <span lang="ko">스펙트럼</span> · spectrum
        </h2>
        {/* The SVG meter is the signature: real bars, real peak-hold caps,
            a phosphor→amber gradient so loud bands glow warm. Hidden from
            AT behind the labeled ASCII strip below. */}
        <div
          className="wave-spectrum"
          role="img"
          aria-hidden="true"
          data-reveal=""
        >
          <svg
            className="wave-spectrum__svg"
            viewBox="0 0 480 200"
            preserveAspectRatio="none"
          >
            <defs>
              {/* Vertical meter gradient: green bed → amber head, applied in
                  userSpaceOnUse so tall bars literally climb into the warm. */}
              <linearGradient id="wave-grad" x1="0" y1="200" x2="0" y2="0" gradientUnits="userSpaceOnUse">
                <stop offset="0" stopColor="#4ade80" />
                <stop offset="0.62" stopColor="#4ade80" />
                <stop offset="0.82" stopColor="#a3e635" />
                <stop offset="0.95" stopColor="#fbbf24" />
                <stop offset="1" stopColor="#fb923c" />
              </linearGradient>
            </defs>
            {spectrum.map((v, i) => {
              const gap = 2;
              const w = (480 - gap * (BARS - 1)) / BARS;
              const x = i * (w + gap);
              const h = Math.max(2, v * 200);
              const y = 200 - h;
              const pkY = 200 - Math.max(2, peaks[i] * 200) - 2;
              return (
                <g key={i}>
                  <rect
                    className="wave-spectrum__bar"
                    x={x}
                    y={y}
                    width={w}
                    height={h}
                  />
                  {/* Peak-hold cap — a thin amber tick that lingers at the
                      loudest recent level, then decays. */}
                  <rect
                    className="wave-spectrum__peak"
                    x={x}
                    y={pkY}
                    width={w}
                    height={2}
                  />
                </g>
              );
            })}
          </svg>
          {/* The ASCII channel keeps the original charm as a secondary strip. */}
          <pre className="wave-spectrum__ascii">
            {spectrum
              .map((v) => GLYPHS[Math.min(7, Math.floor(v * 8))])
              .join("")}
          </pre>
        </div>
        <p className="wave-spec-meta" data-reveal="">
          <span lang="ko">48 밴드 · 60fps · 시뮬레이션</span> · 48 bands · 60fps
          · simulated
        </p>
      </section>

      <section className="wave-stats" aria-labelledby="wave-stats-title">
        <h2 id="wave-stats-title" className="wave-secthead" data-reveal="">
          <span lang="ko">통계</span> · stats
        </h2>
        <dl className="wave-stat-grid">
          <div data-reveal="">
            <dt>listeners</dt>
            <dd>12,847</dd>
          </div>
          <div data-reveal="">
            <dt>peak</dt>
            <dd>21,304</dd>
          </div>
          <div data-reveal="">
            <dt>episodes</dt>
            <dd>044</dd>
          </div>
          <div data-reveal="">
            <dt>uptime</dt>
            <dd>99.98%</dd>
          </div>
        </dl>
      </section>

      <div className="wave-marquee" aria-hidden="true">
        <span className="wave-marquee__track">
          ◎ NOW PLAYING · <span lang="ko">새벽 녹음</span> EP.044 ·{" "}
          <span lang="ko">다음</span> EP.045 — <span lang="ko">비밀</span> ·
          WAVE.NETWORK · 2026 ·
        </span>
      </div>

      <footer className="wave-foot" data-reveal="">
        <p>
          © 2026 WAVE · <span lang="ko">오디오 네트워크</span> · MIT
        </p>
        <p>
          <span lang="ko">전부 코드로 그렸다 — 실제 오디오 없음.</span> drawn
          entirely in code — no real audio.
        </p>
      </footer>
    </div>
  );
}
