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
Build a complete, art-directed product landing page for a fictional brand:
HANJI SLATE — an e-ink writing slate by Onji Works, Seoul, marketed as
"hanji, upgraded": a calm, paper-like digital notebook. Apple/bento product
register, but with a warm e-ink identity — not glossy tech, not generic
SaaS. Aesthetic: bento-product. THEME IS LIGHT. Stack: Next.js App Router
client page ("use client"), React 19, TypeScript strict, vanilla CSS
(classes prefixed slate-), vanilla JS animation, zero npm dependencies.
Pure code — the device is drawn in SVG, no photos anywhere.

PALETTE (CSS custom properties on .slate-root): warm gray #e9e6e0
(background), graphite #26262a (text), e-ink white #f7f5f0 (tiles/device),
amber accent #e8830c. Amber only measures ~2.4:1 on the light grounds —
never let it carry text there; derive a deep amber (~#9a5504, 4.6:1 on
warm gray) for functional accents (key figures, units, plus icons, the
focus ring) and reserve the bright amber for decorative marks, the
graphite footer (5.8:1 there), and ::selection (amber bg / e-ink-white
text, scoped to the root). Secondary text = graphite at 72% alpha.
Hairlines at 14% / 30% graphite. Keep it calm: no gradients except one
soft radial shadow under the device, no blur panels, no gloss.

TYPE: Hanken Grotesk (Latin display/body) + Noto Sans KR (all Hangul,
word-break: keep-all) + JetBrains Mono (spec readouts) via
next/font/google in a fonts.ts. Stack Noto after Hanken and after
JetBrains so Hangul falls through into it everywhere, including inside
mono readouts; also style :lang(ko) explicitly.

VOICE: calm product-spec haiku — precise, unhurried, bilingual EN/KO
(~15+ lines of real copy, transcreated Korean, never translationese).
Register: "Paper that remembers. 기억하는 종이." / "6.8" e-ink · 300 ppi ·
reads like the real thing 진짜 종이처럼 읽힌다" / "Your words stay in your
pocket. 글은 주머니 속에 머뭅니다."

STRUCTURE (single scroll, 5 sections):
1. Hero — calm warm stage: overline (maker + product kind, mono), the name
   HANJI SLATE, KR subline "한지 슬레이트 · 종이 컴퓨터", the tagline, then
   the device in clean SVG (thin tablet, warm bezel, a handwritten page of
   quadratic squiggles with one amber annotation, side buttons, USB-C)
   over a soft radial shadow. Pointer parallax on fine pointers only:
   device drifts ±7px toward the cursor, shadow ∓4px against it, lerp
   k=0.09/frame (60fps-normalized), rAF loop that parks itself when
   settled. Plus a 6.5s CSS float on the SVG. Mono spec line under it.
2. Bento grid (SIGNATURE) — six feature tiles on a 4-column grid
   (battery 2×2, display 2×1, pen 1×1, privacy 1×1, weight 2×1, light
   2×1): mono figure + unit (deep amber), title EN/KO with a real <button>
   (aria-expanded/aria-controls) and a plus icon, one poetic line, and a
   detail passage. Activating a tile expands it to grid-column 1/-1 via a
   shared-element FLIP: capture all tile rects BEFORE the state change
   (First), let the grid reflow in one commit (Last), transform every
   moved tile back onto its old box with transitions disabled (Invert),
   release two rAFs later so the browser tweens to identity (Play), 420ms
   cubic-bezier(0.22,1,0.36,1). Counter-scale the tile's content wrapper
   (inverse scale, same tween) so type never stretches. Whole tile is a
   convenience click target (ignore clicks on the button itself and
   inside the open detail); detail hiding is gated behind a .slate-js
   class so no-JS shows everything; reduced motion skips capture — the
   layout snaps.
