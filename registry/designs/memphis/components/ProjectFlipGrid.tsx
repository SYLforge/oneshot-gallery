"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import { Squiggle, Blob, Zigzag, Confetti, Arch } from "./Shapes";

type Category = "all" | "brand" | "print" | "space";

type Project = {
  id: string;
  titleKo: string;
  titleEn: string;
  year: string;
  category: Exclude<Category, "all">;
  tone: "teal" | "coral" | "marigold" | "cobalt" | "plum";
  tagKo: string;
  tagEn: string;
  blurbKo: string;
  blurbEn: string;
  /** which decorative shape sits on the tile */
  motif: "squiggle" | "blob" | "zigzag" | "arch" | "dot";
};

const PROJECTS: Project[] = [
  {
    id: "p1",
    titleKo: "파도 표지",
    titleEn: "Wave Covers",
    year: "2026",
    category: "print",
    tone: "teal",
    tagKo: "잡지 디자인",
    tagEn: "Editorial",
    blurbKo: "계절마다 바뀌는 물결 표지 — 한 권에 곡선 하나.",
    blurbEn: "A squiggle per issue, a season per cover.",
    motif: "squiggle",
  },
  {
    id: "p2",
    titleKo: "코랄 아이덴티티",
    titleEn: "Coral Identity",
    year: "2025",
    category: "brand",
    tone: "coral",
    tagKo: "브랜드 시스템",
    tagEn: "Brand system",
    blurbKo: "카페 한 곳의 색, 도형, 목소리를 통째로 지었다.",
    blurbEn: "We drew a café's color, shape, and voice from scratch.",
    motif: "blob",
  },
  {
    id: "p3",
    titleKo: "지그재그 전시",
    titleEn: "Zigzag Exhibit",
    year: "2025",
    category: "space",
    tone: "cobalt",
    tagKo: "전시 연출",
    tagEn: "Exhibition",
    blurbKo: "벽이 되는 지그재그, 걸을수록 꺾이는 동선.",
    blurbEn: "Walls as zigzags — the path bends as you walk.",
    motif: "zigzag",
  },
  {
    id: "p4",
    titleKo: "마리골드 패키지",
    titleEn: "Marigold Pack",
    year: "2024",
    category: "brand",
    tone: "marigold",
    tagKo: "패키지 디자인",
    tagEn: "Packaging",
    blurbKo: "반원 아치가 상자를 여는 제스처가 된다.",
    blurbEn: "A half-arch becomes the gesture of opening the box.",
    motif: "arch",
  },
  {
    id: "p5",
    titleKo: "꽃가루 포스터",
    titleEn: "Confetti Posters",
    year: "2024",
    category: "print",
    tone: "plum",
    tagKo: "포스터 시리즈",
    tagEn: "Poster series",
    blurbKo: "흩뿌린 점들이 한 장의 축제가 되는 시리즈.",
    blurbEn: "Scattered dots become a one-poster festival.",
    motif: "dot",
  },
  {
    id: "p6",
    titleKo: "틸 룸",
    titleEn: "Teal Room",
    year: "2023",
    category: "space",
    tone: "teal",
    tagKo: "공간 디자인",
    tagEn: "Spatial",
    blurbKo: "한 면을 통째로 물들인 청록 — 방이 곧 색.",
    blurbEn: "One teal wall, and the room becomes the color.",
    motif: "blob",
  },
];

const FILTERS: { id: Category; ko: string; en: string }[] = [
  { id: "all", ko: "전체", en: "All" },
  { id: "brand", ko: "브랜드", en: "Brand" },
  { id: "print", ko: "인쇄", en: "Print" },
  { id: "space", ko: "공간", en: "Space" },
];

function Motif({ motif, tone }: { motif: Project["motif"]; tone: Project["tone"] }) {
  if (motif === "squiggle") return <Squiggle tone={tone} width={84} />;
  if (motif === "blob") return <Blob tone={tone} size={64} outline={false} />;
  if (motif === "zigzag") return <Zigzag tone={tone} width={70} />;
  if (motif === "arch") return <Arch tone={tone} width={70} />;
  return <Confetti tone={tone} size={34} />;
}

/**
 * Section 02 (the signature) — a project grid that FLIP-rearranges on
 * filter. Selecting a category reorders the visible tiles; before the DOM
 * mutates we snapshot each tile's bounding rect (First), after mutation we
 * measure the new rect (Last), apply the inverse delta as a transform
 * (Invert), then animate it to zero (Play) — so the tiles glide to their
 * new positions with no layout jump. Outgoing tiles fade out first,
 * incoming tiles fade in over the same window.
 *
 * The grid is always a real list (`<ul>`/`<li>`); filter just changes which
 * projects render and in what order, so semantics survive. Each tile is
 * focusable. Reduced motion: no FLIP animation — the grid swaps instantly
 * (the play step is skipped, tiles just appear in place).
 */
