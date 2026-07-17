# MINHWA — design spec

## Identity

A gallery of Korean folk painting (민화) where every motif is a wish. The
tiger under the pine with the magpie chattering above (호작도) is a wish for
good news and protection; the peony in full bloom (모란) is a wish for
prosperity and honor; the ten things that do not age gathered under the sun
and the moon (십장생) is the deepest wish of all — to live long. Minhwa is
the folk art of late Joseon, painted by unnamed hands for households that
could not afford a literati scroll: rough where the literati refined,
generous where they withheld, meaning first and finish second. This gallery
is the bright opposite of KEMURI's austere zen and of GIWA's disciplined
line — naive, vivid, charming, and full of cosmological order underneath
the charm.

The page is Korean-first. Every pairing leads with Hangul; English is the
leaning subtitle, the museum card beside the painting. The voice is the
warm docent of a small folk-painting archive in Ikseon-dong — the person
who tells you *why* the tiger is smiling, not just *that* it is.

## The market-gap thesis

`docs/references/asian-aesthetics.md` §"The Korean-traditional gap" states
it directly: *no verified Awwwards/FWA winner exists whose explicit theme
is dancheong, minhwa, or hanji.* Korean award-winners skew toward
minimalist studios and typography. **A gallery entry that overtly
modernizes minhwa — tiger/magpie, peony, the ten longevity symbols under
the obangsaek system — has no direct competitor.** GIWA (the dancheong
cousin) draws the eave in ink and floods it with pigment; MINHWA fills the
page with the finished paintings and asks the visitor to read them. The two
are deliberately complementary: GIWA is the craft of the pigment, MINHWA is
the meaning of the picture. This entry fills the minhwa half of the gap.

## Palette

The obangsaek (오방색) five-color system structures the page as a cosmology,
not a swatch set. Each hue has a direction, a season, an element, and a
motif it lives in. The ground is aged hanji; the line is ink-black.

| Token | Hex | Role | Contrast |
| --- | --- | --- | --- |
| `hanji` | `#f5efe1` | ground — aged mulberry paper; every minhwa is painted on it | — |
| `hanji-deep` | `#ece3cf` | aged-paper fold — caption scrolls, panel mounts, footer | — |
| `heuk` | `#1a1410` | 흑 · 먹 — ink-black line work, all functional text, the final outline | 13.6:1 on hanji (AAA) |
| `ink-soft` | `#5a4a3c` | ink thinned — secondary text, symbol glosses, English captions | 6.5:1 on hanji (AA) |
| `jeok` | `#c8362b` | 적 · 석간주 — THE accent: focus, ::selection, links, the signature red | 4.7:1 on hanji (AA) |
| `cheong` | `#2f6e6a` | 청 · 청록 — east/spring/wood; pine, tiger's sky; functional text allowed | 5.0:1 (AA) |
| `hwang` | `#d99a1f` | 황 · 석황 — center/soil/emperor; the sun, longevity gold | 2.6:1 — display/decorative only |
| `baek` | `#fbf8ef` | 백 · 호분 — west/autumn/metal; the moon, the powdered-shell breath, card grounds | never text on hanji |
| `jeongjo` | `#7a241c` | banked jeok — wherever red must function as fine text on hanji | 7.0:1 (AAA) |
| `seal-red` | `#b6241b` | the vermillion of a real 인장 — slightly deeper than jeok so a stamp reads as ink-on-paper | 4.9:1 as large glyph |

The accent `jeok` (4.7:1) carries AA at body and large sizes, so it is the
page's functional red: focus rings, the section rule, the press-the-seal
button. Where red must read as fine print over a wash, it darkens to
`jeongjo` (7.0:1, AAA). `hwang` (2.6:1) is display/decorative only on hanji
— it sits as the sun disc and as gold dots over heuk where it measures
8.4:1. `baek` is the paper itself: it is never text on hanji, and when the
ObangsaekNavigator selects 백, the living accent borrows `ink-soft` so the
focus ring does not vanish.

The ObangsaekNavigator makes this system *navigable*: selecting a color
sets `--minhwa-accent-live` on the root, so the focus ring, the section
eyebrow, and the hover washes all retint. Pigment swaps are instant by
design — pigment does not ease.

## Type system

