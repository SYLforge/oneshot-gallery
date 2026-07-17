"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Drives the 인장 (seal-stamp) confirmation mechanic.
 *
 * A minhwa painter signs a finished work with a red vermillion seal — the
 * mark that says "this one is mine, this one is done." Here the seal is a UI
 * pattern: the visitor presses (or focuses, or the seal self-stamps when its
 * panel enters view on touch/reduced-motion), and a vermillion 도장 presses
 * down onto the section with a deliberate even ease — land, settle, and a
 * 1px ink rim that expands to certify the mark.
 *
 * State machine:
 *   idle      → sealed? false — the seal hangs ready, dimmed.
 *   stamping  → sealed? true  — CSS animates the descend + rim via the
 *                `is-stamped` class (a one-shot, not a loop).
 *
 * `auto` (default true): on coarse pointers OR reduced motion the seal
 * self-stamps the first time its panel enters the viewport, so touch users
 * and reduced-motion visitors never miss the certification — and the page is
 * fully composed without a tap. On fine pointers without reduced motion the
 * seal waits for the visitor's press/focus, because pressing a seal is the
 * point.
 *
 * Returns the ref to attach to the seal's container, the `stamped` flag, and
 * a `stamp()` callback (used by the button's onClick and onKeyDown). The ref
 * is also what the IntersectionObserver watches for auto-stamp.
 */
export function useSealStamp<T extends HTMLElement>(opts?: {
  auto?: boolean;
  disabled?: boolean;
}) {
  const auto = opts?.auto ?? true;
  const disabled = opts?.disabled ?? false;

  const ref = useRef<T | null>(null);
  // Under reduced motion the seal should land instantly on first reveal —
  // the visitor sees a composed, already-certified page. `disabled` is fixed
  // for the component's life, so it seeds the initial state directly.
  const [stamped, setStamped] = useState(disabled);

  const stamp = useCallback(() => setStamped(true), []);

  // Self-stamp on coarse pointer / reduced motion, the first time the seal
  // enters the viewport. Fine-pointer + full-motion visitors press it.
  useEffect(() => {
    if (!auto || disabled) return;
    const fine = window.matchMedia("(pointer: fine)").matches;
    if (fine && !disabled) return; // wait for the press
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) {
      setStamped(true);
      return;
    }
    const io = new IntersectionObserver(
      (hits) => {
        for (const h of hits) {
          if (h.isIntersecting) {
            setStamped(true);
            io.disconnect();
            break;
          }
        }
      },
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [auto, disabled]);

  return { ref, stamped, stamp };
}
