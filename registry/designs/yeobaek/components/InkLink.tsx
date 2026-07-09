"use client";

import type { AnchorHTMLAttributes, ReactNode } from "react";

type InkLinkProps = {
  href: string;
  children: ReactNode;
} & AnchorHTMLAttributes<HTMLAnchorElement>;

/**
 * A journal link with the rubber-band underline draw.
 *
 * Anatomy: the text sits over a static graphite hairline (always present —
 * touch and reduced-motion users never lose the affordance), and an inline
 * SVG carries a slightly wobbled oxblood path with pathLength=1. On hover
 * or :focus-visible, CSS transitions stroke-dashoffset 1 → 0 through an
 * overshooting bezier, so the ink draws across and snaps taut like a
 * rubber band. Pure CSS — it works without JavaScript, and under
 * prefers-reduced-motion the oxblood stroke is simply present, undrawn.
 */
export default function InkLink({
  href,
  children,
  className,
  ...rest
}: InkLinkProps) {
  return (
    <a
      href={href}
      className={`yeobaek-link${className ? ` ${className}` : ""}`}
      {...rest}
    >
      <span className="yeobaek-link__text">{children}</span>
      <svg
        className="yeobaek-link__ink"
        viewBox="0 0 160 8"
        preserveAspectRatio="none"
        aria-hidden="true"
        focusable="false"
      >
        <path
          d="M 2 5.4 C 26 3.4, 54 6.8, 82 4.6 S 134 5.8, 158 3.8"
          pathLength={1}
        />
      </svg>
    </a>
  );
}
