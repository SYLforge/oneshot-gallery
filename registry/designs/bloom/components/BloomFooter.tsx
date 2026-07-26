"use client";

/**
 * 넷 · Footer — the house at the end. The signature flower, now fully
 * open (you scrolled here), sits as a small mark beside the wordmark.
 * The Korean-first sign-off, the fictional place, a mailto, and the
 * license line. Hairline rules, generous space, no cards.
 */
export default function BloomFooter() {
  return (
    <footer className="bloom-footer" id="bloom-footer">
      <p className="bloom-footer__mark" aria-hidden="true">
        <svg viewBox="0 0 40 40" className="bloom-footer__marksvg" focusable="false">
          {/* a tiny static flower mark — fully open, the finished state */}
          <g stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round">
            <path d="M20 20 C 16 14, 16 8, 20 4 C 24 8, 24 14, 20 20 Z" />
            <path d="M20 20 C 14 16, 8 16, 4 20 C 8 24, 14 24, 20 20 Z" />
            <path d="M20 20 C 24 26, 24 32, 20 36 C 16 32, 16 26, 20 20 Z" />
            <path d="M20 20 C 26 24, 32 24, 36 20 C 32 16, 26 16, 20 20 Z" />
          </g>
          <circle cx="20" cy="20" r="2.4" fill="currentColor" stroke="none" />
        </svg>
      </p>
      <p className="bloom-footer__call">
        <span lang="ko">피어난 것을, 기다리지 마세요</span>
        <span className="bloom-footer__call-en">
          <span aria-hidden="true"> · </span>what has bloomed, do not wait for
        </span>
      </p>
      <p className="bloom-footer__where">
        <span lang="ko">제주 서귀포 · 작약밭 옆 작은 향원</span>
        <span className="bloom-footer__where-en">
          Seogwipo, Jeju · a small scent house beside the peony field
        </span>
        <span className="bloom-footer__coords">N 33.24° E 126.56°</span>
      </p>
      <nav className="bloom-footer__contact" aria-label="Footer">
        <a className="bloom-link" href="mailto:atelier@bloom.gallery">
          atelier@bloom.gallery
        </a>
        <a className="bloom-link" href="#bloom-hero">
          <span lang="ko">맨 위로</span> · back to top
        </a>
      </nav>
      <p className="bloom-footer__legal">
        <span lang="ko">© 2026 피다 BLOOM — 향은 피어나는 일입니다.</span>
        <span className="bloom-footer__legal-en">
          {" "}the scent is the act of opening.
        </span>
      </p>
    </footer>
  );
}
