"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import { POEMS, FILTERS, LABELS, type Category, type Poem } from "./poems";
import { Motif } from "./Motifs";

type Filter = Category | "all";

/**
 * 섹션 02 (서명) — 시 그리드가 필터에서 FLIP 재배열된다. 카테고리를
 * 고르면 보이는 카드의 순서가 바뀐다; DOM 이 바뀌기 전에 각 카드의
 * bounding rect 를 찍고(First), 바뀐 뒤 새 rect 를 재고(Last), 역델타를
 * transform 으로 붙인 뒤(Invert) 0 으로 애니메이션한다(Play) — 그래서
 * 카드가 새 자리로 미끄러진다. 나가는 카드는 먼저 fade out, 들어오는
 * 카드는 같은 창에서 fade in.
 *
 * 그리드는 언제나 진짜 리스트(<ul>/<li>); 필터는 어떤 시가 렌더되는가만
 * 바꾼다 — 의미는 살아있다. 각 카드는 focusable. 동작 감소: FLIP 애니메이션
 * 없음 — 그리드가 즉시 바뀐다 (play 단계 생략, 카드가 제자리에 나타남).
 *
 * 카드는 neo-brutalist hard offset shadow(6px 6px 0) 를 단다. hover 시
 * translate(-3px,-3px) + shadow 확대(9px 9px 0, green). 누르면 spring
 * overshoot — transform 이 ease-back(0.34,1.56,0.64,1) 로 튀어오른다.
 */
