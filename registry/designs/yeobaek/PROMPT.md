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
Build a complete, art-directed page for a fictional publication:
여백 YEOBAEK — The Journal of Blank Space, No. 07. A bilingual (KO-first)
literary magazine about yeobaek — negative space in Korean art and life.
This is an EDITORIAL MAGAZINE layout: the discipline is typographic rhythm
and the deliberate use of emptiness. Whitespace IS the design. Theme is
light (ivory). Aesthetic: editorial-serif. Stack: Next.js App Router client
page ("use client"), React 19, TypeScript strict, vanilla CSS (classes
prefixed yeobaek-), vanilla JS animation, zero npm dependencies, no images
(SVG figure plates only).

PALETTE (CSS custom properties on .yeobaek-root, restrained — this is
about space, not color): ivory #faf6ef page, ink #232020 text, oxblood
#7d2a26 as the SINGLE accent (hairlines, drop cap, footnote numerals,
seal, underline draw, focus ring, ::selection), graphite #8f8a82 for
rules. Check graphite's contrast before letting it carry text — if it
fails 4.5:1, demote it to rules only and derive a secondary-text token
from ink at ~72% alpha instead.

TYPE: Nanum Myeongjo (Korean serif — every Hangul glyph, the masthead) +
Libre Caslon Text with italics (Latin text, folios, drop cap) via
next/font/google in a fonts.ts. Stack Caslon first so Hangul falls through
into Myeongjo; also style :lang(ko) explicitly (Myeongjo, word-break:
keep-all, looser leading ~2.05). Folio numerals in Caslon italic. Korean
is first-class — natural word order, transcreated (never translationese).

VOICE: essayistic, literary, KO paragraph then its EN transcreation.
Write 15+ lines of real short-essay copy about margins, silence, the
space between brushstrokes, the pause in conversation — e.g. "여백은
비어 있지 않다. 그것은 아직 말해지지 않은 것이다. / Blank space is not
empty. It is the not-yet-said." Granta / 문학동네 register. Anchor it in
real referents (Chusa's Sehando, Shitao's one-stroke doctrine, pansori
breath, the hanok madang) without fabricating scholarship.

STRUCTURE (single scroll, ~5 sections):
1. Cover/masthead — 여백 huge in Nanum Myeongjo (the two characters split
   into aria-hidden spans behind an aria-label for a staggered rise),
   "YEOBAEK · The Journal of Blank Space", issue line "No. 07 · 여백 특집
   · 2026 겨울", ONE oxblood hairline (scaleX draw), a folio "No. 07" in
   Caslon italic, and vast intentional emptiness — the cover demonstrates
   its own subject. Bottom: a begin-reading anchor and a one-line
   epigraph.
2. Lead essay — the signature. A measured text column (max ~36rem, KO
   line-height 2.05) alternating two passage types: Blocks (text + a
   15rem margin rail at ≥1080px) and Spreads (a tipped-in SVG figure
   plate beside the text). The plate pins via position: sticky while
   paragraphs flow past, and its ink stroke is DRAWN BY SCROLL: a rAF
   loop measures the spread's rect (read → write, no thrash), lerps a
   0→1 progress (factor 1−0.86^(dt/16.7)) into a --yb-scrub custom
   property, and CSS maps it to stroke-dashoffset: calc(1 − var(--yb-scrub))
   on pathLength=1 paths. Plate II carries an oxblood seal whose opacity
   is calc(scrub×6−5) — it arrives only as the plate completes. Drop cap
   via ::first-letter (Caslon, oxblood) on the opening EN paragraph.
   Close with a coda set in CSS column-count: 2 at ≥900px with a hairline
   column rule.
3. Margin footnotes — 4 numbered notes (Caslon italic + KO), linked both
   ways with real anchors (sup marker ↔ note), sliding in from the margin
   (translateX 22px → 0) at their scroll thresholds via
   IntersectionObserver. On narrow viewports they fold beneath their
   passage as left-ruled notes.
