"use client";

import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

/** Displacement at the moment a plate enters view — pure weather. */
const SETTLE_FROM = 110;
/** How long the ink takes to settle (ms). */
const SETTLE_MS = 1900;

/**
 * Section 03 — the plates. Three sumi-e paintings.
 *
 * The art itself is now generated: ComfyUI sumi-e plates living at
 * /media/kemuri/plate-N-*.avif. But the signature interaction survives —
 * "ink settling out of water" — because each painting is embedded inside
 * an SVG via `<image>` and wrapped in the SAME per-plate
 * feTurbulence + feDisplacementMap filter the vector version used. SVG
 * filters operate on raster art exactly as on vector art, so while a plate
 * waits below the fold its displacement scale sits at 110 (the painting is
 * still weather), and as it enters the viewport a rAF loop eases the
 * `scale` attribute down to 0 and the painting settles into itself. Only
 * the displacement scale animates; the turbulence (baseFrequency, seed)
 * never changes, so the noise texture is computed once and each frame pays
 * displacement only.
 *
 * With JavaScript off the markup scale is already 0: the plates are simply
 * finished paintings. Under reduced motion they are never disturbed.
 *
 * Why SVG `<image>` and not a plain `<img>` with `filter: url()`: keeping
 * the art inside the SVG lets the displacement region, filter primitives,
 * and the no-JS `scale="0"` markup contract stay byte-for-byte identical
 * to the vector version — the rAF loop still calls `setAttribute` on the
 * same `<feDisplacementMap>` element it always did.
 */

type Plate = {
  /** number glyph shown in the caption */
  no: "壱" | "弐" | "参";
  /** latin numeral used in filter ids (kemuri-pN-settle) — kept ASCII so the
   *  url(#...) reference and any CSS selector stay encoding-safe. */
  id: 1 | 2 | 3;
  /** filename stem under /media/kemuri/, e.g. "plate-1-distant-mountains". */
  stem: string;
  /** bilingual alt — same role="img" contract the vector version kept. */
  alt: string;
  /** per-plate turbulence seed (kept from the vector plates — same weather). */
  seed: number;
  /** per-plate turbulence baseFrequency (kept from the vector plates). */
  freq: string;
  caption: {
    no: "壱" | "弐" | "参";
    ja: string;
    en: string;
  };
};

const PLATES: readonly Plate[] = [
  {
    no: "壱",
    id: 1,
    stem: "plate-1-distant-mountains",
    seed: 19,
    freq: "0.011 0.017",
    alt: "Sumi-e ink painting: three ranges of mountains dissolving into mist, a small gold sun low in the sky. 水墨画 — 霞に溶けていく三重の山なみ、低い空に小さな金の日。",
    caption: {
      no: "壱",
      ja: "遠山 — 山は近づいてこない。それが山のやさしさ。",
      en: "Distant mountains. They never come closer — that is their kindness.",
    },
  },
  {
    no: "弐",
    id: 2,
    stem: "plate-2-bare-branch",
    seed: 31,
    freq: "0.013 0.019",
    alt: "Sumi-e ink painting: a single bare branch reaching in from the right, one ember-colored bud at its tip. 水墨画 — 右から伸びる一本の枯枝、先端にひとつの熾色の芽。",
    caption: {
      no: "弐",
      ja: "枯枝 — 枝は何も持たない。持たないことを、うまくやる。",
      en: "A bare branch. It holds nothing, and holds it well.",
    },
  },
  {
    no: "参",
    id: 3,
    stem: "plate-3-censer-smoke",
    seed: 47,
    freq: "0.009 0.015",
    alt: "Sumi-e ink painting: a censer at the foot of the paper, one stick of incense, a ribbon of smoke written upward in a single stroke. 水墨画 — 紙の裾に香炉、一本の線香、ひと筆で上へ書かれた煙。",
    caption: {
      no: "参",
      ja: "一炷 — 墨と水と、辛抱。煙も同じ書き方で書かれる。",
      en: "One stick. Ink, water, patience — smoke is written the same way.",
    },
  },
];

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
        {PLATES.map((plate) => (
          <figure className="kemuri-plate" key={plate.no}>
            <div className="kemuri-plate__paper">
              {/*
                The painting rides inside an SVG so the displacement-settle
                filter (feTurbulence + feDisplacementMap) can act on it.
                viewBox matches the vector plates' 440x560; the raster covers
                it via preserveAspectRatio="xMidYMid slice" (the paintings are
                3:4, near enough to fill the frame with a hair's crop).
                The filter region is padded -14%/128% so displaced pixels at
                the edge do not clamp — same as before.
              */}
              <svg
                className="kemuri-plate__art"
                viewBox="0 0 440 560"
                role="img"
                aria-label={plate.alt}
              >
                <defs>
                  <filter
                    id={`kemuri-p${plate.id}-settle`}
                    x="-14%"
                    y="-14%"
                    width="128%"
                    height="128%"
                  >
                    <feTurbulence
                      type="fractalNoise"
                      baseFrequency={plate.freq}
                      numOctaves="2"
                      seed={plate.seed}
                      result="w"
                    />
                    <feDisplacementMap
                      in="SourceGraphic"
                      in2="w"
                      scale="0"
                      xChannelSelector="R"
                      yChannelSelector="G"
                    />
                  </filter>
                </defs>
                <g filter={`url(#kemuri-p${plate.id}-settle)`}>
                  <image
                    href={`/media/kemuri/${plate.stem}.avif`}
                    x="0"
                    y="0"
                    width="440"
                    height="560"
                    preserveAspectRatio="xMidYMid slice"
                    // AVIF is decoded by every modern browser's SVG <image>;
                    // the WebP fallback for older engines is documented in
                    // PROMPT.md image-recipe. The plate's paper frame,
                    // hairline mount, and caption live in CSS unchanged.
                  />
                </g>
              </svg>
            </div>
            <figcaption className="kemuri-plate__caption">
              <span className="kemuri-plate__no" aria-hidden="true">
                {plate.caption.no}
              </span>
              <span lang="ja" className="kemuri-plate__ja">
                {plate.caption.ja}
              </span>
              <span className="kemuri-plate__en">{plate.caption.en}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
