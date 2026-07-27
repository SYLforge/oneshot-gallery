"use client";

import { useRef } from "react";
import { useScrollProgress } from "../hooks/useScrollProgress";
import { withAlpha } from "./sneaker";

/**
 * Section 02 — the build, pinned and scrubbed. As you scroll through the
 * 220vh pin, the silhouette's parts separate vertically into an exploded
 * technical illustration, connected by hairline rails and labeled in both
 * languages. The separation is driven by `--orbit-build` (0→1), written by
 * useScrollProgress from the pin's scroll position.
 *
 * Each part is its own absolutely-positioned SVG layer with a per-part
 * offset; the offset reads `calc(var(--orbit-build) * <partMax>px)` so the
 * further-up parts travel further — the classic exploded-diagram spread.
 * The rails are clip-path-revealed as the parts move apart, so the diagram
 * "draws itself" as you scrub.
 *
 * Under reduced motion the lerp in useScrollProgress is bypassed, so the
 * spread tracks the wheel 1:1 — still fully usable, just unsmoothed.
 */
export default function ExplodedBuild() {
  const pinRef = useRef<HTMLDivElement | null>(null);
  useScrollProgress(pinRef, "--orbit-build");

  // Part travel in px at progress=1 (desktop). Scaled down on narrow screens
  // via the CSS (the calc uses a CSS var --orbit-explode-unit that the
  // stylesheet clamps responsively).
  return (
    <section
      className="orbit-build"
      aria-labelledby="orbit-build-title"
      ref={pinRef}
    >
      <div className="orbit-build__sticky">
        <div className="orbit-build__head" data-reveal>
          <p className="orbit-section__no" aria-hidden="true">
            02 · BUILD
          </p>
          <h2 className="orbit-section__title" id="orbit-build-title">
            Take it apart{" "}
            <span lang="ko" className="orbit-section__ko">
              분해도
            </span>
          </h2>
          <p className="orbit-section__meta">
            SCROLL TO EXPLODE · <span lang="ko">스크롤하면 펼쳐진다</span>
          </p>
        </div>

        <div className="orbit-build__diagram" role="img" aria-label="Exploded build diagram of the ORBIT sneaker: from bottom to top — rubber outsole, foam midsole, knit upper with its accent stripe, the lace pack, and the heel counter. 아래부터 위로 — 고무 아웃솔, 폼 미드솔, 니트 어퍼와 액센트 띠, 레이스팩, 힐 카운터의 분해도.">
          {/* Center axis rail (drawn by clip-path as parts separate) */}
          <span className="orbit-build__rail orbit-build__rail--a" aria-hidden="true" />
          <span className="orbit-build__rail orbit-build__rail--b" aria-hidden="true" />
          <span className="orbit-build__rail orbit-build__rail--c" aria-hidden="true" />
          <span className="orbit-build__rail orbit-build__rail--d" aria-hidden="true" />

          {/* Part layers, bottom → top. Each translates up by its offset. */}
          <ExplodedPart
            cls="orbit-build__part--outsole"
            labelEn="Outsole"
            labelKo="아웃솔"
            meta="Rubber · 4.2 mm"
            metaKo="고무 · 4.2mm"
          >
            <PartOutsole />
          </ExplodedPart>

          <ExplodedPart
            cls="orbit-build__part--midsole"
            labelEn="Midsole"
            labelKo="미드솔"
            meta="PEBA foam · 14 mm"
            metaKo="PEBA 폼 · 14mm"
          >
            <PartMidsole />
          </ExplodedPart>

          <ExplodedPart
            cls="orbit-build__part--upper"
            labelEn="Upper"
            labelKo="어퍼"
            meta="Knit + saddle"
            metaKo="니트 + 새들"
          >
            <PartUpper />
          </ExplodedPart>

          <ExplodedPart
            cls="orbit-build__part--laces"
            labelEn="Lace pack"
            labelKo="레이스팩"
            meta="Waxed · 6 eyelets"
            metaKo="왁스 가공 · 구멍 6"
          >
            <PartLaces />
          </ExplodedPart>

          <ExplodedPart
            cls="orbit-build__part--counter"
            labelEn="Heel counter"
            labelKo="힐 카운터"
            meta="TPU frame"
            metaKo="TPU 프레임"
          >
            <PartCounter />
          </ExplodedPart>
        </div>
      </div>
    </section>
  );
}

