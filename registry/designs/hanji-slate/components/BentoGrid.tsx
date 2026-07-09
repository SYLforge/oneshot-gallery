"use client";

import {
  useLayoutEffect,
  useState,
  type MouseEvent as ReactMouseEvent,
} from "react";
import { useFlip } from "../hooks/useFlip";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

type Tile = {
  id: string;
  /** grid footprint modifier — see styles.css .slate-tile--* */
  size: "hero" | "wide" | "box";
  figure: string;
  unit: string;
  title: string;
  titleKo: string;
  line: string;
  lineKo: string;
  detail: string;
  detailKo: string;
};

const TILES: Tile[] = [
  {
    id: "battery",
    size: "hero",
    figure: "6",
    unit: "weeks",
    title: "Battery",
    titleKo: "배터리",
    line: "Six weeks of mornings on one charge.",
    lineKo: "한 번의 충전으로 여섯 주의 아침.",
    detail:
      "E-ink spends power only when the page changes. Between pages — between thoughts — the slate is as off as a printed book. Charge it in June; notice the cable again in August.",
    detailKo:
      "전자잉크는 페이지가 바뀔 때만 전기를 씁니다. 페이지와 페이지 사이, 생각과 생각 사이에는 인쇄된 책만큼 꺼져 있습니다. 6월에 충전하면, 케이블은 8월에나 다시 생각납니다.",
  },
  {
    id: "display",
    size: "wide",
    figure: "300",
    unit: "ppi",
    title: "Hanji display",
    titleKo: "한지 디스플레이",
    line: "Light falls into it, not off it.",
    lineKo: "빛이 튕기지 않고 스며드는 화면.",
    detail:
      "The glass is micro-etched, so light lands and stays — the way it settles into hanji fiber. No glare at noon, no glow at midnight. At 300 ppi the letterforms have edges, not pixels.",
    detailKo:
      "유리 표면에 미세한 결을 새겼습니다. 빛은 튕겨 나가지 않고 한지의 섬유처럼 스며듭니다. 한낮에도 번쩍이지 않고, 한밤에도 빛나지 않습니다. 300ppi에서는 글자에 픽셀이 아니라 획이 보입니다.",
  },
  {
    id: "pen",
    size: "box",
    figure: "4.6",
    unit: "ms",
    title: "Pen latency",
    titleKo: "펜 지연 시간",
    line: "Closer than ink.",
    lineKo: "잉크보다 가깝게.",
    detail:
      "4.6 milliseconds between your hand and the mark — ink takes longer to leave the nib. The pen never charges and never pairs. It is a pen.",
    detailKo:
      "손끝과 획 사이 4.6밀리초. 잉크가 펜촉을 떠나는 시간보다 짧습니다. 펜은 충전도, 페어링도 하지 않습니다. 그냥 펜입니다.",
  },
  {
    id: "privacy",
    size: "box",
    figure: "0",
    unit: "clouds",
    title: "Offline by design",
    titleKo: "설계된 오프라인",
    line: "Your words stay in your pocket.",
    lineKo: "글은 주머니 속에 머뭅니다.",
    detail:
      "No account. No cloud. No telemetry. Your notes leave the slate only over a cable, only when you say so.",
    detailKo:
      "계정 없음. 클라우드 없음. 수집 없음. 글은 당신이 허락할 때만, 케이블을 타고만 밖으로 나갑니다.",
  },
  {
    id: "weight",
    size: "wide",
    figure: "168",
    unit: "g",
    title: "Weight",
    titleKo: "무게",
    line: "Lighter than the notebook it replaces.",
    lineKo: "대신할 공책보다 가볍습니다.",
    detail:
      "168 grams — a thin notebook and half a pencil. The magnesium back is one sheet; nothing rattles, nothing flexes.",
    detailKo:
      "168그램. 얇은 공책 한 권과 연필 반 자루의 무게입니다. 마그네슘 등판은 한 장으로 이어져 있어 덜컹이지도, 휘지도 않습니다.",
  },
  {
    id: "light",
    size: "wide",
    figure: "2700",
    unit: "K",
    title: "Front light",
    titleKo: "전면 조명",
    line: "Warm light for late pages.",
    lineKo: "늦은 페이지를 위한 따뜻한 빛.",
    detail:
      "The front light starts at candle-warm 2700 K and never shines at your eyes — only at the page, like a lamp over a desk.",
    detailKo:
      "전면 조명은 촛불처럼 따뜻한 2700K에서 시작합니다. 빛은 눈이 아니라 페이지를 비춥니다. 책상 위의 스탠드처럼.",
  },
];

