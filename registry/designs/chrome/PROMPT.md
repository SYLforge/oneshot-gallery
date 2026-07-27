---
provenance: distilled-recipe
model: glm-5.2
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
CHROME (크롬) — a Y2K beauty/cosmetics house in a chrome-fronted building in
Seongsu-dong, Seoul, that pours its lip glosses in liquid chrome and seals
every card in holographic foil. Aesthetic: retro-y2k, but the LIQUID METAL
instinct — explicitly DISTINCT from a sibling PIXEL entry that owns pixel-art
arcade. Where PIXEL is blocky/cheerful/mosaic, CHROME is smooth/metallic/
reflective/continuous. THEME LIGHT. Stack: Next.js App Router client page
("use client"), React 19, TypeScript strict, vanilla CSS (classes prefixed
chrome-), vanilla JS animation, zero npm dependencies, zero image assets —
every chrome and foil surface is procedural.

NON-NEGOTIABLE ART DIRECTION: pure code, no images. The chrome is the product.
The hero headline is a WebGL fragment shader painting liquid metal into the
glyph shapes; holographic foil is layered CSS; every "product photo" is an
SVG/CSS chrome pill. If a surface does not ripple, foil, or keep its shadow,
it is wrong.

PALETTE (CSS custom properties on .chrome-root, every rendered color a named
token): holo-mist #f4f1ff page bg, holo-sky #e0e8ff / holo-pink #ffd8f0 /
holo-mint #d8fff0 (holographic gradient stops), chrome-silver #c8d0d8 (a
glossy MID-TONE surface fill), chrome-highlight #ffffff (wet sheen),
chrome-ink #2a2a3a (deep chrome shadow — THE ink), chrome-ink-2 #4a4a5e
(secondary), ink-soft #6a6a7e (tertiary), accent #ff8ad8 (holographic pink),
accent-deep #c84aa0 (deepened pink for accent text at large scale).

CONTRAST IS THE RUBRIC AND THE HARD PART (chrome-on-light is tricky): chrome-
silver (1.40:1 on mist) and accent pink (1.91:1) are FILLS ONLY, never text.
All functional text runs on chrome-ink (12.66:1 AAA), chrome-ink-2 (7.76:1
AA+), ink-soft (4.75:1 AA) over holo-mist. The dark chrome button core is
chrome-ink with chrome-highlight text (14.09:1). accent-deep carries accent-
colored TEXT only at eyebrow/large-display scale (3.82:1, AA-large, documented).
Custom ::selection (accent bg, chrome-ink text) scoped to the root. Custom
:focus-visible: a 2px accent halo, offset 3px.

TYPE: Syne (Latin chrome display, weights 400/600/800 — the 800 fills like
poured metal) + Black Han Sans (ALL Hangul, a chunky Y2K Korean display face,
single weight) + Major Mono Display (spec codes CRM-01…, eyebrows, chrome
console labels) via next/font/google in fonts.ts. Order both display stacks
Latin-first, Hangul second, so Hangul falls through with no markup; Korean
must never hit fallback sans. Display heads go TIGHT (-0.01 to -0.02em) so the
heavy 800 reads as a single poured mass.

VOICE: liquid, confident, optimistic, metallic, direct. Present tense, one
clause maybe two. ~14 lines of real copy. Anchor: "Gloss poured as metal. /
립을 붓듯 금속을 붓다." Credo: "We do not sell a color. We sell the way light
bends off a surface that refuses to be flat. / 우리는 색을 팔지 않는다.
납작해지기를 거부하는 표면 위로 빛이 구부러지는 방식을 판다." Footer motto:
"poured as metal, worn as light. / 금속으로 붓고, 빛으로 입는다." Korean is
transcreated, never translationese. Banned: "shimmer", "glamorous", "retro".

