"use client";

import { useEffect, useRef, useState } from "react";

const DEFAULT_CLASS =
  "border border-hairline px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.15em] text-muted transition-colors duration-200 ease-out hover:border-accent/60 hover:text-text";

/**
 * Copies `text` to the clipboard; the label swaps to `copiedLabel`
 * for 1.5s afterwards.
 */
export default function CopyButton({
  text,
  label,
  copiedLabel,
  className,
}: {
  text: string;
  label: string;
  copiedLabel: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (timer.current !== null) window.clearTimeout(timer.current);
    },
    [],
  );

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      return; // clipboard unavailable — keep the resting label
    }
    setCopied(true);
    if (timer.current !== null) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(false), 1500);
  };

  return (
    <button
      type="button"
      onClick={copy}
      data-copied={copied || undefined}
      className={className ?? DEFAULT_CLASS}
    >
      <span aria-live="polite">{copied ? copiedLabel : label}</span>
    </button>
  );
}
