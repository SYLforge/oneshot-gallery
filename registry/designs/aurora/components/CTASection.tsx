"use client";

/**
 * Section 03 — the manifesto + CTA. A short, declarative statement of what
 * Aurora is for, set over the still-drifting mesh, then the primary access
 * request and a small log of who is already inside. The fiction is a product
 * that names its own principle ("a tool should breathe, and let you") —
 * the manifesto is the page's thesis, the gradient its proof.
 *
 * Marked up so it reads cleanly without JS and without scroll choreography.
 */
export default function CTASection() {
  return (
    <section
      id="manifesto"
      className="aurora-cta"
      aria-labelledby="aurora-manifesto-title"
    >
      <div className="aurora-cta__inner">
        <p className="aurora-section__no" data-reveal aria-hidden="true">
          03
        </p>
        <h2
          className="aurora-cta__title"
          id="aurora-manifesto-title"
          data-reveal
        >
          A tool should breathe — and then get out of your way.
          <span lang="ko" className="aurora-cta__title-ko">
            도구는 스스로 숨 쉬어야 하고, 그 다음에는 길을 비켜야 한다.
          </span>
        </h2>

        <p className="aurora-cta__body" data-reveal>
          Most software holds still and asks you to do the moving. Aurora
          holds the moving and lets you be still: the gradient behind this
          paragraph is the whole pitch. The surface is alive so your thinking
          does not have to fight a dead one. We are not building a faster
          notepad; we are building the quietest room a product team has ever
          worked in.
          <span lang="ko" className="aurora-cta__body-ko">
            대부분의 소프트웨어는 가만히 서서 당신이 움직이라고 한다. 오로라는
            움직임을 갖고 있고 당신이 고요할 수 있게 한다. 이 문단 뒤의
            그라디언트가 곧 전부다. 표면이 살아 있기에 당신의 생각이 죽은
            표면과 싸우지 않아도 된다. 우리는 더 빠른 메모장을 짓는 게 아니라,
            프로덕트 팀이 일해 본 가장 조용한 방을 짓는다.
          </span>
        </p>

        <div className="aurora-cta__actions" data-reveal>
          <a
            className="aurora-btn aurora-btn--primary aurora-btn--lg"
            href="#aurora-top"
            data-tilt
          >
            Request access
            <span lang="ko" className="aurora-btn__ko">
              액세스 요청
            </span>
          </a>
          <span className="aurora-cta__note">
            We open ~40 seats a week. No credit card, no waitlist maze. ·{" "}
            <span lang="ko">주당 약 40석을 연다. 카드도, 미로 같은 대기열도 없다.</span>
          </span>
        </div>

        <dl className="aurora-cta__log" data-reveal>
          <div>
            <dt>BETA COHORT</dt>
            <dd>
              312 teams ·{" "}
              <span lang="ko">312개 팀</span>
            </dd>
          </div>
          <div>
            <dt>SHIPPED THIS MONTH</dt>
            <dd>
              1,084 releases ·{" "}
              <span lang="ko">1,084회 릴리스</span>
            </dd>
          </div>
          <div>
            <dt>AVG. TIME TO FIRST TASK</dt>
            <dd>
              4 minutes ·{" "}
              <span lang="ko">평균 4분</span>
            </dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
