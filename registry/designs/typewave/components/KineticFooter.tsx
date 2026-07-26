"use client";

import { useEffect, useRef } from "react";
import SplitText from "./SplitText";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

const CLOSER = "PLAY IT AGAIN";

/**
 * The closer. A final giant kinetic wordmark — "PLAY IT AGAIN" — that
 * stretches across the viewport at full width (wdth 125, the widest the
 * axis goes) and reveals glyph-by-glyph on enter (char-split, aria-safe,
 * the same vocabulary as the hero, so the page opens and closes on the
 * same gesture). Below it, a real bilingual credit + legal footer: the
 * fictional label, the engineer's note, the type license, the MIT code
 * line.
 *
 * The wordmark rests at its widest (the morph's terminal state) and only
 * animates its entrance — the page ends on a held, resolved chord, not
 * another loop. Reduced motion / no-JS: the word is simply there, fully
 * styled, at its final width.
 */
export default function KineticFooter() {
  const footRef = useRef<HTMLElement | null>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const foot = footRef.current;
    if (!foot) return;
    // Reveal the closer wordmark when the footer enters.
    if (reduced || !("IntersectionObserver" in window)) {
      foot.classList.add("is-on");
      return;
    }
    const io = new IntersectionObserver(
      (hits) => {
        for (const hit of hits) {
          if (hit.isIntersecting) {
            foot.classList.add("is-on");
            io.disconnect();
          }
        }
      },
      { threshold: 0.25 },
    );
    io.observe(foot);
    return () => io.disconnect();
  }, [reduced]);

  return (
    <footer
      ref={footRef}
      className="typewave-footer"
      aria-labelledby="typewave-closer"
    >
      <div className="typewave-frame typewave-footer__inner">
        <p className="typewave-footer__kicker typewave-mono">
          <span>side b · end of track</span>
          <span lang="ko">B면 · 트랙의 끝</span>
        </p>

        <h2
          className="typewave-footer__word"
          id="typewave-closer"
          aria-label={CLOSER}
        >
          <SplitText text={CLOSER} />
        </h2>
        <p className="typewave-footer__wordko" lang="ko">
          다시 재생
        </p>

        <div className="typewave-footer__cols">
          <section className="typewave-footer__block">
            <h3 className="typewave-footer__h">Label · 레이블</h3>
            <p>
              Released on ACID TYPE RECORDINGS — a fictional imprint for type
              that wants to be heard.
              <span lang="ko">
                ACID TYPE RECORDINGS에서 발매 — 들리고 싶은 타이포를 위한 가상의
                레이블.
              </span>
            </p>
          </section>
          <section className="typewave-footer__block">
            <h3 className="typewave-footer__h">Engineering · 엔지니어링</h3>
            <p>
              Built with one variable font, one accent, and zero dependencies.
              Every waveform on this page is a letter being moved.
              <span lang="ko">
                가변 폰트 하나, 액센트 하나, 의존성 없이. 이 페이지의 모든 파형은
                움직이는 글자다.
              </span>
            </p>
          </section>
          <section className="typewave-footer__block">
            <h3 className="typewave-footer__h">Type · 서체</h3>
            <p>
              Archivo (OFL), Black Han Sans (OFL), Noto Sans KR (OFL), Space
              Mono (OFL) via next/font. Korean is first-class, never a gloss.
              <span lang="ko">
                Archivo, Black Han Sans, Noto Sans KR, Space Mono — 모두 OFL.
                next/font로 불러옴. 한국어는 번역이 아니라 본래의 목소리다.
              </span>
            </p>
          </section>
        </div>

        <p className="typewave-footer__legal typewave-mono">
          <span>© 2026 TYPEWAVE — MIT code · all type set in motion</span>
          <span lang="ko">© 2026 타입웨이브 — MIT 코드 · 모든 타이포가 움직인다</span>
        </p>
      </div>
    </footer>
  );
}
