"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Progress = { line: number; char: number; done: boolean };

export type Typewriter = {
  /** Lines that have finished typing. */
  settled: string[];
  /** The line currently being typed ("" when idle or done). */
  typing: string;
  done: boolean;
  /** Complete the whole sequence instantly (skip). */
  finish: () => void;
};

export type TypewriterOptions = {
  /** Base delay per character tick, ms. */
  charMs?: number;
  /** Random extra delay per tick, ms. */
  jitterMs?: number;
  /** Pause between lines, ms. */
  linePauseMs?: number;
  /** Delay before the first character, ms. */
  startDelayMs?: number;
};

/**
 * A data-terminal typewriter for episode titles and feed log lines. While
 * `play` is false the text is fully "typed" — which is what the server
 * renders, so nothing is hidden without JS. Cadence is even but not
 * metronomic: a small jitter keeps it alive without pretending to be a UART
 * boot (this is an analytics terminal, not PALE.SIGNAL's cold boot).
 */
export function useTypewriter(
  lines: readonly string[],
  play: boolean,
  options?: TypewriterOptions,
): Typewriter {
  const charMs = options?.charMs ?? 32;
  const jitterMs = options?.jitterMs ?? 22;
  const linePauseMs = options?.linePauseMs ?? 220;
  const startDelayMs = options?.startDelayMs ?? 320;

  const [progress, setProgress] = useState<Progress>({
    line: lines.length,
    char: 0,
    done: true,
  });
  const [prevPlay, setPrevPlay] = useState(play);
  const timerRef = useRef(0);

  // Sanctioned render-time adjustment: rewind the tape the moment play flips
  // on, so the completed no-JS text never coexists with the typing state.
  if (prevPlay !== play) {
    setPrevPlay(play);
    if (play) setProgress({ line: 0, char: 0, done: false });
  }

  const finish = useCallback(() => {
    window.clearTimeout(timerRef.current);
    setProgress({ line: lines.length, char: 0, done: true });
  }, [lines.length]);

  useEffect(() => {
    if (!play) return;
    let line = 0;
    let char = 0;

    const step = () => {
      const current = lines[line] ?? "";
      if (char < current.length) {
        char += 1;
        setProgress({ line, char, done: false });
        timerRef.current = window.setTimeout(
          step,
          charMs + Math.random() * jitterMs,
        );
      } else if (line < lines.length - 1) {
        line += 1;
        char = 0;
        setProgress({ line, char, done: false });
        timerRef.current = window.setTimeout(step, linePauseMs);
      } else {
        setProgress({ line: lines.length, char: 0, done: true });
      }
    };

    timerRef.current = window.setTimeout(step, startDelayMs);
    return () => window.clearTimeout(timerRef.current);
  }, [play, lines, charMs, jitterMs, linePauseMs, startDelayMs]);

  const settled = lines.slice(0, progress.line);
  const typing = progress.done
    ? ""
    : (lines[progress.line] ?? "").slice(0, progress.char);

  return { settled, typing, done: progress.done, finish };
}
