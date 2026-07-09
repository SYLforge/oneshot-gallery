"use client";

import { useRef } from "react";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import { useScrollProgress } from "../hooks/useScrollProgress";

const CREDITS: Array<{ role: string; roleKo: string; name: string; nameKo: string }> = [
  { role: "DIRECTED BY", roleKo: "감독", name: "NO ONE", nameKo: "아무도" },
  {
    role: "WRITTEN BY",
    roleKo: "각본",
    name: "THE WEATHER, MOSTLY",
    nameKo: "대체로, 날씨",
  },
  {
    role: "ORIGINAL SCORE",
    roleKo: "음악",
    name: "HALFLIGHT",
    nameKo: "하프라이트",
  },
  {
    role: "STRINGS",
    roleKo: "현악",
    name: "THE CITY AT 4 A.M.",
    nameKo: "새벽 네 시의 도시",
  },
  {
    role: "RECORDED AT",
    roleKo: "녹음",
    name: "ROOM 209, IN WINTER",
    nameKo: "겨울의 209호",
  },
  {
    role: "SHOT ON",
    roleKo: "촬영",
    name: "NOTHING — 35MM OF INTENTION",
    nameKo: "필름 대신, 35mm의 작정",
  },
  {
    role: "CAST",
    roleKo: "출연",
    name: "A LIGHT, A SEA, A DOOR LEFT OPEN",
    nameKo: "빛 하나, 바다 하나, 열어 둔 문",
  },
  {
    role: "WITH THANKS TO",
    roleKo: "감사",
    name: "THE AUDIENCE THAT ALMOST WAS",
    nameKo: "있을 뻔했던 관객들",
  },
];

/**
 * Reel 05 — end credits, then the lights come up. The roll is scrubbed by
 * scroll (the same projector logic as the reel): a sticky, masked stage
 * inside a tall section, the credit column translating from below the frame
 * to above it as the section passes. Scroll-driven rather than time-driven,
 * so it works identically on touch, never traps anyone, and reduced motion
 * simply shows the full list, static. Without JavaScript the section takes
 * no extra height and the list is plainly readable.
 */
export default function CreditsFooter() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const rollRef = useRef<HTMLDivElement | null>(null);
  const reduced = usePrefersReducedMotion();

  useScrollProgress(
    sectionRef,
    (p) => {
      rollRef.current?.style.setProperty("--hl-roll-p", p.toFixed(4));
    },
    !reduced,
  );

  return (
    <>
      <section
        className="halflight-credits"
        ref={sectionRef}
        aria-labelledby="halflight-credits-title"
      >
        <div className="halflight-credits__sticky">
          <h2 className="halflight-sr" id="halflight-credits-title">
            End credits · 엔드 크레딧
          </h2>
          <div className="halflight-credits__mask">
            <div className="halflight-credits__roll" ref={rollRef}>
              <p className="halflight-credits__presents halflight-mono">
                HALFLIGHT PRESENTS
              </p>
              <p className="halflight-credits__film">
                A FILM THAT WAS NEVER SHOT
              </p>
              <p className="halflight-credits__filmko" lang="ko">
                끝내 찍히지 않은 영화
              </p>

              {CREDITS.map((credit) => (
                <div className="halflight-credits__block" key={credit.role}>
                  <p className="halflight-credits__role halflight-mono">
                    {credit.role} · <span lang="ko">{credit.roleKo}</span>
                  </p>
                  <p className="halflight-credits__name">
                    {credit.name}{" "}
                    <span lang="ko" className="halflight-credits__nameko">
                      {credit.nameKo}
                    </span>
                  </p>
                </div>
              ))}

              <p className="halflight-credits__end">
                THE END <span lang="ko">끝</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer className="halflight-footer">
        <p className="halflight-footer__fade halflight-mono">
          FADE OUT. <span lang="ko">페이드 아웃.</span>
        </p>
        <p className="halflight-footer__copy">
          © 2026 HALFLIGHT — music for films that were never shot.{" "}
          <span lang="ko">찍히지 않은 영화들을 위한 음악.</span>
        </p>
        <p className="halflight-footer__nav halflight-mono">
          <a className="halflight-link" href="mailto:cue@halflight.example">
            CUE@HALFLIGHT.EXAMPLE
          </a>{" "}
          <a className="halflight-link" href="#halflight-top">
            BACK TO THE TITLE CARD · <span lang="ko">처음으로</span>
          </a>
        </p>
      </footer>
    </>
  );
}
