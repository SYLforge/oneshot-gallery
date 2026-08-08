/**
 * FLOW — the lexicon and the verses.
 *
 * A journaling app whose whole identity is that *letters flow like water*.
 * This module is the source of truth for every word that drifts across the
 * canvas river, every verse that holds while you scroll, and every law of
 * liquid the feature section names. Pure data — no DOM, no React — so it is
 * imported by both the canvas simulation (WordRiver) and the prose sections
 * (FlowingVerse, FlowLaws) without dragging rendering concerns around.
 *
 * Korean is the first voice. The English that follows each line is a second
 * reading of the same image, never a literal subtitle — the gallery rule is
 * that the two languages carry the same weight, not that one glosses the
 * other.
 */

/* ==========================================================================
   The drifting lexicon
   --------------------------------------------------------------------------
   The canvas river pulls words from this list. Each word carries the depth
   band it prefers, so the composition reads in three planes: far (small,
   faint, slow), mid (the readable drift), near (large, crisp, fast). The
   `weight` lets some words read heavier than others — 잉크/ink settles, 비/rain
   is light. The bands are a preference, not a constraint: the simulator in
   WordRiver rebalances counts per band so the river is always full.
   ========================================================================== */

export type Depth = 0 | 1 | 2;
/** 0 = far (small / faint / slow), 1 = mid (readable drift), 2 = near (large / crisp / fast). */

export type RiverWord = {
  /** The drifting glyph — Korean or a single English word. */
  text: string;
  /** Language tag, so the canvas can pick the right typeface per word. */
  lang: "ko" | "en";
  /** Preferred depth band — where this word reads best. */
  depth: Depth;
  /** Font weight 300–700. Heavier words "settle" like thick ink. */
  weight: 300 | 400 | 500 | 700;
};

/**
 * The base lexicon — 새벽, 비, 창문, 종이, 잉크, 강, 바다 plus the seasons,
 * the hours, and the sensations a journal actually holds. Twenty-seven
 * words: enough that the river never visibly repeats within one screen,
 * few enough that every word is chosen, not filler.
 */
export const RIVER_WORDS: RiverWord[] = [
  // — the original seven, the spine of the journal —
  { text: "새벽", lang: "ko", depth: 1, weight: 500 },
  { text: "비", lang: "ko", depth: 0, weight: 300 },
  { text: "창문", lang: "ko", depth: 1, weight: 400 },
  { text: "종이", lang: "ko", depth: 2, weight: 400 },
  { text: "잉크", lang: "ko", depth: 2, weight: 700 },
  { text: "강", lang: "ko", depth: 1, weight: 500 },
  { text: "바다", lang: "ko", depth: 0, weight: 500 },
  // — the seasons a year of entries moves through —
  { text: "봄", lang: "ko", depth: 1, weight: 500 },
  { text: "여름", lang: "ko", depth: 2, weight: 400 },
  { text: "가을", lang: "ko", depth: 1, weight: 400 },
  { text: "겨울", lang: "ko", depth: 0, weight: 300 },
  // — the hours —
  { text: "아침", lang: "ko", depth: 1, weight: 500 },
  { text: "달", lang: "ko", depth: 0, weight: 300 },
  { text: "밤", lang: "ko", depth: 1, weight: 400 },
  { text: "노을", lang: "ko", depth: 2, weight: 400 },
  { text: "dawn", lang: "en", depth: 1, weight: 400 },
  { text: "dusk", lang: "en", depth: 0, weight: 300 },
  // — the sensations —
  { text: "물", lang: "ko", depth: 2, weight: 500 },
  { text: "파도", lang: "ko", depth: 1, weight: 500 },
  { text: "이슬", lang: "ko", depth: 0, weight: 300 },
  { text: "안개", lang: "ko", depth: 0, weight: 300 },
  { text: "바람", lang: "ko", depth: 1, weight: 400 },
  { text: "숨", lang: "ko", depth: 2, weight: 400 },
  // — the writing itself —
  { text: "기억", lang: "ko", depth: 1, weight: 500 },
  { text: "시간", lang: "ko", depth: 0, weight: 400 },
  { text: "글자", lang: "ko", depth: 2, weight: 700 },
  { text: "말", lang: "ko", depth: 1, weight: 400 },
  { text: "river", lang: "en", depth: 1, weight: 500 },
  { text: "tide", lang: "en", depth: 0, weight: 300 },
  { text: "ink", lang: "en", depth: 2, weight: 700 },
];

