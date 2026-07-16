"use client";

import Picture from "./Picture";
import Narration from "./Narration";

/**
 * Section 04 — the kitchen. The landscape interior shot, framed wide, with
 * a caption strip laid over its lower third — the webtoon's narration bar.
 * By now the dawn has fully arrived (the scroll-progress sky has reached
 * gold), and the copy turns outward: from the baker's inner voice to an
 * invitation to the reader.
 *
 * The panel reveals with a downward clip wipe (a different direction than
 * the baker's left-to-right), so the cuts never repeat the same motion.
 */
export default function KitchenStory() {
  return (
    <section
      className="ppang-kitchen"
      aria-labelledby="ppang-kitchen-title"
      data-reveal=""
    >
      <div className="ppang-sechead">
        <p className="ppang-eyebrow" aria-hidden="true">
          03 화 · 부엌 <span lang="en">/ the kitchen</span>
        </p>
        <h2 className="ppang-sechead__title" id="ppang-kitchen-title">
          첫 출근길이
          <br />
          빵 냄새로 따뜻할 때
        </h2>
        <p className="ppang-sechead__title-en" lang="en">
          When the first commute warms to the smell of bread
        </p>
      </div>

      <figure
        className="ppang-panel ppang-kitchen__panel"
        data-reveal="panel"
      >
        <div className="ppang-panel__mount ppang-panel__mount--wide">
          <Picture
            className="ppang-panel__art"
            stem="interior-kitchen"
            width={1024}
            height={768}
            alt="빵집 부엌 — 새벽 빛이 드는 주방, 오븐과 반죽대, 따뜻한 나무 결. 첫 반죽이 막 피어오르려 한다. / Bakery kitchen interior — the room where the dawn light enters: oven, dough table, warm wood grain; the first dough just beginning to rise."
          />
          <span className="ppang-panel__no" aria-hidden="true">
            03
          </span>

          {/* narration strip over the lower third */}
          <figcaption className="ppang-kitchen__caption">
            <span className="ppang-sr">
              문이 열리면 새벽 냄새가 먼저 나옵니다. 빵은 그 다음입니다.
            </span>
            <p className="ppang-kitchen__kr" lang="ko" aria-hidden="true">
              <Narration
                text="문이 열리면 새벽 냄새가 먼저 나옵니다."
                start={400}
                step={46}
              />
              <br />
              <Narration text="빵은 그 다음입니다." start={2400} step={46} />
            </p>
            <p className="ppang-kitchen__en" lang="en">
              <em>
                The door opens and the smell of dawn comes first.
                <br />
                The bread comes after.
              </em>
            </p>
          </figcaption>
        </div>
      </figure>
    </section>
  );
}
