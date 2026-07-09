"use client";

import type { CSSProperties } from "react";

/**
 * Section 01 — the hero: a palace eave drawn front-on.
 *
 * Two stacked SVG layers share one set of computed curves:
 *   1. the ink layer draws itself (stroke-dashoffset, staggered per path),
 *   2. the paint layer — the same roof fully colored — floods over it via
 *      an animated clip-path sweep, left to right, like a brush loading.
 *
 * Without JavaScript (no .giwa-js) or under reduced motion, the painted
 * roof is simply there: the final frame is the default state.
 */

type Pt = { x: number; y: number };
type Cubic = readonly [Pt, Pt, Pt, Pt];
type Quad = readonly [Pt, Pt, Pt];

/** 처마선 — the eave curve: corners lifted, center at rest. */
const EAVE: Cubic = [
  { x: 48, y: 300 },
  { x: 320, y: 352 },
  { x: 880, y: 352 },
  { x: 1152, y: 300 },
];

/** 용마루 — the ridge, sagging gently like a held rope. */
const RIDGE_TOP: Quad = [
  { x: 96, y: 88 },
  { x: 600, y: 128 },
  { x: 1104, y: 88 },
];
const RIDGE_BOT: Quad = [
  { x: 96, y: 103 },
  { x: 600, y: 143 },
  { x: 1104, y: 103 },
];

function cubicAt(t: number, [p0, p1, p2, p3]: Cubic): Pt {
  const u = 1 - t;
  return {
    x: u * u * u * p0.x + 3 * u * u * t * p1.x + 3 * u * t * t * p2.x + t * t * t * p3.x,
    y: u * u * u * p0.y + 3 * u * u * t * p1.y + 3 * u * t * t * p2.y + t * t * t * p3.y,
  };
}

function quadAt(t: number, [p0, p1, p2]: Quad): Pt {
  const u = 1 - t;
  return {
    x: u * u * p0.x + 2 * u * t * p1.x + t * t * p2.x,
    y: u * u * p0.y + 2 * u * t * p1.y + t * t * p2.y,
  };
}

const offsetEave = (dy: number): Cubic =>
  EAVE.map((p) => ({ x: p.x, y: p.y + dy })) as unknown as Cubic;

const cubicPath = ([p0, p1, p2, p3]: Cubic): string =>
  `M${p0.x} ${p0.y} C ${p1.x} ${p1.y}, ${p2.x} ${p2.y}, ${p3.x} ${p3.y}`;

const quadPath = ([p0, p1, p2]: Quad): string =>
  `M${p0.x} ${p0.y} Q ${p1.x} ${p1.y} ${p2.x} ${p2.y}`;

/** Points spaced along an offset of the eave — one per tile-end / rafter. */
function row(n: number, dy: number, inset: number): Pt[] {
  const curve = offsetEave(dy);
  return Array.from({ length: n }, (_, i) => {
    const t = inset + (1 - 2 * inset) * ((i + 0.5) / n);
    const p = cubicAt(t, curve);
    return { x: Math.round(p.x * 10) / 10, y: Math.round(p.y * 10) / 10 };
  });
}

/* -- shared geometry ------------------------------------------------------ */

const RIDGE_TOP_D = quadPath(RIDGE_TOP);
const RIDGE_BOT_D = quadPath(RIDGE_BOT);
const RIDGE_BAND_D = `${RIDGE_TOP_D} L1104 103 Q 600 143 96 103 Z`;

/** 망와 — the upturned ridge-end tiles. */
const HOOK_L_D = "M96 103 C 87 98, 82 88, 85 72 C 91 79, 98 82, 105 85";
const HOOK_R_D = "M1104 103 C 1113 98, 1118 88, 1115 72 C 1109 79, 1102 82, 1095 85";

/** 내림마루 — hip lines carrying the ridge down to the eave corners. */
const HIP_L_D = "M96 96 C 70 160, 55 232, 48 300";
const HIP_R_D = "M1104 96 C 1130 160, 1145 232, 1152 300";

const EAVE_D = cubicPath(EAVE);

const ROOF_PLANE_D =
  `${RIDGE_TOP_D} C 1130 160, 1145 232, 1152 300` +
  ` C 880 352, 320 352, 48 300 C 55 232, 70 160, 96 88 Z`;

