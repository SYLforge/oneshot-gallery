"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";

type ObangColor = {
  id: string;
  /** swatch + accent-live value — must match a token in styles.css */
  value: string;
  hanja: string;
  name: string;
  en: string;
  direction: string;
  directionEn: string;
  element: string;
  guardian: string;
  pigment: string;
  meaning: string;
  usage: string;
  usageEn: string;
};

const COLORS: ObangColor[] = [
  {
    id: "cheong",
    value: "#2f5d9e",
    hanja: "靑",
    name: "청",
    en: "blue",
    direction: "동",
    directionEn: "East",
    element: "목 木 · 봄",
    guardian: "청룡",
    pigment: "삼청 三靑",
    meaning: "동쪽, 봄, 나무의 기운. 해가 처음 닿는 방위의 색이다.",
    usage:
      "머리초의 바깥 휘와 금문의 띠에 쓰인다. 처마 그늘에서 가장 깊게 가라앉아, 먼 데서 보면 하늘이 부재 밑으로 들어온 것처럼 보인다.",
    usageEn:
      "Used for the outer bands of moricho and the ribbons of geummun — in the shade of the eave it reads like sky drawn up under the timber.",
  },
  {
    id: "jeok",
    value: "#8a3b2a",
    hanja: "赤",
    name: "적",
    en: "red",
    direction: "남",
    directionEn: "South",
    element: "화 火 · 여름",
    guardian: "주작",
    pigment: "석간주 石間朱",
    meaning: "남쪽, 여름, 불의 기운. 삿된 것을 물리는 색이다.",
    usage:
      "기둥과 굵은 부재의 바탕이 되는 석간주 — 흙에서 얻는 붉은 산화철이다. 나무의 숨은 그대로 두고, 비와 벌레만 막는다.",
    usageEn:
      "Seokganju, an iron-oxide earth red, grounds the columns and heavy members: it lets the wood breathe while keeping out rain and insects.",
  },
  {
    id: "hwang",
    value: "#d9a441",
    hanja: "黃",
    name: "황",
    en: "yellow",
    direction: "중앙",
    directionEn: "Center",
    element: "토 土 · 환절",
    guardian: "황룡",
    pigment: "석황 石黃",
    meaning: "중앙, 흙의 기운. 다섯 방위가 모이는 자리, 임금의 색이다.",
    usage:
      "연화문의 씨방과 휘의 금 자리에 아껴 쓴다. 많이 쓰는 색이 아니라, 정확히 쓰는 색 — 황이 놓인 곳이 문양의 중심이다.",
    usageEn:
      "Spent sparingly: the seed-pod of the lotus, the gilt line of a band. Wherever hwang sits, that is the center of the pattern.",
  },
  {
    id: "baek",
    value: "#f7f3e8",
    hanja: "白",
    name: "백",
    en: "white",
    direction: "서",
    directionEn: "West",
    element: "금 金 · 가을",
    guardian: "백호",
    pigment: "호분 胡粉",
    meaning: "서쪽, 가을, 쇠의 기운. 결백과 비움의 색이다.",
    usage:
      "빛넣기 — 색과 색 사이에 놓이는 흰 숨이다. 조개껍질을 갈아 만든 호분의 분선이 문양의 경계를 멀리서도 또렷하게 세운다.",
    usageEn:
      "Bitneoki, the white breath laid between colors: powdered-shell lines that keep every boundary legible from the courtyard below.",
  },
  {
    id: "heuk",
    value: "#1f1c19",
    hanja: "黑",
    name: "흑",
    en: "black",
    direction: "북",
    directionEn: "North",
    element: "수 水 · 겨울",
    guardian: "현무",
    pigment: "먹 墨",
    meaning: "북쪽, 겨울, 물의 기운. 모든 색이 돌아가 쉬는 어둠이다.",
    usage:
      "먹기화 — 채색이 모두 끝난 뒤 마지막에 긋는 검은 윤곽선이다. 먹선 하나가 다섯 색을 제자리에 앉힌다.",
    usageEn:
      "Meokgihwa, the final ink outline drawn after every color is laid: one black line seats all five in their places.",
  },
];