/**
 * Section 02 — the bento grid, and the page's signature move.
 *
 * Activating a tile expands it to the full grid width via a shared-element
 * FLIP: rects are captured before the state change (First), the grid
 * reflows in one React commit (Last), every moved tile is inverted back
 * onto its old box and released a frame later (Invert-Play). Content
 * wrappers get the inverse scale so type never stretches. See useFlip.
 *
 * Accessibility contract:
 * - the toggle is a real <button> in the tile heading, aria-expanded +
 *   aria-controls; the whole tile is a convenience click target on top.
 * - collapsed tiles stay fully readable (figure, title, one line).
 * - detail hiding is gated behind .slate-js — without JavaScript every
 *   detail paragraph is simply visible.
 * - reduced motion: capture() is never called, so the layout snaps.
 */
export default function BentoGrid() {
  const [open, setOpen] = useState<string | null>(null);
  const reduced = usePrefersReducedMotion();
  const flip = useFlip();

  const toggle = (id: string) => {
    if (!reduced) flip.capture();
    setOpen((prev) => (prev === id ? null : id));
  };

  useLayoutEffect(() => {
    flip.play();
  }, [open, flip]);

  const onTileClick = (id: string) => (e: ReactMouseEvent<HTMLElement>) => {
    // The heading button handles itself; clicks inside the open detail
    // (e.g. selecting text) should never collapse the tile.
    const target = e.target as HTMLElement;
    if (target.closest("button, a, .slate-tile__detail")) return;
    toggle(id);
  };

  return (
    <section className="slate-bento" aria-labelledby="slate-bento-title">
      <div className="slate-sechead">
        <span className="slate-sechead__no" aria-hidden="true">
          02
        </span>
        <h2 className="slate-sechead__title" id="slate-bento-title">
          The parts that matter <span lang="ko">중요한 것들</span>
        </h2>
        <p className="slate-sechead__note">
          Tap a tile. <span lang="ko">타일을 눌러 보세요.</span>
        </p>
      </div>

      <ul className="slate-bento__grid">
        {TILES.map((t) => {
          const isOpen = open === t.id;
          return (
            <li
              key={t.id}
              ref={flip.setOuter(t.id)}
              className={`slate-tile slate-tile--${t.size}${isOpen ? " is-open" : ""}`}
              onClick={onTileClick(t.id)}
            >
              <div className="slate-tile__body" ref={flip.setInner(t.id)}>
                <p className="slate-tile__readout">
                  <span className="slate-tile__figure">{t.figure}</span>
                  <span className="slate-tile__unit">{t.unit}</span>
                </p>
                <h3 className="slate-tile__title">
                  <button
                    type="button"
                    className="slate-tile__toggle"
                    aria-expanded={isOpen}
                    aria-controls={`slate-tile-detail-${t.id}`}
                    onClick={() => toggle(t.id)}
                  >
                    <span className="slate-tile__name">
                      {t.title} <span lang="ko">{t.titleKo}</span>
                    </span>
                    <span className="slate-tile__plus" aria-hidden="true" />
                  </button>
                </h3>
                <p className="slate-tile__line">
                  {t.line} <span lang="ko">{t.lineKo}</span>
                </p>
                <div
                  id={`slate-tile-detail-${t.id}`}
                  className="slate-tile__detail"
                >
                  <p>{t.detail}</p>
                  <p lang="ko">{t.detailKo}</p>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
