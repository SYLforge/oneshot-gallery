---
provenance: distilled-recipe
model: glm-5.2
harness: ZCode CLI
date: 2026-07-18
attempts: 1
verification:
  status: unverified
---

The prompt below is a distilled recipe: the full brief this entry was built
from, compressed to what a strong model needs to regenerate a comparable
page in one shot.

```text
Build a complete, art-directed landing page for a fictional brand:
TYPEWAVE — an electronic artist whose only instrument is the typeface. The
page is the release: the wordmark behaves like a waveform, the section heads
react to scroll velocity, and a pinned section scrubs the letterforms across
their whole width/weight range like an audio timeline. Aesthetic:
kinetic-typography (type in motion as the hero). Stack: Next.js App Router
client page ("use client"), React 19, TypeScript strict, vanilla CSS (classes
prefixed typewave-), vanilla JS animation, zero npm dependencies. Korean-
first bilingual copy throughout.

THE CENTRAL CONSTRAINT, STATED HONESTLY: there are no images, no audio
files, no canvas anywhere. Every "waveform" is a letter being moved; every
"timeline" is a variable-font axis being scrubbed. This entry is the
gallery's proof that kinetic typography can be a music visualizer with no
media payload at all.

PALETTE (CSS custom properties on .typewave-root, every rendered color a
named token): pure black ground #000000, ink #fafafa (20.1:1, AAA), ink-dim
#98948a (6.9:1, AA+), ink-faint #5f5d57 (decorative only), one acid accent
#c6ff3a (17.8:1 on ground — clears AA normal text, but held for display
type, marks, and inverted text on acid fills rather than body copy), panel
#0e0e0e (lifted dark surface, ink reads 11.7:1), and ink-on-acid #000000
(17.8:1 on the acid, for the inverted marquee band). ONE accent only — no
second hue, no gradient, no grain. Acid appears as: focus ring, ::selection,
the scrub playhead, the acid marquee band, section-head numbers, the
spectrum-baseline hairlines, the hero zero-crossing line. Custom ::selection
(acid bg / black text) scoped to the root.

TYPE: Archivo (variable font, axes wdth 62–125 + wght 100–900 — the width
axis is the entire kinetic premise) + Black Han Sans (the Korean drum, every
Hangul display glyph) + Noto Sans KR (Korean body) + Space Mono (BPM,
timecodes, track numbers, axis readouts) via next/font/google in a fonts.ts
with literal config objects. Display stack lists Black Han Sans after Archivo
so a Korean glyph in a display head falls through to a deliberate heavy face,
not the default sans. :lang(ko) pins Korean to its own families, zeroes
tracking, sets word-break: keep-all. Korean is first-class transcreation,
never translationese.

VOICE: rhythmic, overdriven, procedural, confident. Machine text (mono)
states facts — BPM, durations, axis values; display text carries the
gesture. ~12 lines of real bilingual copy, e.g. "Scroll is the play head.
/ 스크롤이 재생 머리다." and "The faster you scroll, the harder the glyphs
pull. Effort becomes amplitude. / 빠를수록 글자가 세게 당겨진다. 노력이
진폭이 된다." Banned words: kinetic, animated, cool.

STRUCTURE (single scroll, 5 sections):
1. Hero — the kinetic wordmark (CHAR-SPLIT-REVEAL). TYPEWAVE in Archivo at
   clamp(3.4rem,19vw,16rem), weight 900, as an accessible character-split
   reveal (aria-label on the h1, aria-hidden glyph spans, 45ms stagger,
   640ms rise translateY(0.32em)→0 + opacity). The Korean 타입웨이브 in Black
   Han Sans beneath. Then — under a fine pointer, without reduced motion —
   the page's SCROLL VELOCITY writes each glyph's scaleX: a shared velocity
   ref is updated by a useScrollVelocity hook (exponential smoothing + decay,
   saturating at ~2.2px/ms → normalized 0–1) and read inside a single rAF
   that writes transform: scaleX(1 ± phase) per glyph with alternating
   phase so the stretch reads as a moving wave, not a uniform bulge. Max
   added stretch 0.42 per unit velocity, decay 0.16/frame. A 1px acid
   zero-crossing line under the wordmark. All JS-gated (.typewave-js) and
   dead under reduced motion / on touch (the page scroll itself is the
   interaction on touch).
2. The morph (SIGNATURE — SCROLL-SCRUB-PINNED). A 320vh section pins a
   100svh stage; useScrollProgress maps the corridor to p ∈ [0,1]; inside a
   rAF loop the wordmark's font-variation-settings interpolates 'wdth'
   62→125 and 'wght' 100→900 with a smoothstep ease (so the morph's middle
   travels fastest, like a filter sweep), lerp 0.14/frame so the type trails
   the scroll with mass. A Space Mono HUD reports live wdth/wght; a vertical
   acid playhead (2px, acid, 2.4s ease-in-out alternate opacity pulse) tracks
   left %; an 8-row faint-acid hairline grid sits behind as a spectrum
   baseline. rAF pauses offscreen (IO) and on hidden tabs. Reduced motion:
   corridor collapses to normal flow, wordmark parked at wdth 118/wght 760,
   HUD pinned to those values, playhead at 80%. No-JS: same static state,
   normal flow, fully readable. The corridor height exists ONLY under
   .typewave-js.
3. Lyric tickers (MARQUEE). Three CSS marquee bands at crossed speeds and
   directions on a panel strip: top band left at 38s, middle band right at
   30s, third band INVERTED (acid ground, black text) left at 22s. Each
   track is duplicated and loops via translateX(-50%); periods share no
   common divisor so bands never re-sync. Bands start paused and run only
   when onscreen (.is-running toggled by IntersectionObserver) AND only
   under .typewave-js. Real bilingual lyric fragments (5 + 5 + 4 lines),
   never lorem; the middle band leads with Hangul. Reduced motion: bands
   stop and sit static, fully readable.
4. The tracklist — a real playlist (5 tracks): track number, title (Latin
   display + Korean), one bilingual liner note each, BPM + duration in mono.
   The section head reacts to the shared scroll-velocity ref: under a fine
   pointer, letter-spacing opens by velocity·0.12em via a --tw-track CSS
   variable in rAF — a restrained echo of the hero stretch (the one
   deliberate non-transform animatable, because letter-spacing IS type).
   Rows reveal (opacity + translateY) as they enter, gated behind
   .typewave-js, staggered 60ms per batch. Reduced motion / no-JS: a plain,
   complete, readable table.
5. The closer + footer — a final giant kinetic wordmark "PLAY IT AGAIN" at
   the morph's terminal state (wdth 125, wght 900), revealing glyph-by-glyph
   on enter (the same char-split vocabulary as the hero, so the page opens
   and closes on the same gesture). Korean 다시 재생 beneath. A three-column
   credit + legal footer: the fictional label (ACID TYPE RECORDINGS), the
   engineering note, the type licenses (all OFL), the MIT code line.

HARD REQUIREMENTS:
- prefers-reduced-motion: no char rise, no velocity stretch, no head
  tracking, scrub corridor collapses to normal flow, wordmark parked at
  wdth 118/wght 760, marquees stop and sit static, reveals show. Use a
  usePrefersReducedMotion hook (useSyncExternalStore over matchMedia) + a
  real media query block.
- Touch: scroll velocity stretch and head tracking are fine-pointer only
  (the page scroll itself is the interaction on touch); marquees self-
  animate; nothing essential behind hover.
- Keyboard: everything reachable; custom acid :focus-visible.
- AA contrast: ink 20.1:1, ink-dim 6.9:1, ink-on-acid 17.8:1, acid 17.8:1
  on ground (held for display/marks, not body) — documented in tokens.json.
- Content visible without JS: add .typewave-js on mount and gate every
  pre-reveal / scrub corridor / marquee animation behind it; all copy is
  plain DOM.
- DOM animation is transform/opacity only — the single exception is the
  tracklist head letter-spacing (--tw-track), which is type, not layout
  chrome. The wordmark morph uses font-variation-settings, not transform.
- The scroll-velocity hook exposes a ref (not state) so per-frame consumers
  (hero glyphs, tracklist head) read it inside their own rAF without
  triggering React re-renders.
- Every rAF loop pauses offscreen (IntersectionObserver) and on hidden tabs
  (visibilitychange); dt clamped to 48ms.
- On mount: window.parent?.postMessage({ type: "oneshot:ready",
  slug: "typewave" }, "*").
- Composed at 360px and 1440px+; the morphing wordmark is sized so it never
  overflows the sticky stage on narrow viewports.

FILES: page.tsx (default export, applies font variables + typewave-root,
wires the shared velocity ref), components/ (Hero, ScrubWordmark,
MarqueeBands, TrackList, KineticFooter, SplitText), hooks/
(usePrefersReducedMotion, useScrollProgress, useScrollVelocity, useReveal),
styles.css, fonts.ts. Relative imports only. Zero dependencies. next/font/
google allowed.
```

