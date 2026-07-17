---
provenance: distilled-recipe
model: builtin:zai-coding-plan/GLM-5.2
harness: ZCode CLI
date: 2026-07-17
attempts: 1
verification:
  status: unverified
---

The prompt below is a **distilled recipe** — the entry was built
iteratively (human + AI), and this is the brief compressed to what a strong
model needs to regenerate a comparable page in one shot. It is labeled
`distilled-recipe` (Class B) honestly, not `one-shot`:
`meta.prompt.oneshot` is `false`. The three minhwa illustrations were
generated separately in ComfyUI; their recipe is in `image-recipe.md` and
the exported graph in `workflows/minhwa.json`.

```text
Build a complete, art-directed landing page for a fictional Korean brand:
MINHWA 민화 — A Gallery of Wishes, the folk-painting archive of a small
Ikseon-dong preservation society. Every motif in the gallery is a wish:
호작도 (tiger + magpie = good news + protection), 모란 (peony = prosperity),
십장생 (ten longevity symbols under sun + moon = long life). Aesthetic:
korean-traditional. Theme LIGHT — aged hanji paper, ink-black line work,
the obangsaek (오방색) five-color system as cosmology. This is the bright,
generous, symbolic opposite of austere ink: naive, vivid, charming, full of
meaning. Stack: Next.js App Router client page ("use client"), React 19,
TypeScript strict, vanilla CSS (classes prefixed minhwa-), vanilla JS
animation, zero npm dependencies.

THE PAGE USES THREE PRE-GENERATED MINHWA ILLUSTRATIONS (already in
public/media/minhwa/ as AVIF + WebP): hero-tiger-magpie (832×1216 vertical,
hojakdo), peony-prosperity (1024×1024 square, moran-do), sun-moon-longevity
(1024×768 landscape, sipjangsaeng). Reference them via a <picture> with an
AVIF <source> + WebP fallback to /media/minhwa/<stem>.avif. THE
ILLUSTRATIONS CONTAIN NO TEXT — every Hangul caption, symbol meaning, seal
(인장), and obangsaek hanja must be REAL HTML/SVG (crisp vector), never
baked into the image.

PALETTE (CSS custom properties on .minhwa-root; every rendered color a
named token): hanji #f5efe1 (aged ground), hanji-deep #ece3cf (folds,
mounts, footer), heuk #1a1410 (흑/먹 — ink-black line, all functional text,
13.6:1 AAA), ink-soft #5a4a3c (thinned ink, secondary/captions, 6.5:1 AA),
jeok #c8362b (적/석간주 — THE accent: focus ring, ::selection, links, the
signature red, 4.7:1 AA), cheong #2f6e6a (청/청록 — east/pine/tiger-sky,
5.0:1 AA), hwang #d99a1f (황/석황 — center/sun/longevity gold, 2.6:1 so
DISPLAY/DECORATIVE ONLY; 8.4:1 on heuk), baek #fbf8ef (백/호분 — west/moon/
paper-white, never text on hanji), jeongjo #7a241c (banked jeok for fine
red text on a wash, 7.0:1 AAA), seal-red #b6241b (the vermillion of a real
인장, slightly deeper than jeok). A living accent --minhwa-accent-live
defaults to jeok and is overridden by the ObangsaekNavigator. hwang never
carries body text on hanji — bank or use as a dot over heuk. When 백 is
selected the accent borrows ink-soft so the focus ring does not vanish.

TYPE: Gaegu (Korean display — a naive hand-brushed village-painter face;
the wordmark 민화, motif titles, seal captions. Black Han Sans would shout;
Gaegu smiles) + Noto Serif KR (every Korean body glyph — symbol-meaning
narration, obangsaek notes, colophon; a warm museum-label serif) + Fraunces
(English voice — subtitle, captions, folio numerals; optical-sized italic).
Via next/font/google with literal configs in fonts.ts. Stacks always lead
with the Korean face so Hangul never falls through to a default sans;
:lang(ko) opens tracking a hair. English is the leaning italic subtitle,
never larger than ~0.62em of its Korean companion.

VOICE: wishful, generous, warm-docent, Korean-first, symbol-literate.
Korean in the soft 해요체 register of a docent; English is the warm second
voice, italic, NEVER word-for-word. Every motif names its wish: 호랑이는
기쁜 소식, 까치는 좋은 낭문 / 모란은 부귀(富貴)의 그림이다 / 그림 한 폭에
소원 하나. Banned: exquisite, timeless, and "charming" as a label on a
specific motif (show it, don't name it).

STRUCTURE (single scroll, 5 sections):
1. Hero — 호작도 establishing shot. The tiger-magpie painting mounted on
   hanji, two small obangsaek sun (황) + moon (청) discs floating in the
   corner drifting on mutually-prime ambient cycles (7.1s, 6.3s). Wordmark
   민화 split per Hangul syllable (aria-label on h1), KR glyphs landing
   with a spring-press pop (ease-stamp cubic-bezier(0.34,1.56,0.64,1)),
   EN settling. Kicker "소원을 그린 그림 / a gallery of wishes"; lede
   "호랑이는 기쁜 소식, 까치는 좋은 낭문." as split-text narration. A small
   corner seal (SVG, 민/畵) as the painter's first mark.
2. Peony (02 · 모란) — the square peony panel beside its meaning legend.
   The visitor finishes the wish by PRESSING THE SEAL: a vermillion 인장
   descends (translateY -90%→0 + scale 1.25→1, 480ms ease-press), lands,
   and a 1px ink rim expands (360ms) to certify it. On touch / reduced
   motion the seal self-stamps on scroll-in; on fine pointers it waits
   for the press/focus. Meaning arrives as split-text narration: "모란은
   부귀(富貴)의 그림이다." A dl of 상징/어울리는 자리/결합.
3. Obangsaek (03 · 오방색) — the five-color navigator. Five selectable
   swatches (청 적 황 백 흑) each with hanja, name, direction, element;
   selecting one sets --minhwa-accent-live on the root INSTANTLY (pigment
   does not ease), tinting focus ring + section rule + hover washes, and
   reveals that color's note: the minhwa motif it lives in + its
   cosmological meaning. Every note in the DOM; with JS only the active
   shows.
4. Longevity (04 · 십장생) — a SCROLL-SCRUBBED PINNED section. A tall
   outer track, a sticky inner stage with the sun-moon-longevity painting
   as a faded fixed backdrop. The ten longevity symbols (해 달 산 물 돌
   소나무 불로초 학 사슴 거북) advance one position at a time as
   --minhwa-longevity ∈ [0,1] is written on the stage by a scroll hook.
   The active symbol (index = round(p × 9)) scales 0.92→1.08 and its wish
   caption crossfades — derived PURELY from the custom property via
   calc()/clamp()/round(), transform/opacity only. A progress rail fills
   with the property. Under reduced motion / no-JS the section opens as a
   composed grid with all ten visible.
5. Colophon (05) — 민화란 (what minhwa is), 오방색 색인 (compact legend),
   화랑 (fictional Ikseon-dong Minhwa Archive address + hours), a final
   민/畵 seal, "그림 한 폭에 소원 하나.", © 2026, and a "처음으로 / back to
   the top" link. Hairline rules, tabular numerals.

TEXTURE: one static full-viewport SVG feTurbulence pass (fractalNoise 0.7,
2 octaves, seed 11) mapped to heuk at ~6.5% α, mix-blend-mode multiply,
opacity 0.55 — warm aged fibers, never animated — plus a faint radial
warm-brown foxing vignette and 7px laid lines.

HARD REQUIREMENTS:
- prefers-reduced-motion: every pre-reveal state forced to final (motifs
  opacity 1, glyphs whole, seal already stamped and landed instantly with
  no press animation, ambient cycles dead). The longevity section disables
  the pin and opens as a composed grid with all ten symbols + wishes
  visible (the section carries a data-minhwa-reduced flag the CSS reads).
  The page must read as a finished scroll, not a paused animation.
- No text hidden without JS: add .minhwa-js on mount; every pre-reveal
  style is gated behind it AND the nearest panel's is-visible class. SSR
  state = the finished gallery. No-JS: longevity unpins to a grid, all
  obangsaek notes visible, every wish visible.
- Touch: the seal self-stamps on scroll-in (the certification is never
  missed). Nothing meaningful lives behind hover.
- Keyboard: custom :focus-visible ring (the living accent, 2px on a 2px
  hanji halo) on the obangsaek buttons, the seal-press button, and the
  footer link; sensible tab order.
- Animate transform/opacity/filter/clip-path only; the only per-frame
  writes are --minhwa-longevity (scroll) and --minhwa-accent-live
  (selection). rAF pauses offscreen and on visibilitychange.
- Split text: aria-label or visually-hidden originals + aria-hidden glyphs.
- Custom ::selection (jeongjo ground, baek text) scoped to the root.
- On mount: window.parent?.postMessage({ type: "oneshot:ready", slug:
  "minhwa" }, "*").
- Composed at 360px and 1440px+: hero stacks single-column, peony legend
  drops under the painting, obangsaek rail re-grids (5 → 2 → 1), footer
  re-grids.

TECHNIQUE TAGS (exactly 3, each distinct from the dancheong cousin GIWA):
spring-press (the stamp/pop motif reveals + the seal-press feedback),
char-split-reveal (the symbol-meaning narration per glyph),
scroll-scrub-pinned (the ten longevity symbols walked through a pinned
sticky stage).

FILES: page.tsx (fonts + .minhwa-root + longevity scrub wiring),
components/ (Hero, PeonyProsperity, ObangsaekNavigator, LongevitySymbols,
FolkFooter, SealMark [SVG 인장], Narration [accessible split text], Picture
[AVIF+WebP]), hooks/ (usePrefersReducedMotion, useReveal, useSealStamp,
useLongevityScrub), styles.css (all tokens + styles), fonts.ts. Relative
imports only. Zero dependencies.
```

