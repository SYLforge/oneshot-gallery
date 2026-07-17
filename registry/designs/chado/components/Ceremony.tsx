"use client";

import type { ReactNode } from "react";

/**
 * The ceremony beats — four turns of the rite, each a held breath.
 *
 * Where a landing page would stack features, the ceremony stacks *pauses*.
 * Each beat is a single, short bilingual statement with vast air around it —
 * the section exists so that the white between statements can exist. The
 * ma (間) is the design. Content arrives (data-reveal), then waits; the next
 * beat does not chase it. This is the opposite of busy.
 *
 * The four beats are the gates of the rite, drawn from chanoyu's actual
 * progression: the roji garden (露地) where the world is left behind, the
 * tsukubai (蹲踞) where the hands are rinsed, the four principles
 * (和敬清寂 — wa · kei · sei · jaku: harmony, respect, purity, tranquility),
 * and the host's single bow. None of it is invented scholarship — each is a
 * real, named moment of the ceremony, named in the order a guest meets it.
 *
 * Each beat's CJK header reads horizontally here (the vertical-rl treatment
 * is reserved for the hero title and the tokonoma scroll, so tategaki stays
 * scarce and therefore sacred). Reduced motion / no JS: every beat is
 * present from the server render; reveals are JS-gated pre-states only.
 */
type Beat = {
  n: string;
  ja: string;
  en: string;
  body: ReactNode;
};

const BEATS: Beat[] = [
  {
    n: "一",
    ja: "露地",
    en: "The roji garden",
    body: (
      <>
        <p className="chado-beat__p chado-beat__p--ja" lang="ja" data-reveal>
          露地を歩く。足元の飛び石は、急ぐ足をゆるやかにするために置かれた。
          垣根の向こうの世界は、ここでは遠い。
        </p>
        <p className="chado-beat__p chado-beat__p--en" data-reveal>
          You walk the roji. The stepping stones are laid to slow a hurried
          foot. The world beyond the hedge is, for now, far away.
        </p>
      </>
    ),
  },
  {
    n: "二",
    ja: "蹲踞",
    en: "The tsukubai — rinsing the hands",
    body: (
      <>
        <p className="chado-beat__p chado-beat__p--ja" lang="ja" data-reveal>
          蹲踞の水で手を清める。冷たさが、残っていた昨日を洗い流す。
          ここから先は、茶のみのための時間だ。
        </p>
        <p className="chado-beat__p chado-beat__p--en" data-reveal>
          At the tsukubai you rinse your hands. The cold water carries off
          whatever of yesterday you were still carrying. Past this point,
          there is only the time of tea.
        </p>
      </>
    ),
  },
  {
    n: "三",
    ja: "和敬清寂",
    en: "wa · kei · sei · jaku",
    body: (
      <>
        <p className="chado-beat__p chado-beat__p--ja" lang="ja" data-reveal>
          和 · 敬 · 清 · 寂 — 調和、敬意、清浄、静寂。茶碗はこれら四つの字を、
          持つ者の掌のなかで黙って証明している。
        </p>
        <p className="chado-beat__p chado-beat__p--en" data-reveal>
          wa · kei · sei · jaku — harmony, respect, purity, tranquility. The
          bowl proves these four words, silently, in the palm of whoever
          holds it.
        </p>
      </>
    ),
  },
  {
    n: "四",
    ja: "一礼",
    en: "The host's single bow",
    body: (
      <>
        <p className="chado-beat__p chado-beat__p--ja" lang="ja" data-reveal>
          亭主が一礼する。茶碗が回ってくる。ここまで来るのに、四時間とかからなかった。
          けれど、長く感じたはずだ。それでよい。
        </p>
        <p className="chado-beat__p chado-beat__p--en" data-reveal>
          The host bows once. The bowl comes around. It did not take four
          hours to arrive here — though it should have felt long. That is
          as it should be.
        </p>
      </>
    ),
  },
];

export default function Ceremony() {
  return (
    <section
      id="chado-ceremony"
      className="chado-ceremony"
      aria-labelledby="chado-ceremony-title"
    >
      <header className="chado-ceremony__head" data-reveal>
        <p className="chado-kicker">
          <span lang="ja">四つの時</span> · Four Turns
        </p>
        <h2
          id="chado-ceremony-title"
          className="chado-section-title"
          lang="ja"
        >
          儀は、息の上に成る
        </h2>
        <p className="chado-section-sub">
          The rite is built on the breath — four gates, each a held pause.
        </p>
      </header>

      <ol className="chado-ceremony__beats">
        {BEATS.map((beat) => (
          <li key={beat.n} className="chado-beat" data-reveal>
            <div className="chado-beat__index">
              <span className="chado-beat__no" lang="ja">
                {beat.n}
              </span>
              <span className="chado-beat__rule" aria-hidden="true" />
            </div>
            <div className="chado-beat__body">
              <h3 className="chado-beat__title">
                <span lang="ja">{beat.ja}</span>
                <em>{beat.en}</em>
              </h3>
              {beat.body}
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
