"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import "./styles.css";
import { plusJakartaSans, notoSansKR } from "./fonts";
import { useReveal } from "./hooks/useReveal";
import { usePrefersReducedMotion } from "./hooks/usePrefersReducedMotion";

const TITLE = "BENTO";

/**
 * BENTO 벤토 — design that holds. The signature is an asymmetric bento grid:
 * rounded white tiles on a soft putty field, each spanning a different shape
 * (2×1, 1×2, a large feature, a small chip). A couple of tiles carry tiny
 * CSS-shape illustrations (a waveform, concentric rings, stacked bars); two
 * are color-accent tiles in the brand blue. On hover a tile lifts and scales
 * a touch — a FLIP-flavoured pop — while its neighbours settle back. The
 * wordmark is Plus Jakarta Sans 800, blue, each glyph rising into place.
 *
 * `.bento-js` is added on mount so the no-JS markup is the finished page:
 * every tile sits, copy is readable, the grid is whole without motion.
 */
export default function BentoPage() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const reduced = usePrefersReducedMotion();
  const revealRef = useReveal<HTMLDivElement>();
  const gridRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    root.classList.add("bento-js");
    const id = requestAnimationFrame(() => root.classList.add("is-mounted"));
    window.parent?.postMessage({ type: "oneshot:ready", slug: "bento" }, "*");
    return () => cancelAnimationFrame(id);
  }, []);

  // FLIP-flavoured hover: when one tile is pointed, it scales up a touch and
  // its siblings dim slightly. Reduced motion skips the dim, keeps focus ring.
  useEffect(() => {
    if (reduced) return;
    const grid = gridRef.current;
    if (!grid) return;
    const tiles = Array.from(grid.querySelectorAll<HTMLElement>(".bento-tile"));
    const onEnter = (e: Event) => {
      const t = e.currentTarget as HTMLElement;
      for (const tile of tiles) {
        if (tile === t) tile.classList.add("bt-pop");
        else tile.classList.add("bt-dim");
      }
    };
    const onLeave = () => {
      for (const tile of tiles) {
        tile.classList.remove("bt-pop");
        tile.classList.remove("bt-dim");
      }
    };
    for (const t of tiles) {
      t.addEventListener("pointerenter", onEnter);
      t.addEventListener("pointerleave", onLeave);
    }
    return () => {
      for (const t of tiles) {
        t.removeEventListener("pointerenter", onEnter);
        t.removeEventListener("pointerleave", onLeave);
      }
    };
  }, [reduced]);

  return (
    <div
      ref={rootRef}
      className={`${plusJakartaSans.variable} ${notoSansKR.variable} bento-root`}
    >
      <div className="bento-bg" aria-hidden="true" />
      <div ref={revealRef} className="bento-doc">
        <header className="bento-hero">
          <p className="bento-kicker">
            <span lang="ko">담는 디자인</span> · DESIGN THAT HOLDS
          </p>
          <h1 className="bento-title" aria-label={TITLE}>
            {TITLE.split("").map((ch, i) => (
              <span
                key={i}
                aria-hidden="true"
                className="bento-glyph"
                style={{ "--bt-i": i } as CSSProperties}
              >
                {ch}
              </span>
            ))}
          </h1>
          <p className="bento-title__ko" lang="ko">벤토</p>
          <p className="bento-sub">
            <span lang="ko">칸마다 하나의 이야기를 담는 그리드.</span>{" "}
            A grid where each compartment holds one story.
          </p>
        </header>

        <main>
          <section className="bento-lead" data-reveal>
            <p className="bento-lead__p">
              <span lang="ko">
                벤토는 나눔이 아니라 담음이다. 각 칸은 자기 크기를 가지고,
                서로 비워둔 여백 덕에 온전히 읽힌다. 복잡함을 숨기지 않고
                칸에 나누어 담는 것 — 그것이 우리가 부르는 정리다.
              </span>{" "}
              Bento is not dividing, it is holding. Each compartment owns its
              size, and the whitespace between them is what makes each legible.
              We don&apos;t hide complexity — we compartmentalise it.
            </p>
          </section>

          <section ref={gridRef} className="bento-grid" data-reveal>
            {/* Feature tile — large, brand blue. */}
            <article
              className="bento-tile bt-feature bt-accent"
              data-reveal
              style={{ "--bt-d": 40 } as CSSProperties}
            >
              <span className="bt-feature__n">01</span>
              <h2 className="bt-feature__en">Compartments</h2>
              <p className="bt-feature__ko" lang="ko">칸</p>
              <p className="bt-feature__p" lang="ko">
                하나의 칸은 하나의 생각. 넘치지 않고, 비지 않는 밀도.
              </p>
              {/* mini illustration: concentric rings */}
              <div className="bt-rings" aria-hidden="true">
                <span /><span /><span />
              </div>
            </article>

            {/* Tall tile — stacked bars illustration */}
            <article
              className="bento-tile bt-tall"
              data-reveal
              style={{ "--bt-d": 120 } as CSSProperties}
            >
              <span className="bt-tag">02</span>
              <div className="bt-bars" aria-hidden="true">
                <span style={{ height: "44%" }} />
                <span style={{ height: "72%" }} />
                <span style={{ height: "58%" }} />
                <span style={{ height: "90%" }} />
                <span style={{ height: "36%" }} />
              </div>
              <p className="bt-cap">
                <span lang="ko">밀도</span> · Density
              </p>
            </article>

            {/* Wide tile — waveform illustration */}
            <article
              className="bento-tile bt-wide"
              data-reveal
              style={{ "--bt-d": 80 } as CSSProperties}
            >
              <span className="bt-tag">03</span>
              <h3 className="bt-mid__en">Rhythm</h3>
              <p className="bt-mid__ko" lang="ko">박자</p>
              <div className="bt-wave" aria-hidden="true">
                <svg viewBox="0 0 200 40" preserveAspectRatio="none">
                  <path
                    d="M0,20 Q12,4 24,20 T48,20 T72,20 T96,20 T120,20 T144,20 T168,20 T192,20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </article>

            {/* Small chip tiles */}
            <article
              className="bento-tile bt-chip"
              data-reveal
              style={{ "--bt-d": 160 } as CSSProperties}
            >
              <span className="bt-num">04</span>
              <span className="bt-chip__ko" lang="ko">여백</span>
              <span className="bt-chip__en">Margin</span>
            </article>

            <article
              className="bento-tile bt-chip bt-accent2"
              data-reveal
              style={{ "--bt-d": 200 } as CSSProperties}
            >
              <span className="bt-num">05</span>
              <span className="bt-chip__ko" lang="ko">정렬</span>
              <span className="bt-chip__en">Align</span>
            </article>

            {/* Quote tile — wide, soft */}
            <article
              className="bento-tile bt-quote"
              data-reveal
              style={{ "--bt-d": 240 } as CSSProperties}
            >
              <p className="bt-quote__p" lang="ko">
                &ldquo;담는다는 것은, 버리는 것이 아니라 자리를 주는 것이다.&rdquo;
              </p>
              <span className="bt-quote__by">— BENTO STUDIO</span>
            </article>

            {/* Number tile */}
            <article
              className="bento-tile bt-stat"
              data-reveal
              style={{ "--bt-d": 120 } as CSSProperties}
            >
              <span className="bt-stat__n">12</span>
              <span className="bt-stat__l" lang="ko">칸의 그리드</span>
            </article>

            {/* Footer-ish tile */}
            <article
              className="bento-tile bt-foot-tile"
              data-reveal
              style={{ "--bt-d": 200 } as CSSProperties}
            >
              <span className="bt-foot__ko" lang="ko">벤토 · 2026</span>
              <span className="bt-foot__en">BENTO · HOLD EVERYTHING</span>
            </article>
          </section>
        </main>

        <footer className="bento-foot">
          <span>BENTO · 2026</span>
          <span lang="ko">담는 디자인 — 서울 성수동</span>
        </footer>
      </div>
    </div>
  );
}
