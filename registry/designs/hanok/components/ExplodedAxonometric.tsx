"use client";

import { useCallback, useRef } from "react";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import { useScrollProgress } from "../hooks/useScrollProgress";

/**
 * Section 02 — the exploded axonometric, scrubbed by scroll. THE SIGNATURE.
 *
 * A hanok is a section drawing before it is a plan: the roof (처마/지붕),
 * the great beam (대들보), the columns (기둥), the maru floor (마루), and
 * the foundation stones (주춧돌) stack in a clear vertical order, joined
 * by mortise-and-tenon (장부이음) — no nails. The page disassembles that
 * stack into an exploded axonometric as you scroll: each layer separates
 * axially, the callout lines draw in (stroke-dashoffset, pathLength=1),
 * and the bilingual labels settle beside their part.
 *
 * Travel ratios sell the Z-axis: roof and foundation (the outer planes)
 * move 3.4× farther than the beams/columns/floor sandwiched between them —
 * the same parallax logic as a real exploded architectural diagram.
 *
 * The server-rendered state is the ASSEMBLED hanok section with all
 * callouts drawn and labels visible. No-JS and reduced-motion simply keep
 * that state (the CSS collapses the 320vh runway). Under 720px the
 * in-SVG callouts hand off to an HTML legend.
 *
 * Motion is transform (translateY per layer), stroke-dashoffset (callouts),
 * and opacity (labels) only — never layout. The scrub is rAF-throttled and
 * parked offscreen (gate G3, via useScrollProgress).
 */

type Layer = {
  id: string;
  /** assembled center y of the layer, viewBox units */
  cy: number;
  /** full-explode travel: signed px the layer moves at p=1.
      Outer planes (roof/foundation) travel ~3.4× the inner planes. */
  spread: number;
  /** drawing window for the callout, staggered by index */
  drawStart: number;
  label: string;
  labelKr: string;
  gloss: string;
  glossKr: string;
  /** the callout the eave-red "key" line points at (the mortise) */
  key?: boolean;
};

const LAYERS: Layer[] = [
  {
    id: "roof",
    cy: 120,
    spread: -168,
    drawStart: 0.3,
    label: "CURVED-EAVE ROOF",
    labelKr: "처마 · 지붕",
    gloss: "tiles on a ridge beam",
    glossKr: "용마루 위 기와",
  },
  {
    id: "beam",
    cy: 210,
    spread: -86,
    drawStart: 0.37,
    label: "GREAT BEAM",
    labelKr: "대들보",
    gloss: "spans column to column",
    glossKr: "기둥 사이를 잇는 큰 들보",
    key: true,
  },
  {
    id: "column",
    cy: 320,
    spread: -44,
    drawStart: 0.44,
    label: "COLUMNS",
    labelKr: "기둥",
    gloss: "tenoned into the stones",
    glossKr: "주춧돌에 장부로 세운 기둥",
  },
  {
    id: "floor",
    cy: 410,
    spread: 96,
    drawStart: 0.51,
    label: "MARU FLOOR",
    labelKr: "마루",
    gloss: "the raised wooden hall",
    glossKr: "높여 깐 마루바닥",
  },
  {
    id: "foundation",
    cy: 470,
    spread: 168,
    drawStart: 0.58,
    label: "FOUNDATION STONES",
    labelKr: "주춧돌",
    gloss: "the building rests on stone",
    glossKr: "집이 돌 위에 앉는다",
  },
];

/** Explode timing: plates separate while p ∈ [0.06, 0.78]. */
const EXPLODE_START = 0.06;
const EXPLODE_SPAN = 0.72;
const DRAW_SPAN = 0.18;

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const smoothstep = (v: number) => v * v * (3 - 2 * v);

