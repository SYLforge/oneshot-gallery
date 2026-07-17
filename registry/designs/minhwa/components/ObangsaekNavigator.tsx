"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";

type ObangColor = {
  id: string;
  /** swatch + accent-live value — must match a token in styles.css */
  value: string;
  /** deep variant for the focus ring / functional accent when this color is active */
  deep: string;
  hanja: string;
  name: string;
  en: string;
  direction: string;
  directionEn: string;
  element: string;
  motif: string;
  motifEn: string;
  meaning: string;
  meaningEn: string;
};

const COLORS: ObangColor[] = [
  {
    id: "cheong",
    value: "#2f6e6a",
    deep: "#235653",
    hanja: "靑",
    name: "청",
    en: "blue-green",
    direction: "동",
    directionEn: "East",
    element: "목 木 · 봄",
    motif: "소나무, 호랑이의 하늘",
    motifEn: "the pine, the tiger's sky",
    meaning:
      "해가 처음 닿는 동쪽의 빛. 민화에서 청은 늘 푸른 소나무와, 호랑이가 앉은 밤하늘에 깔린다. 오래 사는 기운이다.",
    meaningEn:
      "The light of the east, where the sun first touches. In minhwa, cheong lays under the evergreen pine and the night sky the tiger sits beneath — the breath of long life.",
  },
  {
    id: "jeok",
    value: "#c8362b",
    deep: "#7a241c",
    hanja: "赤",
    name: "적",
    en: "red",
    direction: "남",
    directionEn: "South",
    element: "화 火 · 여름",
    motif: "호랑이 털, 붉은 인장",
    motifEn: "the tiger's coat, the red seal",
    meaning:
      "삿된 것을 물리치는 붉은 빛. 호랑이의 털과 화가가 마지막에 찍는 인장이 모두 이 빛이다. 민화에서 적은 보호와 마침의 색이다.",
    meaningEn:
      "The red that wards off ill. The tiger's coat and the seal a painter stamps last both carry this light — in minhwa, jeok is the color of protection and of finishing.",
  },
  {
    id: "hwang",
    value: "#d99a1f",
    deep: "#9c6a12",
    hanja: "黃",
    name: "황",
    en: "yellow",
    direction: "중앙",
    directionEn: "Center",
    element: "토 土 · 환절",
    motif: "해, 십장생의 금빛",
    motifEn: "the sun, the gold of the ten longevity symbols",
    meaning:
      "다섯 방위가 모이는 한가운데, 임금의 빛. 민화에서 황은 해와, 오래오래 사는 열 가지 상징의 금빛으로 나타난다. 정확히 쓰는 색이다.",
    meaningEn:
      "The center where the five directions meet — the sovereign light. In minhwa, hwang appears as the sun and as the gold of the ten longevity symbols. It is spent exactly, not freely.",
  },
  {
    id: "baek",
    value: "#fbf8ef",
    deep: "#5a4a3c",
    hanja: "白",
    name: "백",
    en: "white",
    direction: "서",
    directionEn: "West",
    element: "금 金 · 가을",
    motif: "달, 여백, 호분",
    motifEn: "the moon, the empty ground, the powdered shell",
    meaning:
      "결백과 비움의 빛. 민화에서 백은 종이 자체이자, 색과 색 사이의 호분 숨이고, 해의 짝인 달이다. 그림의 여백은 빈 것이 아니라 채워진 것이다.",
    meaningEn:
      "The light of clarity and of emptying. In minhwa, baek is the paper itself — the powdered-shell breath between colors, and the moon paired with the sun. The empty ground of a painting is not vacant; it is full.",
  },
  {
    id: "heuk",
    value: "#1a1410",
    deep: "#1a1410",
    hanja: "黑",
    name: "흑",
    en: "black",
    direction: "북",
    directionEn: "North",
    element: "수 水 · 겨울",
    motif: "윤곽선, 까치, 먹물",
    motifEn: "the outline, the magpie, the ink",
    meaning:
      "모든 색이 돌아가 쉬는 어둠. 민화의 검은 윤곽선은 채색이 끝난 뒤 그어, 다섯 빛을 제자리에 앉힌다. 까치도 이 빛으로 기쁜 소식을 가져온다.",
    meaningEn:
      "The dark every color returns to for rest. The black outline of a minhwa is drawn after the coloring, to seat all five lights in their places — and the magpie, too, brings the glad tidings in this light.",
  },
];

