"use client";

import HalftonePhoto from "./HalftonePhoto";

type Article = {
  kicker: string;
  kickerKo: string;
  titleKo: string;
  titleEn: string;
  dekKo: string;
  dekEn: string;
  byline: string;
  bylineKo: string;
  photo: "stage" | "riso" | "crowd" | "wall" | "tape" | "flyers";
  photoLabel: string;
  rotate: number;
  /** clip-path wipe direction for the panel reveal */
  clip?: "ltr" | "rtl" | "ttb" | "diag";
};

const ARTICLES: Article[] = [
  {
    kicker: "LIVE REPORT",
    kickerKo: "현장",
    titleKo: "스테이플러 소리가 마지막 곡이었다",
    titleEn: "The Stapler Was the Last Song",
    dekKo:
      "홍대 지하실에서 열린 마지막 쇼는 공연이 아니라 인쇄였다. 관객이 떠난 뒤에도 복사기는 한 시간을 더 돌았다.",
    dekEn:
      "The final show in the Hongdae basement wasn’t a gig — it was a print run. The photocopier ran an hour after the crowd left.",
    byline: "by Lim Ha-eun",
    bylineKo: "글 임하은",
    photo: "stage",
    photoLabel:
      "무대 위 모니터 한 대와 그 뒤로 어스름. A single stage monitor, dusk behind it.",
    rotate: -1.5,
    clip: "ltr",
  },
  {
    kicker: "WORKSHOP",
    kickerKo: "공방",
    titleKo: "리소그래피는 약속이다",
    titleEn: "Risograph Is a Promise",
    dekKo:
      "두 도수. 맞춤용 가이드. 한 장이 삐끗하면 천 장이 삐끗한다. 그래서 인쇄공은 노래를 부르지 않는다.",
    dekEn:
      "Two colors. Registration marks. Misregister one sheet and a thousand follow. So the printer doesn’t sing.",
    byline: "by Park Ji-woo",
    bylineKo: "글 박지우",
    photo: "riso",
    photoLabel:
      "리소 인쇄기의 드럼. Risograph drum, ink-loaded.",
    rotate: 1.2,
    clip: "diag",
  },
  {
    kicker: "FIELD NOTE",
    kickerKo: "취재",
    titleKo: "굉음 속의 조용한 사람들",
    titleEn: "The Quiet People in the Loud",
    dekKo:
      "가장 시끄러운 쇼에서 가장 조용한 일을 하는 사람들 — 현관을 지키고, 음향을 돌리고, 마지막 불을 끄는 사람들.",
    dekEn:
      "The loudest show depends on the quietest people — door, sound, the one who kills the lights last.",
    byline: "by Seo Da-in",
    bylineKo: "글 서다인",
    photo: "crowd",
    photoLabel:
      "객석 뒤쪽의 인물들. Figures at the back of the room.",
    rotate: -1,
    clip: "rtl",
  },
  {
    kicker: "ARCHIVE",
    kickerKo: "기록",
    titleKo: "벽에 붙은 것들의 연대기",
    titleEn: "A Chronicle of What Was on the Wall",
    dekKo:
      "포스터는 사라지고, 자국은 남는다. 한 동네 벽의 7년을 테이프 자국과 압핀 구멍만으로 읽어낸다.",
    dekEn:
      "Posters leave; marks stay. Seven years of one neighborhood’s wall, read only through tape residue and pinholes.",
    byline: "by Yoon Seo-yeon",
    bylineKo: "글 윤서연",
    photo: "wall",
    photoLabel:
      "테이프 자국이 남은 벽. A wall of tape residue.",
    rotate: 1.6,
    clip: "ttb",
  },
  {
    kicker: "OBJECT",
    kickerKo: "사물",
    titleKo: "카세트 한 개의 무게",
    titleEn: "The Weight of a Single Cassette",
    dekKo:
      "90분짜리 자기테이프 한 개가 담을 수 있는 것 — 한 밴드의 첫 데모, 혹은 한 동네의 잿소리.",
    dekEn:
      "What ninety minutes of magnetic tape can hold: a band’s first demo, or a neighborhood’s noise.",
    byline: "by Bae Jun-ho",
    bylineKo: "글 배준호",
    photo: "tape",
    photoLabel:
      "카세트 테이프 한 개. A single cassette tape.",
    rotate: -1.8,
    clip: "ltr",
  },
  {
    kicker: "DISPATCH",
    kickerKo: "파견",
    titleKo: "철거하기 전 날의 전단지 더미",
    titleEn: "The Flyer Stack the Night Before Demolition",
    dekKo:
      "헐릴 건물 앞, 마지막 밤에 남겨진 전단지 더미. 누가 모았고, 누가 버렸고, 누가 다시 주웠는지.",
    dekEn:
      "The flyer pile left the last night before a building comes down — who gathered it, dropped it, picked it up again.",
    byline: "by Choi Min",
    bylineKo: "글 최민",
    photo: "flyers",
    photoLabel:
      "전단지 더미. A stack of flyers.",
    rotate: 1.1,
    clip: "diag",
  },
];

/**
 * The article grid — the zine's dense core. Six features laid out in a
 * tight 2×3 / 3×2 magazine grid with hairline column rules between them.
 * Each panel carries a clip-path-revealed halftone "photo" (SVG dot field,
 * taped on with CSS) plus a kicker, bilingual headline, dek, and byline.
 *
 * The clip-path wipe direction varies per panel (left-to-right, right-to-
 * left, top-to-bottom, diagonal) — the photocopied/diagonal feel the brief
 * calls for. Under reduced motion or no-JS every panel is simply present,
 * its photo shown; the clip pre-state lives behind `.zine-js`.
 */
export default function ArticleGrid() {
  return (
    <section
      id="zine-features"
      className="zine-grid"
      aria-labelledby="zine-grid-title"
    >
      <header className="zine-grid__head" data-reveal>
        <p className="zine-kicker">
          <span lang="ko">이번 호 특집</span> · Inside No. 32
        </p>
        <h2 id="zine-grid-title" className="zine-grid__title">
          <span lang="ko">여섯 개의 지면</span>{" "}
          <span className="zine-grid__title-en">/ SIX PLATES</span>
        </h2>
        <p className="zine-grid__sub" lang="ko">
          복사기에서 갓 나온 여섯 장. 접기 전에 읽어라.
        </p>
      </header>

      <div className="zine-grid__wall">
        {ARTICLES.map((a, i) => (
          <article
            key={i}
            className={`zine-card zine-card--clip-${a.clip ?? "ltr"}`}
            data-reveal="clip"
          >
            <HalftonePhoto
              variant={a.photo}
              rotate={a.rotate}
              label={a.photoLabel}
            />
            <div className="zine-card__body">
              <p className="zine-card__kicker">
                <span lang="ko">{a.kickerKo}</span> · {a.kicker}
              </p>
              <h3 className="zine-card__title" lang="ko">
                {a.titleKo}
              </h3>
              <p className="zine-card__title-en">{a.titleEn}</p>
              <p className="zine-card__dek" lang="ko">
                {a.dekKo}
              </p>
              <p className="zine-card__dek-en">{a.dekEn}</p>
              <p className="zine-card__byline">
                <span lang="ko">{a.bylineKo}</span> · {a.byline}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
