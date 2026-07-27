"use client";

import type { Colorway } from "./sneaker";

type Props = {
  colorway: Colorway["id"];
  onPick: (id: Colorway["id"]) => void;
};

const SWATCHES: {
  id: Colorway["id"];
  en: string;
  ko: string;
  hex: string;
  blurbEn: string;
  blurbKo: string;
}[] = [
  {
    id: "ember",
    en: "Ember",
    ko: "엠버",
    hex: "#ff5722",
    blurbEn: "Heat-treated suede and a molten accent. The studio's default.",
    blurbKo: "열처리 스웨이드와 녹아내린 액센트. 스튜디오의 기본값.",
  },
  {
    id: "ocean",
    en: "Ocean",
    ko: "오션",
    hex: "#0066ff",
    blurbEn: "Deep navy knit, electric trim. Reads cool under the rim light.",
    blurbKo: "짙은 네이비 니트, 전기빛 띠. 림 라이트 아래서 차갑게 읽힌다.",
  },
  {
    id: "frost",
    en: "Frost",
    ko: "프로스트",
    hex: "#e8eef5",
    blurbEn: "Bone-white upper on a clean sole. The lightest object in the room.",
    blurbKo: "뼈빛 어퍼에 맑은 솔. 방 안에서 가장 가벼운 물건.",
  },
];

/**
 * Section 03 — the colorway. Three panels wipe in with direction-aware
 * clip-path insets (clip-path-reveal), 640ms ease-out-settle, 90ms stagger.
 * The selected swatch is a real radio-style control group (keyboard
 * reachable, focus-visible art-directed); picking one updates the turntable
 * above via the parent's state.
 *
 * Each panel's wipe direction rotates (right, up, left) so the grid doesn't
 * read as a synchronized slab. The pre-wipe state is gated behind
 * `.orbit-js` (added on mount) so without JavaScript every panel is simply
 * visible.
 */
export default function ColorwayPicker({ colorway, onPick }: Props) {
  return (
    <section className="orbit-colorway" aria-labelledby="orbit-colorway-title">
      <div className="orbit-section__head" data-reveal>
        <p className="orbit-section__no" aria-hidden="true">
          03 · COLORWAY
        </p>
        <h2 className="orbit-section__title" id="orbit-colorway-title">
          Pick a finish{" "}
          <span lang="ko" className="orbit-section__ko">
            컬러웨이
          </span>
        </h2>
        <p className="orbit-section__meta">
          THREE DROPS · <span lang="ko">세 가지 마감</span>
        </p>
      </div>

      <div className="orbit-colorway__grid" role="radiogroup" aria-label="Colorway · 컬러웨이">
        {SWATCHES.map((s, i) => {
          const selected = s.id === colorway;
          const dir = i % 3; // 0=from-right, 1=from-bottom, 2=from-left
          return (
            <button
              type="button"
              key={s.id}
              role="radio"
              aria-checked={selected}
              data-reveal-wipe={dir}
              className={`orbit-colorway__panel${
                selected ? " is-selected" : ""
              }`}
              onClick={() => onPick(s.id)}
              style={{ "--orbit-wipe-delay": `${i * 90}ms` } as React.CSSProperties}
            >
              <span className="orbit-colorway__swatch" aria-hidden="true">
                <span
                  className="orbit-colorway__swatch-dot"
                  style={{ background: s.hex }}
                />
                <span className="orbit-colorway__swatch-ring" />
              </span>
              <span className="orbit-colorway__name">
                <span className="orbit-colorway__name-en">{s.en}</span>
                <span className="orbit-colorway__name-ko" lang="ko">
                  {s.ko}
                </span>
              </span>
              <span className="orbit-colorway__blurb">{s.blurbEn}</span>
              <span className="orbit-colorway__blurb orbit-colorway__blurb--ko" lang="ko">
                {s.blurbKo}
              </span>
              <span className="orbit-colorway__hex" aria-hidden="true">
                {s.hex.toUpperCase()}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
