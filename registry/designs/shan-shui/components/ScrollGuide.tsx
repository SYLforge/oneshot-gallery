"use client";

import { useEffect, useRef } from "react";
import type { CSSProperties } from "react";
import Cadence from "./Cadence";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

/** The three-distance principle (三遠) of Guo Xi, 11th c. Each as a row. */
const DISTANCES = [
  {
    zh: "高遠",
    py: "gāo yuǎn",
    en: "high distance",
    note: "looking up at a peak — the mountain towers over you.",
    noteZh: "自山下而仰山巔 — 山勢巍然。",
  },
  {
    zh: "深遠",
    py: "shēn yuǎn",
    en: "deep distance",
    note: "looking past the near ridge into a hidden valley behind it.",
    noteZh: "自山前而窺山後 — 層巒深隱。",
  },
  {
    zh: "平遠",
    py: "píng yuǎn",
    en: "level distance",
    note: "looking across an even expanse, ridges dissolving into haze.",
    noteZh: "自近山而望遠山 — 漸入煙嵐。",
  },
];

/**
 * Section 02 — the scroll guide. A pinned scene (scroll-scrub-pinned) whose
 * inner layers part with parallax as you scroll: the three-distance principle
 * of Northern-Song literati painting (Guo Xi's Linquan Gaozhi), the hand-scroll
 * metaphor, and the depth principle this whole entry is built on — 远山如黛,
 * distance expressed as ink density, not perspective. The couplet reveals
 * glyph by glyph on the brush's cadence.
 *
 * `data-reveal="scene"` means the container hands `is-visible` to its
 * choreography but never animates itself.
 */
export default function ScrollGuide() {
  const artRef = useRef<HTMLDivElement | null>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const art = artRef.current;
    if (!art || reduced) return; // rests at --p: 0.5 under reduced motion

    // Drive the parallax layers' --p (0..1) from the section's progress
    // through the viewport: 0 when the stage enters at the bottom, 1 when it
    // leaves at the top. This is the scroll-scrub — the layers part like
    // depth as you read past the three-distance principle. The write is a
    // single custom property on one element; no layout, no re-render.
    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = art.getBoundingClientRect();
      const vh = window.innerHeight;
      // progress: -rect.top ranges from ~vh (just entered) to ~-rect.height
      // (just left). Normalize to 0..1 across that travel.
      const travel = vh + rect.height;
      const p = Math.max(0, Math.min(1, (vh - rect.top) / travel));
      art.style.setProperty("--p", p.toFixed(3));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [reduced]);

  return (
    <section
      className="shan-guide"
      aria-labelledby="shan-guide-title"
      data-reveal="scene"
    >
      <div className="shan-guide__stage">
        {/* The pinned parallax layers — translateY driven by --p (0..1)
            which the scroll listener below writes from the section's
            viewport progress. */}
        <div className="shan-guide__art" ref={artRef} aria-hidden="true">
          <span className="shan-guide__layer shan-guide__layer--far">
            遠
          </span>
          <span className="shan-guide__layer shan-guide__layer--mid">
            山
          </span>
          <span className="shan-guide__layer shan-guide__layer--near">
            如
          </span>
          <span className="shan-guide__layer shan-guide__layer--fg">
            黛
          </span>
        </div>

        <div className="shan-guide__copy">
          <p className="shan-eyebrow" aria-hidden="true">
            02 — 三遠 · the three distances
          </p>
          <h2 className="shan-guide__title" id="shan-guide-title">
            Distant mountains are like eyebrow pigment.{" "}
            <span lang="zh" className="shan-guide__titlezh">
              遠山如黛
            </span>
          </h2>
          <p className="shan-guide__lede">
            In a Chinese landscape, distance is not measured in paces. It is
            measured in ink — the farther a ridge, the paler it washes, until
            the horizon is almost the paper itself.{" "}
            <span lang="zh" className="shan-guide__ledezh">
              山水之中，遠近不以步量，以墨濃淡。山愈遠，色愈淡，至天際幾近於紙。
            </span>
          </p>

          <ol className="shan-guide__distances">
            {DISTANCES.map((d, i) => (
              <li
                key={d.zh}
                className="shan-guide__row"
                style={{ "--kd": `${i * 110}ms` } as CSSProperties}
              >
                <span className="shan-guide__zh" lang="zh">
                  {d.zh}
                </span>
                <span className="shan-guide__py">{d.py}</span>
                <span className="shan-guide__en">“{d.en}”</span>
                <span className="shan-guide__note">
                  {d.note}{" "}
                  <span lang="zh" className="shan-guide__notezh">
                    {d.noteZh}
                  </span>
                </span>
              </li>
            ))}
          </ol>

          <p className="shan-guide__couplet">
            <Cadence
              text="一山一水，皆從墨中來。"
              lang="zh"
              step={140}
              start={400}
            />
          </p>
          <p className="shan-guide__couplet-en">
            <em>
              Every mountain, every river — arrives out of ink.
            </em>
          </p>
        </div>
      </div>
    </section>
  );
}
