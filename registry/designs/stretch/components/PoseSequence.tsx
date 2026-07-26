"use client";

import type { CSSProperties, ReactNode } from "react";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import { useStretchScroll } from "../hooks/useStretchScroll";

/**
 * 늘어나는 자리 — the kinetic-typography signature.
 *
 * A tall spacer pins a scene for the length of the sequence; as the reader
 * scrolls, each pose's name writes itself and its headline glyphs
 * elongate vertically (scaleY grows with scrub) — the type reaching the
 * way a body reaches in a held pose. Four poses, each a full reach:
 *   산(山)  · Earth   — feet down, spine up
 *   하늘(하늘) · Sky   — arms long, eyes soft
 *   나무(나무) · Tree  — root and reach at once
 *   숨(숨)  · Breath  — the closing, everything lengthening into one exhale
 *
 * The pinned scene stacks all four poses; only the one whose 0.25-wide
 * scrub band is active is shown, via opacity tied to --st-scrub. The
 * active pose's own sub-scrub (a 0→1 remapped from its band) drives the
 * scaleY stretch and the name's per-glyph write.
 *
 * Geometry is set per-pose through CSS custom properties so the logic is
 * in the stylesheet (readable, scrubbable), not in JS layout:
 *   --st-p0..3: the 0.25-wide band each pose occupies in [0,1]
 *   --st-scrub: the overall sequence scrub (0→1) from useStretchScroll
 * Everything is transform/opacity only. The pin is position: sticky.
 * With reduced motion or no JS, --st-scrub defaults to 1 → every pose is
 * at full reach, fully written; the sequence reads as a finished poster.
 */

type Pose = {
  /** local id, used as a React key and for aria wiring */
  id: string;
  /** the 0.25-wide band this pose owns in the overall scrub */
  start: number;
  /** korean wordmark — the head of the pose */
  koName: string;
  /** latin wordmark — the second voice */
  latin: string;
  /** ordinal label, bilingual */
  ordinal: { ko: string; en: string };
  /** the en one-line gloss */
  gloss: string;
  /** long ko instruction, the body of the pose */
  bodyKo: string;
  /** long en instruction, the body of the pose */
  bodyEn: string;
  /** the breath cue for this pose */
  breath: { ko: string; en: string };
};

const POSES: Pose[] = [
  {
    id: "earth",
    start: 0,
    koName: "산",
    latin: "EARTH",
    ordinal: { ko: "첫 자세", en: "Pose I" },
    gloss: "feet down, spine up",
    bodyKo:
      "발끝으로 땅을 누르고, 정수리로 하늘을 민다. 사이에 낀 온몸이 제 할 일을 찾을 때까지, 우리는 아무것도 더하지 않는다.",
    bodyEn:
      "Press the ground down with the soles; push the sky up with the crown. Until the body caught between them finds its own work, we add nothing.",
    breath: { ko: "네 박자로 들이쉬고, 여섯 박자로 내쉰다.", en: "Inhale four, exhale six." },
  },
  {
    id: "sky",
    start: 0.25,
    koName: "하늘",
    latin: "SKY",
    ordinal: { ko: "둘째 자세", en: "Pose II" },
    gloss: "arms long, eyes soft",
    bodyKo:
      "팔을 길게 뻗되 힘을 주지 않는다. 눈은 가는 곳을 보되, 잡으려 하지 않는다. 뻗는 일과 놓는 일이 한 자세 안에서 만난다.",
    bodyEn:
      "Reach the arms long without forcing them. Let the eyes follow where they go without trying to hold it. The reaching and the releasing meet inside one pose.",
    breath: { ko: "들이쉬며 길어지고, 내쉬며 더 길어진다.", en: "Lengthen on the inhale, lengthen further on the exhale." },
  },
  {
    id: "tree",
    start: 0.5,
    koName: "나무",
    latin: "TREE",
    ordinal: { ko: "셋째 자세", en: "Pose III" },
    gloss: "root and reach at once",
    bodyKo:
      "한 발은 뿌리가 되고, 다른 발은 가지가 된다. 가만히 서 있으면서도 자라는 일을 배우는 자세. 흔들림은 흔들리지 않음이 아니다.",
    bodyEn:
      "One foot becomes a root; the other becomes a branch. The pose where you stand still and learn to grow at once. Sway is not the opposite of steadiness.",
    breath: { ko: "흔들릴 때 숨이 버틴다.", en: "When you sway, the breath holds." },
  },
  {
    id: "breath",
    start: 0.75,
    koName: "숨",
    latin: "BREATH",
    ordinal: { ko: "마지막 자세", en: "Pose IV" },
    gloss: "everything lengthens into one exhale",
    bodyKo:
      "눕지 않고 눕는 자세. 등이 바닥을 알아가는 동안, 온몸이 천천히 풀려 가장 긴 버전의 내가 된다. 끝맺음이 아니라, 다 잘 때까지.",
    bodyEn:
      "The pose of lying down without lying down. While the back learns the floor, the whole body slowly gives way until it is the longest version of you. Not an ending — until everything has let go.",
    breath: { ko: "아무것도 하지 말고, 숨만 길게.", en: "Do nothing. Only let the breath run long." },
  },
];

