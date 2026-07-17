# 山水 SHAN-SHUI — design spec

## Identity

A procedurally-generated, infinitely-scrolling Chinese ink-wash landscape
that paints itself live in the browser. There is no atelier, no product, no
booking — the page is the painting, and the painting is the code. Every
ridge is summed from value noise, every wisp of mist is a radial gradient
pooled in a valley, every foreground pine is a recursive brushstroke cluster;
the scroll unrolls forever in both directions because the same noise function
generates it. The emotional register is the quiet of a Song-dynasty literati
hand-scroll (手卷) read alone in a study: unhurried, certain, and a little
amused that a machine is doing what a brush once did. The Chinese is not a
translation layer — it is the older voice of the painting (the couplet, the
seal, the three-distance principle), and it always gets the last word.

This entry is the second in the washi-sumi-e family and is deliberately not
KEMURI's spring of smoke: where KEMURI performs an hour of stillness, SHAN-SHUI
performs a landscape that generates itself. Its explicit ambition is to answer
— and aim past — `{Shan, Shui}*` by LingDong (the canonical procedural Chinese
landscape), for the live, scrollable, pointer-breathing web.

## Relation to the benchmark

`{Shan, Shui}*` (https://github.com/LingDong-/shan-shui-inf) synthesizes
mountains, trees, mist and waterfalls from noise and draws them as **SVG** in
an infinitely-scrolling page. It is widely admired as the canonical "can code
be the painting?" reference. SHAN-SHUI borrows its thesis (noise → ink,
forever-scrolling) and differs on three axes, each a deliberate attempt to
feel at least as crafted:

1. **Canvas, not SVG** — the authentic sumi medium is wet ink on paper; canvas
   radial-gradient mist and blurred ridge washes read as paint where SVG
   silhouettes read as vector. The trade is resolution-independence for
   atmosphere.
