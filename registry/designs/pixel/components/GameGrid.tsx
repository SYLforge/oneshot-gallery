"use client";

import PixelSprite from "./PixelSprite";
import { COIN, HEART, STAR, type Pixel } from "./sprites";

/** A fictional in-house game, with a thumbnail drawn as a small sprite. */
type Game = {
  id: string;
  title: string;
  ko: string;
  year: string;
  genre: string;
  blurb: string;
  blurbKo: string;
  thumb: readonly Pixel[];
  accent: string; // a token name from the palette, for the card's frame
  status: "OUT NOW" | "SOON" | "BETA";
};

// Tiny thumbnail sprites (8x8-ish) drawn in the studio palette extension.
const BLOB: readonly Pixel[] = [
  [2, 0, "k"], [3, 0, "k"], [4, 0, "k"],
  [1, 1, "k"], [2, 1, "p"], [3, 1, "pl"], [4, 1, "p"], [5, 1, "k"],
  [0, 2, "k"], [1, 2, "p"], [2, 2, "pl"], [3, 2, "w"], [4, 2, "pl"], [5, 2, "p"], [6, 2, "k"],
  [0, 3, "k"], [1, 3, "p"], [2, 3, "pl"], [3, 3, "pl"], [4, 3, "pl"], [5, 3, "p"], [6, 3, "k"],
  [1, 4, "k"], [2, 4, "p"], [3, 4, "k"], [4, 4, "k"], [5, 4, "p"], [6, 4, "k"], [7, 4, "k"],
  [2, 5, "k"], [3, 5, "p"], [4, 5, "p"], [5, 5, "p"], [6, 5, "k"], [7, 5, "k"],
  [3, 6, "k"], [4, 6, "k"], [5, 6, "k"],
] as const;

const SWORD: readonly Pixel[] = [
  [3, 0, "s"], [3, 1, "w"], [3, 2, "w"], [3, 3, "w"], [3, 4, "w"], [3, 5, "w"],
  [2, 5, "s"], [3, 5, "s"], [4, 5, "s"],
  [3, 6, "s"], [3, 7, "s"],
  [0, 4, "k"], [6, 0, "k"],
] as const;

const ROCKET: readonly Pixel[] = [
  [3, 0, "c"],
  [2, 1, "k"], [3, 1, "cl"], [4, 1, "k"],
  [2, 2, "c"], [3, 2, "w"], [4, 2, "c"],
  [2, 3, "c"], [3, 3, "c"], [4, 3, "c"],
  [1, 4, "k"], [2, 4, "c"], [3, 4, "c"], [4, 4, "c"], [5, 4, "k"],
  [2, 5, "y"], [4, 5, "y"],
  [3, 6, "y"],
] as const;

const PUZZLE: readonly Pixel[] = [
  [0, 0, "m"], [1, 0, "m"], [2, 0, "k"], [3, 0, "p"], [4, 0, "p"],
  [0, 1, "m"], [1, 1, "m"], [2, 1, "k"], [3, 1, "p"], [4, 1, "p"],
  [0, 2, "k"], [2, 2, "k"], [4, 2, "k"],
  [0, 3, "y"], [1, 3, "y"], [2, 3, "k"], [3, 3, "c"], [4, 3, "c"],
  [0, 4, "y"], [1, 4, "y"], [2, 4, "k"], [3, 4, "c"], [4, 4, "c"],
] as const;

