"use client";

import { CHAPTERS } from "./chapters";

/**
 * The colophon — the book's last leaf, where a real book names itself.
 *
 * A publisher's statement set as a ledger (format, fonts, printer, run,
 * printing date), the closing words, and the back-cover sign-off. Every
 * spread is read by now; the colophon sets the book down. Fully static, fully
 * present without JavaScript.
 */
export default function Colophon() {
  return (
    <footer className="chapter-colophon" aria-label="Colophon · 판권">
      <div className="chapter-colophon__inner">
        <header className="chapter-colophon__head" data-reveal>
          <p className="chapter-kicker chapter-kicker--colophon">
            <span lang="ko">판권</span>
            <span aria-hidden="true"> · </span>
            COLOPHON
          </p>
          <h2 className="chapter-colophon__title" lang="ko">
            시간의 책
          </h2>
          <p className="chapter-colophon__title-en">The Book of Hours</p>
        </header>

        <p className="chapter-colophon__statement" data-reveal>
          <span lang="ko">
            이 책은 하루를 여섯때로 나누어, 한때마다 한 장을 펼친다. 새벽에
            열리고, 밤에 닫힌다. 그 사이에 읽은 것은 종이 위에 자국으로 남고,
            그 자국이 내일 다시 책을 열게 한다.
          </span>
        </p>

        <dl className="chapter-colophon__ledger" data-reveal>
          <div className="chapter-colophon__row">
            <dt>
              <span lang="ko">판형</span> · Format
            </dt>
            <dd lang="ko">단행본, 105 × 148mm</dd>
          </div>
          <div className="chapter-colophon__row">
            <dt>
              <span lang="ko">본문</span> · Body
            </dt>
            <dd lang="ko">노토 세리프 KR · 인터</dd>
          </div>
          <div className="chapter-colophon__row">
            <dt>
              <span lang="ko">지</span> · Paper
            </dt>
            <dd lang="ko">오래된 종이, 결이 있는 한 장</dd>
          </div>
          <div className="chapter-colophon__row">
            <dt>
              <span lang="ko">장</span> · Hours
            </dt>
            <dd lang="ko">{CHAPTERS.length}때 — 새벽에서 밤까지</dd>
          </div>
          <div className="chapter-colophon__row">
            <dt>
              <span lang="ko">인쇄일</span> · Printed
            </dt>
            <dd lang="ko">2026년, 한 해의 한때</dd>
          </div>
        </dl>

        <div className="chapter-colophon__end" data-reveal>
          <p className="chapter-colophon__legal">
            © 2026 CHAPTER · <span lang="ko">시간의 책</span> · MIT
          </p>
          <p className="chapter-colophon__closing" lang="ko">
            천천히 읽어라 — 시간은 기다린다.
          </p>
        </div>
      </div>
    </footer>
  );
}
