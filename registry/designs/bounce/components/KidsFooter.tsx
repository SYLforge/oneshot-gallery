"use client";

import { useSpringPress } from "../hooks/useSpring";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

/**
 * The goodbye. A plum block with a giant bouncing sign-off "또 놀러와요 ·
 * come bounce again" whose glyphs spring up letter-by-letter, the studio's
 * made-up address, and a spring-press mail button. The plum surface uses
 * white type (5.77:1) so the footer reads as the night-side of the
 * picture book — the same shapes, lights off.
 */
export default function KidsFooter() {
  const reduced = usePrefersReducedMotion();
  const mailRef = useSpringPress<HTMLAnchorElement>(reduced);

  return (
    <footer className="bounce-foot" id="bounce-about">
      <p className="bounce-foot__bye" data-bounce-text aria-label="또 놀러와요 — come bounce again">
        <span lang="ko">또 놀러와요</span>
      </p>
      <p className="bounce-foot__bye-en">come bounce again</p>

      <dl className="bounce-foot__grid">
        <div className="bounce-foot__cell">
          <dt className="bounce-foot__k">
            <span lang="ko">우리 집</span>
            <span className="bounce-foot__k-en">studio</span>
          </dt>
          <dd className="bounce-foot__v">
            <span lang="ko">서울 마포구, 동그란 문 2층</span>
            <span className="bounce-foot__v-en">
              Mapo, Seoul — the round door, 2F
            </span>
          </dd>
        </div>
        <div className="bounce-foot__cell">
          <dt className="bounce-foot__k">
            <span lang="ko">이야기 시간</span>
            <span className="bounce-foot__k-en">story time</span>
          </dt>
          <dd className="bounce-foot__v">
            <span lang="ko">매주 토요일, 열 시 반</span>
            <span className="bounce-foot__v-en">
              every Saturday, 10:30 AM
            </span>
          </dd>
        </div>
        <div className="bounce-foot__cell">
          <dt className="bounce-foot__k">
            <span lang="ko">편지 주세요</span>
            <span className="bounce-foot__k-en">say hi</span>
          </dt>
          <dd className="bounce-foot__v">
            <a
              ref={mailRef}
              className="bounce-btn bounce-btn--spring bounce-btn--onplum"
              href="mailto:hi@bounce.kids"
            >
              hi@bounce.kids
            </a>
          </dd>
        </div>
      </dl>

      <p className="bounce-foot__legal">
        © 2026 <span lang="ko">통통</span> BOUNCE —{" "}
        <span lang="ko">작고 통통 이야기들.</span>{" "}
        <span>small stories that boing.</span>
      </p>
    </footer>
  );
}
