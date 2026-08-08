"use client";

import { useEffect, useRef } from "react";
import "./styles.css";
import { inter, notoSansKR } from "./fonts";
import { useReveal } from "./hooks/useReveal";
import { usePrefersReducedMotion } from "./hooks/usePrefersReducedMotion";
import { useScrollProgress } from "./hooks/useScrollProgress";
import { usePointerParallax } from "./hooks/usePointerParallax";

/**
 * FOREST — 숲, 깊은 수관의 은신처. Organic-nature entry where the canopy
 * darkens as you scroll deeper (scroll-scrub-pinned via --forest-scrub),
 * dappled light filters through feTurbulence leaves (feturbulence-texture),
 * and three canopy layers drift toward the pointer at different speeds
 * (pointer-parallax): the far photo barely sways, the mid leaves carry the
 * drift, the near leaves read at arm's length.
 */
export default function ForestPage() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const reduced = usePrefersReducedMotion();
  const revealRef = useReveal<HTMLDivElement>();
  const depthRef = useScrollProgress<HTMLDivElement>(reduced);
  const canopyRef = usePointerParallax<HTMLDivElement>(reduced);

  useEffect(() => {
    rootRef.current?.classList.add("forest-js");
    window.parent?.postMessage({ type: "oneshot:ready", slug: "forest" }, "*");
  }, []);

  return (
    <div ref={rootRef} className={`${inter.variable} ${notoSansKR.variable} forest-root`}>
      <div ref={revealRef} className="forest-doc">
        {/* pointer-parallax canopy layers — three depths. The far layer is a
            generated painterly canopy photo seen from below (a real forest);
            the mid layer is soft radial leaf-clusters; the near layer is
            darker, denser foliage framing the top of the frame. */}
        <div ref={canopyRef} className="forest-canopy" aria-hidden="true">
          <img
            className="forest-canopy__photo forest-canopy__layer--far"
            src="/media/forest/canopy.avif"
            alt=""
            draggable="false"
          />
          <div className="forest-canopy__layer forest-canopy__layer--mid" />
          <div className="forest-canopy__layer forest-canopy__layer--near" />
        </div>

        <header className="forest-hero" data-reveal="">
          <p className="forest-kicker">
            <span lang="ko">깊은 수관의 은신처</span> · DEEP CANOPY RETREAT
          </p>
          <h1 className="forest-title">
            FOREST <span lang="ko">숲</span>
          </h1>
          <p className="forest-sub">
            <span lang="ko">내려갈수록 수관이 어두워진다.</span>{" "}
            The canopy darkens as you descend.
          </p>
          <p className="forest-hero__hint" lang="ko">
            아래로 내려가며 빛이 줄어드는 것을 보라 ↓
          </p>
        </header>

        {/* 하나 · scroll-scrub-pinned: the descent — sky lerps from light to deep */}
        <section ref={depthRef} className="forest-descent" data-reveal="">
          <div className="forest-descent__inner">
            <p className="forest-descent__word" lang="ko">빛이 줄어든다</p>
            <p className="forest-descent__word" lang="ko">이끼가 늘어난다</p>
            <p className="forest-descent__word" lang="ko">숨이 깊어진다</p>
            <p className="forest-descent__en">
              <em>Light thins · moss thickens · breath deepens</em>
            </p>
          </div>
        </section>

        {/* 둘 · The layers of the canopy — depth made legible */}
        <section className="forest-layers" aria-labelledby="forest-layers-title" data-reveal="">
          <header className="forest-sec">
            <span className="forest-sec__no">02</span>
            <h2 id="forest-layers-title" className="forest-sec__title">
              Layers <span className="forest-sec__ko" lang="ko">수관의 층</span>
            </h2>
          </header>
          <p className="forest-layers__lede">
            <em>The canopy is not one roof but three — each at a different distance, each moving at a different speed.</em>
            <span lang="ko">수관은 하나의 지붕이 아니라 세 겹이다. 각기 다른 거리에, 각기 다른 속도로 흔들린다.</span>
          </p>
          <ol className="forest-layers__list">
            <li className="forest-layers__item forest-layers__item--far">
              <span className="forest-layers__no">far</span>
              <span className="forest-layers__name" lang="ko">먼 수관</span>
              <span className="forest-layers__en">
                <em>The distant forest, barely swaying.</em>
              </span>
            </li>
            <li className="forest-layers__item forest-layers__item--mid">
              <span className="forest-layers__no">mid</span>
              <span className="forest-layers__name" lang="ko">중간 수관</span>
              <span className="forest-layers__en">
                <em>The readable drift — where the breeze lives.</em>
              </span>
            </li>
            <li className="forest-layers__item forest-layers__item--near">
              <span className="forest-layers__no">near</span>
              <span className="forest-layers__name" lang="ko">가까운 수관</span>
              <span className="forest-layers__en">
                <em>The nearest leaves, arm&rsquo;s length.</em>
              </span>
            </li>
          </ol>
        </section>

        {/* 셋 · The understory — ecosystem as a quiet list */}
        <section className="forest-floor" aria-labelledby="forest-floor-title" data-reveal="">
          <header className="forest-sec">
            <span className="forest-sec__no">03</span>
            <h2 id="forest-floor-title" className="forest-sec__title">
              Understory <span className="forest-sec__ko" lang="ko">숲바닥의 생태</span>
            </h2>
          </header>
          <p className="forest-floor__lede">
            <em>Where the light ends, the forest begins its slow work.</em>
            <span lang="ko">빛이 닿는 곳에서 끝나면, 숲은 느린 일을 시작한다.</span>
          </p>
          <div className="forest-floor__grid">
            <article className="forest-floor__card">
              <h3 className="forest-floor__h">
                <span lang="ko">이끼</span> · Moss
              </h3>
              <p className="forest-floor__p">
                <span lang="ko">습한 바위 위, 천천히 자라는 천 년의 녹색.</span>{" "}
                A thousand years of green, climbing the damp stone.
              </p>
            </article>
            <article className="forest-floor__card">
              <h3 className="forest-floor__h">
                <span lang="ko">양치류</span> · Fern
              </h3>
              <p className="forest-floor__p">
                <span lang="ko">그늘 속에서 펼쳐지는 부챃잎.</span>{" "}
                Fronds unfurling in the long shade.
              </p>
            </article>
            <article className="forest-floor__card">
              <h3 className="forest-floor__h">
                <span lang="ko">곰팡이</span> · Fungi
              </h3>
              <p className="forest-floor__p">
                <span lang="ko">보이지 않는 실로 나무를 잇는다.</span>{" "}
                Invisible threads binding tree to tree.
              </p>
            </article>
          </div>
        </section>

        {/* feturbulence-texture: dappled leaf overlay */}
        <svg className="forest-dapple" aria-hidden="true" focusable="false">
          <filter id="forest-leaf-f">
            <feTurbulence type="fractalNoise" baseFrequency="0.02 0.04" numOctaves="3" seed="7" stitchTiles="stitch" />
            <feColorMatrix type="matrix" values="0 0 0 0 0.08  0 0 0 0 0.12  0 0 0 0 0.04  0 0 0 0.12 0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#forest-leaf-f)" />
        </svg>

        <footer className="forest-foot" data-reveal="">
          <p>© 2026 FOREST · <span lang="ko">숲</span> · MIT</p>
          <p>
            <span lang="ko">깊이 숨쉬어라 — 숲은 기다린다.</span> breathe deep — the forest waits.
          </p>
        </footer>
      </div>
    </div>
  );
}
