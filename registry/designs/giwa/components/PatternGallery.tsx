"use client";

import type { ComponentType, CSSProperties } from "react";

/**
 * Section 03 — the pattern gallery: four dancheong motifs rebuilt as crisp
 * SVG. Each motif is constructed the way the guild would construct it — one
 * unit, then symmetry: a petal rotated eight times, a beam-end mirrored,
 * a fret cell translated. Nothing is traced; everything is compass work.
 *
 * Every motif has two layers, like the hero:
 *   ink (the 초 — construction drawing) draws itself on scroll-into-view,
 *   paint (the finished colors) floods over it via clip-path.
 * Without JS or under reduced motion, the painted motif is simply there.
 */

const d = (s: string): CSSProperties => ({ "--d": s } as CSSProperties);

const deg = (a: number) => (a * Math.PI) / 180;
const rx = (cx: number, r: number, a: number) => +(cx + r * Math.cos(deg(a))).toFixed(1);
const ry = (cy: number, r: number, a: number) => +(cy + r * Math.sin(deg(a))).toFixed(1);

/* ==========================================================================
   연화문 — lotus medallion. One petal, rotated 45° eight times.
   ========================================================================== */

const LOTUS_PETAL =
  "M110 88 C 95 86, 87 74, 91 61 C 94 51, 102 44, 110 37 C 118 44, 126 51, 129 61 C 133 74, 125 86, 110 88 Z";
const LOTUS_PETAL_IN =
  "M110 83 C 100 81, 94 73, 97 63 C 99 55, 104 50, 110 45 C 116 50, 121 55, 123 63 C 126 73, 120 81, 110 83 Z";
const LOTUS_PETAL_LIGHT =
  "M110 78 C 103 76, 100 71, 102 65 C 103 60, 106 56, 110 52 C 114 56, 117 60, 118 65 C 120 71, 117 76, 110 78 Z";
const LOTUS_LEAF =
  "M110 40 C 105 46, 103 53, 105 59 L 110 55.5 L 115 59 C 117 53, 115 46, 110 40 Z";
const LOTUS_SCALLOP =
  "M110 20 C 104 18, 100 13, 103 9 C 105 6.2, 107.5 6, 110 6 C 112.5 6, 115 6.2, 117 9 C 120 13, 116 18, 110 20 Z";

const LOTUS_SEEDS = Array.from({ length: 6 }, (_, i) => ({
  x: rx(110, 8, i * 60 - 90),
  y: ry(110, 8, i * 60 - 90),
}));

/** 초 — compass circles + radial guides, the construction skeleton. */
const LOTUS_SPOKES = Array.from({ length: 8 }, (_, i) => {
  const a = i * 45 - 90;
  return `M${rx(110, 22, a)} ${ry(110, 22, a)} L${rx(110, 102, a)} ${ry(110, 102, a)}`;
});

function LotusInk() {
  return (
    <svg className="giwa-motif__svg" viewBox="0 0 220 220" aria-hidden="true">
      {[102, 88, 73, 20].map((r, i) => (
        <circle
          key={r}
          className="giwa-ink-draw giwa-ink-draw--thin"
          style={d(`${(i * 0.12).toFixed(2)}s`)}
          cx={110}
          cy={110}
          r={r}
          pathLength={1}
        />
      ))}
      {LOTUS_SPOKES.map((spoke, i) => (
        <path
          key={spoke}
          className="giwa-ink-draw giwa-ink-draw--thin"
          style={d(`${(0.5 + i * 0.04).toFixed(2)}s`)}
          d={spoke}
          pathLength={1}
        />
      ))}
    </svg>
  );
}

