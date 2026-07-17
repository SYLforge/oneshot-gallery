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
page in one shot.

```text
Build a complete, art-directed full-page design for a fictional heritage
atelier documenting a Korean hanok (한옥): Jipdam Atelier (집담 아틀리에),
a documentation practice restoring an 1807 house in Hahoe Village. The
core conceit — the building's wooden structure BECOMES the page layout.
The mortise-and-tenon joinery (no nails — 장부이음, pieces interlock) is the
grid logic; the page has distinct climate zones like a real hanok; the
signature is an exploded axonometric that disassembles the building into
its labeled structural layers. Aesthetic: korean-traditional. THEME LIGHT.
Stack: Next.js App Router client page ("use client"), React 19, TypeScript
strict, vanilla CSS (classes prefixed hanok-), vanilla JS animation, SVG +
DOM renderer, ZERO npm dependencies. Pure code — every structure drawn in
SVG, no photos anywhere. next/font/google allowed.

HANOK PRINCIPLES (from docs/references/asian-aesthetics.md §3.7 and the
IIDA 2024 Global Excellence winner "The Hanok Heritage", Hotel category —
traditional Korean architecture is being recognized internationally):
wooden structure, ondol (온돌 underfloor heating — the floor carries the
heat, not the air), maru (마루 raised wooden hall, open/breezy), curved
eaves (처마) framing the roof, courtyard (마당) orientation to sun and
seasons, mortise-and-tenon joinery with NO nails (장부이음).

PALETTE (CSS custom properties on .hanok-root): earth-paper #efe7d6 (the
pale 흙벽 earthen render the whole atelier is drawn on), ink-beam #3d2f1c
(all primary text — darkened beam wood, 10.5:1 on earth-paper, AAA), wood-
raw #c4a87a (unfinished pine/hinoki — floor planes, column fills; surfaces
only, never body text — 3.1:1), beam-mid #6b5436 (structural beams +
functional accent on light grounds, 5.8:1), earth-wall #d4c4a8 (흙벽 wall
fills), courtyard-stone #b8b0a4 (마당 ground, decorative), sky-bone
#e8e2d4 (open-sky/madang ground, cooler than paper), snow #f6f2e7 (winter
tint + maru cool deck). ONE accent: eave-red #9c3a2e (단청 trim — the
dancheong-eave pigment, a nod to the GIWA family but used SPARINGLY, only
on the eaves: focus ring, ::selection, the curved-eave underline, the
exploded-view key callout, the joinery tenon outline). Eave-red measures
5.6:1 on earth-paper so it carries functional accents on light grounds.
Secondary text = ink-soft #5a4a32 (beam-mid darkened, 6.6:1). Tertiary =
ink-faint #8a7459 (large/uppercase labels only, 3.4:1). Hairlines at 16% /
34% ink-beam. No gradients except zone backgrounds and the radial eave
shadow. No blur, no glass, no gloss.

TYPE: Noto Serif KR (structural Korean serif — section titles, the parts
처마/대들보/기둥/마루/주춧돌) + Nanum Myeongjo (display Hangul serif — hero
한옥 and zone headings, heavier carved myungjo) + JetBrains Mono (blueprint
annotations — callouts, dimensions, season labels) via next/font/google in
fonts.ts. Stack Noto Serif KR after Nanum and after JetBrains so Hangul
falls through everywhere including inside mono readouts; style :lang(ko)
explicitly with word-break: keep-all. Serif feels architectural —
load-bearing, cut into the wood.

VOICE: heritage-atelier haiku — precise, warm, bilingual EN/KO (~20+ lines
of real copy, transcreated Korean, never translationese). Register:
"mortise and tenon, no nails · 장부이음, 못 없는 집" / "The floor holds the
fire. 아랫목에 불이 깔린다." / "Wood holds still; only the light moves.
나무는 그대로, 빛만 움직인다." Korean is the first language, terser than the
English.

TEXTURE: two SVG feTurbulence registers. Page-wide: one STATIC wood-grain
sheet (fractalNoise, baseFrequency 0.012 × 0.48 for the long horizontal
fiber of sawn pine, 3 octaves, seed 7, alpha ~0.06) FIXED over the
viewport in multiply — unfinished wood under everything, NEVER animated,
pointer-transparent. The earth-wall fills inside the axonometric carry an
earthen roughness implied by warm color + hairline. Season shifts recolor
ONLY the madang sky ground and the eave-shadow angle — wood grain and wall
texture hold still across seasons (wood and earth don't change; light
does).

STRUCTURE (single scroll, 6 sections):
1. Hero — the curved-eave frame. Overline (atelier + practice, mono). The
   name HANOK (char-split reveal: per-glyph settle, 820ms ease-timber,
   stagger 90ms; accessible — aria-label on the h1 + aria-hidden spans).
   Korean subline 한옥 · 집이 곧 레이아웃. Tagline bilingual. Then the
   SIGNATURE eave (처마): an SVG path bowed like a real hanok roof edge,
   drawn once in eave-red with stroke-dashoffset (pathLength=1, 1→0,
   1.6s ease-eave), with the bilingual subline "MORTISE & TENON · NO
   NAILS · 장부이음 · 못 없는 집" riding it via SVG textPath (text-path
   technique — the words follow the curved eave). Below it a small gable
   silhouette (ridge + two upturned eave hooks with red tips + four
   columns + foundation stones) drawn in the structural palette. Mono spec
   line "5 structural layers · 3 climate zones · 4 seasons · 다섯 층 · 세
   기후 구역 · 네 계절".
2. Exploded axonometric (SIGNATURE, scroll-scrub-pinned) — a 320vh section
   (height JS-gated) with a sticky 100svh stage. An SVG of FIVE stacked
   layers, each a real hanok structural plane: curved-eave roof (처마·지붕
   — bowed trapezoid with ridge, tile body, red eave trim at both upturned
   tips, rafter ends), great beam (대들보 — long timber with tenon
   protrusions at both ends), four columns (기둥 — with top+bottom tenons,
   warm earth-wall fill between them), maru floor (마루 — raised deck with
   plank seams), four foundation stones (주춧돌 — with mortise sockets).
   Scroll progress translates each layer axially: roof −168, beam −86,
   columns −44, floor +96, foundation +168 (smoothstep over p∈[0.06,0.78])
   — outer/inner 3.4:1 travel ratio sells the Z-axis. Callout lines
   (pathLength=1, stroke-dashoffset 1→0) draw in staggered windows
   p∈[0.30+0.07i, 0.48+0.07i] with bilingual labels (EN mono + KR serif +
   gloss) fading in at 1.5× the window; the beam callout (the mortise) is
   the KEY one — eave-red line. Each callout lives in its layer's <g> so
   it travels with the part. SSR/no-JS/reduced-motion = assembled section,
   callouts drawn, labels visible, runway collapsed. Under 720px in-SVG
   callouts hand off to an HTML legend.
3. Climate zones — three sections whose SPATIAL TREATMENT matches their
   real thermal character (the climate-zone-scroll concept):
   - ONDOL (온돌방): warm, enclosed, DENSE. Contained earth-wall panel
     (double border + inset shadow), two-column body text packed close, a
     warm red line glowing beneath the floor (the underfloor heat made
     visible). Density = warmth.
   - MARU (마루): cool, open, AIRY. Wide snow-ground band, generous
     whitespace, three sparse facts set far apart in a 3-col grid.
     Openness = coolness.
   - MADANG (마당): central, sky-open, the EMPTY hero moment. Season-
     driven sky ground, an eave shadow drifting across it (translates
     with season: spring 0, summer −6, autumn +8, winter +14 px), the
     fewest words — a bilingual haiku that changes per season.
   Each zone rises into place on first scroll-into-view (useInView →
   is-shown, 700ms ease-timber, translateY 22px → 0 + opacity). Without
   .hanok-js every zone is at rest (visible).
4. Seasonal light — a segmented control (spring/summer/autumn/winter +
   AUTO). Picking a season sets data-season on the root → CSS recolors
   ONLY the madang sky ground (spring warm / summer green-breezy / autumn
   amber / winter snow-cold) and the eave-shadow tint; wood grain, earth
   wall, and all text hold still. AUTO cycles one season per ~5.2s
   (setInterval), pauses on tab-hidden, FREEZES under prefers-reduced-
   motion (the season is then fixed at the last pick or spring). Each
   option is a <button> aria-pressed; AUTO is its own button, disabled
   under reduced motion.
5. Joinery detail — the mortise-and-tenon (장부이음) blueprint: a technical
   SVG of a tenon slotting into a mortise pinned with a wooden dowel,
   dashed blueprint baselines, the tenon outlined in eave-red, bilingual
   part labels (tenon·장부 / mortise·장부구멍 / dowel·목못 / no nails·못 없는
   집). A studied drawing, not animated — the page has shown the building
   disassemble; here it shows why it stays together.
6. Footer on ink-beam — giant line "The layout is the building, and the
   building stands. 레이아웃이 집이고, 집은 선다." Records (atelier · Hahoe
   Village, built = restoration of an 1807 house, award note "in dialogue
   with IIDA 2024 heritage work", mailto with eave-red underline), © 2026.

HARD REQUIREMENTS:
- prefers-reduced-motion: char-split parks glyphs at rest, eave drawn
  immediately, exploded runway collapses to assembled diagram with labels,
  zones at rest (no rise), season FROZEN (auto-cycle never starts). Page
  is a complete readable structure.
- Touch: season toggle works on tap, exploded scrub works with touch
  scroll, nothing depends on hover. Auto-cycle keeps the page alive with
  no pointer at all.
- Keyboard: season buttons + auto toggle reachable/operable; custom
  eave-red :focus-visible ring (3px solid, ≥3:1 on every ground incl. the
  ink-beam footer).
- AA contrast for ALL functional text, documented per token.
- Content visible WITHOUT JS (.hanok-js gate; SVG eave, gable, exploded
  diagram, all zone copy, season toggle, joinery drawing all in the DOM
  and readable). SSR state = finished page.
- Animate transform / opacity / stroke-dashoffset / background-color only.
  rAF loop pauses offscreen (IntersectionObserver) and on hidden tab. No
  preload="auto". No console errors. Zero npm deps.
- On mount: window.parent?.postMessage({ type: "oneshot:ready",
  slug: "hanok" }, "*").
- Composed at 360px and 1440px+ (ondol 2-col → 1-col, maru 3-col → 1-col,
  exploded legend swap under 720px).

FILES: page.tsx (default export, applies font variables + hanok-root,
hosts the grain SVG), components/ (Hero, ExplodedAxonometric,
ClimateZones, SeasonalLight, JoineryDetail, HanokFooter), hooks/
(usePrefersReducedMotion, useScrollProgress, useSeason, useInView,
useCharSplit), styles.css, fonts.ts. Relative imports only.

FAMILY-DISTINCTION NOTE: this is the korean-traditional family's third
slot (after GIWA — the eave-tile/dancheong detail, and MINHWA — folk
painting). HANOK is the WHOLE BUILDING as architectural layout/diagram:
structural axonometric + climate-zone scroll, not tile detail and not
illustration. The three share a heritage palette family but read as
wholly different premises.
```

