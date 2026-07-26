"use client";

import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

/** One act on the flyer. */
type Act = { name: string; tag: string };

const HEADLINE: Act[] = [
  { name: "KORELESS", tag: "LIVE" },
  { name: "SOPHIE.XYZ", tag: "DJ" },
  { name: "RAINBOW CHAN", tag: "LIVE" },
  { name: "NULL SECTOR", tag: "DJ" },
  { name: "은하초음파", tag: "LIVE" },
  { name: "VARG2™", tag: "DJ" },
];

const OPENER: Act[] = [
  { name: "반짝임", tag: "OPENER" },
  { name: "BAY BAY", tag: "OPENER" },
  { name: "DEEP CUT", tag: "OPENER" },
  { name: "새벽세시", tag: "OPENER" },
];

const GENRE: Act[] = [
  { name: "DECONSTRUCTED CLUB", tag: "" },
  { name: "HARDGROOVE", tag: "" },
  { name: "AMBIENT", tag: "" },
  { name: "GABBER", tag: "" },
  { name: "PC MUSIC", tag: "" },
];

const ROWS = [
  { id: "a", acts: HEADLINE, cls: "rave-marquee__row--a", speed: 0.2, dir: -1 },
  { id: "b", acts: OPENER, cls: "rave-marquee__row--b", speed: 0.12, dir: 1 },
  { id: "c", acts: GENRE, cls: "rave-marquee__row--c", speed: 0.07, dir: -1 },
] as const;

/** Each row renders its acts N times so the wrap is seamless. */
const REPEAT = 4;

/** Keep an offset in (-w, 0] so identical groups tile seamlessly. */
function wrap(v: number, w: number): number {
  const r = v % w;
  return r > 0 ? r - w : r;
}

/**
 * Section 02 — three strobing line-up tickers at different speeds and
 * directions. Where blunt's two rows react to scroll velocity (a print shop's
 * slogans read by the eye), rave's bands run on their own clock at three
 * fixed tempos — fast headliner, mid opener, slow genre. That is the
 * distinction: nightlife runs on BPM, not scroll. Row B is on electric blue
 * and strobes with the wordmark's breath; the moving spans are aria-hidden
 * and the full line-up is delivered once in a visually hidden list before
 * them. Reduced motion: all three stand still.
 */
export default function LineupMarquee() {
  const reduced = usePrefersReducedMotion();
  const bandRef = useRef<HTMLDivElement | null>(null);
  const trackRefs = useRef<Array<HTMLDivElement | null>>([]);
  const groupRefs = useRef<Array<HTMLSpanElement | null>>([]);

  useEffect(() => {
    const band = bandRef.current;
    if (!band) return;
    const tracks = trackRefs.current;
    const groups = groupRefs.current;

    // Reduced motion: leave the SSR-visible (static) state alone.
    if (reduced) {
      for (const t of tracks) if (t) t.style.transform = "";
      return;
    }

    let raf = 0;
    let last = 0;
    const offs = ROWS.map(() => 0);
    const widths = ROWS.map((_, i) =>
      Math.max(1, groups[i]?.offsetWidth ?? 1),
    );

    const ro = new ResizeObserver(() => {
      ROWS.forEach((_, i) => {
        widths[i] = Math.max(1, groups[i]?.offsetWidth ?? 1);
      });
    });
    groups.forEach((g) => g && ro.observe(g));

    const tick = (t: number) => {
      const dt = last ? Math.min(48, t - last) : 16.7;
      last = t;
      ROWS.forEach((row, i) => {
        offs[i] = wrap(offs[i] + row.dir * row.speed * dt, widths[i]);
        const el = tracks[i];
        if (el) {
          el.style.transform = `translate3d(${offs[i].toFixed(2)}px, 0, 0)`;
        }
      });
      raf = requestAnimationFrame(tick);
    };

    // Only spend frames while the band is on screen.
    const io = new IntersectionObserver(
      ([hit]) => {
        if (hit.isIntersecting && !raf) {
          last = 0;
          raf = requestAnimationFrame(tick);
        } else if (!hit.isIntersecting && raf) {
          cancelAnimationFrame(raf);
          raf = 0;
        }
      },
      { rootMargin: "80px" },
    );
    io.observe(band);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
    };
  }, [reduced]);

  return (
    <div className="rave-marquee" ref={bandRef} aria-label="Line-up">
      <p className="rave-vh">
        Line-up: {HEADLINE.map((a) => `${a.name} (${a.tag})`).join(", ")}.{" "}
        <span lang="ko">오프너:</span>{" "}
        {OPENER.map((a) => a.name).join(", ")}.{" "}
        <span lang="ko">장르:</span>{" "}
        {GENRE.map((a) => a.name).join(", ")}.
      </p>

      {ROWS.map((row, i) => (
        <div
          key={row.id}
          className={`rave-marquee__row ${row.cls}`}
          aria-hidden="true"
        >
          <div
            className="rave-marquee__track"
            ref={(el) => {
              trackRefs.current[i] = el;
            }}
          >
            {Array.from({ length: REPEAT }).map((_, n) => (
              <span
                key={n}
                className="rave-marquee__group"
                ref={
                  n === 0
                    ? (el) => {
                        groupRefs.current[i] = el;
                      }
                    : undefined
                }
              >
                {row.acts.map((act, j) => (
                  <span key={j} className="rave-marquee__item">
                    {act.name}
                    {act.tag ? (
                      <span className="rave-marquee__tag">{act.tag}</span>
                    ) : null}
                    <span className="rave-marquee__sep" aria-hidden="true">
                      ▮
                    </span>
                  </span>
                ))}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
