---
provenance: distilled-recipe
model: claude-fable-5
harness: Claude Code
date: 2026-07-10
attempts: 1
verification:
  status: unverified
---

The prompt below is a distilled recipe: the full brief this entry was built
from, compressed to what a strong model needs to regenerate a comparable
page in one shot.

```text
Build a complete, art-directed landing page for a fictional brand:
HALFLIGHT — a composer who writes original scores for films that do not
exist. The page is the studio's screening room; every scroll section is a
"reel". Aesthetic: cinematic-dark. Stack: Next.js App Router client page
("use client"), React 19, TypeScript strict, vanilla CSS (classes prefixed
halflight-), vanilla JS animation, zero npm dependencies.

THE CENTRAL CONSTRAINT, STATED HONESTLY: there is no film footage anywhere.
The "film frames" are drawn procedurally on a 2D canvas — grayscale
gradients, noise, grain, light — in code, at runtime. This entry is the
gallery's proof that a scrubbed film sequence does not require video files.

PALETTE (CSS custom properties on .halflight-root, every rendered color a
named token): black #0b0b0d, bone #e8e4da, signal red #d43425, tungsten
#a08560, plus pure #000 for letterbox bars. Mostly grayscale + exactly one
red — cinema-grade restraint. Red measures ~4.0:1 on the black, so it may
carry only large display type and non-text marks (cue dots, focus ring,
rules); derive a bone-dim (~64% alpha, 6.6:1) for secondary text and use
tungsten (5.6:1) for metadata. Custom ::selection (red bg / bone text)
scoped to the root.

TYPE: Anton (condensed display capitals) + Spectral (body serif, italic for
screen directions) + Space Mono (timecodes, frame counters, cue sheets,
credit roles) + Noto Serif KR (every Hangul glyph) via next/font/google in
a fonts.ts with literal config objects. Stack order lets Hangul fall
through the Latin faces into Noto Serif KR; :lang(ko) pins it explicitly
and sets word-break: keep-all. Korean is first-class transcreation, never
translationese.

VOICE: screen-direction terse — slug lines and cue notes, like a screenplay
crossed with a score cue sheet. ~15 lines of real bilingual copy, e.g.
"INT. MEMORY — NIGHT. / 내부. 기억 — 밤." and "Cue 04: the strings enter
three seconds late, on purpose. / 큐 04: 현악은 3초 늦게, 의도적으로
들어온다."

STRUCTURE (single scroll, 5 reels):
1. Title card — a black cinema stage with real letterbox bars (top/bottom,
   pure #000, decorative). Kicker "ORIGINAL SCORES FOR IMAGINARY FILMS ·
   존재하지 않는 영화의 음악". The word HALFLIGHT in Anton as an accessible
   character-split reveal (aria-label on the h1, aria-hidden glyph spans,
   55ms stagger), the whole word on a gate-weave wrapper: a 7.3s
   steps(1, end) keyframe loop of sub-pixel translates (±0.7px) — film held
   loosely in a projector gate, not jelly. A red cue dot top-right that dips
   twice per 8.1s cycle. SVG feTurbulence grain at 7% opacity, stepped
   between fixed offsets. All of it JS-gated and dead under reduced motion.
2. The reel (SIGNATURE) — a 380vh section with a sticky 100svh stage. Inside
   a 2.39:1 letterboxed frame, a DPR-capped (≤2) canvas renders a 480-frame
   procedural sequence SCRUBBED BY SCROLL: scroll progress = position in
   the reel, lerp-smoothed at 0.12/frame. Two grayscale shots — light
   through venetian blinds crossing a dark room; a pale disc rising over a
   night sea with a broken reflection — dissolved into each other
   (smoothstep over p 0.45–0.60). Over every frame: a wear pass hashed off
   the frame number (scratches that live ~3 frames, 0–3 dust motes, lamp
   flicker) and a pre-rendered grain tile composited 'overlay' and
   re-offset at ~12fps (film cadence), then a vignette. Space Mono HUD over
   the frame: "REEL 02 · 2.39:1", frame counter FR 0000, timecode at 24fps,
   plus a red cue mark that lights when p > 0.94. rAF pauses offscreen (IO)
   and on hidden tabs; reduced motion draws exactly one composed still
   (p = 0.78) and never starts the loop; without JS the frame shows a CSS
   gradient still and the section takes normal height.
3. The score (Web Audio, user-initiated) — a play/stop button synthesizes
   Cue 04 live: room tone (sines 55/110.7 + triangle 164.8 through a 260Hz
   lowpass) enters immediately; "strings" (saws 220/220.9/329.6 through a
   breathing 880Hz lowpass) are scheduled at t+3s with a 2.8s swell — the
   copy's "three seconds late" is literal in osc.start(now + 3). Master
   gain envelope 1.6s in / 0.55s out; two sub-0.2Hz LFOs keep it alive.
   NO AUTOPLAY EVER — the AudioContext is created only inside the click
   handler. While playing, a canvas draws the score-line in real time from
   an AnalyserNode: RMS envelope marching left, oscilloscope ghost behind,
   red playhead, red mark at the strings' entrance. Stop = exponential ramp
   then stop every oscillator, disconnect, close the context. The cue also
   stops on section-leave (IO), unmount, and pagehide. Reduced motion:
   waveform static, audio still user-triggerable. No Web Audio: the player
   hides and a one-line apology remains.
4. The cue sheet — a screenplay-style <ol>: Space Mono timecodes, Spectral
   cue names and notes, six cues, exactly one struck through
   ("CUE 05 — THE CONFESSION", UNUSED · 미사용) with a red spine. Plain DOM,
   scroll-revealed.
5. End credits + footer — a scroll-scrubbed credit roll (sticky masked
   stage in a 300vh corridor; the column translates from below frame to
   above as p goes 0→1; DIRECTED BY — NO ONE, SHOT ON — NOTHING, THE END in
   red Anton), then a footer: "© 2026 HALFLIGHT — music for films that were
   never shot. 찍히지 않은 영화들을 위한 음악."

HARD REQUIREMENTS:
- prefers-reduced-motion: no gate weave, no char rise, no grain animation,
  no cue blink, one static reel frame, credit roll becomes a static list,
  scrub corridors collapse to normal height. Use a usePrefersReducedMotion
  hook (useSyncExternalStore over matchMedia) + a real media query block.
- Audio only on explicit user gesture; torn down (oscillators stopped,
  graph disconnected, context closed) on stop, section-leave, unmount,
  pagehide. A clear play/stop control with aria-pressed.
- Touch: the reel scrubs with scroll, the button is tappable, no
  hover-only meaning anywhere.
- Keyboard: everything reachable; custom signal-red :focus-visible.
- AA contrast: bone 15.5:1; tungsten 5.6:1; bone-dim 6.6:1; red restricted
  to large type / non-text (4.0:1) — documented in tokens.json.
- Content visible without JS: add .halflight-js on mount and gate every
  pre-reveal/scrub/hidden state behind it; all copy and the cue sheet are
  plain DOM; canvases are enhancements with CSS stills behind them.
- DOM animation is transform/opacity only; canvas rAF is DPR-aware
  (cap 2), paused offscreen and on visibilitychange.
- On mount: window.parent?.postMessage({ type: "oneshot:ready",
  slug: "halflight" }, "*").
- Composed at 360px and 1440px+; the 2.39:1 frame is width-capped by
  min(1100px, 92vw, 148svh) so the sticky stage always fits.

FILES: page.tsx (default export, applies font variables + halflight-root),
components/ (TitleCard, Reel, ScorePlayer, CueSheet, CreditsFooter),
hooks/ (usePrefersReducedMotion, useScrollProgress, useAudioEngine,
useReveal), styles.css, fonts.ts. Relative imports only. Zero dependencies.
```

