"use client";

import SealMark from "./SealMark";

/**
 * Section 05 — 콜로폰 / colophon. A minhwa gallery's sign-off: what minhwa is
 * (그림으로 빈 소원을 채우는 오래된 마음), where this gallery "is" (a fictional
 * folk-painting archive in Ikseon-dong), the obangsaek legend repeated as a
 * compact key, and a final 인장. Hairline rules, tabular numerals for the
 * years, the warm voice of the gallery holding to the last line.
 *
 * Every link carries the focus ring (the active obangsaek color when one is
 * selected, 적 by default). The final seal is decorative — the interactive
 * seal has already done its work in section 02.
 */
export default function FolkFooter() {
  return (
    <footer className="minhwa-foot" aria-labelledby="minhwa-foot-title">
      <div className="minhwa-sechead minhwa-foot__head" data-reveal>
        <span className="minhwa-sechead__no" lang="en" aria-hidden="true">
          05
        </span>
        <h2 className="minhwa-sechead__title" id="minhwa-foot-title">
          콜로폰{" "}
          <span className="minhwa-sechead__en" lang="en">
            colophon
          </span>
        </h2>
      </div>

      <div className="minhwa-foot__grid">
        <section className="minhwa-foot__col" data-reveal>
          <h3 className="minhwa-foot__col-h">민화란</h3>
          <p className="minhwa-foot__col-body">
            민화(民畵)는 조선 후기, 이름 없는 화공과 백성이 그린 그림이다.
            사대부의 문인화와 달리 거칠고, 넉넉하고, 뜻이 먼저다. 빈 것을
            그림으로 채우고, 두려운 것을 호랑이 한 마리로 물리치고, 오래 살고
            싶은 마음을 열 가지 상징에 담았다. 이 갤러리는 그 오래된 소원을
            오방색과 함께 다시 펼쳐 보인다.
          </p>
          <p className="minhwa-foot__col-body minhwa-foot__col-en" lang="en">
            Minhwa — &ldquo;the people&rsquo;s painting&rdquo; — is the folk art
            of late Joseon: rough, generous, meaning first. Where literati
            painting refined, minhwa wished. This gallery unfolds that old wish
            in the five directional colors.
          </p>
        </section>

        <section className="minhwa-foot__col" data-reveal>
          <h3 className="minhwa-foot__col-h">오방색 색인</h3>
          <ul className="minhwa-foot__obang">
            <li>
              <span className="minhwa-foot__dot minhwa-foot__dot--cheong" />
              청 · 동 · 봄 · 소나무
            </li>
            <li>
              <span className="minhwa-foot__dot minhwa-foot__dot--jeok" />
              적 · 남 · 여름 · 호랑이
            </li>
            <li>
              <span className="minhwa-foot__dot minhwa-foot__dot--hwang" />
              황 · 중앙 · 환절 · 해
            </li>
            <li>
              <span className="minhwa-foot__dot minhwa-foot__dot--baek" />
              백 · 서 · 가을 · 달
            </li>
            <li>
              <span className="minhwa-foot__dot minhwa-foot__dot--heuk" />
              흑 · 북 · 겨울 · 까치
            </li>
          </ul>
        </section>

        <section className="minhwa-foot__col" data-reveal>
          <h3 className="minhwa-foot__col-h">화랑</h3>
          <p className="minhwa-foot__ledger">
            <span lang="ko">익선동 민화 보존회</span>
            <span lang="en" className="minhwa-foot__ledger-en">
              Ikseon-dong Minhwa Archive
            </span>
          </p>
          <p className="minhwa-foot__addr">
            서울 종로구 돈화문로 11 가길
            <span lang="en" className="minhwa-foot__addr-en">
              11-ga, Donhwamun-ro, Jongno-gu, Seoul
            </span>
          </p>
          <p className="minhwa-foot__hours">
            <span lang="ko">화–일 · 10:00–18:00 · 월 휴관</span>
            <span lang="en" className="minhwa-foot__hours-en">
              Tue–Sun · 10:00–18:00 · closed Mondays
            </span>
          </p>
        </section>
      </div>

      <div className="minhwa-foot__sign" data-reveal>
        <div className="minhwa-foot__seal" aria-hidden="true">
          <SealMark chars={["民", "畵"]} />
        </div>
        <p className="minhwa-foot__signoff">
          그림 한 폭에 소원 하나.{" "}
          <span lang="en" className="minhwa-foot__signoff-en">
            One wish per painting.
          </span>
        </p>
        <p className="minhwa-foot__copy">
          © 2026 민화 · 익선동 민화 보존회 /{" "}
          <span lang="en">MINHWA · MIT code, CC BY 4.0 imagery</span>
        </p>
        <a className="minhwa-foot__top" href="#minhwa-top">
          <span lang="ko">처음으로</span>{" "}
          <span lang="en">back to the top</span>
        </a>
      </div>
    </footer>
  );
}