2. **Layered ink density as depth** — five ridge layers, farthest first, each
   paler and smaller, enacting 远山如黛 ("distant mountains are like eyebrow
   pigment") literally. Distance is ink alpha, not perspective.
3. **Reactive** — the scroll *is* the unrolling (page-scroll drives a world-x
   offset), mist leans toward a fine pointer with asymmetric attack/release,
   and the weather slowly cycles through four seasons as you read. The
   benchmark is a fixed, autoplaying scroll; this one breathes with you.

## Palette

| Token | Hex | Role | Contrast (on xuan) |
| --- | --- | --- | --- |
| `xuan` | `#f4ede0` | ground — the rice paper every ridge is brushed on | — |
| `xuan-aged` | `#ece3d2` | older paper — guide panels, hover washes, aged hems | — |
| `sumi` | `#1a1714` | the ink stone, fully ground — primary text, wordmark 山水, nearest ridges, the colophon's ground | 15.3:1 (AAA) |
| `ink-strong` | `#3a342c` | sumi + one dip of water — section titles, the second-nearest ridge | 10.6:1 (AAA) |
| `ink-mid` | `#5a5249` | sumi thinned — body prose, the middle ridge, captions | 6.6:1 (AAA) |
| `ink-soft` | `#7d756a` | a pale wash — far ridges, notes; large/decorative only | 3.9:1 — large only |
| `pale-wash` | `#9a9488` | the farthest ridges dissolving into mist | 2.6:1 — decorative only |
| `mist` | `#b8b1a3` | the mist itself — canvas fog blobs | 1.8:1 — paint, never text |
| `vermillion` | `#a83232` | the artist's chop — the seal, the one accent | 5.7:1 (AA large/non-text); **2.7:1 on sumi → decorative only there** |
| `vermillion-deep` | `#8a2626` | banked seal — functional accent on paper: eyebrows, focus ring, ::selection | 7.6:1 (AAA) |

Derived working tokens: `xuan-dim` = xuan @ 72% α (≈ `#cfc7b6`, 11.7:1 on
sumi) for all secondary text in the colophon; `hairline` / `hairline-strong`
= sumi @ 16% / 30% α for rules and mounts. The page inverts exactly once
(section 04, the colophon); vermillion is permitted to be loud there because
on sumi it clears AA for non-text (the seal as object) — but as text it stays
at `vermillion` only where large, otherwise `vermillion-deep`. No blue, no
green except the faintest summer wash, no gradients except the age-vignette.
The only "gradient blob" on this page is mist, and it is simulated.

## Type system

| Font | Source | Role |
| --- | --- | --- |
| Cormorant Garamond (400, 500, 600, italic) | Google Fonts via `next/font` | Latin voice: the SHAN-SHUI wordmark, section titles, italic asides — a refined serif whose hairlines behave like a brush held lightly |
| Ma Shan Zheng (400) | Google Fonts via `next/font` | every Chinese display glyph: 山水, the seal characters, the vertical couplet. A brush-calligraphy (硬笔行楷) face; the strokes still remember the hand |
| Noto Serif SC (400, 500) | Google Fonts via `next/font` | Chinese body & secondary text, where Ma Shan Zheng's calligraphy would be illegible at small sizes — the quiet mincho-voice for prose-scale 中文 |

- Family stack is `Cormorant, Ma Shan Zheng, Noto Serif SC, serif`, so the
  giant 山水 falls through the Latin face into the brush face with no markup;
  `:lang(zh)` additionally sets the body face (Noto Serif SC) explicitly with
  `+0.04em` tracking, and display-sized Chinese (titles, couplet, seal) takes
  the brush face via class.
- Base size `clamp(17px, 1vw + 12px, 20px)`, line-height 1.75.
- Display: wordmark `clamp(3.4rem, 15vw, 11rem)` at weight 500,
  letter-spacing 0.14em with matching text-indent (optical recentering),
  line-height 0.95. Section titles `clamp(2rem, 4.6vw, 3.2rem)` at 400.
- The Chinese display is never italicized — calligraphy does not lean.
  English asides italicize instead; the two languages are distinguished by
  posture, not size alone.
- Numerals: `font-variant-numeric: lining-nums tabular-nums` where anything
  is counted (the seal impression count).

## Texture recipe

Xuan paper in three static layers (the paper is old, never alive):

1. **Fibers** — one fixed full-viewport SVG `feTurbulence`
   (`fractalNoise`, baseFrequency 0.62, 2 octaves, seed 8,
   `stitchTiles="stitch"`) mapped by `feColorMatrix` to sumi at ≤5% alpha,
   `mix-blend-mode: multiply`, opacity 0.7.
2. **Age** — a radial amber vignette: transparent to
   `rgba(168,50,50,0.05)` at the page edges — the warm rim a real scroll
   takes on.
3. **Laid lines** — `repeating-linear-gradient`, 2px of
   `rgba(26,23,20,0.014)` every 8px, evoking the bamboo screen xuan is
   dried on.

The canvas landscape paints its own ink over this; the grain sits behind
everything as substrate.

## Motion vocabulary

| Name | Value | Used for |
| --- | --- | --- |
| `ease-scroll` | `cubic-bezier(0.22, 1, 0.36, 1)` | every entrance — rises fast, settles long |
| `ease-stone` | `cubic-bezier(0.65, 0, 0.35, 1)` | the seal press, section pins, ink-fill |
| ridge noise | 4 octaves value-noise, freqs 1/520…1/120 px⁻¹, weights 1…0.13 | the mountain silhouette profile |
| aerial density | ridge ink alpha by depth: 0.14 / 0.26 / 0.42 / 0.62 / 0.82 | 远山如黛 — distance is ink density |
| scroll → world | world-x = 480 + scroll-y × 1.0 | the scroll IS unrolling the hand-scroll |
| layer parallax | layer i world-x shift × (0.4 + depth·0.16) | far layers move slower — depth |
| pointer-breath | attack 0.045 / release 0.016 per 60fps frame | mist notices a hand fast, forgets it slowly |
| mist drift | breeze 7·sin(0.13t) + 4·sin(0.31t+0.7) + scroll-gust | touch / idle autonomy |
| seasons | blend spring→summer→autumn→winter over 2400 world-px | weather never cuts |
| seal press | scale 1.18→0.96→1, −5° set, 720ms `ease-stone` | the chop; skippable |
| reveal | 900ms `ease-scroll`, translateY(16px)→0 + blur(4px)→0, 90ms stagger | secheads, rows, footer |
| glyph cadence | 1100ms `ease-scroll`; 95ms/letter (wordmark), 80–140ms/glyph (couplet) | the brush's tick |
| ambient | mist breath 6.8s · hint drift 11.3s | mutually prime; opacity/transform only |

Timing rule: the two ambient cycles and the cadence periods share no common
divisor, so the idle page never visibly loops. Nothing bounces; everything
settles — except the mist, which is the one thing allowed to drift forever.

## Space & shape

- Sections breathe at `clamp(96px, 15vh, 176px)`; the hero is exactly one
  viewport; the colophon opens with `clamp(110px, 18vh, 200px)` — the
  biggest inhale comes before the sign-off.
- Reading measures: prose at 880px; the guide stage at 1120px. Nothing
  full-bleed except the hero landscape — the paper needs margins to read as
  paper.
- Shapes are rectangles and hairlines. Radius above 4px exists only on the
  seals (rx 3–4, as carved stone) and the focus ring's 1px optical
  correction. Rules are 1px solid `hairline`.
- Asymmetry is deliberate: the guide's three-distance rows stack with
  hairline rules (a ledger of distance, not a grid of cards); the seal
  paper sits centered but the impression lands rotated −4° — the way a hand
  presses one.
- The one inversion (xuan → sumi) happens at the colophon boundary with no
  transition — stepping off the scroll into the studio.

## Voice guide

**Five adjectives:** literati-quiet · present-tense · bilingual-by-birth ·
generative-honest · lightly amused.

**Three example lines:**

1. "The mountains paint themselves. The scroll is the unrolling." /
   山自生，卷自展。
2. "Distant mountains are like eyebrow pigment." / 遠山如黛。
3. "Not one byte of it was a painting. The painting is the code." /
   無一像素為畫，畫即代碼本身。

**Three banned words:** *painting* (as a noun for the output — it is always
"the scroll" or "the landscape"; "painting" is reserved for the *act* the
code performs), *infinite* (the scroll generates forever, but the word is
lazy — say "unending" or show it), *AI* (the page never winks at its own
generation; the colophon names code, not intelligence).

Grammar of the voice: short English sentences, full stops, no exclamation
marks; the Chinese line is never a literal translation — it is the same
observation re-felt by the older voice (山自生，卷自展, not "mountains
generate, scroll unrolls" transliterated). Classical phrasing (遠山如黛,
山不知其為畫) is preferred where it lands; the brush face carries it.

## Do & Don't

**Do**

1. Route every color through a token; if a new shade is needed, thin sumi
   or bank the vermillion, and name the result.
2. Give the Chinese the last word in every pairing, and read it aloud — if
   it sounds like a translation, rewrite it as a classical observation.
3. Let the landscape be the only fast thing: mist may respond in
   milliseconds; everything else takes at least 800.
4. Keep the four seasons mutually prime in their boundary math so the
   weather never visibly loops within a session.
5. Preserve the 留白 (negative space): when adding content, add whitespace
   first. The paper is as important as the ink.

**Don't**

1. Don't put vermillion text on sumi — it measures 2.7:1. Use it only for
   the seal object and large display; bank it (`vermillion-deep`) for
   functional accents on either ground.
2. Don't add a second signature motion: one live landscape, one seal. A
   second canvas would make this a demo; one makes it a scroll.
3. Don't animate layout — transform, opacity, filter, the rAF canvas field,
   and the single `--p` custom property on the guide, nothing else.
4. Don't let the generation feel random: the permutation is seeded (1368)
   so the same scroll greets every visitor. Determinism is the difference
   between a painting and a screensaver.
5. Don't claim to equal `{Shan, Shui}*` quietly — the colophon names it and
   states the ambition honestly. Provenance over false modesty.