## Known deviations

- The brief's acid `#c6ff3a` measures 17.8:1 on the `#000` ground, which
  clears AA for normal text. Acid is nevertheless held for display type,
  the scrub playhead, the focus ring, the acid marquee band (inverted), the
  section-head numbers, and the spectrum hairlines — it is treated as the
  one electric event rather than general body color, so the page never
  reads as "green type on black". Body copy stays ink / ink-dim.
- The tracklist section head animates `letter-spacing` (via the `--tw-track`
  CSS variable) rather than a transform. This is the one deliberate
  non-transform animatable on the page and is justified because
  letter-spacing *is* typography — the entry's premise — and the head is a
  single short line where the cost is negligible. Every other animation is
  transform/opacity or font-variation-settings.
- `next/font`'s typing for Archivo permits only `axes: ["wdth"]` (the weight
  axis is always bundled with a variable Archivo and is not declared in the
  `axes` field). The weight axis is therefore not listed in `axes` in
  fonts.ts but is fully available — the scrub morph drives `wght` 100→900
  alongside `wdth` 62→125.
- `scroll-scrub-pinned` is implemented with `position: sticky` inside an
  over-tall section plus a JS-driven lerp of `font-variation-settings`,
  rather than the newer Scroll-Driven Animations API (`animation-timeline:
  scroll()`). Sticky + lerp behaves identically across the gallery's target
  browsers, degrades trivially under reduced motion (the corridor just
  collapses), and keeps the morph's easing in JS where it can be smoothstep-
  shaped rather than linear.
- Under reduced motion the scrub does not map scroll to the morph at all;
  it parks at a composed late-morph frame (wdth 118, wght 760, playhead at
  80%) and the HUD reads those exact values. A calm scrub was considered
  and rejected: the parked frame is the stronger image and keeps the HUD
  coherent.
- The marquee bands use duplicate track markup + `translateX(-50%)` for a
  seamless loop rather than JavaScript-driven position. The IntersectionObserver
  only toggles an `is-running` class (animation-play-state), so there is no
  per-frame JS for the tickers at all — they are pure CSS.
