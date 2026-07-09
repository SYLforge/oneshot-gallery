"use client";

/**
 * Section 03 — tonight's programming. A mono broadcast log: eight shows,
 * one gap. The 03:00 slot is styled as SIGNAL LOST — the one place the pink
 * accent means something is wrong, which is what keeps it an accent.
 */

const SHOWS = [
  {
    time: "00:00",
    en: "Fountain Ambience",
    ko: "분수 앰비언스",
    note: "coins landing somewhere soft · 동전이 어딘가 부드러운 곳에 떨어진다",
  },
  {
    time: "01:00",
    en: "Muzak for Empty Corridors",
    ko: "빈 복도를 위한 무자크",
    note: "field recording, level two · 필드 레코딩, 2층",
  },
  {
    time: "02:00",
    en: "Escalator Jazz",
    ko: "에스컬레이터 재즈",
    note: "live from the up escalator · 상행 에스컬레이터에서 생방송",
  },
  {
    time: "03:00",
    en: "SIGNAL LOST",
    ko: "신호 유실",
    note: "we do not talk about three o’clock · 3시에 대해서는 말하지 않기로 해요",
    lost: true,
  },
  {
    time: "03:30",
    en: "Food Court Rain",
    ko: "푸드코트에 내리는 비",
    note: "indoors. somehow. · 실내인데, 어째서인지",
  },
  {
    time: "04:00",
    en: "B3 Slow Dance",
    ko: "지하 3층 슬로 댄스",
    note: "for the cars that stayed · 남아 있는 차들을 위해",
  },
  {
    time: "05:00",
    en: "Neon Sign Repair Hour",
    ko: "네온사인 수리의 시간",
    note: "the A flickers back to life · 간판의 A가 다시 깜빡인다",
  },
  {
    time: "06:00",
    en: "Closing Announcements (Reprise)",
    ko: "폐점 안내 (리프라이즈)",
    note: "doors open. we go quiet. · 문이 열리면, 우리는 조용해진다",
  },
] as const;

export default function Schedule() {
  return (
    <section
      className="plaza-section plaza-schedule"
      aria-labelledby="plaza-schedule-title"
    >
      <div className="plaza-sechead">
        <p className="plaza-sechead__no" aria-hidden="true">
          03
        </p>
        <h2
          id="plaza-schedule-title"
          className="plaza-sechead__title plaza-ab"
          data-text="PROGRAMMING"
        >
          PROGRAMMING{" "}
          <span lang="ko" className="plaza-sechead__ko">
            오늘 밤 편성표
          </span>
        </h2>
        <p className="plaza-sechead__meta">
          FM 88.8 · 00:00 – 06:00 · every night the doors lock ·{" "}
          <span lang="ko">문이 잠기는 모든 밤</span>
        </p>
      </div>

      <ol className="plaza-sched">
        {SHOWS.map((show) => (
          <li
            key={show.time}
            className={`plaza-sched__row${"lost" in show && show.lost ? " plaza-sched__row--lost" : ""}`}
          >
            <span className="plaza-sched__time">{show.time}</span>
            <span className="plaza-sched__name">
              {show.en}
              <span lang="ko" className="plaza-sched__ko">
                {show.ko}
              </span>
            </span>
            <span className="plaza-sched__note">{show.note}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}
