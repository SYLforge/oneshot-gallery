"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useStickerPhysics } from "../hooks/useStickerPhysics";

type StickerDef = {
  id: string;
  label: string;
  className: string;
  rot: string;
  art: ReactNode;
};

/**
 * Every sticker is CSS/SVG — no images. Colors come from the sticker palette
 * tokens; the 3px ink outline and offset solid shadow make each one read as a
 * peel-off die-cut sticker, not a colored box. Ink text on every saturated
 * fill is the universal AA pattern (6.1:1–10.7:1 across the palette).
 */
const STICKERS: StickerDef[] = [
  {
    id: "logo",
    label: "스티커 스튜디오 로고 sticker. The studio's own logo sticker.",
    className: "sticker-sticker--tangerine sticker-sticker--logo",
    rot: "-6deg",
    art: (
      <span className="sticker-logoart" aria-hidden="true">
        <span lang="ko" className="sticker-logoart__ko">
          스티커
        </span>
        <span className="sticker-logoart__en">studio</span>
      </span>
    ),
  },
  {
    id: "ok",
    label: "괜찮아 도장 sticker. An OK stamp sticker.",
    className: "sticker-sticker--lime sticker-sticker--stamp",
    rot: "8deg",
    art: (
      <span className="sticker-stampart" aria-hidden="true">
        <span lang="ko">괜찮아</span>
        <span className="sticker-stampart__en">it&apos;s ok!</span>
      </span>
    ),
  },
  {
    id: "secret",
    label: "비밀 sticker. A pink SECRET sticker.",
    className: "sticker-sticker--bubble sticker-sticker--secret",
    rot: "-10deg",
    art: (
      <span className="sticker-secret" aria-hidden="true">
        <span lang="ko" className="sticker-secret__ko">
          비밀
        </span>
        <span className="sticker-secret__en">top secret</span>
      </span>
    ),
  },
  {
    id: "star",
    label: "별 다섯 개 sticker. A five-star rating sticker.",
    className: "sticker-sticker--lemon sticker-sticker--rating",
    rot: "5deg",
    art: (
      <span className="sticker-rating" aria-hidden="true">
        ★★★★★
        <span className="sticker-rating__cap">5 / 5 · 좋아!</span>
      </span>
    ),
  },
  {
    id: "note",
    label: "메모지 sticker. A handwritten note sticker.",
    className: "sticker-sticker--paper sticker-sticker--note",
    rot: "-4deg",
    art: (
      <span className="sticker-note" aria-hidden="true">
        <span className="sticker-note__tape" />
        <span lang="ko" className="sticker-note__ko">
          오늘의 할 일: 웹사이트를 스티커로 만들기
        </span>
        <span className="sticker-note__en">today: make the site a sticker</span>
      </span>
    ),
  },
  {
    id: "coffee",
    label: "커피 한 잔 sticker. A coffee-cup sticker.",
    className: "sticker-sticker--tangerine sticker-sticker--cup",
    rot: "11deg",
    art: (
      <svg viewBox="0 0 80 80" width="84" height="84" aria-hidden="true" focusable="false">
        <path
          d="M16 26 H56 V52 A8 8 0 0 1 48 60 H24 A8 8 0 0 1 16 52 Z"
          fill="var(--sticker-tangerine)"
          stroke="var(--sticker-ink)"
          strokeWidth="4"
          strokeLinejoin="round"
        />
        <path
          d="M56 30 H62 A8 8 0 0 1 62 46 H56"
          fill="none"
          stroke="var(--sticker-ink)"
          strokeWidth="4"
        />
        <path
          d="M28 14 Q26 20 30 24"
          fill="none"
          stroke="var(--sticker-ink)"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M40 12 Q38 18 42 22"
          fill="none"
          stroke="var(--sticker-ink)"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    id: "arrow",
    label: "여기 arrow sticker. A hand-drawn THIS-WAY arrow.",
    className: "sticker-sticker--sky sticker-sticker--arrow",
    rot: "-7deg",
    art: (
      <svg viewBox="0 0 130 56" width="124" height="53" aria-hidden="true" focusable="false">
        <path
          d="M6 20 H86 V6 L124 28 L86 50 V36 H6 Z"
          fill="var(--sticker-sky)"
          stroke="var(--sticker-ink)"
          strokeWidth="4"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    id: "grape-burst",
    label: "완료 sticker. A grape DONE burst.",
    className: "sticker-sticker--grape sticker-sticker--done",
    rot: "9deg",
    art: (
      <span className="sticker-done" aria-hidden="true">
        <span lang="ko" className="sticker-done__ko">
          완료
        </span>
        <span className="sticker-done__en">DONE!</span>
      </span>
    ),
  },
  {
    id: "heart",
    label: "분홍 하트 sticker. A pink heart sticker.",
    className: "sticker-sticker--bubble sticker-sticker--heart",
    rot: "-3deg",
    art: (
      <svg viewBox="0 0 64 56" width="72" height="63" aria-hidden="true" focusable="false">
        <path
          d="M32 52 C4 34 4 12 18 8 C26 6 32 12 32 20 C32 12 38 6 46 8 C60 12 60 34 32 52 Z"
          fill="var(--sticker-bubble)"
          stroke="var(--sticker-ink)"
          strokeWidth="4"
          strokeLinejoin="round"
        />
        <text x="32" y="34" textAnchor="middle" className="sticker-heart__txt" lang="ko">
          좋아
        </text>
      </svg>
    ),
  },
  {
    id: "barcode",
    label: "바코드 sticker. A barcode sticker.",
    className: "sticker-sticker--paper sticker-sticker--barcode",
    rot: "6deg",
    art: (
      <svg viewBox="0 0 120 56" width="116" height="54" aria-hidden="true" focusable="false">
        <rect width="120" height="56" fill="var(--sticker-paper)" stroke="var(--sticker-ink)" strokeWidth="3" />
        <g fill="var(--sticker-ink)">
          <rect x="10" y="8" width="3" height="32" />
          <rect x="16" y="8" width="2" height="32" />
          <rect x="21" y="8" width="5" height="32" />
          <rect x="29" y="8" width="2" height="32" />
          <rect x="34" y="8" width="4" height="32" />
          <rect x="41" y="8" width="2" height="32" />
          <rect x="47" y="8" width="6" height="32" />
          <rect x="56" y="8" width="3" height="32" />
          <rect x="62" y="8" width="2" height="32" />
          <rect x="68" y="8" width="5" height="32" />
          <rect x="76" y="8" width="2" height="32" />
          <rect x="81" y="8" width="4" height="32" />
          <rect x="88" y="8" width="2" height="32" />
          <rect x="93" y="8" width="6" height="32" />
          <rect x="102" y="8" width="3" height="32" />
          <rect x="108" y="8" width="2" height="32" />
        </g>
        <text x="60" y="50" textAnchor="middle" className="sticker-barcode__digits">
          STKR · 2026 · 서울
        </text>
      </svg>
    ),
  },
  {
    id: "hi",
    label: "안녕 sticker. A speech-bubble HI sticker.",
    className: "sticker-sticker--lime sticker-sticker--bubble-hi",
    rot: "-8deg",
    art: (
      <span className="sticker-hi" aria-hidden="true">
        <span lang="ko" className="sticker-hi__ko">
          안녕!
        </span>
        <span className="sticker-hi__en">hi, we make stickers</span>
        <span className="sticker-hi__tail" />
      </span>
    ),
  },
];

/**
 * Section 02 — the work table. A bordered desk scattered with draggable
 * stickers, all CSS/SVG (no images), wired to useStickerPhysics. Grab one,
 * fling it: it springs back home with a bouncy wobble, or shoves its
 * neighbors into a pile if you drop it on them.
 *
 * Physics state is a DELTA from the CSS-scattered base position, so with
 * JavaScript disabled the board shows the same pile, just still — the JS
 * only ever writes style.transform. React renders the shells exactly once.
 *
 * Keyboard: every sticker is focusable; arrows nudge 10px (and the spring
 * pulls it home), Enter/Space brings it to the top of the pile. Reduced
 * motion: every release is a placement — no glide, no spin, no nudge.
 */
export default function StickerBoard() {
  const physics = useStickerPhysics();
  const boardRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const detach = physics.attach(boardRef.current);
    return detach;
  }, [physics]);

  return (
    <section
      className="sticker-section sticker-boardzone"
      id="sticker-board"
      aria-labelledby="sticker-board-title"
    >
      <div className="sticker-sechead" data-sticker-reveal>
        <span className="sticker-sechead__no" aria-hidden="true">
          01
        </span>
        <h2 className="sticker-sechead__title" id="sticker-board-title">
          <span lang="ko">스티커 작업대</span>{" "}
          <span className="sticker-sechead__titleen">THE STICKER TABLE</span>
        </h2>
        <p className="sticker-sechead__note">
          <span lang="ko">잡고 던져 보세요.</span> GRAB &amp; FLING.
        </p>
      </div>

      <p className="sticker-vh" id="sticker-board-hint">
        Arrow keys nudge a sticker 10 pixels, then it springs home. Enter or
        Space brings it to the top of the pile. 방향키로 스티커를 10픽셀씩
        밀면 제자리로 통통 튀어 돌아오고, 엔터나 스페이스로 맨 위에 올립니다.
      </p>

      <div
        className="sticker-board"
        ref={boardRef}
        role="group"
        aria-label="Sticker table — drag the stickers, or focus one and use arrow keys. 스티커 작업대 — 끌거나, 포커스한 뒤 방향키로 밀어 보세요."
      >
        {STICKERS.map((s) => (
          <div
            key={s.id}
            className={`sticker-sticker ${s.className}`}
            style={{ "--sticker-rot": s.rot } as React.CSSProperties}
            role="button"
            tabIndex={0}
            aria-roledescription="draggable sticker"
            aria-label={s.label}
            aria-describedby="sticker-board-hint"
          >
            {s.art}
          </div>
        ))}
      </div>

      <p className="sticker-board__caption" data-sticker-reveal>
        <span lang="ko">던져도 제자리로 돌아와요.</span>{" "}
        FLING THEM — THEY ALWAYS COME HOME.
      </p>
    </section>
  );
}
