"use client";

import type { ReactNode } from "react";

/**
 * Margin apparatus of the essay.
 *
 * FnRef is the superscript marker inside a paragraph; Footnote is the note
 * itself, set in the margin rail (or, on narrow viewports, as an indented
 * note directly beneath its passage). The pair is linked both ways with
 * real anchors — #yb-fnref-N ↔ #yb-fn-N — so keyboard and screen-reader
 * users can travel to the note and back.
 *
 * Footnotes carry data-reveal="margin": at their scroll threshold they
 * slide in from the margin (translateX + opacity, JS-gated behind
 * .yeobaek-js). Without JavaScript, or under prefers-reduced-motion, they
 * are simply present.
 */

export function FnRef({ no }: { no: number }) {
  return (
    <sup className="yeobaek-fnref">
      <a id={`yb-fnref-${no}`} href={`#yb-fn-${no}`} aria-label={`각주 ${no}`}>
        {no}
      </a>
    </sup>
  );
}

type FootnoteProps = {
  no: number;
  children: ReactNode;
};

export default function Footnote({ no, children }: FootnoteProps) {
  return (
    <aside
      id={`yb-fn-${no}`}
      className="yeobaek-fn"
      role="note"
      data-reveal="margin"
    >
      <p className="yeobaek-fn__body">
        <span className="yeobaek-fn__no" aria-hidden="true">
          {no}
        </span>
        {children}{" "}
        <a
          className="yeobaek-fn__back"
          href={`#yb-fnref-${no}`}
          aria-label={`각주 ${no}에서 본문으로 돌아가기`}
        >
          ↩
        </a>
      </p>
    </aside>
  );
}
