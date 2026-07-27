"use client";

import ChromeButton from "./ChromeButton";

/**
 * The sign-off. A holographic-foil sign with the house call, a fictional
 * Seongsu-dong address (the chrome-beauty district), the motto, and a
 * chrome button back to the top. The foil rests in its neutral rainbow
 * state on touch / reduced motion.
 */
export default function ChromeFooter() {
  return (
    <footer className="chrome-footer" aria-labelledby="chrome-footer-title">
      <div className="chrome-footer__sign" data-reveal="fade">
        <p className="chrome-footer__eyebrow">stay metallic · 금속으로 남아</p>
        <h2 id="chrome-footer-title" className="chrome-footer__call">
          Pour yourself{" "}
          <span lang="ko" className="chrome-footer__callko">
            를 붓다
          </span>
        </h2>
        <p className="chrome-footer__line">
          The counter is open from the first light to the last reflection.{" "}
          <span lang="ko" className="chrome-footer__lineko">
            카운터는 첫 빛부터 마지막 반사까지 열려 있다.
          </span>
        </p>
        <div className="chrome-footer__cta">
          <ChromeButton href="#chrome-top" ariaLabel="Back to the top — 처음으로">
            back to chrome <span lang="ko">처음으로</span>
          </ChromeButton>
        </div>
      </div>

      <div className="chrome-footer__rule" aria-hidden="true" />

      <address className="chrome-footer__address" data-reveal="fade">
        CHROME counter — 2F, a chrome-fronted building on Seongsu-dong-ro,
        Seongdong-gu, Seoul
        <br />
        <span lang="ko">서울 성동구 성수동로, 크롬 외벽의 건물 2층</span>
        <br />
        first light to last reflection, daily{" "}
        <span lang="ko">첫 빛부터 마지막 반사까지 · 매일</span>
        <br />
        <a className="chrome-link" href="mailto:counter@chrome.kr">
          counter@chrome.kr
        </a>
      </address>

      <p className="chrome-footer__legal" data-reveal="fade">
        © 2026 CHROME — poured as metal, worn as light.{" "}
        <span lang="ko">금속으로 붓고, 빛으로 입는다.</span>
      </p>
    </footer>
  );
}
