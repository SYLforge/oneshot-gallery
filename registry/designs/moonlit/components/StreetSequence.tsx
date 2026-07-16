"use client";

import { useRef } from "react";
import { useInView } from "../hooks/useInView";

/**
 * Chapter 04 — the empty street. This is the lonely middle of the page: the
 * rider is between restaurants, between customers, between two lamp pools.
 * The street image (`street-night`) is the background; on top of it sit two
 * SVG neon signs that brighten + draw on scroll-in (technique: svg-line-draw,
 * the same vocabulary as the hero sign but applied to two signs over a wider
 * frame), and a horizontal headlight-trail marquee (technique: marquee) of
 * thin cool-blue light streaks that translate across the panel — speed lines
 * for a moving rider.
 *
 * The marquee pauses offscreen (the IO gate is `once: false`) and on hidden
 * tabs; under reduced motion the streaks hold a static, single pose and the
 * neon signs draw once on mount. Without JS the streaks sit at their first
 * frame and the signs show as full-brightness SVG — the panel is finished.
 *
 * The text on the panel — the street name, the chapter number, the rider's
 * interior monologue — is real HTML overlay; the image carries no text.
 */
export default function StreetSequence() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const { inView, seen } = useInView<HTMLElement>(sectionRef, {
    threshold: 0.3,
    once: false,
  });

  return (
    <section
      className={`moonlit-street${seen ? " is-lit" : ""}${
        inView ? " is-running" : ""
      }`}
      ref={sectionRef}
      aria-labelledby="moonlit-street-title"
    >
      <p className="moonlit-eyebrow moonlit-mono" data-reveal aria-hidden="true">
        CH. 04 — 텅 빈 거리 · THE EMPTY STREET
      </p>
      <h2 className="moonlit-sechead" id="moonlit-street-title" data-reveal>
        The city, between two deliveries{" "}
        <span lang="ko" className="moonlit-sechead__ko">
          배달과 배달 사이의 도시
        </span>
      </h2>

      <div className="moonlit-street__panel" data-reveal>
        <picture>
          <source srcSet="/media/moonlit/street-night.avif" type="image/avif" />
          <source srcSet="/media/moonlit/street-night.webp" type="image/webp" />
          <img
            className="moonlit-street__img"
            src="/media/moonlit/street-night.avif"
            alt="An empty neon-lit Korean street at 3 AM — wet asphalt, closed shopfronts, distant streetlamp halos, no people. 인적 없는 새벽 세 시의 네온 거리 — 젖은 아스팔트, 닫아 내린 셔터, 멀리 번지는 가로등, 사람은 없다."
            loading="lazy"
            decoding="async"
            width={1024}
            height={768}
          />
        </picture>

        {/* Two neon signs hanging over the street. They brighten + draw on
            scroll-in via the .is-lit class. */}
        <svg
          className="moonlit-street__sign moonlit-street__sign--a"
          viewBox="0 0 180 60"
          aria-hidden="true"
          focusable="false"
        >
          <defs>
            <filter id="moonlit-sign-a-glow" x="-40%" y="-60%" width="180%" height="220%">
              <feGaussianBlur stdDeviation="2.2" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <path
            className="moonlit-street__tube"
            d="M10 10 L10 50 M10 10 L40 10 L40 30 M40 30 L10 30 M60 10 L60 50 L90 50 L90 10 L60 10 M110 10 L110 50 M110 10 L140 10 L140 50 M110 30 L140 30 M160 10 L160 50"
            filter="url(#moonlit-sign-a-glow)"
          />
        </svg>
        <svg
          className="moonlit-street__sign moonlit-street__sign--b"
          viewBox="0 0 150 60"
          aria-hidden="true"
          focusable="false"
        >
          <defs>
            <filter id="moonlit-sign-b-glow" x="-40%" y="-60%" width="180%" height="220%">
              <feGaussianBlur stdDeviation="2.2" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <path
            className="moonlit-street__tube"
            d="M10 10 L40 10 L40 50 L10 50 Z M10 30 L40 30 M70 10 L70 50 L100 50 L100 10 L70 10 M120 10 L120 50 M120 10 L130 10 L130 50"
            filter="url(#moonlit-sign-b-glow)"
          />
        </svg>

        {/* The headlight trail marquee — speed lines for a moving rider.
            Two stacked rows of streaks translate at different speeds. */}
        <div className="moonlit-street__trail" aria-hidden="true">
          <div className="moonlit-street__trail-row moonlit-street__trail-row--a">
            {Array.from({ length: 8 }).map((_, i) => (
              <span key={i} className="moonlit-street__streak" style={{ ["--moonlit-s" as string]: i }} />
            ))}
          </div>
          <div className="moonlit-street__trail-row moonlit-street__trail-row--b">
            {Array.from({ length: 10 }).map((_, i) => (
              <span key={i} className="moonlit-street__streak moonlit-street__streak--thin" style={{ ["--moonlit-s" as string]: i }} />
            ))}
          </div>
        </div>

        <div className="moonlit-street__vignette" aria-hidden="true" />

        {/* Overlaid street label and the rider's interior line. */}
        <p className="moonlit-street__label moonlit-mono">
          <span className="moonlit-street__label-no">04·</span>
          SEONYU-RO 42-GIL · SEONYU-RO 42-GIL · SEOUL
        </p>
        <p className="moonlit-street__mono" lang="ko">
          아무도 없다. 가로등만, 그리고 나.
        </p>
        <p className="moonlit-street__mono-en">
          There is no one. Only the lamps, and me.
        </p>
      </div>

      <p className="moonlit-street__caption" data-reveal>
        He rides through the part of the city that does not photograph well:
        shuttered storefronts, the same neon sign repeated, asphalt still wet
        from a rain that ended at midnight.{" "}
        <span lang="ko">
          그가 지나는 도시는 사진이 잘 안 나오는 그 부분이다 — 닫힌 셔터,
          되풀이되는 같은 네온 사인, 자정에 그친 비에 젖은 아스팔트.
        </span>
      </p>
    </section>
  );
}
