---
provenance: distilled-recipe
model: zai-coding-plan/GLM-5.2
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
피다 BLOOM — a Korean botanical perfume house beside a peony field in
Seogwipo, Jeju. The page IS the scent opening: an ink-line botanical
draws itself stroke-by-stroke as you arrive, watercolor washes bloom
outward through feTurbulence displacement and settle, and one pinned
flower opens petal-by-petal with your scroll. Theme is LIGHT. Everything
botanical is drawn by code in SVG — not one raster image, zero media
payload. Aesthetic: ink-bloom (the 2nd of 3 — must be visually DISTINCT
from SAKURA, the 1st, which is canvas-particles + dark/pink). BLOOM is
SVG-line-draw + watercolor + light/cream. Stack: Next.js App Router
client page ("use client"), React 19, TypeScript strict, vanilla CSS
(classes prefixed bloom-), vanilla JS animation, zero npm dependencies.

PALETTE (CSS custom properties on .bloom-root, every rendered color a
named token): warm cream #faf3e8 (ground, NOT white); ink #2a2620
(primary text + the SVG line-art strokes themselves, 12.4:1); botanical
green #3d6b3a (the single accent — wordmark, numerals, CTA, focus ring,
6.9:1); bark #5c554a (secondary text, 5.7:1); sage #8aa67a and blush
#d98a9e STRICTLY decorative (they fail AA — never functional text, only
leaf fills and the single petal wash); gold #b8924a decorative (anthers);
hairline #cdbfa8. Derive the SVG stroke tiers (c-stem #4a6b3f, c-branch
#5f7d4f, c-leaf #3d6b3a, c-vein #6f8f5e, c-petal #2a2620, c-calyx
#4a6b3f) and wash fills (wash-green #6f8f5e, wash-blush #e8b8c4, wash-sage
#8aa67a, all low-alpha) and name each. Custom ::selection (blush bg, ink
text) scoped to the root. DISTINCT FROM SAKURA: light cream ground +
botanical green accent, not dark + pink.

TYPE: Cormorant Garamond (Latin display + italic asides, weights 400/500,
both styles) and Noto Serif KR (all Hangul, the Korean-first voice,
weights 400/500) via next/font/google in a fonts.ts with literal config
objects. Display stack "Cormorant Garamond, Noto Serif KR, serif" so the
giant 피다 falls through into Noto Serif KR with no markup. Korean is
first-class: word-break keep-all, its own 1.78 line-height, never
translationese — the Korean line is the perfumer's own voice, shorter
and warmer than the English.

VOICE: a perfumer writing in the margin — sensory, present tense, short.
~15 lines of real bilingual microcopy, Korean first. Register line: "A
scent is not a thing. It is a thing opening. / 향기는 사물이 아닙니다.
피어나는 하나의 일입니다."

TEXTURE: two behaviors, neither an opaque overlay. (1) PAPER FIBER — one
static feTurbulence (fractalNoise, baseFrequency 0.9, seed 7) fixed over
the whole page at ~4% cream-on-cream via mix-blend-mode: multiply; never
animates; keeps cream from reading as flat #fff. (2) WATERCOLOR BLOOM —
the animated texture and the page's namesake: each botanical wash shape
rides inside an SVG feTurbulence + feDisplacementMap filter whose scale
attribute starts at ~62 ("still wet") and a rAF loop eases it to 0 on
reveal. Turbulence baseFrequency/seed never change (computed once); only
displacement pays per frame. The botanical LINE-ART (stems, leaves,
petals) is plain SVG strokes with NO filter — crisp line, blurred wash
beneath. That contrast IS the medium.

STRUCTURE (single scroll, 4 movements):
1. Hero — the signature draw-on. A hand-authored botanical plate (a
   flowering stem with two branches, four leaves, a calyx, and a
   five-petal bud) rendered as SVG paths with pathLength=1. One CSS
   variable --bloom-draw (0→1, fallback 1 = fully drawn) drives every
   stroke's stroke-dashoffset through its own [d0,d1] window (stem
   0–0.18, branches 0.18–0.34, leaves 0.30–0.58, flower 0.58–1.00), so
   the plate draws in narrative order — base first, bloom last. A rAF
   hook (useLineDraw) eases the variable to 0.7 over ~2.4s and scroll
   raises the rest within 0.9vh, lerped 0.12/frame; the loop pauses
   offscreen (IO) and on hidden tabs. CSS fallback is var(--bloom-draw,
   1): no JS or reduced motion = fully drawn. A blush + green watercolor
   wash sits behind the lines and blooms (useWashSettle, displacement
   62→0 over 1700ms) as the plate draws. Title: giant 피다 + "BLOOM" in
   Cormorant, kicker "식물 향수 하우스 · BOTANICAL PERFUME", a pill CTA
   anchoring to the pinned section, a scroll hint. A warm radial
   (blush+gold, low alpha, upper-right) breathes over 19s. Idle sway on
   the line-art rotate ±0.4° at 11s.
2. Scent notes — three botanical plates (top/heart/base: a citrus leaf, a
   peony, a root/tuber) each in its own card, each with its OWN drawing
   clock (useLineDraw per card) and its own watercolor wash. Bilingual
   labels, latin names, one sensory line each. Three-up grid at 1160px,
   stacks under 900px.
