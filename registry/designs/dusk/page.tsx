"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import "./styles.css";
import { playfairDisplay, notoSerifKR } from "./fonts";
import { useReveal } from "./hooks/useReveal";
import { usePrefersReducedMotion } from "./hooks/usePrefersReducedMotion";

const TITLE = "DUSK";

/**
 * DUSK 황혼 — between day and night, a cinematic dusk. The signature is a
 * scroll-driven sunset: a layered gradient sky (peach → coral → violet →
 * indigo) holds a silhouetted horizon at its base, and a radial sun-glow
 * descends as the page is scrolled (a --dk-scrub value, 0 → 1, read off
 * scroll progress). A faint pointer parallax tilts the horizon a hair. The
 * wordmark is Playfair Display 900 italic with a peach-to-coral clip-text
 * gradient and a sunset glow; black letterbox bars frame the frame.
 *
 * `.dusk-js` is added on mount so the no-JS markup is the finished page:
 * the sky stands at a fixed dusk, copy is readable, the sun holds.
 */
export default function DuskPage() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const reduced = usePrefersReducedMotion();
  const revealRef = useReveal<HTMLDivElement>();
  const horizonRef = useRef<HTMLDivElement | null>(null);
  const sunRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    root.classList.add("dusk-js");
    const id = requestAnimationFrame(() => root.classList.add("is-mounted"));
    window.parent?.postMessage({ type: "oneshot:ready", slug: "dusk" }, "*");
    return () => cancelAnimationFrame(id);
  }, []);

  // scroll-scrub: read scroll progress over the document, NaN/clamped-safe,
  // and drive the sun's vertical descent via a CSS var. Pinned-style feel:
  // the sun is fixed to the viewport and falls as you read.
  useEffect(() => {
    if (reduced) return;
    const sun = sunRef.current;
    if (!sun) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const doc = document.documentElement;
      const max = Math.max(1, doc.scrollHeight - window.innerHeight);
      const y = window.scrollY || window.pageYOffset || 0;
      let p = y / max;
      if (!Number.isFinite(p)) p = 0;
      p = Math.max(0, Math.min(1, p));
      // sun falls from 18% (just above horizon glow) down to 80% of the sky.
      const sunY = 18 + p * 62;
      sun.style.setProperty("--dk-sun", `${sunY.toFixed(2)}%`);
      sun.style.setProperty("--dk-scrub", p.toFixed(4));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [reduced]);

  // Pointer parallax: the silhouette horizon drifts slightly with the cursor.
  // NaN-safe; reduced motion leaves it still.
  useEffect(() => {
    if (reduced) return;
    const horizon = horizonRef.current;
    if (!horizon) return;
    let raf = 0;
    const cur = { x: 0, tx: 0 };
    const onMove = (e: PointerEvent) => {
      const x = (e.clientX / Math.max(1, window.innerWidth)) - 0.5;
      if (!Number.isFinite(x)) return;
      cur.tx = x * 16;
    };
    const tick = () => {
      raf = requestAnimationFrame(tick);
      cur.x += (cur.tx - cur.x) * 0.06;
      horizon.style.setProperty("--dk-px", `${cur.x.toFixed(2)}px`);
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
      className={`${playfairDisplay.variable} ${notoSerifKR.variable} dusk-root`}
    >
      <div className="dusk-bar dusk-bar--top" aria-hidden="true" />
      <div className="dusk-bar dusk-bar--bottom" aria-hidden="true" />

      <div className="dusk-sky" aria-hidden="true">
        <div ref={sunRef} className="dusk-sun" />
        <div className="dusk-haze" />
      </div>
      <div ref={horizonRef} className="dusk-horizon" aria-hidden="true" />

      <div ref={revealRef} className="dusk-doc">
        <header className="dusk-hero">
          <p className="dusk-kicker">
            <span lang="ko">낮과 밤 사이</span> · BETWEEN DAY AND NIGHT · A FILM BY DUSK
          </p>
          <h1 className="dusk-title" aria-label={TITLE}>
            {TITLE.split("").map((ch, i) => (
              <span
                key={i}
                aria-hidden="true"
                className="dusk-glyph"
                style={{ "--dk-i": i } as CSSProperties}
              >
                {ch}
              </span>
            ))}
          </h1>
          <p className="dusk-title__ko" lang="ko">황혼</p>
          <p className="dusk-sub">
            <span lang="ko">해가 지고, 빛이 길어지는 그 한 시간.</span>{" "}
            The hour the sun goes down and the light grows long.
          </p>
          <p className="dusk-hint" lang="ko">스크롤하면 해가 집니다.</p>
        </header>

        <main>
          <section className="dusk-act" data-reveal>
            <span className="dusk-act__n">ACT I</span>
            <p className="dusk-act__p">
              <span lang="ko">
                황혼은 색이 아니다. 빛이 대기를 두 번 지나가며 남기는, 하루의 마지막
                숨이다. 우리는 그 숨이 길어지는 시간을 위해 화면을 넓히고, 위아래를
                검은 줄로 가둔다.
              </span>{" "}
              Dusk is not a colour. It is the last breath of the day, left as
                light crosses the atmosphere twice. For the hour that breath
                lengthens, we widen the screen and frame it in black.
            </p>
          </section>

          <section className="dusk-cards">
            {[
              { ko: "첫 빛", en: "Golden", n: "18:24" },
              { ko: "산호빛", en: "Coral", n: "19:02" },
              { ko: "보랏빛", en: "Violet", n: "19:31" },
              { ko: "남색", en: "Indigo", n: "20:10" },
            ].map((c, i) => (
              <article
                key={i}
                className="dk-card"
                data-reveal
                style={{ "--dk-d": i * 90 } as CSSProperties}
              >
                <span className="dk-card__n">{c.n}</span>
                <span className="dk-card__en">{c.en}</span>
                <span className="dk-card__ko" lang="ko">{c.ko}</span>
              </article>
            ))}
          </section>

          <section className="dusk-quote" data-reveal>
            <p className="dusk-quote__p" lang="ko">
              &ldquo;낮이 끝나는 것이 아니라, 빛이 다른 이름으로 돌아오는 것.&rdquo;
            </p>
            <span className="dusk-quote__by">— DUSK, 2026</span>
          </section>
        </main>

        <footer className="dusk-foot">
          <span>DUSK · 2026</span>
          <span lang="ko">황혼 — 부산 다대포</span>
        </footer>
      </div>
    </div>
  );
}
