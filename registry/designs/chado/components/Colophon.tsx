"use client";

/**
 * The colophon — the ceremony closes as it opened, in paper and quiet.
 *
 * A small ledger of the (fictional) chashitsu, the four principles spelled
 * out one last time, the closing line, and a back-to-top that returns the
 * guest to the gate. No CTA banner, no newsletter pop, no urgency. The way
 * of tea ends by putting the bowl down.
 */
export default function Colophon() {
  return (
    <footer className="chado-colophon" aria-labelledby="chado-colophon-title">
      <div className="chado-colophon__inner">
        <h2 id="chado-colophon-title" className="chado-colophon__title">
          <span lang="ko">발</span> <span lang="ja">跋</span>
        </h2>
        <p className="chado-colophon__sub">
          <span lang="ko">말미 · 마무리</span> · Colophon · the closing
        </p>

        <dl className="chado-colophon__ledger">
          <div>
            <dt>
              <span lang="ko">다실</span> · <span lang="ja">茶室</span> · House
            </dt>
            <dd>
              <span lang="ko">일복암</span> · <span lang="ja">一服庵</span> ·
              Ippukuan — a fictional four-and-a-half-mat chashitsu in the
              galleries of one&rsquo;s attention.
            </dd>
          </div>
          <div>
            <dt>
              <span lang="ko">사규</span> · <span lang="ja">四規</span> · The four principles
            </dt>
            <dd>
              <span lang="ja">和 · 敬 · 清 · 寂</span> —{" "}
              <span lang="ko">화 · 경 · 청 · 적</span> — harmony · respect ·
              purity · tranquility.
            </dd>
          </div>
          <div>
            <dt>
              <span lang="ko">기</span> · <span lang="ja">器</span> · Vessels
            </dt>
            <dd>
              <span lang="ja">茶碗 · 茶筅 · 茶杓</span> ·{" "}
              <span lang="ko">찻잔 · 차센 · 다구</span> · chawan, chasen,
              chashaku — all drawn, none photographed.
            </dd>
          </div>
          <div>
            <dt>
              <span lang="ko">서체</span> · <span lang="ja">書体</span> · Type
            </dt>
            <dd>
              <span lang="ko">세로 제목엔 시포리 민초, 한글엔 노토 명조, 라틴엔 코모란트 가라몬.</span>{" "}
              Shippori Mincho for the vertical headers; Noto Serif KR for the
              Korean voice; Cormorant Garamond for the Latin.
            </dd>
          </div>
        </dl>

        <p className="chado-colophon__close chado-colophon__close--ko" lang="ko" data-reveal>
          찻잔을 내려놓는다. 그것으로, 끝난다. 아무것도 남지 않는다. 그것으로 좋다.
        </p>
        <p className="chado-colophon__close" data-reveal>
          <span lang="ja">
            茶碗を置く。それで、終わる。何も残らない。それでよい。
          </span>
        </p>
        <p className="chado-colophon__close chado-colophon__close--en" data-reveal>
          The bowl is set down. With that, it ends. Nothing is left behind.
          That is as it should be.
        </p>

        <p className="chado-colophon__legal">
          © 2026 CHADŌ · <span lang="ko">다도</span> · <span lang="ja">茶道</span> · No. 20 · MIT ·{" "}
          <span lang="ko">전부 코드로 그렸다 — 어떤 사진도 이토록 고요할 수는 없다.</span>{" "}
          drawn entirely in code — no photograph would be still enough.
        </p>

        <a className="chado-colophon__top" href="#chado-top">
          <span lang="ko">노지로 돌아가기</span> · <span lang="ja">露地へ戻る</span> · return to the gate
        </a>
      </div>
    </footer>
  );
}
