"use client";

/**
 * Section 04 — end of the launch. The sign-off line (the sky closes, the
 * work continues), the company's coordinates and duty desk, and the way
 * back to the top. Links carry the entry's violet :focus-visible ring.
 *
 * The footer sits over the mesh still drifting — the page does not end on a
 * hard line, it ends by fading into the same living sky it opened on.
 */
export default function AuroraFooter() {
  return (
    <footer className="aurora-footer" aria-label="Aurora sign-off">
      <p className="aurora-footer__signoff" data-reveal>
        The sky keeps moving. So does the work.
        <span lang="ko" className="aurora-footer__ko">
          하늘은 계속 움직인다. 일도 그렇다.
        </span>
      </p>

      <dl className="aurora-footer__data" data-reveal>
        <div>
          <dt>MADE BY</dt>
          <dd>Aurora Labs — 서울 · San Francisco</dd>
        </div>
        <div>
          <dt>BETA</dt>
          <dd>
            <a
              className="aurora-link"
              href="mailto:hello@aurora.example"
            >
              hello@aurora.example
            </a>
          </dd>
        </div>
        <div>
          <dt>WRITE-UP</dt>
          <dd>
            <a
              className="aurora-link"
              href="https://aurora.example/changelog"
            >
              changelog · <span lang="ko">변경 이력</span>
            </a>
          </dd>
        </div>
        <div>
          <dt>STATUS</dt>
          <dd>
            <span className="aurora-footer__live" aria-hidden="true" />
            all systems breathing ·{" "}
            <span lang="ko">모든 시스템 숨 쉬는 중</span>
          </dd>
        </div>
      </dl>

      <p className="aurora-footer__nav" data-reveal>
        <a className="aurora-link" href="#aurora-top">
          back to the sky ↑ · <span lang="ko">다시 하늘로</span>
        </a>
      </p>

      <p className="aurora-footer__copy" data-reveal>
        © 2026 AURORA — a product that breathes, on purpose.
        <span lang="ko" className="aurora-footer__ko">
          의도적으로 숨 쉬는 제품.
        </span>
      </p>
    </footer>
  );
}
