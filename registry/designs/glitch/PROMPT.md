---
provenance: distilled-recipe
model: glm-5.2
harness: ZCode
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
GLITCH — a VFX & experimental-music studio in a Hongdae back-alley basement
that treats render failure as a finished product. Aesthetic: terminal-core,
but the CORRUPTED pole of it (deliberately distinct from PALE.SIGNAL, the
clean phosphor entry in the same family). Stack: Next.js App Router client
page ("use client"), React 19, TypeScript strict, vanilla CSS (BEM-ish
classes prefixed gl-), vanilla JS animation, zero npm dependencies.

PALETTE (CSS custom properties, every rendered color a named token):
RGB-split primaries — red #ff0044, cyan #00ffe5, electric blue #0044ff —
plus glitch-white #f0f0f5 on void ground #050508 (not pure black). Cyan
measures 15.9:1 on void so it carries secondary text directly (no dim
derivative needed, unlike PALE.SIGNAL). Blue is 3.17:1 → large/decorative
ONLY. Derive: cyan-dim #0aa399 (cyan @72% over void, 6.51:1), mute #9a9aad
(tertiary, 7.37:1), error-red #ff3344 (alert tags, ~5.6:1), grid-line #1d3b39
(decorative rules/tear edges, 1.68:1 — never functional text). Custom
::selection (cyan bg, void text) scoped to the page root. No purple-to-blue
gradients, no glassmorphism — the only gradients are the CRT glass overlay
(scanlines, noise, RGB-split vignette).

