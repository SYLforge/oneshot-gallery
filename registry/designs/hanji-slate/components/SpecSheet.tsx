"use client";

type SpecRow = {
  label: string;
  labelKo: string;
  /** value fragments; `key: true` fragments get the deep-amber accent */
  value: Array<{ text: string; key?: boolean; ko?: boolean }>;
};

const ROWS: SpecRow[] = [
  {
    label: "Display",
    labelKo: "디스플레이",
    value: [
      { text: "6.8″ e-ink · ", key: false },
      { text: "300 ppi", key: true },
      { text: " · 16-level gray" },
    ],
  },
  {
    label: "Glass",
    labelKo: "유리",
    value: [
      { text: "micro-etched · ", key: false },
      { text: "0.4 mm", key: true },
      { text: " · matte, no glare" },
    ],
  },
  {
    label: "Size",
    labelKo: "크기",
    value: [{ text: "158 × 226 × ", key: false }, { text: "4.6 mm", key: true }],
  },
  {
    label: "Weight",
    labelKo: "무게",
    value: [
      { text: "168 g", key: true },
      { text: " — 공책보다 가볍다", ko: true },
    ],
  },
  {
    label: "Pen",
    labelKo: "펜",
    value: [
      { text: "4,096", key: true },
      { text: " pressure levels · no battery, no pairing" },
    ],
  },
  {
    label: "Battery",
    labelKo: "배터리",
    value: [
      { text: "2,900 mAh · ", key: false },
      { text: "6 weeks", key: true },
      { text: " at 30 pages a day" },
    ],
  },
  {
    label: "Light",
    labelKo: "조명",
    value: [
      { text: "front light · ", key: false },
      { text: "2700–5000 K", key: true },
    ],
  },
  {
    label: "Storage",
    labelKo: "저장 공간",
    value: [
      { text: "64 GB", key: true },
      { text: " — 공책 사십 년 치", ko: true },
    ],
  },
  {
    label: "Connectivity",
    labelKo: "연결",
    value: [
      { text: "USB-C · Wi-Fi 6 · ", key: false },
      { text: "off while you write", key: false },
      { text: " 쓰는 동안은 꺼짐", ko: true },
    ],
  },
  {
    label: "Materials",
    labelKo: "재질",
    value: [{ text: "magnesium body · recycled paper packaging" }],
  },
];

/**
 * Section 04 — the spec sheet. A real <table>, hairline rules, JetBrains
 * Mono figures, and exactly one accent: the key figure in each row is set
 * in deep amber (#9a5504 — 4.6:1 on the warm gray, AA for normal text;
 * the bright amber #e8830c never carries text on light ground).
 */
export default function SpecSheet() {
  return (
    <section className="slate-spec" aria-labelledby="slate-spec-title">
      <div className="slate-sechead">
        <span className="slate-sechead__no" aria-hidden="true">
          04
        </span>
        <h2 className="slate-sechead__title" id="slate-spec-title">
          The sheet <span lang="ko">사양표</span>
        </h2>
        <p className="slate-sechead__note">
          Measured, not rounded up.{" "}
          <span lang="ko">부풀리지 않은 숫자.</span>
        </p>
      </div>

      <table className="slate-spec__table">
        <tbody>
          {ROWS.map((row) => (
            <tr key={row.label} className="slate-spec__row">
              <th scope="row" className="slate-spec__label">
                {row.label} <span lang="ko">{row.labelKo}</span>
              </th>
              <td className="slate-spec__value">
                {row.value.map((frag, i) =>
                  frag.key ? (
                    <strong key={i} className="slate-spec__key">
                      {frag.text}
                    </strong>
                  ) : frag.ko ? (
                    <span key={i} lang="ko">
                      {frag.text}
                    </span>
                  ) : (
                    <span key={i}>{frag.text}</span>
                  ),
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <p className="slate-spec__fine">
        Every figure above survives a caliper.{" "}
        <span lang="ko">캘리퍼스를 대 봐도 같은 숫자입니다.</span>
      </p>
    </section>
  );
}
