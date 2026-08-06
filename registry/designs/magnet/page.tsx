"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import "./styles.css";
import { archivoBlack, notoSansKR } from "./fonts";
import { useReveal } from "./hooks/useReveal";
import { usePrefersReducedMotion } from "./hooks/usePrefersReducedMotion";

const TITLE = "MAGNET";

/**
 * MAGNET 마그넷 — things that pull. The signature is the magnetic field: as
 * the pointer moves, every glyph in the wordmark and every magnetic pill
 * button computes its distance to the cursor and, within a radius, translates
 * toward it (damped in a rAF spring). Leave the field and everything eases
 * back to rest. Under reduced motion the field is inert — everything sits.
 *
 * `.magnet-js` is added on mount so the no-JS markup is the finished page:
 * wordmark and buttons at rest, copy readable.
 */
export default function MagnetPage() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const fieldRef = useRef<HTMLDivElement | null>(null);
  const reduced = usePrefersReducedMotion();
  const revealRef = useReveal<HTMLDivElement>();

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    root.classList.add("magnet-js");
    const id = requestAnimationFrame(() => root.classList.add("is-mounted"));
    window.parent?.postMessage({ type: "oneshot:ready", slug: "magnet" }, "*");
    return () => cancelAnimationFrame(id);
  }, []);

  // Magnetic field. Each [data-magnet] element tracks the pointer and, within
  // RADIUS, translates toward it by STRENGTH of the offset. Damped per-frame.
  useEffect(() => {
    const field = fieldRef.current;
    if (!field || reduced) return;
    const els = Array.from(
      field.querySelectorAll<HTMLElement>("[data-magnet]"),
    );
    if (els.length === 0) return;

    const RADIUS = 160; // px — the reach of the field
    const STRENGTH = 0.32; // 0..1 — how far it pulls (0.32 = 32% of offset)

    const state = els.map((el) => ({
      el,
      tx: 0,
      ty: 0,
      cx: 0,
      cy: 0,
    }));

    let raf = 0;
    let active = false;

    const onMove = (e: PointerEvent) => {
      active = true;
      for (const s of state) {
        const r = s.el.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        const dx = e.clientX - cx;
        const dy = e.clientY - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (!Number.isFinite(dist)) continue;
        if (dist < RADIUS) {
          // falloff: strongest at center, zero at the edge of the field
          const fall = 1 - dist / RADIUS;
          const f = Math.max(0, Math.min(1, fall));
          s.tx = dx * STRENGTH * f;
          s.ty = dy * STRENGTH * f;
        } else {
          s.tx = 0;
          s.ty = 0;
        }
      }
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const onLeave = () => {
      active = false;
      for (const s of state) {
        s.tx = 0;
        s.ty = 0;
      }
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const tick = () => {
      let moving = false;
      for (const s of state) {
        s.cx += (s.tx - s.cx) * 0.18;
        s.cy += (s.ty - s.cy) * 0.18;
        if (!Number.isFinite(s.cx)) s.cx = 0;
        if (!Number.isFinite(s.cy)) s.cy = 0;
        s.el.style.setProperty("--mg-x", `${s.cx.toFixed(2)}px`);
        s.el.style.setProperty("--mg-y", `${s.cy.toFixed(2)}px`);
        if (Math.abs(s.tx - s.cx) > 0.3 || Math.abs(s.ty - s.cy) > 0.3) {
          moving = true;
        }
      }
      if (moving || active) {
        raf = requestAnimationFrame(tick);
      } else {
        raf = 0;
      }
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerout", onLeave, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerout", onLeave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [reduced]);

  return (
    <div
      ref={rootRef}
      className={`${archivoBlack.variable} ${notoSansKR.variable} magnet-root`}
    >
      <div className="mg-blobs" aria-hidden="true" />
      <div ref={revealRef} className="mg-doc">
        <div ref={fieldRef} className="mg-field">
          <header className="mg-hero" data-reveal="">
            <p className="mg-kicker">
              <span lang="ko">마그넷 인터랙션 스튜디오</span> · MAGNETIC STUDIO · move me
            </p>
            <h1 className="mg-title" aria-label={TITLE}>
              <span aria-hidden="true" className="mg-title__row">
                {TITLE.split("").map((ch, i) => (
                  <span
                    key={i}
                    className="magnet-glyph"
                    data-magnet=""
                    style={{ "--mg-i": i } as CSSProperties}
                  >
                    {ch}
                  </span>
                ))}
              </span>
              <span lang="ko" className="mg-title__kr" aria-hidden="true">
                마그넷
              </span>
            </h1>
            <p className="mg-sub" data-reveal="">
              <span lang="ko">끌려오는 것.</span> Things that pull — drift your
              pointer over the letters and buttons; they lean in, then spring
              back when you leave.
            </p>
            <div className="mg-pills" data-reveal="">
              <button type="button" className="mg-pill" data-magnet="">
                <span lang="ko">끌어당김</span> · PULL
              </button>
              <button type="button" className="mg-pill mg-pill--ghost" data-magnet="">
                <span lang="ko">밀어냄</span> · PUSH
              </button>
              <button type="button" className="mg-pill mg-pill--ghost" data-magnet="">
                <span lang="ko">놓아줌</span> · RELEASE
              </button>
            </div>
          </header>
        </div>

        <section className="mg-how" aria-labelledby="mg-how-title">
          <div className="mg-sechead" data-reveal="">
            <p className="mg-eyebrow">
              02 — <span lang="ko">작동</span> · how it pulls
            </p>
            <h2 id="mg-how-title" className="mg-secthead__title">
              the field
            </h2>
            <p className="mg-secthead__kr" lang="ko">
              반경 안에서 끌고, 밖에서 놓아준다.
            </p>
          </div>
          <div className="mg-howgrid">
            <article className="mg-card" data-reveal="">
              <p className="mg-card__no">01</p>
              <h3 className="mg-card__h">
                <span lang="ko">반경</span> radius
              </h3>
              <p className="mg-card__b">
                <span lang="ko">포인터 160px 안에 들면 끌려간다.</span> Inside a
                160px radius, every element feels the pull.
              </p>
            </article>
            <article className="mg-card" data-reveal="">
              <p className="mg-card__no">02</p>
              <h3 className="mg-card__h">
                <span lang="ko">스프링</span> spring
              </h3>
              <p className="mg-card__b">
                <span lang="ko">부드럽게 끌리고, 부드럽게 돌아온다.</span> The
                motion is damped — it eases in and springs back out.
              </p>
            </article>
            <article className="mg-card" data-reveal="">
              <p className="mg-card__no">03</p>
              <h3 className="mg-card__h">
                <span lang="ko">놓아줌</span> release
              </h3>
              <p className="mg-card__b">
                <span lang="ko">벗어나면 제자리로.</span> Leave the field and
                every element returns exactly home.
              </p>
            </article>
          </div>
        </section>

        <footer className="mg-foot" data-reveal="">
          <p className="mg-foot__brand">
            MAGNET <span lang="ko">마그넷</span> ·{" "}
            <span lang="ko">끌려오는 것</span>
          </p>
          <p className="mg-foot__line">
            <span lang="ko">순수 코드 — 이미지 없음.</span> Pure code · no
            images · MIT
          </p>
        </footer>
      </div>
    </div>
  );
}
