"use client";

import { useEffect, useRef, useState } from "react";
import "./styles.css";
import { cormorantGaramond, shipporiMincho } from "./fonts";
import Hero from "./components/Hero";
import Ceremony from "./components/Ceremony";
import ChasenDraw from "./components/ChasenDraw";
import Tokonoma from "./components/Tokonoma";
import OneBowl from "./components/OneBowl";
import Colophon from "./components/Colophon";
import { usePrefersReducedMotion } from "./hooks/usePrefersReducedMotion";
import { useReveal } from "./hooks/useReveal";

/**
 * CHADŌ (茶道) — the way of tea. A virtual tea ceremony, paced like the
 * four-hour rite compressed into one scroll: each beat is a breath. The
 * aesthetic is extreme wabi-sabi — aged washi, warm ink (never pure black),
 * and a single living accent of matcha green. The hero's title is set in
 * tategaki (縦書き), the authentic vertical reading direction that almost
 * no Western "Japanese-inspired" site uses; the chasen whisk draws itself
 * as you breathe the bowl into being; the whole ceremony exists so that
 * one bowl of tea can be received with full attention.
 *
 * Everything on screen is code — the whisk is SVG, the bowl is SVG, the
 * paper is feTurbulence. No photograph would be still enough.
 *
 * `.chado-js` is added imperatively on mount (a signal to CSS that JS is
 * alive, never React state): every pre-reveal style is gated behind it, and
 * with JavaScript off the full ceremony simply stands finished. The breath
 * cue's `active` state is React's, because the cue genuinely depends on the
 * hero being in view — no point breathing for an empty room.
 */
export default function ChadoPage() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const heroRef = useRef<HTMLDivElement | null>(null);
  const reduced = usePrefersReducedMotion();
  const revealRef = useReveal<HTMLDivElement>(reduced);
  const [cueActive, setCueActive] = useState(false);

  useEffect(() => {
    rootRef.current?.classList.add("chado-js");
    window.parent?.postMessage({ type: "oneshot:ready", slug: "chado" }, "*");
  }, []);

  // The breath cue runs only while the hero is the room the guest is in.
  // One IntersectionObserver, no scroll handlers. Reduced-motion disables
  // it entirely (cue stays inactive — the ceremony is paced by the reader).
  useEffect(() => {
    if (reduced) return;
    const hero = heroRef.current;
    if (!hero || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(
      (hits) => {
        for (const hit of hits) setCueActive(hit.isIntersecting);
      },
      { threshold: 0.25 },
    );
    io.observe(hero);
    return () => io.disconnect();
  }, [reduced]);

  return (
    <div
      ref={rootRef}
      className={`${shipporiMincho.variable} ${cormorantGaramond.variable} chado-root`}
    >
      <div ref={revealRef} className="chado-ceremony-doc">
        <div ref={heroRef}>
          <Hero cueActive={cueActive} />
        </div>

        <main>
          <Ceremony />

          <ChasenDraw
            notes={
              <>
                <h3 className="chado-chashitsu__step-title" lang="ja">
                  点前、四つの動き
                </h3>
                <p className="chado-chashitsu__step-sub">
                  Four motions of the temae — scroll draws the whisk.
                </p>

                <ol className="chado-chashitsu__steps">
                  <li data-reveal>
                    <span className="chado-chashitsu__step-no">i.</span>
                    <p className="chado-beat__p chado-beat__p--ja" lang="ja">
                      茶杓で抹茶を茶碗に移す。山一杯の緑。
                    </p>
                    <p className="chado-beat__p chado-beat__p--en">
                      The chashaku lifts the matcha into the bowl — one
                      bamboo scoop, a small green mountain.
                    </p>
                  </li>
                  <li data-reveal>
                    <span className="chado-chashitsu__step-no">ii.</span>
                    <p className="chado-beat__p chado-beat__p--ja" lang="ja">
                      湯を少しだけ注ぐ。最初は、わずかに。
                    </p>
                    <p className="chado-beat__p chado-beat__p--en">
                      A little hot water, first — only a little. The paste
                      comes before the tea.
                    </p>
                  </li>
                  <li data-reveal>
                    <span className="chado-chashitsu__step-no">iii.</span>
                    <p className="chado-beat__p chado-beat__p--ja" lang="ja">
                      茶筅を動かす。まっすぐに、速く、前と後ろへ。
                    </p>
                    <p className="chado-beat__p chado-beat__p--en">
                      The chasen moves — straight, fast, front and back. The
                      tines you see drawing now are this motion.
                    </p>
                  </li>
                  <li data-reveal>
                    <span className="chado-chashitsu__step-no">iv.</span>
                    <p className="chado-beat__p chado-beat__p--ja" lang="ja">
                      泡が立つ。碗の緑が、雪で覆われる。
                    </p>
                    <p className="chado-beat__p chado-beat__p--en">
                      The foam rises. The green of the bowl is covered, at
                      last, in snow.
                    </p>
                  </li>
                </ol>
              </>
            }
          />

          <Tokonoma />
          <OneBowl />
        </main>

        <Colophon />
      </div>

      {/* Aged washi grain: one static feTurbulence pass over everything.
          Fibers, not film grain — it never animates. Stillness is the
          material. */}
      <svg className="chado-grain" aria-hidden="true" focusable="false">
        <filter id="chado-grain-f">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.62"
            numOctaves={2}
            seed="17"
            stitchTiles="stitch"
          />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.17  0 0 0 0 0.15  0 0 0 0 0.125  0 0 0 0.045 0"
          />
        </filter>
        <rect width="100%" height="100%" filter="url(#chado-grain-f)" />
      </svg>
    </div>
  );
}
