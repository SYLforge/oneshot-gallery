import type { CSSProperties } from "react";
import { Link } from "@/i18n/navigation";

/**
 * Locale-resolved card payload, prepared server-side (labels + counts are
 * pre-translated so the card renders identically from server pages and
 * the client-side gallery explorer).
 */
export type EntryCardData = {
  slug: string;
  no: number;
  title: string;
  description: string;
  aestheticId: string;
  aestheticLabel: string;
  techniqueIds: string[];
  techniqueCountLabel: string;
  industryIds: string[];
  stackAnimation: string;
  mediaLabel: string;
  accent: string;
  theme: "light" | "dark";
  published: string;
  featured: boolean;
  /** Set from a server-side existsSync check on /media/[slug]/poster-960.webp. */
  hasPoster: boolean;
  posterAlt: string;
};

/**
 * Gallery card: a poster slot on top (real poster when one exists, a
 * composed typographic mini-poster otherwise) and a meta row below.
 * The whole card is one link; hover = accent border + title underline.
 */
export default function EntryCard({ entry }: { entry: EntryCardData }) {
  const posterBg =
    entry.theme === "dark"
      ? `color-mix(in oklab, ${entry.accent} 14%, #0b0b0c)`
      : `color-mix(in oklab, ${entry.accent} 9%, #f2efe6)`;
  const posterInk = entry.theme === "dark" ? "#ede9e0" : "#17171a";
  const posterMuted =
    entry.theme === "dark" ? "rgba(237,233,224,0.55)" : "rgba(23,23,26,0.55)";

  return (
    <Link
      href={`/design/${entry.slug}`}
      style={{ "--accent": entry.accent } as CSSProperties}
      className="group flex h-full flex-col border border-hairline bg-surface transition-colors duration-200 ease-out hover:border-accent/60 focus-visible:border-accent/60"
    >
      {/* Poster slot — replaced by real captures in a later phase. */}
      <div className="relative aspect-[3/2] overflow-hidden border-b border-hairline">
        {entry.hasPoster ? (
          <picture>
            <img
              src={`/media/${entry.slug}/poster-960.webp`}
              alt={entry.posterAlt}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </picture>
        ) : (
          <div
            aria-hidden
            className="absolute inset-0 flex flex-col justify-between p-5"
            style={{ background: posterBg, color: posterInk }}
          >
            <div className="flex items-start justify-between gap-3">
              <span
                className="pt-1 font-mono text-[10px] uppercase tracking-[0.22em]"
                style={{ color: posterMuted }}
              >
                {entry.aestheticLabel}
              </span>
              <span className="font-display text-[3rem] leading-none opacity-25">
                {String(entry.no).padStart(2, "0")}
              </span>
            </div>
            <div>
              <span
                className="block h-px w-12"
                style={{ background: entry.accent }}
              />
              <p className="mt-3 line-clamp-2 font-display text-[1.55rem] leading-[1.1]">
                {entry.title}
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="font-display text-xl leading-tight decoration-accent/70 underline-offset-4 transition-colors duration-200 ease-out group-hover:underline">
          {entry.title}
        </h3>
        <p className="line-clamp-2 text-[13px] leading-relaxed text-muted">
          {entry.description}
        </p>
        <p className="mt-auto flex flex-wrap items-center gap-x-2.5 gap-y-1.5 pt-2 font-mono text-[10.5px] uppercase tracking-[0.14em] text-muted">
          <span className="text-accent">{entry.aestheticLabel}</span>
          <span aria-hidden>·</span>
          <span>{entry.techniqueCountLabel}</span>
          <span className="border border-hairline px-1.5 py-0.5">
            {entry.mediaLabel}
          </span>
        </p>
      </div>
    </Link>
  );
}
