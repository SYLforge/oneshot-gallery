"use client";

/**
 * The slate itself, drawn in SVG — no photography anywhere on this page.
 * A thin e-ink writing tablet, front view: warm bezel, matte screen, a
 * handwritten page mid-thought. Every color routes through the CSS tokens
 * so the device re-inks itself when the reading mode flips to sepia.
 *
 * The handwriting is a set of hand-authored quadratic squiggles — legible
 * as "writing", deliberately not as words. One amber underline is the only
 * color on the page, exactly like a real annotation.
 */
export default function DeviceArt() {
  return (
    <svg
      className="slate-device"
      viewBox="0 0 360 480"
      role="img"
      aria-label="The Hanji Slate — a thin e-ink writing tablet showing a handwritten page. 손글씨 페이지가 떠 있는 얇은 전자잉크 태블릿."
    >
      {/* body / bezel */}
      <rect
        x="10"
        y="10"
        width="340"
        height="460"
        rx="26"
        className="slate-device__bezel"
      />
      <rect
        x="14.5"
        y="14.5"
        width="331"
        height="451"
        rx="22"
        className="slate-device__bezelInner"
      />

      {/* side controls */}
      <rect x="348" y="96" width="5" height="48" rx="2.5" className="slate-device__button" />
      <rect x="348" y="156" width="5" height="30" rx="2.5" className="slate-device__button" />
      <rect x="164" y="466" width="32" height="5" rx="2.5" className="slate-device__port" />

      {/* screen */}
      <rect
        x="34"
        y="44"
        width="292"
        height="372"
        rx="9"
        className="slate-device__screen"
      />

      {/* page header */}
      <text x="52" y="76" className="slate-device__meta">
        SEP 12 · 09:41
      </text>
      <line x1="52" y1="88" x2="308" y2="88" className="slate-device__rule" />
      <text x="52" y="118" lang="ko" className="slate-device__heading">
        기억하는 종이.
      </text>

      {/* handwriting — quadratic squiggle lines, one amber annotation */}
      <g className="slate-device__ink">
        <path d="M52 150 q10 -7 20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0" />
        <path d="M52 176 q10 -6 20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0" />
        <path d="M52 202 q10 -7 20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0" />
        <path d="M52 228 q10 -6 20 0 t20 0 t20 0 t20 0 t20 0" />
        <path d="M52 268 q10 -7 20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0" />
        <path d="M52 294 q10 -6 20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0" />
        <path d="M52 320 q10 -7 20 0 t20 0 t20 0" />
      </g>
      <path
        d="M52 336 q30 5 60 0 t60 0"
        className="slate-device__annotation"
      />

      {/* page footer — indicator dot + folio */}
      <circle cx="180" cy="396" r="3" className="slate-device__dot" />
      <text x="308" y="401" textAnchor="end" className="slate-device__meta">
        34
      </text>
    </svg>
  );
}
