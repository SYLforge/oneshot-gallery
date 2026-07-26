"use client";

/**
 * Section 03 — the goodbye, written as the back of the sticker sheet: a big
 * bilingual shout, a grid of where/when/talk, and a sign-off that takes the
 * sticker joke seriously. The footer inverts the palette (ink ground, warm
 * text) so the page ends on a different sheet of paper than it started —
 * the sticker is peeled off and stuck somewhere new.
 */
export default function StudioFooter() {
  return (
    <footer className="sticker-footer">
      <p className="sticker-footer__giant" data-sticker-reveal>
        <span lang="ko">같이 붙여요</span> <span>STICK WITH US</span>
      </p>

      <dl className="sticker-footer__grid" data-sticker-reveal>
        <div className="sticker-footer__cell">
          <dt className="sticker-footer__k">
            <span lang="ko">찾아오기</span> FIND US
          </dt>
          <dd className="sticker-footer__v">
            <span lang="ko">서울 마포구 어딘가, 스티커 벽 뒤 2층</span>
            <br />
            SOMEWHERE IN MAPO, SEOUL — 2F BEHIND THE STICKER WALL
          </dd>
        </div>
        <div className="sticker-footer__cell">
          <dt className="sticker-footer__k">
            <span lang="ko">시간</span> HOURS
          </dt>
          <dd className="sticker-footer__v">
            <span lang="ko">11:00–19:00 · 커피가 끓으면 시작</span>
            <br />
            11:00–19:00 · WE START WHEN THE COFFEE&apos;S READY
          </dd>
        </div>
        <div className="sticker-footer__cell">
          <dt className="sticker-footer__k">
            <span lang="ko">연락</span> TALK
          </dt>
          <dd className="sticker-footer__v">
            <a
              className="sticker-btn sticker-press sticker-footer__mail"
              href="mailto:hi@sticker.studio"
            >
              hi@sticker.studio
            </a>
          </dd>
        </div>
      </dl>

      <p className="sticker-footer__legal">
        © 2026 STICKER STUDIO — <span lang="ko">접착제와 장난으로 지음.</span>{" "}
        BUILT WITH GLUE AND A SENSE OF HUMOR.
      </p>
    </footer>
  );
}
