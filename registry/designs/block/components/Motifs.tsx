"use client";

/**
 * BLOCK 도형 라이브러리 — 순수 인라인 SVG, 이미지 없음.
 * 네 가지 기하 형태가 시를 상징한다: 네모(square), 세모(triangle),
 * 동그라미(circle), 쌓기(stack), 선(line), 격자(grid). 모두 잉크(#171717)
 * 외곽선 + 콘크리트 바탕이며, neo-brutalist 규칙대로 외곽선은 언제나 3px.
 *
 * 결정론적 — Math.random 없음, SSR과 클라이언트가 동일.
 */

/** 한 변의 네모 — 벽돌. 시 01(구조). */
export function Square({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 64 64"
      width="64"
      height="64"
      focusable="false"
      aria-hidden="true"
    >
      <rect
        x="6"
        y="6"
        width="52"
        height="52"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
      />
      <rect x="6" y="6" width="26" height="26" fill="currentColor" />
    </svg>
  );
}

/** 정삼각형 — 직각의 대척점, 날카로움. 시 07(방법론). */
export function Triangle({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 64 64"
      width="64"
      height="64"
      focusable="false"
      aria-hidden="true"
    >
      <polygon
        points="32,6 58,56 6,56"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinejoin="miter"
      />
      <polygon points="32,20 48,48 16,48" fill="currentColor" />
    </svg>
  );
}

/** 원 — 모서리가 없는 유일한 형태, 무게. 시 08(재료). */
export function Circle({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 64 64"
      width="64"
      height="64"
      focusable="false"
      aria-hidden="true"
    >
      <circle
        cx="32"
        cy="32"
        r="26"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
      />
      <circle cx="32" cy="32" r="11" fill="currentColor" />
    </svg>
  );
}

/** 쌓은 벽돌 — 층이 쌓이는 구조. 시 02, 05(태도/재료). */
export function Stack({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 64 64"
      width="64"
      height="64"
      focusable="false"
      aria-hidden="true"
    >
      <g fill="none" stroke="currentColor" strokeWidth="3">
        <rect x="8" y="10" width="48" height="12" />
        <rect x="8" y="26" width="48" height="12" />
        <rect x="8" y="42" width="48" height="12" />
      </g>
      <g fill="currentColor">
        <rect x="8" y="10" width="24" height="12" />
        <rect x="32" y="26" width="24" height="12" />
        <rect x="8" y="42" width="24" height="12" />
      </g>
    </svg>
  );
}

/** 가로선 3개 — 3px의 법칙. 시 04(방법론). */
export function Line({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 64 64"
      width="64"
      height="64"
      focusable="false"
      aria-hidden="true"
    >
      <g stroke="currentColor" strokeWidth="6" strokeLinecap="butt">
        <line x1="8" y1="16" x2="56" y2="16" />
        <line x1="8" y1="32" x2="56" y2="32" />
        <line x1="8" y1="48" x2="56" y2="48" />
      </g>
    </svg>
  );
}

/** 격자 — 문장이 된 도형들. 시 06(구조). */
export function Grid({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 64 64"
      width="64"
      height="64"
      focusable="false"
      aria-hidden="true"
    >
      <g fill="none" stroke="currentColor" strokeWidth="3">
        <rect x="8" y="8" width="48" height="48" />
        <line x1="8" y1="24" x2="56" y2="24" />
        <line x1="8" y1="40" x2="56" y2="40" />
        <line x1="24" y1="8" x2="24" y2="56" />
        <line x1="40" y1="8" x2="40" y2="56" />
      </g>
      <g fill="currentColor">
        <rect x="8" y="8" width="16" height="16" />
        <rect x="40" y="24" width="16" height="16" />
        <rect x="24" y="40" width="16" height="16" />
      </g>
    </svg>
  );
}

/** motif 문자 → 컴포넌트. PoemFlipGrid에서 쓴다. */
export function Motif({
  motif,
  className,
}: {
  motif: "square" | "triangle" | "circle" | "stack" | "line" | "grid";
  className?: string;
}) {
  switch (motif) {
    case "triangle":
      return <Triangle className={className} />;
    case "circle":
      return <Circle className={className} />;
    case "stack":
      return <Stack className={className} />;
    case "line":
      return <Line className={className} />;
    case "grid":
      return <Grid className={className} />;
    default:
      return <Square className={className} />;
  }
}
