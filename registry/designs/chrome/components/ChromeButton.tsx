"use client";

import type { ReactNode } from "react";

/**
 * The chrome button — the one object everyone remembers from 2003. A dark
 * chrome-ink band (the "pressed metal" core) with chrome-highlight text on
 * top (14.09:1 — AAA), wrapped in a chrome-silver frame whose top half
 * carries a wet white sheen and whose rim glows a breathing holographic
 * pink. On press the frame squashes a hair (spring-press feel, transform
 * only); on focus the accent halo rings it.
 *
 * Contrast note: the bright accent pink is a FILL (the halo / rim glow),
 * never the text. Text is always chrome-highlight on chrome-ink, so the
 * button is AA-readable in every state.
 */
export default function ChromeButton({
  children,
  href,
  onClick,
  type = "button",
  className = "",
  ariaLabel,
}: {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  className?: string;
  ariaLabel?: string;
}) {
  const cls = `chrome-btn ${className}`.trim();
  const inner = (
    <>
      <span className="chrome-btn__frame" aria-hidden="true">
        <span className="chrome-btn__sheen" aria-hidden="true" />
        <span className="chrome-btn__rim" aria-hidden="true" />
      </span>
      <span className="chrome-btn__label">{children}</span>
    </>
  );

  if (href) {
    return (
      <a href={href} className={cls} aria-label={ariaLabel}>
        {inner}
      </a>
    );
  }
  return (
    <button
      type={type}
      onClick={onClick}
      className={cls}
      aria-label={ariaLabel}
    >
      {inner}
    </button>
  );
}
