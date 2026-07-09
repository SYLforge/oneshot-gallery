"use client";

/**
 * 04 — the programs. A quiet ledger: four ways to be in the forest, each
 * with a Korean name, an hour, and one sensory line. No cards, no buttons —
 * hairline rules and generous space; the list is meant to be read at the
 * pace the rest of the page has taught.
 */
const RETREATS = [
  {
    ko: "새벽 숲길",
    en: "Dawn Walk",
    time: "06:00",
    length: "90분 · 90 min",
    senseEn: "Mist holds the light the way you hold a breath. Dew wakes under your feet.",
    senseKo: "안개가 빛을 머금는 시간. 발밑에서 이슬이 먼저 깨어납니다.",
  },
  {
    ko: "이끼 명상",
    en: "Moss Meditation",
    time: "11:00",
    length: "60분 · 60 min",
    senseEn: "Kneel close. The oldest green is also the softest.",
    senseKo: "무릎을 낮춰 보세요. 가장 오래된 초록이 가장 부드럽습니다.",
  },
  {
    ko: "계곡 귀 기울이기",
    en: "Stream Listening",
    time: "15:00",
    length: "75분 · 75 min",
    senseEn: "The water has been practicing this one sentence for ten thousand years.",
    senseKo: "물은 이 한 문장을 만 년째 연습하고 있습니다.",
  },
  {
    ko: "밤의 숲",
    en: "Night Forest",
    time: "21:00",
    length: "120분 · 120 min",
    senseEn: "Darkness is not the day ending — it is the forest closing its eyes.",
    senseKo: "어둠은 하루의 끝이 아니라, 숲이 눈을 감는 방식입니다.",
  },
] as const;

export default function Retreats() {
  return (
    <section className="sup-retreats" aria-labelledby="sup-retreats-title">
      <div className="sup-sec" data-reveal>
        <span className="sup-sec__no" lang="ko" aria-hidden="true">
          셋
        </span>
        <h2 className="sup-sec__title" id="sup-retreats-title">
          the retreats{" "}
          <span lang="ko" className="sup-sec__ko">
            리트릿
          </span>
        </h2>
      </div>

      <p className="sup-retreats__lede" data-reveal>
        <em>Four ways to be here. None of them are exercise.</em>{" "}
        <span lang="ko">
          여기 머무는 네 가지 방법. 어느 것도 운동이 아닙니다.
        </span>
      </p>

      <ul className="sup-retreats__list">
        {RETREATS.map((r) => (
          <li key={r.en} className="sup-retreat" data-reveal>
            <p className="sup-retreat__when">
              <span className="sup-retreat__time">{r.time}</span>
              <span className="sup-retreat__length">{r.length}</span>
            </p>
            <h3 className="sup-retreat__name">
              <span lang="ko" className="sup-retreat__ko">
                {r.ko}
              </span>
              <span className="sup-retreat__en">{r.en}</span>
            </h3>
            <p className="sup-retreat__sense">
              <em>{r.senseEn}</em>
              <span lang="ko">{r.senseKo}</span>
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
