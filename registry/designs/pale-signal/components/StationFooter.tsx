"use client";

/** Section 05 — sign-off log line, station data, and the closing sentence. */
export default function StationFooter() {
  return (
    <footer className="ps-footer" aria-labelledby="ps-footer-title">
      <div className="ps-sechead" data-reveal>
        <span className="ps-sechead__no" aria-hidden="true">
          05
        </span>
        <h2 className="ps-sechead__title" id="ps-footer-title">
          end of watch{" "}
          <span lang="ko" className="ps-sechead__ko">
            관측 종료
          </span>
        </h2>
      </div>

      <p className="ps-footer__line" data-reveal>
        <span className="ps-footer__time">06:00 KST</span> — end of watch. tape
        sealed, dated, shelved.{" "}
        <span lang="ko">테이프를 봉인해 날짜를 적고, 선반에 올린다.</span>
      </p>

      <dl className="ps-footer__data" data-reveal>
        <div>
          <dt>station</dt>
          <dd>
            N 37°26′31″ · E 128°39′26″ · 1,178 m{" "}
            <span lang="ko">— 능선 위, 소나무들 사이</span>
          </dd>
        </div>
        <div>
          <dt>ref</dt>
          <dd>1420.4057 MHz — the hydrogen line</dd>
        </div>
        <div>
          <dt>beacon</dt>
          <dd>PSG-3 · 3.1415 MHz · dusk to dawn</dd>
        </div>
        <div>
          <dt>contact</dt>
          <dd>
            <a className="ps-link" href="mailto:ops@pale.signal">
              ops@pale.signal
            </a>{" "}
            — replies within one sidereal day
          </dd>
        </div>
      </dl>

      <p className="ps-footer__copy" data-reveal>
        © 2026 pale.signal — the sky keeps talking.{" "}
        <span lang="ko">하늘은 계속 말한다.</span>
      </p>

      <p className="ps-footer__nav" data-reveal>
        <a className="ps-link" href="#ps-top">
          ▲ reboot from the top — <span lang="ko">처음부터 다시</span>
        </a>
      </p>
    </footer>
  );
}
