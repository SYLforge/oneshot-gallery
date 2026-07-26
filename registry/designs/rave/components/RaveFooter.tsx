"use client";

import { useReveal } from "../hooks/useReveal";

/**
 * Section 05 — the invitation, printed in reverse: a white block carrying
 * black type, the giant SEE YOU AT 22 shout, and the one electric-blue CTA.
 * The section wipes in from the left on enter. Address is fictional; the
 * blue door is the same one the map pointed at.
 */
export default function RaveFooter() {
  const ref = useReveal<HTMLElement>();

  return (
    <footer className="rave-footer rave-reveal rave-reveal--l" ref={ref}>
      <p className="rave-footer__giant">
        SEE YOU AT <span className="rave-footer__hl">22:00</span>
        <span className="rave-footer__ko" lang="ko">
          밤 10시에 보자
        </span>
      </p>

      <dl className="rave-footer__grid">
        <div className="rave-footer__cell">
          <dt className="rave-footer__k">FIND US</dt>
          <dd className="rave-footer__v">
            54 ITAEWON-RO, OLD PRINTWORKS, 2F/3F{" "}
            <span lang="ko">이태원로 54, 옛 인쇄소 2·3층</span>
          </dd>
        </div>
        <div className="rave-footer__cell">
          <dt className="rave-footer__k">RUNS</dt>
          <dd className="rave-footer__v">
            22:00–06:00 · 22 NOV 2099{" "}
            <span lang="ko">2099년 11월 22일 밤 10시–새벽 6시</span>
          </dd>
        </div>
        <div className="rave-footer__cell">
          <dt className="rave-footer__k">BOOK</dt>
          <dd className="rave-footer__v">
            <a
              className="rave-btn rave-press rave-footer__cta"
              href="mailto:wristband@rave2099.club"
            >
              WRISTBAND@RAVE2099.CLUB
            </a>
          </dd>
        </div>
      </dl>

      <p className="rave-footer__legal">
        © 2099 RAVE COLLECTIVE — SOUND FROM THE BASEMENT.{" "}
        <span lang="ko">지하에서 올라오는 소리.</span>
      </p>
    </footer>
  );
}
