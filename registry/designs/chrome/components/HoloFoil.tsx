"use client";

import type { ReactNode } from "react";
import { useFoilParallax } from "../hooks/useFoilParallax";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

/**
 * A holographic-foil panel: a chrome-silver base with three offset
 * rainbow bands (lavender → pink → mint) blended in `screen`, their
 * conic-gradient origins lerped by the pointer. The rainbow sheen that
 * made 2003 holographic stickers impossible to look away from.
 *
 * The foils are decorative (`aria-hidden`); the child content carries
 * meaning and sits in the AA-safe dark chrome-ink over the silver base.
 * On touch and under reduced motion the foils rest in their neutral
 * rainbow state.
 */
export default function HoloFoil({
  children,
  className = "",
  label,
}: {
  children: ReactNode;
  className?: string;
  /** an optional eyebrow stamped into the foil's corner */
  label?: string;
}) {
  const reduced = usePrefersReducedMotion();
  const ref = useFoilParallax<HTMLDivElement>(reduced);

  return (
    <div ref={ref} className={`chrome-holofoil ${className}`}>
      <span className="chrome-holofoil__base" aria-hidden="true" />
      <span className="chrome-holofoil__band chrome-holofoil__band--sky" aria-hidden="true" />
      <span className="chrome-holofoil__band chrome-holofoil__band--pink" aria-hidden="true" />
      <span className="chrome-holofoil__band chrome-holofoil__band--mint" aria-hidden="true" />
      <span className="chrome-holofoil__spec" aria-hidden="true" />
      <div className="chrome-holofoil__content">{children}</div>
      {label ? (
        <span className="chrome-holofoil__label">{label}</span>
      ) : null}
    </div>
  );
}
