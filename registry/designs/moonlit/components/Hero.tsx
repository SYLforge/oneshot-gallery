"use client";

import { useEffect, useRef } from "react";
import { useInView } from "../hooks/useInView";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

/**
 * Chapter 01 — the establishing panel. The rider is already mid-street on a
 * motorcycle at 2 AM, lit only by neon and his own headlight. The hero
 * image (`hero-night-delivery`) carries the scene; everything else on this
 * viewport is art-directed UI: the chapter card, the kicker, the wordmark,
 * the cold "live order" line, and the SVG neon sign that flickers on as the
 * panel enters view.
 *
 * Two layers of motion, both gated behind `.moonlit-js` and dead under
 * reduced motion:
 *  1. Neon sign — an SVG tube whose stroke-dashoffset scrubs to 0 over
 *     1.4s when the hero is in view (the `svg-line-draw` technique), then
 *     holds a slow flicker.
 *  2. Subtle parallax — the image drifts on scroll-Y via a single rAF
 *     loop reading `window.scrollY`, transform-only. The hero never gets
 *     taller under .moonlit-js (unlike halflight's scrub corridors), so the
 *     parallax is a quiet film-still drift rather than a pinned scene.
 *
 * Without JS the panel is a finished image with the neon already lit: the
 * pre-state (dim tube, low brightness) lives in styles.css under
 * `.moonlit-js .moonlit-hero.is-lit` so SSR shows the final state.
 */
export default function Hero() {
  const reduced = usePrefersReducedMotion();
  // The hero ref doubles as the IO target. `seen` latches true once and
  // drives the `.is-lit` class — the neon sign lights once, then holds.
  const heroRef = useRef<HTMLElement | null>(null);
  const { seen } = useInView<HTMLElement>(heroRef, { threshold: 0.2 });
  const imgRef = useRef<HTMLDivElement | null>(null);

  // Parallax on scroll: a single rAF that transforms the image. No layout
  // work, no state updates. Pauses on hidden tabs and stops entirely under
  // reduced motion.
  useEffect(() => {
    if (reduced) return;
    const img = imgRef.current;
    if (!img) return;
    let raf = 0;
    let scheduled = false;
    const apply = () => {
      scheduled = false;
      const y = Math.min(window.scrollY, 800);
      // Negative translate so the rider rises past the camera. Cap at ~6%.
      img.style.transform = `translate3d(0, ${(-y * 0.045).toFixed(2)}px, 0) scale(1.06)`;
    };
    const schedule = () => {
      if (scheduled) return;
      scheduled = true;
      raf = window.requestAnimationFrame(apply);
    };
    apply();
    window.addEventListener("scroll", schedule, { passive: true });
    const onVis = () => {
      if (document.hidden && raf) window.cancelAnimationFrame(raf);
    };
    document.addEventListener("visibilitychange", onVis);
    return () => {
      window.removeEventListener("scroll", schedule);
      document.removeEventListener("visibilitychange", onVis);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, [reduced]);

  return (
    <header
      className={`moonlit-hero${seen ? " is-lit" : ""}`}
      aria-labelledby="moonlit-title"
      ref={heroRef}
    >
      <div className="moonlit-hero__sky" aria-hidden="true" />
      <div className="moonlit-hero__plate" ref={imgRef}>
        <picture>
          <source
            srcSet="/media/moonlit/hero-night-delivery.avif"
            type="image/avif"
          />
          <source
            srcSet="/media/moonlit/hero-night-delivery.webp"
            type="image/webp"
          />
          <img
            className="moonlit-hero__img"
            src="/media/moonlit/hero-night-delivery.avif"
            alt="A delivery rider on a motorcycle at 2 AM, single headlight cutting through an empty neon-lit street. 새벽 두 시, 텅 빈 네온 거리를 가로지르는 오토바이 배달 라이더 — 하나의 헤드라이트가 어둠을 가른다."
            loading="eager"
            decoding="async"
            width={832}
            height={1216}
          />
        </picture>
        <div className="moonlit-hero__scrim" aria-hidden="true" />
        <div className="moonlit-hero__moon" aria-hidden="true" />
      </div>

      {/* Neon sign — the only SVG neon on the hero. Lit on scroll-in. */}
      <svg
        className="moonlit-neon"
        viewBox="0 0 220 76"
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          <filter id="moonlit-hero-glow" x="-40%" y="-60%" width="180%" height="220%">
            <feGaussianBlur stdDeviation="2.6" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <path
          className="moonlit-neon__tube"
          d="M14 14 L14 38 M14 14 L42 14 L42 38 M42 38 L42 62 M14 62 L42 62 M70 14 L70 62 M58 14 L82 14 M70 38 L82 38 M110 14 L110 62 M98 14 L122 14 M122 38 L110 38 M150 14 L138 38 L138 62 M162 62 L162 38 L150 38 M162 14 L150 14 L150 62 M198 14 L186 14 L186 62 M186 38 L198 38"
          filter="url(#moonlit-hero-glow)"
        />
      </svg>

      <div className="moonlit-hero__inner">
        <p className="moonlit-hero__kicker">
          <span lang="ko">달빛 배달</span>{" "}
          <span className="moonlit-mono moonlit-hero__kicker-en">
            · LATE-NIGHT DELIVERY · EST. 2024
          </span>
        </p>

        <h1 className="moonlit-hero__title" id="moonlit-title">
          <span className="moonlit-hero__title-en">MOONLIT</span>
          <span className="moonlit-hero__title-ko" lang="ko">
            달빛
          </span>
        </h1>

        <p className="moonlit-hero__lede" lang="ko">
          도시가 잠든 2시, 당신의 따뜻한 한 끼를 배달합니다.
        </p>
        <p className="moonlit-hero__lede-en">
          At 2 AM, when the city sleeps, we deliver your warm meal.
        </p>

        <p className="moonlit-hero__status moonlit-mono">
          <span className="moonlit-hero__statusdot" aria-hidden="true" />
          LIVE · 밤 10시 — 새벽 4시 · 47 RIDERS AWAKE
        </p>
      </div>

      <p className="moonlit-hero__hint" aria-hidden="true">
        <span lang="ko">아래로</span> · SCROLL TO TRACK THE ORDER
      </p>
    </header>
  );
}
