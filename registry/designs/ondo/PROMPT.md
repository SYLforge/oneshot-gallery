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
ONDO — a perfume atelier in a quiet Hannam-dong alley, Seoul, that titles
its scents by temperature: 36.5° (the body), first snow, the warm floor of
an ondol room. Aesthetic: luxury-fashion, THEME DARK. Stack: Next.js App
Router client page ("use client"), React 19, TypeScript strict, vanilla CSS
(classes prefixed ondo-), vanilla JS animation, zero npm dependencies.

NON-NEGOTIABLE ART DIRECTION: pure code, no images. Photoreal product
shots are exactly where this page does NOT go — the bottle is drawn in SVG
gradients (glass body with tapered shoulders, liquid filled to a 36.5°
thermometer gradation, vermeil collar, faceted stopper, warm halo, floor
shadow, hairline strokes). Luxury must come from type, space, and
arithmetic, not from a photograph.

PALETTE (CSS custom properties on .ondo-root): noir #16130f background,
champagne #d8c39a accent, cream #efe9df text, vermeil #9c6b3f (warm
gold-copper). Vermeil measures ~4.0:1 on noir — use it only for hairline
rules and large display type, never small text; derive a secondary-text
token from champagne at 72% alpha (~6.1:1) for eyebrows and Korean glosses.
Custom ::selection (champagne bg, noir text) scoped to the root. Custom
:focus-visible: a 1px champagne hairline, offset 4px.

TYPE: Italiana (Latin hairline display serif, single weight) + Noto Serif
KR (all Hangul + body) via next/font/google in fonts.ts. Display stacks put
Noto after Italiana so Hangul falls through. Extreme letter-spacing
everywhere: eyebrows 0.34–0.42em, wordmark 0.4em, footer call 0.22em.

VOICE: sparse, sensory, present tense, no doubled adjectives. ~12–15 lines
of real copy. Anchor line: "36.5° — the temperature at which skin becomes
a story. / 36.5도 — 피부가 이야기가 되는 온도." Name scents by temperature
and sensation. Korean is transcreated, never translationese.

STRUCTURE (single scroll, 5 sections):
1. Hero — near-black stage, subtle warm radial vignette. The wordmark ONDO
   in Italiana; its letter-spacing "breathes" from tight (0.02em apparent)
   to airy (0.4em): lay the h1 out at FINAL 0.4em tracking, split the four
   characters into aria-hidden spans (aria-label on the h1), and drive a
   per-char translateX in em from a --ondo-breath custom property (0→1) —
   compositor-only, no reflow, CSS default 1 so no-JS renders airy. A rAF
   hook lerps breath toward max(intro, scroll): intro eases to 0.45 over
   2.6s, scroll completes it within 0.7 viewport; lerp 0.055/frame, capped,
   paused offscreen and on visibilitychange. KR sub "온도 · 향의 아틀리에,
   서울", one hairline vermeil rule, line "Scent, read as temperature."
2. The vessel (signature) — the SVG bottle on a FLAT lifted-noir stage.
   Over it, a hairline-framed <canvas> pane of "liquid glass": serialize
   the inline SVG (XMLSerializer → encodeURIComponent data URI → Image),
   draw stage-bg + bottle to an offscreen canvas, then every frame re-render
   through a two-pass strip displacement — rows shifted horizontally, then
   columns vertically — sampled from a precomputed value-noise LUT (1024
   samples, 64 smooth-stepped lattice cells, two octaves, seeded mulberry32,
   wrapping). The warp's lens follows the pointer (lerp 0.08, energy attack
   0.05 / release 0.02, displacement capped ±7px/±4px CSS); on touch or
   after 2.8s idle, an autonomous lissajous shimmer takes over. The pane
   fades in only after its first drawn frame; on image error it hides and
   the crisp SVG stays. DPR capped at 2; loop paused offscreen (IO, 120px
   margin) AND on visibilitychange; dt clamped to 48ms; ~64fps throttle.