function LotusPaint() {
  return (
    <svg className="giwa-motif__svg" viewBox="0 0 220 220" aria-hidden="true">
      <defs>
        <g id="giwa-lotus-p">
          <path className="giwa-f-seok giwa-s-ink2 giwa-round" d={LOTUS_PETAL} />
          <path className="giwa-f-hwang" d={LOTUS_PETAL_IN} />
          <path className="giwa-s-baek" fill="none" d={LOTUS_PETAL_LIGHT} />
        </g>
        <path id="giwa-lotus-s" className="giwa-s-ink giwa-round" d={LOTUS_SCALLOP} />
        <path
          id="giwa-lotus-l"
          className="giwa-f-noe giwa-s-ink giwa-round"
          d={LOTUS_LEAF}
        />
      </defs>

      {/* outer scallop ring — 16 alternating petals, 청 and 적 */}
      {Array.from({ length: 16 }, (_, i) => (
        <use
          key={i}
          href="#giwa-lotus-s"
          className={i % 2 === 0 ? "giwa-f-sam" : "giwa-f-seok"}
          transform={`rotate(${i * 22.5} 110 110)`}
        />
      ))}

      {/* the band — samcheong ring with white breath dots */}
      <circle className="giwa-s-band" cx={110} cy={110} r={88} fill="none" />
      <circle className="giwa-s-ink" cx={110} cy={110} r={93} fill="none" />
      <circle className="giwa-s-ink" cx={110} cy={110} r={83} fill="none" />
      <circle className="giwa-s-baekdot" cx={110} cy={110} r={88} fill="none" />

      {/* 녹화 — green shoots between the petals */}
      {Array.from({ length: 8 }, (_, i) => (
        <use
          key={i}
          href="#giwa-lotus-l"
          transform={`rotate(${i * 45 + 22.5} 110 110)`}
        />
      ))}

      {/* eight petals from one path */}
      {Array.from({ length: 8 }, (_, i) => (
        <use key={i} href="#giwa-lotus-p" transform={`rotate(${i * 45} 110 110)`} />
      ))}

      {/* 씨방 — the seed pod */}
      <circle className="giwa-f-baek giwa-s-ink" cx={110} cy={110} r={20} />
      <circle className="giwa-f-hwang giwa-s-ink2" cx={110} cy={110} r={15} />
      <circle className="giwa-f-seok" cx={110} cy={110} r={2.6} />
      {LOTUS_SEEDS.map((p) => (
        <circle key={`${p.x}-${p.y}`} className="giwa-f-seok" cx={p.x} cy={p.y} r={2.6} />
      ))}
    </svg>
  );
}

/* ==========================================================================
   머리초 — beam-end pattern. Built once on the left, mirrored to the right.
   ========================================================================== */

const hwi = (x: number) =>
  `M${x} 25 C ${x + 15} 45, ${x + 24} 64, ${x + 24} 85 C ${x + 24} 106, ${x + 15} 125, ${x} 145`;

const MRC_PETAL =
  "M58 76 C 68 71, 77 75, 82 85 C 77 95, 68 99, 58 94 C 61 88, 61 82, 58 76 Z";
const MRC_PETAL_LIGHT =
  "M63 80 C 69 77, 74 79, 78 85 C 74 91, 69 93, 63 90";
const MRC_ANGLES = [-56, -28, 0, 28, 56];

function MorichoInk() {
  return (
    <svg className="giwa-motif__svg" viewBox="0 0 340 170" aria-hidden="true">
      <defs>
        <g id="giwa-mrc-ink">
          <path
            className="giwa-ink-draw giwa-ink-draw--thin"
            style={d("0.2s")}
            d="M10 37 A 48 48 0 0 1 10 133"
            pathLength={1}
          />
          <path
            className="giwa-ink-draw giwa-ink-draw--thin"
            style={d("0.35s")}
            d="M10 57 A 28 28 0 0 1 10 113"
            pathLength={1}
          />
          <path
            className="giwa-ink-draw giwa-ink-draw--thin"
            style={d("0.5s")}
            d={hwi(94)}
            pathLength={1}
          />
          <path
            className="giwa-ink-draw giwa-ink-draw--thin"
            style={d("0.62s")}
            d={hwi(128)}
            pathLength={1}
          />
        </g>
      </defs>
      <rect
        className="giwa-ink-draw"
        style={d("0s")}
        x={2}
        y={25}
        width={336}
        height={120}
        pathLength={1}
      />
      <use href="#giwa-mrc-ink" />
      <use href="#giwa-mrc-ink" transform="translate(340 0) scale(-1 1)" />
    </svg>
  );
}

