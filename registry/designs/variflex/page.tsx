"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import "./styles.css";
import { recursive, notoSansKR } from "./fonts";
import { useReveal } from "./hooks/useReveal";
import { usePrefersReducedMotion } from "./hooks/usePrefersReducedMotion";

const TITLE = "VARIFLEX";

/**
 * VARIFLEX 바리플렉스 — type that stretches. The signature is the variable
 * axis morph: a huge wordmark in Recursive whose font-weight (300..900) and
 * slnt (0..-15) are driven by the pointer's X (and a touch of Y), so the
 * glyphs physically swing from thin-extended to bold-slanted in real time.
 * The axis readout (wght / slnt) updates live beside it. Under reduced motion
 * the wordmark holds a composed mid-axis pose.
 *
 * `.variflex-js` is added on mount so the no-JS markup is the finished page:
 * the wordmark at its default axis, copy readable.
 */
export default function VariflexPage() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const readoutRef = useRef<HTMLSpanElement | null>(null);
  const reduced = usePrefersReducedMotion();
  const revealRef = useReveal<HTMLDivElement>();

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    root.classList.add("variflex-js");
    const id = requestAnimationFrame(() => root.classList.add("is-mounted"));
    window.parent?.postMessage({ type: "oneshot:ready", slug: "variflex" }, "*");
    return () => cancelAnimationFrame(id);
  }, []);

  // Drive the variable axes from the pointer. X → weight, Y → slant.
  // Damped in a rAF loop so the morph feels like a spring, not a snap.
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || reduced) return;
    let raf = 0;
    let tw = 600; // target weight
    let ts = 0; // target slnt
    let cw = tw;
    let cs = ts;
    const onMove = (e: PointerEvent) => {
      const r = stage.getBoundingClientRect();
      const w = Math.max(1, r.width);
      const h = Math.max(1, r.height);
      const nx = (e.clientX - r.left) / w; // 0..1
      const ny = (e.clientY - r.top) / h; // 0..1
      // weight 300 (left) .. 900 (right); slnt 0 (top) .. -15 (bottom)
      tw = 300 + nx * 600;
      ts = 0 - ny * 15;
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const tick = () => {
      cw += (tw - cw) * 0.18;
      cs += (ts - cs) * 0.18;
      if (!Number.isFinite(cw)) cw = 600;
      if (!Number.isFinite(cs)) cs = 0;
      stage.style.setProperty("--vf-w", cw.toFixed(0));
      stage.style.setProperty("--vf-s", cs.toFixed(1));
      if (readoutRef.current) {
        readoutRef.current.textContent = `wght ${cw.toFixed(0)} · slnt ${cs.toFixed(1)}`;
      }
      if (Math.abs(tw - cw) > 0.6 || Math.abs(ts - cs) > 0.06) {
        raf = requestAnimationFrame(tick);
      } else {
        raf = 0;
      }
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [reduced]);

  return (
    <div
      ref={rootRef}
      className={`${recursive.variable} ${notoSansKR.variable} variflex-root`}
    >
      <div className="variflex-paper" aria-hidden="true" />
      <div ref={revealRef} className="variflex-doc">
        <header className="vf-hero">
          <p className="vf-kicker" data-reveal="">
            <span lang="ko">가변폰트 쇼케이스</span> · VARIABLE TYPE · wght 300–900 · slnt 0–-15
          </p>
          <div ref={stageRef} className="vf-stage" data-reveal="">
            <h1 className="vf-title" aria-label={TITLE}>
              <span aria-hidden="true" className="vf-title__row">
                {TITLE.split("").map((ch, i) => (
                  <span
                    key={i}
                    className="variflex-glyph"
                    style={{ "--vf-i": i } as CSSProperties}
                  >
                    {ch}
                  </span>
                ))}
              </span>
            </h1>
            <p className="vf-axis-readout" aria-live="off">
              <span ref={readoutRef}>wght 600 · slnt 0.0</span>
              <span className="vf-axis-hint" lang="ko">
                {" "}— 움직여 자형을 늘려라
              </span>
            </p>
          </div>
          <p className="vf-sub" data-reveal="">
            <span lang="ko">늘어나는 자형.</span> Type that stretches — move the
            pointer and the axes bend: thin and extended left, bold and slanted
            right.
          </p>
        </header>

        <section className="vf-axes" aria-labelledby="vf-axes-title">
          <div className="vf-sechead" data-reveal="">
            <p className="vf-eyebrow">
              02 — <span lang="ko">두 축</span> · the axes
            </p>
            <h2 id="vf-axes-title" className="vf-secthead__title">
              two axes, one glyph
            </h2>
            <p className="vf-secthead__kr" lang="ko">
              무게와 기울기 — 같은 글자가 다른 형태로.
            </p>
          </div>
          <div className="vf-axegrid">
            <article className="vf-axecard" data-reveal="">
              <p className="vf-axecard__no">01</p>
              <p className="vf-axecard__demo vf-axecard__demo--thin" aria-hidden="true">Aa</p>
              <p className="vf-axecard__h">
                wght · <span lang="ko">무게</span>
              </p>
              <p className="vf-axecard__b">
                <span lang="ko">왼쪽은 얇고, 오른쪽은 두껍다.</span> Left is
                thin (300), right is heavy (900) — the stroke fills out.
              </p>
            </article>
            <article className="vf-axecard" data-reveal="">
              <p className="vf-axecard__no">02</p>
              <p className="vf-axecard__demo vf-axecard__demo--slant" aria-hidden="true">Aa</p>
              <p className="vf-axecard__h">
                slnt · <span lang="ko">기울기</span>
              </p>
              <p className="vf-axecard__b">
                <span lang="ko">위는 곧고, 아래는 기운다.</span> Top is upright
                (0°), bottom leans (-15°) — the italics live in the same font.
              </p>
            </article>
          </div>
        </section>

        <section className="vf-ramp" aria-labelledby="vf-ramp-title">
          <div className="vf-sechead" data-reveal="">
            <p className="vf-eyebrow">
              03 — <span lang="ko">스펙트럼</span> · the spectrum
            </p>
            <h2 id="vf-ramp-title" className="vf-secthead__title">
              the full sweep
            </h2>
            <p className="vf-secthead__kr" lang="ko">
              한 글자가 여섯 단계로.
            </p>
          </div>
          <div className="vf-ramp-row" data-reveal="" aria-hidden="true">
            <span className="vf-ramp-ch" style={{ fontWeight: 300, fontStyle: "normal" }}>바</span>
            <span className="vf-ramp-ch" style={{ fontWeight: 500, fontStyle: "normal" }}>A</span>
            <span className="vf-ramp-ch" style={{ fontWeight: 700, fontStyle: "normal" }}>A</span>
            <span className="vf-ramp-ch" style={{ fontWeight: 900, fontStyle: "normal" }}>A</span>
            <span className="vf-ramp-ch" style={{ fontWeight: 700, fontVariationSettings: "'slnt' -8" }}>A</span>
            <span className="vf-ramp-ch" style={{ fontWeight: 900, fontVariationSettings: "'slnt' -15" }}>A</span>
          </div>
          <p className="vf-ramp-cap" data-reveal="">
            <span lang="ko">얇고 곧은 것에서 굵고 기운 것까지.</span> From thin &amp;
            upright to bold &amp; slanted — one variable font, every step.
          </p>
        </section>

        <footer className="vf-foot" data-reveal="">
          <p className="vf-foot__brand">
            VARIFLEX <span lang="ko">바리플렉스</span> ·{" "}
            <span lang="ko">늘어나는 자형</span>
          </p>
          <p className="vf-foot__line">
            <span lang="ko">순수 코드 — 이미지 없음.</span> Pure code ·
            Recursive variable font · MIT
          </p>
        </footer>
      </div>
    </div>
  );
}
