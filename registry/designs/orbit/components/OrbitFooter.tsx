"use client";

/**
 * Section 04 — release notes. The studio's sign-off, the full spec sheet,
 * a release calendar, and the way back to the top. Every line is bilingual;
 * Korean is first-class, never a caption. The spec sheet is a real `<dl>`
 * so it reads as data, not decoration.
 */
export default function OrbitFooter() {
  return (
    <footer className="orbit-footer" aria-label="Release notes">
      <p className="orbit-footer__signoff" data-reveal>
        ORBIT 001 ships when the studio is satisfied it is the only shoe in
        the room. Until then, this page is the room.
        <span lang="ko" className="orbit-footer__ko">
          오르빗 001은 스튜디오가 “방에 신발이 하나뿐이다”에 만족할 때
          나간다. 그 전까지, 이 페이지가 곧 그 방이다.
        </span>
      </p>

      <dl className="orbit-footer__spec" data-reveal>
        <div>
          <dt>LAST</dt>
          <dd>Halla-7 · <span lang="ko">할라-7 라스트</span></dd>
        </div>
        <div>
          <dt>UPPER</dt>
          <dd>Engineered knit, TPU saddle · <span lang="ko">니트 + TPU 새들</span></dd>
        </div>
        <div>
          <dt>MIDSOLE</dt>
          <dd>PEBA foam, 14 mm heel / 8 mm forefoot · <span lang="ko">PEBA 폼, 뒤 14·앞 8mm</span></dd>
        </div>
        <div>
          <dt>OUTSOLE</dt>
          <dd>Carbon rubber, 4.2 mm · <span lang="ko">카본 고무, 4.2mm</span></dd>
        </div>
        <div>
          <dt>MASS</dt>
          <dd>238 g (men’s 9) · <span lang="ko">238그램 (270mm)</span></dd>
        </div>
        <div>
          <dt>DROP</dt>
          <dd>6 mm · <span lang="ko">드롭 6mm</span></dd>
        </div>
      </dl>

      <div className="orbit-footer__calendar" data-reveal>
        <h3 className="orbit-footer__cal-title">
          Release calendar{" "}
          <span lang="ko" className="orbit-section__ko">
            릴리즈 캘린더
          </span>
        </h3>
        <ul className="orbit-footer__cal-list">
          <li>
            <span className="orbit-footer__cal-date">2026.09</span>
            <span className="orbit-footer__cal-name">Ember — members</span>
            <span className="orbit-footer__cal-name orbit-footer__cal-ko" lang="ko">
              엠버 — 멤버 한정
            </span>
          </li>
          <li>
            <span className="orbit-footer__cal-date">2026.10</span>
            <span className="orbit-footer__cal-name">Ocean — general</span>
            <span className="orbit-footer__cal-name orbit-footer__cal-ko" lang="ko">
              오션 — 일반
            </span>
          </li>
          <li>
            <span className="orbit-footer__cal-date">2026.11</span>
            <span className="orbit-footer__cal-name">Frost — invite</span>
            <span className="orbit-footer__cal-name orbit-footer__cal-ko" lang="ko">
              프로스트 — 초청
            </span>
          </li>
        </ul>
      </div>

      <p className="orbit-footer__nav" data-reveal>
        <a className="orbit-link" href="#orbit-top">
          back to the turntable ↑ · <span lang="ko">턴테이블로</span>
        </a>
      </p>

      <p className="orbit-footer__copy" data-reveal>
        © 2026 ORBIT STUDIO — 한 번에 하나의 실루엣.
        <span lang="ko" className="orbit-footer__ko">
          one silhouette at a time.
        </span>
      </p>
    </footer>
  );
}
