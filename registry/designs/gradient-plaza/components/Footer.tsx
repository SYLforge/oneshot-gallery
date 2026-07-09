"use client";

/**
 * End of broadcast. The sign-off line gets the aberration treatment too —
 * one last neon smear on the way out — and the station data reads like the
 * fine print on a mall directory that nobody has updated since the mall
 * stopped existing during the day.
 */
export default function Footer() {
  return (
    <footer className="plaza-footer">
      <div className="plaza-footer__inner">
        <p
          className="plaza-footer__stay plaza-ab"
          data-text="STAY UNTIL CLOSING"
        >
          STAY UNTIL CLOSING
        </p>
        <p className="plaza-footer__stayko" lang="ko">
          폐점까지 머물러요
        </p>

        <dl className="plaza-footer__data">
          <div>
            <dt>STATION</dt>
            <dd>
              GRADIENT PLAZA · FM 88.8 ·{" "}
              <span lang="ko">그라디언트 플라자 — 미드나잇 몰 라디오</span>
            </dd>
          </div>
          <div>
            <dt>STUDIO</dt>
            <dd>
              Level 2, Fountain Court, Gradient Plaza Mall ·{" "}
              <span lang="ko">그라디언트 플라자 몰 2층, 분수 광장</span>
            </dd>
          </div>
          <div>
            <dt>HOURS</dt>
            <dd>
              00:00 – 06:00, or until the fountain falls asleep ·{" "}
              <span lang="ko">혹은 분수가 잠들 때까지</span>
            </dd>
          </div>
        </dl>

        <p className="plaza-footer__copy">
          © 2026 GRADIENT PLAZA — broadcasting to an empty food court.{" "}
          <span lang="ko">텅 빈 푸드코트를 향해 방송 중.</span>
        </p>
      </div>
    </footer>
  );
}
