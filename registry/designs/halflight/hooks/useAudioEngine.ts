"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";

/** Master bus level — the drone sits well under full scale. */
const MASTER_LEVEL = 0.38;
/** Fade-in of the room tone (s). */
const ATTACK_S = 1.6;
/** Fade-out on stop (s) — nodes are torn down right after it lands. */
const RELEASE_S = 0.55;
/** The strings enter three seconds late, on purpose. */
const STRINGS_DELAY_S = 3;
/** Once they enter, the strings take this long to swell in (s). */
const STRINGS_SWELL_S = 2.8;

type Engine = {
  ctx: AudioContext;
  master: GainNode;
  analyser: AnalyserNode;
  sources: OscillatorNode[];
  torn: boolean;
};

function getContextCtor(): typeof AudioContext | null {
  if (typeof window === "undefined") return null;
  const w = window as Window & { webkitAudioContext?: typeof AudioContext };
  return window.AudioContext ?? w.webkitAudioContext ?? null;
}

/**
 * Web Audio capability as a tiny external store: the server optimistically
 * says "supported", the client corrects it synchronously on hydration, and
 * a failed AudioContext construction can flip it later (hiding the player).
 * Capability is global, so the store is module-level on purpose.
 */
let audioBroken = false;
const supportListeners = new Set<() => void>();

function markAudioBroken() {
  if (audioBroken) return;
  audioBroken = true;
  for (const listener of supportListeners) listener();
}

function subscribeSupport(onChange: () => void): () => void {
  supportListeners.add(onChange);
  return () => {
    supportListeners.delete(onChange);
  };
}

function getSupportSnapshot(): boolean {
  return !audioBroken && getContextCtor() !== null;
}

function getSupportServerSnapshot(): boolean {
  return true;
}

/**
 * Cue 04 as a synth patch, built only on an explicit user gesture — never on
 * mount, never on scroll. The graph:
 *
 *   room:    sine 55 + sine 110.7 + tri 164.8 → lowpass 260 → gain
 *   strings: saw 220 + saw 220.9 + saw 329.6 → lowpass 880 (LFO-breathed)
 *            → swell (LFO) → envelope (enters at t+3s)
 *   both → master (attack/release envelope) → analyser → destination
 *
 * `stop()` ramps the master to silence, then stops every oscillator,
 * disconnects the graph, and closes the AudioContext — nothing leaks, and a
 * closed context is also the teardown path on unmount and pagehide.
 */
