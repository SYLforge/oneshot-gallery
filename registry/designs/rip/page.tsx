"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import "./styles.css";
import { inter, notoSansKR } from "./fonts";
import { useReveal } from "./hooks/useReveal";
import { usePrefersReducedMotion } from "./hooks/usePrefersReducedMotion";
import { useScrollProgress } from "./hooks/useScrollProgress";
import { usePointerParallax } from "./hooks/usePointerParallax";

const TITLE = "RIP";

/**
 * RIP — 파문, 잉크 파문 연못. Ink-bloom entry where ink ripples expand
 * from pointer touches on a still pond surface. canvas-particles (the
 * ripple ring system), pointer-parallax (depth layers shift), scroll-scrub-
 * pinned (a verse section where ripples intensify with scroll).
 */
export default function RipPage() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const reduced = usePrefersReducedMotion();
  const revealRef = useReveal<HTMLDivElement>();
  const verseRef = useScrollProgress<HTMLDivElement>(reduced);
  const pondRef = usePointerParallax<HTMLDivElement>(reduced);
  const ripples = useRef<{ x: number; y: number; r: number; life: number }[]>([]);

  useEffect(() => {
    rootRef.current?.classList.add("rip-js");
    window.parent?.postMessage({ type: "oneshot:ready", slug: "rip" }, "*");

    if (reduced) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // ambient auto-ripple every 3s
    const ambient = window.setInterval(() => {
      ripples.current.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: 0,
        life: 1,
      });
    }, 3000);

    let raf = 0;
    const draw = () => {
      raf = requestAnimationFrame(draw);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ripples.current = ripples.current.filter((rp) => rp.life > 0);
      for (const rp of ripples.current) {
        rp.r += 1.5;
        rp.life -= 0.008;
        ctx.beginPath();
        ctx.arc(rp.x, rp.y, rp.r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(124, 58, 237, ${rp.life * 0.5})`;
        ctx.lineWidth = 2;
        ctx.stroke();
        // inner ring
        if (rp.r > 10) {
          ctx.beginPath();
          ctx.arc(rp.x, rp.y, rp.r - 8, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(79, 70, 229, ${rp.life * 0.3})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    };
    raf = requestAnimationFrame(draw);

    const onPointer = (ev: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      ripples.current.push({
        x: ev.clientX - rect.left,
        y: ev.clientY - rect.top,
        r: 0,
        life: 1,
      });
    };
    canvas.addEventListener("pointerdown", onPointer);

    return () => {
      window.clearInterval(ambient);
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(raf);
      canvas.removeEventListener("pointerdown", onPointer);
    };
  }, [reduced]);

  return (
    <div ref={rootRef} className={`${inter.variable} ${notoSansKR.variable} rip-root`}>
      <div ref={revealRef} className="rip-doc">
        <header className="rip-hero">
          <p className="rip-kicker"><span lang="ko">잉크 파문 연못</span> · INK RIPPLE POND</p>
          <h1 className="rip-title" aria-label="RIP 파문">
            {TITLE.split("").map((ch, i) => (
              <span key={i} aria-hidden="true" className="rip-glyph" style={{ "--rip-i": i } as CSSProperties}>{ch}</span>
            ))}
          </h1>
          <p className="rip-title__ko" lang="ko">파문</p>
          <p className="rip-sub"><span lang="ko">손길에 잉크가 퍼진다. 연못을 건드려 보라.</span> Ink ripples from touch. Touch the pond.</p>
        </header>

        {/* canvas-particles: the ripple pond */}
        <section ref={pondRef} className="rip-pond" data-reveal="">
          <canvas ref={canvasRef} className="rip-pond__canvas" aria-label="Interactive ink ripple pond — click to ripple" />
          <p className="rip-pond__hint"><span lang="ko">연못을 클릭하면 잉크가 번진다</span> · click the pond to ripple</p>
        </section>

        {/* scroll-scrub-pinned: the verse */}
        <section ref={verseRef} className="rip-verse" data-reveal="">
          <p className="rip-verse__line" lang="ko">한 방울이 떨어지면</p>
          <p className="rip-verse__line" lang="ko">연못 전체가 응답한다</p>
          <p className="rip-verse__en"><em>One drop falls — the whole pond answers.</em></p>
        </section>

        <footer className="rip-foot" data-reveal="">
          <p>© 2026 RIP · <span lang="ko">파문</span> · MIT</p>
          <p><span lang="ko">잔잔 — 코드로 그렸다.</span> still water — drawn in code.</p>
        </footer>
      </div>
    </div>
  );
}
