"use client";

/** Section 05 — the sign-off block: coordinates, decode status, mailto. */
export default function GlitchFooter() {
  return (
    <footer className="gl-footer" aria-labelledby="gl-footer-title">
      <div className="gl-sechead" data-tear>
        <span className="gl-sechead__no" aria-hidden="true">
          05
        </span>
        <h2 className="gl-sechead__title" id="gl-footer-title">
          end of signal{" "}
          <span lang="ko" className="gl-sechead__ko">
            신호 종료
          </span>
        </h2>
      </div>

      <p className="gl-footer__line" data-tear>
        <span className="gl-footer__time">04:00 KST</span> — render queue
        flushed. artifacts shelved, dated, not deleted.{" "}
        <span lang="ko">아티팩트를 보관했다. 지우지 않았다.</span>
      </p>

      <dl className="gl-footer__data" data-tear>
        <div>
          <dt>studio</dt>
          <dd>
            basement 2 · <span lang="ko">홍대 뒷골목</span> ·{" "}
            <span aria-hidden="true">37.5560°N 126.9236°E</span>
          </dd>
        </div>
        <div>
          <dt>codec</dt>
          <dd>
            h.264 / pcm / <span lang="ko">의도된 손실</span>
          </dd>
        </div>
        <div>
          <dt>uptime</dt>
          <dd>1842 days — never a clean shutdown</dd>
        </div>
        <div>
          <dt>contact</dt>
          <dd>
            <a className="gl-link" href="mailto:render@glitch.studio">
              render@glitch.studio
            </a>{" "}
            — <span lang="ko">답장은 다음 렌더 사이클에</span>
          </dd>
        </div>
      </dl>

      <p className="gl-footer__copy" data-tear>
        © 2026 glitch.studio — we keep the broken frames.{" "}
        <span lang="ko">우리는 부서진 프레임을 모은다.</span>
      </p>

      <p className="gl-footer__nav" data-tear>
        <a className="gl-link" href="#gl-top">
          ▲ reboot the signal — <span lang="ko">신호를 처음부터</span>
        </a>
      </p>
    </footer>
  );
}