/* ==========================================================================
   The flowing verses
   --------------------------------------------------------------------------
   Four short verses the pinned section holds while you scroll. Each is three
   or four lines; each line is one image the river carries. They are staged
   0→3 so the scroll progress dissolves one in as the last dissolves out —
   the verses flow past the way words flow past in the canvas above.
   ========================================================================== */

export type VerseLine = {
  /** Korean — the first voice. */
  ko: string;
  /** English — a second reading of the same image, not a gloss. */
  en: string;
};

export type Verse = {
  /** 0-based stage index, drives the scroll-driven dissolve. */
  stage: number;
  /** A short Korean title for the verse. */
  ko: string;
  /** A short English title for the verse. */
  en: string;
  /** The three or four lines. */
  lines: VerseLine[];
};

export const VERSES: Verse[] = [
  {
    stage: 0,
    ko: "새벽",
    en: "dawn",
    lines: [
      { ko: "새벽이 창문으로 흐른다", en: "Dawn seeps in through the window" },
      { ko: "종이 위에 이슬 맺히고", en: "Dew beads on the open page" },
      { ko: "첫 글자가 강이 되어", en: "The first letter becomes a river" },
      { ko: "바다를 향해 간다", en: "And moves toward the sea" },
    ],
  },
  {
    stage: 1,
    ko: "글자",
    en: "letters",
    lines: [
      { ko: "하루의 무게를 단어에 실으면", en: "Load the weight of a day onto a word" },
      { ko: "잉크가 스며들고", en: "The ink soaks in" },
      { ko: "줄이 바뀌고", en: "The line breaks" },
      { ko: "문장이 물처럼 흘러", en: "And the sentence flows like water" },
    ],
  },
  {
    stage: 2,
    ko: "강",
    en: "river",
    lines: [
      { ko: "강은 멈추지 않는다", en: "A river does not stop" },
      { ko: "돌을 만나면 돌고", en: "It bends around a stone" },
      { ko: "벼랑을 만나면 떨어지고", en: "It falls at a cliff" },
      { ko: "결국 바다로", en: "And reaches the sea at last" },
    ],
  },
  {
    stage: 3,
    ko: "기억",
    en: "memory",
    lines: [
      { ko: "지난 날들은 아래로", en: "Past days drift down" },
      { ko: "적은 말들은 옆으로", en: "Written words drift sideways" },
      { ko: "모두가 같은 강물에", en: "All into the same current" },
      { ko: "모두가 바다로", en: "All into the same sea" },
    ],
  },
];

/* ==========================================================================
   The laws of flow — 흐름의 법칙
   --------------------------------------------------------------------------
   The feature section names five properties of liquid and reads each as a
   property of writing. The science is honest (these are real fluid terms)
   and the copy turns each into an image — the journal as a rheology of
   attention. Each law carries a one-line Korean aphorism for the card.
   ========================================================================== */

export type FlowLaw = {
  /** The Korean term — the card's headline. */
  ko: string;
  /** The English term. */
  en: string;
  /** Romanization, for the Latin reader. */
  rom: string;
  /** The one-line aphorism, Korean first. */
  aphorism: { ko: string; en: string };
  /** The body copy, Korean first then English. */
  body: { ko: string; en: string };
  /** A short numeric / unit detail, for the card's data row. */
  detail: string;
};