type PartProps = {
  cls: string;
  labelEn: string;
  labelKo: string;
  meta: string;
  metaKo: string;
  children: React.ReactNode;
};

function ExplodedPart({ cls, labelEn, labelKo, meta, metaKo, children }: PartProps) {
  return (
    <div className={`orbit-build__part ${cls}`}>
      <div className="orbit-build__part-art" aria-hidden="true">
        {children}
      </div>
      <div className="orbit-build__part-label">
        <span className="orbit-build__part-en">{labelEn}</span>
        <span className="orbit-build__part-ko" lang="ko">
          {labelKo}
        </span>
        <span className="orbit-build__part-meta">
          {meta} · <span lang="ko">{metaKo}</span>
        </span>
      </div>
    </div>
  );
}

/* -- part art: tiny stylized side-elevation shapes, drawn as SVG so the
 *    exploded view is crisp at any size. Colors are token roles. -- */

const STROKE = "#3a3a48";

function PartOutsole() {
  return (
    <svg viewBox="0 0 200 60" className="orbit-build__svg">
      <path
        d="M 8 38 Q 10 52 26 52 L 174 52 Q 192 52 194 38 L 192 30 Q 100 44 8 30 Z"
        fill="#0d0d12"
        stroke={STROKE}
        strokeWidth="1.2"
      />
      {/* tread blocks */}
      {Array.from({ length: 8 }, (_, i) => {
        const x = 24 + i * 19;
        return (
          <line
            key={i}
            x1={x}
            y1={40}
            x2={x}
            y2={50}
            stroke={withAlpha("#e8eef5", 0.25)}
            strokeWidth="1.4"
          />
        );
      })}
    </svg>
  );
}

function PartMidsole() {
  return (
    <svg viewBox="0 0 200 60" className="orbit-build__svg">
      <path
        d="M 6 44 L 194 44 L 178 22 Q 100 34 22 22 Z"
        fill="#e8eef5"
        stroke={STROKE}
        strokeWidth="1.2"
      />
      <path
        d="M 22 22 Q 100 34 178 22"
        fill="none"
        stroke={withAlpha("#0d0d12", 0.18)}
        strokeWidth="1"
      />
    </svg>
  );
}

function PartUpper() {
  return (
    <svg viewBox="0 0 200 70" className="orbit-build__svg">
      <path
        d="M 14 60 Q 12 40 30 30 Q 60 16 96 18 Q 120 20 140 14 Q 168 8 184 30 Q 188 44 182 58 Q 100 66 14 60 Z"
        fill="#3a2218"
        stroke={STROKE}
        strokeWidth="1.2"
      />
      {/* accent stripe */}
      <path
        d="M 150 26 Q 110 38 70 44 Q 96 30 150 26 Z"
        fill="#ff5722"
      />
      {/* collar opening */}
      <path
        d="M 150 16 Q 138 10 124 14 Q 136 20 150 16 Z"
        fill="#0d0d12"
        opacity="0.55"
      />
    </svg>
  );
}

function PartLaces() {
  return (
    <svg viewBox="0 0 200 40" className="orbit-build__svg">
      {[0, 1, 2, 3].map((i) => (
        <g key={i}>
          <circle cx={60 + i * 22} cy={20} r={5} fill={withAlpha("#9aa0ad", 0.3)} stroke={STROKE} strokeWidth="1" />
          <line
            x1={60 + i * 22}
            y1={20}
            x2={60 + i * 22 + 10}
            y2={20}
            stroke="#9aa0ad"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
        </g>
      ))}
      <line x1="40" y1="20" x2="150" y2="20" stroke={STROKE} strokeWidth="0.8" strokeDasharray="3 4" />
    </svg>
  );
}

function PartCounter() {
  return (
    <svg viewBox="0 0 120 70" className="orbit-build__svg">
      <path
        d="M 20 60 Q 14 30 40 16 Q 70 8 96 18 Q 104 30 100 58 Q 60 64 20 60 Z"
        fill={withAlpha("#241208", 0.85)}
        stroke={STROKE}
        strokeWidth="1.2"
      />
      <path
        d="M 40 16 Q 70 8 96 18"
        fill="none"
        stroke={withAlpha("#ff5722", 0.4)}
        strokeWidth="1.4"
      />
    </svg>
  );
}
