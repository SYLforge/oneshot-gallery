"use client";

/**
 * End credits — the studio sign-off. The closing line gets the same
 * chromatic-aberration treatment as the hero title (one last CRT smear on
 * the way out), and the studio data reads like the credit roll of a
 * cartridge that never quite ended.
 */
export default function PixelFooter() {
  return (
    <footer className="pixel-footer">
      <div className="pixel-footer__inner">
        <p className="pixel-footer__sign pixel-ab" data-text="THANKS FOR PLAYING">
          THANKS FOR PLAYING
        </p>
        <p className="pixel-footer__signko" lang="ko">
          플레이해 주셔서 감사합니다
        </p>

        <dl className="pixel-footer__data">
          <div>
            <dt>STUDIO</dt>
            <dd>
              PIXEL ARCADE STUDIO · SEOUL ·{" "}
              <span lang="ko">픽셀 아케이드 스튜디오 — 서울</span>
            </dd>
          </div>
          <div>
            <dt>EST.</dt>
            <dd>
              2003 — still on ·{" "}
              <span lang="ko">2003년, 여전히 켜져 있음</span>
            </dd>
          </div>
          <div>
            <dt>CART</dt>
            <dd>
              32KB per world, two buttons, one afternoon ·{" "}
              <span lang="ko">세계당 32KB, 버튼 둘, 오후 하나</span>
            </dd>
          </div>
        </dl>

        <p className="pixel-footer__copy">
          © 2026 PIXEL ARCADE STUDIO — made for every quarter you spent.{" "}
          <span lang="ko">당신이 넣은 모든 동전을 위해 만들었습니다.</span>
        </p>
      </div>
    </footer>
  );
}
