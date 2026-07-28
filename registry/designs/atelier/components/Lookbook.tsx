"use client";

import { useRef } from "react";
import { useLookProgress } from "../hooks/useLookProgress";
import { LOOKS } from "./looks";

/**
 * Section 02 — the lookbook, pinned and scrubbed. The signature moment.
 *
 * The outer section is 420vh tall (LOOKS × ~84vh of runway + the closing
 * beat). Its inner `.atelier-lookbook__sticky` is `position: sticky; top: 0;
 * height: 100vh` — the magazine held open while you scroll. As you scroll
 * through the runway, `useLookProgress` writes `--atelier-page` (0→1, lerped
 * at 0.14) onto the sticky element. The five looks read that one number and
 * crossfade — opacity plus a 1.5% scale, never a layout property — so the
 * page genuinely *turns*: each look holds, dissolves into the next, the
 * editorial frame never moves.
 *
 * Every "photograph" is a CSS-gradient editorial block (defined in
 * styles.css from palette tokens): silk is a vertical bone-to-ink gradient
 * under a diagonal gold light; wool is horizontal grays; organza a radial
 * wash; the trench a wide diagonal with a single gold seam; the gown a
 * near-black field with a paper spine. Not a raster pixel anywhere.
 *
 * Each look is also a real piece of content in the DOM — fully readable as a
 * static list without JavaScript, in source order, with bilingual captions.
 * The crossfade is a *reveal* of already-present content, so it stays live
 * (un-smoothed) under reduced motion.
 */
export default function Lookbook() {
  const pinRef = useRef<HTMLElement | null>(null);
  useLookProgress(pinRef, "--atelier-page");

  return (
    <section
      className="atelier-lookbook"
      aria-labelledby="atelier-lookbook-title"
      ref={pinRef}
    >
      <h2 id="atelier-lookbook-title" className="atelier-visually-hidden">
        The lookbook — five looks · 룩북 — 다섯 룩
      </h2>

      <div className="atelier-lookbook__sticky">
        <div className="atelier-lookbook__chrome" aria-hidden="true">
          <span className="atelier-folio">RESERVE · f/w</span>
          <span className="atelier-folio atelier-folio--mid">
            the lookbook · 룩북
          </span>
          <span className="atelier-folio atelier-folio--right">
            <span className="atelier-lookbook__progress">01</span> / 05
          </span>
        </div>

        <ol className="atelier-looks" role="list">
          {LOOKS.map((look) => (
            <li
              key={look.id}
              className="atelier-look"
              data-look={look.id}
              aria-label={`Look ${look.no} — ${look.name}. ${look.line}`}
            >
              <div
                className={`atelier-look__frame ${look.swatch}`}
                aria-hidden="true"
              />

              <div className="atelier-look__caption">
                <p className="atelier-look__no">{look.no}</p>
                <p className="atelier-look__divider" aria-hidden="true">
                  ·
                </p>
                <h3 className="atelier-look__name">
                  {look.name}{" "}
                  <span lang="ko" className="atelier-look__nameko">
                    {look.nameKo}
                  </span>
                </h3>
                <p className="atelier-look__fabric">
                  {look.fabric}{" "}
                  <span lang="ko" className="atelier-look__fabricko">
                    {look.fabricKo}
                  </span>
                </p>
                <p className="atelier-look__line">{look.line}</p>
                <p className="atelier-look__line" lang="ko">
                  {look.lineKo}
                </p>
              </div>
            </li>
          ))}
        </ol>

        <p className="atelier-lookbook__hint" aria-hidden="true">
          scroll to turn · <span lang="ko">스크롤이 곧 페이지 넘김</span>
        </p>
      </div>
    </section>
  );
}
