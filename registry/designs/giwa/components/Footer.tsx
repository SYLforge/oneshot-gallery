"use client";

import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

/**
 * Section 05 — the guild's sign-off, with a norigae-style tassel hanging
 * from the closing rule. Scrolling gives the tassel a small angular
 * impulse; a damped pendulum (θ″ = −kθ − cω) swings it back to rest.
 * Transform-only, rAF-driven, parked while offscreen and by the time it
 * settles; perfectly still under reduced motion.
 */

function Tassel() {
  return (
    <svg
      className="giwa-tassel__svg"
      viewBox="0 0 64 190"
      role="img"
      aria-label="노리개 — 매듭과 방울, 다섯 가닥 술로 이루어진 드리개. A norigae pendant: knot, bell, and five tassel strands."
    >
      <path className="giwa-s-ink2" d="M32 0 L32 18" fill="none" />
      <path
        className="giwa-s-knot-seok giwa-round"
        d="M32 16 L44 28 L32 40 L20 28 Z"
        fill="none"
      />
      <path
        className="giwa-s-knot-sam giwa-round"
        d="M32 30 L42 40 L32 50 L22 40 Z"
        fill="none"
      />
      <circle className="giwa-f-hwang giwa-s-ink2" cx={32} cy={68} r={15} />
      <rect
        className="giwa-f-seok giwa-s-ink"
        x={16}
        y={64}
        width={32}
        height={8}
        rx={2}
      />
      <circle className="giwa-f-baek" cx={32} cy={68} r={1.7} />
      <path
        className="giwa-f-sam giwa-s-ink"
        d="M23 84 L41 84 L44 96 L20 96 Z"
      />
      <path className="giwa-s-baek" d="M22 90 L42 90" fill="none" />
      {[22, 27, 32, 37, 42].map((x, i) => (
        <path
          key={x}
          className={x === 32 ? "giwa-s-strand-sam" : "giwa-s-strand-seok"}
          d={`M${x} 97 C ${x - 3} 125, ${x + 3} 155, ${x + (i % 2 === 0 ? -2 : 2)} 182`}
          fill="none"
        />
      ))}
    </svg>
  );
}

export default function GuildFooter() {
  const reduced = usePrefersReducedMotion();
  const sectionRef = useRef<HTMLElement | null>(null);
  const swingRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const swing = swingRef.current;
    if (!section || !swing || reduced) return;

    const K = 16; // stiffness — ~0.64 Hz natural swing
    const C = 2.1; // damping — settles in a few beats
    let theta = 0;
    let omega = 0;
    let raf = 0;
    let running = false;
    let visible = false;
    let last = 0;
    let lastY = window.scrollY;

    const loop = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.048);
      last = now;
      theta += omega * dt;
      omega += (-K * theta - C * omega) * dt;
      theta = Math.max(-0.24, Math.min(0.24, theta));
      swing.style.transform = `rotate(${(theta * 57.2958).toFixed(3)}deg)`;
      if (Math.abs(theta) < 0.0015 && Math.abs(omega) < 0.003) {
        swing.style.transform = "rotate(0deg)";
        running = false;
        return;
      }
      raf = window.requestAnimationFrame(loop);
    };

    const wake = () => {
      if (running) return;
      running = true;
      last = performance.now();
      raf = window.requestAnimationFrame(loop);
    };

    const onScroll = () => {
      const y = window.scrollY;
      const dy = y - lastY;
      lastY = y;
      if (!visible || dy === 0) return;
      omega += Math.max(-0.9, Math.min(0.9, dy * 0.011));
      wake();
    };

    const io = new IntersectionObserver(
      (hits) => {
        visible = hits.some((h) => h.isIntersecting);
        if (!visible) {
          window.cancelAnimationFrame(raf);
          running = false;
        }
      },
      { rootMargin: "80px" },
    );
    io.observe(section);
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.cancelAnimationFrame(raf);
    };
  }, [reduced]);

  return (
    <footer className="giwa-footer" ref={sectionRef}>
      <div className="giwa-footer__rule" aria-hidden="true" />
      <div className="giwa-tassel" ref={swingRef}>
        <Tassel />
      </div>

      <div className="giwa-footer__inner">
        <p className="giwa-footer__line" data-reveal>
          오늘도 처마 밑에서 단청은 마르고 있다.
        </p>
        <p className="giwa-footer__line-en" lang="en" data-reveal>
          Under the eaves, the paint is drying still.
        </p>

        <dl className="giwa-footer__data" data-reveal>
          <div>
            <dt>공방</dt>
            <dd>
              GIWA — 궁궐 처마 복원공방 ·{" "}
              <span lang="en">palace-eave restoration guild</span>
            </dd>
          </div>
          <div>
            <dt>계보</dt>
            <dd>
              도채장의 법식을 따른다 · 가칠, 출초, 채색, 먹기화 — 순서는
              바뀌지 않는다
            </dd>
          </div>
          <div>
            <dt>기록</dt>
            <dd>
              단청도감 제八호 — 처마 아래 다섯 빛깔 ·{" "}
              <a className="giwa-link" href="mailto:eaves@giwa.example">
                eaves@giwa.example
              </a>
            </dd>
          </div>
        </dl>

        <p className="giwa-footer__copy" data-reveal>
          © 2026 GIWA — 처마 밑의 다섯 빛깔.{" "}
          <span lang="en">Five colors under the eaves.</span>
        </p>
      </div>
    </footer>
  );
}
