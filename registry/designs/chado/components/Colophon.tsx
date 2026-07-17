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
        <h2 id="chado-colophon-title" className="chado-colophon__title" lang="ja">
          跋
        </h2>
        <p className="chado-colophon__sub">Colophon · the closing</p>

        <dl className="chado-colophon__ledger">
          <div>
            <dt>
              <span lang="ja">茶室</span> · House
            </dt>
            <dd>
              <span lang="ja">一服庵</span> · Ippukuan — a fictional
              four-and-a-half-mat chashitsu in the galleries of one&rsquo;s
              attention.
            </dd>
          </div>
          <div>
            <dt>
              <span lang="ja">四規</span> · The four principles
            </dt>
            <dd>
              <span lang="ja">和 · 敬 · 清 · 寂</span> — harmony · respect ·
              purity · tranquility.
            </dd>
          </div>
          <div>
            <dt>
              <span lang="ja">器</span> · Vessels
            </dt>
            <dd>
              <span lang="ja">茶碗 · 茶筅 · 茶杓</span> · chawan, chasen,
              chashaku — all drawn, none photographed.
            </dd>
          </div>
          <div>
            <dt>
              <span lang="ja">書体</span> · Type
            </dt>
            <dd>
              Shippori Mincho for the vertical headers; Cormorant Garamond for
              the Latin voice.
            </dd>
          </div>
        </dl>

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
          © 2026 CHADŌ · 茶道 · No. 20 · MIT · drawn entirely in code — no
          photograph would be still enough.
        </p>

        <a className="chado-colophon__top" href="#chado-top">
          <span lang="ja">露地へ戻る</span> · return to the gate
        </a>
      </div>
    </footer>
  );
}
