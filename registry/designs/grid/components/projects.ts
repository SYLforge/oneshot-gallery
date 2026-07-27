"use client";

export type Typology = "residential" | "cultural" | "urban";

export type Project = {
  /** plate id, e.g. "A-01" — appears in the title block */
  id: string;
  /** the typology filter key */
  typology: Typology;
  /** span across the 12-col board when shown at full size */
  span: 4 | 6 | 8;
  /** height tier — controls the plate's vertical proportion */
  tier: "tall" | "mid" | "low";
  name: { en: string; ko: string };
  place: { en: string; ko: string };
  year: string;
  /** GFA / area, with unit */
  area: string;
  /** status — drives the corner mark */
  status: "built" | "competition" | "study";
  statusLabel: { en: string; ko: string };
  /** a short, literary line about the project */
  line: { en: string; ko: string };
};

/**
 * The atelier's plate index. Eight projects across three typologies,
 * spaced so the FLIP repack visibly rearranges the board as the filter
 * changes. Names are fictional; places are real cities chosen for their
 * typographic weight, never as an endorsement of any real practice.
 *
 * Counts per typology: residential 3, cultural 3, urban 2 → "all" shows 8.
 */
export const PROJECTS: Project[] = [
  {
    id: "A-01",
    typology: "residential",
    span: 6,
    tier: "tall",
    name: { en: "House of Nine Rooms", ko: "아홉 칸의 집" },
    place: { en: "Seoul, Seongbuk-dong", ko: "서울 성북동" },
    year: "2024",
    area: "412 m²",
    status: "built",
    statusLabel: { en: "completed", ko: "준공" },
    line: {
      en: "A house laid out as a single sentence with nine commas.",
      ko: "아홉 개의 쉼표로 이어진 한 문장의 집.",
    },
  },
  {
    id: "A-02",
    typology: "cultural",
    span: 6,
    tier: "tall",
    name: { en: "Hall of Quiet Weight", ko: "고요한 무게의 전시관" },
    place: { en: "Gwangju, Biennale Square", ko: "광주 비엔날레 광장" },
    year: "2023",
    area: "2 840 m²",
    status: "built",
    statusLabel: { en: "completed", ko: "준공" },
    line: {
      en: "Concrete taught to hold its breath above a public square.",
      ko: "광장 위에서 숨을 삼킨 콘크리트.",
    },
  },
  {
    id: "A-03",
    typology: "urban",
    span: 8,
    tier: "mid",
    name: { en: "Bridge of Slow Crossings", ko: "느린 건넘의 다리" },
    place: { en: "Busan, Yeongdo", ko: "부산 영도" },
    year: "2025",
    area: "0.9 km",
    status: "competition",
    statusLabel: { en: "competition", ko: "공모" },
    line: {
      en: "A crossing that takes ninety seconds to refuse the view.",
      ko: "경치를 거부하려 아흔 초를 걷게 만든 건넘.",
    },
  },
  {
    id: "A-04",
    typology: "residential",
    span: 4,
    tier: "mid",
    name: { en: "Apartment for One Painter", ko: "화가 한 사람을 위한 집" },
    place: { en: "Jeju, Seongeup", ko: "제주 성읍" },
    year: "2022",
    area: "96 m²",
    status: "built",
    statusLabel: { en: "completed", ko: "준공" },
    line: {
      en: "North light, south silence, and a door that closes twice.",
      ko: "북쪽 빛, 남쪽 침묵, 두 번 닫히는 문.",
    },
  },
  {
    id: "A-05",
    typology: "cultural",
    span: 4,
    tier: "mid",
    name: { en: "Library of Borrowed Light", ko: "빌려온 빛의 도서관" },
    place: { en: "Jeonju, Hanok Village", ko: "전주 한옥마을" },
    year: "2024",
    area: "1 160 m²",
    status: "built",
    statusLabel: { en: "completed", ko: "준공" },
    line: {
      en: "Shelves that lean toward the courtyard and away from the sun.",
      ko: "마당 쪽으로, 햇빛에서 멀어지도록 기운 선반.",
    },
  },
  {
    id: "A-06",
    typology: "urban",
    span: 8,
    tier: "low",
    name: { en: "Plan for a Tidier River", ko: "더 정돈된 강을 위한 계획" },
    place: { en: "Incheon, Cheongna", ko: "인천 청라" },
    year: "2026",
    area: "48 ha",
    status: "study",
    statusLabel: { en: "study", ko: "연구" },
    line: {
      en: "A masterplan that gives the water back its own handwriting.",
      ko: "물에 제 손글씨를 돌려주는 마스터플랜.",
    },
  },
  {
    id: "A-07",
    typology: "residential",
    span: 6,
    tier: "low",
    name: { en: "Three Houses, One Wall", ko: "세 집, 하나의 담" },
    place: { en: "Andong, Wolyeong", ko: "안동 월영" },
    year: "2023",
    area: "524 m²",
    status: "built",
    statusLabel: { en: "completed", ko: "준공" },
    line: {
      en: "One wall decides the order of three separate lives.",
      ko: "담 하나가 세 삶의 순서를 정한다.",
    },
  },
  {
    id: "A-08",
    typology: "cultural",
    span: 6,
    tier: "low",
    name: { en: "Pavilion of the Ninth Hour", ko: "아홉째 시각의 정자" },
    place: { en: "Gyeongju, Bomun", ko: "경주 보문" },
    year: "2025",
    area: "210 m²",
    status: "competition",
    statusLabel: { en: "competition", ko: "공모" },
    line: {
      en: "A pavilion that finishes its shadow by the ninth hour.",
      ko: "아홉째 시각이면 그림자를 끝내는 정자.",
    },
  },
];

export const TYPOLOGIES: {
  key: Typology | "all";
  label: { en: string; ko: string };
  count: string;
}[] = [
  { key: "all", label: { en: "all works", ko: "전체" }, count: "08" },
  {
    key: "residential",
    label: { en: "residential", ko: "주거" },
    count: "03",
  },
  { key: "cultural", label: { en: "cultural", ko: "문화" }, count: "03" },
  { key: "urban", label: { en: "urban", ko: "도시" }, count: "02" },
];
