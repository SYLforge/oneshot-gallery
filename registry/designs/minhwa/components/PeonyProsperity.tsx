"use client";

import Picture from "./Picture";
import Narration from "./Narration";
import SealMark from "./SealMark";
import { useSealStamp } from "../hooks/useSealStamp";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

/**
 * Section 02 — 모란 (peony). In minhwa the peony is 부귀영화 (prosperity and
 * honor); to paint one is to wish a household full. The illustration is the
 * square peony panel, and the visitor finishes the wish by pressing the
 * vermillion seal — an 인장 pressed flat onto the section to certify it, the
 * same way a painter signs a finished work.
 *
 * The seal-press is the gallery's signature UI mechanic. On fine pointers
 * the seal hangs ready (dimmed) until pressed/focused; on touch and under
 * reduced motion it self-stamps the moment the panel enters view, so the
 * page is fully composed without a tap. Once stamped, the vermillion mark
 * sits over the painting's corner and a 1px ink rim expands to certify it.
 *
 * The peony's meaning arrives as a split-text narration, like a curator
 * reading the painting aloud. Both the panel and its narration are gated
 * behind .minhwa-js + is-visible, so with JavaScript off the wish is simply
 * already made.
 */
export default function PeonyProsperity() {
  const reduced = usePrefersReducedMotion();
  const { ref, stamped, stamp } = useSealStamp<HTMLDivElement>({
    auto: true,
    disabled: reduced,
  });

  return (
    <section
      className="minhwa-peony"
      aria-labelledby="minhwa-peony-title"
      ref={ref}
    >
      <div className="minhwa-sechead" data-reveal>
        <span className="minhwa-sechead__no" lang="en" aria-hidden="true">
          02
        </span>
        <h2 className="minhwa-sechead__title" id="minhwa-peony-title">
          모란{" "}
          <span className="minhwa-sechead__en" lang="en">
            the peony, 부귀
          </span>
        </h2>
      </div>

      <p className="minhwa-peony__intro" data-reveal>
        모란 한 송이는 부귀영화의 소원이다. 그림으로 그려 벽에 걸면,
        부족함이 스스로 채워지기를 바라는 마음이다.
      </p>
      <p className="minhwa-peony__intro-en" lang="en" data-reveal>
        A single peony is the wish for prosperity and honor — painted and
        hung so that what a household lacks might fill itself.
      </p>

      <div className="minhwa-peony__stage">
        <div className="minhwa-peony__mount" data-reveal="panel">
          <Picture
            className="minhwa-peony__art"
            stem="peony-prosperity"
            width={1024}
            height={1024}
            alt="모란도 — 만개한 모란 몇 송이. 민화에서 모란은 부귀와 영화를 상징한다. / Moran-do, peonies in full bloom; in minhwa the peony symbolizes prosperity and honor."
          />

          {/* The seal, positioned over the painting's lower-right corner —
              the canonical place a Korean painter signs. It is invisible
              until stamped; under reduced motion it is stamped from the
              first paint. */}
          <div
            className={`minhwa-peony__seal ${
              stamped ? "is-stamped" : "is-ready"
            }`}
            aria-hidden="true"
          >
            <SealMark chars={["富", "貴"]} />
          </div>
        </div>

        <div className="minhwa-peony__legend" data-reveal="panel">
          <p className="minhwa-peony__meaning">
            <Narration
              text="모란은 부귀(富貴)의 그림이다."
              lang="ko"
              start={350}
              step={70}
            />
          </p>
          <p className="minhwa-peony__meaning-en" lang="en">
            The peony is the picture of wealth and honor.
          </p>

          <dl className="minhwa-peony__dl">
            <div>
              <dt lang="ko">상징</dt>
              <dd>부귀영화 · 번성</dd>
            </div>
            <div>
              <dt lang="ko">어울리는 자리</dt>
              <dd>안방, 혼례, 새 출발</dd>
            </div>
            <div>
              <dt lang="ko">결합</dt>
              <dd>십장생·해와 달과 한 폭에</dd>
            </div>
          </dl>

          {/* The seal-press control. Pressing it certifies the wish: the
              vermillion 인장 stamps down. It is also reachable by keyboard
              (Enter/Space) and reveals the same state. */}
          <button
            type="button"
            className="minhwa-peony__press"
            onClick={stamp}
            disabled={stamped}
            data-stamped={stamped || undefined}
          >
            <span className="minhwa-peony__press-kr" lang="ko">
              {stamped ? "도장이 찍혔습니다" : "도장을 찍어 소원을 맺다"}
            </span>
            <span className="minhwa-peony__press-en" lang="en">
              {stamped ? "the wish is sealed" : "press the seal to bind the wish"}
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}