STRUCTURE (single scroll, 4 sections + hero):
1. Hero (SIGNATURE) — holo-mist stage with a flat holo-sky→mist→mint + radial
   holo-pink scrim behind everything (so no-JS / shader failure never show a
   hole). The wordmark CHROME rendered THREE layered ways: (a) a CSS chrome-
   gradient text fill (5-stop ink→silver→highlight→silver→ink, background-
   clip:text) as the honest fallback; (b) a WebGL canvas over it in
   mix-blend-mode: screen, a single full-quad fragment shader painting a
   horizontal chrome band stack displaced by layered sine ripples + a gaussian
   pointer lens, palette fixed to the chrome tokens, transparent until first
   real frame (.is-live), hidden entirely if WebGL/compile fails; (c) six
   aria-hidden glyph spans behind aria-label, each clipping open inset(0 100%
   0 0)→inset(0) staggered 55ms (ease-chrome cubic-bezier(.16,1,.3,1)) — the
   metallic sweep. Glyphs are transparent ink (layout+mask only); the fill +
   shader are the visible metal. Pointer drives shader energy (gaussian lens,
   lerp 0.09, attack 0.06/release 0.025); idle 2400ms or touch → autonomous
   lissajous ripple. Three blurred holographic-foil conic bands frame the
   wordmark, origins shifted by pointer (--chrome-px/--chrome-py). KR sub
   "크롬 · 액체 금속 뷰티, 서울", line "Gloss poured as metal.", hint "move to
   ripple the chrome ↓".
2. Manifesto — a holographic-foil plaque (chrome-silver base + 3 screen-blend
   conic foil bands + a moving white specular streak) carrying the creed in
   large Syne 600; then a 3-rule ledger (it must ripple / it must foil / it
   must keep its shadow) with mono numerals, hairline rules, bilingual lines.
3. The line — five chrome pourings in a 1→2→3 col grid: CRM-01 Mirror Pour
   (Liquid Mercury), CRM-02 Dawn Foil (Iridescent Pearl), CRM-03 Gunmetal Veil
   (Cool Graphite), CRM-04 Chrome Pink (Hot Hologram), CRM-05 Platinum Glaze
   (White Chrome). Each card is a holographic-foil panel (reusable HoloFoil)
   wrapping an SVG chrome pill (horizontal 7-stop chrome gradient body +
   radial chrome cap + moving specular + holographic floor glow keyed to a
   per-product glow token) + spec code/shade/line EN+KO. Cards fade in
   (700ms ease-foil, translateY 16→0) as they enter view, 55ms batch stagger.
4. Footer — holo-pink wash over mist, "POUR YOURSELF · 를 붓다", "The counter
   is open from the first light to the last reflection.", a chrome pill button
   (dark chrome-ink core + chrome-highlight text + chrome-silver frame +
   breathing accent rim glow) back to top, fictional Seongsu-dong address,
   "© 2026 CHROME — poured as metal, worn as light. 금속으로 붓고, 빛으로 입는다."