/** Split a string into per-glyph aria-hidden spans; the visible label
 * lives on the container so assistive tech reads one word, never the
 * staggered spans. */
function Glyphs({
  text,
  base,
}: {
  text: string;
  base: string;
}): ReactNode {
  return (
    <>
      {Array.from(text).map((ch, i) => (
        <span
          key={`${base}-${ch}-${i}`}
          aria-hidden="true"
          className="stretch-glyph"
          style={{ "--st-gi": i } as CSSProperties}
        >
          {ch}
        </span>
      ))}
    </>
  );
}

/** One pose card, absolutely stacked in the pinned scene; its visibility
 *  and stretch are driven by its band of the overall scrub. */
function PoseCard({ pose, index }: { pose: Pose; index: number }) {
  const bandStart = pose.start;
  // Each pose owns a 0.25-wide band of [0,1]; --st-p0..3 declares them so
  // the stylesheet can map the global scrub onto a per-pose sub-scrub.
  return (
    <article
      className="stretch-pose"
      aria-label={`${pose.ordinal.ko} — ${pose.koName} · ${pose.latin}`}
      style={
        {
          "--st-pi": index,
          "--st-p0": bandStart,
          "--st-p1": bandStart + 0.25,
        } as CSSProperties
      }
    >
      <p className="stretch-pose__ordinal" aria-hidden="true">
        <span lang="ko">{pose.ordinal.ko}</span> · {pose.ordinal.en}
      </p>

      <h3
        className="stretch-pose__name"
        lang="ko"
        aria-label={`${pose.koName} · ${pose.latin}`}
      >
        <span className="stretch-pose__name-ko" aria-hidden="true">
          <Glyphs text={pose.koName} base={pose.id} />
        </span>
        <span className="stretch-pose__name-latin" aria-hidden="true">
          <Glyphs text={pose.latin} base={`${pose.id}-l`} />
        </span>
      </h3>

      <div className="stretch-pose__body" data-reveal>
        <p className="stretch-pose__gloss">
          <em>{pose.gloss}</em>
        </p>
        <p className="stretch-pose__p stretch-pose__p--ko" lang="ko">
          {pose.bodyKo}
        </p>
        <p className="stretch-pose__p stretch-pose__p--en">
          {pose.bodyEn}
        </p>
        <p className="stretch-pose__breath">
          <span className="stretch-pose__breath-cue" lang="ko">숨</span>{" "}
          <span lang="ko">{pose.breath.ko}</span>{" "}
          <em>— {pose.breath.en}</em>
        </p>
      </div>
    </article>
  );
}

export default function PoseSequence() {
  const reduced = usePrefersReducedMotion();
  const spacerRef = useStretchScroll<HTMLDivElement>(reduced);

  return (
    <section
      id="st-sequence"
      className="stretch-sequence"
      aria-labelledby="st-sequence-title"
    >
      <header className="stretch-sequence__head" data-reveal>
        <p className="stretch-kicker">
          <span lang="ko">네 개의 자세</span> · Four Poses, Held
        </p>
        <h2 id="st-sequence-title" className="stretch-sequence__title" lang="ko">
          늘어나는 자리
        </h2>
        <p className="stretch-sequence__sub">
          The Place of Lengthening — scroll slowly; the names write themselves as you hold
        </p>
      </header>

      {/* The tall spacer is the scrub target; the pinned scene lives inside. */}
      <div ref={spacerRef} className="stretch-sequence__spacer">
        <div className="stretch-sequence__pin">
          {/* the long clay line that grows across the whole sequence */}
          <div className="stretch-sequence__rail" aria-hidden="true">
            <span className="stretch-sequence__rail-fill" />
            <span className="stretch-sequence__rail-ticks">
              {POSES.map((p) => (
                <span key={`tick-${p.id}`} className="stretch-sequence__tick">
                  <span className="stretch-sequence__tick-label">
                    {p.latin}
                  </span>
                </span>
              ))}
            </span>
          </div>

          <div className="stretch-sequence__scene">
            {POSES.map((pose, i) => (
              <PoseCard key={pose.id} pose={pose} index={i} />
            ))}
          </div>

          {/* a fixed breath counter at the corner of the pinned scene */}
          <p className="stretch-sequence__count" aria-hidden="true">
            <span className="stretch-sequence__count-n">01</span>
            <span className="stretch-sequence__count-of"> / 04</span>
          </p>
        </div>
      </div>

      <p className="stretch-sequence__after" data-reveal lang="ko">
        네 자세를 지나면, 몸은 페이지보다 길다.
      </p>
    </section>
  );
}
