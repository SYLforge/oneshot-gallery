"use client";

import { useEffect, useRef } from "react";

type Props = {
  reduced: boolean;
};

/**
 * The full-page CRT overlay — the crt-scanline technique. Two fixed layers:
 *
 *   1. A scanline grille: a 2px-tall repeating-linear-gradient of dark
 *      stripes, fixed over the whole viewport, pointer-events: none. It is
 *      the aperture grille of the tube.
 *   2. A subtle vignette + a JS-modulated flicker on the grille's opacity
 *      (0.16 → 0.22 over ~4.7s), so the screen breathes like a real CRT.
 *
 * The flicker rAF pauses when the tab is hidden. Under reduced motion the
 * grille is rendered statically (a real, composed layer — the page still
 * reads as a CRT, it just does not flicker). The overlay never carries
 * text, so contrast is unaffected; the grille sits *behind* text via
 * z-index and is dark enough at 18% that AA headings stay AA.
 *
 * The element itself is aria-hidden and decorative; the overlay is purely
 * atmospheric.
 */
export default function CRTOverlay({ reduced }: Props) {
  const grilleRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (reduced) return;
    const grille = grilleRef.current;
    if (!grille) return;

    let raf = 0;
    let running = false;
    let last = 0;

    const step = (now: number) => {
      raf = requestAnimationFrame(step);
      if (now - last < 90) return; // ~11Hz: subtle, never seizure-risk
      last = now;
      // a slow sinusoidal breath around the grille's base opacity
      const t = now / 4700;
      const o = 0.16 + 0.06 * (0.5 + 0.5 * Math.sin(t * Math.PI * 2));
      grille.style.opacity = o.toFixed(3);
    };

    const sync = () => {
      const should = !document.hidden;
      if (should && !running) {
        running = true;
        last = performance.now();
        raf = requestAnimationFrame(step);
      } else if (!should && running) {
        running = false;
        cancelAnimationFrame(raf);
      }
    };

    const onVisibility = () => sync();
    document.addEventListener("visibilitychange", onVisibility);
    sync();

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      document.removeEventListener("visibilitychange", onVisibility);
      grille.style.opacity = "";
    };
  }, [reduced]);

  return (
    <div className="pixel-crt" aria-hidden="true">
      <div className="pixel-crt__vignette" />
      <div ref={grilleRef} className="pixel-crt__scan" />
    </div>
  );
}
