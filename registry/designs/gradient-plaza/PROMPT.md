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
GRADIENT PLAZA — a 24-hour "midnight mall radio" station broadcasting from
a shopping mall that only exists after closing. Aesthetic: vaporwave, but
DISCIPLINED — no kitsch soup, no illegible neon. Dark theme. Stack: Next.js
App Router client page ("use client"), React 19, TypeScript strict, vanilla
CSS (classes prefixed plaza-), vanilla JS animation, zero npm dependencies,
zero image assets — every texture is procedural.

PALETTE (CSS custom properties on .plaza-root, every rendered color a named
token): deep purple #1a0b2e (page), void #0d0518 (deepest layer), panel
#241040 (window bodies), sunset pink #ff71ce (THE accent), cyan #01cdfe,
mint #05ffa1, violet #b967ff. Derive two reading tokens: lavender-white
#efe6ff for body copy and haze #c7b8e0 for secondary text. CONTRAST IS THE
RUBRIC: on deep purple, pink is 7.5:1, cyan 9.9:1, mint 14:1, violet 5.7:1
— keep violet to small labels/chrome, keep ALL long copy lavender-white or
haze, and document the numbers. Custom ::selection (pink bg, deep-purple
text) scoped to the root.

TYPE: Monoton (Latin neon display — display sizes only), Gugi (ALL Hangul,
retro Korean display), Azeret Mono (labels, schedule, window chrome, body)
via next/font/google in fonts.ts. Order both working stacks Latin-first,
Gugi second, so Hangul falls through with no markup; Korean must never hit
fallback sans.

VOICE: dead-mall PA announcements — dreamy, liminal, slightly eerie, KO/EN
as transcreation not translation. ~15 real lines, e.g. "Attention shoppers:
the escalators run all night, for no one. / 안내 말씀드립니다 —
에스컬레이터는 밤새 운행합니다, 아무도 없이." Banned: irony about being a
website, "aesthetic" as a word, marketing cheer.

STRUCTURE (single scroll, 5 sections):
1. Hero (SIGNATURE) — an infinite perspective grid floor on a DPR-capped 2D
   canvas: dusk gradient sky, drifting/twinkling star particles, a
   pink→violet sun sliced by venetian blinds that widen downward, cyan grid.
   Verticals converge on the vanishing point; horizontals are world rows
   projected as d = NEAR/z, y = horizon + floorH·d, scrolled by offset.
   COUPLE THE FLOOR TO SCROLL VELOCITY: a useScrollEnergy hook lerps
   |scrollY′| into a 0→1 energy (attack .16 / release .05); grid speed =
   0.5 + 4.2·energy lanes/s, horizon glow brightens with it. The grid
   always drifts gently on its own (touch gets a living floor). Neon title
   "GRADIENT PLAZA" (Monoton) + "미드나잇 몰 라디오" (Gugi), an ON AIR
   lamp, a scrim behind hero text so it stays AA over the grid lines.
2. Chromatic aberration on scroll (SIGNATURE) — the same energy writes
   --plaza-shift (0–7px) and --plaza-ghost (0–.85) on the root; every
   display heading is a .plaza-ab element with data-text, whose ::before/
   ::after ghosts (content: attr(data-text) / ""; cyan left, pink right)
   translate apart and fade in with mix-blend-mode: screen. Additive light
   only: base glyphs never move, contrast never drops, rest = crisp.
   Showcase it on a section of five timestamped PA announcements set large.
3. The booth (SIGNATURE) — three draggable retro-OS windows (Win95 bones,
   neon skin) on a tiled stage: NOWPLAYING.EXE (fake track, scaleX progress
   loop, prev/next buttons), TRACKLIST.TXT (five fictional muzak tracks,
   aria-current on the song on air), VISUALIZER.EXE (canvas bars from
   summed incommensurate sines, seeded per track, two fillStyle changes per
   frame). Drag by title bar via pointer capture, transform-only, inertia
   on release (friction .9/frame); click raises (z-order = raise stack);
   arrow keys move the focused grip 24px (Shift 4px, Home respawns);
   minimize/close are real buttons and closed windows return from a
   taskbar. No-JS: windows stack in flow, fully readable.
