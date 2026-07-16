"use client";

/**
 * Chapter 06 — the service panel. Where the page finally answers the
 * practical questions a real visitor would have: when do you run, where do
 * you run, how do I order. The cold UI resumes after the warm handoff, but
 * the operating hours (밤 10시 – 새벽 4시) are set in steel, not amber —
 * the warm note was a chapter, not a colour scheme.
 *
 * Nothing here is interactive in the JS sense — every line is plain,
 * readable DOM. The CTA is a mailto link, the operating hours are facts,
 * the coverage is a list. Reduced motion and no-JS readers get exactly the
 * same page.
 */
export default function ServiceFooter() {
  return (
    <section
      className="moonlit-service"
      aria-labelledby="moonlit-service-title"
    >
      <div className="moonlit-service__inner">
        <p className="moonlit-eyebrow moonlit-mono" data-reveal aria-hidden="true">
          CH. 06 — 운영 안내 · HOURS & COVERAGE
        </p>
        <h2 className="moonlit-sechead" id="moonlit-service-title" data-reveal>
          We run when the city does not{" "}
          <span lang="ko" className="moonlit-sechead__ko">
            도시가 쉬는 시간에 움직입니다
          </span>
        </h2>

        <div className="moonlit-service__grid">
          <div className="moonlit-service__cell" data-reveal>
            <p className="moonlit-service__cellk moonlit-mono">운영 시간</p>
            <p className="moonlit-service__cellv">
              <span lang="ko">밤 10시 — 새벽 4시</span>
              <span className="moonlit-service__cellen moonlit-mono">
                22:00 — 04:00
              </span>
            </p>
            <p className="moonlit-service__celln" lang="ko">
              매일, 공휴일에도. 다만, 설날과 추석은 쉽니다 — 그날만큼은,
              우리도 집에서.
            </p>
            <p className="moonlit-service__celln-en">
              Every night, holidays included. We do close on Seollal and
              Chuseok — even us, even then, we go home.
            </p>
          </div>

          <div className="moonlit-service__cell" data-reveal>
            <p className="moonlit-service__cellk moonlit-mono">배달 가능 지역</p>
            <p className="moonlit-service__cellv">
              <span lang="ko">서울 · 47동</span>
              <span className="moonlit-service__cellen moonlit-mono">
                SEOUL · 47 NEIGHBORHOODS
              </span>
            </p>
            <p className="moonlit-service__celln" lang="ko">
              한강 이북, 2시 이후에도 불이 켜지는 동네. 그 밖의 동네는
              조만안 늘어납니다 — 잠들지 않는 사람이 늘어나는 속도로.
            </p>
            <p className="moonlit-service__celln-en">
              North of the river, every neighbourhood with at least one lamp
              on past 2 AM. The list grows as fast as the city stops sleeping.
            </p>
          </div>

          <div className="moonlit-service__cell" data-reveal>
            <p className="moonlit-service__cellk moonlit-mono">주문 방법</p>
            <p className="moonlit-service__cellv">
              <span lang="ko">앱 또는 전화</span>
              <span className="moonlit-service__cellen moonlit-mono">
                APP · PHONE
              </span>
            </p>
            <p className="moonlit-service__celln" lang="ko">
              앱이 열리지 않는 밤에는, 전화 한 통이면 충분합니다. 새벽 세
              시의 목소리도, 우리는 받습니다.
            </p>
            <p className="moonlit-service__celln-en">
              On nights the app will not open, one phone call is enough.
              We pick up at 3 AM, too.
            </p>
          </div>
        </div>

        <div className="moonlit-service__cta" data-reveal>
          <a
            className="moonlit-service__btn"
            href="tel:+82-2-1333-2407"
          >
            <span className="moonlit-service__btnline moonlit-mono">
              CALL TO ORDER · 02-1333-2407
            </span>
            <span className="moonlit-service__btnline moonlit-service__btnline--ko" lang="ko">
              주문하기 · 전화 한 통
            </span>
          </a>
          <a
            className="moonlit-service__btn moonlit-service__btn--ghost"
            href="mailto:night@moonlit.delivery"
          >
            <span className="moonlit-service__btnline moonlit-mono">
              NIGHT@MOONLIT.DELIVERY
            </span>
            <span className="moonlit-service__btnline moonlit-service__btnline--ko" lang="ko">
              문의 — 언제든
            </span>
          </a>
        </div>
      </div>

      <footer className="moonlit-footer">
        <div className="moonlit-footer__grid">
          <p className="moonlit-footer__brand">
            <span lang="ko">달빛 배달</span>
            <span className="moonlit-footer__branden moonlit-mono">
              MOONLIT · LATE-NIGHT DELIVERY
            </span>
          </p>
          <p className="moonlit-footer__meta moonlit-mono">
            <span lang="ko">서울특별시 마포구</span> · SEOUL, MAPO
          </p>
          <p className="moonlit-footer__meta moonlit-mono">
            EST. 2024 · 47 RIDERS
          </p>
        </div>
        <p className="moonlit-footer__koan" lang="ko">
          도시가 잠든 시간에, 잠들지 못한 당신에게.
        </p>
        <p className="moonlit-footer__koan-en">
          To you, still awake, while the city sleeps.
        </p>
        <div className="moonlit-footer__base">
          <p className="moonlit-footer__copy moonlit-mono">
            © 2026 MOONLIT · <span lang="ko">달빛 배달</span> — for the other half of the city
          </p>
          <a className="moonlit-footer__top moonlit-mono" href="#moonlit-top">
            BACK TO CHAPTER 01 · <span lang="ko">처음으로</span>
          </a>
        </div>
      </footer>
    </section>
  );
}
