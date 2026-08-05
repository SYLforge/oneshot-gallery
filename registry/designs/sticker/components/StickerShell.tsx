"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * The client shell for the STICKER page. Holds the only client-only side
 * effect — adding `.sticker-js` to the root on mount and posting
 * `oneshot:ready`. The page's stylesheet is imported at the demo route level
 * (app/(demo)/view/[slug]/page.tsx) because Next 16 Turbopack drops this
 * entry's CSS chunk on client dynamic import.
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
