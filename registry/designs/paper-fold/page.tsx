"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import "./styles.css";
import { fraunces, notoSerifKR } from "./fonts";
import { useReveal } from "./hooks/useReveal";
import { usePrefersReducedMotion } from "./hooks/usePrefersReducedMotion";

const TITLE = "PAPER FOLD";

/**
 * PAPER FOLD 종이접기 — folding hands, a papercraft atelier. The signature
 * is an origami crane built from folded paper facets (SVG <polygon>s in
 * graded paper tones) with crease lines that draw themselves in
 * (stroke-dashoffset). It sits on warm washi with a faint feTurbulence paper
 * grain. The wordmark is Fraunces, warm orange, with a soft paper drop
 * shadow — design you can almost feel the fold of.
 *
 * `.paper-fold-js` is added on mount so the no-JS markup is the finished
 * page: the crane stands fully drawn, copy is readable, grain is visible.
 */
export default function PaperFoldPage() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const reduced = usePrefersReducedMotion();
  const revealRef = useReveal<HTMLDivElement>();
  const craneRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    root.classList.add("paper-fold-js");
    const id = requestAnimationFrame(() => root.classList.add("is-mounted"));
    window.parent?.postMessage({ type: "oneshot:ready", slug: "paper-fold" }, "*");
    return () => cancelAnimationFrame(id);
  }, []);

  // svg-line-draw: when the crane scrolls into view, measure each crease path
  // and animate its dashoffset from full-length to 0. NaN-safe lengths are
  // skipped. Reduced motion draws everything instantly.
  useEffect(() => {
    const svg = craneRef.current;
    if (!svg) return;
    const paths = Array.from(svg.querySelectorAll<SVGPathElement>(".fo-crease"));
    const measure = () => {
      for (const p of paths) {
        const len = p.getTotalLength();
        // NaN-safe: skip any path that reports no length.
        if (!Number.isFinite(len) || len <= 0) continue;
        p.style.setProperty("--fo-len", `${len.toFixed(2)}`);
      }
    };
    measure();

    // Reduced motion: the CSS reduced block forces stroke-dashoffset:0, so the
    // creases stand fully drawn with no animation. Nothing else to do.
    if (reduced) return;
    if (!("IntersectionObserver" in window)) {
      svg.classList.add("fo-drawn");
      return;
    }
    const io = new IntersectionObserver(
      (hits) => {
        for (const h of hits) {
          if (h.isIntersecting) {
            svg.classList.add("fo-drawn");
            io.disconnect();
            break;
          }
        }
      },
      { threshold: 0.3 },
    );
    io.observe(svg);
    return () => io.disconnect();
  }, [reduced]);

  return (
    <div
      ref={rootRef}
      className={`${fraunces.variable} ${notoSerifKR.variable} paper-fold-root`}
    >
      <div className="paper-fold-bg" aria-hidden="true" />
      {/* Paper grain — static feTurbulence over everything. */}
      <svg className="paper-fold-grain" aria-hidden="true" focusable="false">
        <filter id="fo-grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" seed="4" stitchTiles="stitch" />
          <feColorMatrix type="matrix" values="0 0 0 0 0.32  0 0 0 0 0.22  0 0 0 0 0.10  0 0 0 0.06 0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#fo-grain)" />
      </svg>

      <div ref={revealRef} className="paper-fold-doc">
        <header className="paper-fold-hero">
          <p className="paper-fold-kicker">
            <span lang="ko">접는 손</span> · FOLDING HANDS · ATELIER ORI
          </p>
          <h1 className="paper-fold-title" aria-label={TITLE}>
            {TITLE.split("").map((ch, i) => (
              <span
                key={i}
                aria-hidden="true"
                className={`paper-fold-glyph${ch === " " ? " paper-fold-glyph--sp" : ""}`}
                style={{ "--fo-i": i } as CSSProperties}
              >
                {ch}
              </span>
            ))}
          </h1>
          <p className="paper-fold-title__ko" lang="ko">종이접기</p>
          <p className="paper-fold-sub">
            <span lang="ko">한 장의 종이가 새가 되는 시간.</span>{" "}
            The hour a single sheet becomes a bird.
          </p>
        </header>

        <main>
          <section className="paper-fold-stage" data-reveal>
            <svg
              ref={craneRef}
              className="paper-fold-crane"
              viewBox="0 0 600 420"
              role="img"
              aria-label="An origami crane built from folded paper facets"
            >
              <defs>
                <linearGradient id="fo-face-a" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#fbf3e2" />
                  <stop offset="1" stopColor="#ecd6ad" />
                </linearGradient>
                <linearGradient id="fo-face-b" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#f3e2c0" />
                  <stop offset="1" stopColor="#dcc086" />
                </linearGradient>
                <linearGradient id="fo-face-c" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#e9c98f" />
                  <stop offset="1" stopColor="#c79f5e" />
                </linearGradient>
                <radialGradient id="fo-shadow" cx="0.5" cy="0.5" r="0.5">
                  <stop offset="0" stopColor="rgba(120,80,30,0.30)" />
                  <stop offset="1" stopColor="rgba(120,80,30,0)" />
                </radialGradient>
              </defs>

              {/* ground shadow */}
              <ellipse cx="300" cy="362" rx="170" ry="22" fill="url(#fo-shadow)" />

              {/* folded facets — distinct paper tones */}
              <polygon points="300,150 470,250 300,330" fill="url(#fo-face-a)" stroke="#b98a3e" strokeWidth="0.8" />
              <polygon points="300,150 130,250 300,330" fill="url(#fo-face-b)" stroke="#b98a3e" strokeWidth="0.8" />
              <polygon points="300,150 300,330 250,300" fill="url(#fo-face-c)" stroke="#b98a3e" strokeWidth="0.8" />
              <polygon points="300,150 470,250 520,210 360,120" fill="url(#fo-face-b)" stroke="#b98a3e" strokeWidth="0.8" />
              <polygon points="300,150 130,250 80,210 240,120" fill="url(#fo-face-a)" stroke="#b98a3e" strokeWidth="0.8" />
              {/* tail */}
              <polygon points="470,250 300,330 540,330 520,210" fill="url(#fo-face-c)" stroke="#b98a3e" strokeWidth="0.8" />
              {/* head + beak */}
              <polygon points="80,210 240,120 150,150 70,210" fill="url(#fo-face-a)" stroke="#b98a3e" strokeWidth="0.8" />
              <polygon points="80,210 70,210 60,222 78,220" fill="#d4571f" />
              {/* wing lift */}
              <polygon points="300,150 360,120 300,90 240,120" fill="url(#fo-face-b)" stroke="#b98a3e" strokeWidth="0.8" />

              {/* crease lines — drawn in via dashoffset */}
              <path className="fo-crease" d="M300,150 L300,330" />
              <path className="fo-crease" d="M300,150 L470,250" />
              <path className="fo-crease" d="M300,150 L130,250" />
              <path className="fo-crease" d="M300,150 L360,120 L300,90 L240,120 L300,150" />
              <path className="fo-crease" d="M470,250 L540,330" />
              <path className="fo-crease" d="M80,210 L150,150 L240,120" />
            </svg>
          </section>

          <section className="paper-fold-lead" data-reveal>
            <p className="paper-fold-lead__p">
              <span lang="ko">
                접는다는 것은 줄이는 일이 아니다. 한 장의 종이가 수십 번 접히며
                날개를 얻고, 부리를 얻고, 마침내 새가 된다. 우리는 그 접힌 자국
                하나하나를 디자인이라 부른다.
              </span>{" "}
              Folding is not subtracting. A single sheet, folded dozens of
              times, gains wings, gains a beak, and at last becomes a bird. We
              call every one of those creases design.
            </p>
          </section>

          <section className="paper-fold-steps">
            {[
              { ko: "자르기", en: "Cut", n: "01" },
              { ko: "접기", en: "Fold", n: "02" },
              { ko: "펴기", en: "Crisp", n: "03" },
              { ko: "세우기", en: "Stand", n: "04" },
            ].map((c, i) => (
              <article
                key={i}
                className="fo-step"
                data-reveal
                style={{ "--fo-d": i * 90 } as CSSProperties}
              >
                <span className="fo-step__n">{c.n}</span>
                <span className="fo-step__en">{c.en}</span>
                <span className="fo-step__ko" lang="ko">{c.ko}</span>
              </article>
            ))}
          </section>
        </main>

        <footer className="paper-fold-foot">
          <span>PAPER FOLD · 2026</span>
          <span lang="ko">종이접기 — 교토 타카야마</span>
        </footer>
      </div>
    </div>
  );
}
