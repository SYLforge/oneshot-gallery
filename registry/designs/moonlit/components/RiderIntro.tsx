"use client";

import { useRef } from "react";
import { useInView } from "../hooks/useInView";
import { useTypewriter } from "../hooks/useTypewriter";

const RIDER_KO =
  "라이더 #14. 새벽 세 시의 도시를, 잠들지 않은 당신에게 잇는다.";

/**
 * Chapter 02 — the rider panel. The portrait (`rider-character`) sits in a
 * framed webtoon panel on the left; on the right a delivery-status caption
 * types itself out (technique: typewriter) the way a real tracker updates,
 * then a short, voice-of-the-rider paragraph sits underneath. The portrait
 * is the cool face of the page; the caption is the warm one — the only
 * place on this section where the language gets personal.
 *
 * The status line types only when the panel has been seen (start = seen),
 * so a reader who has not scrolled down sees a silent panel. The hook owns
 * the visible string via a DOM ref (one write per glyph, no React
 * re-renders). Without JS the full text is in a visually-hidden span, so
 * the panel is fully readable from the very first paint.
 */
export default function RiderIntro() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const { seen } = useInView<HTMLElement>(sectionRef, { threshold: 0.35 });
  const start = seen;
  const typeRef = useTypewriter<HTMLSpanElement>(RIDER_KO, start, 55);

  return (
    <section
      className="moonlit-rider"
      ref={sectionRef}
      aria-labelledby="moonlit-rider-title"
    >
      <p className="moonlit-eyebrow moonlit-mono" data-reveal aria-hidden="true">
        CH. 02 — 라이더 소개 · MEET THE RIDER
      </p>
      <h2 className="moonlit-sechead" id="moonlit-rider-title" data-reveal>
        The rider who is still awake{" "}
        <span lang="ko" className="moonlit-sechead__ko">
          잠들지 못한 라이더
        </span>
      </h2>

      <div className="moonlit-rider__grid">
        <figure className="moonlit-panel moonlit-rider__panel" data-reveal>
          <div className="moonlit-panel__art">
            <picture>
              <source
                srcSet="/media/moonlit/rider-character.avif"
                type="image/avif"
              />
              <source
                srcSet="/media/moonlit/rider-character.webp"
                type="image/webp"
              />
              <img
                className="moonlit-panel__img"
                src="/media/moonlit/rider-character.avif"
                alt="A young Korean delivery rider at night, helmet under one arm, the empty city behind him lit by cold neon. His face is tired but kind. 한국인 배달 라이더 초상 — 한 팔에 헬멧을 끼고, 뒤로 텅 빈 네온 도시. 피곤하지만 따뜻한 얼굴."
                loading="lazy"
                decoding="async"
                width={832}
                height={1216}
              />
            </picture>
            <div className="moonlit-panel__vignette" aria-hidden="true" />
            <p className="moonlit-panel__chip moonlit-mono" aria-hidden="true">
              #14 · KIM TAE-OH
            </p>
          </div>
          <figcaption className="moonlit-panel__cap">
            <span lang="ko">새벽 인부(人夫). 도시의 유일한 불빛.</span>
            <span>The only light moving in the city.</span>
          </figcaption>
        </figure>

        <div className="moonlit-rider__body" data-reveal>
          <div
            className="moonlit-status"
            role="status"
            aria-live="polite"
            aria-label={RIDER_KO}
          >
            <p className="moonlit-status__head moonlit-mono">
              <span className="moonlit-status__time">02:14:08</span>
              <span className="moonlit-status__sep" aria-hidden="true">
                —
              </span>
              <span className="moonlit-status__state">
                배차 완료 · ASSIGNED
              </span>
            </p>
            <p className="moonlit-status__line" lang="ko">
              <span className="moonlit-sr">{RIDER_KO}</span>
              <span aria-hidden="true" ref={typeRef} />
              <span
                className="moonlit-status__cursor is-typing"
                aria-hidden="true"
              >
                ▋
              </span>
            </p>
          </div>

          <p className="moonlit-rider__prose" lang="ko">
            도시의 절반은 이미 잠들었다. 나머지 절반을 위해, 그는 매일 밤
            오토바이를 탄다. 잠들지 못한 누군가에게 따뜻한 한 끼를 건네는 일 —
            그것이 그가 이 밤에 존재하는 이유다.
          </p>
          <p className="moonlit-rider__prose-en">
            Half the city is already asleep. For the other half, he rides —
            and the only reason he is in this night at all is to hand one warm
            meal to someone who has not slept.
          </p>

          <ul className="moonlit-rider__facts">
            <li>
              <span className="moonlit-mono moonlit-rider__factk">배달 거리</span>
              <span className="moonlit-rider__factv moonlit-mono">7.4 km</span>
              <span className="moonlit-rider__factg">across the Han, every night</span>
            </li>
            <li>
              <span className="moonlit-mono moonlit-rider__factk">운행 시간</span>
              <span className="moonlit-rider__factv moonlit-mono">22:00 – 04:00</span>
              <span className="moonlit-rider__factg">the hours nobody else wants</span>
            </li>
            <li>
              <span className="moonlit-mono moonlit-rider__factk">오늘 배달</span>
              <span className="moonlit-rider__factv moonlit-mono">12 / 14</span>
              <span className="moonlit-rider__factg">two warm meals still to go</span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