function MorichoPaint() {
  return (
    <svg className="giwa-motif__svg" viewBox="0 0 340 170" aria-hidden="true">
      <defs>
        <g id="giwa-mrc-p">
          <path className="giwa-f-seok giwa-s-ink giwa-round" d={MRC_PETAL} />
          <path className="giwa-s-baek" fill="none" d={MRC_PETAL_LIGHT} />
        </g>
        <g id="giwa-mrc">
          {/* petal fan on the rim — one petal, five rotations */}
          {MRC_ANGLES.map((a) => (
            <use key={a} href="#giwa-mrc-p" transform={`rotate(${a} 10 85)`} />
          ))}
          {/* the half-lotus head, from rim to heart */}
          <path className="giwa-f-baek giwa-s-ink2" d="M10 37 A 48 48 0 0 1 10 133 Z" />
          <path className="giwa-f-sam" d="M10 47 A 38 38 0 0 1 10 123 Z" />
          <path className="giwa-s-baek" fill="none" d="M10 52 A 33 33 0 0 1 10 118" />
          <path className="giwa-f-seok" d="M10 57 A 28 28 0 0 1 10 113 Z" />
          <path className="giwa-f-hwang giwa-s-ink2" d="M10 70 A 15 15 0 0 1 10 100 Z" />
          {/* 휘 — the bands flowing inward */}
          <path className="giwa-s-hwi-ink" fill="none" d={hwi(87)} />
          <path className="giwa-s-hwi-sam" fill="none" d={hwi(94)} />
          <path className="giwa-s-hwi-baek" fill="none" d={hwi(104.5)} />
          <path className="giwa-s-hwi-seok" fill="none" d={hwi(111)} />
          <path className="giwa-s-hwi-baek" fill="none" d={hwi(121.5)} />
          <path className="giwa-s-hwi-noe" fill="none" d={hwi(128)} />
          <path className="giwa-s-hwi-ink" fill="none" d={hwi(138)} />
        </g>
      </defs>

      {/* the beam itself, resting on its noerok ground coat */}
      <rect className="giwa-f-noe giwa-s-ink2" x={2} y={25} width={336} height={120} />
      <use href="#giwa-mrc" />
      <use href="#giwa-mrc" transform="translate(340 0) scale(-1 1)" />

      {/* 계풍 — the quiet center field, held by a single dot */}
      <circle className="giwa-f-hwang giwa-s-ink" cx={170} cy={85} r={4.5} />
      <circle className="giwa-s-baek" cx={170} cy={85} r={8.5} fill="none" />
    </svg>
  );
}

/* ==========================================================================
   방울문 — bell and tassel: the things that hang from an eave.
   ========================================================================== */

const BELL_STRANDS = [75, 80, 85, 90, 95, 100, 105].map((x, i) => ({
  x,
  d: `M${x} 150 C ${x - 4} 170, ${x + 4} 190, ${x + (i % 2 === 0 ? -3 : 3)} 212`,
}));

function BellInk() {
  return (
    <svg className="giwa-motif__svg" viewBox="0 0 180 220" aria-hidden="true">
      <path
        className="giwa-ink-draw giwa-ink-draw--thin"
        style={d("0s")}
        d="M90 26 L106 42 L90 58 L74 42 Z M90 44 L104 58 L90 72 L76 58 Z"
        pathLength={1}
      />
      <circle
        className="giwa-ink-draw giwa-ink-draw--thin"
        style={d("0.25s")}
        cx={90}
        cy={104}
        r={26}
        pathLength={1}
      />
      <path
        className="giwa-ink-draw giwa-ink-draw--thin"
        style={d("0.4s")}
        d="M76 132 L104 132 L108 148 L72 148 Z"
        pathLength={1}
      />
      {[0, 3, 6].map((i) => (
        <path
          key={BELL_STRANDS[i].x}
          className="giwa-ink-draw giwa-ink-draw--thin"
          style={d(`${(0.55 + i * 0.03).toFixed(2)}s`)}
          d={BELL_STRANDS[i].d}
          pathLength={1}
        />
      ))}
    </svg>
  );
}

function BellPaint() {
  return (
    <svg className="giwa-motif__svg" viewBox="0 0 180 220" aria-hidden="true">
      {/* cord and knots — 매듭 */}
      <path className="giwa-s-ink2" d="M90 4 L90 28" fill="none" />
      <path
        className="giwa-s-knot-seok giwa-round"
        d="M90 26 L106 42 L90 58 L74 42 Z"
        fill="none"
      />
      <path
        className="giwa-s-knot-sam giwa-round"
        d="M90 44 L104 58 L90 72 L76 58 Z"
        fill="none"
      />

      {/* the bell — 방울 */}
      <circle className="giwa-f-hwang giwa-s-ink2" cx={90} cy={104} r={26} />
      <rect
        className="giwa-f-seok giwa-s-ink"
        x={62}
        y={97}
        width={56}
        height={12}
        rx={3}
      />
      {[78, 90, 102].map((x) => (
        <circle key={x} className="giwa-f-baek" cx={x} cy={103} r={2} />
      ))}
      <path className="giwa-s-ink3" d="M90 116 L90 128" fill="none" />

      {/* 술띠 and the tassel strands */}
      <path
        className="giwa-f-sam giwa-s-ink"
        d="M76 132 L104 132 L108 148 L72 148 Z"
      />
      <path className="giwa-s-baek" d="M75 140 L105 140" fill="none" />
      {BELL_STRANDS.map((s) => (
        <path
          key={s.x}
          className={s.x === 90 ? "giwa-s-strand-sam" : "giwa-s-strand-seok"}
          d={s.d}
          fill="none"
        />
      ))}
    </svg>
  );
}