4. Gallery of emptiness — three mostly-empty plates on a wall with 14vh+
   gaps: ripples without a stone (three elliptical strokes that draw once
   on reveal, staggered), a lone syllable 숨 low in a wide field, and a
   plate deliberately left blank ("이 판은 일부러 비워 두었다"). Captions
   small, bilingual.
5. Colophon — masthead-style ledger (publisher, editor, essay, type,
   subscribe mailto), the journal's statement, "© 2026 여백 — 남은 것은
   여백뿐. What remains is the margin.", back-to-cover link.

LINKS everywhere get a rubber-band SVG underline: a static graphite
hairline (always present) plus an inline SVG path (slight hand wobble,
pathLength=1) that draws stroke-dashoffset 1→0 on hover/focus-visible
through an overshooting bezier (~cubic-bezier(0.32,1.42,0.5,1)). Pure
CSS — works without JS.

HARD REQUIREMENTS:
- prefers-reduced-motion: figures don't pin (position: static — a static
  tipped-in plate), strokes fully drawn (scrub defaults to 1), footnotes
  present without slide, underlines simply present, no cover choreography,
  no reveal motion. usePrefersReducedMotion via useSyncExternalStore.
- Touch: pinning is plain touch scroll; no hover-only meaning.
- Keyboard: every link reachable; custom oxblood :focus-visible ring.
- AA: ink 15:1, oxblood 8.7:1, secondary ≥6:1; graphite never carries text.
- Content visible without JS: add a .yeobaek-js class on mount and gate
  every pre-reveal style behind it. The essay must read as a clean
  document with JS disabled — a magazine must degrade to print.
- Animate transform/opacity/stroke-dashoffset only; scrub measured in rAF.
- Custom ::selection (oxblood/ivory) scoped to .yeobaek-root.
- On mount: window.parent?.postMessage({ type: "oneshot:ready",
  slug: "yeobaek" }, "*").
- Composed at 360px and 1440px+ (rail folds under at 1080px, spreads
  stack at 880px, coda single-column below 900px).

FILES: page.tsx (default export, applies font variables + yeobaek-root),
components/ (Masthead, LeadEssay, Footnotes, EmptinessGallery, Colophon,
InkLink), hooks/ (usePrefersReducedMotion, useReveal, useScrollScrub),
styles.css (all tokens + styles), fonts.ts. Relative imports only.
```

## Known deviations

- "Multi-column article layout" is interpreted as an editorial column
  *grid* (text column + margin rail + figure column), with true CSS
  `column-count: 2` reserved for the coda. Running the whole essay through
  CSS columns would have made the pinned plates impossible — fragmentation
  contexts and `position: sticky` don't compose.
- The pin is `position: sticky`, so on narrow single-column viewports the
  figure column collapses to its own height and the plates simply sit in
  flow as static tipped-in prints. Pinning is a wide-viewport enhancement,
  not a promise; the scrubbed stroke draw still runs on mobile (its window
  is capped at ~1.1 viewports so it completes while the plate is visible).
- The brief's graphite `#8f8a82` measures ~3.2:1 on ivory, so it is
  demoted to rules only; secondary text (EN transcreations, captions,
  footnotes) uses ink at 72% alpha (≈`#5f5c5a`, 6.2:1) instead.
- `char-split-reveal` is applied only where splitting is honest and cheap:
  the two characters of the masthead 여백. The drop cap is CSS
  `::first-letter` — no spans, nothing hidden from assistive tech.
- The "rubber band" of the underline is an overshooting bezier on
  stroke-dashoffset; during the ~6% overshoot the stroke's tip briefly
  opens a small gap before settling. Accepted — it reads as the snap.
- The margin-footnote slide is documented in the breakdown prose rather
  than claimed as a separate taxonomy technique; it is the same
  IntersectionObserver reveal with a horizontal pre-state.
