# PPANG! — design spec

## Identity

A neighborhood Korean bakery on a side street in Eunpyeong-gu, Seoul, that
opens at 4 AM so the first commuters smell bread. The owner inherited it
from her grandmother and bakes in the same hour her grandmother did — *the
hour the bread wakes up*. The page is not a shop; it is one chapter of a
Naver Webtoon about that hour. You scroll the way you scroll a webtoon:
establishing shot, the baker introduced by a speech bubble, the signature
loaf named, the kitchen narrated, and a colophon that tells you where to
find the bakery at dawn. The emotional register is warm, a little sleepy,
and affectionate — the voice of someone who genuinely loves 4 AM and is a
little embarrassed to admit it. Korean is the first voice; English is the
warm translation beside it, never the lead.

This entry is the gallery's first generated-art entry, and its thesis is
that **generated illustration belongs when the page is a story**: every
panel is a drawing in a chapter, revealed panel-by-panel, captioned like a
webtoon. The illustrations carry no text — the bakery's name, the SFX, the
captions are all real HTML/SVG/CSS, so Hangul stays crisp and accessible.

## Palette

| Token | Hex | Role | Contrast |
| --- | --- | --- | --- |
| `paper` | `#faf6ee` | ground — warm cream paper, the webtoon background | — |
| `paper-warm` | `#f3ead9` | aged paper — caption scrolls, mounts, footer ground | — |
| `ink` | `#3d2817` | warm brown ink — all functional text, wordmark, frames | 12.0:1 on paper (AAA) |
| `ink-soft` | `#6b513a` | ink thinned with milk — secondary text, captions | 6.6:1 on paper (AA) |
| `apricot` | `#e89b4c` | the accent — dawn light, the ! in PPANG!, focus, selection | 3.0:1 on paper — decorative/large only |
| `amber-deep` | `#a85f1c` | banked apricot — functional accent: eyebrows, hours, focus, selection ground | 4.8:1 on paper (AA) |
| `dawn-indigo` | `#3a3357` | pre-dawn sky at the top of the scroll — decorative backdrop | never text |
| `dawn-blush` | `#e9a9a0` | the pink middle of the dawn sky — decorative only | — |
| `crust` | `#b6742e` | baked-bread brown — the loaf tone, SFX fills | 3.4:1 — decorative/large |