## Known deviations

- **The illustrations are AI-generated (ComfyUI), not hand-painted —
  deliberate and disclosed.** `media.source` is `"comfyui"` and the full
  recipe ships in `image-recipe.md` + `workflows/minhwa.json`. The page's
  *code* (the minhwa framing, the stamp/spring reveals, the seal-press
  mechanic, the obangsaek navigator, the pinned longevity scrub, the split-
  text narration, the SVG seals and hanja) is all hand-written; only the
  three panel paintings are generated.
- **The `bismuthIllustrious_v80` checkpoint is audited CONDITIONAL, not
  OK, in `docs/model-licenses.md`.** Its row reads `CONDITIONAL — see
  notes` as of 2026-07-17: commercial image use is permitted under the
  inherited CreativeML Open RAIL++-M license, with two items (merge
  ancestry disclosure, CC BY 4.0 redistribution compatibility) pending
  maintainer co-sign to OK. Per `ASSETS-LICENSE.md` this **permits the
  imagery to ship today**; swapping to a fully-OK checkpoint later requires
  only regenerating the three assets under `/media/minhwa/` and updating
  `image-recipe.md` — no code changes.
- **The `toonystarkKoreanWebtoonFlux` LoRA is applied at strength 0.4, not
  ppang's 0.75.** At 0.75 the LoRA pulls toward clean webtoon lineart; at
  0.4 it only loosens the rendering toward Korean-painting flatness, which
  is minhwa's register. The LoRA is a seasoning, not the recipe.
