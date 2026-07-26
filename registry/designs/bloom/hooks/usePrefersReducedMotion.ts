"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void): () => void {
  const mql = window.matchMedia(QUERY);
  mql.addEventListener("change", onChange);
  return () => mql.removeEventListener("change", onChange);
}

function getSnapshot(): boolean {
  return window.matchMedia(QUERY).matches;
}

function getServerSnapshot(): boolean {
  return false;
}

/**
 * True when the OS asks for reduced motion.
 * SSR-safe: the server snapshot is `false`; on the client the real value is
 * read synchronously, and live changes to the setting re-render immediately.
 * When true, every motion hook on this page no-ops and the CSS fallbacks
 * land the page on its finished state — all line-art fully drawn, all
 * watercolor settled, the signature flower fully open.
 */
export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
