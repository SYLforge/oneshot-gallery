"use client";

/** Predicted intensity, hour by hour. The peak sits just after midnight. */
const DATA = [
  { h: "21", kp: 1.8 },
  { h: "22", kp: 3.1 },
  { h: "23", kp: 5.2 },
  { h: "00", kp: 5.7 },
  { h: "01", kp: 4.6 },
  { h: "02", kp: 3.0 },
  { h: "03", kp: 2.2 },
] as const;

const W = 640;
const H = 190;
const PAD_X = 26;
const BASE_Y = 148;
const KP_SCALE = 17; // px per Kp
const STORM_Y = BASE_Y - 5 * KP_SCALE; // the Kp 5 storm threshold

const px = (i: number) => PAD_X + (i * (W - PAD_X * 2)) / (DATA.length - 1);
const py = (kp: number) => BASE_Y - kp * KP_SCALE;

type Pt = { x: number; y: number };

/** Catmull-Rom through the readings, emitted as cubic beziers. */
function smoothPath(p: Pt[]): string {
  let d = `M ${p[0].x.toFixed(1)} ${p[0].y.toFixed(1)}`;
  for (let i = 0; i < p.length - 1; i++) {
    const p0 = p[Math.max(0, i - 1)];
    const p1 = p[i];
    const p2 = p[i + 1];
    const p3 = p[Math.min(p.length - 1, i + 2)];
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${c1x.toFixed(1)} ${c1y.toFixed(1)}, ${c2x.toFixed(1)} ${c2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
  }
  return d;
}

const PTS: Pt[] = DATA.map((d, i) => ({ x: px(i), y: py(d.kp) }));
const LINE = smoothPath(PTS);
const AREA = `${LINE} L ${PTS[PTS.length - 1].x.toFixed(1)} ${BASE_Y} L ${PTS[0].x.toFixed(1)} ${BASE_Y} Z`;

/**
 * Section 03 — the forecast log. The night's predicted intensity as a
 * sparkline that draws itself on scroll-into-view (pathLength-normalized
 * stroke-dashoffset, triggered by the shared reveal observer), followed by
 * three lines on how the bureau listens. Without JS, or under reduced
 * motion, the line is simply there — fully drawn.
 */
export default function ForecastLog() {
  return (
    <section className="lumen-log" aria-labelledby="lumen-log-title">
      <div className="lumen-section__head" data-reveal>
        <p className="lumen-section__no" aria-hidden="true">
          03
        </p>
        <h2 className="lumen-section__title" id="lumen-log-title">
          The night, hour by hour{" "}
          <span lang="ko" className="lumen-section__ko">
            시간별 예측
          </span>
        </h2>
        <p className="lumen-section__meta">
          PREDICTED INTENSITY · <span lang="ko">예측 강도</span>
        </p>
      </div>

      <div className="lumen-spark" data-reveal>
        <svg
          className="lumen-spark__svg"
          viewBox={`0 0 ${W} ${H}`}
          role="img"
          aria-label="Forecast sparkline: activity rises from Kp 1.8 at 21:00 to a peak of Kp 5.7 around midnight, crossing the storm threshold between 23:00 and 01:00, then eases to Kp 2.2 by 03:00. 예측 그래프: 활동은 21시 Kp 1.8에서 자정 무렵 최고치 Kp 5.7까지 올라 23시부터 01시 사이 폭풍 문턱을 넘고, 03시에는 Kp 2.2로 잦아든다."
        >
          <defs>
            <linearGradient id="lumen-spark-grad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" className="lumen-spark__stop-a" />
              <stop offset="1" className="lumen-spark__stop-b" />
            </linearGradient>
            <linearGradient id="lumen-spark-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" className="lumen-spark__stop-fill" />
              <stop offset="1" className="lumen-spark__stop-none" />
            </linearGradient>
          </defs>

          <line
            className="lumen-spark__threshold"
            x1={PAD_X}
            y1={STORM_Y}
            x2={W - PAD_X}
            y2={STORM_Y}
          />
          <text
            className="lumen-spark__note"
            x={PAD_X}
            y={STORM_Y - 8}
          >
            Kp 5 — storm threshold · 폭풍 문턱
          </text>

          <path className="lumen-spark__area" d={AREA} />
          <path className="lumen-spark__line" d={LINE} pathLength={1} />

          {DATA.map((d, i) => (
            <g key={d.h}>
              <circle
                className="lumen-spark__dot"
                cx={px(i)}
                cy={py(d.kp)}
                r={3.2}
                style={{ transitionDelay: `${1100 + i * 110}ms` }}
              />
              <text
                className="lumen-spark__label"
                x={px(i)}
                y={H - 10}
                textAnchor="middle"
              >
                {d.h}
              </text>
            </g>
          ))}
        </svg>
        <p className="lumen-spark__caption">
          Hours in KST. The sky keeps its own schedule; this is our best
          argument with it.{" "}
          <span lang="ko">
            시각은 KST. 하늘은 제 일정대로 움직인다 — 이것은 우리가 하늘과
            벌이는 가장 정중한 논쟁이다.
          </span>
        </p>
      </div>

      <div className="lumen-method" data-reveal>
        <h3 className="lumen-method__title">
          How the bureau listens{" "}
          <span lang="ko" className="lumen-section__ko">
            예보국이 듣는 법
          </span>
        </h3>
        <ul className="lumen-method__list">
          <li>
            We read the solar wind ninety minutes before it arrives.
            <span lang="ko" className="lumen-method__ko">
              태양풍이 도착하기 구십 분 전에, 우리가 먼저 읽는다.
            </span>
          </li>
          <li>
            Three magnetometers hold their breath in the dark.
            <span lang="ko" className="lumen-method__ko">
              자력계 세 대가 어둠 속에서 숨을 참는다.
            </span>
          </li>
          <li>
            Cameras pointed at nothing, all night, on purpose.
            <span lang="ko" className="lumen-method__ko">
              카메라들은 일부러, 밤새, 아무것도 없는 곳을 본다.
            </span>
          </li>
        </ul>
      </div>
    </section>
  );
}
