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
숲 SUP — a Korean forest-bathing (산림욕) retreat house below a birch ridge
in Gangwon-do. The page is the walk itself: calm, breathing, alive. Theme
is LIGHT. Everything green is drawn by code — SVG and canvas only, not one
raster image. Aesthetic: organic-nature. Stack: Next.js App Router client
page ("use client"), React 19, TypeScript strict, vanilla CSS (classes
prefixed sup-), vanilla JS animation, zero npm dependencies.

PALETTE (CSS custom properties on .sup-root, every rendered color a named
token): moss #4a5d3a (accent) and loam #2e2a24 on cream #f2efe6; lichen
#a8b89a strictly decorative (it fails AA — derive a secondary-text token
from loam at ~72% alpha instead); sunlight #e9dfa8 only as low-alpha
washes. Derive the grass rows, branch tiers, and understory tones from
these five and name each one. Custom ::selection (moss bg, cream text)
scoped to the root.

TYPE: Instrument Serif (Latin display + italic asides, both styles) and
Gowun Dodum (all Hangul and all body) via next/font/google in a fonts.ts
with literal config objects. Display stack "Instrument Serif, Gowun Dodum,
serif" so the giant 숲 falls through into Gowun with no markup. Korean is
first-class: word-break keep-all, its own line-height, never translationese.

VOICE: a guide leading a breath — second person, gentle, present tense.
~15 lines of real bilingual microcopy. Register line: "Breathe in for
four. The forest is already breathing with you. / 넷을 세며 들이쉬세요.
숲은 이미 당신과 함께 숨 쉬고 있습니다."

STRUCTURE (single scroll, 5 movements):
1. Hero — the signature growth. A procedural L-system plant (axiom X,
   rules X→F[+X][-X]FX, F→FF, 5 iterations, seeded PRNG so SSR and client
   agree) rendered as SVG paths with pathLength=1. One CSS variable
   --sup-grow (0→1) drives every branch's stroke-dashoffset through its
   own [t0,t1] window derived from turtle distance-from-seed, and every
   leaf's opacity/scale through a later window — base grows first, crown
   last. A rAF hook eases the variable to 0.74 over ~5.2s and scroll
   raises the rest within the first viewport, lerped 0.06/frame. The CSS
   fallback is var(--sup-grow, 1): no JS or reduced motion = fully grown.
   A second, smaller shrub (3 iterations, different seed) sits behind as
   a parallax layer. Title: giant 숲 + "SUP" in Instrument Serif, kicker
   "FOREST BATHING · 산림욕 리트릿", a pill CTA anchoring to the breathing
   section, a scroll hint. A sunlight radial wash breathes over 17s.
2. The wind field — the screen-recordable moment. A DPR-capped (2) canvas
   meadow: ~450 instanced grass blades in three depth rows (two tones per
   row so a frame costs six strokeStyle changes), each one quadratic
   curve with its own spring (stiffness 0.03–0.06, damping 0.88–0.93).
   Pointer movement writes horizontal velocity into a 96-cell 1-D wind
   field (gaussian deposit) that diffuses (0.22/frame) and decays
   (0.945/frame), so a flick sends a visible breeze traveling across the
   grass. Ambient breeze = three unrelated sines + a slow traveling gust,
   so touch devices and idle pointers still see wind. Tap parts the grass
   outward. Add ~22 drifting pollen motes. Pause the loop offscreen (IO)
   and on hidden tabs; reduced motion draws one composed mid-gust frame.
3. One breath — a usable 4·4·4 guide. A single rAF clock drives both a
   soft orb (scale 0.76+0.3·breath via a CSS variable, half-sine eased)
   and the phase word + countdown (들이쉬세요/머금으세요/내쉬세요), so
   they never drift. The written instruction sits above the orb and
   carries the whole exercise — the motion is never required to
   understand it. A real <button> (aria-pressed) pauses/resumes; under
   reduced motion the orb holds still and the button starts a text-only
   count. The animated readout is aria-hidden.
4. The retreats — a quiet ledger of four programs (새벽 숲길 Dawn Walk
   06:00, 이끼 명상 Moss Meditation 11:00, 계곡 귀 기울이기 Stream
   Listening 15:00, 밤의 숲 Night Forest 21:00), each with one sensory
   line in both languages. Hairline rules, generous space, no cards.
5. Footer — "COME BREATHE · 숨쉬러 오세요", the fictional place (강원도
   인제 · 숨은골 자작나무 능선 아래, N 38.06° E 128.17° · 612 m), a
   mailto, "© 2026 숲 SUP — the forest keeps your pace. 숲은 당신의
   속도에 맞춥니다."

HARD REQUIREMENTS:
- prefers-reduced-motion: plants fully grown (no draw-on), grass one
  static beautiful frame, orb resting mid-breath, no sway/sun/reveal
  animation — a complete composed page. usePrefersReducedMotion =
  useSyncExternalStore over matchMedia.
- Touch: the meadow self-waves; nothing is hover-only; parallax simply
  rests.
- Keyboard: every control reachable; custom moss :focus-visible ring.
- Contrast: AA for all text (loam 12:1, moss 6.2:1, bark 5.4:1 on cream);
  lichen never carries meaning; the breathing words stay ≥4.5:1 over the
  orb.
- No content hidden without JS: add a .sup-js class on mount and gate
  every pre-reveal style behind it; SSR state is the finished page.
- Animate only transform / opacity / filter / stroke-dashoffset. Hover
  states snap; only entrances ease. No console errors.
- Canvas rAF throttled ~64fps, dt clamped, paused offscreen and on
  visibilitychange; every observer and listener cleaned up.
- The canvas gets role="img" with a bilingual description; the plant SVGs
  are aria-hidden decoration (the title carries the meaning).
- On mount: window.parent?.postMessage({ type: "oneshot:ready",
  slug: "sup" }, "*").
- Composed at 360px and 1440px+ (hero plant recedes behind the copy on
  small screens; the retreat ledger re-stacks).

FILES: page.tsx (default export, applies font variables + sup-root),
components/ (Hero, WindField, BreathingGuide, Retreats, Footer, plant.ts
generator), hooks/ (usePrefersReducedMotion, useGrowth, usePointerDrift,
useReveal), styles.css (all tokens + styles), fonts.ts. Relative imports
only.
```

## Known deviations

- The growth clock intentionally runs backward a little when you scroll
  back up (the crown recedes by up to 26%). The brief said "grows along
  scroll progress"; the reversible reading felt more like a forest keeping
  your pace and was kept.
- With JavaScript on, the SSR frame is the fully grown plant and the hook
  then resets `--sup-grow` to 0 and regrows it — on slow connections the
  finished tree can flash before hydration. Accepted as the price of "no
  content hidden without JS"; it reads as a slow blink.
- The brief's third listed technique candidate was char-split-reveal on
  the breathing text; it was dropped in favor of pointer-parallax (the
  two hero plant layers plus the copy), because splitting the guidance
  text into animated glyphs worked against the a11y rule that the
  instruction never depend on motion. Only honestly shipped techniques
  are tagged.
- Grass blade counts are derived from viewport width (~450 at 1440px),
  not a fixed number; very narrow screens get proportionally fewer
  blades, which also keeps 360px smooth.
- The pollen motes ignore the pointer wind field and only ride the
  ambient drift — coupling them looked busier, not calmer, and the point
  of the page is calm.
