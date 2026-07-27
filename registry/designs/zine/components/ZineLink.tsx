"use client";

import type { AnchorHTMLAttributes, ReactNode } from "react";

type ZineLinkProps = {
  href: string;
  children: ReactNode;
} & AnchorHTMLAttributes<HTMLAnchorElement>;

/**
 * A zine link with a highlighter-stroke underline.
 *
 * The affordance is always present (touch and reduced-motion users never
 * lose it): a 2px ink underline at low opacity beneath the text. On hover
 * or :focus-visible a highlighter-yellow bar slides in beneath the text
 * (scaleX 0 → 1) with a slight rotational wobble — like a marker pass on
 * newsprint. Pure CSS: works without JavaScript, and under
 * prefers-reduced-motion the highlighter is simply present (not drawn).
 *
 * This is deliberately distinct from the editorial-serif sibling's
 * ink-stroke draw: a zine underlines with a highlighter, not a pen.
 */
export default function ZineLink({
  href,
  children,
  className,
  ...rest
}: ZineLinkProps) {
  return (
    <a
      href={href}
      className={`zine-link${className ? ` ${className}` : ""}`}
      {...rest}
    >
      <span className="zine-link__text">{children}</span>
      <span className="zine-link__hl" aria-hidden="true" />
    </a>
  );
}
