"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import "./styles.css";
import { vt323, notoSansKR } from "./fonts";
import { useReveal } from "./hooks/useReveal";
import { usePrefersReducedMotion } from "./hooks/usePrefersReducedMotion";

const TITLE = "CRT DREAM";

/**
 * CRT DREAM CRT 드림 — the warm light of 2003. The signature is the CRT
 * itself: scanlines (a repeating horizontal gradient overlay), a barrel
 * vignette darkening the glass corners, and amber phosphor glow stacked on
 * the wordmark so the letters bloom fuzzy like a real tube left on at 3 AM.
 * A faint screen flicker (opacity wobble) is gated behind reduced-motion.
 *
 * `.crt-dream-js` is added on mount so the no-JS markup is the finished
 * page: scanlines resting, wordmark lit, copy readable.
 */
export default function CrtDreamPage() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const reduced = usePrefersReducedMotion();
  const revealRef = useReveal<HTMLDivElement>();

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    root.classList.add("crt-dream-js");
    const id = requestAnimationFrame(() => root.classList.add("is-mounted"));
    window.parent?.postMessage({ type: "oneshot:ready", slug: "crt-dream" }, "*");
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div
      ref={rootRef}
      className={`${vt323.variable} ${notoSansKR.variable} crt-dream-root`}
    >
      <div ref={revealRef} className="crt-dream-doc">
        <header className="crt-dream-hero" data-reveal="">
          <p className="cd-readout cd-readout--top">
            <span lang="ko">주파수</span> CH 03 · 60Hz ·{" "}
            <span lang="ko">호박색 형광체</span> AMBER PHOSPHOR
          </p>
          <h1 className="cd-title" aria-label={TITLE}>
            <span aria-hidden="true" className="cd-title__row">
              {TITLE.split("").map((ch, i) => (
                <span
                  key={i}
                  className="crt-dream-glyph"
                  style={{ "--cd-i": i } as CSSProperties}
                >
                  {ch === " " ? "\u00A0" : ch}
                </span>
              ))}
            </span>
            <span lang="ko" className="cd-title__kr" aria-hidden="true">
              CRT 드림
            </span>
          </h1>
          <p className="cd-sub" data-reveal="">
            <span lang="ko">2003년의 빛.</span> The warm light of 2003 — a screen
            left on at 3 AM, scanlines drifting, edges gone soft.
          </p>
        </header>

        <section className="cd-screen" aria-labelledby="cd-screen-title">
          <div className="cd-sechead" data-reveal="">
            <p className="cd-eyebrow">
              02 — <span lang="ko">화면</span> · the screen
            </p>
            <h2 id="cd-screen-title" className="cd-secthead__title">
              now playing
            </h2>
            <p className="cd-secthead__kr" lang="ko">
              아무것도 틀어두지 않은 밤의 화면.
            </p>
          </div>

          {/* The CRT bezel — a framed tube with vignette + scanlines. */}
          <div className="cd-tube" data-reveal="">
            <div className="cd-tube__glass">
              <pre className="cd-tube__ascii" aria-label="CRT test pattern: a No Signal diamond and channel readout">{`   ╔═══════════════════════╗
   ║   ◇ NO  SIGNAL ◇      ║
   ║      ╱╲    ╱╲          ║
   ║     ╱  ╲  ╱  ╲  CH 03  ║
   ║    ╱    ╲╱    ╲        ║
   ║   ───────────────      ║
   ║   ▒▒▒░░░  ▒▒▒░░░       ║
   ╚═══════════════════════╝`}</pre>
              <p className="cd-tube__line" lang="ko">
                새벽 3시 — 틀어둔 채 잠든 화면.
              </p>
              <p className="cd-tube__line cd-tube__line--en">
                3:00 AM — the set left on, dreaming.
              </p>
            </div>
          </div>
        </section>

        <section className="cd-notes" aria-labelledby="cd-notes-title">
          <p className="cd-eyebrow">
            03 — <span lang="ko">기억</span> · what stayed
          </p>
          <h2 id="cd-notes-title" className="cd-visually-hidden">
            기억 · what stayed
          </h2>
          <div className="cd-notegrid">
            <article className="cd-note" data-reveal="">
              <p className="cd-note__h">01 — <span lang="ko">주사선</span></p>
              <p className="cd-note__b">
                <span lang="ko">유리를 타고 내려오는 가로줄.</span> Horizontal
                lines drifting down the glass — the rhythm the eye never
                quite stopped seeing.
              </p>
            </article>
            <article className="cd-note" data-reveal="">
              <p className="cd-note__h">02 — <span lang="ko">빛번짐</span></p>
              <p className="cd-note__b">
                <span lang="ko">글자가 퍼지게 빛났다.</span> The letters glowed
                fuzzy — amber phosphor blooming past its own edge.
              </p>
            </article>
            <article className="cd-note" data-reveal="">
              <p className="cd-note__h">03 — <span lang="ko">모서리</span></p>
              <p className="cd-note__b">
                <span lang="ko">모서리는 늘 어두웠다.</span> The corners were
                always darker — a barrel of light that faded at the rim.
              </p>
            </article>
          </div>
        </section>

        <footer className="cd-foot" data-reveal="">
          <p className="cd-foot__brand">
            CRT DREAM <span lang="ko">CRT 드림</span> ·{" "}
            <span lang="ko">2003년의 빛</span>
          </p>
          <p className="cd-foot__line">
            <span lang="ko">순수 코드 — 이미지 없음.</span> Pure code · no
            images · MIT
          </p>
        </footer>
      </div>

      {/* CRT overlays — scanlines, vignette, faint flicker. Fixed, over all. */}
      <div className="cd-scanlines" aria-hidden="true" />
      <div className="cd-vignette" aria-hidden="true" />
      <div className="cd-flicker" aria-hidden="true" />
    </div>
  );
}
