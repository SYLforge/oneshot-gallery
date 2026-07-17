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
 * The hanok honors this by parking every scroll-scrub at the assembled state,
 * freezing the season, and snapping zone reveals — the page is still a
 * complete, readable structure.
 */
export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
