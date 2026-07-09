"use client";

import { useEffect, useRef, type CSSProperties, type FocusEvent } from "react";
import { Link } from "@/i18n/navigation";

export type WallRow = {
  slug: string;
  no: number;
  title: string;
  aesthetic: string;
  accent: string;
};

const DRIFT_PX = 8;
const LERP = 0.16;

/**
 * The index wall — every entry as an oversized numbered row. The hovered
 * (or focused) row bleeds its accent in, its numeral drifts a few pixels
 * (rAF-lerped, transform-only), and the page's --accent follows along.
 * Reduced motion: no drift, instant color (see globals.css).
 */
export default function IndexWall({
  rows,
  ariaLabel,
}: {
  rows: WallRow[];
  ariaLabel: string;
}) {
  const rootRef = useRef<HTMLUListElement | null>(null);
  const numeralRefs = useRef(new Map<string, HTMLSpanElement>());
  const drift = useRef(new Map<string, { current: number; target: number }>());
  const raf = useRef<number | null>(null);
  const reduced = useRef(false);

  useEffect(() => {
    reduced.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const root = rootRef.current;
    return () => {
      if (raf.current !== null) cancelAnimationFrame(raf.current);
      root?.closest("main")?.style.removeProperty("--accent");
    };
  }, []);

  const setPageAccent = (accent: string | null) => {
    const main = rootRef.current?.closest("main");
    if (!main) return;
    if (accent) main.style.setProperty("--accent", accent);
    else main.style.removeProperty("--accent");
  };

  const tick = () => {
    let active = false;
    for (const [slug, d] of drift.current) {
      d.current += (d.target - d.current) * LERP;
      if (Math.abs(d.target - d.current) > 0.1) {
        active = true;
      } else {
        d.current = d.target;
      }
      const el = numeralRefs.current.get(slug);
      if (el) el.style.transform = `translateX(${d.current}px)`;
    }
    raf.current = active ? requestAnimationFrame(tick) : null;
  };

  const setHover = (slug: string | null, accent?: string) => {
    setPageAccent(accent ?? null);
    if (reduced.current) return;
    for (const row of rows) {
      const d = drift.current.get(row.slug) ?? { current: 0, target: 0 };
      d.target = row.slug === slug ? DRIFT_PX : 0;
      drift.current.set(row.slug, d);
    }
    if (raf.current === null) raf.current = requestAnimationFrame(tick);
  };

  const onBlur = (event: FocusEvent<HTMLUListElement>) => {
    if (!rootRef.current?.contains(event.relatedTarget as Node | null)) {
      setHover(null);
    }
  };

  return (
    <ul
      ref={rootRef}
      aria-label={ariaLabel}
      onPointerLeave={() => setHover(null)}
      onBlur={onBlur}
      className="border-t border-hairline"
    >
      {rows.map((row) => (
        <li key={row.slug} className="border-b border-hairline">
          <Link
            href={`/design/${row.slug}`}
            style={{ "--accent": row.accent } as CSSProperties}
            onPointerEnter={() => setHover(row.slug, row.accent)}
            onFocus={() => setHover(row.slug, row.accent)}
            className="wall-row relative flex items-baseline gap-5 px-1 py-6 md:gap-10 md:py-7"
          >
            <span aria-hidden className="wall-bleed absolute -inset-x-1 inset-y-0 bg-accent/[0.06]" />
            <span
              ref={(el) => {
                if (el) numeralRefs.current.set(row.slug, el);
                else numeralRefs.current.delete(row.slug);
              }}
              className="wall-no relative w-[2ch] shrink-0 font-display text-[clamp(2.25rem,5vw,4rem)] leading-none text-muted/35 will-change-transform"
            >
              {String(row.no).padStart(2, "0")}
            </span>
            <span className="wall-title relative min-w-0 flex-1 font-display text-[clamp(1.5rem,4vw,3rem)] leading-[1.08]">
              {row.title}
            </span>
            <span className="relative hidden shrink-0 font-mono text-[11px] uppercase tracking-[0.18em] text-muted sm:inline">
              {row.aesthetic}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
