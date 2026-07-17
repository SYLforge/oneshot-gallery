"use client";

import { SEASONS, type useSeason } from "../hooks/useSeason";

type SeasonApi = ReturnType<typeof useSeason>;

/**
 * Section 04 — the seasonal-light control.
 *
 * The courtyard (madang) is open to the sky, so it changes with the season.
 * This toggle lets the visitor choose spring / summer / autumn / winter,
 * or leave the page to auto-cycle (one season per ~5.2s). Picking a season
 * stops the cycle; the AUTO button resumes it (unless reduced motion, in
 * which case the cycle is already frozen and AUTO is inert).
 *
 * The actual recolor happens in CSS via `data-season` on the root (set in
 * useSeason/page.tsx) — only the madang sky ground and the eave-shadow
 * angle change; wood grain, earth wall, and all text hold still, because
 * wood and earth don't change with the season, only the light does.
 *
 * Accessibility: a real segmented control. Each option is a <button> with
 * aria-pressed; the AUTO toggle is its own button. All keyboard-reachable,
 * with the eave-red focus ring. No hover-only behavior — auto-cycle keeps
 * the page alive on touch devices with no pointer at all.
 */
export default function SeasonalLight({ season }: { season: SeasonApi }) {
  return (
    <section className="hanok-season" aria-labelledby="hanok-season-title">
      <div className="hanok-sechead">
        <span className="hanok-sechead__no" aria-hidden="true">
          04
        </span>
        <h2 className="hanok-sechead__title" id="hanok-season-title">
          Four lights on one courtyard{" "}
          <span lang="ko">한 마당에 네 빛</span>
        </h2>
        <p className="hanok-sechead__note">
          Wood holds still; only the light moves.{" "}
          <span lang="ko">나무는 그대로, 빛만 움직인다.</span>
        </p>
      </div>

      <div className="hanok-season__bar" role="group" aria-label="Season · 계절">
        {SEASONS.map((s) => {
          const active = season.season === s.id && !season.auto;
          return (
            <button
              key={s.id}
              type="button"
              className="hanok-season__opt"
              aria-pressed={active}
              onClick={() => season.pick(s.id)}
            >
              {s.en}
              <span lang="ko">{s.ko}</span>
            </button>
          );
        })}

        <button
          type="button"
          className="hanok-season__auto"
          aria-pressed={season.auto}
          aria-label="Auto-cycle seasons · 계절 자동 순환"
          onClick={season.resume}
          disabled={season.reduced}
        >
          AUTO
        </button>
      </div>

      <p className="hanok-season__note">
        {season.reduced
          ? "Reduced motion: season held still. "
          : season.auto
            ? "The courtyard cycles on its own — pick one to hold it. "
            : "Held. Press AUTO to let it cycle again. "}
        <span lang="ko">
          {season.reduced
            ? "모션 감소: 계절은 멈춰 있다."
            : season.auto
              ? "마당이 저절로 돈다 — 하나를 고르면 멈춘다."
              : "고정됨. AUTO를 누르면 다시 돈다."}
        </span>
      </p>
    </section>
  );
}
