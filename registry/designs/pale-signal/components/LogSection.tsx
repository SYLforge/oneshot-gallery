"use client";

type LogEntry = {
  time: string;
  en: string;
  ko: string;
  alert?: boolean;
};

const ENTRIES: LogEntry[] = [
  {
    time: "22:04",
    en: "power up. the ridge holds its breath; so do we.",
    ko: "전원 인가. 능선이 숨을 죽인다. 우리도 함께.",
  },
  {
    time: "22:41",
    en: "DISH-01 finds the Crab pulsar. thirty-three milliseconds — a heart that has never once missed.",
    ko: "1호기가 게성운 펄서를 잡았다. 33밀리초 — 단 한 번도 어긋난 적 없는 심장.",
  },
  {
    time: "23:26",
    en: "faint chirp at 1420 MHz. probably hydrogen. probably.",
    ko: "1420메가헤르츠에서 희미한 지저귐. 아마 수소겠지. 아마.",
  },
  {
    time: "00:12",
    en: "the moon hums tonight — low, warm, like a transformer left on in an empty school.",
    ko: "오늘 달은 웅웅거린다 — 낮고 따뜻하게, 빈 학교에 켜 둔 변압기처럼.",
  },
  {
    time: "01:38",
    en: "static that sounded like rain. we listened until it stopped. it did not stop.",
    ko: "빗소리를 닮은 잡음. 그칠 때까지 들었다. 그치지 않았다.",
  },
  {
    time: "02:07",
    en: "narrowband spike, 8.2 seconds, then once more. logged. not explained.",
    ko: "협대역 신호 8.2초, 그리고 한 번 더. 기록은 했다. 설명은 못 했다.",
    alert: true,
  },
  {
    time: "03:11",
    en: "signal faint but present.",
    ko: "신호 미약, 존재 확인.",
  },
  {
    time: "04:29",
    en: "Cygnus sets behind the ridge. the tape keeps rolling for no one in particular.",
    ko: "백조자리가 능선 뒤로 진다. 테이프는 누구를 위해서랄 것도 없이 계속 돈다.",
  },
  {
    time: "05:52",
    en: "first light. the sky changes the subject.",
    ko: "동이 튼다. 하늘이 말끝을 돌린다.",
  },
];

/** Section 02 — the operator's log for tonight, one flagged entry in amber. */
export default function LogSection() {
  return (
    <section className="ps-log" aria-labelledby="ps-log-title">
      <div className="ps-sechead" data-reveal>
        <span className="ps-sechead__no" aria-hidden="true">
          02
        </span>
        <h2 className="ps-sechead__title" id="ps-log-title">
          tonight&rsquo;s log{" "}
          <span lang="ko" className="ps-sechead__ko">
            오늘 밤의 기록
          </span>
        </h2>
      </div>

      <ol className="ps-log__list">
        {ENTRIES.map((entry) => (
          <li
            key={entry.time}
            data-reveal
            className={
              entry.alert
                ? "ps-log__entry ps-log__entry--alert"
                : "ps-log__entry"
            }
          >
            <span className="ps-log__time">
              {entry.time} KST
              {entry.alert ? (
                <span className="ps-log__flag">
                  {" "}
                  ⚠ unresolved · <span lang="ko">미해결</span>
                </span>
              ) : null}
            </span>
            <p className="ps-log__en">{entry.en}</p>
            <p className="ps-log__ko" lang="ko">
              {entry.ko}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}
