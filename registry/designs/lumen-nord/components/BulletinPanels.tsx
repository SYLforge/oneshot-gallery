"use client";

import GlassPanel from "./GlassPanel";

/**
 * Section 02 — tonight's bulletin. Three specular glass panels over the
 * afterglow field: the planetary K-index with an arc gauge, the visibility
 * window with a night-bar, and the poetic "what to look for" advisory. All
 * readings are fiction, but plausible fiction — the bureau would notice.
 */
export default function BulletinPanels() {
  return (
    <section className="lumen-bulletin" aria-labelledby="lumen-bulletin-title">
      <div className="lumen-section__head" data-reveal>
        <p className="lumen-section__no" aria-hidden="true">
          02
        </p>
        <h2 className="lumen-section__title" id="lumen-bulletin-title">
          Tonight’s bulletin{" "}
          <span lang="ko" className="lumen-section__ko">
            오늘 밤의 예보
          </span>
        </h2>
        <p className="lumen-section__meta">
          CONFIDENCE 78% · <span lang="ko">신뢰도 78%</span>
        </p>
      </div>

      <div className="lumen-bulletin__grid">
        <GlassPanel className="lumen-panel">
          <div data-reveal>
            <p className="lumen-panel__label">
              PLANETARY K-INDEX · <span lang="ko">행성 지자기 지수</span>
            </p>
            <p className="lumen-panel__value">
              Kp 5.7<span className="lumen-panel__unit"> / 9</span>
            </p>
            <svg
              className="lumen-gauge"
              viewBox="0 0 120 64"
              aria-hidden="true"
            >
              <path
                className="lumen-gauge__track"
                d="M 10 58 A 50 50 0 0 1 110 58"
                pathLength={9}
              />
              <path
                className="lumen-gauge__fill"
                d="M 10 58 A 50 50 0 0 1 110 58"
                pathLength={9}
                strokeDasharray="5.7 9"
              />
            </svg>
            <p className="lumen-panel__line">
              Minor storm. The field lines are humming.
              <span lang="ko" className="lumen-panel__ko">
                약한 자기폭풍 — 자기력선이 낮게 웅웅거린다.
              </span>
            </p>
            <p className="lumen-panel__meta">
              solar wind 612 km/s · Bz −8.4 nT
            </p>
          </div>
        </GlassPanel>

        <GlassPanel className="lumen-panel">
          <div data-reveal>
            <p className="lumen-panel__label">
              VISIBILITY WINDOW · <span lang="ko">관측 창</span>
            </p>
            <p className="lumen-panel__value">22:40 – 01:10</p>
            <div className="lumen-window" aria-hidden="true">
              <span className="lumen-window__band" />
              <span className="lumen-window__tick" data-hour="21:00" />
              <span
                className="lumen-window__tick lumen-window__tick--mid"
                data-hour="00:00"
              />
              <span
                className="lumen-window__tick lumen-window__tick--end"
                data-hour="03:00"
              />
            </div>
            <p className="lumen-panel__line">
              Clear spells between passing cloud. Moon 12% and setting —
              politely dim.
              <span lang="ko" className="lumen-panel__ko">
                구름 사이가 갠다. 달은 12%, 지는 중 — 예의 바르게 어둡다.
              </span>
            </p>
            <p className="lumen-panel__meta">cloud 18% · KST, all times</p>
          </div>
        </GlassPanel>

        <GlassPanel className="lumen-panel lumen-panel--wide">
          <div data-reveal>
            <p className="lumen-panel__label">
              WHAT TO LOOK FOR · <span lang="ko">무엇을 볼 것인가</span>
            </p>
            <p className="lumen-panel__line lumen-panel__line--lg">
              Green first, low on the northern horizon — a pale arc you would
              call cloud, until it moves. If the night is generous: a magenta
              hem, high and brief. Look away for a minute if you must.
              Curtains reward the patient.
            </p>
            <p
              className="lumen-panel__line lumen-panel__line--lg lumen-panel__ko"
              lang="ko"
            >
              먼저 초록 — 북쪽 지평선에 낮게, 움직이기 전까지는 구름이라
              불렀을 옅은 호. 밤이 후하다면 그 위에 자주색 옷단이 잠깐,
              높게. 일 분쯤 시선을 돌려도 좋다. 커튼은 기다리는 사람에게
              관대하다.
            </p>
          </div>
        </GlassPanel>
      </div>
    </section>
  );
}