export const FLOW_LAWS: FlowLaw[] = [
  {
    ko: "유변",
    en: "Rheology",
    rom: "yu-byeon",
    aphorism: {
      ko: "글자도, 강물도, 시간도 같은 법칙을 따른다.",
      en: "Letters, rivers, and time obey the same law.",
    },
    body: {
      ko: "물질이 흐르는 방식을 다루는 학문. 단단한 것과 묽은 것의 경계는 고정되지 않고, 힘과 시간에 따라 변한다. 일기장 안의 글자도 예외가 아니다 — 적을 수록 묽어지고, 다시 읽을수록 짙어진다.",
      en: "The study of how matter flows. The line between solid and thin is not fixed; it shifts with force and with time. The words in a journal are no exception — they thin as you write them, and thicken each time you read them back.",
    },
    detail: "τ = η · γ̇",
  },
  {
    ko: "표면장력",
    en: "Surface Tension",
    rom: "pyo-myeon-jang-ryeok",
    aphorism: {
      ko: "가장자리에서, 글자가 움츠러든다.",
      en: "At the edge, the letter draws inward.",
    },
    body: {
      ko: "물방울을 둥글게 뭉치는 힘. 액체의 표면은 얇은 막처럼 행동하여 가장 바깥의 분자들을 안쪽으로 끌어당긴다. 물방울이 창에 닿아 느려지듯, 문장의 끝에서 말은 잠시 머뭇거린다.",
      en: "The force that pulls a droplet round. A liquid's surface behaves like a thin skin, drawing its outermost molecules inward. The way a droplet slows against glass, a word hesitates at the end of a sentence.",
    },
    detail: "72.8 mN/m · 20°C water",
  },
  {
    ko: "층류",
    en: "Laminar Flow",
    rom: "cheung-ryu",
    aphorism: {
      ko: "단어들이 나란히, 같은 방향으로.",
      en: "Words side by side, one way.",
    },
    body: {
      ko: "층이 져서 흐르는 잔잔한 물. 각 층은 서로를 섞지 않고 나란히 미끄러진다. 강의 아래쪽은 천천히, 위쪽은 빠르게 — 일기의 한 줄 한 줄이 같은 방향으로, 서로를 방해하지 않고 흐를 때 문장은 맑다.",
      en: "Calm water flowing in layers. Each layer slips past the others without mixing. The river's bed is slow, its surface fast — and when each line of a journal runs the same way, never crossing, the prose runs clear.",
    },
    detail: "Re < 2300",
  },
  {
    ko: "난류",
    en: "Turbulence",
    rom: "nan-ryu",
    aphorism: {
      ko: "글자가 엉키고, 다시 풀린다.",
      en: "Letters tangle, then untangle.",
    },
    body: {
      ko: "소용돌이치며 섞이는 물. 층류가 무너지면 물방울들이 서로를 끌어당기며 뒤섞인다. 쓰다가 막히는 순간, 지우고 다시 쓰는 순간 — 문장 안의 작은 소용돌이. 그래도 물은 결국 바다로 간다.",
      en: "Water that eddies and mixes. When laminar flow breaks, droplets pull at each other and braid together. The moment the writing stalls, the moment you cross out and begin again — small eddies inside a sentence. The water still reaches the sea.",
    },
    detail: "Re > 4000",
  },
  {
    ko: "점성",
    en: "Viscosity",
    rom: "jeom-seong",
    aphorism: {
      ko: "굵은 잉크일수록 천천히.",
      en: "The thicker the ink, the slower.",
    },
    body: {
      ko: "흐름에 저항하는 성질. 물보다 꿀이 느린 이유는 같은 힘에 덜 움직이기 때문이다. 굵은 펜의 글자는 천천히 쓰이고, 오래된 기억은 천천히 흐른다. 빠른 것이 더 깊은 것은 아니다.",
      en: "The resistance to flow. Honey moves slower than water because it yields less to the same push. A heavy pen writes slowly, an old memory drifts slowly. Faster is not deeper.",
    },
    detail: "1.0 mPa·s · water",
  },
];

/* ==========================================================================
   A tiny deterministic PRNG — mulberry32
   --------------------------------------------------------------------------
   The canvas river must compose the same frame on every load (so the no-JS
   still and the rAF view agree, and so hydration never disagrees with the
   first paint). mulberry32 seeded once from a constant gives us that.
   ========================================================================== */

export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
