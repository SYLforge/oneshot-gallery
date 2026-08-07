"use client";

import { useRef } from "react";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import { useScrollProgress } from "../hooks/useScrollProgress";

/** A still is a CSS gradient "photograph" — no image payload, ever. */
type Still = {
  /** which roll, as it would read on the strip edge */
  roll: string;
  /** the exposure number on this roll */
  frame: string;
  /** the inline style hook: a CSS custom prop selecting one of the warm
   * gradient "stocks" defined in styles.css (.reel-still--stock-A … --stock-E) */
  stock: "A" | "B" | "C" | "D" | "E" | "F";
  /** bilingual caption, like a grease-pencil note on the proof sheet */
  caption: string;
  ko: string;
};

const STILLS: Still[] = [
  {
    roll: "031",
    frame: "04",
    stock: "A",
    caption: "First look, the doorway backlight.",
    ko: "첫인사, 현관의 역광.",
  },
  {
    roll: "031",
    frame: "11",
    stock: "B",
    caption: "The dress, hung on a window latch.",
    ko: "드레스, 창문 걸쇠에 걸려.",
  },
  {
    roll: "031",
    frame: "18",
    stock: "C",
    caption: "Vows. The minister's hand is blurred.",
    ko: "서약. 주례의 손이 흔들려 번졌다.",
  },
  {
    roll: "031",
    frame: "23",
    stock: "D",
    caption: "Confetti against a low sun — the leak won.",
    ko: "낮은 해를 향한 색종이 조각 — 빛샘이 이겼다.",
  },
  {
    roll: "031",
    frame: "29",
    stock: "E",
    caption: "The first dance, under sodium street light.",
    ko: "첫 춤, 나트륨 가로등 아래.",
  },
  {
    roll: "031",
    frame: "34",
    stock: "F",
    caption: "Last frame on the roll. The bride running out.",
    ko: "롤의 마지막 프레임. 신부가 뛰쳐나간다.",
  },
];

/**
 * Frame 02 — the contact sheet (SIGNATURE). Where HALFLIGHT scrubs a single
 * procedural film *reel* on a canvas, REEL scrubs a *contact sheet*: a grid
 * of CSS-gradient "stills" that develop one column at a time as you scroll.
 * Each still reveals through a sprocket-hole clip-path inset wipe — the
 * chemistry biting into the paper from the edges inward. Scroll progress is
 * how far the tray has come up; the developing lerp trails it like photo
 * paper taking up developer.
 *
 * The rAF loop only writes a single CSS custom property (--reel-develop-p)
 * onto the pinned stage per frame — no React re-renders, no layout. Reduced
 * motion leaves every still fully developed (the no-JS / static state), and
 * the section takes normal height. A film-projector scan band drifts down
 * the stage at low opacity — the analog texture, not a CRT.
 */
export default function ContactSheet() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const reduced = usePrefersReducedMotion();

  useScrollProgress(
    sectionRef,
    (p) => {
      // lerp-smoothed "developing" progress — paper taking up the chemistry
      const el = stageRef.current;
      if (!el) return;
      const prev = Number.parseFloat(
        el.style.getPropertyValue("--reel-shown-p") || "0",
      );
      const next = prev + (p - prev) * 0.14;
      el.style.setProperty("--reel-shown-p", next.toFixed(4));
    },
    !reduced,
  );

  return (
    <section
      className="reel-sheet"
      aria-labelledby="reel-sheet-title"
      ref={sectionRef}
    >
      <div className="reel-sheet__sticky" ref={stageRef}>
        <div className="reel-sheet__scan" aria-hidden="true" />

        <header className="reel-sheet__head">
          <p className="reel-sechead__no reel-mono" aria-hidden="true">
            FRAME 02
          </p>
          <h2 className="reel-sechead" id="reel-sheet-title">
            The contact sheet{" "}
            <span lang="ko" className="reel-sechead__ko">
              밀착 인화지
            </span>
          </h2>
          <p className="reel-sheet__slug reel-mono">
            ROLL 031 · 36 EXP · DEVELOPED 2026-07-19{" "}
            <span lang="ko">2026-07-19 현상</span>
          </p>
        </header>

        <div
          className="reel-sheet__grid"
          role="img"
          aria-label="A contact sheet of six warm-toned film stills — a backlit doorway, a dress on a latch, blurred vows, confetti in low sun, a first dance under sodium light, and a bride running out — developing under scroll one column at a time. 스크롤에 따라 한 단씩 현상되는, 따뜻한 톤의 필름 스틸 여섯 장이 깔린 밀착 인화지 — 역광 현관, 걸쇠에 걸린 드레스, 흐려진 서약, 낮은 해를 향한 색종이 조각, 나트륨등 아래 첫 춤, 뛰쳐나가는 신부."
        >
          {STILLS.map((still, i) => (
            <figure
              key={`${still.roll}-${still.frame}`}
              className={`reel-still reel-still--stock-${still.stock}`}
              style={{ "--reel-still-i": i } as React.CSSProperties}
            >
              <div className="reel-still__frame" aria-hidden="true">
                <span className="reel-still__sprocket reel-still__sprocket--top" />
                <span className="reel-still__sprocket reel-still__sprocket--bottom" />
                <span className="reel-still__halation" />
                <span className="reel-still__leak" />
              </div>
              <figcaption className="reel-still__meta reel-mono">
                <span className="reel-still__id">
                  {still.roll}-{still.frame}
                </span>
                <span className="reel-still__caption">
                  {still.caption}{" "}
                  <span lang="ko">{still.ko}</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>

        <p className="reel-sheet__note">
          Scroll is the developer. Hold anywhere; the stills hold where you
          stop. <span lang="ko">스크롤이 곧 현상액이다. 멈추면, 그 지점에서 프레임도 멈춘다.</span>
        </p>
      </div>
    </section>
  );
}
