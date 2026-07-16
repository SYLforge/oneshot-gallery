"use client";

/**
 * Section 05 — the end of the chapter. The hours (새벽 4시 오픈 · sells out
 * by noon), the address, the phone — a closing colophon, not a contact form.
 * Reads as the back page of a webtoon volume: where to find the bakery, when
 * it opens, and a quiet sign-off.
 *
 * The whole block is one reflowing ledger of hairline rules and tabular
 * numerals. Two interactive elements: an address link (to a map) and a
 * "처음으로 / back to the top" link — both with the warm amber focus ring.
 */
export default function BakeryFooter() {
  const hours: { time: string; kr: string; en: string }[] = [
    {
      time: "04:00",
      kr: "오픈 · 첫 반죽",
      en: "open · first dough",
    },
    {
      time: "06:30",
      kr: "첫 판 · 생크림빵",
      en: "first tray · cream bread",
    },
    {
      time: "12:00",
      kr: "다 팔리면 문 닫아요",
      en: "closes when sold out",
    },
    {
      time: "월–금",
      kr: "정기 휴무 없음",
      en: "Mon–Fri · no regular holiday",
    },
  ];

  return (
    <footer className="ppang-footer" aria-labelledby="ppang-footer-title">
      <div className="ppang-footer__inner">
        <div className="ppang-footer__head" data-reveal="">
          <p className="ppang-eyebrow" aria-hidden="true">
            04 화 · 콜로폰 <span lang="en">/ colophon</span>
          </p>
          <h2 className="ppang-footer__title" id="ppang-footer-title">
            새벽 4시에 만나요
          </h2>
          <p className="ppang-footer__title-en" lang="en">
            See you at 4 AM
          </p>
        </div>

        {/* hours — the one ledger on the page */}
        <dl className="ppang-hours" data-reveal="">
          {hours.map((h) => (
            <div className="ppang-hours__row" key={h.time}>
              <dt className="ppang-hours__time">{h.time}</dt>
              <dd className="ppang-hours__label">
                <span lang="ko">{h.kr}</span>
                <span lang="en" className="ppang-hours__en">
                  {" "}
                  — {h.en}
                </span>
              </dd>
            </div>
          ))}
        </dl>

        <div className="ppang-footer__where" data-reveal="">
          <p className="ppang-footer__brand" lang="ko">
            빵!
            <span lang="en" className="ppang-footer__brand-en">
              PPANG!
            </span>
          </p>
          <address className="ppang-footer__addr">
            <a
              href="https://maps.example.com/seoul-seonbu-ro-12"
              className="ppang-footer__link"
              lang="ko"
            >
              서울특별시 은평구 연북로 12길
            </a>
            <span className="ppang-footer__sep" aria-hidden="true">
              {" · "}
            </span>
            <a
              href="tel:+82-2-1234-0412"
              className="ppang-footer__link"
              lang="ko"
            >
              02-1234-0412
            </a>
            <br />
            <span lang="en" className="ppang-footer__addr-en">
              12, Yeonbuk-ro 12-gil, Eunpyeong-gu, Seoul
            </span>
          </address>
        </div>

        <p className="ppang-footer__signoff" lang="ko" data-reveal="">
          새벽은 늘 온다. 빵도 늘 깨어난다. — 그래서 우리는 늘 새벽에 일한다.
        </p>
        <p className="ppang-footer__signoff-en" lang="en" data-reveal="">
          <em>
            The dawn always comes. The bread always wakes. So we always work
            the dawn.
          </em>
        </p>

        <div className="ppang-footer__base">
          <p className="ppang-footer__copy">
            © 2026 빵! · 새벽빵집 ·{" "}
            <span lang="en">PPANG! dawn bakery</span>
          </p>
          <a href="#ppang-top" className="ppang-footer__top">
            <span lang="ko">처음으로</span>{" "}
            <span lang="en" className="ppang-footer__top-en">
              back to the top
            </span>
          </a>
        </div>
      </div>
    </footer>
  );
}