export function useAudioEngine() {
  const supported = useSyncExternalStore(
    subscribeSupport,
    getSupportSnapshot,
    getSupportServerSnapshot,
  );
  const [playing, setPlaying] = useState(false);
  const engineRef = useRef<Engine | null>(null);
  const fadingRef = useRef<Engine | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const fadeTimerRef = useRef(0);

  const teardown = useCallback((engine: Engine) => {
    if (engine.torn) return;
    engine.torn = true;
    for (const src of engine.sources) {
      try {
        src.stop();
      } catch {
        /* already stopped or never started — fine */
      }
    }
    try {
      engine.master.disconnect();
      engine.analyser.disconnect();
    } catch {
      /* context already closing */
    }
    void engine.ctx.close().catch(() => undefined);
  }, []);

  const stop = useCallback(() => {
    const engine = engineRef.current;
    if (!engine) return;
    engineRef.current = null;
    analyserRef.current = null;
    setPlaying(false);

    // Ramp out, then dismantle: no clicks, no orphaned nodes.
    const now = engine.ctx.currentTime;
    const g = engine.master.gain;
    g.cancelScheduledValues(now);
    g.setValueAtTime(Math.max(g.value, 0.0001), now);
    g.exponentialRampToValueAtTime(0.0001, now + RELEASE_S);

    fadingRef.current = engine;
    window.clearTimeout(fadeTimerRef.current);
    fadeTimerRef.current = window.setTimeout(() => {
      teardown(engine);
      if (fadingRef.current === engine) fadingRef.current = null;
    }, RELEASE_S * 1000 + 80);
  }, [teardown]);

  const start = useCallback(() => {
    if (engineRef.current) return;
    const Ctor = getContextCtor();
    if (!Ctor) {
      markAudioBroken();
      return;
    }
    let ctx: AudioContext;
    try {
      ctx = new Ctor();
    } catch {
      markAudioBroken();
      return;
    }
    void ctx.resume().catch(() => undefined);

    const now = ctx.currentTime + 0.05;
    const sources: OscillatorNode[] = [];

    const master = ctx.createGain();
    master.gain.setValueAtTime(0.0001, now);
    master.gain.exponentialRampToValueAtTime(MASTER_LEVEL, now + ATTACK_S);

    const analyser = ctx.createAnalyser();
    analyser.fftSize = 2048;
    analyser.smoothingTimeConstant = 0.82;
    master.connect(analyser);
    analyser.connect(ctx.destination);

    const voice = (
      type: OscillatorType,
      freq: number,
      level: number,
      dest: AudioNode,
      at: number,
    ) => {
      const osc = ctx.createOscillator();
      osc.type = type;
      osc.frequency.value = freq;
      const g = ctx.createGain();
      g.gain.value = level;
      osc.connect(g);
      g.connect(dest);
      osc.start(at);
      sources.push(osc);
    };

    // -- the room: two dark sines and a distant fifth ----------------------
    const roomFilter = ctx.createBiquadFilter();
    roomFilter.type = "lowpass";
    roomFilter.frequency.value = 260;
    const roomGain = ctx.createGain();
    roomGain.gain.value = 0.62;
    roomFilter.connect(roomGain);
    roomGain.connect(master);

    voice("sine", 55, 1, roomFilter, now); // A1 — the floor of the room
    voice("sine", 110.7, 0.4, roomFilter, now); // an octave up, a hair sharp
    voice("triangle", 164.8, 0.15, roomFilter, now); // E3 — a distant fifth

    // -- the strings: detuned saws, filtered, three seconds late -----------
    const strFilter = ctx.createBiquadFilter();
    strFilter.type = "lowpass";
    strFilter.frequency.value = 880;
    strFilter.Q.value = 1.4;

    const swell = ctx.createGain();
    swell.gain.value = 1;

    const strEnv = ctx.createGain();
    const enter = now + STRINGS_DELAY_S;
    strEnv.gain.setValueAtTime(0.0001, now);
    strEnv.gain.setValueAtTime(0.0001, enter);
    strEnv.gain.linearRampToValueAtTime(0.17, enter + STRINGS_SWELL_S);

    strFilter.connect(swell);
    swell.connect(strEnv);
    strEnv.connect(master);

    voice("sawtooth", 220, 0.5, strFilter, enter); // A3
    voice("sawtooth", 220.9, 0.5, strFilter, enter); // A3, deliberately off
    voice("sawtooth", 329.6, 0.22, strFilter, enter); // E4 — the open fifth

    // -- slow weather: sub-0.2Hz LFOs so the drone never sits still --------
    const lfoTimbre = ctx.createOscillator();
    lfoTimbre.frequency.value = 0.07;
    const lfoTimbreDepth = ctx.createGain();
    lfoTimbreDepth.gain.value = 320;
    lfoTimbre.connect(lfoTimbreDepth);
    lfoTimbreDepth.connect(strFilter.frequency);
    lfoTimbre.start(now);
    sources.push(lfoTimbre);

    const lfoSwell = ctx.createOscillator();
    lfoSwell.frequency.value = 0.11;
    const lfoSwellDepth = ctx.createGain();
    lfoSwellDepth.gain.value = 0.24;
    lfoSwell.connect(lfoSwellDepth);
    lfoSwellDepth.connect(swell.gain);
    lfoSwell.start(now);
    sources.push(lfoSwell);

    const engine: Engine = { ctx, master, analyser, sources, torn: false };
    engineRef.current = engine;
    analyserRef.current = analyser;
    setPlaying(true);
  }, []);

  const toggle = useCallback(() => {
    if (engineRef.current) stop();
    else start();
  }, [start, stop]);

  // Hard teardown on unmount and pagehide — no fade, no leaks.
  useEffect(() => {
    const killAll = () => {
      window.clearTimeout(fadeTimerRef.current);
      if (fadingRef.current) {
        teardown(fadingRef.current);
        fadingRef.current = null;
      }
      if (engineRef.current) {
        teardown(engineRef.current);
        engineRef.current = null;
        analyserRef.current = null;
      }
    };
    const onPageHide = () => {
      killAll();
      setPlaying(false);
    };
    window.addEventListener("pagehide", onPageHide);
    return () => {
      window.removeEventListener("pagehide", onPageHide);
      killAll();
    };
  }, [teardown]);

  return { supported, playing, toggle, stop, analyserRef };
}
