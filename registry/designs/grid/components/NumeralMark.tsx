"use client";

import { Fragment, type CSSProperties } from "react";

/**
 * Accessible split text for the numeral-reveal animation. The parent
 * element carries the accessible name via `aria-label`; this span is
 * `aria-hidden` and purely visual — one <span> per glyph, each with a
 * `--i` index for the stagger. The entrance animation is opt-in: it only
 * runs under `.grid-js` when an ancestor carries `.is-on`, so without
 * JavaScript the numerals simply stand in place.
 *
 * Used for the oversized thin plate numbers and section titles. Where
 * RASTER's WidthMark splits to drive Archivo's width axis per glyph,
 * NumeralMark splits to fade-and-rise each glyph — a thinner, quieter
 * reveal that matches the atelier's register.
 *
 * Words are wrapped in nowrap spans separated by real spaces, so a long
 * number can break between words on a narrow sheet but never inside one.
 */
export default function NumeralMark({ text }: { text: string }) {
  const words = text.split(" ");
  const offsets: number[] = [];
  let acc = 0;
  for (const word of words) {
    offsets.push(acc);
    acc += word.length;
  }

  return (
    <span className="grid-nummark" aria-hidden="true">
      {words.map((word, w) => (
        <Fragment key={`${w}-${word}`}>
          {w > 0 ? " " : null}
          <span className="grid-nummark__word">
            {Array.from(word).map((ch, c) => (
              <span
                key={`${offsets[w] + c}-${ch}`}
                className="grid-nummark__ch"
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
