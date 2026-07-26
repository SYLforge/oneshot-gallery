"use client";

/**
 * Section 04 — the invitation and the sign-off. The page stays in its night
 * register throughout (no inversion — the dark is the page's home, not a
 * room you step into). The seal — 桜, the blossom — is pressed in gold at the
 * foot, tilted the way a hand tilts a stamp. The button's bloom-fill hover
 * is a scaleX pseudo-element (blossom ground, ink-night text on hover).
 *
 * Trilingual to the last line: Korean is the voice that speaks, Japanese is
 * the source glyph that signs, English is the subtitle that translates.
 */
export default function SakuraFooter() {
  return (
    <section className="sakura-cta" aria-labelledby="sakura-cta-title">
      <div className="sakura-cta__inner" data-reveal="">
        <p className="sakura-cta__eyebrow" aria-hidden="true">
          <span lang="ko">04 — 머무름</span>{" "}
          <span lang="ja">留まる</span>
        </p>
        <h2 className="sakura-cta__title" id="sakura-cta-title">
          <span lang="ko">잉크가 꽃으로 머무는 자리.</span>{" "}
          <span lang="ja" className="sakura-cta__titleja">
            墨が花として留まる場所。
          </span>
        </h2>
        <p className="sakura-cta__line">
          <span lang="ko">
            이 정원은 이미 피어 있다. 당신이 두드리면, 새로운 먹이 떨어지고,
            새로운 꽃이 핀다. 아무것도 영원하지 않기에, 아름답다.
          </span>{" "}
          <span lang="ja" className="sakura-cta__lineja">
            この庭はすでに咲いている。あなたが叩けば、新しい墨が落ち、新しい
            花が咲く。何も永遠でないからこそ、美しい。
          </span>
        </p>
        <a
          className="sakura-cta__btn"
          href="#sakura-top"
        >
          <span className="sakura-cta__btntext">
            <span lang="ko">다시 피우기</span>{" "}
            <span lang="ja" className="sakura-cta__btnja">
              再び咲かせる
            </span>
          </span>
        </a>
      </div>

      {/* the seal — 桜, the blossom — pressed in gold, slightly off-true */}
      <svg
        className="sakura-cta__seal"
        viewBox="0 0 72 72"
        width={72}
        height={72}
        aria-hidden="true"
        focusable="false"
      >
        <rect x="4" y="4" width="64" height="64" rx="3" fill="#c9a85a" />
        <rect
          x="9.5"
          y="9.5"
          width="53"
          height="53"
          rx="1.5"
          fill="none"
          stroke="#0e0a0f"
          strokeOpacity="0.35"
          strokeWidth="1"
        />
        <text
          className="sakura-sealglyph"
          x="36"
          y="50"
          textAnchor="middle"
          fontSize="34"
          fill="#0e0a0f"
        >
          桜
        </text>
      </svg>

      <footer className="sakura-footer">
        <div className="sakura-footer__grid">
          <p className="sakura-footer__brand">
            SAKURA{" "}
            <span lang="ja" className="sakura-footer__brandja">
              桜花
            </span>
          </p>
          <p className="sakura-footer__place">
            <span lang="ko">생성적 잉크 정원</span>{" "}
            <span lang="en">a generative ink garden</span>{" "}
            <span lang="ja">墨の庭</span>
          </p>
          <p className="sakura-footer__est">
            <span lang="ko">2026 · 봄</span> since 2026{" "}
            <span lang="ja">令和八年・春</span>
          </p>
        </div>

        <p className="sakura-footer__koan">
          <span lang="ko">
            꽃은 지기 때문에 아름답다. 코드는 그 덧없음을 기억한다.
          </span>{" "}
          <span lang="ja" className="sakura-footer__koanja">
            花は散るから美しい。コードはその儚さを覚えている。
          </span>
        </p>

        <div className="sakura-footer__base">
          <p className="sakura-footer__copy">
            © 2026 SAKURA <span lang="ja">桜花</span> —{" "}
            <span lang="ko">온전히 코드로</span> written entirely in code{" "}
            <span lang="ja">すべてコードにて</span>
          </p>
          <a className="sakura-footer__top" href="#sakura-top">
            <span lang="ko">다시, 처음부터</span> bloom again{" "}
            <span lang="ja" className="sakura-footer__topja">
              もう一度、最初から
            </span>
          </a>
        </div>
      </footer>
    </section>
  );
}
