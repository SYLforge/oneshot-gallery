"use client";

import { useRef, useState } from "react";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

const FLASH_MS = 260; // 120ms flash + settle margin before the class drops

/**
 * Section 05 — footer on graphite, plus the e-ink flourish.
 *
 * The reading-mode toggle (light ↔ sepia) swaps the page's paper tokens
 * via data-mode on .slate-root, and — like a real e-paper page turn —
 * fires a 120ms full-invert flash: a hard-cut filter:invert(1) keyframe
 * on the root, no easing, because e-ink does not fade. The flash is
 * skipped entirely under prefers-reduced-motion (both here and by the
 * media query backstop in styles.css); the mode still switches instantly.
 */
export default function SlateFooter() {
  const [sepia, setSepia] = useState(false);
  const footerRef = useRef<HTMLElement | null>(null);
  const reduced = usePrefersReducedMotion();

  const toggleMode = () => {
    const next = !sepia;
    setSepia(next);
    const root = footerRef.current?.closest<HTMLElement>(".slate-root");
    if (!root) return;
    if (next) root.setAttribute("data-mode", "sepia");
    else root.removeAttribute("data-mode");
    if (reduced) return;
    // Rapid re-toggles ride the flash already in flight — real e-paper
    // batches refreshes the same way.
    if (root.classList.contains("is-refreshing")) return;
    root.classList.add("is-refreshing");
    window.setTimeout(() => root.classList.remove("is-refreshing"), FLASH_MS);
  };

  return (
    <footer className="slate-footer" ref={footerRef}>
      <div className="slate-footer__inner">
        <p className="slate-footer__giant">
          The last screen that lets you rest.
          <span lang="ko">쉬게 해주는 마지막 화면.</span>
        </p>

        <div className="slate-footer__mode">
          <p className="slate-footer__modeLabel" id="slate-mode-label">
            Reading mode <span lang="ko">독서 모드</span>
          </p>
          <button
            type="button"
            className="slate-footer__toggle"
            aria-pressed={sepia}
            aria-describedby="slate-mode-label"
            onClick={toggleMode}
          >
            <span
              className={`slate-footer__modeOpt${sepia ? "" : " is-active"}`}
            >
              LIGHT
            </span>
            <span
              className={`slate-footer__modeOpt${sepia ? " is-active" : ""}`}
            >
              SEPIA
            </span>
          </button>
          <p className="slate-footer__modeNote">
            The page refreshes like e-paper — one quiet blink.{" "}
            <span lang="ko">전자잉크처럼, 한 번 조용히 깜빡입니다.</span>
          </p>
        </div>

        <dl className="slate-footer__data">
          <div>
            <dt>Maker</dt>
            <dd>
              Onji Works <span lang="ko">온지 워크스</span> · Seoul
            </dd>
          </div>
          <div>
            <dt>Ships</dt>
            <dd>
              Autumn 2026 <span lang="ko">가을에 예약을 받습니다</span>
            </dd>
          </div>
          <div>
            <dt>Write</dt>
            <dd>
              <a className="slate-footer__link" href="mailto:rest@hanjislate.example">
                rest@hanjislate.example
              </a>
            </dd>
          </div>
        </dl>

        <p className="slate-footer__legal">
          © 2026 Onji Works — HANJI SLATE, the paper computer.{" "}
          <span lang="ko">종이 컴퓨터.</span>
        </p>
      </div>
    </footer>
  );
}
