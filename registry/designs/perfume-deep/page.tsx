"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import "./styles.css";
import { cormorantGaramond, notoSerifKR } from "./fonts";
import { useReveal } from "./hooks/useReveal";
import { usePrefersReducedMotion } from "./hooks/usePrefersReducedMotion";

const TITLE = "PERFUME";

/**
 * PERFUME DEEP 퍼퓸 딥 — a deep scent, a house of expensive silence. The
 * signature is restraint: a hairline Cormorant wordmark parts slowly on
 * near-black warm, a feature panel wipes open in gold (clip-path), and a
 * soft gold glow follows the pointer a fraction (parallax). Thin gold
 * hairlines divide the page into rooms; generous whitespace lets each word
 * breathe. The KO sub "퍼퓸 딥" sits in Noto Serif KR under the wordmark.
 *
 * `.perfume-deep-js` is added on mount so the no-JS markup is the finished
 * page: copy is readable, the wordmark stands, the gold panel is open.
 */
export default function PerfumeDeepPage() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const reduced = usePrefersReducedMotion();
  const revealRef = useReveal<HTMLDivElement>();
  const glowRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    root.classList.add("perfume-deep-js");
    const id = requestAnimationFrame(() => root.classList.add("is-mounted"));
    window.parent?.postMessage({ type: "oneshot:ready", slug: "perfume-deep" }, "*");
    return () => cancelAnimationFrame(id);
  }, []);

  // Pointer parallax: a soft gold glow eases toward the cursor. NaN-safe —
  // any non-finite pointer position is ignored.
  useEffect(() => {
    if (reduced) return;
    const glow = glowRef.current;
    if (!glow) return;
    let raf = 0;
    const cur = { x: 0.5, y: 0.3, tx: 0.5, ty: 0.3 };
    const onMove = (e: PointerEvent) => {
      const x = e.clientX / Math.max(1, window.innerWidth);
      const y = e.clientY / Math.max(1, window.innerHeight);
      if (!Number.isFinite(x) || !Number.isFinite(y)) return;
      cur.tx = x;
      cur.ty = y;
    };
    const tick = () => {
      raf = requestAnimationFrame(tick);
      cur.x += (cur.tx - cur.x) * 0.05;
      cur.y += (cur.ty - cur.y) * 0.05;
      const px = Math.max(0, Math.min(100, cur.x * 100));
      const py = Math.max(0, Math.min(100, cur.y * 100));
      glow.style.setProperty("--pf-gx", `${px}%`);
      glow.style.setProperty("--pf-gy", `${py}%`);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
    };
  }, [reduced]);

  return (
    <div
      ref={rootRef}
      className={`${cormorantGaramond.variable} ${notoSerifKR.variable} perfume-deep-root`}
    >
      <div className="perfume-deep-bg" aria-hidden="true" />
      <div ref={glowRef} className="perfume-deep-glow" aria-hidden="true" />
      <div ref={revealRef} className="perfume-deep-doc">
        <header className="perfume-deep-hero">
          <p className="perfume-deep-kicker">
            <span lang="ko">깊은 향</span> · A DEEP SCENT · MAISON DEEP · EST. MCMXXIV
          </p>
          <h1 className="perfume-deep-title" aria-label={TITLE}>
            {TITLE.split("").map((ch, i) => (
              <span
                key={i}
                aria-hidden="true"
                className="perfume-deep-glyph"
                style={{ "--pf-i": i } as CSSProperties}
              >
                {ch}
              </span>
            ))}
          </h1>
          <p className="perfume-deep-title__ko" lang="ko">퍼퓸 딥</p>
          <p className="perfume-deep-sub">
            <span lang="ko">밤의 깊이에서 오래 머무는 향.</span>{" "}
            A scent that lingers in the depth of night.
          </p>
        </header>

        <div className="perfume-deep-rule" aria-hidden="true">
          <span className="pf-hair" />
          <span className="pf-dot" />
          <span className="pf-hair" />
        </div>

        <main>
          <section className="perfume-deep-lead" data-reveal>
            <p className="perfume-deep-lead__p">
              <span lang="ko">
                깊은 향은 서두르지 않는다. 첫 숨에는 흙과 몰약, 그리고 오래된 나무.
                마지막에는 피부에 닿은 따뜻함만 남는다. 우리는 그 끝을 위해
                처음을 비워둔다.
              </span>{" "}
              A deep scent never hurries. The first breath is loam and myrrh and
              old wood; the last is only warmth against skin. We leave the
              beginning empty for the sake of the end.
            </p>
          </section>

          {/* Feature panel — clip-path wipe reveal, gold. */}
          <section className="perfume-deep-panel" data-reveal>
            <div className="pf-panel__in">
              <span className="pf-panel__n">N° 06</span>
              <h2 className="pf-panel__en">NOIR PROFOND</h2>
              <p className="pf-panel__ko" lang="ko">밤의 깊이</p>
              <ul className="pf-panel__notes">
                <li><span lang="ko">전향</span> · Top — Bergamot, Pink Pepper</li>
                <li><span lang="ko">중향</span> · Heart — Oud, Black Rose</li>
                <li><span lang="ko">잔향</span> · Base — Myrrh, Amber, Vetiver</li>
              </ul>
            </div>
            <div className="pf-panel__glow" aria-hidden="true" />
          </section>

          <section className="perfume-deep-triptych">
            {[
              { ko: "빛", en: "Restraint", n: "I" },
              { ko: "시간", en: "Patience", n: "II" },
              { ko: "피부", en: "Warmth", n: "III" },
            ].map((c, i) => (
              <article
                key={i}
                className="pf-tri"
                data-reveal
                style={{ "--pf-d": i * 110 } as CSSProperties}
              >
                <span className="pf-tri__n">{c.n}</span>
                <span className="pf-tri__en">{c.en}</span>
                <span className="pf-tri__ko" lang="ko">{c.ko}</span>
              </article>
            ))}
          </section>
        </main>

        <footer className="perfume-deep-foot">
          <span>MAISON DEEP · 1924</span>
          <span lang="ko">퍼퓸 딥 — 파리 8구</span>
        </footer>
      </div>
    </div>
  );
}