/* ==========================================================================
   금문 — the fret lattice. One cell, translated six times.
   ========================================================================== */

const GM_SPIRAL = "M6 90 L6 34 L42 34 L42 78 L22 78 L22 54 L34 54";
const GM_XS = Array.from({ length: 6 }, (_, i) => 16 + i * 52);

function GeummunInk() {
  return (
    <svg className="giwa-motif__svg" viewBox="0 0 340 120" aria-hidden="true">
      <defs>
        <path
          id="giwa-gm-i"
          className="giwa-ink-draw giwa-ink-draw--thin"
          style={d("0.25s")}
          d={GM_SPIRAL}
          pathLength={1}
        />
      </defs>
      <rect
        className="giwa-ink-draw"
        style={d("0s")}
        x={2}
        y={14}
        width={336}
        height={92}
        pathLength={1}
      />
      {GM_XS.map((x) => (
        <use key={x} href="#giwa-gm-i" x={x} fill="none" />
      ))}
    </svg>
  );
}

function GeummunPaint() {
  return (
    <svg className="giwa-motif__svg" viewBox="0 0 340 120" aria-hidden="true">
      <defs>
        <g id="giwa-gm">
          <path className="giwa-s-gm-ink" fill="none" d={GM_SPIRAL} />
          <path className="giwa-s-gm-baek" fill="none" d={GM_SPIRAL} />
          <path className="giwa-s-gm-sam" fill="none" d={GM_SPIRAL} />
          <circle className="giwa-f-hwang giwa-s-ink" cx={32} cy={66} r={3.5} />
        </g>
      </defs>
      <rect className="giwa-f-seok giwa-s-ink2" x={2} y={14} width={336} height={92} />
      <path className="giwa-s-baek" d="M10 22 L330 22" fill="none" />
      <path className="giwa-s-baek" d="M10 98 L330 98" fill="none" />
      {GM_XS.map((x) => (
        <use key={x} href="#giwa-gm" x={x} />
      ))}
    </svg>
  );
}

/* ==========================================================================
   The gallery
   ========================================================================== */

type Motif = {
  id: string;
  shape: "bloom" | "sweep" | "drop";
  aspect: string;
  label: string;
  ink: ComponentType;
  paint: ComponentType;
  nameKo: string;
  hanja: string | null;
  nameEn: string;
  bodyKo: string;
  bodyEn: string;
  how: string;
};

