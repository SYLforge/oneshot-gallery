"use client";

import { useEffect, useRef } from "react";

/** Per-glyph spring config for the char-split reveal. */
const CHAR_STIFF = 320;
const CHAR_DAMP = 12;
const CHAR_MASS = 1;
const STAGGER_MS = 55;

/** Card pop spring config. */
const CARD_STIFF = 220;
const CARD_DAMP = 18;
const CARD_MASS = 1;
const CARD_STAGGER_MS = 90;

/** Resting & start values. */
const GLYPH_REST_Y = 0;
const GLYPH_START_Y = 34; // glyphs begin ~0.3em below their slot
const GLYPH_START_SC = 0.5;
const GLYPH_REST_SC = 1;

const CARD_REST_Y = 0;
const CARD_START_Y = 30;
const CARD_START_SC = 0.92;
const CARD_REST_SC = 1;

type Glyph = {
  el: HTMLElement;
  y: number;
  vy: number;
  sc: number;
  vsc: number;
  /** wall-clock ms at which the spring may start */
  startAt: number;
  triggered: boolean;
  started: boolean;
};

type Card = {
  el: HTMLElement;
  y: number;
  vy: number;
  sc: number;
  vsc: number;
  startAt: number;
  triggered: boolean;
  started: boolean;
};

/** One semi-implicit-Euler spring step on a scalar; returns [pos, vel, alive]. */
function spring1(
  pos: number,
  vel: number,
  goal: number,
  k: number,
  c: number,
  m: number,
  dt: number,
): [number, number, boolean] {
  const f = dt / 1000;
  const a = (-k * (pos - goal) - c * vel) / m;
  const nv = vel + a * f;
  const nx = pos + nv * f;
  const alive = Math.abs(nx - goal) > 0.0008 || Math.abs(nv) > 0.0008;
  return [nx, nv, alive];
}

/**
 * Bounces in two kinds of things as they enter the viewport:
 *
 * 1. `[data-bounce-text]` — a headline. The hook splits the text content
 *    into per-glyph `<span>`s (accessible: container keeps an aria-label,
 *    the animated spans are aria-hidden) and springs each glyph up from
 *    below with overshoot, staggered 55ms per glyph.
 * 2. `[data-bounce-card]` — a card. Springs translateY + scale with the
 *    softer card preset, batch-staggered 90ms within an observer batch.
 *
 * The pre-reveal state is gated behind the `.bounce-js` root class, so
 * without JavaScript everything is simply visible in its resting place.
 * Under reduced motion, everything resolves to its resting state on first
 * paint — no movement, no hidden content.
 *
 * Returns a ref to the root that contains the `[data-bounce-*]` targets.
 */
