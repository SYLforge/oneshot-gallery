"use client";

import type { CSSProperties } from "react";
import InkLink from "./InkLink";

const NAME = ["여", "백"];

/**
 * The cover. A literary journal's masthead is mostly restraint: the name,
 * one romanized deck line, one oxblood hairline, the issue line — and then
 * the cover simply *is* yeobaek, a page that demonstrates its own subject
 * by refusing to fill itself.
 *
 * The two characters of 여백 are split into aria-hidden spans behind the
 * h1's aria-label, so the staggered rise is per-glyph while assistive tech
 * reads one word. All cover choreography is CSS keyframes gated behind
 * .yeobaek-js; without JavaScript (or with reduced motion) the cover is
 * simply, fully there.
 */
export default function Masthead() {
  return (
    <header className="yeobaek-cover">
      <p className="yeobaek-cover__folio" aria-hidden="true">
        No. 07
      </p>

      <div className="yeobaek-cover__id">
        <h1 className="yeobaek-name" lang="ko" aria-label="여백">
          {NAME.map((ch, i) => (
            <span
              key={`${ch}-${i}`}
              aria-hidden="true"
              className="yeobaek-name__ch"
              style={{ "--yb-ci": i } as CSSProperties}
            >
              {ch}
            </span>
          ))}
        </h1>
        <p className="yeobaek-cover__deck">
          YEOBAEK · The Journal of Blank Space
        </p>
        <div className="yeobaek-cover__rule" aria-hidden="true" />
        <p className="yeobaek-cover__issue" lang="ko">
          No. 07 · 여백 특집 · 2026 겨울
        </p>
      </div>

      <div className="yeobaek-cover__foot">
        <p className="yeobaek-cover__begin">
          <InkLink href="#yb-essay">
            <span lang="ko">본문으로</span> — Begin reading
          </InkLink>
        </p>
        <p className="yeobaek-cover__epigraph">
          <span lang="ko">여백은 비어 있지 않다.</span>{" "}
          <em>Blank space is not empty.</em>
        </p>
      </div>
    </header>
  );
}