- The spec's 3 "interactive techniques" map to the taxonomy IDs
  `spring-press` (motif stamp/pop + seal-press feedback),
  `char-split-reveal` (symbol-meaning narration), and
  `scroll-scrub-pinned` (the ten longevity symbols walked through a pinned
  sticky stage). All three are distinct from GIWA's tags
  (`svg-line-draw`, `clip-path-reveal`, `feturbulence-texture`,
  `pointer-parallax`).
- The entry number is **18**, the first free number (the roster reaches 17
  at the time of writing). The `korean-traditional` family holds only GIWA
  before this entry, so MINHWA is the family's second slot (cap is 3).
- The longevity section's active-symbol highlighting uses CSS `round()` of
  `--minhwa-longevity × 9` plus `abs()` to light the active symbol and
  crossfade its wish — all derived from the single scroll custom property,
  transform/opacity only. `round()` shipped in every current browser by
  2024; the no-JS and reduced-motion paths bypass the pin entirely and
  reveal all ten symbols as a composed grid, so a browser without `round()`
  support still reads the section (symbols dim but wishes stay visible).
- The hero corner seal (민/畵) and the footer seal are decorative SVG; the
  one *interactive* seal is the peony's press-to-certify 인장. Keeping the
  interactive mechanic to one section is a deliberate restraint — pressing
  a seal means something because it happens once.