export default function ProjectFlipGrid() {
  const reduced = usePrefersReducedMotion();
  const [filter, setFilter] = useState<Category>("all");
  const gridRef = useRef<HTMLUListElement | null>(null);
  /** The filter active at the start of the last render — drives the FLIP. */
  const prevFilter = useRef<Category>(filter);

  const visible = PROJECTS.filter(
    (p) => filter === "all" || p.category === filter,
  );

  // useLayoutEffect so First/Last are measured around the same paint the
  // DOM updates in — no flash of the unmoved tiles.
  useLayoutEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    if (prevFilter.current === filter) {
      prevFilter.current = filter;
      return;
    }
    prevFilter.current = filter;

    // In reduced motion, just clear any leftover FLIP transforms and bail.
    if (reduced) {
      for (const li of Array.from(grid.querySelectorAll<HTMLElement>(".mp-tile"))) {
        li.style.transform = "";
        li.style.transition = "";
      }
      return;
    }

    // --- FLIP ---
    // First: snapshot current rects (these are the OLD positions, captured
    // BEFORE React's swap is painted because this runs in layout effect).
    const tiles = Array.from(grid.querySelectorAll<HTMLElement>(".mp-tile"));
    const first = new Map<string, DOMRect>();
    for (const li of tiles) {
      const key = li.dataset.flipKey;
      if (key) first.set(key, li.getBoundingClientRect());
    }

    // The DOM has already been updated by React (Last = current layout).
    // Invert + Play for every tile whose OLD position we know.
    const PLAY_MS = 480;
    const movers: Array<{ el: HTMLElement; dx: number; dy: number }> = [];
    for (const li of Array.from(grid.querySelectorAll<HTMLElement>(".mp-tile"))) {
      const key = li.dataset.flipKey;
      if (!key) continue;
      const old = first.get(key);
      if (!old) continue; // a brand-new tile → it fades in via CSS, no FLIP
      const now = li.getBoundingClientRect();
      const dx = old.left - now.left;
      const dy = old.top - now.top;
      if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5) continue;
      movers.push({ el: li, dx, dy });
    }

    if (movers.length === 0) return;

    // Invert: place each mover at its old position with no transition.
    for (const { el, dx, dy } of movers) {
      el.style.transition = "none";
      el.style.transform = `translate3d(${dx}px, ${dy}px, 0)`;
    }
    // Force a reflow so the inverted transforms are committed before the
    // play transition is added.
    void grid.getBoundingClientRect();

    // Play: transition to identity.
    for (const { el } of movers) {
      el.style.transition = `transform ${PLAY_MS}ms cubic-bezier(0.22,1,0.36,1)`;
      el.style.transform = "";
    }
    // Clean up inline transition once the move settles so hover/tap and
    // future FLIPs aren't fighting a stale rule.
    const cleanup = () => {
      for (const { el } of movers) {
        el.style.transition = "";
        el.style.transform = "";
      }
      grid.removeEventListener("transitionend", cleanup);
    };
    window.setTimeout(cleanup, PLAY_MS + 40);
  }, [filter, reduced]);

  // Strip any inline FLIP styles if the reduced-motion pref flips at runtime.
  useEffect(() => {
    if (!reduced) return;
    const grid = gridRef.current;
    if (!grid) return;
    for (const li of Array.from(grid.querySelectorAll<HTMLElement>(".mp-tile"))) {
      li.style.transform = "";
      li.style.transition = "";
    }
  }, [reduced]);

  return (
    <section
      id="mp-work"
      className="mp-section mp-work"
      aria-labelledby="mp-work-title"
    >
      <div className="mp-sec">
        <span className="mp-sec__no" aria-hidden="true">
          01
        </span>
        <h2 className="mp-sec__title" id="mp-work-title">
          <span lang="ko">선택하면 재정렬되는 작업</span>
          <span className="mp-sec__title-en">the work, re-sorted</span>
        </h2>
      </div>

      <p className="mp-work__lede">
        <span lang="ko">
          필터를 고르면 그리드가 FLIP으로 미끄러져 자리를 바꿉니다 — 난잡해
          보여도, 각 도형엔 자리가 있습니다.
        </span>
      </p>

      <div
        className="mp-filters"
        role="group"
        aria-label="Filter projects by category. 카테고리로 작업 거르기."
      >
        {FILTERS.map((f) => {
          const active = filter === f.id;
          return (
            <button
              key={f.id}
              type="button"
              className={`mp-filter mp-btn--press${active ? " is-active" : ""}`}
              aria-pressed={active}
              onClick={() => setFilter(f.id)}
            >
              <span lang="ko">{f.ko}</span>
              <span className="mp-filter__en">{f.en}</span>
            </button>
          );
        })}
      </div>

      <ul className="mp-grid" ref={gridRef}>
        {visible.map((p, i) => (
          <li
            key={p.id}
            data-flip-key={p.id}
            className={`mp-tile mp-tile--${p.tone}`}
            tabIndex={0}
            aria-label={`${p.titleKo} — ${p.tagKo}. ${p.titleEn}, ${p.year}.`}
            style={{ ["--mp-tile-i" as string]: i }}
          >
            <div className="mp-tile__motif" aria-hidden="true">
              <Motif motif={p.motif} tone={p.tone} />
            </div>
            <div className="mp-tile__top">
              <span className="mp-tile__year">{p.year}</span>
              <span className="mp-tile__tag" lang="ko">
                {p.tagKo}
              </span>
            </div>
            <h3 className="mp-tile__title">
              <span lang="ko" className="mp-tile__ko">
                {p.titleKo}
              </span>
              <span className="mp-tile__en">{p.titleEn}</span>
            </h3>
            <p className="mp-tile__blurb">
              <span lang="ko">{p.blurbKo}</span>
              <span className="mp-tile__blurb-en">{p.blurbEn}</span>
            </p>
          </li>
        ))}
      </ul>

      <p className="mp-work__caption">
        <span lang="ko">모든 도형은 SVG, 이미지는 한 장도 없습니다.</span>{" "}
        Every shape is inline SVG — zero image payload.
      </p>
    </section>
  );
}
