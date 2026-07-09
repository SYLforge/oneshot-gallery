"use client";

type Blend = {
  time: string;
  en: string;
  ja: string;
  notes: string;
  notesJa: string;
  price: string;
};

/**
 * What the atelier actually sells: hours. Five blends, each named for the
 * time of day it is meant to hold open. Notes read like weather reports
 * from inside a room, not perfume marketing.
 */
const BLENDS: Blend[] = [
  {
    time: "05:00",
    en: "First Ash",
    ja: "初灰",
    notes: "hinoki, cold river air, white pepper",
    notesJa: "檜、川の朝の冷気、白胡椒",
    price: "¥3,800",
  },
  {
    time: "09:00",
    en: "Paper Morning",
    ja: "紙の朝",
    notes: "kōzo paper, steamed rice, yesterday's rain",
    notesJa: "楮の紙、蒸した米、昨日の雨",
    price: "¥3,800",
  },
  {
    time: "14:00",
    en: "The Long Afternoon",
    ja: "長い午後",
    notes: "sandalwood, sun-dried tatami, a spoon of honey",
    notesJa: "白檀、日に干した畳、匙一杯の蜂蜜",
    price: "¥4,200",
  },
  {
    time: "19:00",
    en: "Lamp Hour",
    ja: "灯の刻",
    notes: "clove, old lacquer, temple dust",
    notesJa: "丁子、古い漆、御堂の埃",
    price: "¥4,600",
  },
  {
    time: "23:00",
    en: "Last Ember",
    ja: "残り火",
    notes: "agarwood, warm ash, the inside of a bell",
    notesJa: "沈香、ぬるい灰、鐘の内側",
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
          04 — 香時間
        </p>
        <h2 className="kemuri-sechead__title" id="kemuri-menu-title">
          The hours{" "}
          <span lang="ja" className="kemuri-sechead__ja">
            香時間
          </span>
        </h2>
        <p className="kemuri-sechead__line">
          Each blend is one hour long. Burn it for the time, not the perfume.{" "}
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
              <span className="kemuri-menu__en">{b.en}</span>
              <span lang="ja" className="kemuri-menu__ja">
                {b.ja}
              </span>
              <span className="kemuri-menu__notes">
                {b.notes}{" "}
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
        Sold by the hour, never by the gram.{" "}
        <span lang="ja">量り売りは時間で。グラムでは承っておりません。</span>
      </p>
    </section>
  );
}
