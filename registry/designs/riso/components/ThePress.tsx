"use client";

import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import { useScrollProgress } from "../hooks/useScrollProgress";

/**
 * Section 02 — THE PRESS (signature). A pinned scene whose timeline is the
 * scroll: as you scroll through the tall section, three spot-color drums
 * drop onto the sheet one after another — fluorescent pink, then riso blue,
 * then riso yellow — each blending with mix-blend-mode: multiply so the
 * overlaps darken like real overprinted ink. `--riso-press` (0→1, driven by
 * useScrollProgress) is split into three phases in CSS:
 *
 *   pink   rises 0.00 → 0.33
 *   blue   rises 0.33 → 0.66
 *   yellow rises 0.66 → 1.00
 *
 * A crosshair register in the middle, a folio counter on the side, and the
 * three drum names that light up as their phase opens. The art on the sheet
 * is one continuous SVG (a folded-book / cinema-reel glyph) drawn in ink so
 * the colored plates read as transparent ink layers laid over it.
 *
 * CSS fallback `var(--riso-press, 1)` means no-JS / reduced-motion shows the
 * fully printed sheet (all three drums down) — the SSR state IS the finished
 * print. The hook only writes the one custom property; nothing else moves.
 */
export default function ThePress() {
  const reduced = usePrefersReducedMotion();
  const sectionRef = useScrollProgress<HTMLDivElement>(reduced);

  return (
    <section
      id="riso-press"
      className="riso-press"
      ref={sectionRef}
      aria-labelledby="riso-press-title"
    >
      <div className="riso-press__pin">
        <div className="riso-press__head">
          <span className="riso-secnum" aria-hidden="true">02</span>
          <h2 className="riso-secnum__title" id="riso-press-title">
            The press <span lang="ko">인쇄기</span>
          </h2>
          <p className="riso-press__instr">
            <span>Scroll to pull the drums.</span>{" "}
            <span lang="ko">스크롤하면 도수가 쌓입니다.</span>
          </p>
        </div>

        <div className="riso-press__stage" role="img" aria-labelledby="riso-press-stage-cap">
          <p className="riso-vh" id="riso-press-stage-cap">
            A print sheet building up in three fluorescent spot colors as you
            scroll: pink, then blue, then yellow, each overprinting the last.
            스크롤에 따라 형광 핑크, 블루, 옐로 도수가 차례로 겹쳐 인쇄되는 판.
          </p>

          {/* The sheet: ink line-art underneath, three multiplying plates on top. */}
          <div className="riso-sheet">
            {/* ink base — the drawn glyph, always visible */}
            <svg className="riso-sheet__ink" viewBox="0 0 400 300" width="400" height="300" aria-hidden="true" focusable="false">
              {/* a folded book opening into a film reel */}
              <g fill="none" stroke="var(--riso-ink)" strokeWidth="2.4" strokeLinejoin="round" strokeLinecap="round">
                {/* book spread */}
                <path d="M200 70 L120 100 L120 230 L200 210 L280 230 L280 100 Z" />
                <line x1="200" y1="70" x2="200" y2="210" />
                {/* pages lines */}
                <path d="M132 120 L188 100 M132 140 L188 120 M132 160 L188 140" />
                <path d="M212 100 L268 120 M212 120 L268 140 M212 140 L268 160" />
                {/* film reel spilling out */}
                <circle cx="200" cy="210" r="34" />
                <circle cx="200" cy="210" r="8" fill="var(--riso-ink)" />
                {/* sprocket holes on the film strip */}
                <path d="M150 250 L250 250" />
                <g fill="var(--riso-ink)">
                  <rect x="156" y="246" width="6" height="8" />
                  <rect x="176" y="246" width="6" height="8" />
                  <rect x="196" y="246" width="6" height="8" />
                  <rect x="216" y="246" width="6" height="8" />
                  <rect x="236" y="246" width="6" height="8" />
                </g>
              </g>
            </svg>

            {/* register crosshair center */}
            <span className="riso-sheet__reg" aria-hidden="true" />

            {/* the three drum plates — opacity gated by --riso-press phases,
                multiply so overlaps darken. Halftone-dot fields via CSS. */}
            <span className="riso-plate riso-plate--pink" aria-hidden="true">
              <span className="riso-plate__dots riso-plate__dots--pink" />
            </span>
            <span className="riso-plate riso-plate--blue" aria-hidden="true">
              <span className="riso-plate__dots riso-plate__dots--blue" />
            </span>
            <span className="riso-plate riso-plate--yellow" aria-hidden="true">
              <span className="riso-plate__dots riso-plate__dots--yellow" />
            </span>

            {/* drum legend — lights up as each phase opens */}
            <ul className="riso-press__drums" aria-hidden="true">
              <li className="riso-press__drum riso-press__drum--pink">
                <span className="riso-press__swatch riso-press__swatch--pink" />
                <span className="riso-press__drum-name">FLUO PINK <span lang="ko">형광 핑크</span></span>
                <span className="riso-press__drum-no">01</span>
              </li>
              <li className="riso-press__drum riso-press__drum--blue">
                <span className="riso-press__swatch riso-press__swatch--blue" />
                <span className="riso-press__drum-name">RISO BLUE <span lang="ko">리소 블루</span></span>
                <span className="riso-press__drum-no">02</span>
              </li>
              <li className="riso-press__drum riso-press__drum--yellow">
                <span className="riso-press__swatch riso-press__swatch--yellow" />
                <span className="riso-press__drum-name">RISO YELLOW <span lang="ko">리소 옐로</span></span>
                <span className="riso-press__drum-no">03</span>
              </li>
            </ul>

            <span className="riso-sheet__folio">SHEET 014 / 3C / 오버프린트</span>
          </div>
        </div>
      </div>
    </section>
  );
}
