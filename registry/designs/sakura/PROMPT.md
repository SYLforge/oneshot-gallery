---
provenance: distilled-recipe
model: glm-5.2-coding-plan
harness: ZCode CLI
date: 2026-07-18
attempts: 1
verification:
  status: unverified
---

> **Inspiration, labeled.** This entry is the Oneshot Gallery's direct,
> labeled answer to [oneshot-sakura](https://oneshot-sakura.vercel.app/) —
> the reference site whose ink-to-bloom premise inspired the gallery's
> `ink-bloom` family and, in part, the gallery itself. No code, asset, or
> expression was copied from oneshot-sakura; the premise (ink falls and
> blooms into petals) is an unprotectable idea, re-expressed here from
> scratch in trilingual vanilla code under MIT. The goal is to be *more
> crafted, more beautiful, and free* — and to ship the complete source and
> the honest prompt, where the reference ships one hero.

The prompt below is a distilled recipe: the full brief this entry was built
from, compressed to what a strong model needs to regenerate a comparable
page in one shot.

```text
Build a complete, art-directed landing page — SAKURA 벚꽃 桜花 — a
generative ink garden with no fictional brand to sell; the page is the
product. Aesthetic: ink-bloom (a NEW family — ink that blooms into petals).
Theme is DARK — deep ink night, not a light page. Stack: Next.js App Router
client page ("use client"), React 19, TypeScript strict, vanilla CSS
(classes prefixed sakura-), vanilla JS animation, zero npm dependencies.
Pure code — no images at all (media.source = "code"); every petal is drawn
by canvas, every glyph by font. This is the gallery's labeled answer to
oneshot-sakura.vercel.app: the same ink→bloom premise, executed as a
trilingual, installable, fully-sourced MIT page.

TRILINGUAL POLICY (gallery i18n): Korean = main reading voice (한국어 메인),
Japanese = decorative source glyph (the sakura motif is Japanese at its
root — tategaki title 桜花, verse markers 一二三四, seals), English =
subtitle. The Korean is never translationese; each language reads as
written-in-that-language.

PALETTE (CSS custom properties on .sakura-root; every rendered color a
named token): ink-night #0e0a0f (ground), ink-panel #14101a (raised), petal-
white #f6eef0 (primary text, 17.2:1 AAA), bloom #f4c2d4 (soft pink display),
blossom #e8869e (THE accent — even clears AA for body text at 7.8:1),
blossom-deep #c75a76 (banked, 4.6:1 on panel), gold #c9a85a (the single
warm mote — hero rule, seal, one drifting pollen grain), ink-soft #a89aa2
(captions, 7.3:1), moss-ink #6b5a64 (3.1:1 — large/decorative ONLY). The
page never inverts; the dark is its home. Gold appears only where gold
should.

TYPE: Shippori Mincho (JA: 400/500/700 — every Japanese glyph, drawn for
vertical metrics first) + Noto Serif KR (KO main voice: 400/500) + Cormorant
Garamond (EN subtitle: 400/500/600 + italic) via next/font/google with
literal configs in fonts.ts. Stack order Cormorant → Korean → mincho so
Hangul and kanji fall through with no markup; also style :lang(ko) and
:lang(ja) explicitly (Noto Serif KR +0.01em, Shippori +0.06em). Korean must
never render in a fallback sans.

VOICE: mono-no-aware, present tense, trilingual KO/JA/EN. Write ~15 lines of
real literary copy: "Ink falls, the blossom opens. / 먹이 지고, 꽃이 피어난다 /
墨が落ちて、花が咲く。" Petals, ink, the waterline, the wind, the passing.
Never "magical", never "ephemeral" as a buzzword.

STRUCTURE (single scroll, 4 beats):
1. Loader — a beat of blank ink-night, a gold bloom seal (桜) pressed into
   it (press: scale 1.14→0.97→1 with a −4° set, 700ms), then the night
   lifts (650ms translateY+opacity). Any key/tap/wheel/scroll lifts it at
   once; a hard timeout lifts it regardless; under reduced motion (or no
   JS) it never mounts. onDone fires as the lift STARTS so the hero
   cadence overlaps it.
2. Hero — the signature. A DPR-capped (≤2) canvas drawing the INK-BLOOM
   system: ink DROPS fall from the top under gravity (580 px/s², terminal
   480 px/s), strike an invisible WATERLINE at y=0.42·H, SPLASH (4–7 micro-
   droplets, life 0.5s) and BLOOM — spawn a ring of 8–14 PETAL particles
   (outward 40–90 px/s, angular spread ±0.8 rad). Petals are then advected
   through a DIVERGENCE-FREE CURL-NOISE WIND FIELD: ψ = two octaves of
   seeded value noise (feature sizes ~170px and ~64px), the field drifts
   leftward+upward (10,14 px/s) so gusts travel, velocity = (∂ψ/∂y, −∂ψ/∂x),
   gain 720 — divergence-free so petals coil but never compress or tear
   (this is KEMURI's smoke physics INVERTED: ink→petal not smoke→air, sink
   not rise). Petals: sink −22 px/s (cherry blossoms FALL), velocity
   relaxation 1.8/s (inertia), life 7–13 s, size 7–16px growing 1.4×, three
   sprite tones (fresh blossom/mid bloom/pale edge), rotation 0.6–2.4 rad/s.
   The wind LEANS toward a fine pointer (horizontal pull capped ±70 px/s,
   energy attack .06/release .02); on touch or idle a two-sine breeze
   (~33s and ~15s periods) keeps the garden alive. Drops fall autonomously
   every ~2.6 s so the page is never still. Pre-advect 90×90ms steps before
   first paint so the garden is already blooming. Pause via
   IntersectionObserver AND visibilitychange. Reduced motion: warm up, draw
   one composed still (garden mid-bloom, one drop frozen mid-fall), stop.
   Click/tap anywhere drops fresh ink that blooms — the signature
   interaction. The title layers: tategaki 桜花 (Shippori, vertical-rl) to
   the right of the wordmark SAKURA (Cormorant, per-letter aria-hidden
   spans behind aria-label, 95ms cadence after the loader lifts), with
   벚꽃 (Noto Serif KR) as the Korean headline beneath. JP/EN kicker, est.
3. The verses (것의 아와레 / もののあわれ) — a SCROLL-SCRUBBED PINNED
   section: the section is ~260vh tall, its inner stage position: sticky
   for the scroll length. As scroll progress runs 0→1, (a) the bloom canvas
   accumulates petals (drop rate ×3.2, density floor ×0.7 of count — petals
   arrive as you read), (b) four mono-no-aware verses crossfade in sequence
   (each owns a 0.25 window of progress; the others fade; scrubbing back
   CLEARS them — petals are not permanent). Each verse: a JP marker (一二三四,
   Shippori display) + KO body (Noto Serif KR, the speaking voice) + JP
   source line + EN italic subtitle. Verse order: arrival → bloom → fall →
   memory. A rAF loop writes data-active="<i>" onto the verse stack from
   smoothed scroll progress; CSS crossfades; only the active verse is
   aria-hidden=false. A radial darkening over the canvas keeps verse text AA.
4. The open garden + footer — a wide bloom stage (the curl field shown
   purely, with three notes explaining the physics in KO/EN: drop→splash→
   bloom, petal→wind→fade, pointer→lean), then the invitation. The page
   stays dark (no inversion). The seal 桜 pressed in gold at the CTA's
   shoulder, tilted −6°. A bordered button whose bloom-fill hover is a
   scaleX(0→1) pseudo-element (blossom ground, ink-night text on hover —
   7.8:1). Footer: brand SAKURA 桜花, place, since 2026 · 令和八年・春, a
   sign-off ("The blossom is beautiful because it falls. The code remembers
   its passing."), © 2026 written entirely in code · すべてコードにて, a
   "bloom again" top link.

TEXTURE: one static full-viewport SVG feTurbulence pass (fractalNoise 0.62,
2 octaves, seed 7) mapped to blossom at ≤4% alpha, screened — night dust,
never animated — plus a deep radial vignette (transparent → rgba(0,0,0,0.55)
at corners) and faint scanline repeating-gradient. The waterline is drawn
on canvas (1px moss-ink + 24px blossom glow, shimmer 6.2s).

HARD REQUIREMENTS:
- prefers-reduced-motion: loader absent, bloom canvas one composed still
  frame (garden mid-bloom, drop mid-fall), verses show the first verse
  statically, all ambient cycles dead. The page must read as a finished
  garden, not a paused video.
- No text hidden without JS: add .sakura-js on mount; every pre-reveal
  style is gated behind it. SSR state = the completed page.
- Touch: the garden self-drifts; nothing meaningful lives behind hover;
  pointer-down drops ink for everyone.
- Keyboard: custom blossom :focus-visible ring.
- Animate transform/opacity/filter only; the canvas field is the one
  exception (rAF, touches no layout). rAF loops pause offscreen and on
  visibilitychange.
- Canvas stage is role="img" with a bilingual (KO/EN) description; split
  wordmark keeps aria-label; the verse stack manages aria-hidden so only
  the active verse is read.
- Custom ::selection (blossom ground, ink-night text) scoped to the root.
- On mount: window.parent?.postMessage({ type: "oneshot:ready",
  slug: "sakura" }, "*").
- Composed at 360px and 1440px+: the tategaki 桜花 goes horizontal-tb on
  narrow screens, the garden notes go single-column, the verses re-grid,
  the wordmark stays one line.

FILES: page.tsx (fonts + .sakura-root + loader state + grain SVG),
components/ (Loader, Hero, BloomCanvas, VerseScrub, PetalField,
SakuraFooter), hooks/ (usePrefersReducedMotion, useReveal, useScrollProgress,
usePointerInk, useBloomCanvas), styles.css (all tokens + styles), fonts.ts,
tokens.json. Relative imports only. Zero dependencies.
```

## Known deviations

- **The brief's industry `art` is not a valid taxonomy enum** (the gallery
  industries are atelier, publishing, science, entertainment,
  fashion-beauty, product, retail-food, culture, wellness). `culture`
  (Culture & Heritage) is the closest honest fit for an ink-garden concept
  rooted in Japanese/Korean aesthetic tradition, and is what `meta.json`
  declares. This is a metadata correction, not a design change.