## Known deviations

- The brief's red `#d43425` measures ~4.0:1 on `#0b0b0d`, below AA for
  normal text. Red is therefore restricted to large display type (THE END),
  non-text marks (cue dots, focus ring, the struck cue's spine, the
  strings-entry mark) and the mandated ::selection. The "UNUSED" flag on
  the struck cue is set in tungsten, not red — the red is carried by the
  cue's border spine instead.
- The mandated ::selection (red background / bone text) measures ~3.8:1 —
  kept as specified because it is a transient, user-initiated state; all
  resting text passes AA.
- The credit roll is scroll-scrubbed rather than a time-based auto-roll:
  it behaves identically on touch, can never outrun a reader, and its
  reduced-motion / no-JS state is trivially a static list. The brief's
  "slow vertical credit roll on scroll" is read as scroll-driven.
- The hero grain uses an SVG feTurbulence data-URI, but
  `feturbulence-texture` is not claimed in meta.techniques — it is a
  decorative background there, and every claimed tag must earn a breakdown
  section. The claimed grain technique (`canvas-particles`) is the reel's
  procedural speck tile + hashed wear pass, which is where the texture
  actually performs.
- Under reduced motion the reel does not map scroll to frames at all; it
  shows one composed still (p = 0.78, late in the dissolve). A calm scrub
  was considered and rejected: the still is the stronger image and the
  HUD stays coherent.
- The no-JS state of the reel is a CSS-gradient approximation of shot B,
  not a canvas frame (no JS, no canvas by definition); the HUD shows its
  server-rendered zeros. Accepted: the section's copy carries the meaning.
