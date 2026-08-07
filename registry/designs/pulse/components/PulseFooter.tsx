"use client";

/**
 * Section 03 — liner notes. The label's sign-off, the full credit sheet, a
 * release note, and the way back to the top. Every line is bilingual; Korean
 * is first-class, never a caption. The credit sheet is a real `<dl>` so it
 * reads as data, not decoration.
 */
export default function PulseFooter() {
  return (
    <footer className="pulse-footer" aria-label="Liner notes">
      <p className="pulse-footer__signoff" data-reveal>
        PULSE-001 ships when the field has breathed long enough to be its own
        record. Until then, this page is the listening.
        <span lang="ko" className="pulse-footer__ko">
          박동-001은 장이 스스로 한 장의 음반이 되기까지 충분히 숨 쉴 때
          나간다. 그 전까지, 이 페이지가 곧 듣기다.
        </span>
      </p>

      <dl className="pulse-footer__credit" data-reveal>
        <div>
          <dt>Artist</dt>
          <dd>NEBULA HOUSE · <span lang="ko">네뷸라 하우스</span></dd>
        </div>
        <div>
          <dt>Label</dt>
          <dd>PULSE RECORDS · <span lang="ko">박동 레코드</span></dd>
        </div>
        <div>
          <dt>Catalog</dt>
          <dd>PULSE-001</dd>
        </div>
        <div>
          <dt>Format</dt>
          <dd>Digital · 4 tracks · <span lang="ko">디지털 · 4곡</span></dd>
        </div>
        <div>
          <dt>Mastered</dt>
          <dd>2026 · <span lang="ko">2026년 마스터링</span></dd>
        </div>
        <div>
          <dt>Runtime</dt>
          <dd>17:48</dd>
        </div>
      </dl>

      <div className="pulse-footer__note" data-reveal>
        <h3 className="pulse-footer__note-title">
          A note on the silence{" "}
          <span lang="ko" className="pulse-section__ko">
            침묵에 대하여
          </span>
        </h3>
        <p>
          There is no audio on this page. The beat is simulated — a function
          of time, not a waveform. The nebula moves as if it were listening,
          and that is the whole of the trick. What you read as music is the
          field breathing.
          <span lang="ko" className="pulse-footer__note-ko">
            이 페이지에는 오디오가 없다. 비트는 시뮬레이션이다 — 파형이 아니라
            시간의 함수. 성운은 마치 듣고 있는 것처럼 움직이고, 그것이 속임수의
            전부다. 음악이라 읽힌 것은 장이 숨 쉬는 것이다.
          </span>
        </p>
      </div>

      <p className="pulse-footer__nav" data-reveal>
        <a className="pulse-link" href="#pulse-top">
          back to the field ↑ · <span lang="ko">장으로</span>
        </a>
      </p>

      <p className="pulse-footer__copy" data-reveal>
        © 2026 PULSE RECORDS — 한 장의 앨범을 어둠 속에.
      </p>
    </footer>
  );
}
