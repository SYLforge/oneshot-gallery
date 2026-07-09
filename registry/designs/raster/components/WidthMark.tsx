"use client";

import { Fragment, type CSSProperties } from "react";

/**
 * Accessible split text for the width-axis animation. The parent heading
 * carries the accessible name via `aria-label`; this span is `aria-hidden`
 * and purely visual — one <span> per glyph, each with a `--i` index for the
 * stagger. The entrance animation is opt-in: it only runs under `.raster-js`
 * when an ancestor carries `.is-on`, so without JavaScript the mark simply
 * stands at its certified width.
 *
 * Words are wrapped in nowrap spans separated by real spaces, so the mark
 * can break between words on narrow sheets but never inside one.
 */
export default function WidthMark({ text }: { text: string }) {
  const words = text.split(" ");
  const offsets: number[] = [];
  let acc = 0;
  for (const word of words) {
    offsets.push(acc);
    acc += word.length;
  }

  return (
    <span className="raster-mark" aria-hidden="true">
      {words.map((word, w) => (
        <Fragment key={`${w}-${word}`}>
          {w > 0 ? " " : null}
          <span className="raster-mark__word">
            {Array.from(word).map((ch, c) => (
              <span
                key={`${offsets[w] + c}-${ch}`}
                className="raster-mark__ch"
                style={{ "--i": offsets[w] + c } as CSSProperties}
              >
                {ch}
              </span>
            ))}
          </span>
        </Fragment>
      ))}
    </span>
  );
}
