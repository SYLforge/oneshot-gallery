"use client";

import { useEffect, useRef, type ReactNode } from "react";
import "../styles.css";

/**
 * The client shell for the STICKER page. Holds the only client-only side
 * effect — adding `.sticker-js` to the root on mount (the CSS-only signal
 * that JS is alive, gating pre-reveal states) and posting `oneshot:ready`.
 *
 * Keeping this in its own client component lets the page itself stay a server
 * component, so `./styles.css` is hoisted into the layout chunk (a Next 16
 * Turbopack quirk dropped the CSS chunk when the whole page was a dynamic-
 * import client component).
 */
export default function StickerShell({
  children,
  className,
}: {
  children: ReactNode;
  className: string;
}) {
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    rootRef.current?.classList.add("sticker-js");
    window.parent?.postMessage({ type: "oneshot:ready", slug: "sticker" }, "*");
  }, []);

  return (
    <div ref={rootRef} className={className}>
      {children}
    </div>
  );
}
