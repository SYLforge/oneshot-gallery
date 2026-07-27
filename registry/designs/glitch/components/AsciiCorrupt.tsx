"use client";

import { useAsciiScramble } from "../hooks/useAsciiScramble";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

/**
 * A broadcast ident drawn in ASCII: a stacked-carrier waveform inside a
 * degrading frame. It is the studio's logo as a signal — and the signal is
 * not well. Every 2.6s a slice of the glyphs corrupts for ~220ms, then the
 * figure resolves. 65% of cells are stable through every burst so the ident
 * stays readable; the corruption is ornament, not destruction.
 *
 * Reduced motion freezes the pristine figure (no scramble loop).
 */
const IDENT: string[] = [
  "┌──────────────────────────────────────────┐",
  "│ ▮▮▮▮▮▮▮▮▮▮▮▮▮ GLITCH/ID ◮▮▮▮▮▮▮▮▮▮▮▮▮▮ │",
  "│                                          │",
  "│      ░░░    ░░    ░░░░░    ░░░░░         │",
  "│    ░░░░░░  ░░░░  ░░░░░░░  ░░░░░░░░       │",
  "│   ░░░░░░░░ ░░░░░░░░░░░░░░░░░░░░░░░░       │",
  "│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░   │",
  "│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░    │",
  "│   ░░░░░░░░░ ░░░░░░░░░░░░░░░░░░░░░░░░      │",
  "│    ░░░░░░░  ░░░░  ░░░░░░░  ░░░░░░░        │",
  "│      ░░░    ░░    ░░░░░    ░░░░░          │",
  "│                                          │",
  "│ ◮▮▮▮▮▮▮▮▮▮▮▮ 3.1.4 / SIGNAL HELD ▮▮▮▮▮▮ │",
  "└──────────────────────────────────────────┘",
];

/** A short, denser signature block for narrow viewports. */
const IDENT_COMPACT: string[] = [
  "┌──────────────────────────┐",
  "│ ▮▮▮▮▮ GLITCH/ID ◮▮▮▮▮ │",
  "│                          │",
  "│    ░░░   ░░   ░░░░░      │",
  "│  ░░░░░░ ░░░░ ░░░░░░░     │",
  "│ ░░░░░░░░░░░░░░░░░░░░░░░  │",
  "│  ░░░░░░░░░░░░░░░░░░░░░   │",
  "│    ░░░   ░░   ░░░░░      │",
  "│                          │",
  "│ ◮▮▮ 3.1.4 / HELD ▮▮▮ │",
  "└──────────────────────────┘",
];

export default function AsciiCorrupt() {
  const reduced = usePrefersReducedMotion();
  const wide = useAsciiScramble(IDENT, undefined, reduced);
  const compact = useAsciiScramble(IDENT_COMPACT, undefined, reduced);

  return (
    <section className="gl-ascii" aria-labelledby="gl-ascii-title">
      <div className="gl-sechead" data-tear>
        <span className="gl-sechead__no" aria-hidden="true">
          03
        </span>
        <h2 className="gl-sechead__title" id="gl-ascii-title">
          the ident{" "}
          <span lang="ko" className="gl-sechead__ko">
            식별 신호
          </span>
        </h2>
      </div>

      <figure
        className="gl-ascii__stage"
        role="img"
        aria-label="An ASCII broadcast ident — a stacked-carrier waveform inside a degrading frame — that periodically corrupts and resolves. ASCII 식별 신호: 적재된 반송파 파형이 깨어진 프레임 안에서 주기적으로 손상되었다가 복원된다."
      >
        <pre className="gl-ascii__block gl-ascii__block--wide" aria-hidden="true">
          {wide.join("\n")}
        </pre>
        <pre
          className="gl-ascii__block gl-ascii__block--compact"
          aria-hidden="true"
        >
          {compact.join("\n")}
        </pre>
      </figure>

      <p className="gl-ascii__caption" data-tear>
        the figure stays. the noise moves.{" "}
        <span lang="ko">형상은 남고, 노이즈는 움직인다.</span>
      </p>
    </section>
  );
}
