"use client";

import { useCallback, useState, type CSSProperties } from "react";
import { useClinkPhysics, type Clink } from "../hooks/useClinkPhysics";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

/**
 * Chapter 03 — the soju table. The `drag-physics` technique. A stage of
 * draggable soju glasses and a skewer you can fling; on release they coast on
 * inertia and spring back home, and when two bodies' circles overlap a *clink*
 * fires — a pink/amber spark SFX pops at the midpoint and the bodies take a
 * small knockback. `useClinkPhysics` owns the rAF + the physics; this
 * component owns only the (rare) clink-spark state.
 *
 * Rest positions are declared in data-rest-x / data-rest-y (in px, local to
 * the stage) so the hook can snapshot them at mount. The hook is fine-pointer
 * only — on touch and under reduced motion the glasses sit at rest and the
 * table is a calm, readable still life (the drag is a flourish, not a gate).
 *
 * Each draggable body is keyboard-reachable (tabindex="0") with a visible
 * amber focus halo; keyboard users get the same table, the drag is an
 * enhancement.
 *
 * The clink sparks are positioned with `left/top` (not transform) so they
 * don't fight the keyframe scale on `.ns-spark` — and they auto-clear after
 * their animation via a settling timeout.
 */
const BODIES = [
  {
    key: "glass-1",
    kind: "glass" as const,
    restX: 130,
    restY: 150,
    r: 30,
    label: "소주잔 한 잔 / soju glass",
  },
  {
    key: "glass-2",
    kind: "glass" as const,
    restX: 300,
    restY: 210,
    r: 30,
    label: "소주잔 두 잔 / second glass",
  },
  {
    key: "glass-3",
    kind: "glass" as const,
    restX: 200,
    restY: 320,
    r: 30,
    label: "소주잔 셋 / third glass",
  },
  {
    key: "skewer",
    kind: "skewer" as const,
    restX: 500,
    restY: 180,
    r: 40,
    label: "꼬치 / skewer",
  },
] as const;

const CLINK_SFX = ["짠! ", "乾杯! ", "CLINK! ", "찰칵! "] as const;

export default function ClinkDrag() {
  const reduced = usePrefersReducedMotion();
  const [sparks, setSparks] = useState<Clink[]>([]);

  // Stable callback: the hook's effect deps include onClink, so it must not
  // change identity per render. We push a spark and schedule its removal.
  const onClink = useCallback((c: Clink) => {
    setSparks((prev) => [...prev, c]);
    window.setTimeout(() => {
      setSparks((prev) => prev.filter((s) => s.id !== c.id));
    }, 540);
  }, []);

  const stageRef = useClinkPhysics(reduced, onClink);

  return (
    <section
      className="ns-clink"
      aria-labelledby="ns-clink-title"
      data-reveal="panel"
    >
      <div className="ns-clink__intro">
        <p className="ns-eyebrow" data-reveal>
          <span lang="ko">03화 · 건배</span>
          <span>CH. 03 — TOUCHING GLASSES</span>
        </p>
        <h2 className="ns-sechead" id="ns-clink-title" data-reveal>
          <span className="ns-sechead__ko" lang="ko">
            잔을 끌어서 부딪쳐 보세요
          </span>
          <span className="ns-sechead__en">Drag a glass. Clink it.</span>
        </h2>
        <p data-reveal>
          <span lang="ko">
            잔을 끌어 던지면 관성을 타고, 제자리로 스프링처럼 돌아온다. 두 잔이
            닿으면 짠! — 포장마차의 한밤중 건배.
          </span>
          Fling a glass and it coasts on inertia, then springs back home. When
          two touch, they clink — the midnight toast of the tent.
        </p>
      </div>

      <div className="ns-clink__table" ref={stageRef}>
        <p className="ns-clink__cap">
          <span lang="ko">마우스로 끌기 · 잔을 부딪치면 짠!</span>
          <span>DRAG · CLINK = 짠!</span>
        </p>

        {BODIES.map((b) => (
          <div
            key={b.key}
            className={
              b.kind === "glass"
                ? "ns-clink-body"
                : "ns-clink-body ns-skewer-body"
            }
            data-clink
            data-rest-x={b.restX}
            data-rest-y={b.restY}
            data-clink-r={b.r}
            role="button"
            tabIndex={0}
            aria-label={b.label}
            aria-grabbed="false"
            style={
              { transform: `translate3d(${b.restX}px, ${b.restY}px, 0)` } as CSSProperties
            }
          >
            {b.kind === "glass" ? (
              <span className="ns-glass" aria-hidden="true">
                <span className="ns-glass__bottle" />
                <span className="ns-glass__cup" />
              </span>
            ) : (
              <span aria-hidden="true">
                <span className="ns-skewer-body__stick" />
                <span
                  className="ns-skewer-body__chunk"
                  style={{ left: "20%" }}
                />
                <span
                  className="ns-skewer-body__chunk"
                  style={{ left: "45%" }}
                />
                <span
                  className="ns-skewer-body__chunk"
                  style={{ left: "70%" }}
                />
                <span
                  className="ns-skewer-body__chunk"
                  style={{ left: "90%" }}
                />
              </span>
            )}
          </div>
        ))}

        {/* Clink sparks — positioned at the clink midpoint, auto-clear. */}
        {sparks.map((s, i) => (
          <span
            key={s.id}
            className="ns-spark"
            aria-hidden="true"
            style={{ left: `${s.x}px`, top: `${s.y}px`, zIndex: 6 + i }}
          >
            <span className="ns-spark__sfx" lang="ko">
              {CLINK_SFX[s.id % CLINK_SFX.length]}
            </span>
          </span>
        ))}
      </div>

      <p className="ns-cook__hint" style={{ marginTop: "1.2rem" }}>
        <span lang="ko">권장: 마우스 / 트랙패드</span>
        <span className="ns-mono">FINE POINTER RECOMMENDED · TOUCH = STILL LIFE</span>
      </p>
    </section>
  );
}
