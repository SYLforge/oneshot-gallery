"use client";

import { useCallback, useRef } from "react";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import { useScrollProgress } from "../hooks/useScrollProgress";

type Layer = {
  id: string;
  /** final translateY at full explode, px in viewBox units */
  spread: number;
  /** assembled center y of the plate */
  cy: number;
  label: string;
  labelKo: string;
};

const LAYERS: Layer[] = [
  { id: "glass", spread: -132, cy: 222, label: "etched glass · 0.4 mm", labelKo: "새김 유리" },
  { id: "panel", spread: -44, cy: 260, label: "e-ink panel · 300 ppi", labelKo: "전자잉크 패널" },
  { id: "battery", spread: 44, cy: 298, label: "2,900 mAh · six weeks", labelKo: "여섯 주짜리 배터리" },
  { id: "back", spread: 132, cy: 336, label: "magnesium · one sheet", labelKo: "마그네슘 한 장" },
];

/** Explode timing: plates travel while p ∈ [0.08, 0.70]. */
const EXPLODE_START = 0.08;
const EXPLODE_SPAN = 0.62;
/** Callout i draws while p ∈ [0.5 + 0.09i, 0.72 + 0.09i]. */
const DRAW_START = 0.5;
const DRAW_STAGGER = 0.09;
const DRAW_SPAN = 0.22;

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const smoothstep = (v: number) => v * v * (3 - 2 * v);

/**
 * Section 03 — the exploded device, scrubbed by scroll.
 *
 * The section is 280vh tall (JS-gated in CSS); a sticky stage holds the
 * SVG. Scroll progress drives, per frame: a translateY on each layer group
 * (glass and back travel 3× farther than panel and battery — the parallax
 * that sells the depth), a stroke-dashoffset on each callout line
 * (pathLength=1, so the draw is 1→0 with no length measuring), and an
 * opacity fade on each label. Transform / dashoffset / opacity only — the
 * scrub never causes layout.
 *
 * The server-rendered state is the ASSEMBLED diagram with all callouts
 * drawn and labels visible; the callout group moves with its plate, so
 * the label always points at the part. No JS, or reduced motion, simply
 * keeps that state (and the CSS collapses the 280vh runway).
 */
export default function ExplodedView() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const groupRefs = useRef<Array<SVGGElement | null>>([]);
  const lineRefs = useRef<Array<SVGPathElement | null>>([]);
  const labelRefs = useRef<Array<SVGTextElement | null>>([]);
  const reduced = usePrefersReducedMotion();

  const apply = useCallback((p: number) => {
    const e = smoothstep(clamp01((p - EXPLODE_START) / EXPLODE_SPAN));
    LAYERS.forEach((layer, i) => {
      const g = groupRefs.current[i];
      if (g) {
        g.style.transform = `translate3d(0, ${(layer.spread * e).toFixed(2)}px, 0)`;
      }
      const t = clamp01((p - (DRAW_START + i * DRAW_STAGGER)) / DRAW_SPAN);
      const line = lineRefs.current[i];
      if (line) line.style.strokeDashoffset = String(1 - t);
      const label = labelRefs.current[i];
      if (label) label.style.opacity = String(clamp01(t * 1.4));
    });
  }, []);

  useScrollProgress(sectionRef, apply, !reduced);

  return (
    <section
      ref={sectionRef}
      className="slate-exploded"
      aria-labelledby="slate-exploded-title"
    >
      <div className="slate-exploded__sticky">
        <div className="slate-sechead">
          <span className="slate-sechead__no" aria-hidden="true">
            03
          </span>
          <h2 className="slate-sechead__title" id="slate-exploded-title">
            What&rsquo;s inside <span lang="ko">안쪽</span>
          </h2>
          <p className="slate-sechead__note">
            Keep scrolling — the slate opens.{" "}
            <span lang="ko">스크롤하면 열립니다.</span>
          </p>
        </div>

        <svg
          className="slate-exploded__svg"
          viewBox="0 0 640 520"
          role="img"
          aria-label="Exploded diagram of the slate — etched glass, e-ink panel, battery, and magnesium back separate as you scroll. 분해도: 새김 유리, 전자잉크 패널, 배터리, 마그네슘 등판이 스크롤에 따라 벌어집니다."
        >
          {LAYERS.map((layer, i) => (
            <g
              key={layer.id}
              ref={(el) => {
                groupRefs.current[i] = el;
              }}
              className="slate-exploded__layer"
            >
              <g className={`slate-plate slate-plate--${layer.id}`}>
                <rect
                  className="slate-plate__slab"
                  x="90"
                  y={layer.cy - 17}
                  width="280"
                  height="34"
                  rx="17"
                />
                {layer.id === "glass" ? (
                  <line
                    className="slate-plate__sheen"
                    x1="150"
                    y1={layer.cy + 9}
                    x2="192"
                    y2={layer.cy - 9}
                  />
                ) : null}
                {layer.id === "panel" ? (
                  <g className="slate-plate__text">
                    <line x1="130" y1={layer.cy - 6} x2="290" y2={layer.cy - 6} />
                    <line x1="130" y1={layer.cy} x2="250" y2={layer.cy} />
                    <line x1="130" y1={layer.cy + 6} x2="270" y2={layer.cy + 6} />
                  </g>
                ) : null}
                {layer.id === "battery" ? (
                  <>
                    <rect
                      className="slate-plate__terminal"
                      x="330"
                      y={layer.cy - 5}
                      width="14"
                      height="10"
                      rx="3"
                    />
                    <text className="slate-plate__stamp" x="112" y={layer.cy + 4}>
                      2,900 mAh
                    </text>
                  </>
                ) : null}
                {layer.id === "back" ? (
                  <>
                    <circle className="slate-plate__emboss" cx="120" cy={layer.cy} r="4" />
                    <text
                      className="slate-plate__stamp slate-plate__stamp--etch"
                      x="230"
                      y={layer.cy + 4}
                      textAnchor="middle"
                    >
                      HANJI SLATE
                    </text>
                  </>
                ) : null}
              </g>

              {/* the callout travels with its plate, so it always points at the part */}
              <g className="slate-exploded__callout">
                <path
                  ref={(el) => {
                    lineRefs.current[i] = el;
                  }}
                  className="slate-exploded__line"
                  d={`M374 ${layer.cy} H430`}
                  pathLength={1}
                  strokeDasharray={1}
                  strokeDashoffset={0}
                />
                <text
                  ref={(el) => {
                    labelRefs.current[i] = el;
                  }}
                  className="slate-exploded__label"
                  x="438"
                  y={layer.cy - 1}
                >
                  {layer.label}
                  <tspan className="slate-exploded__labelKo" lang="ko" x="438" dy="17">
                    {layer.labelKo}
                  </tspan>
                </text>
              </g>
            </g>
          ))}
        </svg>

        {/* Narrow screens hide the in-SVG callouts and read this instead. */}
        <ol className="slate-exploded__legend">
          <li>
            etched glass · 0.4 mm <span lang="ko">새김 유리</span>
          </li>
          <li>
            e-ink panel · 300 ppi <span lang="ko">전자잉크 패널</span>
          </li>
          <li>
            battery · 2,900 mAh <span lang="ko">여섯 주짜리 배터리</span>
          </li>
          <li>
            magnesium back · one sheet <span lang="ko">마그네슘 한 장</span>
          </li>
        </ol>
      </div>
    </section>
  );
}
