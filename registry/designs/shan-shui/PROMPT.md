---
provenance: distilled-recipe
model: glm-5.2
harness: ZCode CLI
date: 2026-07-17
attempts: 1
verification:
  status: unverified
---

The prompt below is a distilled recipe: the full brief this entry was built
from, compressed to what a strong model needs to regenerate a comparable
page in one shot. It is written honestly — this entry is the product of an
iterative human + AI build, not a single-message generation.

```text
Build a complete, art-directed landing page: 山水 SHAN-SHUI — a
procedurally-generated, infinitely-scrolling Chinese ink-wash landscape that
paints itself live in the browser. There is no brand, no product, no booking
flow; the page IS the painting, and the painting is the code. Every ridge is
summed from value noise, mist is a radial-gradient pooled in valleys, the
foreground pines are recursive brushstroke clusters. The scroll unrolls
forever in both directions.

EXPLICIT AMBITION: this entry aims to answer — and surpass — `{Shan, Shui}*`
by LingDong (https://github.com/LingDong-/shan-shui-inf), the canonical
procedurally-generated, infinitely-scrolling Chinese landscape (SVG, drawn
from noise). Where the benchmark is a fixed autoplaying SVG scroll, this
entry must be: (a) canvas (the authentic sumi medium — wet ink, blurred
washes, radial-gradient mist), (b) layered ink density AS depth (five ridge
layers, farthest first, each paler/smaller — 远山如黛, "distant mountains are
like eyebrow pigment", distance as ink alpha not perspective), and (c)
reactive — the scroll IS the unrolling, mist leans toward a fine pointer,
weather cycles through four seasons as you read.

Aesthetic: washi-sumi-e (the gallery's ink/paper/negative-space family —
the documented sibling/successor of KEMURI's smoke). Theme LIGHT. Stack:
Next.js App Router client page ("use client"), React 19, TypeScript strict,
vanilla CSS (classes prefixed shan-), vanilla JS animation, ZERO npm
dependencies. Pure code: no images anywhere — the landscape is canvas, the
seal is SVG. media.source "code".

PALETTE (CSS custom properties on .shan-root; every rendered color a named
token): xuan rice paper #f4ede0 (ground), aged xuan #ece3d2 (panels/washes),
sumi ink #1a1714 (15.3:1 on xuan — primary text, wordmark 山水, nearest
ridges, the colophon ground), ink-strong #3a342c (10.6:1 — section titles),
ink-mid #5a5249 (6.6:1 — body prose, mid ridges), ink-soft #7d756a (3.9:1 —
far ridges, large/decorative only), pale-wash #9a9488 (2.6:1 — farthest
ridges, decorative only), mist #b8b1a3 (paint only, never text), vermillion
#a83232 (the artist's chop — 5.7:1 on xuan for large/non-text; only 2.7:1
on sumi so decorative-only in the dark colophon). Derive vermillion-deep
#8a2626 (7.6:1) wherever vermillion must function as text on paper
(eyebrows, focus ring, ::selection ground). No blue, no green except the
faintest summer wash. The only "gradient blob" is mist, simulated.

TYPE: Cormorant Garamond (Latin: 400/500/600, italic) + Ma Shan Zheng
(every Chinese DISPLAY glyph — 山水, seals, the couplet; a brush-calligraphy
face) + Noto Serif SC (Chinese body, where Ma Shan Zheng would be illegible)
via next/font/google with literal configs in fonts.ts. Stack order
Cormorant → Ma Shan Zheng → Noto Serif SC → serif so CJK falls through with
no markup. Chinese must never render in a fallback sans.

VOICE: literati-quiet, present tense, bilingual EN/ZH. The Chinese is NOT a
translation — it is the older voice of the painting, preferring classical
phrasing (遠山如黛, 山自生卷自展, 山不知其為畫). Write ~15 lines of real
literary copy. Never "painting" as a noun for the output (say "the scroll"),
never "infinite" (say "unending" or show it), never "AI" (the colophon names
code).

STRUCTURE (single scroll, 4 beats):
1. Loader — a beat of blank xuan, a vermillion seal (山, mountain) pressed
   (scale 1.18→0.96→1, −5° set, 720ms ease-stone), then the paper lifts
   (680ms). Any key/tap/wheel/scroll lifts it at once; a hard timeout lifts
   it regardless; under reduced motion / no-JS it never mounts. onDone fires
   as the lift STARTS.
2. Hero — the signature. A DPR-capped (≤2) canvas painting the LIVE
   landscape behind everything:
     - RIDGES: 5 layers (farthest first), each h(x) = Σ 4 octaves of seeded
       value noise (freqs 1/520, 1/360, 1/240, 1/170, 1/120 px⁻¹; weights
       1, 0.52, 0.27, 0.13; ridge-sharpened by reflecting noise around 0.5
       for pointed peaks). Each layer filled as a silhouette path; ink alpha
       by depth 0.14/0.26/0.42/0.62/0.82 (远山如黛). Seeded permutation (1368)
       so the scroll is the same painting every visit.
     - SCROLL = WORLD: page-scroll-y drives a world-x offset (world-x = 480
       + scroll-y). Each layer parallaxed by depth (×(0.4+depth·0.16)) so
       far ridges move slower. The same noise generates forever in both
       directions — infinite scroll, no asset.
     - MIST: ~26 radial-gradient blobs pooled in the valleys between ridge
       layers; a two-sine autonomous breeze (7·sin(0.13t)+4·sin(0.31t+0.7),
       mutually prime) drifts them; a fine pointer biases their pooling y
       with asymmetric energy lerp (attack 0.045/release 0.016 — notices a
       hand fast, forgets slowly); scroll velocity adds a capped gust
       (±60px/s). On touch or idle the breeze keeps it alive.
     - SEASONS: the weather slowly cycles spring→summer→autumn→winter over
       2400 world-px per boundary, blended (never cutting): mist density,
       far-ridge fade, a faint sky wash, and a rare seasonal accent (plum
       dots in spring, falling snow in winter).
     - FOREGROUND PINES: recursive brushstroke trees (deterministic per
       world-tile) drawn as branching stroke clusters on the nearest ridge.
   The wordmark SHAN-SHUI (split per letter, aria-hidden spans behind
   aria-label, 95ms cadence after loader lifts) sits over the mountains with
   a paper-colored text-shadow so it reads under passing mist. JP sub
   equivalent 山水·山與水; kicker "a painted hand-scroll · 水墨手卷"; est line.
   The canvas accepts pointer events only on fine pointers; touch falls
   through to scroll.
3. The scroll guide (scroll-scrub-pinned, SIGNATURE #2) — a pinned stage
   whose parallax layers (the four characters 遠山如黛 at four depths/sizes/
   opacities) part as you scroll, driven by a single --p (0..1) custom
   property written from the section's viewport progress (one rAF-gated
   scroll listener, no layout writes). Explains the three-distance principle
   (三遠: 高遠/深遠/平遠, Guo Xi 11th c.) as a hairline ledger; a vertical
   couplet 一山一水，皆從墨中來 reveals glyph by glyph on the brush cadence.
4. The chop (03) — an interactive vermillion seal (心, heart-mind). A real
   button: press → the floating chop descends (scale/translate keyframe),
   a fresh vermillion impression blooms on the paper beside it (key=count
   remount), an aria-live count announces impressions. Keyboard-reachable,
   touch-friendly, no hover dependency.
5. Colophon + footer — the page inverts once: sumi ground, xuan voice. "The
   scroll rewinds. The mountains remain. · 卷可重展，山自長存." A bordered
   "rewind the scroll" button whose ink-fill is scaleX(0→1) vermillion
   pseudo-element. A colophon paragraph naming honestly that everything was
   code. A DEDICATION line: "In respectful conversation with {Shan, Shui}*
   by LingDong — the canonical procedural landscape. This entry aims to
   answer it for the live, scrollable, pointer-breathing web." © 2026
   SHAN-SHUI 山水 · 一卷在手，水墨自成.

TEXTURE: one static full-viewport SVG feTurbulence pass (fractalNoise 0.62,
2 octaves) mapped to sumi at ≤5% alpha, multiplied — rice-paper fibers,
never animated — plus an amber age-vignette and faint laid lines (8px pitch).

HARD REQUIREMENTS:
- prefers-reduced-motion: loader absent, landscape paints ONE composed
  still (a held breath of mist, mid-plum-spring), parallax layers rest at
  --p: 0.5, all ambient cycles and transitions dead. The page reads as a
  finished painting, not a paused video.
- No text hidden without JS: add .shan-js on mount; every pre-reveal style
  gated behind it. SSR state = the completed page.
- Touch: the mist self-drifts; the seal is a real button; nothing lives
  behind hover.
- Keyboard: custom vermillion-deep :focus-visible ring (vermillion in the
  colophon).
- Animate transform/opacity/filter only; the exceptions that write canvas
  state and the single --p custom property run in rAF and touch no layout.
  rAF loops pause offscreen (IntersectionObserver) and on visibilitychange.
- Split text: visually-hidden originals + aria-hidden glyphs; the canvas
  stage is role="img" with a bilingual EN/ZH description.
- Custom ::selection (vermillion-deep ground, xuan text) scoped to the root.
- On mount: window.parent?.postMessage({ type: "oneshot:ready",
  slug: "shan-shui" }, "*").
- Composed at 360px and 1440px+: the guide's three-distance rows re-grid,
  the footer stacks, the wordmark stays one line.

FILES: page.tsx (fonts + .shan-root + loader state + scroll ref),
components/ (Loader, Hero, LandscapeCanvas, Cadence, ScrollGuide,
SealStamp, Footer), hooks/ (usePrefersReducedMotion, useReveal,
useScrollProgress, usePointerMist, landscape.ts noise+gen module),
styles.css (all tokens + styles), fonts.ts. Relative imports only. Zero
dependencies.
```