Derived working tokens: `paper-dim` = paper @ 82% α (≈ `#d9d2c2`, 9.4:1 on
indigo) for hero text over the dawn scrim; `hairline` / `hairline-strong` =
ink @ 16% / 32% α for rules and mounts. The accent `apricot` measures only
3.0:1 on paper, so it is **never functional text on cream** — everywhere
the accent must speak on paper it is banked to `amber-deep` (4.8:1, AA):
section eyebrows, the hours' time numerals, the focus ring, the
`::selection` ground. Apricot is allowed as a surface (the OPEN lamp, the
SFX stamp's fill is amber-deep on paper) and as large display only.

The hero text sits over a dark scrim (a webtoon lower-third) so light text
is AA at *every* dawn phase — this is more robust than interpolating text
color and more authentic to how webtoons caption their panels.

## Type system

| Font | Source | Role |
| --- | --- | --- |
| Black Han Sans (400) | Google Fonts via `next/font` | Korean display — the wordmark 빵!, panel titles, SFX lettering; loud, warm, webtoon-cover voice |
| Noto Serif KR (400, 500, 700) | Google Fonts via `next/font` | every Korean body glyph — captions, narration, hours; a warm serif so the story reads like a letter |
| Fraunces (400, 500, 600) | Google Fonts via `next/font` | English voice — the sign, English captions, the subtitle; optical-sized and cozy |

- Family stacks always lead with the Korean face (`--font-kr` → Noto Serif
  KR → serif; `--font-display` → Black Han Sans → Korean → sans) so Hangul
  never falls through to a default sans. `:lang(ko)` additionally opens
  letter-spacing to 0.01em so the syllables breathe.
- Base size `clamp(16.5px, 0.85vw + 12px, 19px)`, line-height 1.75.
- Display: KR wordmark `clamp(4.6rem, 22vw, 16rem)` (Black Han Sans is a
  heavy display face, so 400 is already a shout). Section titles
  `clamp(2.1rem, 5.6vw, 3.6rem)`.
- English is always the subtitle, set in Fraunces italic, never larger
  than 0.62em of its Korean companion — the two languages are
  distinguished by posture and weight, the English leaning, the Korean
  standing.
- Numerals (hours, prices): `font-variant-numeric: lining-nums
  tabular-nums` for the one ledger on the page.

## Texture recipe

Three static paper layers (none animated — the paper is a sheet, not a
screen):

1. **Fibers** — one fixed full-viewport SVG `feTurbulence`
   (`fractalNoise`, baseFrequency 0.6, 2 octaves, seed 7,
   `stitchTiles="stitch"`) mapped by `feColorMatrix` to ink at ~6% α,
   `mix-blend-mode: multiply`, opacity 0.6 — warm cream fibers.
2. **Warmth** — a radial amber vignette, transparent to
   `rgba(232,155,76,0.05)` at the page edges.
3. **Laid lines** — `repeating-linear-gradient`, 1.5px of
   `rgba(61,40,23,0.015)` every 6px.

Each illustration panel adds its own paper: `paper-warm` ground inside a
1px `hairline` mount with `0 18px 40px rgba(61,40,23,0.12)` soft shadow and
`clamp(8px,1.2vw,14px)` padding — a drawing glued to the page.

## Motion vocabulary

| Name | Value | Used for |
| --- | --- | --- |
| `ease-page` | `cubic-bezier(0.16, 1, 0.3, 1)` | every entrance — a page turned and settling |
| `ease-pan` | `cubic-bezier(0.33, 1, 0.68, 1)` | camera pans, gentler |
| panel-reveal | clip-path inset → inset(0), 1100ms `ease-page`, three directions (L→R, center-out, T→B) | the three illustration panels |
| caption-in | opacity + translateY(12px), 800ms, fired 350ms after its panel is visible | speech bubble, kitchen caption |
| glyph-cadence | 850ms `ease-page`; 38ms/glyph stagger for split captions | narration lines — like a narrator reading aloud |
| parallax-depth | hero layers translate by scroll progress × {far 0.4, bakery 0.7, sign 1.1}, capped 60px | the diorama |
| pointer-parallax | hero layers lean by --ppang-px/py × {±6, ±10, ±18}px, lerp 0.08/frame | the diorama on fine pointers |
| dawn-scrub | --ppang-dawn ∈ [0,1] crossfades 3 sky gradients, scroll progress 0→0.55 | the dawn arriving |
| hero-float | sign sways ±1.1° / 6.2s; OPEN lamp breathes / 5.3s | ambient; mutually prime |
| reveal | 950ms `ease-page`, translateY(20px) → 0, 90ms batch stagger | section heads, hours, footer |

Timing rule: the two ambient cycles (6.2s sway, 5.3s lamp) and the hint
drift (4.6s) share no common divisor, so the idle hero never visibly loops.
Nothing on the page bounces; everything settles.

## Space & shape

- Sections breathe at `clamp(72px, 12vh, 140px)`; the hero is exactly one
  viewport; the footer opens at `clamp(80px, 14vh, 150px)`.
- Reading measures: section heads and the hours at 880px; the baker stage
  and product stage at 1120px; the kitchen panel at 1180px. The hero is
  full-bleed — the establishing shot is the one thing that owns the frame.
- Shapes are rounded rectangles (the speech bubble rx 18, the SFX stamp rx
  6) and hairline rules. The speech bubble carries a hand-drawn offset
  shadow (`4px 6px 0 ink`) — the one place the page gets deliberately
  playful, because that is what a webtoon speech bubble is.
- Asymmetry is deliberate: the baker's portrait and bubble lean right; the
  product is centered (it is the signature, it gets the stage); the kitchen
  is full-width (it is the wide shot).

## Voice guide

**Five adjectives:** dawn-warm · sleepy-affectionate · Korean-first ·
bread-literal · quietly proud.

**Three example lines:**

1. "새벽 4시, 도시가 잠든 사이 빵이 깨어난다." / "4 AM — while the city
   sleeps, the bread wakes up."
2. "할머니는 빵이 깨어나는 시간에 일하셨대요. 저도 그 시간에 일해요." /
   "Grandma worked the hour the bread wakes. So do I."
3. "문이 열리면 새벽 냄새가 먼저 나옵니다. 빵은 그 다음입니다." / "The
   door opens and the smell of dawn comes first. The bread comes after."

**Three banned words:** *artisanal* (marketing-speak the bakery would never
use about itself), *fresh* (everything here is fresh, saying it is
embarrassing), *delicious* (the page makes you smell it; it does not tell
you it smells good).

Grammar of the voice: short Korean sentences, present tense, the
polite/soft 해요체 register (the baker speaking to a customer). The English
is never a word-for-word translation — it is the same observation re-felt
in English, italicized to mark it as the second voice. Prices are exact;
warmth never is.

## Do & Don't

**Do**

1. Route every color through a token; if a new shade is needed, bank the
   apricot (→ `amber-deep`) or thin the ink (→ `ink-soft`), and name it.
2. Give Korean the first word and the last word in every pairing. Read it
   aloud — if it sounds like translation, rewrite it as the baker's own
   observation.
3. Let the illustrations be the slow thing: a panel takes 1100ms to wipe
   open; everything else waits for it.
4. Keep the dawn scrub and the parallax transform/opacity-only — the only
   per-frame writes are two CSS custom properties on the root.
5. Treat every generated image as a drawing in a chapter: number it,
   caption it, mount it on paper.

**Don't**

1. Don't put apricot text on cream — bank it (`amber-deep`) or use it as a
   surface/large-display only.
2. Don't bake text into the illustrations. The bakery's name, the SFX, the
   captions are all real HTML/SVG so Hangul stays crisp and accessible.
3. Don't add a second signature motion: one clip-path direction per panel,
   one dawn gradient, one parallax diorama. Repetition kills the webtoon
   rhythm.
4. Don't animate layout — transform, opacity, filter, clip-path, and the
   two CSS custom properties (`--ppang-dawn`, `--ppang-sky-y`), nothing
   else.
5. Don't let the fiction wink — no "dough-rising to the occasion" puns.
   The bakery believes it is a bakery.

## On the generated imagery (provenance)

The four illustrations are generated in ComfyUI (Illustrious-XL merge
`zenijiMixKWebtoon_v10` + `toonystarkKoreanWebtoonFlux` LoRA @ 0.75). The
full recipe ships in `image-recipe.md` and the exported graph in
`workflows/`. The checkpoint's commercial-use license is **not yet
audited** in `docs/model-licenses.md` (row `zenijiMixKWebtoon_v10` is
`NOT YET AUDITED` at the time of writing) — see `PROMPT.md` Known
deviations. The images ship under CC BY 4.0 per `ASSETS-LICENSE.md`, with
the honest caveat that purely AI-generated imagery may not be
copyrightable in all jurisdictions.
