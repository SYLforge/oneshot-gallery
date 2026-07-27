"use client";

import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

/**
 * The four corner registration marks a real press sheet carries — a cross
 * hair inside a circle, plus a flat color bar of the three drums. They sit
 * fixed in the viewport corners as registration marks sit in the bleed of a
 * print, so the whole page reads as one registered sheet. Pure SVG, no
 * images. The marks are `aria-hidden` decoration; a visually hidden line
 * names them once for screen readers.
 *
 * Under `.riso-js` (and not reduced motion) the three color-bar chips drift
 * a few pixels toward the pointer — the print's misregistration breathing
 * under the hand. State is a delta written imperatively; reduced motion and
 * no-JS leave everything pinned in register.
 */
export default function RegistrationMarks() {
  const reduced = usePrefersReducedMotion();
  const barRef = useRef<HTMLSpanElement | null>(null);
  const pinkRef = useRef<HTMLSpanElement | null>(null);
  const blueRef = useRef<HTMLSpanElement | null>(null);
  const yellowRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const bar = barRef.current;
    const pink = pinkRef.current;
    const blue = blueRef.current;
    const yellow = yellowRef.current;
    if (!bar || !pink || !blue || !yellow || reduced) return;

    // Each plate is offset by a different constant so the "in register"
    // state already reads as a slightly-off three-color print.
    let tx = 0;
    let ty = 0;
    let ptx = 0;
    let pty = 0;
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      const r = bar.getBoundingClientRect();
      // -1..1 from the bar's center
      const nx = ((e.clientX - (r.left + r.width / 2)) / window.innerWidth) * 2;
      const ny = ((e.clientY - (r.top + r.height / 2)) / window.innerHeight) * 2;
      tx = Math.max(-4, Math.min(4, nx * 4));
      ty = Math.max(-3, Math.min(3, ny * 3));
      if (!raf) raf = requestAnimationFrame(tick);
    };

    const tick = () => {
      // exponential approach, frame-rate normalized — a skid, not a snap
      const k = 1 - Math.pow(0.82, 1);
      ptx += (tx - ptx) * k;
      pty += (ty - pty) * k;
      pink.style.transform = `translate(${(-2 + ptx * 1.0).toFixed(2)}px, ${(-1 + pty * 1.0).toFixed(2)}px)`;
      blue.style.transform = `translate(${(1.5 + ptx * 0.7).toFixed(2)}px, ${(1 + pty * -0.8).toFixed(2)}px)`;
      yellow.style.transform = `translate(${(-0.5 + ptx * -0.5).toFixed(2)}px, ${(2 + pty * 0.6).toFixed(2)}px)`;
      if (Math.abs(tx - ptx) > 0.05 || Math.abs(ty - pty) > 0.05) {
        raf = requestAnimationFrame(tick);
      } else {
        raf = 0;
      }
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [reduced]);

  return (
    <div className="riso-regmarks" aria-hidden="true">
      <p className="riso-vh">
        Registration marks and a three-drum color bar pin the four corners of
        the sheet. 네 모서리의 레지스터 마크와 3도 칼라바가 인쇄지를 고정한다.
      </p>

      {/* TL */}
      <svg className="riso-regmark riso-regmark--tl" viewBox="0 0 40 40" width="40" height="40" focusable="false">
        <circle cx="20" cy="20" r="14" fill="none" stroke="var(--riso-ink)" strokeWidth="1.2" />
        <line x1="20" y1="2" x2="20" y2="38" stroke="var(--riso-ink)" strokeWidth="1.2" />
        <line x1="2" y1="20" x2="38" y2="20" stroke="var(--riso-ink)" strokeWidth="1.2" />
        <circle cx="20" cy="20" r="2" fill="var(--riso-ink)" />
      </svg>
      {/* TR */}
      <svg className="riso-regmark riso-regmark--tr" viewBox="0 0 40 40" width="40" height="40" focusable="false">
        <circle cx="20" cy="20" r="14" fill="none" stroke="var(--riso-ink)" strokeWidth="1.2" />
        <line x1="20" y1="2" x2="20" y2="38" stroke="var(--riso-ink)" strokeWidth="1.2" />
        <line x1="2" y1="20" x2="38" y2="20" stroke="var(--riso-ink)" strokeWidth="1.2" />
        <circle cx="20" cy="20" r="2" fill="var(--riso-ink)" />
      </svg>
      {/* BL */}
      <svg className="riso-regmark riso-regmark--bl" viewBox="0 0 40 40" width="40" height="40" focusable="false">
        <circle cx="20" cy="20" r="14" fill="none" stroke="var(--riso-ink)" strokeWidth="1.2" />
        <line x1="20" y1="2" x2="20" y2="38" stroke="var(--riso-ink)" strokeWidth="1.2" />
        <line x1="2" y1="20" x2="38" y2="20" stroke="var(--riso-ink)" strokeWidth="1.2" />
        <circle cx="20" cy="20" r="2" fill="var(--riso-ink)" />
      </svg>
      {/* BR */}
      <svg className="riso-regmark riso-regmark--br" viewBox="0 0 40 40" width="40" height="40" focusable="false">
        <circle cx="20" cy="20" r="14" fill="none" stroke="var(--riso-ink)" strokeWidth="1.2" />
        <line x1="20" y1="2" x2="20" y2="38" stroke="var(--riso-ink)" strokeWidth="1.2" />
        <line x1="2" y1="20" x2="38" y2="20" stroke="var(--riso-ink)" strokeWidth="1.2" />
        <circle cx="20" cy="20" r="2" fill="var(--riso-ink)" />
      </svg>

      {/* Color bar — the three drums, slightly misregistered and breathing. */}
      <span className="riso-colorbar" ref={barRef}>
        <span className="riso-colorbar__label">3C · FLUO</span>
        <span className="riso-colorbar__chips">
          <span className="riso-colorbar__chip riso-colorbar__chip--pink" ref={pinkRef} />
          <span className="riso-colorbar__chip riso-colorbar__chip--blue" ref={blueRef} />
          <span className="riso-colorbar__chip riso-colorbar__chip--yellow" ref={yellowRef} />
        </span>
      </span>
    </div>
  );
}