/**
 * Section 03 — 오방색 navigator. The five directional colors as a *system*,
 * not decoration: pick one and it becomes the gallery's living accent
 * (--minhwa-accent-live on .minhwa-root), tinting the focus ring, the
 * hover washes, and the section rule. Each color also names the minhwa
 * motif it lives in — so the palette is taught as the cosmology behind the
 * paintings, not as swatches.
 *
 * Every note is in the DOM and visible without JavaScript — with JS, only
 * the active note shows. Color swaps are instant by design: pigment does
 * not ease. baek would vanish as an accent on hanji paper, so when 백 is
 * selected the accent borrows ink-soft (a soft earth tone) instead.
 */
export default function ObangsaekNavigator() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [active, setActive] = useState("jeok");

  useEffect(() => {
    const root = sectionRef.current?.closest<HTMLElement>(".minhwa-root");
    if (!root) return;
    const color = COLORS.find((c) => c.id === active);
    if (!color) return;
    // baek would vanish as an accent on hanji; borrow ink-soft instead.
    const value = color.id === "baek" ? color.deep : color.value;
    root.style.setProperty("--minhwa-accent-live", value);
    return () => {
      root.style.removeProperty("--minhwa-accent-live");
    };
  }, [active]);

  return (
    <section
      className="minhwa-obang"
      aria-labelledby="minhwa-obang-title"
      ref={sectionRef}
    >
      <div className="minhwa-sechead" data-reveal>
        <span className="minhwa-sechead__no" lang="en" aria-hidden="true">
          03
        </span>
        <h2 className="minhwa-sechead__title" id="minhwa-obang-title">
          오방색{" "}
          <span className="minhwa-sechead__en" lang="en">
            the five colors, walked
          </span>
        </h2>
      </div>

      <p className="minhwa-obang__intro" data-reveal>
        다섯 방위, 다섯 빛. 민화의 색은 취향이 아니라 우주관이다 — 동·남·중앙·서·북,
        각 빛이 품은 상징이 그림 전체를 짓는다. 한 빛을 고르면 화랑이 그 빛으로
        숨을 쉰다.
      </p>
      <p className="minhwa-obang__intro-en" lang="en" data-reveal>
        Five directions, five lights. In minhwa the palette is a cosmology, not
        a taste — east, south, center, west, north, and the symbol each light
        holds builds the whole painting. Choose one and the gallery breathes
        in that hue.
      </p>

      <ul className="minhwa-obang__rail" data-reveal>
        {COLORS.map((c) => {
          const isActive = active === c.id;
          return (
            <li key={c.id} className="minhwa-obang__cell">
              <button
                type="button"
                className="minhwa-obang__btn"
                style={
                  {
                    "--minhwa-swatch": c.value,
                    "--minhwa-swatch-deep": c.deep,
                  } as CSSProperties
                }
                data-active={isActive || undefined}
                data-baek={c.id === "baek" || undefined}
                aria-pressed={isActive}
                aria-controls={`minhwa-obang-note-${c.id}`}
                onClick={() => setActive(c.id)}
                onMouseEnter={() => setActive(c.id)}
                onFocus={() => setActive(c.id)}
              >
                <span className="minhwa-obang__swatch" aria-hidden="true" />
                <span className="minhwa-obang__hanja">{c.hanja}</span>
                <span className="minhwa-obang__name">
                  {c.name}{" "}
                  <span className="minhwa-obang__name-en" lang="en">
                    {c.en}
                  </span>
                </span>
                <span className="minhwa-obang__dir">
                  {c.direction} · <span lang="en">{c.directionEn}</span> ·{" "}
                  {c.element}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <div className="minhwa-obang__notes" data-reveal>
        {COLORS.map((c) => {
          const isActive = active === c.id;
          return (
            <article
              key={c.id}
              id={`minhwa-obang-note-${c.id}`}
              className={`minhwa-obang__note ${
                isActive ? "is-open" : "is-closed"
              }`}
              aria-label={`${c.name} — ${c.motif}`}
            >
              <h3 className="minhwa-obang__note-head">
                {c.hanja} {c.name} · {c.direction}
                <span className="minhwa-obang__note-en" lang="en">
                  {" "}
                  — {c.directionEn}
                </span>
              </h3>
              <p className="minhwa-obang__note-motif">
                이 빛이 사는 자리: {c.motif}
              </p>
              <p className="minhwa-obang__note-meaning">{c.meaning}</p>
              <p className="minhwa-obang__note-en" lang="en">
                {c.meaningEn}
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