| Font | Source | Role |
| --- | --- | --- |
| Gaegu (400, 700) | Google Fonts via `next/font` | Korean display — the wordmark 민화, motif titles, seal captions, SFX. A naive hand-brushed village-painter face; minhwa's folk/charming register. Black Han Sans would shout; Gaegu smiles |
| Noto Serif KR (400, 500, 700) | Google Fonts via `next/font` | every Korean body glyph — symbol-meaning narration, obangsaek notes, the colophon. A warm serif so captions read like a museum label |
| Fraunces (400, 500, 600) | Google Fonts via `next/font` | English voice — the subtitle, English captions, folio numerals. Optical-sized, the way an English gallery card is set |

- Family stacks always lead with the Korean face (`--font-kr` → Noto Serif
  KR → serif; `--font-display` → Gaegu → cursive) so Hangul never falls
  through to a default sans. `:lang(ko)` opens tracking a hair so syllables
  breathe.
- Base size `clamp(16.5px, 0.85vw + 12px, 18.5px)`, line-height 1.78.
- Display: KR wordmark `clamp(4.6rem, 19vw, 13rem)`. Section titles
  `clamp(2.1rem, 5.6vw, 3.6rem)`.
- English is always the leaning subtitle (italic, ~0.62em of its Korean
  companion), never larger — the two languages distinguished by posture.
- Numerals (years, hours): `font-variant-numeric: lining-nums
  tabular-nums` for the colophon ledger.

## Texture recipe

Three static aged-hanji registers (none animated — the paper is a sheet,
not a screen):

1. **Fibers** — one fixed full-viewport SVG `feTurbulence`
   (`fractalNoise`, baseFrequency 0.7, 2 octaves, seed 11,
   `stitchTiles="stitch"`) mapped by `feColorMatrix` to heuk at ~6.5% α,
   `mix-blend-mode: multiply`, opacity 0.55 — warmer and more yellowed
   than ppang's fresh paper, the patina of an old scroll.
2. **Foxing** — a faint radial warm-brown vignette, transparent to
   `rgba(122,36,28,0.04)` at the edges.
3. **Laid lines** — `repeating-linear-gradient`, 1.5px of
   `rgba(26,20,16,0.016)` every 7px.

Each minhwa panel mounts on a 1px hairline border with `0 18px 40px
rgba(26,20,16,0.14)` soft shadow and `clamp(8px,1.2vw,14px)` padding — a
painting glued to the page.

## Motion vocabulary

| Name | Value | Used for |
| --- | --- | --- |
| `ease-stamp` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | a stamp landing with a tiny overshoot — the cheerful hand |
| `ease-settle` | `cubic-bezier(0.16, 1, 0.3, 1)` | every reveal's long tail |
| `ease-press` | `cubic-bezier(0.5, 0, 0.2, 1)` | the seal descending: even, deliberate |
| `motif-stamp` | opacity 0→1, scale 0.82→1 `ease-stamp` + translateY(18px), 760ms | a motif revealing with a pop — minhwa is cheerful, not austere |
| `seal-press` | translateY(-90% → 0) + scale(1.25 → 1) + opacity, 480ms `ease-press`, then a 1px ink rim expands 360ms | the 인장 certifying a section |
| `narration-glyph` | 850ms `ease-settle`, 42ms/glyph stagger | symbol-meaning lines — a curator reading aloud |
| `obangsaek-tint` | instant pigment swap of `--minhwa-accent-live` | selecting an obangsaek color |
| `longevity-scrub` | `--minhwa-longevity` ∈ [0,1] on a sticky stage; active symbol = round(p × 9); scale 0.92→1.08 + opacity 0.42→1 + caption crossfade | the ten longevity symbols walked |
| `hero-float` | sun 7.1s, moon 6.3s drift (mutually prime); picture breathes, never loops | ambient hero accents |
| `reveal` | 820ms `ease-settle`, translateY(18px) → 0, 80ms batch stagger | section heads, notes, footer |

Timing rule: the two ambient cycles (7.1s, 6.3s) share no common divisor,
so the idle hero never visibly loops. The only per-frame writes are two CSS
custom properties (`--minhwa-longevity` on the stage, `--minhwa-accent-live`
on the root on selection) — both transform/opacity-derived. rAF pauses
offscreen and on `visibilitychange`.

## Space & shape

- Sections breathe at `clamp(72px, 12vh, 140px)`; the hero is one viewport;
  the pinned longevity section is a tall track (~800svh of scroll for the
  ten-step walk) with a sticky stage.
- Reading measures: intros and colophon at 880px; the peony stage at
  1120px; the hero at 1320px. The longevity stage is full-bleed.
