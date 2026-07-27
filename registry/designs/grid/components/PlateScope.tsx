"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { flushSync } from "react-dom";
import { useFlip } from "../hooks/useFlip";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import type { Typology } from "./projects";

export type Filter = Typology | "all";

type PlateContextValue = {
  filter: Filter;
  setFilter: (next: Filter) => void;
};

const PlateContext = createContext<PlateContextValue>({
  filter: "all",
  setFilter: () => undefined,
});

export function usePlate(): PlateContextValue {
  return useContext(PlateContext);
}

const COLS = 12;

/**
 * Owns the typology filter. The default — and the static, no-JS board —
 * is "all works": every plate shown. `setFilter` re-snaps every
 * `[data-flip]` plate via FLIP (`flushSync` makes the layout change
 * synchronous between the two measurements); under reduced motion the
 * repack is instant.
 *
 * The provider also renders the exposed construction: a fixed column
 * overlay of faint ink hairlines at the content's exact frame. Where
 * RASTER cross-fades two grid layers (6 and 12) to prove its column count
 * changed, GRID keeps one 12-col overlay always on — the grid is the
 * *instrument* here, not the *subject*, so it stays put while the work
 * moves across it.
 */
export default function PlateScope({ children }: { children: ReactNode }) {
  const [filter, setFilterState] = useState<Filter>("all");
  const reduced = usePrefersReducedMotion();
  const scopeRef = useRef<HTMLDivElement | null>(null);
  const flip = useFlip(scopeRef);

  const setFilter = useCallback(
    (next: Filter) => {
      if (next === filter) return;
      if (reduced) {
        setFilterState(next);
        return;
      }
      flip(() => {
        flushSync(() => setFilterState(next));
      });
    },
    [filter, reduced, flip],
  );

  const value = useMemo(() => ({ filter, setFilter }), [filter, setFilter]);

  return (
    <PlateContext.Provider value={value}>
      <div ref={scopeRef} className="grid-scope" data-filter={filter}>
        <div className="grid-overlay" aria-hidden="true">
          <div className="grid-overlay__layer">
            {Array.from({ length: COLS }, (_, i) => (
              <span key={i} />
            ))}
          </div>
        </div>
        {children}
      </div>
    </PlateContext.Provider>
  );
}
