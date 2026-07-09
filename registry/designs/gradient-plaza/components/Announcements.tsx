"use client";

/**
 * Section 01 — the night's PA announcements, set large. These are the lines
 * that smear: each English line is a .plaza-ab element whose cyan and pink
 * pseudo-element ghosts split apart with scroll velocity (see styles.css and
 * useScrollEnergy). The base glyphs never move and never lose contrast — the
 * ghosts are additive light on top, so the aberration can only make the text
 * brighter, never dimmer.
 */

const NOTES = [
  {
    time: "00:12",
    en: "The doors are locked. The lights are on. We take that personally.",
    ko: "문은 잠겼고, 불은 켜져 있습니다. 우리는 그걸 진심으로 받아들입니다.",
  },
  {
    time: "01:47",
    en: "Tonight’s special: everything you left behind, half off.",
    ko: "오늘 밤 특가 — 당신이 두고 간 모든 것, 반값.",
  },
  {
    time: "02:58",
    en: "Parking level B3 does not exist between three and four.",
    ko: "지하 3층 주차장은 3시부터 4시까지 존재하지 않습니다.",
  },
  {
    time: "04:26",
    en: "The food court closes when you stop remembering it.",
    ko: "푸드코트는 당신이 잊는 순간 문을 닫습니다.",
  },
  {
    time: "05:55",
    en: "If you can hear this, the mall is open. For you.",
    ko: "이 방송이 들린다면, 몰은 영업 중입니다. 당신만을 위해.",
    last: true,
  },
] as const;

export default function Announcements() {
  return (
    <section className="plaza-section plaza-pa" aria-labelledby="plaza-pa-title">
      <div className="plaza-sechead">
        <p className="plaza-sechead__no" aria-hidden="true">
          01
        </p>
        <h2
          id="plaza-pa-title"
          className="plaza-sechead__title plaza-ab"
          data-text="ANNOUNCEMENTS"
        >
          ANNOUNCEMENTS{" "}
          <span lang="ko" className="plaza-sechead__ko">
            오늘 밤의 안내방송
          </span>
        </h2>
        <p className="plaza-sechead__meta">
          scroll fast and the PA smears like a tired CRT ·{" "}
          <span lang="ko">빠르게 스크롤하면 방송이 브라운관처럼 번집니다</span>
        </p>
      </div>

      <ul className="plaza-pa__list">
        {NOTES.map((note) => (
          <li
            key={note.time}
            className={`plaza-pa__item${"last" in note && note.last ? " plaza-pa__item--last" : ""}`}
          >
            <span className="plaza-pa__time">{note.time} AM</span>
            <p className="plaza-pa__en plaza-ab" data-text={note.en}>
              {note.en}
            </p>
            <p className="plaza-pa__ko" lang="ko">
              {note.ko}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