/**
 * Section 02 — 오방색, the five directional colors.
 *
 * Hover, focus, or tap a color to make it the page's living accent
 * (--giwa-accent-live on .giwa-root) and to read how dancheong uses it.
 * Every note is in the DOM and visible without JavaScript — with JS, only
 * the active one shows. Color swaps are instant by design: pigment does
 * not ease.
 */
export default function Obangsaek() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [active, setActive] = useState("hwang");

  useEffect(() => {
    const root = sectionRef.current?.closest<HTMLElement>(".giwa-root");
    if (!root) return;
    const color = COLORS.find((c) => c.id === active);
    // baek would vanish as an accent on hanji paper; borrow its guardian ink
    const value =
      color && color.id !== "baek" ? color.value : "#3e5850";
    root.style.setProperty("--giwa-accent-live", value);
    return () => {
      root.style.removeProperty("--giwa-accent-live");
    };
  }, [active]);

  return (
    <section
      className="giwa-obang"
      aria-labelledby="giwa-obang-title"
      ref={sectionRef}
    >
      <div className="giwa-sechead" data-reveal>
        <span className="giwa-sechead__no" lang="en" aria-hidden="true">
          02
        </span>
        <h2 className="giwa-sechead__title" id="giwa-obang-title">
          오방색{" "}
          <span className="giwa-sechead__en" lang="en">
            the five directional colors
          </span>
        </h2>
      </div>

      <p className="giwa-obang__intro" data-reveal>
        다섯 방위, 다섯 빛. 단청의 모든 색은 여기서 시작한다. 색은 취향이
        아니라 방위였고, 아름다움이기 전에 질서였다.
      </p>
      <p className="giwa-obang__intro-en" lang="en" data-reveal>
        Five directions, five lights. Every dancheong color begins here —
        not taste but bearing, order before beauty.
      </p>

      <ul className="giwa-obang__grid" data-reveal>
        {COLORS.map((c) => {
          const isActive = active === c.id;
          return (
            <li key={c.id} className="giwa-obang__cell">
              <button
                type="button"
                className="giwa-obang__btn"
                style={{ "--giwa-swatch": c.value } as CSSProperties}
                data-active={isActive || undefined}
                aria-expanded={isActive}
                aria-controls={`giwa-obang-note-${c.id}`}
                onClick={() => setActive(c.id)}
                onMouseEnter={() => setActive(c.id)}
                onFocus={() => setActive(c.id)}
              >
                <span className="giwa-obang__swatch" aria-hidden="true" />
                <span className="giwa-obang__hanja">{c.hanja}</span>
                <span className="giwa-obang__name">
                  {c.name}{" "}
                  <span className="giwa-obang__name-en" lang="en">
                    {c.en}
                  </span>
                </span>
                <span className="giwa-obang__dir">
                  {c.direction} ·{" "}
                  <span lang="en">{c.directionEn}</span> · {c.guardian}
                </span>
                <span className="giwa-obang__pig">{c.pigment}</span>
              </button>
            </li>
          );
        })}
      </ul>

      <div className="giwa-obang__notes" data-reveal>
        {COLORS.map((c) => {
          const isActive = active === c.id;
          return (
            <article
              key={c.id}
              id={`giwa-obang-note-${c.id}`}
              className={`giwa-obang__note ${isActive ? "is-open" : "is-closed"}`}
              aria-label={`${c.name} — ${c.pigment}`}
            >
              <h3 className="giwa-obang__note-head">
                {c.hanja} {c.name} · {c.element}
              </h3>
              <p className="giwa-obang__note-meaning">{c.meaning}</p>
              <p className="giwa-obang__note-usage">{c.usage}</p>
              <p className="giwa-obang__note-en" lang="en">
                {c.usageEn}
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