TYPE: Major Mono Display (corrupted display — single-case, the RGB-split
wordmark + section titles) + Space Mono (the machine voice: body, ledger,
timestamps) + Noto Sans KR (every Hangul, a clean modern grotesque —
deliberately NOT PALE.SIGNAL's Nanum Gothic Coding) via next/font/google in
a fonts.ts with literal config objects. Stack order Space Mono, Noto Sans KR,
monospace so Hangul falls through; :lang(ko) pins Noto Sans KR at ~0.94em.
Korean must never render in fallback sans.

VOICE: release-notes terse, codec-fluent, dry-funny, defiant-about-failure,
bilingual EN/KO interleaved ("the drop is a single corrupted I-frame looped
for thirty-two bars. the mastering engineer cried; we kept it. / 드롭은 손상된
I-프레임 하나를 32마디 동안 루프한 것이다. 마스터링 엔지니어가 울었다. 우리는
그대로 두었다."). Write 15–20 lines of real, literary microcopy. Korean
first-class, never translationese — blunter and funnier than the English.

STRUCTURE (single scroll, 5 sections):
1. Hero — the signature: an RGB-split wordmark GLITCH as three stacked
   layers (white base + red + blue, mix-blend-mode: screen). The red/blue
   channels rest at a ±2px micro-shift and burst wide (red −7px / blue +8px)
   for ONE frame every 4.2s via steps(1, end) — instant cuts, NO easing
   (easing makes it "animated" not "broken"). Eyebrow, bilingual subtitle,
   a metadata <dl> (status/build/signal). Bilingual scroll hint.
2. Manifesto — three panels revealed through JAGGED clip-path tears (not
   clean cuts): each [data-tear] starts clipped to a thin horizontal slit
   polygon(0 46%,100% 46%,100% 54%,0 54%) and tears open to the full rect
   over 480ms cubic-bezier(0.85,0,0.15,1). 60ms stagger per observer batch.
   Each panel = a defiant one-liner about treating artifacts as product.
3. The ident — an ASCII broadcast ident (a stacked-carrier waveform inside a
   degrading box-drawing frame) that SCRAMBLES itself: every 2.6s, 35% of
   non-space cells randomize from a glitch glyph pool (▖▚▞▟█▓▒░ etc.) for
   ~220ms, then the original resolves. 65% of cells stay stable so the
   figure remains legible — corruption as ornament. Rendered as <pre> in
   Space Mono; a compact variant for <560px. role="img" + bilingual aria.
4. Catalogue — four tracks (GLT-001..004) in a monospace ledger: cat, title
   (EN · KO), BPM, length, status. One "ARCHIVED — 보관" track in error-red
   (the origin myth: built on a monitor with a stuck green pixel). Rows are
   real <button>s with aria-expanded that open a one-line defiant note;
   hover/focus shows a "+" crosshair and an instant (untransitioned) cyan
   row highlight.
5. Footer — sign-off ("04:00 KST — render queue flushed. artifacts shelved,
   dated, not deleted. / 아티팩트를 보관했다. 지우지 않았다."), studio coords,
   codec line ("h.264 / pcm / 의도된 손실"), uptime, mailto link, "© 2026
   glitch.studio — we keep the broken frames. / 우리는 부서진 프레임을 모은다."

GLASS TREATMENT over everything: fixed pointer-events-none overlay, THREE
layers: (a) DENSE scanlines — repeating-linear-gradient 1px of
rgba(240,240,245,0.05) ink every 2px (denser than a working CRT — the glitch
aesthetic; 5% alpha keeps text AA); (b) datamosh noise — tiled SVG
feTurbulence at 4% opacity over multiply, STATIC (no animation); (c) RGB-split
vignette — radial gradient with a faint red/blue fringe at the corners. The
glass tears horizontally once per 7.7s (translateX 2px + slight skewX, three
~16ms segments). Scanlines drift 0 → -2px over 8.8s (~0.23Hz, photosafe).

HARD REQUIREMENTS:
- Photosensitive safety: every ambient cycle well below 3Hz (wordmark burst
  one frame/4.2s, scan drift ~0.23Hz, glass tear one frame/7.7s). All
  removed under prefers-reduced-motion.
- prefers-reduced-motion: wordmark channels resolve dead-center (no resting
  micro-shift), ASCII never scrambles (shows pristine figure), clip-path
  tears are removed (everything visible), glass animations stop. Use a
  usePrefersReducedMotion hook (useSyncExternalStore over matchMedia).
- Touch usable without hover; the ASCII ident scrambles autonomously.
- Keyboard reachable everything; custom cyan :focus-visible ring with an
  RGB-split halo (1px red + cyan glow).
- No text hidden without JS: add a gl-js class on mount and gate every
  pre-tear / scramble style behind it; SSR state is the completed page.
- Animate only transform/opacity/filter/clip-path. No console errors.
- Wordmark uses aria-label="GLITCH" on the h1 + aria-hidden on the three
  visual layers; the ASCII stage gets role="img" with a bilingual
  description; track rows are native <button> with aria-expanded/controls.
- On mount: window.parent?.postMessage({ type: "oneshot:ready",
  slug: "glitch" }, "*").
- Composed at 360px and at 1440px+ (manifesto grid 1→3 cols at 900px;
  track rows re-grid on mobile; ASCII swaps to a compact block <560px).

TECHNIQUES (declare exactly 3, ALL DIFFERENT from PALE.SIGNAL's typewriter
+ ascii-render + crt-scanline — glitch keeps crt-scanline and ascii-render
but executes them differently, and swaps typewriter for clip-path-reveal):
crt-scanline (dense 2px scanlines + RGB-shift + noise, more aggressive than
PALE.SIGNAL's reverent 3px grille), clip-path-reveal (jagged polygon tears,
not clean cuts), ascii-render (a static ident that scrambles periodically,
not a live field).

FILES: page.tsx (default export, applies font variables + gl-root),
components/ (GlitchHero, Manifesto, AsciiCorrupt, TrackList, GlitchFooter),
hooks/ (usePrefersReducedMotion, useGlitchReveal, useAsciiScramble),
styles.css (all tokens + styles), fonts.ts, tokens.json, DESIGN.md,
breakdown.en.mdx, breakdown.ko.mdx. Relative imports only.
```

## Known deviations

- `crt-scanline` and `ascii-render` are technique tags shared with
  PALE.SIGNAL by name, but executed in the opposite spirit: PALE.SIGNAL's
  scanlines are a reverent 3px CRT grille with a breathing glare, where
  GLITCH's are a dense 2px datamosh shimmer + static feTurbulence grain +
  RGB-split vignette. PALE.SIGNAL's ASCII is a live pointer-reactive field
  on canvas; GLITCH's is a static broadcast ident that scrambles itself
  periodically in the DOM. The two entries would never be confused for
  each other; the tags are earned differently on screen and each has its
  own breakdown section.
- The brief's blue `#0044ff` measures 3.17:1 on void — passes AA only for
  large text. It is therefore restricted to the wordmark channel layer
  (large display, `mix-blend-mode: screen`, decorative) and the glass
  vignette corner fringe. It never carries body copy.
- `cyan-dim` (`#0aa399`) is a calm tertiary voice, not a contrast rescue —
  unlike PALE.SIGNAL, cyan itself (15.9:1) is high-contrast enough to carry
  secondary text directly. The dim token exists for tonal variety under the
  noise.
- The `cursor-blink` motion token is declared in `tokens.json` for
  documentation completeness but is not currently rendered on the page
  (the hero uses a metadata <dl>, not a typewriter cursor). Kept so the
  motion vocabulary sheet is honest about the system's available gestures.
- The noise grain is a static SVG `feTurbulence` rather than an animated
  layer: an animated grain at the page's density would compete with the
  wordmark's periodic burst and risk a busy read; a static 4% grain sells
  the datamosh shimmer without strobing.