export default function ExplodedAxonometric() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const groupRefs = useRef<Array<SVGGElement | null>>([]);
  const lineRefs = useRef<Array<SVGPathElement | null>>([]);
  const labelRefs = useRef<Array<SVGGElement | null>>([]);
  const reduced = usePrefersReducedMotion();

  const apply = useCallback((p: number) => {
    const e = smoothstep(clamp01((p - EXPLODE_START) / EXPLODE_SPAN));
    LAYERS.forEach((layer, i) => {
      const g = groupRefs.current[i];
      if (g) {
        // translate3d — compositor-friendly, no layout.
        g.style.transform = `translate3d(0, ${(layer.spread * e).toFixed(2)}px, 0)`;
      }
      const t = clamp01((p - layer.drawStart) / DRAW_SPAN);
      const line = lineRefs.current[i];
      if (line) line.style.strokeDashoffset = String(1 - t);
      const label = labelRefs.current[i];
      if (label) label.style.opacity = String(clamp01(t * 1.5));
    });
  }, []);

  useScrollProgress(sectionRef, apply, !reduced);

  return (
    <section
      ref={sectionRef}
      className="hanok-explode"
      aria-labelledby="hanok-explode-title"
    >
      <div className="hanok-explode__sticky">
        <div className="hanok-sechead">
          <span className="hanok-sechead__no" aria-hidden="true">
            02
          </span>
          <h2 className="hanok-sechead__title" id="hanok-explode-title">
            The building, taken apart{" "}
            <span lang="ko">집을 분해하다</span>
          </h2>
          <p className="hanok-sechead__note">
            Keep scrolling — it opens.{" "}
            <span lang="ko">스크롤하면 열립니다.</span>
          </p>
        </div>

        <svg
          className="hanok-explode__svg"
          viewBox="0 0 760 620"
          role="img"
          aria-label="Exploded axonometric of the hanok: curved-eave roof, great beam, columns, maru floor, and foundation stones separate as you scroll, each labeled with its Korean name and joined by mortise-and-tenon. 한옥의 폭발 등각 투상도 — 처마, 대들보, 기둥, 마루, 주춧돌이 스크롤에 따라 벌어지며, 각각의 한국어 이름과 장부이음 결구가 드러난다."
        >
          {/* a faint blueprint baseline — the ground the building sites on */}
          <line
            x1="80"
            y1="540"
            x2="680"
            y2="540"
            stroke="var(--hanok-hairline)"
            strokeWidth="1"
            strokeDasharray="2 5"
          />

          {LAYERS.map((layer, i) => (
            <g
              key={layer.id}
              ref={(el) => {
                groupRefs.current[i] = el;
              }}
              className={`hanok-layer hanok-layer--${layer.id}`}
            >
              {renderLayer(layer)}

              {/* the callout travels with its layer so it always points at the part */}
              <g
                className="hanok-callout"
                ref={(el) => {
                  labelRefs.current[i] = el;
                }}
              >
                <path
                  ref={(el) => {
                    lineRefs.current[i] = el;
                  }}
                  className={`hanok-callout__line${layer.key ? " hanok-callout__line--key" : ""}`}
                  d={calloutPath(layer)}
                  pathLength={1}
                  strokeDasharray={1}
                  strokeDashoffset={0}
                />
                <circle
                  className="hanok-callout__dot"
                  cx={calloutDot(layer).x}
                  cy={calloutDot(layer).y}
                  r={3}
                />
                <text
                  className="hanok-callout__label"
                  x={calloutLabel(layer).x}
                  y={calloutLabel(layer).y}
                  textAnchor={calloutLabel(layer).anchor}
                >
                  {layer.label}
                </text>
                <text
                  className="hanok-callout__kr"
                  lang="ko"
                  x={calloutLabel(layer).x}
                  y={calloutLabel(layer).y + 18}
                  textAnchor={calloutLabel(layer).anchor}
                >
                  {layer.labelKr}
                </text>
                <text
                  className="hanok-callout__kr-gloss"
                  x={calloutLabel(layer).x}
                  y={calloutLabel(layer).y + 34}
                  textAnchor={calloutLabel(layer).anchor}
                >
                  {layer.gloss}
                </text>
              </g>
            </g>
          ))}
        </svg>

        {/* Narrow screens read this instead of the in-SVG callouts. */}
        <ol className="hanok-explode__legend">
          {LAYERS.map((layer) => (
            <li key={layer.id}>
              <span className="hanok-legend__gloss">
                {layer.label}
                <br />
                <span className="hanok-legend__kr" lang="ko">
                  {layer.labelKr}
                </span>
                <br />
                <span>{layer.gloss}</span>
              </span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/** The geometry of each layer, centered on its assembled cy. */
function renderLayer(layer: Layer) {
  switch (layer.id) {
    case "roof":
      return (
        <g className="hanok-roof">
          {/* the curved-eave roof: a broad bowed trapezoid with upturned tips,
              ridge on top, tile courses implied by horizontal bands. */}
          {/* roof body — curved eave silhouette via a path */}
          <path
            className="hanok-roof__tile"
            d={`
              M 140 ${layer.cy + 26}
              Q 130 ${layer.cy + 22}, 122 ${layer.cy + 30}
              L 110 ${layer.cy + 38}
              Q 200 ${layer.cy - 30}, 380 ${layer.cy - 34}
              Q 560 ${layer.cy - 30}, 650 ${layer.cy + 38}
              L 638 ${layer.cy + 30}
              Q 630 ${layer.cy + 22}, 620 ${layer.cy + 26}
              Q 500 ${layer.cy + 14}, 380 ${layer.cy + 12}
              Q 260 ${layer.cy + 14}, 140 ${layer.cy + 26}
              Z
            `}
          />
          {/* ridge beam on top */}
          <rect
            className="hanok-roof__ridge"
            x="200"
            y={layer.cy - 40}
            width="360"
            height="10"
            rx="3"
          />
          {/* the dancheong eave trim — the one red, tracing both upturned tips */}
          <path
            className="hanok-roof__eave-trim"
            d={`M 122 ${layer.cy + 30} Q 116 ${layer.cy + 40}, 128 ${layer.cy + 44}`}
          />
          <path
            className="hanok-roof__eave-trim"
            d={`M 638 ${layer.cy + 30} Q 644 ${layer.cy + 40}, 632 ${layer.cy + 44}`}
          />
          {/* rafter ends peeking under the eave */}
          <line className="hanok-roof__rafter" x1="150" y1={layer.cy + 30} x2="150" y2={layer.cy + 40} />
          <line className="hanok-roof__rafter" x1="190" y1={layer.cy + 26} x2="190" y2={layer.cy + 36} />
          <line className="hanok-roof__rafter" x1="570" y1={layer.cy + 26} x2="570" y2={layer.cy + 36} />
          <line className="hanok-roof__rafter" x1="610" y1={layer.cy + 30} x2="610" y2={layer.cy + 40} />
        </g>
      );
    case "beam":
      return (
        <g className="hanok-beam">
          {/* the great beam (대들보): a long timber spanning column to column,
              with the tenons (장부) protruding at both ends — the joinery that
              the eave-red key callout points at. */}
          <rect
            className="hanok-beam__timber"
            x="150"
            y={layer.cy - 16}
            width="460"
            height="32"
            rx="4"
          />
          {/* tenon protrusions — the mortise-and-tenon detail */}
          <rect className="hanok-beam__tenon" x="138" y={layer.cy - 8} width="16" height="16" rx="2" />
          <rect className="hanok-beam__tenon" x="606" y={layer.cy - 8} width="16" height="16" rx="2" />
          {/* a center notch — where the ridge post would tenon in */}
          <line
            x1="374"
            y1={layer.cy - 16}
            x2="386"
            y2={layer.cy - 16}
            stroke="var(--hanok-beam)"
            strokeWidth="2"
          />
        </g>
      );
    case "column":
      return (
        <g className="hanok-column">
          {/* four columns (기둥), evenly spaced, each tenoned top and bottom */}
          {[150, 280, 410, 540].map((cx) => (
            <g key={cx}>
              <rect
                className="hanok-column__post"
                x={cx - 14}
                y={layer.cy - 70}
                width="28"
                height="140"
                rx="3"
              />
              {/* top tenon */}
              <rect
                className="hanok-beam__tenon"
                x={cx - 6}
                y={layer.cy - 78}
                width="12"
                height="10"
                rx="1.5"
              />
              {/* bottom tenon — into the foundation stone */}
              <rect
                className="hanok-beam__tenon"
                x={cx - 6}
                y={layer.cy + 68}
                width="12"
                height="10"
                rx="1.5"
              />
            </g>
          ))}
          {/* the enclosed earthen wall (흙벽) between the columns — warm fill */}
          <rect
            className="hanok-wall__fill"
            x="164"
            y={layer.cy - 64}
            width="376"
            height="128"
            opacity="0.45"
          />
        </g>
      );
    case "floor":
      return (
        <g className="hanok-floor">
          {/* the maru floor (마루): raised wooden deck with plank lines */}
          <rect
            className="hanok-floor__maru"
            x="120"
            y={layer.cy - 12}
            width="520"
            height="24"
            rx="2"
          />
          {/* plank seams — the maru's recessed floorboards */}
          {[180, 240, 300, 360, 420, 480, 540, 600].map((px) => (
            <line
              key={px}
              className="hanok-floor__plank"
              x1={px}
              y1={layer.cy - 12}
              x2={px}
              y2={layer.cy + 12}
            />
          ))}
        </g>
      );
    case "foundation":
      return (
        <g className="hanok-foundation">
          {/* four foundation stones (주춧돌), one per column */}
          {[150, 280, 410, 540].map((cx) => (
            <rect
              key={cx}
              className="hanok-foundation__stone"
              x={cx - 28}
              y={layer.cy - 14}
              width="56"
              height="28"
              rx="4"
            />
          ))}
          {/* a mortise socket hinted on each stone — where the column tenons in */}
          {[150, 280, 410, 540].map((cx) => (
            <rect
              key={cx}
              x={cx - 7}
              y={layer.cy - 16}
              width="14"
              height="6"
              rx="1"
              fill="var(--hanok-paper)"
              stroke="var(--hanok-beam)"
              strokeWidth="0.8"
            />
          ))}
        </g>
      );
    default:
      return null;
  }
}

/** Each layer's callout line geometry — start at the part, kink, run out
    to the label. Right-side layers label right, left-side label left,
    so labels never collide across the spread. */
function calloutPath(layer: Layer): string {
  const right = layer.id === "roof" || layer.id === "beam" || layer.id === "floor";
  const startX = right ? 650 : 110;
  const kinkX = right ? 690 : 70;
  const endX = right ? 730 : 30;
  return `M ${startX} ${layer.cy} H ${kinkX} L ${endX} ${layer.cy}`;
}

function calloutDot(layer: Layer): { x: number; y: number } {
  const right = layer.id === "roof" || layer.id === "beam" || layer.id === "floor";
  return { x: right ? 650 : 110, y: layer.cy };
}

function calloutLabel(layer: Layer): { x: number; y: number; anchor: "start" | "end" } {
  const right = layer.id === "roof" || layer.id === "beam" || layer.id === "floor";
  return {
    x: right ? 700 : 60,
    y: layer.cy - 8,
    anchor: right ? "start" : "end",
  };
}
