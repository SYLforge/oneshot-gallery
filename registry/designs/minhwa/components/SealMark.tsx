"use client";

type SealMarkProps = {
  className?: string;
  /**
   * The square seal's reading. Default is "民畵" (min·hwa) in a 2×2 세로쓰기
   * arrangement — right column first (民), left column second (畵), the way
   * a real Korean/Chinese seal is read.
   */
  chars?: [string, string] | [string, string, string, string];
  /** vermillion fill — defaults to the seal-red token via CSS. */
  fill?: string;
};

/**
 * A vermillion 인장 (seal stamp), drawn as crisp SVG so the Hangul stays
 * vector at any scale. The mark a minhwa painter presses onto a finished
 * work — "this one is done, this one is mine."
 *
 * Two layouts:
 *   2 chars  — a single column, one glyph stacked on the next.
 *   4 chars  — the classic 2×2 grid, read top-to-bottom in the right column
 *              then top-to-bottom in the left column (세로쓰기 / 右起).
 *
 * The fill defaults to the `--seal-red` token set in styles.css; passing a
 * literal fill is allowed for the obangsaek-tinted variant. The seal's
 * hammered rim (a slightly inset, uneven rect) is the one detail that stops
 * it reading as a flat red square — it is ink pressed into paper.
 */
export default function SealMark({
  className,
  chars = ["民", "畵"],
  fill,
}: SealMarkProps) {
  const isQuad = chars.length === 4;
  return (
    <svg
      className={`minhwa-sealmark ${className ?? ""}`}
      viewBox="0 0 120 120"
      role="img"
      aria-hidden="true"
      focusable="false"
    >
      {/* the stamp body — slightly rounded, with an inset double rim */}
      <rect
        x="3"
        y="3"
        width="114"
        height="114"
        rx="7"
        fill={fill ?? "var(--seal-red, #b6241b)"}
      />
      {/* inner rim — the hammered edge of a real carved seal */}
      <rect
        x="9"
        y="9"
        width="102"
        height="102"
        rx="4"
        fill="none"
        stroke="var(--baek, #fbf8ef)"
        strokeWidth="2.4"
        opacity="0.92"
      />
      {/* the glyphs — white (호분) carved-out characters, the way an actual
          seal prints: the field is red, the letters are the paper showing
          through the carved strokes. */}
      <g
        fill="var(--baek, #fbf8ef)"
        fontFamily="var(--font-display), 'Gaegu',cursive"
        textAnchor="middle"
        fontWeight={700}
      >
        {isQuad ? (
          <>
            {/* right column (read first): chars[0] top, chars[1] bottom */}
            <text x="74" y="54" fontSize="40">
              {chars[0]}
            </text>
            <text x="74" y="100" fontSize="40">
              {chars[1]}
            </text>
            {/* left column (read second): chars[2] top, chars[3] bottom */}
            <text x="40" y="54" fontSize="40">
              {chars[2]}
            </text>
            <text x="40" y="100" fontSize="40">
              {chars[3]}
            </text>
          </>
        ) : (
          <>
            {/* single column: chars[0] top, chars[1] bottom */}
            <text x="60" y="56" fontSize="44">
              {chars[0]}
            </text>
            <text x="60" y="102" fontSize="44">
              {chars[1]}
            </text>
          </>
        )}
      </g>
    </svg>
  );
}