const MOTIFS: Motif[] = [
  {
    id: "lotus",
    shape: "bloom",
    aspect: "giwa-motif--square",
    label:
      "연화문 — 여덟 잎 연꽃 원형 문양. 황 씨방을 중심으로 잎과 녹화가 돌아가며 오방색으로 칠해져 있다. Lotus medallion: eight petals around a yellow seed-pod, painted in the five colors.",
    ink: LotusInk,
    paint: LotusPaint,
    nameKo: "연화문",
    hanja: "蓮花紋",
    nameEn: "lotus medallion",
    bodyKo:
      "부재의 중심마다 연꽃이 놓인다. 진흙에서 피어도 물들지 않는 꽃 — 씨방에서 여덟 잎이 나고, 잎 사이로 녹화가 돋고, 청의 띠가 전체를 감는다.",
    bodyEn:
      "A lotus sits at the heart of every member: eight petals from the seed-pod, green shoots between them, a blue band binding the whole.",
    how: "construction — one petal × rotate(45°) × 8",
  },
  {
    id: "moricho",
    shape: "sweep",
    aspect: "giwa-motif--beam",
    label:
      "머리초 — 들보 양 끝을 여는 반연화와 색 띠 문양. 가운데 몸은 뇌록 바탕으로 쉰다. Moricho: half-lotus heads and color bands at both ends of a beam resting on its green ground coat.",
    ink: MorichoInk,
    paint: MorichoPaint,
    nameKo: "머리초",
    hanja: null,
    nameEn: "beam-end pattern",
    bodyKo:
      "보와 도리는 끝에서부터 칠한다. 반쪽 연화가 부재의 끝을 열고, 휘가 안쪽으로 흘러들고, 남은 길이는 뇌록으로 쉰다. 문양은 끝에, 침묵은 가운데에.",
    bodyEn:
      "Beams are painted from their ends: a half-lotus opens the timber, bands flow inward, and the remaining length rests in noerok green.",
    how: "construction — one end, mirrored: scale(−1, 1)",
  },
  {
    id: "bangul",
    shape: "drop",
    aspect: "giwa-motif--hang",
    label:
      "방울문 — 매듭과 방울과 술로 이루어진 드리개 문양. Bell-and-tassel pendant: knot, bell, and seven strands.",
    ink: BellInk,
    paint: BellPaint,
    nameKo: "방울문",
    hanja: null,
    nameEn: "bell & tassel",
    bodyKo:
      "매듭과 방울과 술 — 처마에 매달린 것들은 바람의 기록계다. 방울문은 그 흔들림을 멈춘 채로 붙잡아, 바람이 없는 날에도 바람을 기억하게 한다.",
    bodyEn:
      "Knot, bell, tassel — the things that hang from an eave are instruments for recording wind. The motif holds their swing perfectly still.",
    how: "construction — symmetric about the cord, x = 90",
  },
  {
    id: "geummun",
    shape: "sweep",
    aspect: "giwa-motif--band",
    label:
      "금문 — 회문 격자가 반복되는 기하 띠 문양. 석간주 바탕에 삼청 띠와 호분 가장자리. Geummun: a repeating fret lattice, blue ribbon with white edges on a red-brown ground.",
    ink: GeummunInk,
    paint: GeummunPaint,
    nameKo: "금문",
    hanja: "錦紋",
    nameEn: "brocade fret",
    bodyKo:
      "비단 무늬라는 이름 그대로, 남는 자리 없이 서로를 문다. 자와 컴퍼스만으로 짜는 기하 — 한 칸이 정해지면 나머지는 끝없이 이어질 뿐이다.",
    bodyEn:
      "Named after brocade: geometry that interlocks without remainder. Fix one cell and the rest simply continues, forever if the timber allowed.",
    how: "construction — one cell × translate(52px) × 6",
  },
];

export default function PatternGallery() {
  return (
    <section className="giwa-gallery" aria-labelledby="giwa-gallery-title">
      <div className="giwa-sechead" data-reveal>
        <span className="giwa-sechead__no" lang="en" aria-hidden="true">
          03
        </span>
        <h2 className="giwa-sechead__title" id="giwa-gallery-title">
          문양{" "}
          <span className="giwa-sechead__en" lang="en">
            the grammar under the eave
          </span>
        </h2>
      </div>

      <p className="giwa-gallery__intro" data-reveal>
        네 가지 문양이 처마 밑 대부분의 자리를 만든다. 모두 한 단위에서
        시작한다 — 잎 하나, 끝 하나, 칸 하나. 나머지는 돌리고, 비추고,
        미는 일이다.
      </p>
      <p className="giwa-gallery__intro-en" lang="en" data-reveal>
        Four motifs furnish most of the space under an eave. Each begins as
        one unit — a petal, an end, a cell. The rest is rotation, mirror,
        and translation.
      </p>

      <div className="giwa-gallery__grid">
        {MOTIFS.map((m) => {
          const Ink = m.ink;
          const Paint = m.paint;
          return (
            <figure key={m.id} className="giwa-motif-card" data-reveal>
              <div
                className={`giwa-motif ${m.aspect}`}
                role="img"
                aria-label={m.label}
              >
                <Ink />
                <div className={`giwa-motif__paint giwa-motif__paint--${m.shape}`}>
                  <Paint />
                </div>
              </div>
              <figcaption className="giwa-motif-card__caption">
                <h3 className="giwa-motif-card__name">
                  {m.nameKo}
                  {m.hanja ? (
                    <span className="giwa-motif-card__hanja"> {m.hanja}</span>
                  ) : null}{" "}
                  <span className="giwa-motif-card__en" lang="en">
                    {m.nameEn}
                  </span>
                </h3>
                <p className="giwa-motif-card__body">{m.bodyKo}</p>
                <p className="giwa-motif-card__body-en" lang="en">
                  {m.bodyEn}
                </p>
                <p className="giwa-motif-card__how" lang="en">
                  {m.how}
                </p>
              </figcaption>
            </figure>
          );
        })}
      </div>
    </section>
  );
}
