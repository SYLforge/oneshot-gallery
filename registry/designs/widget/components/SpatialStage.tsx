"use client";

import { useRef } from "react";
import type { Depth } from "./widgets";
import WidgetCard from "./WidgetCard";
import { WIDGETS } from "./widgets";

/**
 * SpatialStage — the signature moment.
 *
 * A perspective stage holds the constellation of glass widgets. Each widget
 * declares its depth (near/mid/far); usePointerParallax reads `data-tilt` +
 * `data-depth` and leans each one in 3D toward the pointer — near widgets
 * float forward and tilt fully, far ones drift and barely move, so the field
 * reads as real parallax depth, the visionOS spatial cue.
 *
 * The stage itself is the pointer surface: the hook attaches to this ref.
 * An ambient aurora drifts behind (see styles.css), and each card carries a
 * contact drop-shadow so the float reads as suspension in space, not flat
 * translateZ. Under reduced motion the hook never starts and every card
 * stands flat — a complete, readable dashboard without parallax.
 */

type Props = {
  reduced: boolean;
  registerRoot: (el: HTMLDivElement | null) => void;
};

/** Depth order for the staggered reveal — far first, near last (toward you). */
const DEPTH_ORDER: Record<Depth, number> = { far: 0, mid: 1, near: 2 };

export default function SpatialStage({ reduced, registerRoot }: Props) {
  const localRef = useRef<HTMLDivElement | null>(null);

  // Compose the parent's root ref with our local one so the orchestrator can
  // attach the pointer listener to the stage surface.
  const setRef = (el: HTMLDivElement | null) => {
    localRef.current = el;
    registerRoot(el);
  };

  const ordered = [...WIDGETS].sort(
    (a, b) => DEPTH_ORDER[a.depth] - DEPTH_ORDER[b.depth],
  );

  return (
    <section
      className="widget-stage-section"
      aria-labelledby="widget-stage-title"
    >
      <h2 id="widget-stage-title" className="widget-visually-hidden">
        The spatial stage — widgets floating in depth ·{" "}
        <span lang="ko">공간 무대 — 깊이에 떠 있는 위젯</span>
      </h2>

      <div className="widget-stage-meta" data-reveal="">
        <span className="widget-stage-meta__no" aria-hidden="true">
          01
        </span>
        <span className="widget-stage-meta__label">
          SPATIAL FIELD · <span lang="ko">공간 장</span>
        </span>
        <span className="widget-stage-meta__hint">
          move the cursor · <span lang="ko">커서를 움직이세요</span>
        </span>
      </div>

      <div
        ref={setRef}
        className={`widget-stage ${reduced ? "is-static" : ""}`}
        data-reveal=""
      >
        {/* Aurora field behind the glass — drifts subtly (paused reduced). */}
        <div className="widget-aurora" aria-hidden="true">
          <span className="widget-aurora__blob widget-aurora__blob--a" />
          <span className="widget-aurora__blob widget-aurora__blob--b" />
          <span className="widget-aurora__blob widget-aurora__blob--c" />
        </div>

        {/*
          Stagger index is set inline per card so the reveal delay can scale
          with order (far → near) without nth-child coupling to layout.
        */}
        <div className="widget-grid">
          {ordered.map((w, i) => (
            <div
              key={w.id}
              className="widget-cell"
              style={{ ["--w-i" as string]: i }}
            >
              <WidgetCard widget={w} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
