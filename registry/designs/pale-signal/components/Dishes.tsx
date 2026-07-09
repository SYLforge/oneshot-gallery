"use client";

import { useState } from "react";

type DishStatus = "tracking" | "holding" | "retired";

type Dish = {
  id: string;
  code: string;
  nameKo: string;
  nameEn: string;
  az: string;
  el: string;
  status: DishStatus;
  statusEn: string;
  statusKo: string;
  noteEn: string;
  noteKo: string;
};

const DISHES: Dish[] = [
  {
    id: "d1",
    code: "DISH-01",
    nameKo: "매화",
    nameEn: "MAEHWA",
    az: "214.7°",
    el: "41.2°",
    status: "tracking",
    statusEn: "TRACKING",
    statusKo: "추적 중",
    noteEn:
      "on the Crab pulsar. last night it counted 1,594,882 beats and dropped none.",
    noteKo:
      "게성운 펄서 담당. 어젯밤 1,594,882번의 박동을 세었고, 하나도 흘리지 않았다.",
  },
  {
    id: "d2",
    code: "DISH-02",
    nameKo: "동백",
    nameEn: "DONGBAEK",
    az: "097.3°",
    el: "12.8°",
    status: "holding",
    statusEn: "HOLDING",
    statusKo: "대기 중",
    noteEn:
      "the moon again. nothing new to say — we never stop listening anyway.",
    noteKo:
      "또 달이다. 새로 하는 말은 없지만, 그래도 듣는 일은 그만두지 않는다.",
  },
  {
    id: "d3",
    code: "DISH-03",
    nameKo: "수선",
    nameEn: "SUSEON",
    az: "000.0°",
    el: "90.0°",
    status: "retired",
    statusEn: "RETIRED",
    statusKo: "퇴역",
    noteEn:
      "retired 2019, still aimed at zenith. some habits outlive their duty.",
    noteKo:
      "2019년 퇴역, 지금도 천정을 향해 있다. 어떤 버릇은 소임보다 오래 산다.",
  },
];

/**
 * Section 04 — the three antennas as a monospace ledger. Each row is a real
 * <button> (keyboard-reachable, aria-expanded) that opens a one-line note.
 * Without JS the notes are simply visible — hiding is gated on `.ps-js`.
 */
export default function Dishes() {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <section className="ps-dishes" aria-labelledby="ps-dishes-title">
      <div className="ps-sechead" data-reveal>
        <span className="ps-sechead__no" aria-hidden="true">
          04
        </span>
        <h2 className="ps-sechead__title" id="ps-dishes-title">
          the dishes{" "}
          <span lang="ko" className="ps-sechead__ko">
            세 개의 귀
          </span>
        </h2>
      </div>

      <ul className="ps-dishes__list">
        {DISHES.map((dish) => {
          const expanded = open === dish.id;
          return (
            <li
              key={dish.id}
              data-reveal
              className={`ps-dish ps-dish--${dish.status}`}
            >
              <button
                type="button"
                className="ps-dish__row"
                aria-expanded={expanded}
                aria-controls={`ps-dish-note-${dish.id}`}
                onClick={() => setOpen(expanded ? null : dish.id)}
              >
                <span className="ps-dish__cross" aria-hidden="true">
                  +
                </span>
                <span className="ps-dish__code">{dish.code}</span>
                <span className="ps-dish__name">
                  <span lang="ko">{dish.nameKo}</span> · {dish.nameEn}
                </span>
                <span className="ps-dish__az">AZ {dish.az}</span>
                <span className="ps-dish__el">EL {dish.el}</span>
                <span className="ps-dish__status">
                  {dish.statusEn} — <span lang="ko">{dish.statusKo}</span>
                </span>
              </button>
              <div
                id={`ps-dish-note-${dish.id}`}
                className={`ps-dish__note ${expanded ? "is-open" : "is-closed"}`}
              >
                <p>{dish.noteEn}</p>
                <p lang="ko">{dish.noteKo}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
