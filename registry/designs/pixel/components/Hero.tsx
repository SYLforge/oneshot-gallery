"use client";

import PixelCharacter from "./PixelCharacter";

type Props = {
  reduced: boolean;
};

/**
 * The signature scene — a 2003 arcade hero. The mascot is a real CSS
 * box-shadow sprite (see PixelCharacter / sprites.ts); the CRT glow behind
 * it is pure CSS gradients. The title gets the chromatic-aberration
 * treatment: a .pixel-ab element whose cyan-left / magenta-right ghosts
 * ride --pixel-shift / --pixel-ghost (written by useScrollRush) on top of
 * an always-on idle breathe, so the heading is alive even at rest.
 *
 * No canvas, no image: every pixel is a shadow tuple, every glow is a
 * gradient. A static pixel-tile floor backs the stage so the no-JS view
 * is a composed arcade, not a black hole.
 */
export default function Hero({ reduced }: Props) {
  return (
    <header className="pixel-hero">
      <div className="pixel-hero__backdrop" aria-hidden="true">
        <div className="pixel-hero__bloom" />
        <div className="pixel-hero__floor" />
      </div>

      <div className="pixel-hero__content">
        <p className="pixel-hero__kicker">
          <span className="pixel-hero__lamp" aria-hidden="true" />
          <span>NOW PLAYING</span>
          <span className="pixel-hero__ko" lang="ko">
            지금 플레이 중
          </span>
        </p>

        <h1
          className="pixel-hero__title pixel-ab"
          data-text="PIXEL"
        >
          PIXEL
        </h1>
        <p className="pixel-hero__sub" lang="ko">
          픽셀 — 8비트 아케이드 스튜디오
        </p>

        <div className="pixel-hero__stage">
          <PixelCharacter
            reduced={reduced}
            scale={3}
            className="pixel-hero__mascot"
          />
          <div className="pixel-hero__insertcoin">
            <span className="pixel-hero__insertcoin-text">
              INSERT COIN TO PLAY
            </span>
            <span className="pixel-hero__insertcoin-ko" lang="ko">
              동전을 넣으면 시작합니다
            </span>
          </div>
        </div>

        <p className="pixel-hero__lede">
          An indie studio for games that fit in 32 kilobytes and a single
          afternoon. We make cheerful, saturated, two-button worlds — the
          kind a CRT in a Seoul arcade was still running in 2003, long after
          everyone agreed the future had arrived.{" "}
          <span lang="ko" className="pixel-hero__lede-ko">
            32킬로바이트와 한 오후면 충분한 게임을 만드는 인디 스튜디오.
            쾌활하고, 포화되고, 두 개 버튼이면 되는 세계 — 2003년 서울
            오락실의 브라운관이, 모두가 미래가 도착했다고 동의한 뒤에도
            여전히 켜져 있던 그런 게임.
          </span>
        </p>

        <p className="pixel-hero__hint">
          scroll — the cabinet wakes up ·{" "}
          <span lang="ko">스크롤 — 캐비닛이 깨어납니다</span>
        </p>
      </div>
    </header>
  );
}
