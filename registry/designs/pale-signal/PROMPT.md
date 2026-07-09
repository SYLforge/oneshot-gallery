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
PALE.SIGNAL — a decommissioned radio observatory on a Korean mountain ridge
that still publishes nightly logs of what the sky said. The page is its
public terminal. Aesthetic: terminal-core. Stack: Next.js App Router client
page ("use client"), React 19, TypeScript strict, vanilla CSS (BEM-ish
classes prefixed ps-), vanilla JS animation, zero npm dependencies.

PALETTE (CSS custom properties, every rendered color a named token):
phosphor green #33ff66 on tube black #0a0f0a; dim trace #1d5c31 (decorative
only — it fails AA, so derive a secondary-text token from phosphor at ~72%
alpha instead); amber alert #ffb000; glass glare #c8ffd9 used at low alpha.
No teal, no gradient blobs. Custom ::selection (phosphor bg, black text)
scoped to the page root.

TYPE: VT323 (Latin/display) + Nanum Gothic Coding (Korean monospace) via
next/font/google in a fonts.ts with literal config objects. Put Nanum after
VT323 in the family stack so Hangul falls through to it; also style
:lang(ko) explicitly at ~0.8em. Korean must never render in fallback sans.

VOICE: log-file terse, timestamped, bilingual EN/KO interleaved like an
operator's log ("03:11 KST — signal faint but present. 신호 미약, 존재
확인."). Write 15–20 lines of real, literary microcopy — pulsar rhythms,
the hum of the moon, static that sounded like rain. Korean first-class,
never translationese.

STRUCTURE (single scroll, 5 sections):
1. Boot hero — a typewriter prints an 8-line boot log (BIOS name,
   phosphor driver, memory 640K, three azimuth drives — one retired,
   lunar calibration, a bilingual sign-off), then the station title
   PALE.SIGNAL resolves with a phosphor-bloom flicker (keyframed
   brightness/blur, ~950ms, two collapses before it settles). Blinking
   block cursor. Subtitle "관측소 — listening post". Any key / click /
   wheel / scroll completes the boot instantly, and it always completes
   by itself (hard timeout). Cadence: ~9ms/char with 0–12ms jitter, 35%
   two-char bursts, ~140ms line pauses, one 3.5× beat before the last line.
2. Tonight's log — nine timestamped bilingual entries revealing on scroll
   (IntersectionObserver, translate/opacity only, ~70ms batch stagger,
   cubic-bezier(0.16,1,0.3,1)). Exactly one entry flagged amber
   ("narrowband spike… logged. not explained.").
3. Live receive — the signature: a DPR-aware <canvas> renders an animated
   star-field + radio waveform as ASCII density (ramp " .:-=+*#%@", ~14px
   cells, fillText, rAF throttled to ~60fps). Scene = sparse hashed
   twinkling stars + a carrier band of three stacked sines + a gaussian
   bloom that lerps toward the pointer (position lerp 0.085/frame, energy
   attack 0.06 / release 0.025). On touch or idle pointer, an autonomous
   lissajous drift takes over. Bucket cells into 4 token colors and set
   fillStyle once per bucket. Pause the loop offscreen (IO).
4. The dishes — three antennas (Korean flower names: 매화, 동백, 수선) in a
   monospace ledger: code, name, azimuth, elevation, status. One row
   "RETIRED — 퇴역" in amber. Rows are real <button>s with aria-expanded
   that open a one-line poetic note; hover/focus shows a "+" crosshair and
   an instant (untransitioned) row highlight.
5. Footer — sign-off log line ("06:00 KST — end of watch…"), station
   coordinates, 1420.4057 MHz reference, a fake night beacon, mailto link,
   "© 2026 pale.signal — the sky keeps talking. 하늘은 계속 말한다."

CRT TREATMENT over everything: fixed pointer-events-none overlay with
repeating-linear-gradient scanlines (1px dark ink every 3px, low opacity),
radial vignette, a glare wash that flickers twice per ~9.4s cycle, and a
single-frame horizontal jitter of the content layer every ~12.4s
(translateX 3px + slight skewX). Text must stay AA under the scanlines.

HARD REQUIREMENTS:
- prefers-reduced-motion: boot renders complete instantly, no flicker or
  jitter, the ASCII field draws one static composed frame, reveals are
  visible without animation. Use a usePrefersReducedMotion hook
  (useSyncExternalStore over matchMedia).
- Touch usable without hover; ASCII field self-animates.
- Keyboard reachable everything; custom phosphor :focus-visible ring.
- No text hidden without JS: add a js class on mount and gate every
  pre-reveal style behind it; SSR state is the completed page.
- Animate only transform/opacity/filter. No console errors.
- Typewriter and title use aria-label full text + aria-hidden animated
  spans; the canvas gets role="img" with a bilingual description.
- On mount: window.parent?.postMessage({ type: "oneshot:ready",
  slug: "pale-signal" }, "*").
- Composed at 360px and at 1440px+ (log becomes a two-column ledger at
  900px; dish rows re-grid on mobile).

FILES: page.tsx (default export, applies font variables + ps-root),
components/ (BootSequence, LogSection, SignalField, Dishes, StationFooter),
hooks/ (usePrefersReducedMotion, useTypewriter, useReveal), styles.css
(all tokens + styles), fonts.ts. Relative imports only.
```

## Known deviations

- The no-JS / SSR state is the *completed* boot screen; when JS mounts, the
  terminal clears and boots for real. On slow connections the finished hero
  can flash before hydration — accepted as the price of "no text hidden
  without JS", and it reads as a screen power-cycle.
- The brief's dim trace `#1d5c31` measures ~2.4:1 on tube black, so it is
  demoted to decorative use only (rules, section numerals, faint ASCII
  cells); a derived `phosphor-dim` (phosphor at 72% alpha ≈ #27b54a, 7.2:1)
  carries all secondary text instead.
- Glass glare `#c8ffd9` is specified "at low alpha" but is also used at
  full strength for the brightest one-to-two ASCII ramp characters — the
  field needed a hot white-green peak for the bloom to feel lit from behind.
- `pointer-parallax` was left out of meta techniques: the field reacts to
  pointer proximity, but there are no layered depth planes, and every
  listed technique must earn a breakdown section.
