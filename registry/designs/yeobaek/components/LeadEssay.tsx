"use client";

import type { ReactNode } from "react";
import Footnote, { FnRef } from "./Footnotes";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import { useScrollScrub } from "../hooks/useScrollScrub";

/**
 * The lead essay — the journal's signature layout.
 *
 * Two passage types alternate:
 * - Block: a measured text column with a margin rail for footnotes
 *   (a two-column grid at wide viewports; the rail folds beneath the
 *   text on narrow ones).
 * - Spread: a tipped-in figure plate beside the text. The plate pins with
 *   position: sticky while the paragraphs flow past, and a rAF-measured,
 *   lerp-smoothed scroll scrub (--yb-scrub) draws the plate's ink stroke
 *   via stroke-dashoffset — then the plate releases as the spread ends.
 *
 * Every paragraph exists in the server HTML; with JavaScript disabled the
 * essay reads as a clean, complete document.
 */

function Block({
  children,
  margin,
}: {
  children: ReactNode;
  margin?: ReactNode;
}) {
  return (
    <div className="yeobaek-block">
      <div className="yeobaek-block__text">{children}</div>
      {margin ? <div className="yeobaek-block__margin">{margin}</div> : null}
    </div>
  );
}

function Spread({
  figure,
  flip = false,
  children,
}: {
  figure: ReactNode;
  flip?: boolean;
  children: ReactNode;
}) {
  const reduced = usePrefersReducedMotion();
  const scrubRef = useScrollScrub<HTMLDivElement>(reduced);
  return (
    <div
      ref={scrubRef}
      className={`yeobaek-spread${flip ? " yeobaek-spread--flip" : ""}`}
    >
      <div className="yeobaek-spread__fig">{figure}</div>
      <div className="yeobaek-spread__text">{children}</div>
    </div>
  );
}

/** 도판 一 — a single brushstroke, drawn by the reader's scroll. */
function PlateOneStroke() {
  return (
    <figure className="yeobaek-figure" data-reveal>
      <div className="yeobaek-plate">
        <svg
          className="yeobaek-plate__art"
          viewBox="0 0 360 460"
          role="img"
          aria-label="일획 — 빈 종이 위를 단 한 번 지나간 붓질. A single brushstroke crossing an otherwise empty plate."
        >
          <path
            className="yeobaek-stroke yeobaek-stroke--broad"
            d="M 60 398 C 98 326, 128 288, 176 240 C 226 190, 262 148, 298 76"
            pathLength={1}
          />
          <path
            className="yeobaek-stroke yeobaek-stroke--thin"
            d="M 76 404 C 120 330, 218 226, 306 92"
            pathLength={1}
          />
        </svg>
      </div>
      <figcaption className="yeobaek-figure__cap">
        <span lang="ko">
          도판 一 · 일획 — 붓은 한 번 지나갔고, 나머지는 종이가 말한다.
        </span>
        <em>Plate I · One stroke — the brush passes once; the paper says the rest.</em>
      </figcaption>
    </figure>
  );
}

/** 도판 二 — two strokes far apart; the interval is the subject. */
function PlateInterval() {
  return (
    <figure className="yeobaek-figure" data-reveal>
      <div className="yeobaek-plate">
        <svg
          className="yeobaek-plate__art"
          viewBox="0 0 360 460"
          role="img"
          aria-label="간(間) — 멀리 떨어진 두 획과 그 사이의 빈 공간, 구석의 붉은 낙관. Two strokes far apart, the emptiness between them, a small red seal in the corner."
        >
          <path
            className="yeobaek-stroke yeobaek-stroke--pillar"
            d="M 118 74 C 112 168, 114 268, 122 388"
            pathLength={1}
          />
          <path
            className="yeobaek-stroke yeobaek-stroke--pillar"
            d="M 246 70 C 252 166, 250 278, 240 392"
            pathLength={1}
          />
          <rect className="yeobaek-seal" x="294" y="402" width="20" height="20" rx="1" />
        </svg>
      </div>
      <figcaption className="yeobaek-figure__cap">
        <span lang="ko">
          도판 二 · 간(間) — 두 획 사이의 거리가 이 그림의 주제다.
        </span>
        <em>Plate II · The interval — the distance between two strokes is the subject.</em>
      </figcaption>
    </figure>
  );
}