THREE INTERACTIVE TECHNIQUES (declare, each DIFFERENT from pixel's):
1. webgl-shader — the chrome headline fragment shader (with the CSS chrome-
   gradient text fill as the documented fallback, so failure loses the ripple
   not the wordmark).
2. pointer-parallax — the holographic foil layers (three real layers whose
   conic-gradient origins + the specular streak position drift with the
   pointer, lerped 0.06 and capped).
3. char-split-reveal — the chrome headline glyphs (aria-label + aria-hidden
   spans, per-glyph clip-path sweep, 55ms stagger).

HARD REQUIREMENTS:
- prefers-reduced-motion: shader renders ONE composed still frame (no rAF
   loop), glyphs fully unclipped, foil at neutral rainbow (--chrome-px 0),
   reveals appear instantly, glow/hint pulses off. usePrefersReducedMotion =
   useSyncExternalStore over matchMedia.
- Touch: foil rests static (no hover-only affordance); the chrome shader
   self-ripples via autonomous lissajous; nothing essential behind hover.
- Keyboard: every control reachable; custom :focus-visible (accent halo).
- Contrast: AA for all text — chrome-silver and accent are FILLS ONLY;
   chrome-ink/chrome-ink-2/ink-soft carry all text (documented ratios).
- No text hidden without JS: add .chrome-js on mount; the CSS chrome-gradient
   fill, all copy, every card are plain DOM; glyph pre-clip states gated
   behind .chrome-js; the holo scrim backs the canvas so no-JS is never a hole.
- Animate only transform/opacity/filter/clip-path (background-position for the
   foil specular is the one exception — it is GPU-composited and cheap).
   Canvas/WebGL loops DPR-capped at 2, pause offscreen (IntersectionObserver,
   120px margin) AND on visibilitychange; dt clamped 48ms; ~64fps throttle.
   Canvas carries role="img" with a bilingual description.
- On mount: window.parent?.postMessage({ type: "oneshot:ready", slug: "chrome"
  }, "*").
- styles.css only, vanilla CSS, zero npm deps, relative imports only,
  composed at 360px and 1440px+.

FILES: page.tsx (default export, applies font variables + chrome-root),
components/ (Hero incl. shader canvas + glyph spans, Manifesto, ProductLine
incl. ChromePill, ChromeFooter, plus reusable HoloFoil + ChromeButton),
hooks/ (usePrefersReducedMotion, useChromeShader, useFoilParallax, useReveal),
styles.css, fonts.ts. Relative imports only.
```

## Known deviations

- **The headline uses three layered renderers, not one.** The brief named a
  WebGL chrome shader as the signature, but a shader alone is fragile: WebGL
  can be absent, the context can be lost, the program can fail to link. So
  the wordmark is built as a CSS chrome-gradient text fill (the honest,
  always-on fallback) with the WebGL canvas layered over it in
  `mix-blend-mode: screen`, transparent until its first real frame and
  hidden entirely on failure. The page loses the ripple, never the wordmark.
  This is why the entry honestly claims `webgl-shader` (the shader exists and
  is the headline interaction) while degrading gracefully.
- **The glyph sweep is a clip-path mask, not a moving transform.** The six
  headline glyphs are transparent ink — they exist only to define the
  headline's metrics and to act as a clip mask. The visible metal is the fill
  + shader beneath them. Each glyph's `clip-path` wipes open left-to-right
  (55ms stagger) so the metal *sweeps* across the wordmark, which is the
  honest basis for the `char-split-reveal` tag (the split is real: aria-label
  + aria-hidden spans, per-glyph animation).
- **The accent pink `#ff8ad8` is a fill, not text (1.91:1).** The classic Y2K
  move would be to set copy in holographic pink; the rubric forbids it. So
  accent is confined to fills (foil seam, button rim glow, ::selection, the
  footer rule gradient) and accent-colored *text* uses the deepened
  `accent-deep #c84aa0` at AA-large (3.82:1) for eyebrows and large display
  only. Body text never touches either pink.
- **The foil specular uses `background-position`, the one non-transform
  animated property.** Every other animation is transform/opacity/filter/
  clip-path; the moving white streak across each foil panel shifts
  `background-position` with the pointer because that is the cheapest way to
  slide a gradient band. It is GPU-composited and far below the cost of
  repainting the conic foil bands, so the exception is documented rather than
  avoided.
- **The chrome shader's palette is hardcoded in GLSL, not read from CSS.**
  WebGL cannot sample CSS custom properties, so the shader's chrome stops
  (shadow/silver/highlight/mist/pink) are literals that mirror the entry's
  tokens. They are documented in tokens.json as the shader's render of those
  tokens; if a token changes, the shader must change with it.
- **The product grid is 1→2→3 columns, not a horizontal rail.** A rail (like
  ONDO's collection) would have read as "perfume"; CHROME's products are
  glosses that belong on a counter grid, so they flow as a responsive grid
  with snap-free scrolling.
