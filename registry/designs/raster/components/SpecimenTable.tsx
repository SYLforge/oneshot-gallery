"use client";

type Status = "ok" | "star" | "dep" | "rev";

type Row = {
  no: string;
  columns: string;
  gutter: string;
  approved: string;
  status: Status;
  statusEn: string;
  statusKo: string;
};

const ROWS: Row[] = [
  {
    no: "01",
    columns: "04",
    gutter: "12",
    approved: "1957",
    status: "ok",
    statusEn: "approved",
    statusKo: "유효",
  },
  {
    no: "02",
    columns: "06",
    gutter: "16",
    approved: "1963",
    status: "ok",
    statusEn: "approved",
    statusKo: "유효",
  },
  {
    no: "03",
    columns: "08",
    gutter: "12",
    approved: "1968",
    status: "ok",
    statusEn: "approved",
    statusKo: "유효",
  },
  {
    no: "04",
    columns: "12",
    gutter: "24",
    approved: "1972",
    status: "star",
    statusEn: "still correct",
    statusKo: "지금도 유효함",
  },
  {
    no: "05",
    columns: "05",
    gutter: "18",
    approved: "1981",
    status: "dep",
    statusEn: "DEPRECATED",
    statusKo: "폐지",
  },
  {
    no: "06",
    columns: "16",
    gutter: "20",
    approved: "2011",
    status: "rev",
    statusEn: "under review",
    statusKo: "심사 중",
  },
];

const MARK: Record<Status, string> = {
  ok: "raster-status--ok",
  star: "raster-status--star",
  dep: "raster-status--dep",
  rev: "raster-status--rev",
};

/**
 * Section 03 — the registry. A real <table> with rule discipline: one 3px
 * ink rule on top, a 1.5px rule under the header, hairlines between rows.
 * Figures are Space Mono with tabular numerals; status marks are red
 * geometry (filled square, hollow square, cross) whose meaning is always
 * duplicated in black text beside them. Static on purpose — records do not
 * animate.
 */
export default function SpecimenTable() {
  return (
    <section className="raster-section" aria-labelledby="raster-reg-title">
      <div className="raster-frame">
        <header className="raster-sechead">
          <span className="raster-sechead__no" aria-hidden="true">
            03
          </span>
          <h2 className="raster-sechead__title" id="raster-reg-title">
            registry{" "}
            <span lang="ko" className="raster-sechead__ko">
              인증 그리드 등록부
            </span>
          </h2>
        </header>

        <div className="raster-grid">
          <div className="raster-tablewrap" data-flip>
            <table className="raster-table">
              <caption className="raster-mono">
                table 01 — certified grid systems, 1957–present ·{" "}
                <span lang="ko">표 01 — 인증 그리드, 1957–현재</span>
              </caption>
              <thead>
                <tr>
                  <th scope="col">grid no.</th>
                  <th scope="col" className="raster-td--num">
                    columns · <span lang="ko">단</span>
                  </th>
                  <th scope="col" className="raster-td--num">
                    gutter (px)
                  </th>
                  <th scope="col" className="raster-td--num">
                    approved · <span lang="ko">승인</span>
                  </th>
                  <th scope="col">
                    status · <span lang="ko">상태</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {ROWS.map((row) => (
                  <tr
                    key={row.no}
                    className={row.status === "dep" ? "raster-row--dep" : undefined}
                  >
                    <th scope="row" className="raster-mono">
                      {row.no}
                    </th>
                    <td className="raster-mono raster-td--num">{row.columns}</td>
                    <td className="raster-mono raster-td--num">{row.gutter}</td>
                    <td className="raster-mono raster-td--num">{row.approved}</td>
                    <td>
                      <span className={`raster-status ${MARK[row.status]}`}>
                        <i aria-hidden="true" />
                        {row.statusEn} — <span lang="ko">{row.statusKo}</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <p className="raster-table__note raster-mono">
              note — grid no. 05 was deprecated in 1998. odd column counts do
              not divide.{" "}
              <span lang="ko">
                비고 — 그리드 제5호는 1998년 폐지되었다. 홀수 단은 나누어지지
                않는다.
              </span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
