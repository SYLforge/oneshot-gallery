"use client";

import type { CSSProperties } from "react";
import Picture from "./Picture";
import Narration from "./Narration";

const d = (s: string): CSSProperties => ({ "--pn": s } as CSSProperties);

/**
 * Section 02 — the baker. A single vertical panel (the generated character
 * portrait) reveals with a direction-aware clip-path wipe — like a new
 * webtoon cut being laid down. As the panel resolves, a speech-bubble
 * narration arrives beside it: the baker's voice, set glyph-by-glyph so it
 * reads as someone speaking, not a caption printed all at once.
 *
 * The bubble points at the panel; the text is real Korean copy with an
 * English voice beneath, both first-class. The panel's pre-reveal state
 * (clip-path inset, the bubble hidden) is gated behind `.ppang-js` and the
 * panel's `is-visible` class, so with JS off the portrait and its caption
 * are simply there.
 */
export default function BakerIntro() {
  return (
    <section
      className="ppang-baker"
      aria-labelledby="ppang-baker-title"
      data-reveal=""
    >
      <div className="ppang-sechead">
        <p className="ppang-eyebrow" aria-hidden="true">
          01 화 · 제빵사 <span lang="en">/ the baker</span>
        </p>
        <h2 className="ppang-sechead__title" id="ppang-baker-title">
          할머니의 빵집을
          <br />
          이어받은 손
        </h2>
        <p className="ppang-sechead__title-en" lang="en">
          Hands that inherited a grandmother’s bakery
        </p>
      </div>

      <div className="ppang-baker__stage">
        <figure className="ppang-panel ppang-baker__panel" data-reveal="panel">
          <div className="ppang-panel__mount">
            <Picture
              className="ppang-panel__art"
              stem="baker-character"
              width={832}
              height={1216}
              alt="젊은 제빵사 — 앞치마를 두르고 반죽 위에 손을 얹은, 새벽 빵집의 주인. 따뜻한 빛이 창문으로 들어온다. / The baker — a young woman in an apron, hands resting on dough in the dawn bakery, warm light through the window."
            />
            {/* panel number, like a webtoon cut marker */}
            <span className="ppang-panel__no" aria-hidden="true">
              01
            </span>
          </div>
        </figure>

        {/* the speech bubble — points left at the portrait */}
        <aside
          className="ppang-bubble"
          aria-label="제빵사의 말 / the baker's words"
        >
          <span className="ppang-bubble__tail" aria-hidden="true" />
          <p className="ppang-bubble__kr" lang="ko">
            <span className="ppang-sr">
              할머니는 빵이 깨어나는 시간에 일하셨대요. 저도 그 시간에 일해요.
            </span>
            <span aria-hidden="true" className="ppang-bubble__row">
              <Narration text="할머니는 빵이 깨어나는" start={0} step={48} />
              <br />
              <Narration text="시간에 일하셨대요." start={900} step={48} />
              <br />
              <Narration text="저도 그 시간에 일해요." start={2100} step={48} />
            </span>
          </p>
          <p className="ppang-bubble__en" lang="en" style={d("2400ms")}>
            <em>
              Grandma worked the hour the bread wakes. So do I.
            </em>
          </p>
        </aside>
      </div>
    </section>
  );
}
