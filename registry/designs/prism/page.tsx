"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import "./styles.css";
import { inter, notoSansKR } from "./fonts";
import { useReveal } from "./hooks/useReveal";
import { usePrefersReducedMotion } from "./hooks/usePrefersReducedMotion";
import { usePointerParallax } from "./hooks/usePointerParallax";

const TITLE = "PRISM";
const SPECTRUM = [
  { color: "#ef4444", ko: "적", en: "red", deg: 0 },
  { color: "#f97316", ko: "주", en: "orange", deg: 30 },
  { color: "#eab308", ko: "황", en: "yellow", deg: 60 },
  { color: "#22c55e", ko: "녹", en: "green", deg: 90 },
  { color: "#06b6d4", ko: "청", en: "cyan", deg: 120 },
  { color: "#3b82f6", ko: "람", en: "blue", deg: 150 },
  { color: "#8b5cf6", ko: "자", en: "violet", deg: 180 },
];

/**
 * PRISM — 프리즘, 빛의 굴절 스튜디오. Glass-futurism entry where a beam of
 * white light passes through a glass prism SVG and refracts into a spectrum.
 * The signature: svg-line-draw (the light beam + spectrum rays draw via
 * stroke-dashoffset on scroll), pointer-parallax (the prism tilts toward the
 * pointer), char-split-reveal (the title glyphs split in).
 */
export default function PrismPage() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const reduced = usePrefersReducedMotion();
  const revealRef = useReveal<HTMLDivElement>();
  const stageRef = usePointerParallax<HTMLDivElement>(reduced);

  useEffect(() => {
    rootRef.current?.classList.add("prism-js");
    window.parent?.postMessage({ type: "oneshot:ready", slug: "prism" }, "*");
  }, []);

  return (
    <div
      ref={rootRef}
      className={`${inter.variable} ${notoSansKR.variable} prism-root`}
    >
      <div ref={revealRef} className="prism-doc">
        <header className="prism-hero">
          <p className="prism-kicker">
            <span lang="ko">빛의 굴절 스튜디오</span> · LIGHT REFRACTION STUDIO
          </p>
          <h1 className="prism-title" aria-label="PRISM 프리즘">
            {TITLE.split("").map((ch, i) => (
              <span
                key={i}
                aria-hidden="true"
                className="prism-glyph"
                style={{ "--prism-i": i, "--prism-c": SPECTRUM[i % SPECTRUM.length].color } as CSSProperties}
              >
                {ch}
              </span>
            ))}
          </h1>
          <p className="prism-sub">
            <span lang="ko">유리가 빛을 스펙트럼으로 쪼갠다.</span> Glass splits
            light into spectrum.
          </p>
        </header>

        {/* The prism scene — pointer-parallax + svg-line-draw */}
        <section ref={stageRef} className="prism-stage" data-reveal="">
          {/* A generated spectrum-beam render behind the SVG refraction — the
              ambient dispersed light of the glass studio, so the stage reads
              as a real light-room, not a flat card. The SVG line-draw stays
              the focal diagram. */}
          <img
            className="prism-stage__field"
            src="/media/prism/spectrum-beam.avif"
            alt=""
            aria-hidden="true"
            draggable="false"
          />
          <svg
            className="prism-beam-svg"
            viewBox="0 0 800 400"
            role="img"
            aria-labelledby="prism-beam-label"
          >
            <title id="prism-beam-label">
              프리즘이 빛을 굴절시킨다 — 흰 빛이 일곱 색으로 갈라진다. The prism refracts light — white splits into seven colors.
            </title>
            {/* incoming white beam */}
            <line
              className="prism-beam-in"
              x1="40" y1="200" x2="340" y2="200"
              stroke="#f8fafc" strokeWidth="4"
            />
            {/* the glass prism triangle */}
            <polygon
              className="prism-glass"
              points="340,140 420,260 260,260"
              fill="rgba(255,255,255,0.06)"
              stroke="rgba(255,255,255,0.3)"
              strokeWidth="1.5"
            />
            {/* outgoing spectrum rays */}
            {SPECTRUM.map((s, i) => (
              <line
                key={i}
                className="prism-ray"
                x1="340" y1="200"
                x2={760} y2={200 + (i - 3) * 28}
                stroke={s.color}
                strokeWidth="3"
                style={{ "--prism-ray-i": i } as CSSProperties}
              />
            ))}
          </svg>
        </section>

        {/* spectrum legend */}
        <section className="prism-spectrum" data-reveal="">
          <h2 className="prism-secthead">
            <span lang="ko">스펙트럼</span> · SPECTRUM
          </h2>
          <div className="prism-spectrum-grid">
            {SPECTRUM.map((s) => (
              <div key={s.en} className="prism-color" style={{ "--prism-c": s.color } as CSSProperties}>
                <span className="prism-color__swatch" />
                <p className="prism-color__ko" lang="ko">{s.ko}</p>
                <p className="prism-color__en">{s.en}</p>
              </div>
            ))}
          </div>
        </section>

        <footer className="prism-foot" data-reveal="">
          <p>© 2026 PRISM · <span lang="ko">프리즘</span> · MIT</p>
          <p>
            <span lang="ko">코드로 그렸다 — 빛은 멈추지 않는다.</span> drawn in
            code — light never stops.
          </p>
        </footer>
      </div>
    </div>
  );
}
