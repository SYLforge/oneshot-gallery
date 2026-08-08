"use client";

import type { CSSProperties } from "react";
import { usePointerParallax } from "../hooks/usePointerParallax";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import WordRiver from "./WordRiver";

const TITLE = "FLOW";

/**
 * The arrival — 흐름, the river of words.
 *
 * The hero is the page's first read, and the WordRiver's frame. The canvas
 * fills the hero as a living backdrop; the wordmark floats over it at three
 * depths of its own — the giant FLOW leans with the pointer (char-split
 * reveal, each glyph drifting in from the side on mount), the Korean 흐름
 * sits beneath as a quiet subtitle, and the lede holds the visitor's eye at
 * the centre. The whole hero leans gently toward the cursor via the shared
 * pointer-parallax hook, so the title reads as weightless over the river.
 */
export default function FlowHero() {
  const reduced = usePrefersReducedMotion();
  const parallaxRef = usePointerParallax<HTMLDivElement>(reduced);

  return (
    <header id="flow-hero" className="flow-hero">
      {/* The river fills the hero as a living backdrop. aria-hidden: the
          words drift for atmosphere, not content — the lede carries the
          meaning for screen readers. */}
      <div className="flow-hero__river" aria-hidden="true">
        <WordRiver />
      </div>

      {/* a soft sky wash over the river's top and bottom so the wordmark
          always has readable negative space regardless of which words drift
          past */}
      <div className="flow-hero__veil" aria-hidden="true" />

      <div ref={parallaxRef} className="flow-hero__copy" data-reveal="">
        <p className="flow-kicker">
          <span lang="ko">글자의 강</span> · RIVER OF WORDS
        </p>
        <h1 className="flow-title" aria-label="FLOW 흐름">
          {TITLE.split("").map((ch, i) => (
            <span
              key={i}
              aria-hidden="true"
              className="flow-glyph"
              style={{ "--flow-i": i } as CSSProperties}
            >
              {ch}
            </span>
          ))}
          <span lang="ko" className="flow-title__ko">
            흐름
          </span>
        </h1>
        <p className="flow-sub">
          <span lang="ko">글자가 강처럼 흐른다. 멈추지 않고, 서두르지 않고.</span>
          <span className="flow-sub__en">
            Letters drift like a stream — never stopping, never hurrying.
          </span>
        </p>
        <p className="flow-hero__hint">
          <span lang="ko">손을 흘려보내면 글자가 갈라진다</span>
          <span className="flow-hero__hint-en">
            · move your hand and the words part
          </span>
        </p>
      </div>
    </header>
  );
}
