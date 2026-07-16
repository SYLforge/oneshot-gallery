---
provenance: distilled-recipe
model: builtin:zai-coding-plan/GLM-5.2
harness: ZCode CLI
date: 2026-07-17
attempts: 4
verification:
  status: unverified
---

The prompt below is a **distilled recipe** — the entry was built
iteratively (human + AI, several rounds), and this is the brief
compressed to what a strong model needs to regenerate a comparable page in
one shot. It is labeled `distilled-recipe` (Class B) honestly, not
`one-shot`: `meta.prompt.oneshot` is `false`. The illustrations were
generated separately in ComfyUI; their recipe is in `image-recipe.md` and
the exported graph in `workflows/`.

```text
Build a complete, art-directed landing page for a fictional Korean brand:
PPANG! 빵! — a neighborhood bakery in Eunpyeong-gu, Seoul, that opens at 4 AM
so the first commuters smell bread. The owner inherited the bakery from her
grandmother and bakes in the same hour her grandmother did. The page is NOT
a shop — it is ONE CHAPTER of a Naver Webtoon about the dawn hour, scrolled
top to bottom. Aesthetic: webtoon. Theme LIGHT — warm cream paper, brown
ink, one warm apricot accent. Stack: Next.js App Router client page
("use client"), React 19, TypeScript strict, vanilla CSS (classes prefixed
ppang-), vanilla JS animation, zero npm dependencies.

THE PAGE USES FOUR PRE-GENERATED ILLUSTRATIONS (already in
public/media/ppang/ as AVIF + WebP): hero-dawn-bakery (832×1216 vertical),
baker-character (832×1216 vertical), product-cream-bread (1024×1024
square), interior-kitchen (1024×768 landscape). Reference them via a
<picture> with an AVIF <source> + WebP fallback to /media/ppang/<stem>.avif.
THE ILLUSTRATIONS CONTAIN NO TEXT — the bakery's name/sign, SFX, and all
captions must be REAL HTML/SVG (crisp Hangul), never baked into the image.

PALETTE (CSS custom properties on .ppang-root; every rendered color a named
token): paper #faf6ee (ground), paper-warm #f3ead9 (caption scrolls, panel
mounts, footer), ink #3d2817 (12.0:1 on paper, all functional text), ink-soft
#6b513a (6.6:1, secondary/captions), apricot #e89b4c (THE accent — the ! in
PPANG!, dawn light, focus ring; 3.0:1 on paper so DECORATIVE/LARGE ONLY),
amber-deep #a85f1c (4.8:1 — banked apricot for every functional accent on
paper: eyebrows, hours, focus, ::selection ground), dawn-indigo #3a3357 and
dawn-blush #e9a9a0 (decorative sky only, never text). Apricot NEVER carries
text on cream — bank it. Derived: paper-dim = paper @ 82% α (≈9.4:1 on
indigo) for hero text.

TYPE: Black Han Sans (Korean display, the wordmark 빵!, panel titles, SFX) +
Noto Serif KR (every Korean body glyph — captions, narration, hours; a warm
serif so it reads like a letter) + Fraunces (English voice — the sign,
English captions, subtitle). Via next/font/google with literal configs in
fonts.ts. Stacks always lead with the Korean face so Hangul never falls
through to a default sans; :lang(ko) gets +0.01em tracking. English is
always the italic subtitle, never larger than 0.62em of its Korean
companion.

VOICE: dawn-warm, sleepy-affectionate, Korean-first, bread-literal. Korean
in the soft 해요체 register (the baker to a customer); English is the warm
second voice, italicized, NEVER word-for-word. Write ~12 real literary
lines: "새벽 4시, 도시가 잠든 사이 빵이 깨어난다" / "4 AM, while the city
sleeps, the bread wakes up." Banned: artisanal, fresh, delicious.

STRUCTURE (single scroll, a 5-beat chapter):
1. Hero — the establishing shot. A dawn sky backdrop that is SCRUBBED BY
   SCROLL: a CSS custom property --ppang-dawn ∈ [0,1] (set by a scroll hook
   over the first 55% of the page) crossfades three sky gradients —
   pre-dawn indigo → dawn blush → morning gold — as layered elements whose
   OPACITY is the crossfade (cheaper and crisper than animating gradient
   stops). Over the sky, a PARALLAX DIORAMA of the bakery: far hill,
   bakery illustration, hanging sign — each layer drifts at a different
   rate on scroll (--ppang-sky-y, capped 60px) and on pointer move on fine
   pointers (--ppang-px/py, lerp 0.08/frame, transform-only). The sign is
   an inline SVG (real Hangul 빵! in the display face, a small OPEN lamp
   that breathes, a Bakery · 새벽빵집 line) painted over the awning, swaying
   ±1.1°/6.2s. Hero text in a dark lower-third SCRIM (a webtoon caption
   bar) so light text is AA at every dawn phase — more robust than
   interpolating text color. Wordmark 빵! split per syllable (aria-label on
   the h1, aria-hidden glyphs), 140ms KR cadence then 70ms EN, after a
   120ms start. Kicker "새벽 4시 · 도시가 잠든 사이"; lede "빵이 깨어난다. /
   the bread wakes up." Split narration for the lede.
2. Baker intro (01화 · 제빵사) — the character portrait reveals with a
   LEFT-TO-RIGHT clip-path wipe (inset(0 100% 0 0) → inset(0), 1100ms,
   ease cubic-bezier(0.16,1,0.3,1)). Beside it a SPEECH BUBBLE (rounded
   rect, 1.5px ink border, 4px 6px 0 ink offset shadow, a CSS-triangle tail
   pointing at the portrait) whose Korean text arrives GLYPH BY GLYPH (38ms
   stagger) once the panel is visible — like a narrator reading aloud. The
   English line arrives half a beat after. Accessible split text:
   visually-hidden real string + aria-hidden animated glyphs.
3. Signature (02화 · 시그니처) — one centered cream-bread loaf (square),
   CENTER-OUTWARD clip wipe (inset(48% 48% 48% 48%) → inset(0)). Name
   생크림빵 arrives as split text; a small tasting-note dl (맛/taste/가격);
   an SFX stamp "쫀득!" rotated 8° in the corner (amber-deep on paper, ink
   offset shadow).
4. Kitchen (03화 · 부엌) — the wide interior, TOP-TO-BOTTOM clip wipe
   (inset(0 0 100% 0) → inset(0)). A caption strip over the lower third
   (dark gradient) with bilingual narration arriving glyph-by-glyph. By
   here the dawn has fully arrived.
5. Colophon footer (04화 · 콜로폰) — the hours ledger (새벽 4시 오픈 · 06:30
   첫 판 · 다 팔리면 문 닫아요 · 월–금), address (서울 은평구 연북로 12길),
   phone, a sign-off line, © 2026 빵! · 새벽빵집, and a "처음으로 / back to
   the top" link. Hairline rules, tabular numerals for the hours.

Each of the three clip directions is used exactly once so the cuts never
repeat.

TEXTURE: one static full-viewport SVG feTurbulence pass (fractalNoise 0.6,
2 octaves, seed 7) mapped to ink at ~6% α, mix-blend-mode multiply, opacity
0.6 — warm cream fibers, never animated — plus a faint amber vignette and
laid lines.

HARD REQUIREMENTS:
- prefers-reduced-motion: dawn pinned at arrived (--ppang-dawn: 1, gold
  sky), all parallax flattened (--ppang-px/py/sky-y = 0), all ambient
  cycles dead, every pre-reveal state forced to final composition (panels
  clip-path: none, captions opacity 1). The page must read as a printed
  chapter, not a paused animation.
- No text hidden without JS: add .ppang-js on mount; every pre-reveal style
  is gated behind it AND the nearest panel's is-visible class. SSR state =
  the completed chapter.
- Touch: the parallax self-disables on coarse pointers; the dawn still
  scrubs on scroll (it's not pointer-driven). Nothing meaningful lives
  behind hover.
- Keyboard: custom amber :focus-visible ring (amber-deep, 2px, offset 4px)
  on the two footer links; sensible tab order.
- Animate transform/opacity/filter/clip-path only; the only per-frame
  writes are two CSS custom properties (--ppang-dawn, --ppang-sky-y) and the
  pointer-parallax pair (--ppang-px/py), all transform-derived. rAF pauses
  offscreen and on visibilitychange.
- Split text: aria-label or visually-hidden originals + aria-hidden glyphs.
- Custom ::selection (amber-deep ground, paper text) scoped to the root.
- On mount: window.parent?.postMessage({ type: "oneshot:ready", slug:
  "ppang" }, "*").
- Composed at 360px and 1440px+: stages stack single-column, the speech
  bubble moves under the portrait (tail flips up), the hours re-grid.

FILES: page.tsx (fonts + .ppang-root + scroll-progress hook wiring),
components/ (Hero, BakerIntro, ProductShowcase, KitchenStory, BakeryFooter,
Sign [SVG], Narration [accessible split text], Picture [AVIF+WebP]),
hooks/ (usePrefersReducedMotion, useReveal, useScrollProgress,
usePointerParallax), styles.css (all tokens + styles), fonts.ts. Relative
imports only. Zero dependencies.
```