/** 기왓골 — tile courses fanning from ridge to eave. */
const TILE_LINES: string[] = Array.from({ length: 11 }, (_, i) => {
  const t = (i + 1) / 12;
  const a = quadAt(t, RIDGE_BOT);
  const b = cubicAt(t, EAVE);
  const cx = (a.x + b.x) / 2;
  const cy = (a.y + b.y) / 2 + 14;
  return `M${a.x.toFixed(1)} ${a.y.toFixed(1)} Q ${cx.toFixed(1)} ${cy.toFixed(1)} ${b.x.toFixed(1)} ${b.y.toFixed(1)}`;
});

const MAKSAE = row(26, 10, 0.015); // 수막새 — round tile-ends under the eave edge
const RAFTERS = row(18, 46, 0.04); // 연목 — rafter ends, each a painted disc

const BEAM_TOP_D = cubicPath(offsetEave(64));
const BEAM_BOT_D = cubicPath(offsetEave(90));
const BEAM_BAND_D =
  `${BEAM_TOP_D} L1152 390 C 880 442, 320 442, 48 390 Z`;
const BEAM_LIGHT_D = cubicPath(offsetEave(69)); // 빛 — the white breath line

const COL_TS = [0.21, 0.79];
const COLUMNS: { x: number; y: number }[] = COL_TS.map((t) => {
  const p = cubicAt(t, offsetEave(90));
  return { x: Math.round(p.x), y: Math.round(p.y) - 4 };
});

const columnPath = (c: { x: number; y: number }): string =>
  `M${c.x - 16} 470 L${c.x - 16} ${c.y} L${c.x + 16} ${c.y} L${c.x + 16} 470`;

const d = (s: string): CSSProperties => ({ "--d": s } as CSSProperties);

/* -- layers ---------------------------------------------------------------- */

function InkLayer() {
  return (
    <svg className="giwa-roof giwa-roof--ink" viewBox="0 0 1200 470" aria-hidden="true">
      <path className="giwa-ink-draw" style={d("0s")} d={RIDGE_TOP_D} pathLength={1} />
      <path className="giwa-ink-draw" style={d("0.1s")} d={RIDGE_BOT_D} pathLength={1} />
      <path className="giwa-ink-draw" style={d("0.25s")} d={HOOK_L_D} pathLength={1} />
      <path className="giwa-ink-draw" style={d("0.25s")} d={HOOK_R_D} pathLength={1} />
      <path className="giwa-ink-draw" style={d("0.3s")} d={HIP_L_D} pathLength={1} />
      <path className="giwa-ink-draw" style={d("0.3s")} d={HIP_R_D} pathLength={1} />
      {TILE_LINES.map((line, i) => (
        <path
          key={line}
          className="giwa-ink-draw giwa-ink-draw--thin"
          style={d(`${(0.38 + i * 0.045).toFixed(3)}s`)}
          d={line}
          pathLength={1}
        />
      ))}
      <path
        className="giwa-ink-draw giwa-ink-draw--slow"
        style={d("0.55s")}
        d={EAVE_D}
        pathLength={1}
      />
      <path className="giwa-ink-draw" style={d("0.95s")} d={BEAM_TOP_D} pathLength={1} />
      <path className="giwa-ink-draw" style={d("1.05s")} d={BEAM_BOT_D} pathLength={1} />
      {COLUMNS.map((c) => (
        <path
          key={c.x}
          className="giwa-ink-draw"
          style={d("1.15s")}
          d={columnPath(c)}
          pathLength={1}
        />
      ))}
      <g className="giwa-roof__dots" style={d("1.3s")}>
        {MAKSAE.map((p) => (
          <circle key={p.x} className="giwa-ink" cx={p.x} cy={p.y} r={9} />
        ))}
      </g>
      <g className="giwa-roof__dots" style={d("1.5s")}>
        {RAFTERS.map((p) => (
          <circle key={p.x} className="giwa-ink" cx={p.x} cy={p.y} r={7.5} />
        ))}
      </g>
    </svg>
  );
}

