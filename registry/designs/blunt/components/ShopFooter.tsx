"use client";

/**
 * Section 05 — the invitation, printed in reverse: ink block, paper type,
 * one acid-yellow mail button with the full hard-shadow press. The address
 * is fictional; the blue door is not negotiable.
 */
export default function ShopFooter() {
  return (
    <footer className="blunt-footer">
      <p className="blunt-footer__giant">
        COME PRINT WITH US <span lang="ko">와서 찍어</span>
      </p>

      <dl className="blunt-footer__grid">
        <div className="blunt-footer__cell">
          <dt className="blunt-footer__k">FIND US</dt>
          <dd className="blunt-footer__v">
            EULJIRO 3-GA, END OF THE ALLEY, BLUE DOOR, 2F{" "}
            <span lang="ko">서울 중구 을지로3가 골목 끝, 파란 문 2층</span>
          </dd>
        </div>
        <div className="blunt-footer__cell">
          <dt className="blunt-footer__k">HOURS</dt>
          <dd className="blunt-footer__v">
            12:00–20:00 · CLOSED WHEN RAINING{" "}
            <span lang="ko">비 오면 쉼</span>
          </dd>
        </div>
        <div className="blunt-footer__cell">
          <dt className="blunt-footer__k">TALK</dt>
          <dd className="blunt-footer__v">
            <a
              className="blunt-btn blunt-press blunt-footer__mail"
              href="mailto:press@blunt.works"
            >
              press@blunt.works
            </a>
          </dd>
        </div>
      </dl>

      <p className="blunt-footer__legal">
        © 2026 BLUNT PRINT WORKS — MADE OF INK AND SPITE.{" "}
        <span lang="ko">잉크와 깡으로 만듦.</span>
      </p>
    </footer>
  );
}
