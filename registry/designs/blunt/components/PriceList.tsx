"use client";

type Row = {
  item: string;
  itemKo?: string;
  spec: string;
  specKo?: string;
  price: string;
  note: string;
  noteKo: string;
  dead?: boolean;
};

const ROWS: Row[] = [
  {
    item: "POSTER B2",
    spec: "2C RISO",
    specKo: "무광",
    price: "₩12,000",
    note: "SMELLS LIKE INK",
    noteKo: "잉크 냄새 포함",
  },
  {
    item: "ZINE A5 · 24P",
    spec: "1C + FLUO RED",
    specKo: "중철",
    price: "₩8,000",
    note: "STAPLED BY HAND",
    noteKo: "스테이플도 손맛",
  },
  {
    item: "FLYER A5 ×1,000",
    spec: "1C",
    specKo: "재생지",
    price: "₩90,000",
    note: "LOUD IN BULK",
    noteKo: "뭉치로 시끄러움",
  },
  {
    item: "STICKER SHEET A4",
    spec: "2C",
    specKo: "칼선 없음",
    price: "₩6,000",
    note: "SCISSORS NOT INCLUDED",
    noteKo: "가위는 알아서",
  },
  {
    item: "CALENDAR 2026",
    spec: "3C",
    specKo: "벽걸이",
    price: "₩25,000",
    note: "",
    noteKo: "",
    dead: true,
  },
  {
    item: "BUSINESS CARD ×200",
    itemKo: "명함",
    spec: "2C",
    specKo: "쿠폰 아님",
    price: "₩30,000",
    note: "YOUR NAME, LOUD",
    noteKo: "이름도 시끄럽게",
  },
  {
    item: "MISPRINT BUNDLE",
    itemKo: "파본 묶음",
    spec: "RANDOM",
    specKo: "환불 없음",
    price: "₩5,000",
    note: "OUR MISTAKES, YOUR WALL",
    noteKo: "우리 실수, 당신 벽에",
  },
];

/**
 * Section 04 — the price list as a brutalist ledger: real `<table>`
 * semantics (explicit ARIA roles so the mobile re-grid can restyle rows
 * into stacked cards without the accessibility tree losing the table),
 * 3px rules, alternating paper/acid-yellow rows, one row struck through
 * and stamped SOLD OUT. Rows take a 3px press nudge on :active — 0ms in,
 * 90ms out, same anti-easing as the buttons.
 */
export default function PriceList() {
  return (
    <section
      className="blunt-section blunt-prices"
      id="blunt-prices"
      aria-labelledby="blunt-prices-title"
    >
      <div className="blunt-sechead">
        <span className="blunt-sechead__no" aria-hidden="true">
          02
        </span>
        <h2 className="blunt-sechead__title" id="blunt-prices-title">
          PRICE LIST <span lang="ko">가격표</span>
        </h2>
        <p className="blunt-sechead__note">
          NO HAGGLING. <span lang="ko">흥정 금지.</span>
        </p>
      </div>

      <table className="blunt-table" role="table">
        <thead role="rowgroup">
          <tr role="row">
            <th scope="col" role="columnheader">
              ITEM
            </th>
            <th scope="col" role="columnheader">
              SPEC
            </th>
            <th scope="col" role="columnheader">
              PRICE
            </th>
            <th scope="col" role="columnheader">
              NOTE
            </th>
          </tr>
        </thead>
        <tbody role="rowgroup">
          {ROWS.map((r) => (
            <tr
              key={r.item}
              role="row"
              className={r.dead ? "blunt-prow blunt-prow--dead" : "blunt-prow"}
            >
              <th scope="row" role="rowheader" className="blunt-prow__item">
                {r.item}
                {r.itemKo ? (
                  <span lang="ko" className="blunt-prow__itemko">
                    {" "}
                    {r.itemKo}
                  </span>
                ) : null}
              </th>
              <td role="cell" data-th="SPEC">
                {r.spec}
                {r.specKo ? <span lang="ko"> · {r.specKo}</span> : null}
              </td>
              <td role="cell" data-th="PRICE" className="blunt-prow__price">
                {r.price}
              </td>
              <td role="cell" data-th="NOTE" className="blunt-prow__note">
                {r.dead ? (
                  <span className="blunt-stamp">
                    SOLD OUT <span lang="ko">매진</span>
                  </span>
                ) : (
                  <>
                    {r.note} <span lang="ko">{r.noteKo}</span>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <p className="blunt-prices__fine">
        PRICES EXCLUDE VAT. INK SMELL IS FREE.{" "}
        <span lang="ko">부가세 별도, 잉크 냄새는 무료.</span>
      </p>
    </section>
  );
}