## Known deviations

- The brief's `architecture` / `heritage` industry verticals do not exist
  in `registry/taxonomy.ts`; the closest semantic match is `culture`
  (문화·유산 — museums, guilds, restoration), which is used. No new
  industry was added (taxonomy changes are maintainer-approved only).
- This entry is the korean-traditional family's third and final slot. The
  brief assumed minhwa was "in-progress"; in the repo minhwa now exists
  and shares two technique tags with this entry (`scroll-scrub-pinned`,
  `char-split-reveal`). Technique tags are explicitly shareable across
  entries (the rubric caps entries per aesthetic family at 3, not
  techniques per entry-family); the three entries read as wholly different
  premises (GIWA = eave-tile detail, MINHWA = folk illustration, HANOK =
  whole-building structure). `text-path` is unique to this entry in the
  family.
- The exploded axonometric is a 2.5D disassembly, not a true 3D model:
  layers separate axially with a 3.4:1 outer/inner travel ratio standing
  in for Z-depth, the standard convention of an architectural exploded
  diagram. The honest technique tag is `scroll-scrub-pinned` (the
  signature mechanic); the callout line-drawing is documented under it,
  not separately tagged, to avoid claiming `svg-line-draw` (which GIWA
  already earns for its ink-line work).
- The season auto-cycle is a `setInterval`, not a pure-CSS animation,
  because the season must drive BOTH the madang ground (CSS via
  data-season) AND the haiku copy (React state) — a CSS-only cycle could
  not swap the text. The interval is paused on tab-hidden and frozen under
  reduced motion (gate G3).
- The char-split on the hero title is implemented with `Array.from` per
  code-point, so Hangul syllables settle as whole glyphs (not split into
  jamo). This is the correct granularity for display copy; combining-mark
  clusters are rare in this text and the fallback is legible.
- The hero eave is two separate SVGs (the textPath eave + the gable
  silhouette) rather than one combined graphic, so the textPath path can
  use a clean `pathLength=1` without the gable geometry complicating the
  dash math. Visually they read as one eave assembly.
