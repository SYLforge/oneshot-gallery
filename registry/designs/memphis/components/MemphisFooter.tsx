"use client";

import { Squiggle, Zigzag, Confetti, SpottedDisc } from "./Shapes";

/**
 * Section 03 — the invitation, printed on ink with the terrazzo mark.
 * Giant bilingual call, fictional Seoul address, the marigold mail CTA with
 * the press gesture, and one last scatter of shapes so the footer reads as
 * a composed poster rather than boilerplate.
 */
export default function MemphisFooter() {
  return (
    <footer className="mp-footer" aria-labelledby="mp-foot-title">
      <div className="mp-footer__shapes" aria-hidden="true">
        <Squiggle className="mp-footer__sh mp-footer__sh--s" tone="marigold" width={200} />
        <Zigzag className="mp-footer__sh mp-footer__sh--z" tone="coral" width={120} />
        <Confetti className="mp-footer__sh mp-footer__sh--d1" tone="teal" size={28} />
        <Confetti className="mp-footer__sh mp-footer__sh--d2" tone="marigold" size={20} />
        <SpottedDisc className="mp-footer__sh mp-footer__sh--disc" size={90} />
      </div>

      <p className="mp-footer__giant" id="mp-foot-title">
        <span lang="ko">함께 형태를 만들자</span>{" "}
        <span className="mp-footer__giant-en">let&apos;s build a shape</span>
      </p>

      <dl className="mp-footer__grid">
        <div className="mp-footer__cell">
          <dt className="mp-footer__k">
            <span lang="ko">위치</span> · FIND US
          </dt>
          <dd className="mp-footer__v">
            <span lang="ko">서울 성수동, 아치형 문 2층</span>
            <br />
            Seongsu-dong, Seoul — the arch door, 2F
          </dd>
        </div>
        <div className="mp-footer__cell">
          <dt className="mp-footer__k">
            <span lang="ko">시간</span> · HOURS
          </dt>
          <dd className="mp-footer__v">
            <span lang="ko">11:00–19:00 · 월요일 쉼</span>
            <br />
            11:00–19:00 · closed Mondays
          </dd>
        </div>
        <div className="mp-footer__cell">
          <dt className="mp-footer__k">
            <span lang="ko">연락</span> · TALK
          </dt>
          <dd className="mp-footer__v">
            <a
              className="mp-btn mp-btn--press mp-btn--footer"
              href="mailto:hello@memphis.studio"
            >
              hello@memphis.studio
            </a>
          </dd>
        </div>
      </dl>

      <p className="mp-footer__legal">
        © 2026 MEMPHIS STUDIO —{" "}
        <span lang="ko">도형으로 지은 이름.</span> Built with shapes, not
        images.
      </p>
    </footer>
  );
}
