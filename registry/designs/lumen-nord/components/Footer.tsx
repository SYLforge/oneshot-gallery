"use client";

/**
 * Section 04 — end of watch. The sign-off line, both stations' coordinates,
 * the duty desk, and the way back up to the sky. Links carry the entry's
 * aurora-green :focus-visible ring.
 */
export default function Footer() {
  return (
    <footer className="lumen-footer" aria-label="Station sign-off">
      <p className="lumen-footer__signoff" data-reveal>
        03:40 KST — curtain closed. The archive is one night heavier.
        <span lang="ko" className="lumen-footer__ko">
          03:40 — 커튼이 닫혔다. 아카이브는 하룻밤만큼 무거워졌다.
        </span>
      </p>

      <dl className="lumen-footer__data" data-reveal>
        <div>
          <dt>STATION</dt>
          <dd>Nordfjell Ridge — 69°17′ N · 16°01′ E · 412 m a.s.l.</dd>
        </div>
        <div>
          <dt>OFFICE</dt>
          <dd>
            <span lang="ko">서울 하늘기록소</span> — 37°34′ N · 126°58′ E
          </dd>
        </div>
        <div>
          <dt>GEOMAG</dt>
          <dd>66.4° N geomagnetic — under the oval most clear nights</dd>
        </div>
        <div>
          <dt>DUTY</dt>
          <dd>
            <a className="lumen-link" href="mailto:night@lumen-nord.example">
              night@lumen-nord.example
            </a>
          </dd>
        </div>
      </dl>

      <p className="lumen-footer__nav" data-reveal>
        <a className="lumen-link" href="#lumen-top">
          back to the sky ↑ · <span lang="ko">다시 하늘로</span>
        </a>
      </p>

      <p className="lumen-footer__copy" data-reveal>
        © 2026 LUMEN NORD — the sky files its report at dawn.
        <span lang="ko" className="lumen-footer__ko">
          새벽에 하늘이 보고서를 제출한다.
        </span>
      </p>
    </footer>
  );
}
