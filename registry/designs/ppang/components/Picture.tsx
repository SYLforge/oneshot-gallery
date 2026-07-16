"use client";

type PictureProps = {
  /** filename stem under /media/ppang/, e.g. "hero-dawn-bakery". */
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
 * The one way an illustration enters the page: an AVIF <source> with a WebP
 * fallback on a <picture>, with a real bilingual alt and reserved box
 * dimensions so the panel never causes layout shift. eager + fetchpriority
 * only for the hero (the first paint); every later panel is lazy and async.
 *
 * The src never carries a query string and never references a derivative —
 * capture-pipeline outputs (poster-*, og.png, loop.webm) are produced
 * elsewhere and are excluded from the budget by check-budget.
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
    <picture className={className ? `ppang-picture ${className}` : "ppang-picture"}>
      <source srcSet={`/media/ppang/${stem}.avif`} type="image/avif" />
      <source srcSet={`/media/ppang/${stem}.webp`} type="image/webp" />
      <img
        className="ppang-picture__img"
        src={`/media/ppang/${stem}.webp`}
        alt={alt}
        width={width}
        height={height}
        loading={loading}
        decoding={decoding}
      />
    </picture>
  );
}