4. Programming — a mono schedule 00:00–06:00 of dead-mall shows (Fountain
   Ambience, Escalator Jazz, Food Court Rain…) with exactly one SIGNAL
   LOST gap at 03:00, pink and dashed — pink only ever means wrong.
5. Footer — "STAY UNTIL CLOSING · 폐점까지 머물러요", station data list,
   "© 2026 GRADIENT PLAZA — broadcasting to an empty food court. 텅 빈
   푸드코트를 향해 방송 중."
Plus a PA ticker strip under the hero: a JS marquee (duplicated aria-hidden
track + visually-hidden list for SR) whose speed is 42 + 300·energy px/s.

HARD REQUIREMENTS:
- prefers-reduced-motion: grid renders ONE composed still frame, no
  aberration ghosts (content: none + zeroed vars), ticker static, lamp and
  progress animations off, drag inertia off — dragging itself stays (user-
  driven). usePrefersReducedMotion = useSyncExternalStore over matchMedia.
- Touch: title bars are touch-action: none so windows drag without
  scrolling the page; nothing meaningful lives behind hover.
- Keyboard: every control reachable; windows keyboard-movable; custom
  :focus-visible (cyan ring + pink halo).
- No text hidden without JS: add .plaza-js on mount; stage positioning,
  canvas, ticker motion are all gated behind it. A CSS gradient sky
  backs the hero canvas so no-JS never shows a black hole.
- Animate only transform/opacity/filter. Canvas loops are DPR-capped at 2,
  pause offscreen (IntersectionObserver) and on visibilitychange. Canvases
  carry role="img" with bilingual labels. NO audio, ever — the radio is a
  picture of a sound. No preload="auto". Zero console errors.
- On mount: window.parent?.postMessage({ type: "oneshot:ready",
  slug: "gradient-plaza" }, "*").

FILES: page.tsx, components/ (Hero incl. grid canvas, PAMarquee,
Announcements, RadioWindows incl. visualizer, Schedule, Footer), hooks/
(usePrefersReducedMotion, useScrollEnergy, useDrag), styles.css, fonts.ts.
Relative imports only.
```

## Known deviations

- The brief allowed WebGL for the grid; this build uses a 2D canvas — line
  work and 2px sun slices rasterize crisply without a shader, and the
  fallback story collapses to "the same canvas". The honest technique tag
  is therefore `canvas-particles` (the starfield + grid system is one
  DPR-capped, velocity-coupled canvas), not `webgl-shader`.
- There is no taxonomy id for chromatic aberration. Rather than stretch
  `crt-scanline` (there are no scanlines here), the aberration is tagged by
  what carries it nowhere — it is documented in prose and in the breakdown,
  and the entry's three tags are the ones with full sections behind them:
  `canvas-particles`, `drag-physics`, `marquee`.
- Contrast discipline bent the classic vaporwave move of setting body copy
  in neon: pink measures 7.5:1 on deep purple so it *may* carry text, but
  long copy still goes through lavender-white (15.4:1) / haze (10.0:1);
  violet (5.7:1) is confined to small labels and chrome. The aberration
  ghosts are additive (`mix-blend-mode: screen`) so a smear can only add
  light over the unmoving base glyphs — worst case is brighter, never
  dimmer.
- The marquee reacts to scroll velocity but has no direction awareness —
  the PA always reads left-to-right; reversing it on up-scroll read as a
  glitch, not a broadcast.
- The windows clamp fully inside the stage (±16px) rather than letting you
  throw them across the page — losing NOWPLAYING.EXE behind the schedule
  is a worse fiction than a wall.