3. Exploded device (scroll-scrubbed) — a 280vh section (height JS-gated)
   with a sticky 100svh stage. An SVG diagram of four stacked plates:
   etched glass (translucent), e-ink panel (text dashes), battery
   (graphite slab, amber terminal, "2,900 mAh" stamp), magnesium back
   (shell gray, HANJI SLATE etch). Scroll progress translates each layer:
   glass/back ±132px, panel/battery ±44px (smoothstep over p∈[0.08,0.7])
   — the 3:1 travel ratio is the parallax. Thin callout lines
   (pathLength=1, stroke-dashoffset 1→0) draw in staggered windows
   p∈[0.5+0.09i, 0.72+0.09i] with labels fading in; each callout lives in
   its layer's <g> so it travels with the part. SSR/no-JS/reduced-motion
   state = assembled diagram, callouts drawn, labels visible, runway
   collapsed. Under 640px the in-SVG callouts hand off to an HTML legend.
4. Spec sheet — a real <table>, hairline rules, JetBrains Mono values,
   ~10 rows (display, glass, size, weight, pen, battery, light, storage,
   connectivity, materials); exactly one accent: the key figure per row
   in deep amber. Fine print: "Measured, not rounded up. 부풀리지 않은
   숫자."
5. Footer on graphite — giant line "The last screen that lets you rest.
   쉬게 해주는 마지막 화면.", a reading-mode toggle (LIGHT/SEPIA pill,
   aria-pressed) that swaps the paper tokens via data-mode="sepia" on the
   root AND fires a 120ms e-ink refresh: hard-cut keyframes of
   filter: invert(1) on the root, linear, no easing — e-paper snaps.
   Rapid re-toggles ride the flash in flight. Maker (Onji Works · Seoul),
   ships autumn 2026, mailto, © 2026.

HARD REQUIREMENTS:
- prefers-reduced-motion: instant tile expand/collapse (no FLIP tween),
  assembled static exploded diagram with labels, no e-ink flash, no float,
  no parallax. usePrefersReducedMotion = useSyncExternalStore over
  matchMedia.
- Touch: tiles expand on tap, exploded view scrubs with touch scroll,
  nothing means anything only on hover.
- Keyboard: tile buttons + mode toggle reachable/operable; custom amber
  :focus-visible ring (deep amber on light, bright amber on graphite).
- AA contrast for all functional text (documented per token).
- Content visible without JS (.slate-js gate; SVG device, all copy, spec
  table, and every bento detail in the DOM).
- Animate transform/opacity/filter only; FLIP measures in the commit
  frame and releases in rAF; the scrub writes transform/dashoffset/
  opacity only. No preload="auto". No console errors.
- On mount: window.parent?.postMessage({ type: "oneshot:ready",
  slug: "hanji-slate" }, "*").
- Composed at 360px and 1440px+ (grid 4→2→1 columns; spec table stacks;
  exploded legend swap).

FILES: page.tsx (default export, applies font variables + slate-root),
components/ (Hero, DeviceArt, BentoGrid, ExplodedView, SpecSheet,
SlateFooter), hooks/ (usePrefersReducedMotion, useFlip, useScrollProgress),
styles.css, fonts.ts. Relative imports only.
```

## Known deviations

- The brief's amber `#e8830c` fails AA on both light grounds (2.4:1 on
  e-ink white), so all functional amber on light surfaces — spec figures,
  tile units, plus icons, the focus ring — uses a derived deep amber
  `#9a5504` (4.6:1 on warm gray). The bright amber survives as decorative
  marks, the battery terminal, footer accents on graphite, and
  `::selection`, which keeps the brief's amber-on-white pairing in the one
  place contrast rules don't govern.
- The exploded view is a 2.5D diagram, not a true 3D teardown: plates
  separate vertically with a 3:1 travel ratio between outer and inner
  layers standing in for Z-depth. `sprite-scrub` was rejected as a tag —
  nothing here is an image sequence; the honest tag is `svg-line-draw`
  (the callouts), with the scrub documented under it.
- The scroll scrub is direct (no lerp smoothing). E-ink snaps; a laggy
  tween under the finger would read as LCD. This is an aesthetic choice,
  not an omission.
- The e-ink flash inverts the entire page via `filter: invert(1)` on the
  root rather than compositing a white/black overlay — one property, one
  layer, and the inverted frame really is the page's own negative, which
  is exactly what e-paper does.
- The FLIP counter-scale pairs outer `scale(sx, sy)` with inner
  `scale(1/sx, 1/sy)` under the same easing; mathematically the product
  only cancels exactly at the endpoints, so mid-tween there is a
  transient sub-2% wobble in content size. Invisible in practice, honest
  in print.
