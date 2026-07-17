"use client";

import { useEffect, useState } from "react";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

/** The seal holds this long before the paper lifts (ms). */
const HOLD_MS = 1500;
/** How long the lift itself takes — must match --shan-loader-lift in CSS. */
const LIFT_MS = 680;

/**
 * The entry: a beat of blank xuan, a vermillion seal (山, mountain) pressed
 * into it, then the paper lifts and the landscape is already painted beneath.
 * It exists to give the canvas its first breath — nothing more — so it is
 * aggressively skippable: any key, tap, wheel, or scroll lifts it at once, a
 * hard timeout lifts it regardless, and under reduced motion (or with JS off)
 * it never appears. `onDone` fires when the lift *starts*, so the hero's
 * glyph cadence overlaps the paper leaving.
 */
export default function Loader({ onDone }: { onDone: () => void }) {
  const reduced = usePrefersReducedMotion();
  const [phase, setPhase] = useState<"idle" | "held" | "lifting" | "gone">(
    "idle",
  );

  useEffect(() => {
    if (reduced) {
      const id = window.setTimeout(() => {
        setPhase("gone");
        onDone();
      }, 0);
      return () => window.clearTimeout(id);
    }

    let lifted = false;
    let liftTimer = 0;
    const lift = () => {
      if (lifted) return;
      lifted = true;
      setPhase("lifting");
      onDone();
      liftTimer = window.setTimeout(() => setPhase("gone"), LIFT_MS);
    };

    const showTimer = window.setTimeout(() => {
      setPhase((p) => (p === "idle" ? "held" : p));
    }, 10);
    const holdTimer = window.setTimeout(lift, HOLD_MS);
    const opts = { passive: true } as const;
    window.addEventListener("keydown", lift);
    window.addEventListener("pointerdown", lift, opts);
    window.addEventListener("wheel", lift, opts);
    window.addEventListener("touchstart", lift, opts);
    window.addEventListener("scroll", lift, opts);

    return () => {
      window.clearTimeout(showTimer);
      window.clearTimeout(holdTimer);
      window.clearTimeout(liftTimer);
      window.removeEventListener("keydown", lift);
      window.removeEventListener("pointerdown", lift);
      window.removeEventListener("wheel", lift);
      window.removeEventListener("touchstart", lift);
      window.removeEventListener("scroll", lift);
    };
  }, [reduced, onDone]);

  if (phase === "idle" || phase === "gone") return null;

  return (
    <div
      className={`shan-loader ${phase === "lifting" ? "is-lifting" : ""}`}
      aria-hidden="true"
    >
      <div className="shan-loader__seal">
        <svg viewBox="0 0 96 96" width={96} height={96} focusable="false">
          <rect x="6" y="6" width="84" height="84" rx="4" fill="#a83232" />
          <rect
            x="12.5"
            y="12.5"
            width="71"
            height="71"
            rx="2"
            fill="none"
            stroke="#f4ede0"
            strokeOpacity="0.55"
            strokeWidth="1"
          />
          <text
            className="shan-sealglyph"
            x="48"
            y="66"
            textAnchor="middle"
            fontSize="46"
            fill="#f4ede0"
          >
            山
          </text>
        </svg>
        <p className="shan-loader__word">
          unrolling the scroll <span lang="zh">展卷</span>
        </p>
      </div>
    </div>
  );
}
