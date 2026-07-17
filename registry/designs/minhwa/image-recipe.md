# Image recipe · MINHWA illustrations

The three minhwa illustrations under `public/media/minhwa/` were generated in
ComfyUI. This is the human-readable recipe; the exported graph is in
`workflows/minhwa.json`. Assets are released CC BY 4.0 — see
`../ASSETS-LICENSE.md` for the honest caveat about AI-imagery copyright.

> **License audit status (G4 gate).** The checkpoint
> `bismuthIllustrious_v80` is audited **CONDITIONAL** in
> `../../docs/model-licenses.md` as of 2026-07-17. The inherited CreativeML
> Open RAIL++-M license permits commercial use of generated images (the
> gallery's requirement). Two items keep the verdict conditional rather
> than OK — (1) the merge ancestry of the community `bismuthIllustrious_v80`
> build is not fully disclosed, and (2) CC BY 4.0 redistribution
> compatibility is confirmed-as-compatible but awaiting maintainer co-sign.
> Per `ASSETS-LICENSE.md` this **permits the imagery to ship today**; the
> row and these notes are visible on the assets license page, the model
> file and license are cited here and in `PROMPT.md`, and a maintainer
> co-sign moves the verdict to OK before the next roster milestone. The
> `toonystarkKoreanWebtoonFlux` LoRA is applied at low strength (0.4) to
> steer toward Korean-painting flatness, not to reproduce webtoon lineart.

## Shared pipeline

- **Checkpoint:** `bismuthIllustrious_v80` (Illustrious-XL merge lineage,
  SDXL base). Chosen for its painterly, flat-shaded, slightly naive figure
  rendering — closer to minhwa's "meaning first, finish second" than the
  cleaner webtoon merges.
- **LoRA:** `toonystarkKoreanWebtoonFlux` at **strength 0.4** — a *light*
  hand. At 0.75 (the ppang dose) this LoRA pulls toward clean webtoon
  lineart; at 0.4 it only loosens the rendering toward Korean-painting
  flatness and warmer pigment, which is exactly the folk register minhwa
  needs. The LoRA is a seasoning, not the recipe.
- **Sampler / scheduler:** `euler_ancestral`, 30 steps, **CFG 7** (a touch
  more adherence than ppang's 6.5, so the symbolic motifs — tiger, magpie,
  peony, ten symbols — stay legible rather than drifting).
- **Upscale:** `RealESRGAN_x4plus` (4x model) at **2× resize**, with a 0.5
  denoise second KSampler pass on the hero only (the tiger-magpie) to keep
  the ink outlines crisp without re-imagining the scene, then back down to
  the ship size.
- **Encode:** AVIF (quality ~60, the gallery default) + WebP (quality ~82)
  per asset, via the capture pipeline's sharp pass. AVIF is the `<source>`;
  WebP is the `<img src>` fallback.
- **Negative prompt (all assets):**
  `text, watermark, signature, logo, letters, caption, speech bubble,
   modern, photorealistic, 3d render, grayscale, anime screentone, lowres,
   bad anatomy, blurry, jpeg artifacts, deformed, ugly, duplicate, frame,
   border`

## Per-asset recipes

### 1. `hero-tiger-magpie` — 호작도 (832×1216 vertical)

The establishing motif: a tiger under a pine, a magpie chattering above. In
minhwa the pair is a wish — the magpie is 기쁜 소식 (good news), the tiger
is protection. This is the painting the gallery opens on.

- **Prompt:**
  `korean minhwa folk painting, hojakdo, a tiger sitting under a pine tree
   looking up at a magpie perched on a branch, naive charming folk art
   style, flat vivid pigments, obangsaek five-color palette of blue-green
   red yellow white black, aged hanji paper ground, bold ink outlines,
   cheerful symbolic mood, vertical scroll composition, traditional joseon
   folk painting, no text, no letters, no signature`
- **Seed:** `21807` (cherry-picked for the tiger's sideways folk-grin and
  the magpie's clear silhouette against the pine).
- **Ship size:** 832×1216 (upscaled 2× then center-cropped back).

### 2. `peony-prosperity` — 모란도 (1024×1024 square)

The prosperity motif: peonies in full bloom. 모란 = 부귀영화. Square, so it
can sit beside the seal-press interaction as the wish the visitor certifies.

- **Prompt:**
  `korean minhwa folk painting, moran-do, several peonies in full bloom
   with lush green leaves, naive charming folk art style, flat vivid
   pigments, obangsaek palette red pink yellow green white, aged hanji
   paper ground, bold ink outlines, prosperous generous mood, centered
   square composition, traditional joseon folk painting, no text, no
   letters, no signature`
- **Seed:** `4419`.
- **Ship size:** 1024×1024.

### 3. `sun-moon-longevity` — 해·달·십장생 (1024×768 landscape)

The longevity motif: the ten 십장생 gathered under sun and moon — mountain,
water, rock, pine, crane, deer, turtle, herb of immortality. Landscape, so
it can be the fixed backdrop of the pinned scroll-scrub section.

- **Prompt:**
  `korean minhwa folk painting, sipjangsaeng ten longevity symbols, a sun
   and a moon in the sky, mountains and water and rocks below, a pine
   tree, a crane, a deer, a turtle, ganoderma mushroom of immortality, all
   gathered in one landscape, naive charming folk art style, flat vivid
   pigments, obangsaek five-color palette, aged hanji paper ground, bold
   ink outlines, symbolic abundant mood, wide landscape composition,
   traditional joseon folk painting, no text, no letters, no signature`
- **Seed:** `8362`.
- **Ship size:** 1024×768.

## Post-generation notes

- **No text in any image, by prompt and by negative prompt.** Every
  Hangul caption, symbol meaning, seal, and folio number is rendered as
  real HTML/SVG/CSS on top — so Hangul stays crisp vector and fully
  accessible, and the images can be regenerated without retyping. This is
  why the seal 인장 and the obangsaek hanja are SVG `<text>`, not baked in.
- The obangsaek palette is named in each prompt so the generated pigments
  land in the right family, but the *system* (five colors with
  cosmological roles) is taught in the page's ObangsaekNavigator — the
  image is a painting, the cosmology is code.
- Minor inpainting (2-pass) was used on the hero to clean the tiger's
  outline where the 2× upscale softened it; no symbolic content was added
  or removed by hand.
- Seeds are recorded so the assets are reproducible against the same
  checkpoint + LoRA + strength; the LoRA's own license permits the image
  outputs used here under the audited checkpoint above.
