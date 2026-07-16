"use client";

type SignProps = {
  className?: string;
  /** Tiny "open" lamp state on the sign — purely decorative. */
  lit?: boolean;
};

/**
 * The bakery sign, rendered as SVG so the Hangul (빵!) is crisp vector at
 * any resolution — the generated hero illustration carries NO text by
 * design, so the actual signage is painted here, on top of the awning.
 *
 * A small hanging board: warm paper card, brown frame, the wordmark in
 * Black Han Sans (set via the --font-display stack so next/font owns it),
 * a hand-painted "Bakery · 새벽빵집" line beneath, and a lit "OPEN" lamp
 * dot. The whole thing sways ±1.1° on a 6.2s cycle (see .ppang-sign in
 * styles.css) — the wind the commuters walk through. Decorative; the
 * accessible name is provided by the parent heading.
 */
export default function Sign({ className, lit = true }: SignProps) {
  return (
    <svg
      className={`ppang-sign ${lit ? "is-lit" : ""} ${className ?? ""}`}
      viewBox="0 0 240 200"
      role="img"
      aria-label="빵! 빵집 간판 — 작은 등불이 켜진 'OPEN' 표시. / PPANG! bakery sign — a small lit OPEN lamp."
      focusable="false"
    >
      {/* hanging chains */}
      <g stroke="#3d2817" strokeWidth="2.4" strokeLinecap="round" opacity="0.78">
        <path d="M70 0 L74 34" />
        <path d="M170 0 L166 34" />
      </g>
      {/* the bracket */}
      <path
        d="M58 30 L182 30 L176 42 L64 42 Z"
        fill="#6b513a"
        opacity="0.92"
      />
      {/* card */}
      <rect x="46" y="40" width="148" height="118" rx="6" fill="#faf6ee" />
      <rect
        x="46"
        y="40"
        width="148"
        height="118"
        rx="6"
        fill="none"
        stroke="#3d2817"
        strokeWidth="3"
      />
      {/* inner border, hand-painted */}
      <rect
        x="54"
        y="48"
        width="132"
        height="102"
        rx="3"
        fill="none"
        stroke="#e89b4c"
        strokeWidth="1.4"
        opacity="0.85"
      />

      {/* the wordmark — real text in the loaded Korean display face */}
      <text
        x="120"
        y="112"
        textAnchor="middle"
        fontFamily="var(--font-display), 'Black Han Sans', sans-serif"
        fontSize="56"
        fill="#3d2817"
        letterSpacing="1"
      >
        빵!
      </text>

      {/* the small line under it */}
      <text
        x="120"
        y="138"
        textAnchor="middle"
        fontFamily="var(--font-en), 'Fraunces', serif"
        fontSize="13"
        fill="#a85f1c"
        fontStyle="italic"
        letterSpacing="0.5"
      >
        Bakery · 새벽빵집
      </text>

      {/* the OPEN lamp — two stacked circles, the inner one breathes */}
      <circle cx="120" cy="22" r="7" fill="#3d2817" />
      <circle className="ppang-sign__lamp" cx="120" cy="22" r="4" fill="#e89b4c" />
    </svg>
  );
}
