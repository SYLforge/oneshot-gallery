# Image recipe · PPANG! illustrations

The four illustrations under `public/media/ppang/` were generated in
ComfyUI. This is the human-readable recipe; the exported graph is in
`workflows/ppang-webtoon.json`. Assets are released CC BY 4.0 — see
`../ASSETS-LICENSE.md` for the honest caveat about AI-imagery copyright.

> **License audit status (G4 gate).** The checkpoint
> `zenijiMixKWebtoon_v10` is **NOT YET AUDITED** in
> `../../docs/model-licenses.md` at the time of writing. Per
> `ASSETS-LICENSE.md`, generated imagery must not ship from a model without
> a passing, dated, maintainer-co-signed audit row. This entry is staged
> for that audit; until it passes, the assets are placeholder-provenance
> and the entry should not be considered to have cleared the G4 gate.
> Swapping to an audited checkpoint later regenerates only these four
> files — no code changes.

## Shared pipeline

- **Checkpoint:** `zenijiMixKWebtoon_v10` (Illustrious-XL merge lineage,
  SD1.5-family, 1024-class native handling).
- **LoRA:** `toonystarkKoreanWebtoonFlux` at **strength 0.75** — pushes the
  output toward clean Korean-webtoon lineart and flat warm shading.
- **Sampler / scheduler:** `euler_ancestral`, 30 steps, **CFG 6.5**.
- **Upscale:** `RealESRGAN_x4plus` (4x model) at **2× resize** (0.5
  denoise on a second KSampler pass for the hero only, to keep edges
  crisp without re-imagining the scene), then back down to the ship size.
- **Encode:** AVIF (quality ~60, the gallery default) + WebP (quality ~82)
  for every asset, via the capture pipeline's sharp pass. The AVIF is the
  `<source>`; the WebP is the `<img src>` fallback.
- **Negative prompt (all assets):**
  `text, watermark, signature, logo, letters, caption, speech bubble,
   lowres, bad anatomy, bad hands, extra fingers, blurry, jpeg artifacts,
   3d, photorealistic, grayscale, deformed, ugly, duplicate`

## Per-asset recipes

### 1. `hero-dawn-bakery` — establishing shot (832×1216 vertical)

The bakery at dawn, seen from across the narrow street, warm light already
in the window. Establishes the whole chapter's mood and palette.

- **Prompt:**
  `korean webtoon background art, a small neighborhood bakery on a narrow
   seoul side street before dawn, warm yellow light glowing from the
   storefront window, indigo pre-dawn sky with a faint pink horizon, quiet
   empty street, hanging wooden sign blank, awning, warm cream and brown
   palette, soft cell shading, clean lineart, vertical composition,
   cozy sentimental mood, no text, no letters`
- **Seed:** `1042` (cherry-picked for the awning shape and the lit window).
- **Ship size:** 832×1216 (upscaled 2× then center-cropped back).

### 2. `baker-character` — the baker (832×1216 vertical)

The owner: a young woman in an apron, hands resting on dough. Warm window
light from camera-left.

- **Prompt:**
  `korean webtoon character art, a young korean woman baker in her late
   twenties wearing a cream apron over warm clothes, hands resting on
   bread dough on a wooden table, soft warm window light from the left,
   gentle confident expression, brown hair tied back, cozy dawn bakery
   interior, warm cream and brown palette, clean lineart, flat cell
   shading, upper body, vertical composition, sentimental, no text,
   no letters`
- **Seed:** `7781`.
- **Ship size:** 832×1216.

### 3. `product-cream-bread` — signature loaf (1024×1024 square)

A single cream bread (생크림빵), golden crust, on warm paper. The hero
product.

- **Prompt:**
  `korean webtoon food art, a single korean cream bread pastry
   (sang-keu-rim-ppang), golden brown crust dusted with flour, split open
   to show white cream filling, resting on warm cream paper, soft warm
   light, appetizing, clean lineart, flat warm shading, brown and cream
   palette, centered square composition, no text, no letters, no plate`
- **Seed:** `3091`.
- **Ship size:** 1024×1024.

### 4. `interior-kitchen` — the kitchen (1024×768 landscape)

The bakery kitchen at the moment the first tray is ready: oven, dough
table, warm wood, dawn light through the window.

- **Prompt:**
  `korean webtoon background art, interior of a small bakery kitchen at
   dawn, stone oven glowing, wooden dough table with rising dough, warm
   wood cabinets, morning light streaming through a window, steam, cozy
   warm atmosphere, cream brown and amber palette, clean lineart, flat
   cell shading, wide landscape composition, sentimental, no people,
   no text, no letters`
- **Seed:** `5560`.
- **Ship size:** 1024×768.

## Post-generation notes

- **No text in any image, by prompt and by negative prompt.** The bakery's
  name, the sign's "OPEN", the SFX (쫀득!), and every caption are rendered
  as real HTML/SVG/CSS on top — so Hangul is crisp vector and fully
  accessible, and the images can be regenerated without retyping.
- Minor inpainting (2-pass) was used on the hero to clean awning edges and
  remove a stray sign-like artifact; no faces were retouched (the baker is
  shown from a distance / upper body, expression left as generated).
- Seeds are recorded so the assets are reproducible against the same
  checkpoint + LoRA; the LoRA's own license permits the image outputs used
  here pending the checkpoint audit above.
