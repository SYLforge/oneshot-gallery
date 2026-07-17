"use client";

import { useReveal } from "../hooks/useReveal";
import { SEASONS, type useSeason } from "../hooks/useSeason";

type SeasonApi = ReturnType<typeof useSeason>;

/**
 * Section 03 — the three climate zones, scroll-ordered by thermal logic.
 *
 * A hanok is not one room; it is a sequence of thermal conditions. The page
 * walks you through them in the order the building does, and each zone's
 * spatial treatment matches its real character:
 *
 *   ondol (온돌방)  — warm, enclosed, dense. A contained earth-wall panel,
 *                     two-column body text packed close, a warm red line
 *                     glowing beneath the floor (the underfloor heat).
 *   maru  (마루)    — cool, open, airy. A wide snow-ground band, generous
 *                     whitespace, three sparse facts set far apart.
 *   madang (마당)   — central, sky-open, the empty hero moment. Season-driven
 *                     sky ground, an eave shadow drifting across it, the
 *                     fewest words on the page — the courtyard breathes.
 *
 * Each zone carries `data-reveal`; one shared `useReveal` observer adds
 * `is-shown` to each the first time it scrolls into view (staggered 100ms
 * per batch), driving the zone-reveal rise (transform/opacity, in CSS).
 * Without JS the zones are simply at rest (visible). Reduced motion: the
 * observer shows everything at rest, and the CSS parks the transition.
 */
export default function ClimateZones({ season }: { season: SeasonApi }) {
  const zonesRef = useReveal<HTMLElement>();

  return (
    <section
      ref={zonesRef}
      className="hanok-zones"
      aria-labelledby="hanok-zones-title"
    >
      <div className="hanok-sechead">
        <span className="hanok-sechead__no" aria-hidden="true">
          03
        </span>
        <h2 className="hanok-sechead__title" id="hanok-zones-title">
          Three climates, one house <span lang="ko">세 기후, 한 집</span>
        </h2>
        <p className="hanok-sechead__note">
          Each room is its own weather. <span lang="ko">방마다 날씨가 다르다.</span>
        </p>
      </div>

      <article
        className="hanok-zone hanok-zone--ondol"
        data-reveal
        aria-labelledby="hanok-ondol-title"
      >
        <p className="hanok-zone__tag">
          <span>01</span>
          <span>ONDOL · HEATED</span>
        </p>
        <h3 className="hanok-zone__title" id="hanok-ondol-title">
          The warm room <span lang="ko">온돌방</span>
        </h3>
        <p className="hanok-zone__sub">
          The floor holds the fire. <span lang="ko">아랫목에 불이 깔린다.</span>
        </p>
        <div className="hanok-zone__body">
          <p>
            The ondol is the reason a hanok can be still in winter. Smoke
            from the kitchen hearth travels under the stone floor before it
            reaches the chimney, and the floor — never the air — carries the
            heat. You sit on it. You sleep on it. The warmest place in the
            house is also the lowest, and so the room gathers everyone down
            to the floor, close, the way a fire gathers people.
          </p>
          <p lang="ko">
            온돌은 한옥이 겨울에도 고요한 까닭이다. 부엌 아궁이의 연기가
            굴뚝으로 가기 전, 돌아가는 바닥 아래를 지나간다. 공기가 아니라
            바닥이 열을 품는다. 앉고, 눽고, 집에서 가장 따뜻한 자리가 가장
            낮은 자리가 되어, 사람들을 바닥으로, 불 주위로 모은다.
          </p>
          <p>
            On this page the ondol is the dense zone: two columns of text, a
            contained panel, warm earth walls, and a single red line glowing
            beneath the floor — the underfloor heat made visible. Density is
            the design metaphor for warmth.
          </p>
          <p lang="ko">
            이 페이지에서 온돌은 밀도 높은 구역이다. 두 단의 글, 둘러싸인
            패널, 흙벽, 그리고 바닥 아래에서 빛나는 붉은 선 하나. 따뜻함을
            밀도로 옮긴 것이다.
          </p>
        </div>
      </article>

      <article
        className="hanok-zone hanok-zone--maru"
        data-reveal
        aria-labelledby="hanok-maru-title"
      >
        <p className="hanok-zone__tag">
          <span>02</span>
          <span>MARU · OPEN HALL</span>
        </p>
        <h3 className="hanok-zone__title" id="hanok-maru-title">
          The cool hall <span lang="ko">마루</span>
        </h3>
        <p className="hanok-zone__sub">
          Wood, raised, open on every side. <span lang="ko">들어올린 나무, 사방이 열린.</span>
        </p>
        <div className="hanok-zone__body">
          <p className="hanok-marufact">
            <span className="hanok-marufact__no">i</span>
            <span className="hanok-marufact__line">
              The maru is the house exhaling.
              <span lang="ko">마루는 집이 숨을 내쉬는 자리.</span>
            </span>
          </p>
          <p className="hanok-marufact">
            <span className="hanok-marufact__no">ii</span>
            <span className="hanok-marufact__line">
              Raised off the earth, open front and back, it catches the draft
              the ondol refuses.
              <span lang="ko">땅에서 들어올려 앞뒤로 열어, 온돌이 막은 바람을 받는다.</span>
            </span>
          </p>
          <p className="hanok-marufact">
            <span className="hanok-marufact__no">iii</span>
            <span className="hanok-marufact__line">
              In summer the family eats, reads, and sleeps here — the wooden
              floor is cooler than any room.
              <span lang="ko">여름엔 여기서 먹고, 읽고, 잔다. 나무바닥이 어떤 방보다 서늘하다.</span>
            </span>
          </p>
        </div>
      </article>

      <article
        className="hanok-zone hanok-zone--madang"
        data-reveal
        aria-labelledby="hanok-madang-title"
      >
        <Madang season={season} />
      </article>
    </section>
  );
}

/**
 * The madang (마당) — the open courtyard, season-driven.
 * It reads the shared season state and renders the matching haiku, while
 * the sky ground and eave shadow are driven by `data-season` on the root
 * (set in page.tsx) so CSS does the recolor without a re-render here.
 */
function Madang({ season }: { season: SeasonApi }) {
  const current = SEASONS.find((s) => s.id === season.season) ?? SEASONS[0];
  return (
    <>
      <p className="hanok-zone__tag">
        <span>03</span>
        <span>MADANG · OPEN TO SKY</span>
      </p>
      <h3 className="hanok-zone__title" id="hanok-madang-title">
        The courtyard <span lang="ko">마당</span>
      </h3>
      <p className="hanok-zone__sub">
        The empty center the house is built around.{" "}
        <span lang="ko">집이 그 주위로 지어진, 비어 있는 중심.</span>
      </p>
      <div className="hanok-zone__body">
        <p className="hanok-madang__haiku">
          {current.haikuEn}
          <span lang="ko">{current.haikuKo}</span>
        </p>
        <p className="hanok-madang__note">
          {season.auto ? "auto-cycling" : `season · ${current.en}`}{" "}
          <span lang="ko">
            {season.auto ? "계절이 자동으로 바뀐다" : `계절 · ${current.ko}`}
          </span>
        </p>
      </div>
    </>
  );
}
