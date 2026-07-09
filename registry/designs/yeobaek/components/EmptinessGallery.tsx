"use client";

/**
 * 비움의 화랑 — the gallery of emptiness.
 *
 * Three plates, each a mostly-empty composition: ripples without a stone,
 * a single syllable low in a wide field, and a plate deliberately left
 * blank. The ripple strokes (pathLength=1) draw themselves once when the
 * plate crosses its reveal threshold — a time-based stroke-dashoffset
 * transition gated behind .yeobaek-js, removed entirely under
 * prefers-reduced-motion (the plates are then simply finished).
 */
export default function EmptinessGallery() {
  return (
    <section
      id="yb-gallery"
      className="yeobaek-gallery"
      aria-labelledby="yb-gallery-title"
    >
      <header className="yeobaek-gallery__head" data-reveal>
        <p className="yeobaek-kicker">
          <span lang="ko">화보</span> · Plates
        </p>
        <h2 id="yb-gallery-title" className="yeobaek-gallery__title" lang="ko">
          비움의 화랑
        </h2>
        <p className="yeobaek-gallery__sub">The Gallery of Emptiness</p>
      </header>

      <div className="yeobaek-gallery__wall">
        <figure className="yeobaek-gallery__item" data-reveal>
          <div className="yeobaek-plate">
            <svg
              className="yeobaek-plate__art"
              viewBox="0 0 360 300"
              role="img"
              aria-label="파문 — 빈 수면의 오른쪽 아래로 번지는 세 겹의 잔물결. Three faint ripples widening near the lower right of an empty surface."
            >
              <path
                className="yeobaek-gstroke"
                d="M 196 214 a 66 18 0 1 1 132 0 a 66 18 0 1 1 -132 0"
                pathLength={1}
              />
              <path
                className="yeobaek-gstroke yeobaek-gstroke--d2"
                d="M 220 214 a 42 11 0 1 1 84 0 a 42 11 0 1 1 -84 0"
                pathLength={1}
              />
              <path
                className="yeobaek-gstroke yeobaek-gstroke--d3"
                d="M 244 214 a 18 5 0 1 1 36 0 a 18 5 0 1 1 -36 0"
                pathLength={1}
              />
            </svg>
          </div>
          <figcaption className="yeobaek-figure__cap">
            <span lang="ko">도판 三 · 파문 — 돌은 그려지지 않았다.</span>
            <em>Plate III · Ripples — the stone is not drawn.</em>
          </figcaption>
        </figure>

        <figure
          className="yeobaek-gallery__item yeobaek-gallery__item--right"
          data-reveal
        >
          <div
            className="yeobaek-plate yeobaek-plate--breath"
            role="img"
            aria-label="숨 — 넓은 여백의 아래쪽에 놓인 글자 하나. A single syllable, breath, resting low in a wide emptiness."
          >
            <span lang="ko" aria-hidden="true">
              숨
            </span>
          </div>
          <figcaption className="yeobaek-figure__cap">
            <span lang="ko">도판 四 · 숨 — 글자 하나가 페이지 전부를 들이쉰다.</span>
            <em>Plate IV · Breath — one syllable inhales the whole page.</em>
          </figcaption>
        </figure>

        <figure
          className="yeobaek-gallery__item yeobaek-gallery__item--center"
          data-reveal
        >
          <div
            className="yeobaek-plate yeobaek-plate--void"
            role="img"
            aria-label="여백 — 아무것도 인쇄되지 않은 판. A plate on which nothing is printed."
          />
          <figcaption className="yeobaek-figure__cap">
            <span lang="ko">
              도판 五 · 여백 — 이 판은 일부러 비워 두었다. 당신이 걸 것을
              위하여.
            </span>
            <em>
              Plate V · Yeobaek — this plate is left empty on purpose, for
              whatever you bring.
            </em>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
