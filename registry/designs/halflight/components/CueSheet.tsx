"use client";

type Cue = {
  tc: string;
  name: string;
  note: string;
  ko: string;
  unused?: boolean;
};

const CUES: Cue[] = [
  {
    tc: "00:00:12:00",
    name: "CUE 01 — OPENING IRIS",
    note: "Low strings, one held breath.",
    ko: "현악 저음, 참았던 숨 하나.",
  },
  {
    tc: "00:04:31:12",
    name: "CUE 02 — THE CORRIDOR",
    note: "Felt piano. The tape hiss stays in.",
    ko: "펠트 피아노. 테이프 잡음은 남겨 둔다.",
  },
  {
    tc: "00:17:03:00",
    name: "CUE 03 — RAIN, INTERIOR",
    note: "Nothing plays. The rain is the score.",
    ko: "아무것도 연주하지 않는다. 비가 곧 음악이다.",
  },
  {
    tc: "00:26:40:18",
    name: "CUE 04 — NIGHT SWIM",
    note: "The strings enter three seconds late, on purpose.",
    ko: "현악은 3초 늦게, 의도적으로 들어온다.",
  },
  {
    tc: "00:41:22:06",
    name: "CUE 05 — THE CONFESSION",
    note: "Cut. The scene said it better silent.",
    ko: "삭제. 그 장면은 침묵일 때 더 정확했다.",
    unused: true,
  },
  {
    tc: "01:02:59:23",
    name: "CUE 06 — END TITLES",
    note: "The theme, finally, in a major key it never earned.",
    ko: "마침내 장조로 — 그럴 자격은 끝내 없었지만.",
  },
];

/**
 * Reel 04 — the cue sheet. Music written down like a shot list: timecode,
 * cue, direction. Everything is plain DOM — visible without JavaScript,
 * revealed with a small stagger when it is available. Exactly one cue is
 * struck through; its red spine is the only accent in the section.
 */
export default function CueSheet() {
  return (
    <section className="halflight-cues" aria-labelledby="halflight-cues-title">
      <header className="halflight-cues__head" data-reveal>
        <p className="halflight-sechead__no halflight-mono" aria-hidden="true">
          REEL 04
        </p>
        <h2 className="halflight-sechead" id="halflight-cues-title">
          THE CUE SHEET{" "}
          <span lang="ko" className="halflight-sechead__ko">
            큐 시트
          </span>
        </h2>
        <p className="halflight-cues__slug halflight-mono">
          MUSIC, WRITTEN LIKE A SHOT LIST.{" "}
          <span lang="ko">음악을, 촬영 목록처럼.</span>
        </p>
      </header>

      <ol className="halflight-cues__list">
        {CUES.map((cue) => (
          <li
            key={cue.tc}
            className={`halflight-cue${cue.unused ? " halflight-cue--unused" : ""}`}
            data-reveal
          >
            <span className="halflight-cue__tc halflight-mono">{cue.tc}</span>
            <div className="halflight-cue__body">
              <h3 className="halflight-cue__name">
                {cue.unused ? <s>{cue.name}</s> : cue.name}
                {cue.unused && (
                  <span className="halflight-cue__flag halflight-mono">
                    {" "}
                    UNUSED · <span lang="ko">미사용</span>
                  </span>
                )}
              </h3>
              <p className="halflight-cue__note">
                {cue.note} <span lang="ko">{cue.ko}</span>
              </p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
