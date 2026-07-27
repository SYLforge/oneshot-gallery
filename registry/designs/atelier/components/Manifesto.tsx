/**
 * Section 01 — the editor's letter. A full-bleed editorial spread whose text
 * frame rises on a hairline clip-path (inset from the bottom) as it enters
 * the viewport. The pull-quote is set in oversized Bodoni italic, the way a
 * magazine would set the standfirst of a letter from the editor; the body is
 * Noto Serif KR at a reading weight, Korean first-class.
 *
 * This is the clip-path-reveal section: the editorial wipe rises like a
 * curtain on the frame, the copy follows one beat behind.
 */
export default function Manifesto() {
  return (
    <section className="atelier-manifesto" aria-labelledby="atelier-letter-title">
      <div className="atelier-sechead" data-reveal="fade">
        <p className="atelier-eyebrow">01 — the letter · 편지</p>
        <h2 id="atelier-letter-title" className="atelier-sechead__title">
          From the atelier
        </h2>
      </div>

      <div className="atelier-letter" data-reveal="clip">
        <div className="atelier-letter__frame">
          <p className="atelier-letter__pull">
            <span className="atelier-letter__pull-en">
              We did not make a collection.
            </span>
            <span className="atelier-letter__pull-en">
              We made five answers to the same quiet.
            </span>
            <span className="atelier-letter__pull-ko" lang="ko">
              우리는 컬렉션을 만들지 않았다.
            </span>
            <span className="atelier-letter__pull-ko" lang="ko">
              같은 침묵에 대한 다섯 개의 대답을 깎았을 뿐이다.
            </span>
          </p>

          <div className="atelier-letter__body">
            <p>
              The RESERVE collection is what the maison sets aside — not for a
              season, but for the visitor who arrives after the season has
              closed. Five looks, cut in the months when the studio is quietest,
              finished by the hand that drew them.
            </p>
            <p lang="ko">
              RESERVE는 메종이 따로 두는 것이다 — 한 철을 위해서가 아니라, 철이
              다한 뒤에 찾아오는 이를 위해서. 스튜디오가 가장 고요한 달에
              깎아낸 다섯 벌을, 그것을 그린 손으로 마무리했다.
            </p>
            <p>
              Nothing here was photographed. Every garment you see is a gradient
              and a line — the way a cover remembers a collection before the
              first shoot. We trust the reader to do the rest.
            </p>
            <p lang="ko">
              여기엔 찍힌 사진이 한 장도 없다. 당신이 보는 옷은 그라디언트와
              선이다 — 첫 촬영 전에 표지가 컬렉션을 기억하는 방식. 나머지는
              읽는 이에게 맡긴다.
            </p>
            <p className="atelier-letter__sign">
              — H.빈, creative director{" "}
              <span lang="ko">· 크리에이티브 디렉터</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
