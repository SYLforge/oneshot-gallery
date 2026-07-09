/**
 * The sign-off. One large invitation, the atelier’s address in a quiet
 * Hannam-dong alley, and the house motto — measured in degrees, worn as
 * memory.
 */
export default function Footer() {
  return (
    <footer className="ondo-footer">
      <p className="ondo-footer__call" data-reveal="fade">
        Come warm{" "}
        <span lang="ko" className="ondo-footer__callko">
          온기를 입다
        </span>
      </p>

      <div className="ondo-footer__rule" aria-hidden="true" />

      <address className="ondo-footer__address" data-reveal="fade">
        ONDO atelier — 12-3, a quiet alley off Hannam-daero 27-gil,
        Yongsan-gu, Seoul
        <br />
        <span lang="ko">서울 용산구 한남대로27길 안쪽 골목 12-3</span>
        <br />
        dusk onward, by appointment{" "}
        <span lang="ko">해질녘부터 · 예약제</span>
        <br />
        <a className="ondo-link" href="mailto:atelier@ondo.kr">
          atelier@ondo.kr
        </a>
      </address>

      <p className="ondo-footer__legal" data-reveal="fade">
        © 2026 ONDO — measured in degrees, worn as memory.{" "}
        <span lang="ko">도(度)로 재고, 기억으로 입는다.</span>
      </p>

      <p className="ondo-footer__nav">
        <a className="ondo-link" href="#ondo-top">
          back to 36.5° <span lang="ko">처음으로</span>
        </a>
      </p>
    </footer>
  );
}
