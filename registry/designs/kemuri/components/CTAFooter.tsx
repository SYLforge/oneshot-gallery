"use client";

/**
 * Section 05 — the invitation, and the sign-off. The page inverts once,
 * here: sumi ground, washi voice — stepping from the paper into the dim
 * room where the sitting actually happens. The button's ink-fill hover is
 * a scaleX pseudo-element (compositor-only); ember is finally allowed to be
 * text, because on sumi it clears AA with room to spare.
 */
export default function CTAFooter() {
  return (
    <section className="kemuri-cta" aria-labelledby="kemuri-cta-title">
      <div className="kemuri-cta__inner" data-reveal="">
        <p className="kemuri-cta__eyebrow" aria-hidden="true">
          05 — 御案内
        </p>
        <h2 className="kemuri-cta__title" id="kemuri-cta-title">
          Come sit with the smoke.{" "}
          <span lang="ja" className="kemuri-cta__titleja">
            煙とともに、しばし。
          </span>
        </h2>
        <p className="kemuri-cta__line">
          The atelier keeps twelve cushions and one iron kettle. Reservations
          are taken for hours — never for hurry.{" "}
          <span lang="ja" className="kemuri-cta__lineja">
            座布団は十二枚、鉄瓶はひとつ。御予約は一時間から。
            お急ぎの分は、承れません。
          </span>
        </p>
        <a className="kemuri-cta__btn" href="mailto:hour@kemuri.example.jp">
          <span className="kemuri-cta__btntext">
            Reserve an hour{" "}
            <span lang="ja" className="kemuri-cta__btnja">
              一時間を予約する
            </span>
          </span>
        </a>
      </div>

      <footer className="kemuri-footer">
        <div className="kemuri-footer__grid">
          <p className="kemuri-footer__brand">
            KEMURI{" "}
            <span lang="ja" className="kemuri-footer__brandja">
              香房
            </span>
          </p>
          <p className="kemuri-footer__addr">
            Teramachi-dōri, Nakagyō-ku, Kyoto{" "}
            <span lang="ja">京都市中京区・寺町通</span>
          </p>
          <p className="kemuri-footer__est">
            since 1927 <span lang="ja">昭和二年創業</span>
          </p>
        </div>

        <p className="kemuri-footer__koan">
          The smoke rises whether or not we watch. We prefer to watch.{" "}
          <span lang="ja" className="kemuri-footer__koanja">
            煙は、見ていなくても立ちのぼる。私たちは、見ているほうを選ぶ。
          </span>
        </p>

        <div className="kemuri-footer__base">
          <p className="kemuri-footer__copy">
            © 2026 KEMURI <span lang="ja">香房</span> — one stick, one hour{" "}
            <span lang="ja">一炷一刻</span>
          </p>
          <a className="kemuri-footer__top" href="#kemuri-top">
            begin the hour again{" "}
            <span lang="ja" className="kemuri-footer__topja">
              もう一度、最初から
            </span>
          </a>
        </div>
      </footer>
    </section>
  );
}
