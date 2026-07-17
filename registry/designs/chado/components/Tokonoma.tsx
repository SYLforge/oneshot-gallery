"use client";

/**
 * The tokonoma (床の間) — the alcove.
 *
 * A recessed, slightly darker panel (the tokonoma paper) holding two things
 * and nothing else: a hanging scroll (掛け軸) with a tea poem set in tategaki,
 * and a single ikebana sprig in a vessel. This is the second place vertical
 * text appears — scarce, because tategaki earns its weight by not being
 * everywhere. The scroll's poem is Rikyū's famous dictum in spirit: the
 * ceremony is a thousand breathes, but the bowl is one.
 *
 * The alcove is composed of paper on paper: a tokonoma ground one step
 * darker than the page, a 1px sumi frame rebated from the edge, and a faint
 * second feTurbulence inside it so the recess reads as deeper, older paper.
 * The ikebana is a single SVG line-drawn stem with one leaf and one flower
 * — drawn once on reveal, time-based (the only time-based draw on the page;
 * every other stroke is scroll-scrubbed or static).
 *
 * No-JS / reduced motion: the alcove is fully composed; the stem is drawn.
 */
export default function Tokonoma() {
  return (
    <section
      id="chado-tokonoma"
      className="chado-tokonoma"
      aria-labelledby="chado-tokonoma-title"
    >
      <header className="chado-tokonoma__head" data-reveal>
        <p className="chado-kicker">
          <span lang="ja">床の間</span> · The Alcove
        </p>
        <h2
          id="chado-tokonoma-title"
          className="chado-section-title chado-section-title--center"
          lang="ja"
        >
          一柱の花、一行の詩
        </h2>
        <p className="chado-section-sub chado-section-sub--center">
          One stem, one line — the room is complete.
        </p>
      </header>

      <div className="chado-tokonoma__recess" data-reveal>
        {/* a faint paper grain only inside the alcove — deeper, older paper */}
        <svg className="chado-tokonoma__paper" aria-hidden="true" focusable="false">
          <filter id="chado-alcove-paper">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.04"
              numOctaves={2}
              seed="3"
              stitchTiles="stitch"
            />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0.17  0 0 0 0 0.15  0 0 0 0 0.125  0 0 0 0.035 0"
            />
          </filter>
          <rect width="100%" height="100%" filter="url(#chado-alcove-paper)" />
        </svg>

        {/* the hanging scroll — the tea poem, in tategaki */}
        <figure className="chado-scroll" role="img" aria-labelledby="chado-scroll-cap">
          <div className="chado-scroll__rod chado-scroll__rod--top" aria-hidden="true" />
          <p className="chado-scroll__poem" lang="ja" aria-label="茶を点てば、ただ一服のために。千の作法は、ひとつの碗へ集まる。">
            <span aria-hidden="true">茶</span>
            <span aria-hidden="true">を</span>
            <span aria-hidden="true">点</span>
            <span aria-hidden="true">て</span>
            <span aria-hidden="true">ば</span>
            <span aria-hidden="true">、</span>
            <span aria-hidden="true">た</span>
            <span aria-hidden="true">だ</span>
            <span aria-hidden="true">一</span>
            <span aria-hidden="true">服</span>
            <span aria-hidden="true">の</span>
            <span aria-hidden="true">た</span>
            <span aria-hidden="true">め</span>
            <span aria-hidden="true">に</span>
            <span aria-hidden="true">。</span>
          </p>
          <div className="chado-scroll__rod chado-scroll__rod--bottom" aria-hidden="true" />
          <figcaption id="chado-scroll-cap" className="chado-scroll__cap">
            <em>
              &ldquo;Whisk the tea, and it is all for a single bowl. A
              thousand forms gather into one vessel.&rdquo;
            </em>
          </figcaption>
        </figure>

        {/* the ikebana — one stem, one leaf, one flower, in a vessel */}
        <figure
          className="chado-ikebana"
          role="img"
          aria-labelledby="chado-ikebana-cap"
          data-reveal
        >
          <svg
            className="chado-ikebana__art"
            viewBox="0 0 160 280"
            aria-labelledby="chado-ikebana-cap"
          >
            <title id="chado-ikebana-cap-img">一輪の生け花 — 하나의 줄기에 잎과 꽃 하나.</title>
            {/* the vessel — a dark sumi water container, low and wide */}
            <path
              className="chado-ikebana__vessel"
              d="M 48 250 C 50 268, 110 268, 112 250 L 110 236 C 108 224, 52 224, 50 236 Z"
            />
            {/* the water line */}
            <ellipse
              className="chado-ikebana__water"
              cx="80"
              cy="237"
              rx="29"
              ry="3.4"
            />
            {/* the stem — drawn once on reveal */}
            <path
              className="chado-ikebana__stem"
              d="M 78 236 C 74 190, 96 150, 86 96 C 80 64, 96 44, 104 30"
              pathLength={1}
            />
            {/* one leaf, two-thirds up */}
            <path
              className="chado-ikebana__leaf"
              d="M 88 138 C 104 130, 124 134, 132 148 C 118 152, 100 150, 88 138 Z"
              pathLength={1}
            />
            {/* one flower — the single matcha accent of the alcove */}
            <circle className="chado-ikebana__bloom" cx="104" cy="30" r="8.5" />
            <circle
              className="chado-ikebana__bloom-core"
              cx="104"
              cy="30"
              r="2.4"
            />
          </svg>
          <figcaption className="chado-ikebana__cap">
            <span lang="ja">一輪生花</span> ·{" "}
            <em>one stem, arranged</em>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