function PaintLayer() {
  return (
    <svg className="giwa-roof" viewBox="0 0 1200 470" aria-hidden="true">
      {/* the roof plane — fired clay, deliberately unpainted */}
      <path className="giwa-f-tile giwa-s-ink2" d={ROOF_PLANE_D} />
      {TILE_LINES.map((line) => (
        <path key={line} className="giwa-s-tilelight" d={line} fill="none" />
      ))}
      <path className="giwa-f-ink" d={RIDGE_BAND_D} />
      <path className="giwa-s-ink5" d={HOOK_L_D} fill="none" />
      <path className="giwa-s-ink5" d={HOOK_R_D} fill="none" />
      <path className="giwa-s-ink4" d={HIP_L_D} fill="none" />
      <path className="giwa-s-ink4" d={HIP_R_D} fill="none" />
      <path className="giwa-s-ink6" d={EAVE_D} fill="none" />

      {/* 수막새 — clay tile-ends, a quiet gray rhythm above the color */}
      {MAKSAE.map((p) => (
        <g key={p.x}>
          <circle className="giwa-f-clay giwa-s-ink2" cx={p.x} cy={p.y} r={9} />
          <circle className="giwa-s-paperline" cx={p.x} cy={p.y} r={3.6} fill="none" />
        </g>
      ))}

      {/* 연목 — rafter ends: noerok disc, white breath ring, seokganju heart */}
      {RAFTERS.map((p) => (
        <g key={p.x}>
          <circle className="giwa-f-noe giwa-s-ink2" cx={p.x} cy={p.y} r={7.5} />
          <circle className="giwa-s-baek" cx={p.x} cy={p.y} r={4.6} fill="none" />
          <circle className="giwa-f-seok" cx={p.x} cy={p.y} r={2.1} />
        </g>
      ))}

      {/* 창방 — the beam on its noerok ground coat, moricho at both ends */}
      <path className="giwa-f-noe giwa-s-ink2" d={BEAM_BAND_D} />
      <path className="giwa-s-baekline" d={BEAM_LIGHT_D} fill="none" />
      <path className="giwa-f-sam" d="M48 364 A 13 13 0 0 1 48 390 Z" />
      <path className="giwa-s-baek" d="M48 368 A 11 11 0 0 1 48 386" fill="none" />
      <path className="giwa-f-hwang" d="M48 371 A 6.5 6.5 0 0 1 48 383 Z" />
      <path className="giwa-f-sam" d="M1152 364 A 13 13 0 0 0 1152 390 Z" />
      <path className="giwa-s-baek" d="M1152 368 A 11 11 0 0 0 1152 386" fill="none" />
      <path className="giwa-f-hwang" d="M1152 371 A 6.5 6.5 0 0 0 1152 383 Z" />

      {/* 기둥 — two columns in seokganju, grounding the frame */}
      {COLUMNS.map((c) => (
        <path
          key={c.x}
          className="giwa-f-seok giwa-s-ink2"
          d={`${columnPath(c)} Z`}
        />
      ))}
    </svg>
  );
}

/* -- section ---------------------------------------------------------------- */

export default function Hero() {
  return (
    <header className="giwa-hero">
      <div className="giwa-hero__text">
        <p className="giwa-hero__kicker">
          <span lang="en">GIWA</span> · 궁궐 처마 복원공방 · 도감 제八호
        </p>
        <h1 className="giwa-hero__title">단청</h1>
        <p className="giwa-hero__sub" lang="en">
          GIWA · Under Painted Eaves
        </p>
        <p className="giwa-hero__lead">
          단청 — 나무를 지키고, 위계를 말하고, 아름다움을 남긴다.
        </p>
        <p className="giwa-hero__lead-en" lang="en">
          Dancheong: it protects the wood, states the hierarchy, and leaves
          behind beauty.
        </p>
      </div>

      <div
        className="giwa-hero__art"
        role="img"
        aria-label="궁궐 처마 정면도 — 용마루에서 처마선, 연목, 창방까지 먹선으로 그려진 뒤 왼쪽에서 오른쪽으로 단청 채색이 입혀진다. A palace eave elevation, drawn in ink line and then flooded left to right with dancheong color."
      >
        <InkLayer />
        <div className="giwa-hero__paint">
          <PaintLayer />
        </div>
      </div>
    </header>
  );
}