- Shapes are rounded rectangles (panel mounts, the seal-press button rx
  3–4) and hairline rules. The seal-press button carries a hand-drawn
  offset shadow (`4px 5px 0 jeongjo`) — the one deliberately playful
  element, because pressing a stamp is a physical act.
- Asymmetry is deliberate: the hero painting and its legend lean across
  two columns; the peony and its legend face each other; the longevity
  symbols orbit centered (it is the cosmic section, it gets the axis).

## Voice guide

**Five adjectives:** wishful · generous · warm-docent · Korean-first ·
symbol-literate.

**Three example lines:**

1. "호랑이는 기쁜 소식, 까치는 좋은 낭문." / "The tiger brings the glad
   tidings; the magpie, the good letter."
2. "모란 한 송이는 부귀영화의 소원이다." / "A single peony is the wish for
   prosperity and honor."
3. "그림 한 폭에 소원 하나." / "One wish per painting."

**Three banned words:** *exquisite* (the gallery believes minhwa is rough,
and rough is the point), *timeless* (marketing filler), *charming* in the
English microcopy *of a specific motif* (show the charm, don't name it —
though the tradition as a whole is allowed to be called charming in prose).

Grammar: short Korean sentences, present tense, the warm 해요체 register
of a docent. English is never word-for-word — it is the same wish re-felt
in English, italicized to mark it as the second voice.

## Distinctness from GIWA (the dancheong cousin)

GIWA and MINHWA share the `korean-traditional` family and the obangsaek
palette, and are deliberately complementary:

- **GIWA** is the craft of the *pigment*: a roofline drawn in ink that
  floods with color, four dancheong motifs rebuilt as pure SVG symmetry,
  techniques `svg-line-draw` + `clip-path-reveal` + `feturbulence-texture`
  + `pointer-parallax`. Refined, architectural, line-led.
- **MINHWA** is the meaning of the *picture*: generated minhwa
  illustrations that fill the frame, symbols revealed with a stamp and a
  pop, a seal pressed to certify a wish, techniques `spring-press` +
  `char-split-reveal` + `scroll-scrub-pinned`. Naive, illustrative,
  symbolic, joyful.

The two entries pick entirely disjoint technique tags, distinct display
faces (Song Myung carved vs Gaegu hand-brushed), and distinct signature
motions (ink-draw-and-flood vs stamp-and-press). A grayscale screenshot of
each is unmistakable.

## Do & Don't

**Do**

1. Route every color through a token. The obangsaek is a system — name a
   hue, give it a role, never an anonymous hex.
2. Give Korean the first word and the last word. Read every pair aloud; if
   the English sounds like the source and the Korean like the translation,
   rewrite.
3. Let the paintings be the slow thing, and let them land with a pop —
   minhwa is cheerful. The stamp and the spring are the page's character.
4. Keep the longevity scrub and the obangsaek tint transform/opacity-only
   — the only per-frame writes are two CSS custom properties.
5. Treat every generated minhwa as a wish: caption it, mount it, and (in
   the peony's case) let the visitor seal it.

**Don't**

1. Don't put hwang text on hanji (2.6:1) — it is display/decorative only,
   or it sits as a dot over heuk.
2. Don't bake text into the illustrations. Every Hangul caption, symbol
   meaning, and seal is real HTML/SVG so it stays crisp and accessible.
3. Don't give the page a second signature motion. One stamp, one pop, one
   pinned scrub, one pigment system. Repetition kills the folk rhythm.
4. Don't animate layout — transform, opacity, filter, clip-path, and the
   two CSS custom properties (`--minhwa-longevity`,
   `--minhwa-accent-live`), nothing else.
5. Don't let the fiction wink — no "picture-perfect" puns. The gallery
   believes it is a gallery of wishes.

## On the generated imagery (provenance)

The three illustrations are generated in ComfyUI (Illustrious
`bismuthIllustrious_v80` + `toonystarkKoreanWebtoonFlux` LoRA @ 0.4). The
full recipe ships in `image-recipe.md` and the exported graph in
`workflows/minhwa.json`. The `bismuthIllustrious_v80` row in
`docs/model-licenses.md` is audited **CONDITIONAL** as of 2026-07-17:
commercial image use is permitted under the inherited CreativeML Open
RAIL++-M license; two items (merge ancestry disclosure, CC BY 4.0
redistribution compatibility) await maintainer co-sign to OK, and per
`ASSETS-LICENSE.md` this permits the imagery to ship today. The images
ship under CC BY 4.0 with the honest caveat that purely AI-generated
imagery may not be copyrightable in all jurisdictions.
