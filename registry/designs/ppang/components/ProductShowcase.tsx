"use client";

import Picture from "./Picture";
import Narration from "./Narration";

/**
 * Section 03 — the signature. One product, centered and large: the cream
 * bread (생크림빵) the bakery is known for. The square illustration reveals
 * with a clip-path wipe from center outward, and the name arrives as split
 * text beside it — like a webtoon panel introducing a character by name.
 *
 * Beneath the loaf, a small SFX caption ("쫀득" — chewy) and a one-line
 * tasting note in both voices. The whole section is deliberately sparse:
 * one loaf, one name, one sentence. The page is a story, not a catalogue.
 */
export default function ProductShowcase() {
  return (
    <section
      className="ppang-product"
      aria-labelledby="ppang-product-title"
      data-reveal=""
    >
      <div className="ppang-sechead ppang-sechead--center">
        <p className="ppang-eyebrow" aria-hidden="true">
          02 화 · 시그니처 <span lang="en">/ the signature</span>
        </p>
        <h2 className="ppang-sechead__title" id="ppang-product-title">
          한 입 물면, 새벽이 달다
        </h2>
        <p className="ppang-sechead__title-en" lang="en">
          One bite, and the dawn turns sweet
        </p>
      </div>

      <div className="ppang-product__stage">
        <figure className="ppang-panel ppang-product__panel" data-reveal="panel">
          <div className="ppang-panel__mount ppang-panel__mount--square">
            <Picture
              className="ppang-panel__art"
              stem="product-cream-bread"
              width={1024}
              height={1024}
              alt="생크림빵 한 개 — 노릇하게 구운 겉면에 흰 생크림이 가득 찬, 이 빵집의 시그니처. 따뜻한 종이 위에 놓여 있다. / A single cream bread — golden crust, filled with white cream, the bakery's signature, on warm paper."
            />
            <span className="ppang-panel__no" aria-hidden="true">
              02
            </span>
            {/* SFX lettering, like a webtoon sound effect */}
            <span className="ppang-sfx" aria-hidden="true">
              쫀
              <span className="ppang-sfx__small">득</span>!
            </span>
          </div>
        </figure>

        <div className="ppang-product__name">
          <p className="ppang-product__kr" lang="ko">
            <Narration text="생크림빵" start={300} step={90} />
          </p>
          <p className="ppang-product__en" lang="en">
            Cream Bread
          </p>
          <dl className="ppang-product__notes">
            <div>
              <dt lang="ko">맛</dt>
              <dd lang="ko">vanilla cream · 버터 향</dd>
            </div>
            <div>
              <dt lang="en">taste</dt>
              <dd lang="en">vanilla cream, warm butter</dd>
            </div>
            <div>
              <dt lang="ko">가격</dt>
              <dd lang="ko">₩3,500</dd>
            </div>
          </dl>
          <p className="ppang-product__line" lang="ko">
            새벽 네 시 반, 첫 판이 나오는 시간.
          </p>
          <p className="ppang-product__line-en" lang="en">
            <em>4:30 AM — the moment the first tray comes out.</em>
          </p>
        </div>
      </div>
    </section>
  );
}
