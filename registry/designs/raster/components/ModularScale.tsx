"use client";

import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

/**
 * Section 02 — the modular scale in motion. Six steps of a 1.333 (perfect
 * fourth) scale. Each word's font-size is already its certified value; what
 * scroll drives is a `transform: scale()` from exactly one step below
 * (1 / 1.333 ≈ 0.75) up to 1 — so every heading *arrives* at its size by
 * traveling the ratio itself, and the compositor does all the work.
 *
 * Reads happen inside rAF (one getBoundingClientRect per scroll frame),
 * then writes — no layout thrash. Reduced motion, and no-JS, render the
 * settled scale: transforms only ever exist as inline styles set here.
 */

const RATIO = 1.333;
const S0 = 1 / RATIO;

const STEPS = [
  { step: 0, pow: "×1.333⁰ = 1.000", en: "annotation", ko: "주석" },
  { step: 1, pow: "×1.333¹ = 1.333", en: "body copy", ko: "본문" },
  { step: 2, pow: "×1.333² = 1.777", en: "subheading", ko: "소제목" },
  { step: 3, pow: "×1.333³ = 2.369", en: "heading", ko: "표제" },
  { step: 4, pow: "×1.333⁴ = 3.157", en: "display", ko: "대형" },
  { step: 5, pow: "×1.333⁵ = 4.209", en: "monument", ko: "기념비" },
];

const SETTLED = "t = 1.000 — settled · 정착";

export default function ModularScale() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const chipRef = useRef<HTMLParagraphElement | null>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const section = sectionRef.current;
    const chip = chipRef.current;
    if (!section || !chip) return;
    const words = Array.from(
      section.querySelectorAll<HTMLElement>("[data-ms-word]"),
    );

    if (reduced) {
      for (const el of words) {
        el.style.transform = "";
        el.style.opacity = "";
      }
      chip.textContent = SETTLED;
      return;
    }

    let raf = 0;
    const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

    const update = () => {
      raf = 0;
      // Single read per frame; everything after is writes.
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight;
      if (rect.top > vh * 1.6 || rect.bottom < -vh * 0.6) return;
      const total = rect.height + vh * 0.4;
      const p = clamp01((vh * 0.92 - rect.top) / total);
      words.forEach((el, i) => {
        const local = clamp01((p - i * 0.09) / 0.5);
        const eased = local * local * (3 - 2 * local); // smoothstep
        const s = S0 + (1 - S0) * eased;
        el.style.transform = `scale(${s.toFixed(4)})`;
        el.style.opacity = (0.3 + 0.7 * eased).toFixed(3);
      });
      chip.textContent = p >= 1 ? SETTLED : `t = ${p.toFixed(3)} — interpolating · 보간 중`;
    };

    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [reduced]);

  return (
    <section
      ref={sectionRef}
      className="raster-section"
      aria-labelledby="raster-ms-title"
    >
      <div className="raster-frame">
        <header className="raster-sechead">
          <span className="raster-sechead__no" aria-hidden="true">
            02
          </span>
          <h2 className="raster-sechead__title" id="raster-ms-title">
            modular scale{" "}
            <span lang="ko" className="raster-sechead__ko">
              모듈러 스케일
            </span>
          </h2>
          <p className="raster-ms__chip raster-mono" ref={chipRef} aria-hidden="true">
            {SETTLED}
          </p>
        </header>

        <div className="raster-grid">
          <div className="raster-ms__intro" data-flip>
            <p>
              ratio 1.333 — the perfect fourth. approved 1957. sizes are not
              chosen; they are derived.
              <span lang="ko">
                비율 1.333 — 완전4도. 1957년 승인. 크기는 고르는 것이 아니라
                도출하는 것이다.
              </span>
            </p>
            <p>
              between steps there is nothing. a size off the scale is not a
              size.
              <span lang="ko">
                단계 사이에는 아무것도 없다. 스케일을 벗어난 크기는 크기가
                아니다.
              </span>
            </p>
          </div>

          <ul className="raster-ms__list" data-flip>
            {STEPS.map((s) => (
              <li key={s.step} className="raster-ms__row">
                <span className="raster-ms__ann raster-mono">
                  st {s.step} · {s.pow}
                </span>
                <span
                  className={`raster-ms__word raster-ms__word--${s.step}`}
                  data-ms-word
                >
                  {s.en} <span lang="ko">{s.ko}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