## Known deviations

- **The landscape is canvas ink, not generated painterly images —
  deliberate.** The entry's thesis (shared with KEMURI) is that the
  washi-sumi-e family does not need a diffusion model: layered value-noise
  ridges under ink-alpha aerial perspective, radial-gradient mist, and
  recursive brushstroke trees read as a literati painting. `media.source`
  is `"code"` and must stay that way.
- The brief's vermillion `#a83232` measures 5.7:1 on xuan (AA for large
  text and non-text) but only 2.7:1 on sumi, so it is decorative-only in
  the dark colophon (the seal as object) and a working token `vermillion-deep
  #8a2626` (7.6:1) was derived for functional accents (eyebrows, focus ring,
  ::selection) on either ground.
- The `{Shan, Shui}*` benchmark draws SVG silhouettes; this entry draws
  canvas. The deviation is the whole point — canvas mist and blurred ridge
  washes read as wet paint where SVG reads as vector. The trade
  (resolution-independence for atmosphere) is accepted and named in the
  colophon's dedication.
- The scroll drives `world-x` from **absolute** scroll position (not
  integrated velocity), so the painting is deterministic for any scroll
  depth — rewinding returns to the same ridge. Velocity only flavors mist
  drift (a flick sends a gust). The brief's "scroll drives continuous
  generation" is honored via absolute position; integrated velocity would
  make the painting drift and break determinism.
- The pointer biases mist pooling **vertically** (y) only, toward the hand;
  horizontal pull was tried and made the mist feel leashed to the cursor.
  The pointer's x only shapes where along the field the pull applies.
- `canvas-particles` is listed as a technique tag because the mist is a
  particle system (26 advected blobs) — the ridges themselves are path fills
  on canvas, not particles, but the mist qualifies the tag and earns its
  breakdown section. `scroll-scrub-pinned` is earned by the guide's --p
  parallax. `pointer-parallax` is earned by the mist's pointer-breath.
  Every listed technique earns a breakdown section.
