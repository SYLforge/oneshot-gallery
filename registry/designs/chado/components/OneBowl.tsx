"use client";

/**
 * 一服 — the climax: one bowl.
 *
 * The whole ceremony has been building toward a single bowl of tea. Here it
 * is — centered on brighter paper (the page's lit skin), full of matcha,
 * with a faint breath of steam above it (the page's one idle ambient loop,
 * opacity/transform only, mutually-prime 7.2s so it never syncs with the
 * breath cue). Around it, enormous ma. The proposition resolves: you are
 * not given a product; you are given one bowl, and the attention to receive
 * it.
 *
 * The bowl re-uses the chawan vocabulary from the chasen scene but larger
 * and complete, with the matcha surface full. The romanized name of the bowl
 * sits beneath in matcha-deep (the one place matcha functions as text — at
 * AA, 6.10:1, because the brand accent at body size must pass).
 *
 * Reduced motion: the steam does not breathe; the bowl simply is.
 */
export default function OneBowl() {
  return (
    <section
      id="chado-bowl"
      className="chado-bowlsec"
      aria-labelledby="chado-bowl-title"
    >
      <div className="chado-bowlsec__inner" data-reveal>
        <p className="chado-kicker chado-kicker--center">
          <span lang="ja">一服</span> · One Bowl
        </p>

        <svg
          className="chado-bowlsec__art"
          viewBox="0 0 320 320"
          role="img"
          aria-labelledby="chado-bowl-title"
        >
          <title id="chado-bowl-title">
            一服の茶碗 — 한 그릇의 말차. One bowl of matcha, centered on lit
            paper, with a faint breath of steam.
          </title>
          {/* steam — three wisps, the page's only ambient loop */}
          <g className="chado-bowlsec__steam" aria-hidden="true">
            <path
              className="chado-bowlsec__wisp"
              d="M 144 96 C 138 78, 150 64, 144 46"
              pathLength={1}
            />
            <path
              className="chado-bowlsec__wisp chado-bowlsec__wisp--2"
              d="M 160 92 C 166 74, 154 60, 160 42"
              pathLength={1}
            />
            <path
              className="chado-bowlsec__wisp chado-bowlsec__wisp--3"
              d="M 176 96 C 170 80, 182 66, 176 50"
              pathLength={1}
            />
          </g>

          {/* the bowl shell */}
          <path
            className="chado-bowlsec__shell"
            d="M 70 150 C 76 236, 124 282, 160 282 C 196 282, 244 236, 250 150 Z"
          />
          {/* the rim */}
          <ellipse
            className="chado-bowlsec__rim"
            cx="160"
            cy="150"
            rx="90"
            ry="17"
          />
          {/* the full matcha surface */}
          <ellipse
            className="chado-bowlsec__tea"
            cx="160"
            cy="151"
            rx="82"
            ry="12"
          />
          {/* foam crescents where the whisk passed */}
          <path
            className="chado-bowlsec__foam"
            d="M 118 148 q 16 -7 32 0 M 168 153 q 14 -5 28 0 M 138 155 q 12 -4 24 0"
          />
        </svg>

        <h2 className="chado-bowlsec__title">
          <span lang="ja">一服</span>
        </h2>
        <p className="chado-bowlsec__reading">ichifuku · one serving</p>

        <p className="chado-bowlsec__line chado-bowlsec__line--ja" lang="ja" data-reveal>
          これが、すべてのための一服。
        </p>
        <p className="chado-bowlsec__line" data-reveal>
          This is the one bowl everything was for. Take it slowly. There is
          no next thing.
        </p>

        <p className="chado-bowlsec__seal" lang="ja" data-reveal>
          いただきます
        </p>
      </div>
    </section>
  );
}
