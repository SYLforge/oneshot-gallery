"use client";

import type { ReactNode } from "react";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import { useScrollProgress } from "../hooks/useScrollProgress";

/**
 * The chasen (茶筅) draw-on — the second signature technique.
 *
 * The matcha preparation is shown as a brush-stroke draw-on: the bamboo
 * whisk's tines fan out from a single node as the guest scrolls, the bowl
 * fills beneath it, and only at the end does the matcha surface bloom — the
 * green that the whole ceremony was building toward. Every stroke is a
 * pathLength=1 path whose dashoffset is the inverse of scroll progress:
 *   stroke-dashoffset: calc(1 - var(--ch-scrub, 1))
 * The whisk draws exactly as far as the guest has scrolled, and no further.
 *
 * The scene pins (position: sticky inside a tall scene column) while the
 * accompanying text — the four-step preparation, set bilingually — flows
 * past. The scrub window is centered on the scene so the whisk moves only
 * while its chashitsu is the room you are in.
 *
 * Reduced motion / no JS: `--ch-scrub` defaults to 1, so every tine is
 * drawn and the bowl is full — a completed preparation, statically waiting.
 * The pin releases to a static figure.
 */
function Whisk() {
  // 17 bamboo tines fan from a node at (140, 96) up to the bowl rim.
  // pathLength=1 each so dashoffset math stays in the head.
  const tines = Array.from({ length: 17 }, (_, i) => {
    const t = i / 16; // 0..1 across the fan
    const spread = (t - 0.5) * 2; // -1..1
    const topX = 140 + spread * 46;
    const topY = 26 + Math.abs(spread) * 6; // slight arc, longer at center
    const cx = 140 + spread * 30;
    const cy = 64 + Math.abs(spread) * 3;
    return `M 140 96 C ${cx} ${cy}, ${cx - spread * 4} ${
      (cy + topY) / 2
    }, ${topX} ${topY}`;
  });

  return (
    <g className="chado-chasen__group">
      {/* the handle — a single bamboo prong descending from the node */}
      <path
        className="chado-chasen__handle"
        d="M 140 96 C 138 120, 137 140, 136 158"
        pathLength={1}
      />
      {/* the node where the tines are bound */}
      <ellipse
        className="chado-chasen__node"
        cx="140"
        cy="96"
        rx="13"
        ry="4.2"
      />
      {/* the fanning tines — drawn progressively by scroll */}
      {tines.map((d, i) => (
        <path
          key={i}
          className={`chado-chasen__tine${
            i % 3 === 0 ? " chado-chasen__tine--inner" : ""
          }`}
          d={d}
          pathLength={1}
        />
      ))}
    </g>
  );
}

function Bowl() {
  return (
    <g className="chado-bowl__group">
      {/* the chawan outline — one continuous tea-bowl stroke */}
      <path
        className="chado-bowl__shell"
        d="M 70 200 C 74 250, 102 282, 140 282 C 178 282, 206 250, 210 200 Z"
        pathLength={1}
      />
      {/* the rim ellipse, seen from above */}
      <ellipse
        className="chado-bowl__rim"
        cx="140"
        cy="200"
        rx="70"
        ry="13"
      />
      {/* the matcha surface — blooms in only as preparation completes
          (opacity calc(scrub·5 − 4) maps scrub 0.8→1 onto 0→1) */}
      <ellipse
        className="chado-bowl__tea"
        cx="140"
        cy="201"
        rx="62"
        ry="9.5"
      />
      {/* the foam — two small crescents where the whisk has passed */}
      <path
        className="chado-bowl__foam"
        d="M 112 199 q 12 -5 24 0 M 150 202 q 10 -4 20 0"
        pathLength={1}
      />
    </g>
  );
}

export default function ChasenDraw({ notes }: { notes: ReactNode }) {
  const reduced = usePrefersReducedMotion();
  const sceneRef = useScrollProgress<HTMLDivElement>(reduced);

  return (
    <section
      id="chado-preparation"
      className="chado-chashitsu"
      aria-labelledby="chado-preparation-title"
    >
      <header className="chado-chashitsu__head" data-reveal>
        <p className="chado-kicker">
          <span lang="ja">点前</span> · The Preparation
        </p>
        <h2
          id="chado-preparation-title"
          className="chado-section-title"
          lang="ja"
        >
          茶筅が描く一服
        </h2>
        <p className="chado-section-sub">
          A bowl drawn by the whisk — chasen, bowl, breath.
        </p>
      </header>

      <div ref={sceneRef} className="chado-chashitsu__scene">
        <figure className="chado-chashitsu__plate">
          <svg
            className="chado-chashitsu__art"
            viewBox="0 0 280 300"
            role="img"
            aria-labelledby="chado-chasen-label"
          >
            <title id="chado-chasen-label">
              茶筅が茶碗の上で点てる図 — 竹の茶筅がスクロールに合わせて 그림지며,
              한 그릇의 말차가 완성된다. The bamboo chasen whisking above the
              chawan; its tines draw as you scroll, until one bowl of matcha
              is complete.
            </title>
            <Whisk />
            <Bowl />
          </svg>
          <figcaption className="chado-chashitsu__cap">
            <span lang="ja">
              図 · 茶筅（ちゃせん）— 竹を割って曲げた七十本の穂が、一碗の泡を立てる。
            </span>
            <em>
              Plate · the chasen — bamboo split and bent into seventy tines,
              which raise the foam of a single bowl.
            </em>
          </figcaption>
        </figure>

        <div className="chado-chashitsu__text">{notes}</div>
      </div>
    </section>
  );
}
