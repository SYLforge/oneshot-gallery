/**
 * BLOCK — 시 데이터. 여덟 편의 짧은 시가 이 출판의 전부다.
 * 각 시는 콘크리트라는 단일 재료를 한 가지 방식으로 다룬다: 구조, 태도,
 * 재료, 방법론. 네 가지 카테고리는 FLIP 그리드의 필터가 된다.
 *
 * 한국어 2-3행이 원문이고 영문은 그 복각. motif는 시를 상징하는 기하학적
 * 형태 — 모두 CSS로 그린다 (이미지 없음).
 */

export type Category = "structure" | "attitude" | "material" | "method";

export type Motif = "square" | "triangle" | "circle" | "stack" | "line" | "grid";

export type Poem = {
  id: string;
  no: string;
  titleKo: string;
  titleEn: string;
  /** 원문 — 한국어 2-3행 */
  ko: string[];
  /** 영문 복각 */
  en: string[];
  category: Category;
  /** 시를 상징하는 기하 형태 */
  motif: Motif;
  /** 한 줄 태그 (필터 카드 위) */
  tagKo: string;
  tagEn: string;
  year: string;
};

export const POEMS: Poem[] = [
  {
    id: "poem-01",
    no: "01",
    titleKo: "시는 콘크리트다",
    titleEn: "Poetry Is Concrete",
    ko: ["단어가 벽이 되고,", "벽이 시가 된다."],
    en: ["Words become walls,", "and walls become poems."],
    category: "structure",
    motif: "square",
    tagKo: "구조",
    tagEn: "Structure",
    year: "2026",
  },
  {
    id: "poem-02",
    no: "02",
    titleKo: "무너뜨리지 마라",
    titleEn: "Do Not Demolish",
    ko: ["벽 속에 목소리가 있다.", "부수지 마라 — 들어라."],
    en: ["A voice lives inside the wall.", "Do not break it — listen."],
    category: "attitude",
    motif: "stack",
    tagKo: "태도",
    tagEn: "Attitude",
    year: "2026",
  },
  {
    id: "poem-03",
    no: "03",
    titleKo: "그라데이션 없음",
    titleEn: "No Gradient",
    ko: ["이 출판은 타협하지 않는다.", "검정 아니면 흰.", "그 사이의 회색은 없다."],
    en: ["This press does not compromise.", "Black or white.", "No grey between."],
    category: "attitude",
    motif: "square",
    tagKo: "태도",
    tagEn: "Attitude",
    year: "2026",
  },
  {
    id: "poem-04",
    no: "04",
    titleKo: "3픽셀의 법칙",
    titleEn: "The 3-Pixel Law",
    ko: ["모든 선은 3픽셀이다.", "그것이 질감이다."],
    en: ["Every line is three pixels.", "That is the texture."],
    category: "method",
    motif: "line",
    tagKo: "방법론",
    tagEn: "Method",
    year: "2026",
  },
  {
    id: "poem-05",
    no: "05",
    titleKo: "검은 잉크",
    titleEn: "Black Ink",
    ko: ["잉크는 검다.", "회색 영역은", "잉크가 아니라 게으름이다."],
    en: ["The ink is black.", "The grey area is not ink —", "it is laziness."],
    category: "material",
    motif: "stack",
    tagKo: "재료",
    tagEn: "Material",
    year: "2026",
  },
  {
    id: "poem-06",
    no: "06",
    titleKo: "도형의 문법",
    titleEn: "Grammar of Shape",
    ko: ["네모, 세모, 동그라미 —", "이것이 문장이다."],
    en: ["Square, triangle, circle —", "these are the sentence."],
    category: "structure",
    motif: "grid",
    tagKo: "구조",
    tagEn: "Structure",
    year: "2026",
  },
  {
    id: "poem-07",
    no: "07",
    titleKo: "경사면은 거짓말",
    titleEn: "Bevel Is a Lie",
    ko: ["둥근 모서리는", "부드러워 보이려는 꼼수다.", "직각이 정직이다."],
    en: ["A rounded corner is a trick", "to look soft.", "The right angle is honest."],
    category: "method",
    motif: "triangle",
    tagKo: "방법론",
    tagEn: "Method",
    year: "2026",
  },
  {
    id: "poem-08",
    no: "08",
    titleKo: "무게를 지켜라",
    titleEn: "Hold the Weight",
    ko: ["활자는 무겁다.", "무거움이 곧 존재다.", "가볍게 하지 마라."],
    en: ["Type is heavy.", "The weight is the existence.", "Do not lighten it."],
    category: "material",
    motif: "circle",
    tagKo: "재료",
    tagEn: "Material",
    year: "2026",
  },
];

export const FILTERS: {
  id: Category | "all";
  ko: string;
  en: string;
}[] = [
  { id: "all", ko: "전체", en: "All" },
  { id: "structure", ko: "구조", en: "Structure" },
  { id: "attitude", ko: "태도", en: "Attitude" },
  { id: "material", ko: "재료", en: "Material" },
  { id: "method", ko: "방법론", en: "Method" },
];

/** 번역 라벨 — 필터/섹션 헤더에서 한글 ↔ 영어 전환에 쓰인다. */
export const LABELS = {
  sectionWorksKo: "작품",
  sectionWorksEn: "WORKS",
  filterLabel: "시를 카테고리로 거르기 · Filter poems by category",
  caption: "모든 형태는 코드로 그렸다 — 이미지는 한 장도 없다.",
  captionEn: "Every shape is drawn in code — zero image payload.",
};
