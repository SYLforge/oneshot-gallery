"use client";

import { Fragment, type CSSProperties } from "react";

/**
 * Accessible split text for the kinetic headlines. The parent element
 * carries the accessible name via `aria-label`; this span is `aria-hidden`
 * and purely visual — one <span> per glyph, each with a `--i` index used by
 * CSS for stagger. Words are wrapped in nowrap spans separated by real
 * spaces, so a headline can break between words on a narrow screen but
 * never inside one.
 *
 * The entrance animation is opt-in: it only runs under `.typewave-js` when
 * an ancestor carries `.is-on`, so without JavaScript the headline simply
 * stands at its resting state — fully readable, fully styled.
 */
export default function SplitText({ text }: { text: string }) {
  const words = text.split(" ");
  const offsets: number[] = [];
  let acc = 0;
  for (const word of words) {
    offsets.push(acc);
    acc += word.length;
  }

  return (
    <span className="typewave-split" aria-hidden="true">
      {words.map((word, w) => (
        <Fragment key={`${w}-${word}`}>
          {w > 0 ? " " : null}
          <span className="typewave-split__word">
            {Array.from(word).map((ch, c) => (
              <span
                key={`${offsets[w] + c}-${ch}`}
                className="typewave-split__ch"
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
