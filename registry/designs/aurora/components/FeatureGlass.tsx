"use client";

import { useRef } from "react";
import { usePinnedScrub } from "../hooks/usePinnedScrub";

type Props = {
  reduced: boolean;
};

type Feature = {
  no: string;
  kickerEn: string;
  kickerKo: string;
  titleEn: string;
  titleKo: string;
  bodyEn: string;
  bodyKo: string;
  accent: "violet" | "fuchsia" | "cyan" | "emerald";
};

const FEATURES: Feature[] = [
  {
    no: "01",
    kickerEn: "ONE CANVAS",
    kickerKo: "하나의 캔버스",
    titleEn: "Notes, specs, and tasks share the same page.",
    titleKo: "메모와 스펙, 작업이 같은 페이지를 쓴다.",
    bodyEn:
      "Stop pasting between three tabs. Write a note, promote a line to a spec, drag a clause into a task — the document never breaks, the links never rot, and every fragment remembers where it came from.",
    bodyKo:
      "세 개의 탭을 오가며 붙여 넣지 마라. 메모를 쓰고, 한 줄을 스펙으로 올리고, 문장을 작업으로 끌어라. 문서는 끊기지 않고, 링크는 썩지 않고, 조각 하나하나가 제 자리를 기억한다.",
    accent: "violet",
  },
  {
    no: "02",
    kickerEn: "PERSISTENT CONTEXT",
    kickerKo: "지속되는 문맥",
    titleEn: "A memory that reads the whole room.",
    titleKo: "방 전체를 읽는 기억.",
    bodyEn:
      "Aurora's context watches your canvas, your decisions, and the trail of edits behind them — so when you ask 'what changed since the roadmap?', it answers with the diff, not a summary of vibes. Nothing is re-explained.",
    bodyKo:
      "오로라의 문맥은 캔버스와 결정, 그 뒤에 쌓인 편집의 자취를 지켜본다. 그래서 '로드맵 이후로 뭐가 바뀌었어?'라고 물으면 바이브가 아니라 diff로 답한다. 두 번 설명할 것이 없다.",
    accent: "cyan",
  },
  {
    no: "03",
    kickerEn: "SHIPS WITH YOU",
    kickerKo: "함께 출시되는",
    titleEn: "From a thought on Tuesday to a release on Friday.",
    titleKo: "화요일의 생각이 금요일의 릴리스로.",
    bodyEn:
      "Specs compile to changelog drafts. Tasks roll up into the release that actually shipped. The launch page you are reading was outlined, specced, and handed to engineering inside Aurora — eating our own sky.",
    bodyKo:
      "스펙은 변경 이력 초안으로 컴파일된다. 작업은 실제로 출시된 릴리스로 모인다. 지금 읽고 있는 이 런칭 페이지도 오로라 안에서 개요를 잡고, 스펙을 쓰고, 엔지니어링에 넘겼다 — 우리 하늘을 우리가 먹는다.",
    accent: "emerald",
  },
  {
    no: "04",
    kickerEn: "CALM BY DEFAULT",
    kickerKo: "기본으로 차분한",
    titleEn: "Fast where it matters, still where it doesn't.",
    titleKo: "중요한 곳에서 빠르고, 아닌 곳에서 고요한.",
    bodyEn:
      "Local-first sync, 40ms interactions, and an interface that never moves a pixel you didn't ask it to. The gradient breathes; your cursor does not chase it, and it does not chase you.",
    bodyKo:
      "로컬 우선 동기화, 40ms의 반응, 당신이 요청하지 않은 픽셀은 결코 움직이지 않는 인터페이스. 그라디언트는 숨 쉬지만, 당신의 커서가 그것을 쫓지 않고, 그것도 당신을 쫓지 않는다.",
    accent: "fuchsia",
  },
];

/**
 * Section 02 — the pinned feature stack. A tall region holds a sticky inner
 * viewport; as the visitor scrolls through it, `--aurora-pin` (0→1) drives
 * the choreography: glass cards translate, scale, and fade into the stack
 * one at a time, the active card lifts forward, and a progress bar fills.
 *
 * `position: sticky` does the pinning in CSS; this component only measures
 * scroll progress through the sticky region (see usePinnedScrub) and exposes
 * it as a custom property. The cards' transforms are piecewise functions of
 * that one variable, so they are scrubbable — scroll back up and the stack
 * disassembles in reverse. Under reduced motion the hook parks at 1 and the
 * cards lay out statically, fully readable.
 *
 * Each card also carries `data-tilt` for the pointer-parallax lean (see
 * usePointerTilt) — a different technique from the scroll scrub, layered on.
 */
export default function FeatureGlass({ reduced }: Props) {
  const pinRef = useRef<HTMLElement | null>(null);
  usePinnedScrub(pinRef, reduced);

  return (
    <section
      id="features"
      ref={pinRef}
      className="aurora-pin"
      aria-labelledby="aurora-features-title"
    >
      {/* The sticky inner stage. One viewport tall; cards stack inside it. */}
      <div className="aurora-pin__stage">
        <div className="aurora-pin__head">
          <p className="aurora-section__no" aria-hidden="true">
            02
          </p>
          <h2 className="aurora-section__title" id="aurora-features-title">
            Four things the canvas does{" "}
            <span lang="ko" className="aurora-section__ko">
              캔버스가 하는 네 가지
            </span>
          </h2>
          <p className="aurora-section__meta">
            SCROLL TO ASSEMBLE · <span lang="ko">스크롤하면 모여든다</span>
          </p>
        </div>

        <div className="aurora-pin__progress" aria-hidden="true">
          <span className="aurora-pin__progress-bar" />
        </div>

        <ol className="aurora-pin__stack">
          {FEATURES.map((f, i) => (
            <li
              key={f.no}
              className={`aurora-card aurora-card--${f.accent}`}
              data-tilt
              style={{ ["--aurora-card-i" as string]: i }}
            >
              <div className="aurora-card__sheen" aria-hidden="true" />
              <div className="aurora-card__body">
                <div className="aurora-card__head">
                  <span className="aurora-card__no" aria-hidden="true">
                    {f.no}
                  </span>
                  <span className="aurora-card__kicker">
                    {f.kickerEn} ·{" "}
                    <span lang="ko" className="aurora-card__kicker-ko">
                      {f.kickerKo}
                    </span>
                  </span>
                </div>
                <h3 className="aurora-card__title">
                  {f.titleEn}
                  <span lang="ko" className="aurora-card__title-ko">
                    {f.titleKo}
                  </span>
                </h3>
                <p className="aurora-card__text">
                  {f.bodyEn}
                  <span lang="ko" className="aurora-card__text-ko">
                    {f.bodyKo}
                  </span>
                </p>
              </div>
            </li>
          ))}
        </ol>

        <p className="aurora-pin__hint" aria-hidden="true">
          keep scrolling · <span lang="ko">계속 스크롤</span>
        </p>
      </div>
    </section>
  );
}
