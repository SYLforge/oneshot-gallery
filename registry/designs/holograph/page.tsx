"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import "./styles.css";
import { spaceGrotesk, notoSansKR } from "./fonts";
import { useReveal } from "./hooks/useReveal";
import { usePrefersReducedMotion } from "./hooks/usePrefersReducedMotion";

const TITLE = "HOLOGRAPH";

/**
 * HOLOGRAPH 홀로그래프 — a holographic card house. The signature is an
 * iridescent foil: a multi-stop conic-gradient spectrum on the wordmark whose
 * angle is driven by the pointer, so the rainbow sweeps as you move. Holographic
 * panels refract the same spectrum. Under reduced motion the foil holds a fixed
 * prismatic angle (a composed still).
 *
 * `.holograph-js` is added on mount so the no-JS markup is the finished page.
 */
export default function HolographPage() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const reduced = usePrefersReducedMotion();
  const revealRef = useReveal<HTMLDivElement>();
  const stageRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    root.classList.add("holograph-js");
    const id = requestAnimationFrame(() => root.classList.add("is-mounted"));
    window.parent?.postMessage({ type: "oneshot:ready", slug: "holograph" }, "*");
    return () => cancelAnimationFrame(id);
  }, []);

  // Drive the foil angle from the pointer so the rainbow sweeps live.
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || reduced) return;
    let raf = 0;
    let target = 200;
    let cur = target;
    const onMove = (e: PointerEvent) => {
      const r = stage.getBoundingClientRect();
      const nx = (e.clientX - r.left) / r.width; // 0..1
      target = 120 + nx * 240; // sweep 120deg..360deg
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const tick = () => {
      cur += (target - cur) * 0.1;
      stage.style.setProperty("--hg-angle", `${cur.toFixed(1)}deg`);
      if (Math.abs(target - cur) > 0.4) raf = requestAnimationFrame(tick);
      else raf = 0;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [reduced]);

  return (
    <div ref={rootRef} className={`${spaceGrotesk.variable} ${notoSansKR.variable} holograph-root`}>
      <div className="holograph-bg" aria-hidden="true" />
      <div ref={revealRef} className="holograph-doc">
        <header ref={stageRef} className="holograph-hero">
          <p className="holograph-kicker">
            <span lang="ko">은박 카드 하우스</span> · FOIL CARD HOUSE · 2026
          </p>
          <h1 className="holograph-title" aria-label={TITLE}>
            <span className="holograph-foil" aria-hidden="true">
              {TITLE.split("").map((ch, i) => (
                <span key={i} className="holograph-glyph" style={{ "--hg-i": i } as CSSProperties}>
                  {ch}
                </span>
              ))}
            </span>
          </h1>
          <p className="holograph-title__ko" lang="ko">홀로그래프</p>
          <p className="holograph-sub">
            <span lang="ko">각도마다 다른 색.</span> A different color at every angle.
          </p>
          <p className="holograph-hint" lang="ko">움직여 보세요 — 무지개가 당신을 따라갑니다.</p>
        </header>

        <main>
          <section className="holograph-grid">
            {[
              { ko: "무지개 은박", en: "Rainbow foil", n: "01" },
              { ko: "보안 홀로그램", en: "Security hologram", n: "02" },
              { ko: "각도 잉크", en: "Angle-shift ink", n: "03" },
            ].map((c, i) => (
              <article key={i} className="holograph-card" data-reveal style={{ "--hg-d": i * 90 } as CSSProperties}>
                <span className="holograph-card__n">{c.n}</span>
                <span className="holograph-card__en">{c.en}</span>
                <span className="holograph-card__ko" lang="ko">{c.ko}</span>
              </article>
            ))}
          </section>

          <section className="holograph-lead" data-reveal>
            <p className="holograph-lead__p">
              <span lang="ko">
                홀로그래피는 빛의 간섭이다. 우리는 종이 위에 무지개를 인쇄하지 않는다 —
                각도를 인쇄한다. 돌리면 색이, 기울이면 빛이, 멈추면 잔상이 남는다.
              </span>{" "}
              Holography is light's interference. We don't print a rainbow on paper —
              we print an angle. Turn it and the color shifts; tilt it and the light;
              stop and the after-image stays.
            </p>
          </section>
        </main>

        <footer className="holograph-foot">
          <span>HOLOGRAPH · 2026</span>
          <span lang="ko">홀로그래프 — 서울</span>
        </footer>
      </div>
    </div>
  );
}
