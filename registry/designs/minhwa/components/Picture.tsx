"use client";

type PictureProps = {
  /** filename stem under /media/minhwa/, e.g. "hero-tiger-magpie". */
  stem: string;
  alt: string;
  /** optional explicit width/height to reserve the box and avoid CLS. */
  width?: number;
  height?: number;
  className?: string;
  loading?: "eager" | "lazy";
  /** Optional decoding hint — default "async" for off-screen panels. */
  decoding?: "async" | "sync" | "auto";
};

/**
 * The one way a minhwa illustration enters the page: an AVIF <source> with a
 * WebP fallback on a <picture>, with a real bilingual alt and reserved box
 * dimensions so the panel never causes layout shift. eager + fetchpriority
 * only for the hero (the first paint); every later panel is lazy and async.
 *
 * The src never carries a query string and never references a derivative —
 * capture-pipeline outputs (poster-*, og.png, loop.webm) are produced
 * elsewhere and are excluded from the budget by check-budget.
 *
 * The minhwa illustrations carry NO text by design — every Hangul caption,
 * symbol meaning, and seal is real HTML/SVG/CSS on top, so Hangul stays
 * crisp vector and fully accessible.
 */
export default function Picture({
  stem,
  alt,
  width,
  height,
  className,
  loading = "lazy",
  decoding = "async",
}: PictureProps) {
  return (
    <picture
      className={className ? `minhwa-picture ${className}` : "minhwa-picture"}
    >
      <source srcSet={`/media/minhwa/${stem}.avif`} type="image/avif" />
      <source srcSet={`/media/minhwa/${stem}.webp`} type="image/webp" />
      <img
        className="minhwa-picture__img"
        src={`/media/minhwa/${stem}.webp`}
        alt={alt}
        width={width}
        height={height}
        loading={loading}
        decoding={decoding}
      />
    </picture>
  );
}