export default function PoemFlipGrid() {
  const reduced = usePrefersReducedMotion();
  const [filter, setFilter] = useState<Filter>("all");
  const gridRef = useRef<HTMLUListElement | null>(null);
  /** 마지막 렌더 시작 시점의 활성 필터 — FLIP 을 구동한다. */
  const prevFilter = useRef<Filter>(filter);

  const visible: Poem[] = POEMS.filter(
    (p) => filter === "all" || p.category === filter,
  );

  // useLayoutEffect 로 First/Last 를 DOM 업데이트가 페인트되는 같은
  // 프레임에 재측정 — unmoved 카드의 깜빡임 없음.
  useLayoutEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    if (prevFilter.current === filter) {
      prevFilter.current = filter;
      return;
    }
    prevFilter.current = filter;

    // 동작 감소: 남은 FLIP transform 만 지우고 끝.
    if (reduced) {
      for (const li of Array.from(
        grid.querySelectorAll<HTMLElement>(".bk-tile"),
      )) {
        li.style.transform = "";
        li.style.transition = "";
      }
      return;
    }

    // --- FLIP ---
    // First: 현재 rect 를 찍는다 (OLD 위치 — React 의 swap 이 페인트되기
    // 전에, layout effect 에서 돌기 때문).
    const tiles = Array.from(grid.querySelectorAll<HTMLElement>(".bk-tile"));
    const first = new Map<string, DOMRect>();
    for (const li of tiles) {
      const key = li.dataset.flipKey;
      if (key) first.set(key, li.getBoundingClientRect());
    }

    // DOM 은 이미 React 가 업데이트했다 (Last = 현재 layout).
    // OLD 위치를 아는 모든 카드에 Invert + Play.
    const PLAY_MS = 480;
    const movers: Array<{ el: HTMLElement; dx: number; dy: number }> = [];
    for (const li of Array.from(
      grid.querySelectorAll<HTMLElement>(".bk-tile"),
    )) {
      const key = li.dataset.flipKey;
      if (!key) continue;
      const old = first.get(key);
      if (!old) continue; // 새 카드 → CSS 로 fade in, FLIP 없음
      const now = li.getBoundingClientRect();
      const dx = old.left - now.left;
      const dy = old.top - now.top;
      if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5) continue;
      movers.push({ el: li, dx, dy });
    }

    if (movers.length === 0) return;

    // Invert: 각 mover 를 OLD 위치에 transition 없이 놓는다.
    for (const { el, dx, dy } of movers) {
      el.style.transition = "none";
      el.style.transform = `translate3d(${dx}px, ${dy}px, 0)`;
    }
    // 강제 reflow — play transition 이 붙기 전에 inverted transform 이
    // 확정되도록.
    void grid.getBoundingClientRect();

    // Play: identity 로 transition.
    for (const { el } of movers) {
      el.style.transition = `transform ${PLAY_MS}ms cubic-bezier(0.22,1,0.36,1)`;
      el.style.transform = "";
    }
    // inline transition 이 settle 되면 지운다 — hover/tap 과 다음 FLIP 이
    // stale rule 과 싸우지 않도록.
    const cleanup = () => {
      for (const { el } of movers) {
        el.style.transition = "";
        el.style.transform = "";
      }
      grid.removeEventListener("transitionend", cleanup);
    };
    window.setTimeout(cleanup, PLAY_MS + 40);
  }, [filter, reduced]);

  // 동작 감소 설정이 런타임에 바뀌면 inline FLIP style 을 지운다.
  useEffect(() => {
    if (!reduced) return;
    const grid = gridRef.current;
    if (!grid) return;
    for (const li of Array.from(grid.querySelectorAll<HTMLElement>(".bk-tile"))) {
      li.style.transform = "";
      li.style.transition = "";
    }
  }, [reduced]);

  const count = visible.length;

  return (
    <section
      id="bk-works"
      className="bk-section bk-works"
      aria-labelledby="bk-works-title"
    >
      <div className="bk-sec">
        <span className="bk-sec__no" aria-hidden="true">
          02
        </span>
        <h2 className="bk-sec__title" id="bk-works-title">
          <span lang="ko">시</span>
          <span className="bk-sec__title-en">the poems</span>
        </h2>
      </div>

      <p className="bk-works__lede">
        <span lang="ko">
          필터를 고르면 그리드가 FLIP 으로 미끄러져 자리를 바꿉니다 — 여덟
          편의 시가 한 권의 콘크리트.
        </span>
      </p>

      <div
        className="bk-filters"
        role="group"
        aria-label={LABELS.filterLabel}
      >
        {FILTERS.map((f) => {
          const active = filter === f.id;
          return (
            <button
              key={f.id}
              type="button"
              className={`bk-filter bk-btn--press${active ? " is-active" : ""}`}
              aria-pressed={active}
              onClick={() => setFilter(f.id)}
            >
              <span lang="ko">{f.ko}</span>
              <span className="bk-filter__en">{f.en}</span>
            </button>
          );
        })}
      </div>

      <ul className="bk-grid" ref={gridRef}>
        {visible.map((p, i) => (
          <li
            key={p.id}
            data-flip-key={p.id}
            className={`bk-tile bk-tile--${p.category}`}
            tabIndex={0}
            aria-label={`${p.no}. ${p.titleKo} — ${p.tagKo}. ${p.titleEn}.`}
            style={{ ["--bk-tile-i" as string]: i }}
          >
            <div className="bk-tile__motif" aria-hidden="true">
              <Motif motif={p.motif} className="bk-tile__motif-svg" />
            </div>
            <div className="bk-tile__top">
              <span className="bk-tile__no">{p.no}</span>
              <span className="bk-tile__tag" lang="ko">
                {p.tagKo}
              </span>
            </div>
            <h3 className="bk-tile__title">
              <span lang="ko" className="bk-tile__ko">
                {p.titleKo}
              </span>
              <span className="bk-tile__en">{p.titleEn}</span>
            </h3>
            <div className="bk-tile__body">
              <p className="bk-tile__ko-body" lang="ko">
                {p.ko.map((line, j) => (
                  <span key={j} className="bk-tile__line">
                    {line}
                  </span>
                ))}
              </p>
              <p className="bk-tile__en-body">
                {p.en.map((line, j) => (
                  <span key={j} className="bk-tile__line">
                    {line}
                  </span>
                ))}
              </p>
            </div>
            <div className="bk-tile__foot">
              <span className="bk-tile__year">{p.year}</span>
              <span className="bk-tile__cat" aria-hidden="true">
                {p.motif}
              </span>
            </div>
          </li>
        ))}
      </ul>

      <p className="bk-works__caption">
        <span lang="ko">{LABELS.caption}</span>{" "}
        {LABELS.captionEn}
        <span className="bk-works__count">
          {" "}
          — <span lang="ko">보이는 시</span> {count}/08
        </span>
      </p>
    </section>
  );
}
