/**
 * The Book of Hours — 여섯 챕터, 하루의 시집.
 *
 * 각 챕터는 하루의 한때(새벽에서 밤까지)를 산문으로 담는다. 한국어가
 * 첫 언어이며, 라틴 문장은 그 산문의 짝으로 — 읽는 이의 시간을 두
 * 언어 위에 가만히 올려놓는다. 여백 주석(marginalia)은 챕터마다 다른,
 * 독자가 종이 여백에 적어둔 짧은 메모다.
 *
 * This file holds the book's content only — no markup, no style. The
 * ChapterSpread section turns through these like pages; the Colophon sets
 * them down at the end.
 */
export type Chapter = {
  /** Roman numeral, set as a folio marker. */
  no: string;
  /** Poetic clock label for the hour, shown in the spread chrome. */
  hour: string;
  /** Korean chapter title — the book's first language. */
  ko_title: string;
  /** Latin chapter title — the companion, set in italic small caps. */
  en_title: string;
  /** The chapter's prose, 4–6 sentences, literary Korean. */
  ko: string;
  /** A single companion line in Latin, italic, set beneath the prose. */
  en: string;
  /** A unique margin note for this chapter — the reader's annotation. */
  marginalia: string;
};

export const CHAPTERS: Chapter[] = [
  {
    no: "I",
    hour: "05 : 00",
    ko_title: "새벽",
    en_title: "Dawn",
    ko: "첫 빛이 창으로 스며들 때, 책은 아직 잠들어 있다. 손이 등을 쓸어내리면 종이의 결이 손끝에 닿고, 그 결을 따라가다 보면 밤새 가라앉은 잉크 냄새가 올라온다. 페이지를 처음 여는 순간, 방 안의 공기가 바뀐다. 새 한 마리 울지 않는 그 시간에, 글자들은 제 자리를 가만히 지키고 있다. 이것이 하루의 시작이다 — 소리가 아니라, 종이가 깨어나는 소리.",
    en: "When the first light comes, the book is still asleep; the hand is what wakes it.",
    marginalia: "새벽의 첫 페이지는 가장 천천히 연다. 급할 곳이 어디에도 없기 때문이다.",
  },
  {
    no: "II",
    hour: "08 : 00",
    ko_title: "아침",
    en_title: "Morning",
    ko: "아침이 오면 손이 페이지를 넘긴다. 창 너머로 들어온 햇살이 줄 위에 앉고, 커피의 김이 문장 사이로 피어올라 잠깐 글자를 흐린다. 한 페이지를 읽고 나서야, 비로소 하루가 시작되었음을 안다. 곁에 둔 컵의 온기가 손등에 닿을 때마다, 읽는다는 일이 생각보다 더 많은 몸의 일임을 깨닫는다. 바깥의 소음이 아직 멀다. 여기엔 종이 넘기는 소리만이, 유일한 시계다.",
    en: "The hand turns the page. Only after does the day begin.",
    marginalia: "커피 자국이 남은 페이지가, 늘 가장 많이 읽힌다.",
  },
  {
    no: "III",
    hour: "12 : 00",
    ko_title: "정오",
    en_title: "Noon",
    ko: "정오의 햇빛은 자비롭지 않다. 글자 위에 곧장 내려앉아 그림자를 만들고, 그 그림자마저 빛 속에서 희미해진다. 저절로 소리를 죽이게 된다 — 누가 방해할까, 한 줄이라도 놓칠까 하여. 숨소리조차 가벼워지는 그 정적 속에서, 문장은 가장 또렷해진다. 빛이 가장 밝을 때, 읽는 이는 가장 깊이 들어간다.",
    en: "At noon the light is merciless — and there the sentence is most clear.",
    marginalia: "정오에는 읽는 속도가 가장 빨라지고, 기억은 가장 얕아진다.",
  },
  {
    no: "IV",
    hour: "15 : 00",
    ko_title: "오후",
    en_title: "Afternoon",
    ko: "오후가 깊어지면 눈꺼풀이 무거워진다. 한 줄을 두세 번 읽고 나서야, 그 줄이 무슨 말이었는지 뒤늦게 깨닫는다. 책갈피를 꽂아두었던 자리로 돌아가, 다시 그 페이지를 읽는다. 그때 깜빡 잠이 든 사이 꾼 꿈이, 읽던 문장과 뒤섞여 있다. 읽는다는 것은 곧잘 잊는 일이고, 잊은 것을 다시 찾아드는 일이다.",
    en: "To read is to forget, and to find the forgotten again.",
    marginalia: "졸다가 놓친 줄이, 밤에 가장 선명하게 떠오른다.",
  },
  {
    no: "V",
    hour: "18 : 00",
    ko_title: "황혼",
    en_title: "Dusk",
    ko: "빛이 물러나기 시작한다. 천천히, 한 글자씩 — 가장자리의 문장부터 어둠 속으로 들어간다. 더는 읽을 수 없게 되는 그 순간까지, 손은 페이지 위에 머물러 있다. 무엇을 읽었는지가 중요하지 않다. 다만 거기 있었다는 것, 그 시간이 종이 위에 자국으로 남았다는 것. 독서의 끝은 소리 없이 온다.",
    en: "The end of reading arrives without sound.",
    marginalia: "빛이 사라지면 읽는 이도 사라진다 — 그래야 한다.",
  },
  {
    no: "VI",
    hour: "22 : 00",
    ko_title: "밤",
    en_title: "Night",
    ko: "책을 덮는다. 손바닥이 표지를 누르고, 등이 가볍게 눌려 바람이 빠진다. 내일 아침 다시 이 페이지를 열겠다고, 조용히 약속한다. 꿈속에서 그 문장들이 다시 나타날지도 모른다 — 엉뚱한 순서로, 엉뚱한 목소리로. 불을 끄면 방 안에는 종이 냄새만이 남는다. 그것으로 하루가 끝난다.",
    en: "The hand that closes the book will open it tomorrow.",
    marginalia: "책을 덮는 손이, 내일 책을 여는 손이다.",
  },
];