export function useBounceReveal<T extends HTMLElement>(disabled: boolean) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    const textEls = Array.from(
      root.querySelectorAll<HTMLElement>("[data-bounce-text]"),
    );
    const cardEls = Array.from(
      root.querySelectorAll<HTMLElement>("[data-bounce-card]"),
    );

    // --- Reduced motion / no IO: split, but snap everything to rest. ----
    if (disabled || !("IntersectionObserver" in window)) {
      for (const el of textEls) splitText(el);
      for (const el of cardEls) {
        el.style.transform = "";
        el.style.opacity = "1";
      }
      return;
    }

    // Split now; the .bounce-js pre-reveal CSS hides the glyphs only while
    // JS is alive, so SSR/first-paint keeps them visible at rest.
    for (const el of textEls) splitText(el);

    // Write each glyph's START position as an inline transform immediately,
    // so when it flips visible (opacity via [style]) it is already sitting
    // just below its slot, waiting for its stagger time.
    const glyphs: Glyph[] = [];
    for (const el of textEls) {
      const spans = el.querySelectorAll<HTMLElement>(".bounce-glyph");
      for (const span of Array.from(spans)) {
        const g: Glyph = {
          el: span,
          y: GLYPH_START_Y,
          vy: 0,
          sc: GLYPH_START_SC,
          vsc: 0,
          startAt: 0,
          triggered: false,
          started: false,
        };
        span.style.transform = `translateY(${GLYPH_START_Y}px) scale(${GLYPH_START_SC})`;
        glyphs.push(g);
      }
    }

    const cards: Card[] = cardEls.map((el) => {
      const c: Card = {
        el,
        y: CARD_START_Y,
        vy: 0,
        sc: CARD_START_SC,
        vsc: 0,
        startAt: 0,
        triggered: false,
        started: false,
      };
      el.style.transform = `translateY(${CARD_START_Y}px) scale(${CARD_START_SC})`;
      return c;
    });

    let raf = 0;
    let last = 0;

    const tick = (now: number) => {
      const dt = last ? Math.min(48, now - last) : 16.7;
      last = now;
      let alive = false;

      for (const g of glyphs) {
        if (!g.triggered) continue;
        if (!g.started) {
          if (now < g.startAt) {
            alive = true; // keep the loop alive until this glyph's cue
            continue;
          }
          g.started = true;
          // flip visible at the START position this frame, then spring up
          g.el.classList.add("bounce-glyph--in");
        }
        const [ny, nvy, ay] = spring1(g.y, g.vy, GLYPH_REST_Y, CHAR_STIFF, CHAR_DAMP, CHAR_MASS, dt);
        g.y = ny;
        g.vy = nvy;
        const [nsc, nvsc, as] = spring1(g.sc, g.vsc, GLYPH_REST_SC, CHAR_STIFF, CHAR_DAMP, CHAR_MASS, dt);
        g.sc = nsc;
        g.vsc = nvsc;
        g.el.style.transform = `translateY(${g.y.toFixed(2)}px) scale(${g.sc.toFixed(4)})`;
        if (ay || as) alive = true;
      }

      for (const c of cards) {
        if (!c.triggered) continue;
        if (!c.started) {
          if (now < c.startAt) {
            alive = true;
            continue;
          }
          c.started = true;
        }
        const [ny, nvy, ay] = spring1(c.y, c.vy, CARD_REST_Y, CARD_STIFF, CARD_DAMP, CARD_MASS, dt);
        c.y = ny;
        c.vy = nvy;
        const [nsc, nvsc, as] = spring1(c.sc, c.vsc, CARD_REST_SC, CARD_STIFF, CARD_DAMP, CARD_MASS, dt);
        c.sc = nsc;
        c.vsc = nvsc;
        c.el.style.transform = `translateY(${c.y.toFixed(2)}px) scale(${c.sc.toFixed(4)})`;
        if (ay || as) alive = true;
      }

      if (alive) {
        raf = requestAnimationFrame(tick);
      } else {
        raf = 0;
        last = 0;
      }
    };

    const wake = () => {
      if (!raf) {
        last = 0;
        raf = requestAnimationFrame(tick);
      }
    };

    // One observer handles both, with a shared per-batch stagger counter
    // so cards arriving together fan out 90ms apart.
    let cardBatch = 0;
    const io = new IntersectionObserver(
      (hits) => {
        let localCard = 0;
        const now = performance.now();
        for (const hit of hits) {
          if (!hit.isIntersecting) continue;
          const el = hit.target as HTMLElement;
          if (el.hasAttribute("data-bounce-text")) {
            const spans = el.querySelectorAll<HTMLElement>(".bounce-glyph");
            spans.forEach((span, idx) => {
              const g = glyphs.find((gg) => gg.el === span);
              if (!g || g.triggered) return;
              g.triggered = true;
              g.startAt = now + idx * STAGGER_MS;
            });
            io.unobserve(el);
          } else {
            const c = cards.find((cc) => cc.el === el);
            if (!c || c.triggered) continue;
            c.triggered = true;
            c.startAt = now + (cardBatch + localCard) * CARD_STAGGER_MS;
            c.el.classList.add("is-in");
            localCard += 1;
            io.unobserve(el);
          }
        }
        cardBatch += localCard;
        wake();
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
    );

    for (const el of textEls) io.observe(el);
    for (const el of cardEls) io.observe(el);

    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [disabled]);

  return ref;
}

/**
 * Splits the text-node children of `el` into per-glyph `.bounce-glyph`
 * spans. Whitespace stays as plain text. The container must carry its own
 * `aria-label` (the full string); the spans are aria-hidden so the headline
 * is announced once, cleanly. Idempotent.
 */
function splitText(el: HTMLElement) {
  if (el.dataset.split === "1") return;
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  const targets: Text[] = [];
  let node = walker.nextNode();
  while (node) {
    targets.push(node as Text);
    node = walker.nextNode();
  }
  for (const text of targets) {
    const frag = document.createDocumentFragment();
    for (const ch of text.textContent ?? "") {
      if (ch === " " || ch === "\n" || ch === "\t") {
        frag.appendChild(document.createTextNode(ch));
        continue;
      }
      const span = document.createElement("span");
      span.className = "bounce-glyph";
      span.setAttribute("aria-hidden", "true");
      span.style.display = "inline-block";
      span.style.willChange = "transform";
      span.textContent = ch;
      frag.appendChild(span);
    }
    text.parentNode?.replaceChild(frag, text);
  }
  el.dataset.split = "1";
}
