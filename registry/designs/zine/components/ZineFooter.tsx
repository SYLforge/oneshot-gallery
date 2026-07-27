"use client";

import ZineLink from "./ZineLink";

/**
 * The colophon — the back-of-book masthead page, set dense like a zine's
 * credits: publisher, editors, the print run, the type credits, the
 * zine's manifesto line, and two working links (subscribe mailto, back to
 * the cover), both carrying the highlighter-stroke underline.
 *
 * The folio repeats NO. 32 in the red stamp red, the rubber-stamp
 * register of a photocopied zine.
 */
export default function ZineFooter() {
  return (
    <footer className="zine-colophon" aria-labelledby="zine-colophon-title">
      <div className="zine-colophon__inner">
        <header className="zine-colophon__head" data-reveal>
          <p className="zine-kicker">
            <span lang="ko">판권</span> · Colophon
          </p>
          <h2 id="zine-colophon-title" className="zine-colophon__title" lang="ko">
            잡지
          </h2>
          <p className="zine-colophon__statement">
            <span lang="ko">
              잡지는 매월, 홍대 지하실에서 인쇄된다. 두 도수, 천 부 한정.
            </span>{" "}
            <span className="zine-colophon__statement-en">
              ZINE is printed monthly, in a Hongdae basement. Two colors,
              one thousand copies, no second run.
            </span>
          </p>
        </header>

        <dl className="zine-colophon__ledger" data-reveal>
          <div className="zine-colophon__row">
            <dt>
              <span lang="ko">발행</span> · Publisher
            </dt>
            <dd>
              <span lang="ko">복사기사, 서울</span> — Copy Shop Press, Seoul
            </dd>
          </div>
          <div className="zine-colophon__row">
            <dt>
              <span lang="ko">발행인</span> · Editor-in-chief
            </dt>
            <dd>
              <span lang="ko">노지현</span> — Noh Ji-hyun
            </dd>
          </div>
          <div className="zine-colophon__row">
            <dt>
              <span lang="ko">편집</span> · Editors
            </dt>
            <dd>
              <span lang="ko">임하은 · 박지우 · 서다인</span> — Lim Ha-eun ·
              Park Ji-woo · Seo Da-in
            </dd>
          </div>
          <div className="zine-colophon__row">
            <dt>
              <span lang="ko">인쇄</span> · Print
            </dt>
            <dd>
              <span lang="ko">리소 2도, 콩기름 잉크</span> — Risograph, two-color,
              soy ink
            </dd>
          </div>
          <div className="zine-colophon__row">
            <dt>
              <span lang="ko">부수</span> · Run
            </dt>
            <dd>
              <span lang="ko">1,000부 한정</span> — 1,000 copies, no reprint
            </dd>
          </div>
          <div className="zine-colophon__row">
            <dt>
              <span lang="ko">활자</span> · Type
            </dt>
            <dd>
              <span lang="ko">본문 — 노토 세리프 KR</span> · Oswald (display)
            </dd>
          </div>
          <div className="zine-colophon__row">
            <dt>
              <span lang="ko">구독</span> · Subscribe
            </dt>
            <dd>
              <ZineLink href="mailto:press@zine.diy">press@zine.diy</ZineLink>
            </dd>
          </div>
        </dl>

        <div className="zine-colophon__end" data-reveal>
          <p className="zine-colophon__legal">
            © 2026 <span lang="ko">잡지</span> —{" "}
            <span lang="ko">화면은 꺼진다. 종이는 남는다.</span> The screen goes
            dark. The paper stays.
          </p>
          <p className="zine-colophon__top">
            <ZineLink href="#zine-top">
              <span lang="ko">처음으로</span> · Back to the cover ↑
            </ZineLink>
          </p>
        </div>
      </div>
    </footer>
  );
}