const GAMES: readonly Game[] = [
  {
    id: "blobquest",
    title: "BLOB QUEST",
    ko: "블롭 퀘스트",
    year: "2003",
    genre: "PLATFORMER",
    blurb:
      "A pink blob collects coins across 32 hand-pixelled rooms. Two buttons, one jump, infinite retries.",
    blurbKo:
      "분홍 블롭이 32개의 손그린 방을 돌며 동전을 모은다. 버튼 둘, 점프 하나, 재도전 무제한.",
    thumb: BLOB,
    accent: "bubblegum",
    status: "OUT NOW",
  },
  {
    id: "knightlite",
    title: "KNIGHT LITE",
    ko: "나이트 라이트",
    year: "2004",
    genre: "ROGUELIKE",
    blurb:
      "Descend a chrome dungeon with one sword and one life. The dungeons re-roll every quarter you feed it.",
    blurbKo:
      "크롬 던전을 검 하나, 목숨 하나로 내려간다. 동전을 넣을 때마다 던전이 다시 섞인다.",
    thumb: SWORD,
    accent: "chrome",
    status: "OUT NOW",
  },
  {
    id: "starlancer",
    title: "STARLANCER",
    ko: "스타랜서",
    year: "2005",
    genre: "SHMUP",
    blurb:
      "A vertical shooter that runs at 60Hz on a fridge. Cyan ships, acid-yellow bullets, a chiptune that never resolves.",
    blurbKo:
      "냉장고에서도 60Hz로 도는 세로 슈팅. 시안 함선, 산성 노란 탄막, 끝내 해결되지 않는 칩튠.",
    thumb: ROCKET,
    accent: "cyan",
    status: "BETA",
  },
  {
    id: "mintdrop",
    title: "MINTDROP",
    ko: "민트드롭",
    year: "2006",
    genre: "PUZZLE",
    blurb:
      "Match four colors, clear the board, feel okay about it. Designed for the eight minutes between two trains.",
    blurbKo:
      "네 색을 맞추고, 판을 비우고, 그것에 대해 괜찮아진다. 두 역 사이의 8분을 위해 설계됨.",
    thumb: PUZZLE,
    accent: "mint",
    status: "SOON",
  },
];

/**
 * The catalog — four fictional in-house games as pixel-thumbnailed cards.
 * Each thumbnail is its own box-shadow sprite (the ascii-render technique,
 * same material as the hero mascot), so the grid is one consistent pixel
 * language from hero to footer. Cards are real articles with a real
 * heading; the status chip is a <span> with a status token color so the
 * "OUT NOW" / "SOON" / "BETA" distinction survives without color alone.
 *
 * The grid is CSS Grid that reflows from one column at 360px to two at
 * mid widths to four at 1440px+; the pixel thumbnails are static (no
 * motion), so reduced-motion visitors see exactly the same catalog.
 */
export default function GameGrid() {
  return (
    <section className="pixel-grid" aria-labelledby="pixel-grid-title">
      <div className="pixel-sechead">
        <p className="pixel-sechead__no">02 · CATALOG</p>
        <h2
          id="pixel-grid-title"
          className="pixel-sechead__title pixel-ab"
          data-text="OUR GAMES"
        >
          OUR GAMES
        </h2>
        <p className="pixel-sechead__ko" lang="ko">
          우리가 만든 게임
        </p>
        <p className="pixel-sechead__meta">
          four cartridges ·{" "}
          <span lang="ko">네 개의 카트리지</span>
        </p>
      </div>

      <ul className="pixel-grid__list">
        {GAMES.map((g) => (
          <li key={g.id} className={`pixel-card pixel-card--${g.accent}`}>
            <article className="pixel-card__body">
              <div className="pixel-card__thumb" aria-hidden="true">
                <PixelSprite pixels={g.thumb} scale={4} />
              </div>
              <div className="pixel-card__head">
                <h3
                  className="pixel-card__title pixel-ab"
                  data-text={g.title}
                >
                  {g.title}
                </h3>
                <p className="pixel-card__ko" lang="ko">
                  {g.ko}
                </p>
              </div>
              <p className="pixel-card__meta">
                <span className="pixel-card__year">{g.year}</span>
                <span className="pixel-card__dot">·</span>
                <span className="pixel-card__genre">{g.genre}</span>
              </p>
              <p className="pixel-card__blurb">{g.blurb}</p>
              <p className="pixel-card__blurbko" lang="ko">
                {g.blurbKo}
              </p>
              <p className="pixel-card__foot">
                <span className={`pixel-card__status pixel-card__status--${g.status.toLowerCase().replace(" ", "")}`}>
                  {g.status}
                </span>
                <span className="pixel-card__icons" aria-hidden="true">
                  <PixelSprite pixels={COIN} scale={2} className="pixel-card__icon" />
                  <PixelSprite pixels={HEART} scale={2} className="pixel-card__icon" />
                  <PixelSprite pixels={STAR} scale={2} className="pixel-card__icon" />
                </span>
              </p>
            </article>
          </li>
        ))}
      </ul>
    </section>
  );
}