3. THE BLOOM — the screen-recordable moment. A PINNED (position: sticky)
   section 260vh tall whose sticky inner stays fixed while scroll
   progress drives --bloom-open 0→1 (useScrollProgress, lerp 0.14/frame,
   pauses offscreen + hidden tabs). One large 13-petal flower (8 outer +
   5 inner, plus a gold disc and 6 anther dots) where each petal's
   transform is computed from --bloom-open: outer ring opens first (scale
   0.42→1, rotate −8°→0°, opacity 0.4→1), inner ring opens later (starts
   at ~0.35 of the clock, scale 0.36→1, rotate −10°→0°). A blush wash disc
   behind fills (opacity) as it opens. The line-art here is FULLY
   PRE-DRAWN (this section is about OPENING, not drawing). Copy column
   beside it: "Scroll, and the house scent opens — petal by petal /
   스크롤하면, 하우스의 향이 꽃잎을 하나씩 펼칩니다", a <dl> of three notes
   (peony, vetiver, neroli). A hairline progress bar at the foot of the
   pinned view fills with --bloom-open. CSS fallback var(--bloom-open, 1)
   = fully open. Under reduced motion the section collapses to one screen
   (height auto, position relative) so the flower is simply open.
4. Footer — a tiny static fully-open flower mark, "피어난 것을,
   기다리지 마세요 · what has bloomed, do not wait for", the fictional
   place (제주 서귀포 · 작약밭 옆 작은 향원, N 33.24° E 126.56°), a
   mailto, "© 2026 피다 BLOOM — 향은 피어나는 일입니다."

HARD REQUIREMENTS:
- prefers-reduced-motion: every line fully drawn (--bloom-draw fallback
  1, hooks no-op), every wash settled (displacement markup scale=0,
  useWashSettle no-op), the pinned flower fully open (--bloom-open
  fallback 1, useScrollProgress no-op), and the pinned section collapses
  to auto height so nothing is gated behind scroll. A complete composed
  plate. usePrefersReducedMotion = useSyncExternalStore over matchMedia.
- Touch: nothing is hover-only; parallax rests; the pinned flower still
  opens on touch-scroll.
- Keyboard: every control reachable; custom botanical-green :focus-visible
  ring with soft halo.
- Contrast: AA for all text (ink 12.4:1, botanical 6.9:1, bark 5.7:1 on
  cream); sage/blush/gold never carry meaning.
- No content hidden without JS: add a .bloom-js class on mount and gate
  every pre-reveal style behind it; the SSR state IS the finished page
  (every line drawn, every wash settled, flower open).
- Animate only transform / opacity / filter / stroke-dashoffset /
  feDisplacementMap scale attribute. Hover states snap; only entrances
  ease. No console errors.
- Every rAF loop pauses offscreen (IntersectionObserver) and on
  visibilitychange; every observer and listener cleans up on unmount.
- The botanical SVGs are aria-hidden decoration (the titles carry meaning);
  the pinned section's <dl> and copy are real semantic content.
- On mount: window.parent?.postMessage({ type: "oneshot:ready",
  slug: "bloom" }, "*").
- Composed at 360px and 1440px+ (hero plant recedes behind copy on small
  screens; notes stack to one column; pinned bloom re-stacks copy-above-
  flower and shrinks).

DISTINCT FROM SAKURA (load-bearing): SAKURA = canvas-particles + dark +
pink. BLOOM = svg-line-draw + watercolor + light cream + botanical green.
Different medium, different ground, different accent, different signature
moment (pinned flower opening vs particle scatter). A grayscale
screenshot of each must be unmistakable.

FILES: page.tsx (default export, applies font variables + bloom-root +
static paper-fiber feTurbulence overlay), components/ (Hero, ScentNotes,
TheBloom, BloomFooter, botanical.ts path plate), hooks/
(usePrefersReducedMotion, useReveal, useLineDraw, useScrollProgress,
useWashSettle), styles.css (all tokens + the draw-clock + wash + pinned-
bloom CSS), fonts.ts, meta.json, tokens.json. Relative imports only. Zero
dependencies. media.source "code", budgetKB 5120.
```

## Known deviations

- The three scent-note plates each get their own `useLineDraw` instance
  rather than sharing one global drawing clock. The brief implied a
  single shared clock (mirroring sup's `--sup-grow`); giving each card
  its own clock means each draws independently as you scroll into it,
  which reads more like three separate botanical illustrations in a
  journal than one synchronized animation. Cost: three rAF loops instead
  of one, all IO-gated, so offscreen cost is zero.
- The pinned flower's outer ring opens *before* the inner ring (outer at
  ~0.0–0.8 of the clock, inner at ~0.35–0.95), so it reads as unfurling
  outward-in. The brief said "petal-by-petal"; a strict simultaneous
  ring-open felt mechanical, and the staggered tier-open feels more like
  a real peony. The per-petal `--pi` index adds a small intra-ring
  stagger on top of the tier stagger.
- The hero's watercolor wash and the scent-note washes use *separate*
  filter IDs (`bloom-hero-wash`, `bloom-note-<family>-wash`) rather than
  one shared filter, because each plate wants its own turbulence seed
  and baseFrequency (different "weather" per illustration). This is a few
  extra filter primitives but keeps each wash's character distinct.
- `useWashSettle` takes a `disabled` argument (passed `reduced` from the
  caller) rather than calling `usePrefersReducedMotion` itself, so the
  reduced-motion decision stays at the component level alongside the
  other hooks — one source of truth per component for the motion policy.
- The paper-fiber overlay uses `mix-blend-mode: multiply` at 0.9 opacity
  rather than a plain alpha, because multiply keeps the fiber visible
  over the cream without washing it out over the blush washes. On the
  rare browser without filter support the overlay simply doesn't render
  and the cream is a flat color — an acceptable no-JS/no-filter fallback.
