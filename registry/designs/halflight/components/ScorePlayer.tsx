"use client";

import { useEffect, useRef } from "react";
import { useAudioEngine } from "../hooks/useAudioEngine";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

/** Backing-store resolution cap. */
const MAX_DPR = 2;
/** Envelope history — one point per animation frame, right-aligned. */
const HIST_CAP = 420;

function smoothstep(t: number): number {
  const x = Math.min(1, Math.max(0, t));
  return x * x * (3 - 2 * x);
}

/**
 * Cue 04 — the score. Audio is generated live by the Web Audio graph in
 * useAudioEngine, strictly on the visitor's own press of PLAY: no autoplay,
 * ever. While it sounds, the canvas draws the score-line in real time — an
 * RMS envelope marching left, an oscilloscope ghost behind it, a red mark
 * where the strings entered. Leaving the section stops the cue; so does
 * unmount and pagehide (the whole AudioContext is closed).
 *
 * Reduced motion: the waveform is a static composed drawing — the audio
 * itself remains user-triggerable. No Web Audio support: the player hides
 * and a one-line apology plays the cue in print instead.
 */
export default function ScorePlayer() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const reduced = usePrefersReducedMotion();
  const { supported, playing, toggle, stop, analyserRef } = useAudioEngine();

  const stopRef = useRef(stop);
  useEffect(() => {
    stopRef.current = stop;
  });

  // The cue stops when its scene ends: leaving the section kills the drone.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver((hits) => {
      if (!hits[hits.length - 1].isIntersecting) stopRef.current();
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // The score-line.
  useEffect(() => {
    const stage = stageRef.current;
    const canvas = canvasRef.current;
    if (!stage || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const style = getComputedStyle(canvas);
    const token = (name: string, fallback: string) =>
      style.getPropertyValue(name).trim() || fallback;
    const bone = token("--hl-bone", "#e8e4da");
    const tungsten = token("--hl-tungsten", "#a08560");
    const red = token("--hl-red", "#d43425");

    let w = 0;
    let h = 0;
    let raf = 0;
    const hist: number[] = [];
    const buf = new Uint8Array(1024);

    const resize = () => {
      const rect = stage.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      w = Math.max(1, rect.width);
      h = Math.max(1, rect.height);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const rules = () => {
      ctx.strokeStyle = "rgba(232, 228, 218, 0.10)";
      ctx.lineWidth = 1;
      for (const fy of [0.22, 0.5, 0.78]) {
        ctx.beginPath();
        ctx.moveTo(0, Math.round(h * fy) + 0.5);
        ctx.lineTo(w, Math.round(h * fy) + 0.5);
        ctx.stroke();
      }
    };

    // The still score: what the cue looks like written down. The red mark at
    // 18% is the strings' entrance — three seconds late, on purpose.
    const drawStatic = () => {
      ctx.clearRect(0, 0, w, h);
      rules();
      ctx.fillStyle = red;
      ctx.fillRect(Math.round(w * 0.18), h * 0.2, 2, h * 0.6);

      const env = (q: number) => {
        let v = 0.1 + 0.05 * Math.sin(q * 21) + 0.03 * Math.sin(q * 47 + 1.3);
        v += smoothstep((q - 0.18) / 0.12) * (0.16 + 0.05 * Math.sin(q * 13 + 0.6));
        return v;
      };
      for (const [color, scale, width] of [
        [bone, 0.42, 1.5],
        [tungsten, 0.2, 1],
      ] as const) {
        ctx.strokeStyle = color;
        ctx.lineWidth = width;
        for (const sign of [-1, 1]) {
          ctx.beginPath();
          for (let x = 0; x <= w; x += 3) {
            const y = h / 2 + sign * env(x / w) * h * scale;
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.stroke();
        }
      }
    };

    const drawLive = () => {
      raf = requestAnimationFrame(drawLive);
      const analyser = analyserRef.current;
      if (!analyser) return;
      analyser.getByteTimeDomainData(buf);

      let sum = 0;
      for (let i = 0; i < buf.length; i++) {
        const v = (buf[i] - 128) / 128;
        sum += v * v;
      }
      const rms = Math.min(1, Math.sqrt(sum / buf.length) * 3.2);
      hist.push(rms);
      if (hist.length > HIST_CAP) hist.shift();

      ctx.clearRect(0, 0, w, h);
      rules();

      // oscilloscope ghost — the raw signal, faint, behind the envelope
      ctx.strokeStyle = tungsten;
      ctx.globalAlpha = 0.4;
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let i = 0; i < buf.length; i += 8) {
        const x = (i / (buf.length - 1)) * w;
        const y = h / 2 + ((buf[i] - 128) / 128) * h * 0.34;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.globalAlpha = 1;

      // the envelope band, marching in from the right
      const stepX = 2;
      ctx.strokeStyle = bone;
      ctx.lineWidth = 1.5;
      for (const sign of [-1, 1]) {
        ctx.beginPath();
        let started = false;
        for (let i = 0; i < hist.length; i++) {
          const x = w - (hist.length - 1 - i) * stepX;
          if (x < 0) continue;
          const y = h / 2 + sign * hist[i] * h * 0.4;
          if (!started) {
            ctx.moveTo(x, y);
            started = true;
          } else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      // the playhead — the one red thing that moves
      const head = hist[hist.length - 1] ?? 0;
      ctx.fillStyle = red;
      ctx.beginPath();
      ctx.arc(w - 2, h / 2 - head * h * 0.4, 3, 0, Math.PI * 2);
      ctx.fill();
    };

    resize();
    const live = playing && !reduced;
    if (live) {
      raf = requestAnimationFrame(drawLive);
    } else {
      drawStatic();
    }

    const ro = new ResizeObserver(() => {
      resize();
      if (!live) drawStatic();
    });
    ro.observe(stage);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [playing, reduced, analyserRef]);

  return (
    <section
      className="halflight-score"
      aria-labelledby="halflight-score-title"
      ref={sectionRef}
    >
      <div className="halflight-score__inner">
        <header className="halflight-score__head" data-reveal>
          <p className="halflight-sechead__no halflight-mono" aria-hidden="true">
            CUE 04
          </p>
          <h2 className="halflight-sechead" id="halflight-score-title">
            NIGHT SWIM{" "}
            <span lang="ko" className="halflight-sechead__ko">
              밤의 수영
            </span>
          </h2>
        </header>

        <p className="halflight-score__direction" data-reveal>
          Cue 04: the strings enter three seconds late, on purpose.{" "}
          <span lang="ko">큐 04: 현악은 3초 늦게, 의도적으로 들어온다.</span>
        </p>

        <div
          className="halflight-score__stage"
          data-reveal
          ref={stageRef}
          role="img"
          aria-label="A score-line drawn live while the cue plays: a quiet envelope that widens when the strings enter, with a red mark at their entrance. 큐가 연주되는 동안 실시간으로 그려지는 스코어 라인 — 현악이 들어오는 자리에 붉은 표시가 있다."
        >
          <canvas
            ref={canvasRef}
            className="halflight-score__canvas"
            aria-hidden="true"
          />
        </div>

        {supported ? (
          <p className="halflight-score__controls" data-reveal>
            <button
              type="button"
              className="halflight-play"
              onClick={toggle}
              aria-pressed={playing}
            >
              <span className="halflight-play__dot" aria-hidden="true" />
              {playing ? (
                <>
                  STOP <span lang="ko">정지</span>
                </>
              ) : (
                <>
                  PLAY CUE 04 <span lang="ko">재생</span>
                </>
              )}
            </button>
            <span className="halflight-score__hint halflight-mono">
              SOUND ON · HOLDS UNTIL STOPPED{" "}
              <span lang="ko">소리 있음 · 정지할 때까지 지속</span>
            </span>
          </p>
        ) : (
          <p className="halflight-score__controls halflight-score__controls--mute">
            This projector has no speaker. The cue plays only in print, above.{" "}
            <span lang="ko">
              이 영사기에는 스피커가 없다. 큐는 위의 활자로만 연주된다.
            </span>
          </p>
        )}

        <p className="halflight-score__caption" data-reveal>
          The score draws itself while it sounds.{" "}
          <span lang="ko">악보는 소리 나는 동안 스스로 그려진다.</span>
        </p>
      </div>
    </section>
  );
}
