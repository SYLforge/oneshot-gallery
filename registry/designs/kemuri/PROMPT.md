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
KEMURI 香房 — an incense atelier in Kyoto, est. 1927, that does not sell
perfume; it sells an hour of stillness. The page is that hour, rehearsed.
Aesthetic: washi-sumi-e. Theme is LIGHT — warm paper, not a dark room
(until the very end). Stack: Next.js App Router client page ("use client"),
React 19, TypeScript strict, vanilla CSS (classes prefixed kemuri-),
vanilla JS animation, zero npm dependencies. Originally pure code (no
images — smoke canvas, paintings SVG); the three plates have since been
swapped to generated sumi-e paintings, embedded as SVG `<image>` so the
displacement-settle filter still owns them. See "Image recipe" below and
the first Known-deviation.

PALETTE (CSS custom properties on .kemuri-root; every rendered color a
named token): washi #efe7d8 (ground), aged washi #e3d7c0 (plate paper),
sumi ink #1c1814 (14.4:1), smoke gray #8a8178, ember #c96f2e (the accent),
gold leaf #b08d4a. Ember measures ~2.9:1 on washi and gold ~2.5:1 — treat
both as decorative there and derive two working tokens: ink-soft (sumi
thinned to ≈#4f4a43, 7.1:1) for all secondary text, and ember-deep
(≈#a04f16, 4.7:1) wherever ember must function on paper (eyebrows, menu
hours, focus ring, ::selection ground). In the dark CTA section ember and
gold clear AA on sumi and may finally be text. No pink anywhere — this is
smoke and ash, not blossoms.

TYPE: EB Garamond (Latin: 400, 500, italic) + Zen Old Mincho (every
Japanese glyph) via next/font/google with literal configs in fonts.ts.
Stack order Garamond → Mincho → serif so kanji fall through with no
markup; also style :lang(ja) explicitly (mincho, +0.06em tracking).
Japanese must never render in a fallback sans.

VOICE: koan-quiet, present tense, bilingual EN/JA. The Japanese is not a
translation; it is the older voice of the same house. Write ~15 lines of
real literary copy: "The smoke does not hurry. Neither should you. /
煙は急がない。あなたも。" Incense-clock, ash, ember, the hour. Never
"luxury", never "experience".

STRUCTURE (single scroll, 6 beats):
1. Loader — a beat of blank washi, an ember seal (煙) pressed into it
   (press: scale 1.14→0.97→1 with a −4° set, 700ms), then the paper lifts
   (650ms translateY+opacity). Any key/tap/wheel/scroll lifts it at once;
   a hard timeout lifts it regardless; under reduced motion (or no JS) it
   never mounts. onDone fires as the lift STARTS so the hero cadence
   overlaps it.
2. Hero — the signature. A censer (inline SVG: sumi bowl, three legs, gold
   rim hairline, one leaning stick, an ember dot that breathes by CSS) at
   the bottom hem, and above it a DPR-capped (≤2) canvas drawing ONE
   ribbon of smoke with CURL NOISE: build a scalar potential ψ from two
   octaves of seeded value noise (feature sizes ~150px and ~56px), offset
   the field's y by t·26px/s so eddies rise with the plume, and advect
   ~260–820 particles (Float32Array, count by area) with velocity
   (∂ψ/∂y, −∂ψ/∂x) — divergence-free, so the smoke coils but never
   compresses or tears. Particles: buoyancy 46px/s, velocity relaxation
   2.4/s (inertia), life 6.5–11s, size grows ~5× over life, young smoke
   drawn with a darker ink sprite crossfading to pale smoke gray, an ember
   glint riding the first half-second. The ribbon bends DOWNWARD under
   lerped scroll velocity (lag toward 210px/s per px/ms, capped ±190,
   smoothed 6.5/s, samples staler than 140ms = stopped) and LEANS toward a
   fine pointer (pull capped ±54px/s, energy attack .055/release .018);
   on touch or idle a two-sine breeze (~30s and ~13s periods) keeps it
   alive. Pre-advect 120×85ms steps before first paint so the plume is
   already mid-air. Pause via IntersectionObserver AND visibilitychange.
   Reduced motion: warm up, draw one composed still, stop. The smoke
   canvas sits ABOVE the giant EB Garamond wordmark KEMURI (per-letter
   aria-hidden spans behind aria-label, 110ms cadence after the loader
   lifts) — the wisps cross the letters. JP sub 煙 · 香の間; kicker
   "AN HOUR OF STILLNESS · 静けさを、一時間"; est. line.
3. The poem (香時計) — 5 lines vertical-rl Japanese (Zen Old Mincho,
   column pitch line-height 2.5) revealing glyph by glyph (60ms/glyph,
   620ms/column — incense pacing) beside an italic English translation
   arriving per line, half a beat behind. Accessible split text: real
   string in a visually-hidden span, animated copies aria-hidden. A
   rotated (−6°) ember seal 静 pressed at the poem's foot. Intro: temples
   once measured the afternoon in smoke — one stick, one hour.
4. Ink plates (SIGNATURE #2) — three sumi-e paintings. The art itself is
   generated (ComfyUI sumi-e; see image-recipe below) and embedded as an
   SVG `<image>` inside the SAME per-plate feTurbulence (baseFrequency
   ~0.01, 2 octaves) + feDisplacementMap settle wrapper the vector version
   used: (壱) distant mountains with a gold sun, (弐) a bare branch with
   one ember bud, (参) a censer whose smoke is one brushstroke drawn three
   times. SVG filters act on raster `<image>` exactly as on vector paths,
   so the ink-settle motion survives the swap to real painted texture.
   Markup ships scale=0 (settled — the no-JS and pre-JS state); on mount
   JS raises scale to 110, and when a plate enters view a rAF loop eases
   the scale attribute 110→0 over 1900ms (cubic out): the ink settles out
   of water. Animate ONLY the displacement scale — turbulence never
   changes, so its noise is computed once. Captions fade in as the ink
   lands. Caption koans, EN+JA.
5. The hours — an editorial ledger of five blends sold as hours: First
   Ash 初灰 05:00 ¥3,800 · Paper Morning 紙の朝 09:00 · The Long
   Afternoon 長い午後 14:00 · Lamp Hour 灯の刻 19:00 · Last Ember 残り火
   23:00 ¥5,800, with weather-report notes ("agarwood, warm ash, the
   inside of a bell"). Hairline rules, ember-deep hour numerals
   (tabular lining), generous 間. Deliberately non-interactive.
6. Dark room + footer — the page inverts once: sumi ground, washi voice.
   "Come sit with the smoke. · 煙とともに、しばし。" Twelve cushions, one
   kettle; reservations for hours, never for hurry. A bordered button
   whose ink-fill is a scaleX(0→1) pseudo-element (ember ground, sumi
   text on hover — 4.9:1). Footer: address, since 1927 · 昭和二年創業,
   a sign-off koan, © 2026 KEMURI 香房 · 一炷一刻, a "begin the hour
   again" top link.

TEXTURE: one static full-viewport SVG feTurbulence pass (fractalNoise
0.55, 2 octaves) mapped to sumi at ≤5% alpha, multiplied — washi fibers,
never animated — plus a gold age-vignette and faint laid lines.

HARD REQUIREMENTS:
- prefers-reduced-motion: loader absent, smoke one composed still frame,
  plates never disturbed (scale stays 0), poem and wordmark simply
  present, all ambient cycles dead. The page must read as a finished
  painting, not a paused video.
- No text hidden without JS: add .kemuri-js on mount; every pre-reveal
  style is gated behind it. SSR state = the completed page.
- Touch: the smoke self-drifts; nothing meaningful lives behind hover.
- Keyboard: custom ember :focus-visible ring (ember-deep on washi, ember
  in the dark room).
- Animate transform/opacity/filter only; the two exceptions that write
  SVG/canvas state (displacement scale, particle field) run in rAF and
  touch no layout. rAF loops pause offscreen and on visibilitychange.
- Split text: aria-label or visually-hidden originals + aria-hidden
  glyphs; canvas has role="img" with a bilingual (EN/JA) description;
  every plate SVG has role="img" and a bilingual label.
- Custom ::selection (ember-deep ground, washi text) scoped to the root.
- On mount: window.parent?.postMessage({ type: "oneshot:ready",
  slug: "kemuri" }, "*").
- Composed at 360px and 1440px+: plates go single-column, the poem stacks
  (Japanese first), the ledger re-grids, the wordmark stays one line.

FILES: page.tsx (fonts + .kemuri-root + loader state), components/
(Loader, Hero, SmokeCanvas, Cadence, Poem, InkPlates, IncenseMenu,
CTAFooter), hooks/ (usePrefersReducedMotion, useScrollVelocity,
useReveal), styles.css (all tokens + styles), fonts.ts. Relative imports
only. Zero dependencies.
```

## Known deviations

- **The sumi-e plates are now generated paintings, not vector ink — a
  deliberate revision of the original thesis.** The entry first shipped
  its three plates as blur-layered vector ink under a displacement
  settle, with `media.source` proudly `"code"` and a note that it should
  stay that way. The owner later opted for real sumi-e texture: the
  plates were generated in ComfyUI (see image-recipe below) and embedded
  as SVG `<image>` elements inside the SAME per-plate
  feTurbulence + feDisplacementMap filter, so the signature ink-settle
  interaction survives byte-for-byte (the rAF loop still writes the
  `scale` attribute of the same `<feDisplacementMap>`). `media.source`
  is now `"hybrid"`: the smoke is still canvas, the washi grain and the
  hero censer are still SVG, and only the three plates are raster. The
  no-JS contract holds because the markup still ships `scale="0"` —
  without JS the paintings simply sit, finished.
- The brief's ember `#c96f2e` and gold `#b08d4a` fail AA on washi (2.9:1,
  2.5:1), so they were demoted to decorative use on light ground and two
  working tokens were derived: `ink-soft #4f4a43` (7.1:1) for secondary
  text and `ember-deep #a04f16` (4.7:1) for functional accents. Ember
  keeps its full voice in the dark CTA, where it measures 4.9:1 on sumi.
- The smoke leans toward the pointer *horizontally* only; the brief's
  "drifts toward the pointer" was narrowed after the vertical pull made
  the plume feel leashed. The pointer's y only shapes where along the
  ribbon the pull applies.
- The wordmark's cadence is driven by the loader's `onDone` (React state
  → `is-entered` class) rather than a scroll observer, since the hero is
  the landing viewport and observing it would fire immediately anyway.
- Because the SSR state is the *finished* page (no text hidden without
  JS), the composed hero can flash for a frame before hydration adds
  `.kemuri-js` and the loader mounts. Accepted as the price of the no-JS
  guarantee — it reads as the paper catching the light, not as a bug.
- `clip-path-reveal` and `scroll-scrub-pinned` were considered and left
  out of `meta.techniques`: nothing on the page pins, and the plates
  resolve by displacement, not clipping. Every listed technique earns a
  breakdown section.

## Image recipe · the three sumi-e plates

The three paintings under `public/media/kemuri/` (`plate-1-distant-mountains`,
`plate-2-bare-branch`, `plate-3-censer-smoke`) were generated in ComfyUI
and are the only raster payload in the entry. They replace the vector
ink the plates first shipped with, while the displacement-settle filter
that owns them is untouched.

> **License audit status (G4 gate).** The checkpoint
> `bismuthIllustrious_v80` (Illustrious-XL family) is **NOT YET
> AUDITED** in `../../docs/model-licenses.md` at the time of writing.
> Per the gallery's ASSETS-LICENSE policy, generated imagery must not
> ship from a model without a passing, dated, maintainer-co-signed audit
> row. This entry is staged for that audit; until it passes, the plates
> are placeholder-provenance and the entry should not be considered to
> have cleared the G4 gate. Swapping to an audited checkpoint later
> regenerates only these three files — no code changes (the `<image>`
> hrefs are stem-based).

### Shared pipeline

- **Checkpoint:** `bismuthIllustrious_v80` (Illustrious-XL anime/illust
  family, SDXL-class).
- **Sampler / scheduler:** 32 steps, **CFG 7**.
- **Native resolution:** 768×1024 (portrait, 3:4) — chosen to echo a
  hanging scroll and to match the plate frame's near-3:4 proportion.
- **Upscale:** `RealESRGAN` at **2×** (to 1536×2048) for paper-grain
  texture without re-imagining the composition.
- **Encode:** AVIF (quality ~60, the gallery default; the `<image>`
  primary) + WebP (quality ~82; documented fallback for engines that
  decline AVIF inside SVG `<image>`). The AVIF is what the markup
  references; the WebP is kept in `public/media/kemuri/` as the
  regenerable fallback.
- **Palette discipline:** every prompt names the house palette
  explicitly — `warm washi paper ground`, `sumi ink`, with one
  `ember/warm gold` accent — so the generated accents land on the
  existing `#c96f2e` ember and `#b08d4a` gold tokens rather than
  fighting them. No pink, no purple, no season.
- **Negative prompt (all three plates):**
  `text, watermark, signature, logo, letters, caption, frame, border,
   photorealistic, 3d, photography, color photograph, oversaturated,
   pink, cherry blossom, multiple panels, lowres, blurry, jpeg
   artifacts`

### Per-plate recipes

#### 1. `plate-1-distant-mountains` — 遠山 (Plate 壱)

Three ranges of mountains dissolving into mist, a low gold sun — aerial
perspective doing the work.

- **Prompt:**
  `traditional japanese sumi-e ink painting, suibokuga, three layers of
   distant mountains dissolving into morning mist, heavy atmospheric
   perspective, a single small warm gold sun low in the sky, soft wet
   ink washes, monochrome sumi gray and black on warm washi paper, one
   muted gold accent, vertical hanging scroll composition, serene and
   empty, no people, no text`
- **Ship size:** 1536×2048 (768×1024 upscaled 2×).

#### 2. `plate-2-bare-branch` — 枯枝 (Plate 弐)

One bare branch reaching in from the right, a single warm ember bud at
its tip — restraint as subject.

- **Prompt:**
  `traditional japanese sumi-e ink painting, suibokuga, a single bare
   winter branch reaching in from the right edge, expressive variable
   brush pressure, one small warm ember-orange bud at the tip, mostly
   empty warm washi paper, monochrome sumi ink, one muted warm accent,
   vertical composition, minimalist, no people, no text`
- **Ship size:** 1536×2048.

#### 3. `plate-3-censer-smoke` — 一炷 (Plate 参)

A censer at the foot of the paper, one stick of incense, a ribbon of
smoke written upward in a single stroke — the house's whole hour.

- **Prompt:**
  `traditional japanese sumi-e ink painting, suibokuga, a small bronze
   incense censer at the bottom center, one lit incense stick, a single
   thin ribbon of smoke rising and curling upward drawn in one flowing
   brushstroke, soft wet ink wash, monochrome sumi gray and black on
   warm washi paper, one muted warm ember accent at the incense tip,
   vertical composition, quiet and meditative, no people, no text`
- **Ship size:** 1536×2048.

### Design decision — why SVG `<image>` and not a plain `<img>`

The displacement-settle is KEMURI's defining craft, so the raster swap
had to preserve it. Three options were weighed:

1. **Plain `<img>` with `filter: url(#kemuri-pN-settle)` in CSS** — works,
   but the filter region and the `<feDisplacementMap scale="0">` markup
   contract (the no-JS settled state) would have to be re-implemented on
   a sibling hidden SVG, and the rAF loop would write to a detached
   primitive. Fragile.
2. **`<canvas>` + drawImage + displacement shader** — a second rendering
   pipeline for three still images; unjustifiable weight.
3. **SVG `<image>` inside the existing `<g filter="url(...)">`** — chosen.
   SVG filters operate on raster `<image>` exactly as on vector paths,
   so the entire settle machinery (filter region `-14%/128%`, per-plate
   turbulence seed and baseFrequency, the `scale="0"` markup state, the
   rAF `setAttribute` loop) is reused unchanged. The only edits to
   `InkPlates.tsx` were replacing the hand-drawn paths with one
   `<image href="/media/kemuri/plate-N-*.avif">` and lifting the plate
   descriptors into a `PLATES` array. `preserveAspectRatio="xMidYMid
   slice"` fills the 440×560 viewBox with a hair's crop.

### Post-generation notes

- **No text in any plate, by prompt and by negative prompt.** The 壱/弐/参
  plate numbers, the Japanese and English caption koans, and the section
  title remain real HTML — crisp vector, fully accessible, and
  regenerable without retyping.
- The plates' warm gold/ember accents were verified to harmonize with
  the house tokens (`#c96f2e` ember, `#b08d4a` gold) — they read as the
  same coal and leaf, not a foreign palette.
- The AVIF decode path inside SVG `<image>` is supported by every modern
  browser engine; the WebP fallback is retained in `public/media/kemuri/`
  for any engine that declines AVIF, and a swap requires only changing
  the `<image>` `href` extension.
