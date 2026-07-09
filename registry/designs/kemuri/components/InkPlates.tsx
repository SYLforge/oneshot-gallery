"use client";

import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

/** Displacement at the moment a plate enters view — pure weather. */
const SETTLE_FROM = 110;
/** How long the ink takes to settle (ms). */
const SETTLE_MS = 1900;

/**
 * Section 03 — the plates. Three sumi-e paintings, drawn entirely in SVG:
 * layered soft-edged ink shapes under a per-plate feTurbulence +
 * feDisplacementMap filter. While a plate waits below the fold its
 * displacement scale sits at 110 — the ink is still water. As it enters the
 * viewport, a rAF loop eases the *scale attribute* down to 0 and the
 * painting settles into itself. Only the displacement scale animates; the
 * turbulence (baseFrequency, seed) never changes, so the noise texture is
 * computed once and each frame pays displacement only.
 *
 * With JavaScript off the markup scale is already 0: the plates are simply
 * finished paintings. Under reduced motion they are never disturbed.
 */
export default function InkPlates() {
  const listRef = useRef<HTMLDivElement | null>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const figures = Array.from(
      list.querySelectorAll<HTMLElement>(".kemuri-plate"),
    );

    if (reduced || !("IntersectionObserver" in window)) {
      for (const fig of figures) fig.classList.add("is-inked");
      return;
    }

    const rafs = new Set<number>();
    // Raise the chaos only now that JS is known to be alive — before this
    // line (and forever, without JS) the paintings rest settled.
    const maps = new Map<HTMLElement, SVGFEDisplacementMapElement>();
    for (const fig of figures) {
      const fe = fig.querySelector("feDisplacementMap");
      if (!fe) continue;
      fe.setAttribute("scale", String(SETTLE_FROM));
      maps.set(fig, fe as SVGFEDisplacementMapElement);
    }

    const settle = (fig: HTMLElement) => {
      const fe = maps.get(fig);
      fig.classList.add("is-inked");
      if (!fe) return;
      const t0 = performance.now();
      const tick = (now: number) => {
        const p = Math.min((now - t0) / SETTLE_MS, 1);
        const ease = 1 - (1 - p) * (1 - p) * (1 - p); // cubic out — a sigh
        fe.setAttribute("scale", String(SETTLE_FROM * (1 - ease)));
        if (p < 1) rafs.add(requestAnimationFrame(tick));
      };
      rafs.add(requestAnimationFrame(tick));
    };

    const io = new IntersectionObserver(
      (hits) => {
        for (const hit of hits) {
          if (!hit.isIntersecting) continue;
          io.unobserve(hit.target);
          settle(hit.target as HTMLElement);
        }
      },
      { threshold: 0.4 },
    );
    for (const fig of figures) io.observe(fig);

    return () => {
      io.disconnect();
      for (const id of rafs) cancelAnimationFrame(id);
    };
  }, [reduced]);

  return (
    <section className="kemuri-plates" aria-labelledby="kemuri-plates-title">
      <div className="kemuri-sechead" data-reveal="">
        <p className="kemuri-eyebrow" aria-hidden="true">
          03 — 三枚の図版
        </p>
        <h2 className="kemuri-sechead__title" id="kemuri-plates-title">
          Three plates{" "}
          <span lang="ja" className="kemuri-sechead__ja">
            三枚の図版
          </span>
        </h2>
        <p className="kemuri-sechead__line">
          The plates are not photographs. They are ink that remembers being
          water.{" "}
          <span lang="ja" className="kemuri-sechead__lineja">
            この図版は写真ではない。水だったことを覚えている墨だ。
          </span>
        </p>
      </div>

      <div className="kemuri-plates__row" ref={listRef}>
        {/* ---- Plate I — distant mountains -------------------------------- */}
        <figure className="kemuri-plate">
          <div className="kemuri-plate__paper">
            <svg
              className="kemuri-plate__art"
              viewBox="0 0 440 560"
              role="img"
              aria-label="Sumi-e ink painting: three ranges of mountains dissolving into mist, a small gold sun low in the sky. 水墨画 — 霞に溶けていく三重の山なみ、低い空に小さな金の日。"
            >
              <defs>
                <filter id="kemuri-p1-settle" x="-14%" y="-14%" width="128%" height="128%">
                  <feTurbulence type="fractalNoise" baseFrequency="0.011 0.017" numOctaves="2" seed="19" result="w" />
                  <feDisplacementMap in="SourceGraphic" in2="w" scale="0" xChannelSelector="R" yChannelSelector="G" />
                </filter>
                <filter id="kemuri-p1-soft7"><feGaussianBlur stdDeviation="7" /></filter>
                <filter id="kemuri-p1-soft3"><feGaussianBlur stdDeviation="3" /></filter>
                <filter id="kemuri-p1-soft12"><feGaussianBlur stdDeviation="12" /></filter>
                <filter id="kemuri-p1-soft1"><feGaussianBlur stdDeviation="1.1" /></filter>
              </defs>
              <g filter="url(#kemuri-p1-settle)">
                <circle cx="330" cy="118" r="26" fill="#b08d4a" opacity="0.28" filter="url(#kemuri-p1-soft7)" />
                <circle cx="330" cy="118" r="19" fill="#b08d4a" opacity="0.8" />
                <path
                  d="M0 316 C60 288 118 302 168 292 C224 280 260 296 312 288 C360 282 404 292 440 284 L440 560 L0 560 Z"
                  fill="#8a8178"
                  opacity="0.3"
                  filter="url(#kemuri-p1-soft7)"
                />
                <path
                  d="M0 372 C48 358 96 330 148 302 C176 288 196 292 216 310 C262 350 320 362 440 356 L440 560 L0 560 Z"
                  fill="#8a8178"
                  opacity="0.52"
                  filter="url(#kemuri-p1-soft3)"
                />
                <rect x="-20" y="336" width="480" height="72" fill="#efe7d8" opacity="0.55" filter="url(#kemuri-p1-soft12)" />
                <path
                  d="M0 470 C70 440 140 452 210 436 C290 418 356 434 440 414 L440 560 L0 560 Z"
                  fill="#1c1814"
                  opacity="0.82"
                  filter="url(#kemuri-p1-soft1)"
                />
                <g stroke="#1c1814" fill="none" strokeLinecap="round" opacity="0.85">
                  <path d="M96 452 C94 440 98 432 92 420" strokeWidth="2.4" />
                  <path d="M92 424 L106 419" strokeWidth="1.4" />
                  <path d="M94 434 L81 429" strokeWidth="1.4" />
                  <path d="M89 419 L96 412" strokeWidth="1.2" />
                </g>
              </g>
            </svg>
          </div>
          <figcaption className="kemuri-plate__caption">
            <span className="kemuri-plate__no" aria-hidden="true">壱</span>
            <span lang="ja" className="kemuri-plate__ja">遠山 — 山は近づいてこない。それが山のやさしさ。</span>
            <span className="kemuri-plate__en">
              Distant mountains. They never come closer — that is their
              kindness.
            </span>
          </figcaption>
        </figure>

        {/* ---- Plate II — the bare branch ---------------------------------- */}
        <figure className="kemuri-plate">
          <div className="kemuri-plate__paper">
            <svg
              className="kemuri-plate__art"
              viewBox="0 0 440 560"
              role="img"
              aria-label="Sumi-e ink painting: a single bare branch reaching in from the right, one ember-colored bud at its tip. 水墨画 — 右から伸びる一本の枯枝、先端にひとつの熾色の芽。"
            >
              <defs>
                <filter id="kemuri-p2-settle" x="-14%" y="-14%" width="128%" height="128%">
                  <feTurbulence type="fractalNoise" baseFrequency="0.013 0.019" numOctaves="2" seed="31" result="w" />
                  <feDisplacementMap in="SourceGraphic" in2="w" scale="0" xChannelSelector="R" yChannelSelector="G" />
                </filter>
                <filter id="kemuri-p2-soft4"><feGaussianBlur stdDeviation="4" /></filter>
                <filter id="kemuri-p2-soft05"><feGaussianBlur stdDeviation="0.5" /></filter>
              </defs>
              <g filter="url(#kemuri-p2-settle)">
                {/* the branch's own memory — a wash shadow */}
                <g
                  transform="translate(7 12)"
                  stroke="#8a8178"
                  fill="none"
                  strokeLinecap="round"
                  opacity="0.22"
                  filter="url(#kemuri-p2-soft4)"
                >
                  <path d="M440 168 C360 178 300 196 246 224 C210 242 186 260 168 282" strokeWidth="7" />
                </g>
                <g
                  stroke="#1c1814"
                  fill="none"
                  strokeLinecap="round"
                  filter="url(#kemuri-p2-soft05)"
                >
                  {/* brush pressure: the same limb, three loads of ink */}
                  <path d="M440 168 C378 174 330 186 288 204" strokeWidth="7.5" opacity="0.92" />
                  <path d="M296 200 C258 218 216 240 190 262" strokeWidth="4.2" opacity="0.9" />
                  <path d="M196 258 C186 268 176 276 167 286" strokeWidth="2" opacity="0.88" />
                  {/* twigs */}
                  <path d="M312 196 C308 178 312 164 304 150" strokeWidth="2.2" opacity="0.85" />
                  <path d="M305 152 L310 136" strokeWidth="1.2" opacity="0.8" />
                  <path d="M258 222 C252 238 254 252 246 262" strokeWidth="1.9" opacity="0.8" />
                  <path d="M222 240 C216 230 218 220 212 212" strokeWidth="1.6" opacity="0.75" />
                  <path d="M182 270 L171 263" strokeWidth="1.2" opacity="0.7" />
                </g>
                {/* ink flecks — where the brush breathed */}
                <circle cx="332" cy="176" r="1.6" fill="#1c1814" opacity="0.4" />
                <circle cx="240" cy="238" r="1.2" fill="#1c1814" opacity="0.32" />
                {/* the one warm thing */}
                <circle cx="165" cy="288" r="9" fill="#c96f2e" opacity="0.22" filter="url(#kemuri-p2-soft4)" />
                <circle cx="165" cy="288" r="4.4" fill="#c96f2e" opacity="0.92" />
              </g>
            </svg>
          </div>
          <figcaption className="kemuri-plate__caption">
            <span className="kemuri-plate__no" aria-hidden="true">弐</span>
            <span lang="ja" className="kemuri-plate__ja">枯枝 — 枝は何も持たない。持たないことを、うまくやる。</span>
            <span className="kemuri-plate__en">
              A bare branch. It holds nothing, and holds it well.
            </span>
          </figcaption>
        </figure>

        {/* ---- Plate III — one stick of smoke ------------------------------ */}
        <figure className="kemuri-plate">
          <div className="kemuri-plate__paper">
            <svg
              className="kemuri-plate__art"
              viewBox="0 0 440 560"
              role="img"
              aria-label="Sumi-e ink painting: a censer at the foot of the paper, one stick of incense, a ribbon of smoke written upward in a single stroke. 水墨画 — 紙の裾に香炉、一本の線香、ひと筆で上へ書かれた煙。"
            >
              <defs>
                <filter id="kemuri-p3-settle" x="-14%" y="-14%" width="128%" height="128%">
                  <feTurbulence type="fractalNoise" baseFrequency="0.009 0.015" numOctaves="2" seed="47" result="w" />
                  <feDisplacementMap in="SourceGraphic" in2="w" scale="0" xChannelSelector="R" yChannelSelector="G" />
                </filter>
                <filter id="kemuri-p3-soft6"><feGaussianBlur stdDeviation="6" /></filter>
                <filter id="kemuri-p3-soft25"><feGaussianBlur stdDeviation="2.5" /></filter>
                <filter id="kemuri-p3-soft06"><feGaussianBlur stdDeviation="0.6" /></filter>
                <filter id="kemuri-p3-soft10"><feGaussianBlur stdDeviation="10" /></filter>
              </defs>
              <g filter="url(#kemuri-p3-settle)">
                {/* the smoke — one path, three loads of ink */}
                <g fill="none" strokeLinecap="round">
                  <path
                    d="M224 424 C218 384 244 356 228 316 C214 282 240 254 226 214 C216 182 236 158 228 122 C224 104 230 88 226 72"
                    stroke="#8a8178"
                    strokeWidth="13"
                    opacity="0.12"
                    filter="url(#kemuri-p3-soft6)"
                  />
                  <path
                    d="M224 424 C218 384 244 356 228 316 C214 282 240 254 226 214 C216 182 236 158 228 122 C224 104 230 88 226 72"
                    stroke="#8a8178"
                    strokeWidth="6"
                    opacity="0.2"
                    filter="url(#kemuri-p3-soft25)"
                  />
                  <path
                    d="M224 424 C218 384 244 356 228 316 C214 282 240 254 226 214 C216 182 236 158 228 122 C224 104 230 88 226 72"
                    stroke="#8a8178"
                    strokeWidth="2.2"
                    opacity="0.42"
                    filter="url(#kemuri-p3-soft06)"
                  />
                </g>
                <ellipse cx="226" cy="78" rx="32" ry="18" fill="#8a8178" opacity="0.13" filter="url(#kemuri-p3-soft10)" />
                {/* censer */}
                <path d="M180 470 C180 492 200 502 220 502 C240 502 260 492 260 470 Z" fill="#1c1814" fillOpacity="0.88" />
                <ellipse cx="220" cy="470" rx="40" ry="7" fill="#1c1814" fillOpacity="0.88" />
                <ellipse cx="220" cy="469" rx="33" ry="4.6" fill="#e3d7c0" />
                <path
                  d="M182 468 C190 464 205 462 220 462 C235 462 250 464 258 468"
                  fill="none"
                  stroke="#b08d4a"
                  strokeOpacity="0.8"
                  strokeWidth="1.3"
                />
                <g stroke="#1c1814" strokeWidth="3.6" strokeLinecap="round">
                  <path d="M196 500 L192 514" />
                  <path d="M220 503 L220 517" />
                  <path d="M244 500 L248 514" />
                </g>
                <ellipse cx="220" cy="468" rx="16" ry="3" fill="#8a8178" fillOpacity="0.5" />
                <path d="M220 468 L224 428" stroke="#1c1814" strokeWidth="1.6" strokeLinecap="round" />
                <circle cx="224" cy="428" r="2.4" fill="#c96f2e" />
              </g>
            </svg>
          </div>
          <figcaption className="kemuri-plate__caption">
            <span className="kemuri-plate__no" aria-hidden="true">参</span>
            <span lang="ja" className="kemuri-plate__ja">一炷 — 墨と水と、辛抱。煙も同じ書き方で書かれる。</span>
            <span className="kemuri-plate__en">
              One stick. Ink, water, patience — smoke is written the same way.
            </span>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