## Known deviations

- **The illustrations are AI-generated (ComfyUI), not hand-drawn —
  deliberate and disclosed.** This is the gallery's first generated-art
  entry. `media.source` is `"comfyui"` and the full recipe ships in
  `image-recipe.md` + `workflows/`. The page's *code* (the webtoon
  framing, the dawn scrub, the parallax, the clip reveals, the split-text
  narration, the SVG sign) is all hand-written; only the four panel
  paintings are generated.
- **The `zenijiMixKWebtoon_v10` checkpoint is NOT YET AUDITED in
  `docs/model-licenses.md`.** Its row reads `NOT YET AUDITED — do not ship
  imagery from this model` at the time of writing. Per `ASSETS-LICENSE.md`
  this is a **G4 gate blocker until a maintainer co-signs an audit row**
  establishing commercial-image-use and CC-BY-4.0-redistribution rights for
  the exact model file. The entry is built so that swapping to an
  audited checkpoint later requires only regenerating the four assets
  under `/media/ppang/` and updating `image-recipe.md` — no code changes.
- The spec's 3 "interactive techniques" map to the taxonomy IDs
  `clip-path-reveal` (panel reveals), `char-split-reveal` (caption
  narration per panel), and `pointer-parallax` (hero diorama depth). The
  dawn-light scroll gradient is implemented honestly as part of the
  reveal system (a scroll-tied backdrop), not as a separate taxonomy tag
  — there is no `scroll-gradient` id in `registry/taxonomy.ts`, and
  `scroll-scrub-pinned` requires a pinned section, which this page does
  not have.
- The entry number is **15**, not 13 as briefed — `sup` already occupies
  no 13, and creating a collision would fail the `unique-no` validate
  check. `moonlit` (no 14) and `gradient-plaza` (no 14) are a pre-existing
  collision unrelated to this entry.
- The hero text sits over a fixed dark scrim rather than interpolating its
  color with the dawn. The brief implied text that adapts to the sky; in
  practice `color-mix`-based interpolation left the English subtitle
  below AA on the gold phase, and a scrim is both more robust and more
  authentic to how webtoons caption their panels.
- The dawn-sky crossfade uses three stacked elements with opacity driven
  by `--ppang-dawn` via `calc()` + `clamp()` + `max()`/`min()`. The blush
  phase's triangular peak is built as `1 - max(dawn - 0.5, 0.5 - dawn) * 2`
  — deliberately avoiding `abs()` (newer, uneven support) for the same
  result. This avoids per-frame gradient-stop animation entirely.
