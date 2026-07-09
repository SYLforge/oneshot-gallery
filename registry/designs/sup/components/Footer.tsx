"use client";

/**
 * The clearing at the end. An invitation, a place that is almost real,
 * and a sign-off that promises nothing except pace.
 */
export default function Footer() {
  return (
    <footer className="sup-footer">
      <p className="sup-footer__call" data-reveal>
        COME BREATHE{" "}
        <span aria-hidden="true" className="sup-footer__dot">
          ·
        </span>{" "}
        <span lang="ko">숨쉬러 오세요</span>
      </p>

      <div className="sup-footer__where" data-reveal>
        <p>
          <span lang="ko">강원도 인제 · 숨은골 자작나무 능선 아래</span>
          <span className="sup-footer__where-en">
            below the birch ridge at Sumeun-gol, Inje, Gangwon-do
          </span>
        </p>
        <p className="sup-footer__coords" aria-hidden="true">
          N 38.06° · E 128.17° · 612 m
        </p>
      </div>

      <p className="sup-footer__contact" data-reveal>
        <a className="sup-link" href="mailto:breathe@sup.forest">
          breathe@sup.forest
        </a>
        <a className="sup-link" href="#sup-hero">
          <span lang="ko">다시 처음으로</span> · back to the clearing
        </a>
      </p>

      <p className="sup-footer__legal">
        © 2026 <span lang="ko">숲</span> SUP — the forest keeps your pace.{" "}
        <span lang="ko">숲은 당신의 속도에 맞춥니다.</span>
      </p>
    </footer>
  );
}
