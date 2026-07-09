"use client";

import {
  useCallback,
  useRef,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";

type Props = {
  className?: string;
  children: ReactNode;
};

/**
 * The specular glass primitive. A backdrop-filter panel whose highlight — a
 * radial gradient on the ::spec layer — tracks the pointer through two custom
 * properties written straight to the element (no React state, no re-render
 * per move). With no pointer (touch, keyboard, SSR) the highlight rests at
 * its default position near the top center, at reduced strength: the panel
 * still reads as lit glass, it just is not following anyone.
 */
export default function GlassPanel({ className, children }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);

  const onPointerMove = useCallback(
    (ev: ReactPointerEvent<HTMLDivElement>) => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const x = ((ev.clientX - r.left) / r.width) * 100;
      const y = ((ev.clientY - r.top) / r.height) * 100;
      el.style.setProperty("--lumen-gx", `${x.toFixed(2)}%`);
      el.style.setProperty("--lumen-gy", `${y.toFixed(2)}%`);
      el.style.setProperty("--lumen-gs", "1");
    },
    [],
  );

  const onPointerLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.removeProperty("--lumen-gx");
    el.style.removeProperty("--lumen-gy");
    el.style.removeProperty("--lumen-gs");
  }, []);

  return (
    <div
      ref={ref}
      className={`lumen-glass${className ? ` ${className}` : ""}`}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      <div className="lumen-glass__spec" aria-hidden="true" />
      <div className="lumen-glass__body">{children}</div>
    </div>
  );
}
