"use client";

/**
 * The studio's back page — set like a quiet card at the door: the studio's
 * standing note, the practical ledger (location, hours, the four daily
 * classes, booking), and the two working links (reserve, back to the top),
 * both carrying the soft clay underline that grows from the left.
 *
 * The studio note is the page's coda — the place where the premise is
 * said plainly, once, in both languages. Nothing sells. Nothing shouts.
 */
export default function StudioFooter() {
  return (
    <footer
      id="st-studio"
      className="stretch-studio"
      aria-labelledby="st-studio-title"
    >
      <header className="stretch-studio__head" data-reveal>
        <p className="stretch-kicker">
          <span lang="ko">스튜디오</span> · The Studio
        </p>
        <h2 id="st-studio-title" className="stretch-studio__title" lang="ko">
          늘어남, 한 자루의 연필처럼
        </h2>
        <p className="stretch-studio__sub">
          Lengthening, the way a pencil lengthens — what you sharpen away is not what you lose
        </p>
      </header>

      <div className="stretch-studio__note" data-reveal>
        <p className="stretch-studio__p stretch-studio__p--ko" lang="ko">
          우리는 몸을 부수러뜨리지 않는다. 자르지도, 구부리지도 않는다. 다만,
          이미 거기 있던 길이를 찾아준다. 오래 앉아 숨이 죽은 어깨, 잊고 지낸
          옆구리, 한쪽으로만 쓰던 허리 — 그것들이 제자리로 천천히 돌아가는 데
          필요한 시간을, 우리는 드린다.
        </p>
        <p className="stretch-studio__p stretch-studio__p--en">
          We do not break the body. We do not cut it, do not bend it. We only
          find the length that was already there. The shoulder that shortened
          from years of sitting, the flank you forgot, the lower back that
          learned to favor one side — we give those the time they need to
          come home, slowly.
        </p>
        <p className="stretch-studio__p stretch-studio__p--ko" lang="ko">
          그래서 수업은 느리다. 스무 분이면 되는 것을 사십오 분에 한다. 빠른
          쪽이 이기는 곳이 아니라, 긴 쪽이 남는 곳. 이 스튜디오는 늘어나는
          연습을 하는 곳이다.
        </p>
        <p className="stretch-studio__p stretch-studio__p--en">
          So the classes are slow. We take forty-five minutes for what twenty
          could do. This is not a place where the fast win; it is a place
          where the long remain. This studio is a practice in lengthening.
        </p>
      </div>

      <dl className="stretch-studio__ledger" data-reveal>
        <div>
          <dt>
            <span lang="ko">자리</span> · Location
          </dt>
          <dd>
            <span lang="ko">서울 성수동, 연무장길 23</span> — Seongsu-dong,
            Seoul
          </dd>
        </div>
        <div>
          <dt>
            <span lang="ko">시간</span> · Hours
          </dt>
          <dd>
            <span lang="ko">매일, 아침 여섯시 — 밤 열시</span> — Daily, 06:00
            – 22:00
          </dd>
        </div>
        <div>
          <dt>
            <span lang="ko">네 개의 수업</span> · Four Classes
          </dt>
          <dd>
            <span lang="ko">새벽 늘리기</span> · Dawn Reach{" "}
            <span aria-hidden="true"> · </span>
            <span lang="ko">점심 숨</span> · Midday Breath{" "}
            <span aria-hidden="true"> · </span>
            <span lang="ko">저녁 풀기</span> · Evening Release{" "}
            <span aria-hidden="true"> · </span>
            <span lang="ko">밤 천천히</span> · Slow Night
          </dd>
        </div>
        <div>
          <dt>
            <span lang="ko">예약</span> · Reserve
          </dt>
          <dd>
            <a className="stretch-link" href="mailto:breathe@stretch.studio">
              breathe@stretch.studio
            </a>
          </dd>
        </div>
      </dl>

      <div className="stretch-studio__end" data-reveal>
        <p className="stretch-studio__legal">
          © 2026 <span lang="ko">늘어남</span> —{" "}
          <span lang="ko">남은 것은 숨 한 모금.</span> What remains is one
          breath.
        </p>
        <p className="stretch-studio__top">
          <a className="stretch-link" href="#stretch-top">
            <span lang="ko">처음으로</span> · Back to the top
          </a>
        </p>
      </div>
    </footer>
  );
}