- The blossom accent `#e8869e` is unusually generous for a dark-theme
  accent: at 7.8:1 on ink-night it clears AA even for body text, so unlike
  KEMURI's ember (which had to be banked to ember-deep for functional use
  on light ground) blossom is permitted to speak everywhere — kickers,
  verse numerals, focus rings, and the selection ground all use it
  directly. `blossom-deep #c75a76` is reserved for the ink-panel raised
  surface where the full blossom reads too bright.
- The verse crossfade is driven by a `data-active` attribute on the verse
  stack (set imperatively by a rAF loop from smoothed scroll progress),
  rather than the `--sakura-verse-p` CSS variable the brief mentioned. The
  variable is still written (for future scrub-continuous effects), but the
  discrete verse swap is cleaner as an attribute that CSS matches on — and
  it lets the rAF loop manage `aria-hidden` on exactly the same change,
  so screen readers always read the visible verse.
- The hero's tategaki 桜花 is set with `writing-mode: vertical-rl` on wide
  screens and flips to `horizontal-tb` under 640px, because a vertical
  glyph beside an already-vertical-fitting Latin wordmark competes for the
  same axis on a phone. The Korean 벚꽃 headline stays horizontal at all
  widths (it is the speaking voice, not decorative).
- The `PetalField` garden stage is bordered (1px hairline, 2px radius) —
  the only bordered box on the page — to frame the curl field as a
  "specimen" the reader studies, distinct from the full-bleed hero and
  verse stages. Every other shape is a hairline rule or the seal's carved-
  stone radius.
- The bloom canvas reads CSS custom properties for none of its colors:
  they are baked into the prerendered sprites (constructed from the sheet's
  blossom/bloom/petal-white/gold hexes as literal rgba strings) so each
  particle costs one `drawImage`, never a per-frame `createRadialGradient`.
  This mirrors KEMURI's smoke-sprite strategy and is the reason the garden
  holds 60fps with 120–520 petals.
