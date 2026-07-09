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
RASTER — a standards bureau that certifies grid systems the way a metrology
institute certifies weights. Deadpan, authoritative, Swiss/International
Typographic Style taken to its logical extreme. The page IS a certified
standard sheet. Theme: light. Aesthetic: swiss-typographic. Stack: Next.js
App Router client page ("use client"), React 19, TypeScript strict, vanilla
CSS (classes prefixed raster-), vanilla JS animation, zero npm dependencies,
pure code — no images.

PALETTE (CSS custom properties on .raster-root): paper #f7f7f5, ink
#111111, ONE red #e30613. Nothing else — ever. Derived alpha tokens only
(red hairlines at 28%/16%, a 2.5% column tint, soft ink rules). Red is for
marks, rules, the stamp, and large display fills; it measures ~4.55:1 on
paper — inside AA for normal text but without margin, so never set small
red text. Custom ::selection (red bg, white text) scoped to the root.

TYPE via next/font/google in fonts.ts with literal config objects:
Archivo as a VARIABLE font (weight: "variable", axes: ["wdth"]) — the width
axis (62–125) is the design's entire expressive tool; IBM Plex Sans KR for
every Hangul glyph (stack order lets Korean fall through Archivo with no
markup, plus explicit :lang(ko)); Space Mono for annotations, coordinates,
and tabular figures.

VOICE: lowercase specification prose, dry and exact — clauses, approval
years, tolerances. ~15 lines of real bilingual copy, Korean first-class and
native (transcreation, not translation). Register: "grid no. 04. approved
1972. still correct. / 그리드 제4호. 1972년 승인. 지금도 유효함." Banned:
enthusiasm.

STRUCTURE (single scroll, 5 sections):
0. Hero (sheet 00, one viewport) — Archivo wordmark RASTER split per glyph;
   on load each glyph animates font-variation-settings 'wdth' 62 → 125 with
   a 55ms stagger (accessible split: aria-label on the h1, aria-hidden
   letter spans); hovering a glyph narrows it to 62. KR subtitle "그리드
   시스템 인증국". Visible construction: a 24px baseline grid of faint red
   hairlines, plus the fixed column overlay (below). A crosshair instrument
   follows fine pointers with RAW coordinates (no lerp) rendered in a Space
   Mono chip: "x 0413 y 0227 — col 04/12"; without a fine pointer, or under
   reduced motion, it stands at the certified center reading "x 0.500
   y 0.500". A red circular certification stamp (SVG) draws itself in via
   stroke-dashoffset with pathLength=1. Three spec lines of copy.
1. Demonstration (signature) — a keyboard-operable segmented control (two
   aria-pressed buttons, 06/12) re-certifies the page between 6 and 12
   columns. data-grid on a scope div drives --raster-cols and per-mode
   grid-column spans. Every [data-flip] element re-snaps via FLIP: measure
   First rects, flushSync the state change, measure Last, invert with
   translate+scale inline, release next frame so a CSS transition
   (transform 560ms cubic-bezier(0.2,0,0,1)) plays it home. Interruption-
   safe (First is the visual rect) and offscreen-skipped. The fixed column
   overlay is TWO layers (12-col and 6-col grids sharing the content's
   exact frame/gutter) cross-faded by opacity. A live-region status line
   announces the new certification. Specimen: 8 abstract blocks whose spans
   re-pack 12:[5,7][4,4,4][9,3][12] → 6:[6][3,3][2,2,2][6][6].
2. Modular scale — six steps of ratio 1.333 (the perfect fourth), annotated
   in Space Mono (st n · ×1.333ⁿ = value). Font sizes are the settled
   values; scroll drives transform: scale from exactly one step below
   (1/1.333 ≈ 0.75) to 1 with smoothstep easing and a 0.09 progress stagger
   — the heading arrives at its size by traveling the ratio itself. One
   getBoundingClientRect per rAF; writes after reads. A mono chip reads the
   interpolation t.
3. Registry — a real <table> of certified grids (no., columns, gutter,
   approval year, status): 3px top rule, 1.5px header rules, hairline rows,
   Space Mono tabular figures right-aligned. Red geometric status marks
   (filled square approved / hollow under review / red X deprecated) always
   doubled by black text. Exactly one DEPRECATED row (grid no. 05, odd
   column count — "odd column counts do not divide"). Static: records do
   not animate.
4. Footer — giant width-animated verdict STILL CORRECT (same split-glyph
   axis animation, fired by IntersectionObserver), a red certification rule
   that draws in, bureau address, hours, certificate block, "© 2026 raster —
   the grid does not negotiate. 그리드는 협상하지 않는다."

HARD REQUIREMENTS:
- prefers-reduced-motion: no width-axis animation (glyphs stand at 125),
  instant re-layout instead of FLIP, settled modular scale, centered static
  crosshair, stamp and rule fully drawn (reset stroke-dasharray/offset in
  the media query — killing the animation alone leaves them invisible).
- Touch: toggle taps, crosshair centers, no hover-only meaning.
- Keyboard: everything reachable; red :focus-visible outline.
- Content visible without JS: entrance animations and FLIP transitions are
  gated behind a .raster-js class added on mount; the static page is the
  finished 12-column document.
- Animate transform / opacity / font-variation-settings (+ SVG
  stroke-dashoffset, paint-only) — nothing that lays out. Measure inside
  rAF; batch reads before writes.
- usePrefersReducedMotion via useSyncExternalStore over matchMedia.
- On mount: window.parent?.postMessage({ type: "oneshot:ready",
  slug: "raster" }, "*").
- Composed at 360px and 1440px+; the demo grid keeps its column count on
  mobile (the demo IS the grid), the furniture stacks.
- Zero console errors; listeners/observers/rAF clean up on unmount.

FILES: page.tsx (default export, applies font variables + raster-root),
components/ (Hero, GridProvider [context + overlay + GridToggle section],
ModularScale, SpecimenTable, Footer, WidthMark), hooks/
(usePrefersReducedMotion, useFlip), styles.css, fonts.ts. Relative imports
only.
```

## Known deviations

- The brief asserted #e30613 on #f7f7f5 fails AA at ≈4.0:1. Measured
  properly it is **4.55:1 — a pass, by 0.05**. The policy survives anyway:
  a margin that thin is not a certification, so red still carries only
  marks, rules, and large display fills; every red status mark is doubled
  by black text.
- The crosshair readout is deliberately **not** tagged `pointer-parallax`:
  it has no layered depth, no lerp — it is a raw instrument. Claimed
  techniques are only the three with breakdown sections (flip-layout,
  char-split-reveal, svg-line-draw).
- The FLIP morph uses translate + scale, so text inside re-snapping blocks
  distorts for the 560ms of travel. Counter-scaling children was rejected
  as over-engineering; the distortion reads as the machinery working.
- `stroke-dashoffset` joins the transform/opacity/font-variation-settings
  whitelist for the stamp and certification rule — it is paint-only and
  never lays out.
- The reduced-motion CSS is a blanket `animation/transition: none` over the
  root plus explicit dash resets, rather than per-animation opt-outs: every
  base state in this entry is the finished document, so the blanket is safe
  by construction.
- WidthMark lives in components/ as its own file (hero and footer share
  it), bringing the component count to six.
