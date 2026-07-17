"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

export type Season = "spring" | "summer" | "autumn" | "winter";

export const SEASONS: Array<{
  id: Season;
  /** i18n label pair — the toggle reads both. */
  en: string;
  ko: string;
  /** short haiku for the madang, bilingual. */
  haikuEn: string;
  haikuKo: string;
}> = [
  {
    id: "spring",
    en: "Spring",
    ko: "봄",
    haikuEn: "Warmth returns to the floor.",
    haikuKo: "온돌에 봄이 돌아온다.",
  },
  {
    id: "summer",
    en: "Summer",
    ko: "여름",
    haikuEn: "The maru breathes through.",
    haikuKo: "마루로 바람이 지난다.",
  },
  {
    id: "autumn",
    en: "Autumn",
    ko: "가을",
    haikuEn: "Eaves cast long amber.",
    haikuKo: "처마 그림자 길어진다.",
  },
  {
    id: "winter",
    en: "Winter",
    ko: "겨울",
    haikuEn: "Snow rests on the tiles.",
    haikuKo: "기와 위 눈이 내린다.",
  },
];

const ORDER: Season[] = ["spring", "summer", "autumn", "winter"];
const CYCLE_MS = 5200; // one season per ~5.2s in auto mode

/**
 * Season state for the page. Two sources of truth, one value:
 *  - the visitor picks a season with the SeasonalLight toggle (manual),
 *  - or the page auto-cycles when `auto` is true.
 *
 * Auto-cycle is a `setInterval` that advances one step at a time. It pauses
 * entirely under prefers-reduced-motion (the season is then fixed at the
 * last manual pick, or spring by default) and when the tab is hidden — so
 * a backgrounded tab never burns a timer (gate G3). The interval is cleared
 * the instant the visitor takes manual control.
 *
 * The season is also reflected onto the root as `data-season` so CSS can
 * recolor the madang sky and drift the eave shadow without React re-render
 * — only background-color / transform / opacity transition (gate G3).
 */
export function useSeason() {
  const reduced = usePrefersReducedMotion();
  const [auto, setAuto] = useState(true);
  const [season, setSeason] = useState<Season>("spring");

  // Reflect onto the root for CSS (imperative — not React state the tree
  // needs to re-render for; the consumers that DO need it read `season`).
  useEffect(() => {
    const root = document.querySelector(".hanok-root");
    if (root) root.setAttribute("data-season", season);
  }, [season]);

  useEffect(() => {
    if (!auto) return;
    if (reduced) return; // frozen season under reduced motion
    let timer = window.setInterval(() => {
      setSeason((prev) => {
        const i = ORDER.indexOf(prev);
        return ORDER[(i + 1) % ORDER.length];
      });
    }, CYCLE_MS);

    const onVisibility = () => {
      if (document.hidden) {
        window.clearInterval(timer);
      } else {
        window.clearInterval(timer);
        timer = window.setInterval(() => {
          setSeason((prev) => {
            const i = ORDER.indexOf(prev);
            return ORDER[(i + 1) % ORDER.length];
          });
        }, CYCLE_MS);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [auto, reduced]);

  const pick = useCallback((next: Season) => {
    setAuto(false);
    setSeason(next);
  }, []);

  const resume = useCallback(() => {
    if (!reduced) setAuto(true);
  }, [reduced]);

  return useMemo(
    () => ({ season, auto, reduced, pick, resume }),
    [season, auto, reduced, pick, resume],
  );
}
