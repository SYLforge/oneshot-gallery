"use client";

type Blend = {
  time: string;
  en: string;
  ja: string;
  ko: string;
  notes: string;
  notesJa: string;
  notesKo: string;
  price: string;
};

/**
 * What the atelier actually sells: hours. Five blends, each named for the
 * time of day it is meant to hold open. Notes read like weather reports
 * from inside a room, not perfume marketing.
 *
 * Trilingual: Korean is the main reading name (the gallery is bilingual
 * ko/en with the concept's original Japanese kept as the decorative
 * source-language glyph), English the subtitle, Japanese the original.
 */
const BLENDS: Blend[] = [
  {
    time: "05:00",
    en: "First Ash",
    ja: "初灰",
    ko: "첫 재",
    notes: "hinoki, cold river air, white pepper",
    notesJa: "檜、川の朝の冷気、白胡椒",
    notesKo: "편백, 차가운 강 아침 공기, 흰 후추",
    price: "¥3,800",
  },
  {
    time: "09:00",
    en: "Paper Morning",
    ja: "紙の朝",
    ko: "종이의 아침",
    notes: "kōzo paper, steamed rice, yesterday's rain",
    notesJa: "楮の紙、蒸した米、昨日の雨",
    notesKo: "닥종이, 갓 찐 쌀, 어제의 비",
    price: "¥3,800",
  },
  {
    time: "14:00",
    en: "The Long Afternoon",
    ja: "長い午後",
    ko: "긴 오후",
    notes: "sandalwood, sun-dried tatami, a spoon of honey",
    notesJa: "白檀、日に干した畳、匙一杯の蜂蜜",
    notesKo: "백단, 햇볕에 말린 다다미, 숟가락 하나의 꿀",
    price: "¥4,200",
  },
  {
    time: "19:00",
    en: "Lamp Hour",
    ja: "灯の刻",
    ko: "등불의 시간",
    notes: "clove, old lacquer, temple dust",
    notesJa: "丁子、古い漆、御堂の埃",
    notesKo: "정향, 오래된 옻, 사찰의 먼지",
    price: "¥4,600",
  },
  {
    time: "23:00",
    en: "Last Ember",
    ja: "残り火",
    ko: "마지막 잔불",
    notes: "agarwood, warm ash, the inside of a bell",
    notesJa: "沈香、ぬるい灰、鐘の内側",
    notesKo: "침향, 따뜻한 재, 종의 안쪽",
    price: "¥5,800",
  },
];

/**
 * Section 04 — the hours. A quiet editorial ledger: hairline rules, one
 * ember numeral per row, and enough 間 (ma) that each blend gets a full
 * breath before the next. Nothing here is interactive on purpose — a menu
 * in this house is something you read slowly, not something you operate.
 */
export default function IncenseMenu() {
  return (
    <section className="kemuri-menu" aria-labelledby="kemuri-menu-title">
      <div className="kemuri-sechead" data-reveal="">
        <p className="kemuri-eyebrow" aria-hidden="true">
          04 — 향 시간 · 香時間
        </p>
        <h2 className="kemuri-sechead__title" id="kemuri-menu-title">
          <span lang="ko">시간들</span>{" "}
          <span lang="ja" className="kemuri-sechead__ja">
            香時間
          </span>
        </h2>
        <p className="kemuri-sechead__line">
          <span lang="ko">
            어떤 향도 한 시간짜리입니다. 향기를 위해서가 아니라 시간을 위해
            피웁니다.
          </span>{" "}
          <span lang="ja" className="kemuri-sechead__lineja">
            どの香も、長さは一時間。香りのためでなく、時間のために焚く。
          </span>
        </p>
      </div>

      <ul className="kemuri-menu__list">
        {BLENDS.map((b) => (
          <li key={b.time} className="kemuri-menu__item" data-reveal="">
            <span className="kemuri-menu__time">{b.time}</span>
            <span className="kemuri-menu__names">
              <span lang="ko" className="kemuri-menu__ko">
                {b.ko}
              </span>
              <span className="kemuri-menu__en">{b.en}</span>
              <span lang="ja" className="kemuri-menu__ja">
                {b.ja}
              </span>
              <span className="kemuri-menu__notes">
                <span lang="ko">{b.notesKo}</span> {b.notes}{" "}
                <span lang="ja" className="kemuri-menu__notesja">
                  {b.notesJa}
                </span>
              </span>
            </span>
            <span className="kemuri-menu__price">{b.price}</span>
          </li>
        ))}
      </ul>

      <p className="kemuri-menu__foot" data-reveal="">
        <span lang="ko">시간 단위로 팝니다. 그램으로는 받지 않습니다.</span>{" "}
        <span lang="ja">量り売りは時間で。グラムでは承っておりません。</span>
      </p>
    </section>
  );
}