export default function LeadEssay() {
  return (
    <section
      id="yb-essay"
      className="yeobaek-essay"
      aria-labelledby="yb-essay-title"
    >
      <header className="yeobaek-essay__head" data-reveal>
        <p className="yeobaek-kicker">
          <span lang="ko">권두 에세이</span> · Lead Essay
        </p>
        <h2 id="yb-essay-title" className="yeobaek-essay__title" lang="ko">
          아직 말해지지 않은 것
        </h2>
        <p className="yeobaek-essay__sub">The Not-Yet-Said — Notes on Yeobaek</p>
        <p className="yeobaek-essay__byline">
          <span lang="ko">글 문서정</span> · Text by Moon Seo-jeong
        </p>
      </header>

      <Block>
        <p className="yeobaek-p yeobaek-p--ko" lang="ko" data-reveal>
          여백은 비어 있지 않다. 그것은 아직 말해지지 않은 것이다. 화선지
          위에서 붓이 멈춘 자리, 남겨진 흰 부분을 우리는 그냥 종이라고 부르지
          않는다. 그것은 화가가 끝까지 지켜 낸 침묵이고, 보는 사람이 이어서
          쓰라고 비워 둔 자리다.
        </p>
        <p className="yeobaek-p yeobaek-p--en yeobaek-p--drop" data-reveal>
          Blank space is not empty. It is the not-yet-said. Where the brush
          stops on the paper, we do not call what remains mere paper. It is a
          silence the painter kept to the very end — a seat left open, so that
          whoever looks may finish the sentence.
        </p>
      </Block>

      <Block
        margin={
          <Footnote no={1}>
            <span lang="ko">
              김정희(1786–1856), 「세한도」, 1844, 종이에 수묵. 제주 유배
              중에 그려 제자 이상적에게 보냈다.
            </span>{" "}
            <em>
              Kim Jeong-hui (Chusa), Sehando — Winter Scene, 1844, ink on
              paper; painted in exile on Jeju and sent to his student Yi
              Sang-jeok.
            </em>
          </Footnote>
        }
      >
        <p className="yeobaek-p yeobaek-p--ko" lang="ko" data-reveal>
          추사의 「세한도」를 오래 보고 있으면 이상한 일이 일어난다. 집 한
          채, 나무 네 그루. 그린 것은 그뿐인데, 종이의 나머지 전부가 겨울이
          된다.
          <FnRef no={1} /> 그 겨울은 그려지지 않았다. 그릴 필요가 없었다.
          여백이 대신 추웠기 때문이다.
        </p>
        <p className="yeobaek-p yeobaek-p--en" data-reveal>
          Look long enough at Chusa’s Sehando and something strange happens.
          One house, four trees — that is all he painted, and yet every
          remaining inch of paper becomes winter. The winter is not drawn. It
          did not need to be. The blank space is cold on its behalf.
        </p>
      </Block>

      <Spread figure={<PlateOneStroke />}>
        <p className="yeobaek-p yeobaek-p--ko" lang="ko" data-reveal>
          옛 화론은 일획(一劃)을 말한다. 한 번의 붓질에 전부를 걸고, 두
          번째 붓질을 삼가는 일. 획이 끝나는 순간 그림은 절반만 완성되고,
          나머지 절반은 붓이 닿지 않은 곳이 완성한다.
        </p>
        <p className="yeobaek-p yeobaek-p--en" data-reveal>
          The old treatises speak of ilhoek, the single stroke: to stake
          everything on one pass of the brush, and to refrain from the second.
          When the stroke ends, the painting is only half finished. The half
          the brush never touched completes it.
        </p>
        <p className="yeobaek-p yeobaek-p--ko" lang="ko" data-reveal>
          획은 소리이고 여백은 울림이다. 종이를 치는 것은 한 번이지만,
          울리는 것은 오래간다. 그래서 급한 그림에는 여백이 없다. 울릴
          시간을 그림이 스스로 견디지 못하는 것이다.
        </p>
        <p className="yeobaek-p yeobaek-p--en" data-reveal>
          The stroke is the sound; the blank is the resonance. The paper is
          struck once, and it rings for a long time. This is why a hurried
          painting has no yeobaek — it cannot bear the time its own echo
          needs.
        </p>
        <p className="yeobaek-p yeobaek-p--ko" lang="ko" data-reveal>
          지우는 것과 비우는 것은 다르다. 지움은 있던 것을 없애지만, 비움은
          없는 것을 있게 한다. 획을 아끼는 손은 인색한 손이 아니라, 종이의
          몫을 남겨 두는 손이다.
        </p>
        <p className="yeobaek-p yeobaek-p--en" data-reveal>
          Erasing and emptying are not the same. Erasure removes what was
          there; emptiness makes present what is not. The hand that spares its
          strokes is not a miserly hand — it is a hand that leaves the paper
          its share.
        </p>
      </Spread>

      <Block
        margin={
          <Footnote no={2}>
            <span lang="ko">
              석도(石濤, 1642–1707), 『고과화상화어록』. ‘일획론’의 출전.
            </span>{" "}
            <em>
              Shitao, Remarks on Painting by the Monk Bitter Gourd — the
              source of the one-stroke doctrine.
            </em>
          </Footnote>
        }
      >
        <p className="yeobaek-p yeobaek-p--ko" lang="ko" data-reveal>
          화가 석도는 일획이 뭇 획의 뿌리라고 썼다.
          <FnRef no={2} /> 처음의 한 획이 나머지 모든 획을 낳고, 마지막에는
          긋지 않은 획들이 그림 바깥까지 이어진다는 뜻으로 나는 읽는다.
          그림의 끝은 종이의 끝이 아니다.
        </p>
        <p className="yeobaek-p yeobaek-p--en" data-reveal>
          The painter Shitao wrote that the single stroke is the root of ten
          thousand strokes. I read him to mean that the first stroke fathers
          every stroke after it — and that, in the end, the strokes never
          drawn continue past the edge of the painting. A painting does not
          end where its paper does.
        </p>
      </Block>

      <Spread flip figure={<PlateInterval />}>
        <p className="yeobaek-p yeobaek-p--ko" lang="ko" data-reveal>
          여백은 종이 위에만 있지 않다. 우리말은 쉼으로 말한다. 대답 대신
          놓이는 짧은 침묵은 회피가 아니라 예의다. 말과 말 사이의 그 간격에서,
          차마 하지 못한 말이 잠시 살다 간다.
        </p>
        <p className="yeobaek-p yeobaek-p--en" data-reveal>
          Yeobaek does not live only on paper. Korean speaks in pauses. The
          short silence set down in place of an answer is not evasion; it is
          courtesy. In the interval between one word and the next, the things
          we could not bring ourselves to say live for a moment, and pass.
        </p>
        <p className="yeobaek-p yeobaek-p--ko" lang="ko" data-reveal>
          편지에서도 그렇다. 가장 오래 읽게 되는 부분은 추신이 아니라,
          문장이 끝나고 서명이 시작되기 전의 그 빈 줄이다. 거기에 쓰다 만
          마음이 접혀 있다.
        </p>
        <p className="yeobaek-p yeobaek-p--en" data-reveal>
          So it is with letters. The part we read longest is not the
          postscript but the blank line between the last sentence and the
          signature. Folded into it is the feeling that never got written.
        </p>
        <p className="yeobaek-p yeobaek-p--ko" lang="ko" data-reveal>
          건축가들은 마당을 비운 방이라고 부른다. 한옥의 마당은 아무것도
          하지 않음으로써 모든 방을 잇는다. 비가 오면 비를 받고, 달이 뜨면
          달을 받는다. 그뿐인데, 그것이 집의 중심이다.
        </p>
        <p className="yeobaek-p yeobaek-p--en" data-reveal>
          Architects call the madang an emptied room. The courtyard of a hanok
          connects every room precisely by doing nothing. When it rains, it
          receives the rain; when the moon rises, it receives the moon. That
          is all — and that is the center of the house.
        </p>
      </Spread>

      <Block
        margin={
          <Footnote no={3}>
            <span lang="ko">
              고수의 북은 모든 박을 치지 않는다. 비워 둔 박이 소리꾼의
              숨자리가 된다.
            </span>{" "}
            <em>
              The drummer does not strike every beat; the beats left empty
              become the singer’s place to breathe.
            </em>
          </Footnote>
        }
      >
        <p className="yeobaek-p yeobaek-p--ko" lang="ko" data-reveal>
          판소리의 명창은 소리를 배우기 전에 숨을 배운다. 소리와 소리 사이,
          부채가 접히는 그 한 박자를 위해 십 년을 쓴다고 한다.
          <FnRef no={3} /> 청중이 우는 것은 대개 그 박자에서다. 노래가 아니라
          노래가 멈춘 자리에서.
        </p>
        <p className="yeobaek-p yeobaek-p--en" data-reveal>
          A pansori master learns to breathe before learning to sing. They say
          ten years go into that single beat between phrases — the beat where
          the fan closes. It is usually there that the audience weeps: not at
          the song, but at the place where the song stops.
        </p>
      </Block>

      <Block
        margin={
          <Footnote no={4}>
            <span lang="ko">
              이 단의 글줄은 로마자 기준 예순다섯 자 안팎 — 눈이 길을 잃지
              않고 되돌아올 수 있는 거리다.
            </span>{" "}
            <em>
              This column’s measure runs to roughly sixty-five Latin
              characters: the distance an eye can travel and still find its
              way back.
            </em>
          </Footnote>
        }
      >
        <p className="yeobaek-p yeobaek-p--ko" lang="ko" data-reveal>
          이 페이지의 조판도 같은 원리 위에 서 있다. 지금 당신이 읽는 글줄이
          숨 쉬는 것은 글자 덕분이 아니라 행간 덕분이다. 활자공들은 이것을
          오래전부터 알았다. 본문보다 먼저 여백을 짠다는 것을.
          <FnRef no={4} />
        </p>
        <p className="yeobaek-p yeobaek-p--en" data-reveal>
          The typesetting of this page stands on the same principle. The line
          you are reading breathes not because of its letters but because of
          the lead between them. Compositors have known it for centuries: you
          set the margins before you set the text.
        </p>
      </Block>

      <div className="yeobaek-codasec">
        <h3 className="yeobaek-codasec__title" data-reveal>
          <span lang="ko">코다</span> · Coda
        </h3>
        <div className="yeobaek-coda">
          <p className="yeobaek-p yeobaek-p--ko" lang="ko" data-reveal>
            여백을 남긴다는 것은 결국 상대를 믿는다는 것이다. 다 말하지
            않아도 알아들을 것이라고, 비워 둔 자리를 함부로 채우지 않을
            것이라고.
          </p>
          <p className="yeobaek-p yeobaek-p--en" data-reveal>
            To leave blank space is, in the end, to trust. To trust that you
            will understand what goes unsaid — that you will not carelessly
            fill the seat left open for you.
          </p>
          <p className="yeobaek-p yeobaek-p--ko" lang="ko" data-reveal>
            그래서 이 잡지는 일곱 번째 호를 비움에 바친다. 지면의 절반은
            차마 인쇄하지 못한 것이 아니라, 인쇄하지 않기로 한 것이다. 남은
            것은 여백뿐이고, 그것으로 충분하다.
          </p>
          <p className="yeobaek-p yeobaek-p--en" data-reveal>
            And so this journal gives its seventh issue to emptiness. Half of
            these pages are not unprinted for want of ink; they are unprinted
            on purpose. What remains is the margin — and the margin is
            enough.
          </p>
        </div>
      </div>
    </section>
  );
}