3. The collection — a horizontal rail of five scents: 36.5° Body / −2°
   First Snow / 17° Dawn Window / 45° Ondol / 62° First Pour, each with one
   poetic line EN + KO. Card art is an SVG gradient swatch evoking the
   temperature, with a hairline gradation whose height IS the temperature.
   Cards reveal via clip-path inset(0 100% 0 0) → inset(0) at 950ms
   cubic-bezier(.77,0,.18,1), 90ms observer-batch stagger, text +220ms.
   Rail scrolls by touch, mouse drag (pointer capture), wheel (vertical
   intent translated sideways, edges hand back to the page), and keyboard
   (focusable region role, arrows step one card, Home/End).
4. The note — top/heart/base as a vertical typographic ledger with hairline
   rules and generous space; the credo: "We do not ask what a scent
   resembles. We ask how warm it is."
5. Footer — "COME WARM · 온기를 입다", fictional address in a quiet
   Hannam-dong alley, "© 2026 ONDO — measured in degrees, worn as memory.
   도(度)로 재고, 기억으로 입는다.", back-to-top hairline link.

HARD REQUIREMENTS:
- prefers-reduced-motion: wordmark settles airy with no animation,
  refraction renders ONE composed still frame (no rAF loop), clip reveals
  and fades appear instantly, no shimmer, no hint pulse. Use a
  usePrefersReducedMotion hook (useSyncExternalStore over matchMedia).
- Touch: refraction self-shimmers; rail scrolls natively; nothing is
  hover-only.
- Keyboard: rail focusable and navigable; custom champagne :focus-visible.
- Contrast: champagne 10.7:1 and cream 15.3:1 on noir; vermeil only for
  rules/large display (documented).
- No text or content hidden without JS: add an .ondo-js class on mount and
  gate every pre-reveal style behind it; the SVG bottle and all copy are in
  the DOM regardless; the wordmark's CSS default is the final airy state.
- Animate only transform/opacity/filter (letter-spacing is simulated with
  transforms so even the breath is compositor-only).
- On mount: window.parent?.postMessage({ type: "oneshot:ready",
  slug: "ondo" }, "*").
- styles.css only, vanilla CSS, zero npm deps, relative imports only,
  composed at 360px and 1440px+.

FILES: page.tsx (default export, applies font variables + ondo-root),
components/ (Hero, Bottle, Collection, Notes, Footer), hooks/
(usePrefersReducedMotion, useBreath, useReveal), styles.css, fonts.ts.
```

## Known deviations

- **The bottle is SVG on purpose.** The brief's central bet is documented
  rather than hedged: there is no raster image in the entry at all, so
  "luxury" has to survive on Italiana hairlines, spacing, and the gradient
  bottle. A photoreal product shot would have been easier and worse.
- **The refraction is canvas strip displacement, not backdrop-filter or
  WebGL** — so it is tagged `pointer-parallax` (two real layers: the crisp
  SVG beneath, the warped glass above, drifting with the pointer, lerped
  and capped), not `glass-specular` (no backdrop-filter panel) and not
  `webgl-shader`. The breakdown teaches the honest implementation.
- **The letter-spacing "breath" never animates letter-spacing.** The h1 is
  laid out at the final 0.4em tracking and the four characters are actually
  split into aria-hidden spans moved by per-char translateX — which is why
  the entry claims `char-split-reveal`. The property the brief names is
  simulated by transforms so the effect stays compositor-only.
- Vermeil `#9c6b3f` measures ~4.0:1 on noir, short of AA for body text, so
  it was demoted to hairline rules and large display type (the 36.5°
  numeral); a derived champagne-dim (champagne @ 72% alpha, 6.1:1) carries
  all secondary text instead.
- The rail's wheel handler only captures vertical wheel while the rail can
  still travel in that direction; at either edge the event is left alone so
  the page keeps scrolling — the brief said "scrollable by wheel" and this
  is the least-hostile reading.
- Without JavaScript the glass pane's hairline frame is still visible over
  the crisp bottle (an empty sheet of glass) — accepted, since the frame is
  honest about being an object even when it cannot ripple.
