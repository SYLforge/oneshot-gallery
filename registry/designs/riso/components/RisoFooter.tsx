"use client";

/**
 * Section 04 — the colophon. Printed in the press operator's voice: where
 * the press lives, when it runs, how to send a manuscript. The overprint
 * idea gets one last, larger statement — the "오버프린트 OVERPRINT" word
 * set in three multiplying plates — and a colophon block in the mono hand
 * lists the drums, the stock, and the type. Address is fictional.
 */
export default function RisoFooter() {
  return (
    <footer className="riso-footer" aria-labelledby="riso-footer-title">
      <h2 className="riso-vh" id="riso-footer-title">
        Colophon · 판권
      </h2>

      <p className="riso-footer__big">
        <span className="riso-overprint-word" data-text="오버프린트">
          <span className="riso-overprint-word__ink">오버프린트</span>
        </span>
        <span className="riso-overprint-word riso-overprint-word--en" data-text="OVERPRINT">
          <span className="riso-overprint-word__ink">OVERPRINT</span>
        </span>
      </p>

      <div className="riso-footer__cols">
        <section className="riso-footer__col">
          <h3 className="riso-footer__k">Find us</h3>
          <p className="riso-footer__v">
            14 Maponampo-gil, Seochon, Seoul{" "}
            <span lang="ko">서울 서촌 마포남포길 14, 2층 인쇄실</span>
          </p>
        </section>
        <section className="riso-footer__col">
          <h3 className="riso-footer__k">Hours</h3>
          <p className="riso-footer__v">
            Press Wed–Sat 13:00–21:00 · Cinema nightly 20:00{" "}
            <span lang="ko">인쇄 수–토, 상영은 매일 밤 여덟 시</span>
          </p>
        </section>
        <section className="riso-footer__col">
          <h3 className="riso-footer__k">Manuscripts</h3>
          <p className="riso-footer__v">
            <a className="riso-link riso-link--footer" href="mailto:press@riso.press">
              press@riso.press
            </a>
            <br />
            <span lang="ko">원고는 한 권씩만.</span> One manuscript at a time.
          </p>
        </section>
        <section className="riso-footer__col">
          <h3 className="riso-footer__k">Colophon</h3>
          <p className="riso-footer__v riso-footer__mono">
            DRUMS · FLUO PINK / RISO BLUE / RISO YELLOW{" "}
            <span lang="ko">3도</span>
            <br />
            STOCK · UNCOATED 120G{" "}
            <span lang="ko">무광 120g</span>
            <br />
            TYPE · NOTO SERIF KR + LORA{" "}
            <span lang="ko">본문 세리프</span>
          </p>
        </section>
      </div>

      <p className="riso-footer__legal">
        © 2026 RISO PRESS — PRINTED BY HAND, OVERLAPPED ON PURPOSE.{" "}
        <span lang="ko">손으로 찍고, 일부러 겹쳤다.</span>
      </p>
    </footer>
  );
}
