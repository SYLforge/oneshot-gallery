"use client";

import { useBreathPace, type BreathPhase } from "../hooks/useBreathPace";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

/**
 * The breath-paced cue — the ceremonial clock of the page.
 *
 * A small matcha circle breathes on a 4-4-4 cycle (inhale · hold · exhale ·
 * rest), and under it a romanized label cross-fades as the phase turns. The
 * cue is the only thing on the hero that moves; everything else waits. It is
 * the mechanic that makes the page feel paced like a tea rite rather than a
 * landing page.
 *
 * - The scale is a CSS animation keyed off `data-breath={phase}` so it runs
 *   off the compositor (transform only), not off React state per frame.
 * - `useBreathPace` returns the phase; reduced motion pins it to "rest" and
 *   the circle simply sits, full and still.
 * - `active` pauses the cycle when the hero leaves the viewport (handled by
 *   the parent via an IntersectionObserver), so no timer runs offscreen.
 *
 * The cue never blocks reading: it is decorative (aria-hidden) and the four
 * beats are listed in plain text beside it for assistive tech.
 */
const PHASE_LABEL: Record<BreathPhase, { ja: string; en: string }> = {
  0: { ja: "吸う", en: "inhale" },
  1: { ja: "止む", en: "hold" },
  2: { ja: "吐く", en: "exhale" },
  3: { ja: "間", en: "ma — the pause between" },
};

export default function BreathCue({ active }: { active: boolean }) {
  const reduced = usePrefersReducedMotion();
  const phase = useBreathPace(active, reduced);
  const label = PHASE_LABEL[phase];

  return (
    <div
      className="chado-breath"
      data-breath={phase}
      aria-hidden="true"
    >
      <span className="chado-breath__orb" />
      <span className="chado-breath__rings">
        <span className="chado-breath__ring chado-breath__ring--1" />
        <span className="chado-breath__ring chado-breath__ring--2" />
      </span>
      <span className="chado-breath__label" key={phase}>
        <span className="chado-breath__ja" lang="ja">
          {label.ja}
        </span>
        <span className="chado-breath__en">{label.en}</span>
      </span>
    </div>
  );
}

// Re-exported for the parent's IntersectionObserver typing convenience.
export type { BreathPhase };
