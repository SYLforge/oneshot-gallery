"use client";

import { useRef } from "react";
import { useInView } from "../hooks/useInView";

/**
 * Chapter 05 — the handoff. This is the emotional climax of the page and the
 * only place the warm amber token is allowed to dominate. The
 * `delivery-complete-dawn` image is the warm image — the rider at the door,
 * a meal passed between hands, the sky finally lightening at the edge. The
 * cool indigo of the page breaks for exactly one viewport, the way dawn
 * does: it does not announce itself, it just leaks in from the right.
 *
 * The amber glow blooms slowly (1800ms ease-out) when the panel enters view,
 * as if dawn is arriving through the door. The headline is set in Gugi —
 * the only Korean display moment on the page — and the line is the page's
 * whole argument in one sentence.
 *
 * Reduced motion: the glow sits at its final bloom, the text is whole. No
 * JS: the panel is a finished image with its caption.
 */
export default function DeliveryComplete() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const { seen } = useInView<HTMLElement>(sectionRef, { threshold: 0.3 });

  return (
    <section
      className={`moonlit-handoff${seen ? " is-lit" : ""}`}
      ref={sectionRef}
      aria-labelledby="moonlit-handoff-title"
    >
      <div className="moonlit-handoff__dawn" aria-hidden="true" />
      <div className="moonlit-handoff__inner">
        <p
          className="moonlit-eyebrow moonlit-mono moonlit-eyebrow--warm"
          data-reveal
          aria-hidden="true"
        >
          CH. 05 — 배달 완료 · DELIVERED
        </p>
        <h2 className="moonlit-handoff__title" id="moonlit-handoff-title" data-reveal>
          <span lang="ko">따뜻하게, 도착했습니다.</span>
          <span className="moonlit-handoff__title-en">
            Delivered — still warm.
          </span>
        </h2>

        <figure className="moonlit-handoff__panel" data-reveal>
          <div className="moonlit-handoff__art">
            <picture>
              <source
                srcSet="/media/moonlit/delivery-complete-dawn.avif"
                type="image/avif"
              />
              <source
                srcSet="/media/moonlit/delivery-complete-dawn.webp"
                type="image/webp"
              />
              <img
                className="moonlit-handoff__img"
                src="/media/moonlit/delivery-complete-dawn.avif"
                alt="The handoff at first light — a delivery rider and a customer at an apartment door, a warm meal passing between hands, the sky just beginning to warm at the edges. 새벽녘의 전달 장면 — 아파트 문 앞에서 라이더와 주문자 사이로 따뜻한 한 끼가 건네진다. 하늘 가장자리가 비로소 따뜻해지기 시작했다."
                loading="lazy"
                decoding="async"
                width={832}
                height={1216}
              />
            </picture>
            <div className="moonlit-handoff__warmglow" aria-hidden="true" />
          </div>
          <figcaption className="moonlit-handoff__cap">
            <span lang="ko">02:23. 한 끼가 잠든 도시를 잇는다.</span>
            <span>02:23. One meal stitches the sleeping city back together.</span>
          </figcaption>
        </figure>

        <div className="moonlit-handoff__body" data-reveal>
          <p className="moonlit-handoff__line" lang="ko">
            그가 건넨 것은 한 그릇의 밤이 아니라, 잠들지 못한 누군가에게
            닿는 온기였다. 도시의 모든 불이 꺼진 이 시간에 — 그래도 켜져
            있는 것은, 당신의 부엌과, 그의 헤드라이트뿐이다.
          </p>
          <p className="moonlit-handoff__line-en">
            What he handed over was not a bowl of food. It was the warmth of
            being reached, at the hour when no one reaches anyone. Every
            other light in the city is out. Yours — and his headlight — are
            the only two still on.
          </p>

          <p className="moonlit-handoff__signoff moonlit-mono" lang="ko">
            잘 드세요. — 좋은 밤 되세요.
          </p>
          <p className="moonlit-handoff__signoff-en moonlit-mono">
            EAT WELL. — GOOD NIGHT.
          </p>
        </div>
      </div>
    </section>
  );
}
