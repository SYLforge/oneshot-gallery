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

export type GridCols = 6 | 12;

type GridContextValue = {
  cols: GridCols;
  setCols: (next: GridCols) => void;
};

const GridContext = createContext<GridContextValue>({
  cols: 12,
  setCols: () => undefined,
});

export function useGrid(): GridContextValue {
  return useContext(GridContext);
}

const TWELVE = Array.from({ length: 12 }, (_, i) => i);
const SIX = Array.from({ length: 6 }, (_, i) => i);

/**
 * Owns the certified column count. The default — and the static, no-JS
 * layout — is grid no. 04: twelve columns. `setCols` re-snaps every
 * `[data-flip]` element via FLIP (`flushSync` makes the layout change
 * synchronous between the two measurements); under reduced motion the
 * re-layout is instant.
 *
 * The provider also renders the exposed construction: two fixed column
 * overlays (12 and 6) that share the exact frame, gutter, and tracks of the
 * content grids. Only their opacity crosses — the hairlines redraw the
 * moment the law changes, and the content complies over 560 ms.
 */
export default function GridProvider({ children }: { children: ReactNode }) {
  const [cols, setColsState] = useState<GridCols>(12);
  const reduced = usePrefersReducedMotion();
  const scopeRef = useRef<HTMLDivElement | null>(null);
  const flip = useFlip(scopeRef);

  const setCols = useCallback(
    (next: GridCols) => {
      if (next === cols) return;
      if (reduced) {
        setColsState(next);
        return;
      }
      flip(() => {
        flushSync(() => setColsState(next));
      });
    },
    [cols, reduced, flip],
  );

  const value = useMemo(() => ({ cols, setCols }), [cols, setCols]);

  return (
    <GridContext.Provider value={value}>
      <div ref={scopeRef} className="raster-scope" data-grid={cols}>
        <div className="raster-overlay" aria-hidden="true">
          <div className="raster-overlay__layer raster-overlay__layer--twelve">
            {TWELVE.map((i) => (
              <span key={i} />
            ))}
          </div>
          <div className="raster-overlay__layer raster-overlay__layer--six">
            {SIX.map((i) => (
              <span key={i} />
            ))}
          </div>
        </div>
        {children}
      </div>
    </GridContext.Provider>
  );
}

type BlockTone = "ink" | "line" | "red";

type Block = {
  id: string;
  tone: BlockTone;
  size: "lg" | "md" | "sm" | "bar";
  /** span at 12 columns → span at 6 columns, printed on the block */
  spans: string;
};

const BLOCKS: Block[] = [
  { id: "a", tone: "ink", size: "lg", spans: "05 → 06" },
  { id: "b", tone: "line", size: "lg", spans: "07 → 03" },
  { id: "c", tone: "ink", size: "md", spans: "04 → 03" },
  { id: "d", tone: "red", size: "md", spans: "04 → 02" },
  { id: "e", tone: "ink", size: "md", spans: "04 → 02" },
  { id: "f", tone: "ink", size: "sm", spans: "09 → 02" },
  { id: "g", tone: "line", size: "sm", spans: "03 → 06" },
  { id: "h", tone: "ink", size: "bar", spans: "12 → 06" },
];

/**
 * Section 01 — the demonstration. A keyboard-operable segmented control
 * re-certifies the sheet at six or twelve columns; every block returns to a
 * lawful cell via the FLIP in useFlip.ts. The status line is a live region,
 * so the re-certification is announced, not just seen.
 */
export function GridToggle() {
  const { cols, setCols } = useGrid();

  return (
    <section className="raster-section" aria-labelledby="raster-demo-title">
      <div className="raster-frame">
        <header className="raster-sechead">
          <span className="raster-sechead__no" aria-hidden="true">
            01
          </span>
          <h2 className="raster-sechead__title" id="raster-demo-title">
            demonstration{" "}
            <span lang="ko" className="raster-sechead__ko">
              시연 — 재인증
            </span>
          </h2>
        </header>

        <div className="raster-grid raster-demo__lead">
          <div className="raster-demo__spec" data-flip>
            <p>
              the same content, certified twice: at six columns and at twelve.
              press the control; every block returns to a lawful cell.
              tolerance: 0 px.
            </p>
            <p lang="ko">
              동일한 내용을 6단과 12단으로 두 번 인증한다. 제어를 누르면 모든
              블록이 승인된 칸으로 복귀한다. 허용 오차: 0픽셀.
            </p>
          </div>

          <div
            className="raster-toggle"
            role="group"
            aria-label="column count — 단 수"
            data-flip
          >
            <span className="raster-toggle__label" aria-hidden="true">
              columns · 단
            </span>
            <div className="raster-toggle__btns">
              <button
                type="button"
                className="raster-toggle__btn"
                aria-pressed={cols === 6}
                onClick={() => setCols(6)}
              >
                06
              </button>
              <button
                type="button"
                className="raster-toggle__btn"
                aria-pressed={cols === 12}
                onClick={() => setCols(12)}
              >
                12
              </button>
            </div>
            <p className="raster-toggle__state" role="status">
              {cols === 12
                ? "certified: 12 columns — grid no. 04"
                : "certified: 6 columns — grid no. 02"}
            </p>
          </div>
        </div>

        <div className="raster-grid raster-demo__board">
          {BLOCKS.map((block) => (
            <div
              key={block.id}
              className={`raster-blk raster-blk--${block.id} raster-blk--${block.tone} raster-blk--${block.size}`}
              data-flip
            >
              <span className="raster-blk__meta">
                <span>mod. {block.id}</span>
                <span>{block.spans}</span>
              </span>
              {block.id === "a" ? (
                <span className="raster-blk__no" aria-hidden="true">
                  {cols === 12 ? "04" : "02"}
                </span>
              ) : null}
              {block.tone === "line" ? (
                <span className="raster-blk__bars" aria-hidden="true">
                  <i />
                  <i />
                  <i />
                </span>
              ) : null}
            </div>
          ))}
        </div>

        <p className="raster-demo__note raster-mono">
          fig. 01 — blocks are numbered, not named. spans are printed as
          12-col → 6-col.{" "}
          <span lang="ko">
            도판 01 — 블록에는 이름이 아니라 번호를 붙인다. 스팬은 12단 →
            6단으로 표기.
          </span>
        </p>
      </div>
    </section>
  );
}
