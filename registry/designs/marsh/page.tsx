"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import "./styles.css";
import { fredoka, gaegu } from "./fonts";
import { useReveal } from "./hooks/useReveal";
import { usePrefersReducedMotion } from "./hooks/usePrefersReducedMotion";

const TITLE = "MARSH";

/**
 * MARSH 마쉬 — a squishy marshmallow confectionery. The signature is a
 * DRAGGABLE marshmallow: pointer-down grabs it, drag moves it with inertia
 * (the blob lags and stretches toward the cursor), and on release it springs
 * back to rest with overshoot (`cubic-bezier(0.34, 1.8, 0.5, 1)`). It squashes
 * — scaling wider/shorter — the further it's dragged, then puffs back.
 *
 * The wordmark "MARSH" is white fill with a thick pink outline and soft pink
 * drop shadows. `.marsh-js` is added on mount so the no-JS markup is the
 * finished page; under reduced motion the marshmallow sits at rest (no drag).
 */
export default function MarshPage() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const reduced = usePrefersReducedMotion();
  const revealRef = useReveal<HTMLDivElement>();
  const mallRef = useRef<HTMLDivElement | null>(null);
  const padRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    root.classList.add("marsh-js");
    const id = requestAnimationFrame(() => root.classList.add("is-mounted"));
    window.parent?.postMessage({ type: "oneshot:ready", slug: "marsh" }, "*");
    return () => cancelAnimationFrame(id);
  }, []);

  // Drag physics — grab the marshmallow, drag with inertia, spring back on
  // release with overshoot. Squash factor grows with distance from rest.
  useEffect(() => {
    const mall = mallRef.current;
    const pad = padRef.current;
    if (!mall || !pad || reduced) return;

    const EPS = 1;
    let dragging = false;
    let px = 0; // pointer pos
    let py = 0;
    let restX = 0; // rest origin (center of pad)
    let restY = 0;
    let x = 0; // current offset from rest
    let y = 0;
    let vx = 0; // velocity for inertia
    let vy = 0;
    let raf = 0;

    const computeRest = () => {
      const r = pad.getBoundingClientRect();
      restX = Math.max(EPS, r.width) / 2;
      restY = Math.max(EPS, r.height) / 2;
    };
    computeRest();

    const render = () => {
      if (!Number.isFinite(x) || !Number.isFinite(y)) return;
      // Squash: the further from rest, the more it stretches along the drag
      // axis (dist) and flattens across it. Cap so it never inverts.
      const dist = Math.sqrt(x * x + y * y);
      const stretch = Math.min(0.22, dist / 320);
      const sx = 1 + stretch;
      const sy = 1 - stretch * 0.7;
      mall.style.setProperty("--mh-x", `${x.toFixed(1)}px`);
      mall.style.setProperty("--mh-y", `${y.toFixed(1)}px`);
      mall.style.setProperty("--mh-sx", sx.toFixed(3));
      mall.style.setProperty("--mh-sy", sy.toFixed(3));
      mall.style.setProperty("--mh-drag", dragging ? "1" : "0");
    };

    const onDown = (ev: PointerEvent) => {
      dragging = true;
      mall.setPointerCapture?.(ev.pointerId);
      const r = pad.getBoundingClientRect();
      px = ev.clientX - r.left;
      py = ev.clientY - r.top;
      vx = 0;
      vy = 0;
      if (!raf) raf = requestAnimationFrame(loop);
    };
    const onMove = (ev: PointerEvent) => {
      if (!dragging) return;
      const r = pad.getBoundingClientRect();
      if (r.width < EPS) return;
      const npx = ev.clientX - r.left;
      const npy = ev.clientY - r.top;
      if (!Number.isFinite(npx) || !Number.isFinite(npy)) return;
      // Inertia: target follows pointer, velocity = last delta.
      vx = npx - px;
      vy = npy - py;
      px = npx;
      py = npy;
      if (!raf) raf = requestAnimationFrame(loop);
    };
    const onUp = () => {
      dragging = false;
      if (!raf) raf = requestAnimationFrame(loop);
    };

    const loop = () => {
      if (dragging) {
        // Spring toward the pointer with a little give (inertia lag).
        const tx = px - restX;
        const ty = py - restY;
        x += (tx - x) * 0.28;
        y += (ty - y) * 0.28;
        raf = requestAnimationFrame(loop);
      } else {
        // Release: fly out on velocity, then spring back to 0 with overshoot.
        x += vx;
        y += vy;
        vx *= 0.86;
        vy *= 0.86;
        // Spring stiffness / damping toward rest.
        x += (0 - x) * 0.12;
        y += (0 - y) * 0.12;
        const near = Math.abs(x) < 0.4 && Math.abs(y) < 0.4 && Math.abs(vx) < 0.4 && Math.abs(vy) < 0.4;
        if (near) {
          x = 0; y = 0; vx = 0; vy = 0;
          raf = 0;
        } else {
          raf = requestAnimationFrame(loop);
        }
      }
      render();
    };

    mall.style.touchAction = "none";
    mall.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);

    const ro = new ResizeObserver(computeRest);
    ro.observe(pad);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      mall.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      ro.disconnect();
    };
  }, [reduced]);

  return (
    <div ref={rootRef} className={`${fredoka.variable} ${gaegu.variable} marsh-root`}>
      <div className="marsh-bg" aria-hidden="true" />
      <div ref={revealRef} className="marsh-doc">
        <header className="marsh-hero">
          <p className="marsh-kicker">
            <span lang="ko">마시멜로 제과점</span> · SQUISHY MARSHMALLOW · 2026
          </p>
          <h1 className="marsh-title" aria-label={TITLE}>
            <span className="marsh-outline" aria-hidden="true">
              {TITLE.split("").map((ch, i) => (
                <span key={i} className="marsh-glyph" style={{ "--mh-i": i } as CSSProperties}>
                  {ch}
                </span>
              ))}
            </span>
          </h1>
          <p className="marsh-title__ko" lang="ko">마쉬</p>
          <p className="marsh-sub">
            <span lang="ko">말랑한 마시멜로.</span> Squishy marshmallow.
          </p>
          <p className="marsh-hint" lang="ko">마시멜로를 끌어서 움직여 보세요 — 놓으면 말랑하게 되튕깁니다.</p>

          <div ref={padRef} className="marsh-pad">
            <div ref={mallRef} className="marsh-mallow" role="button" tabIndex={0} aria-label="드래그 가능한 마시멜로">
              <span className="marsh-mallow__top" aria-hidden="true" />
            </div>
          </div>
        </header>

        <main>
          <section className="marsh-grid">
            {[
              { ko: "바닐라 구름", en: "Vanilla cloud", n: "01" },
              { ko: "딸기 폭신", en: "Strawberry puff", n: "02" },
              { ko: "초코 말랑", en: "Choco squish", n: "03" },
            ].map((c, i) => (
              <article
                key={i}
                className="marsh-card marsh-press"
                data-reveal
                style={{ "--mh-d": i * 90 } as CSSProperties}
              >
                <span className="marsh-card__n">{c.n}</span>
                <span className="marsh-card__en">{c.en}</span>
                <span className="marsh-card__ko" lang="ko">{c.ko}</span>
              </article>
            ))}
          </section>

          <section className="marsh-lead" data-reveal>
            <p className="marsh-lead__p">
              <span lang="ko">
                우리는 구움이 아니라 폭신함을 만든다. 손에 닿으면 찌릿하고,
                놓으면 도로 부풀어 오르는 — 말랑한 한 입.
              </span>{" "}
              We don't bake — we puff. Soft to the touch, it yields when pressed
              and puffs back when let go: one squishy bite.
            </p>
          </section>
        </main>

        <footer className="marsh-foot">
          <span>MARSH · 2026</span>
          <span lang="ko">마쉬 — 서울</span>
        </footer>
      </div>
    </div>
  );
}
