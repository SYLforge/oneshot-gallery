# KEMURI — design spec

## Identity

An incense atelier on Teramachi-dōri, Kyoto, founded 1927 (昭和二年), that
refuses to describe itself as a perfume house. What it sells is one hour of
stillness; the incense is only the clock. The page does not advertise this
hour — it *performs* it: a censer is already lit when you arrive, the smoke
does not hurry, the paintings take their time settling, and the menu asks
you to buy time, not grams. The emotional register is a kōan spoken by
someone who has said it every morning for a century: quiet, certain, a
little amused. The Japanese is not a translation layer; it is the older
voice of the same house — terser, warmer, and always given the last word.

This entry is the flagship of the washi-sumi-e family and is deliberately
not a spring page: no petals, no pink, no season at all. Smoke instead of
blossoms, ember instead of dawn, the hour instead of the year.

## Palette

| Token | Hex | Role | Contrast (on washi) |
| --- | --- | --- | --- |
| `washi` | `#efe7d8` | ground — the paper every hour is burned on | — |
| `washi-aged` | `#e3d7c0` | plate paper, menu hover wash, lit rims | — |
| `sumi` | `#1c1814` | primary text, wordmark, near ridges, the dark room | 14.4:1 (AAA) |
| `ink-soft` | `#4f4a43` | sumi thinned with water — all secondary text | 7.1:1 (AAA) |
| `smoke` | `#8a8178` | the smoke: canvas particles, far ridges, wash shadows | 3.1:1 — large/decorative only |
| `ember` | `#c96f2e` | the live coal: seals, censer tip, button fill, dark-room accents | 2.9:1 — decorative on washi; **4.9:1 on sumi** |
| `ember-deep` | `#a04f16` | banked ember — functional accent on paper: eyebrows, hours, focus, selection | 4.7:1 (AA) |
| `gold` | `#b08d4a` | gold leaf: hero rule, censer rims, the plate sun | 2.5:1 — hairlines/objects, never text on washi |

Derived working tokens: `washi-dim` = washi @ 72% α (≈ `#b4ada1`, 7.9:1 on
sumi) for all secondary text in the dark room; `hairline` /
`hairline-strong` = sumi @ 16% / 30% α for rules and mounts. The page
inverts exactly once (section 05); ember and gold are only permitted to
carry meaning there, where they clear AA. No pink, no purple, no gradients
except the age-vignette — the only "gradient blob" on this page is smoke,
and it is simulated, not painted.

## Type system

| Font | Source | Role |
| --- | --- | --- |
| EB Garamond (400, 500, italic) | Google Fonts via `next/font` | Latin voice: wordmark, hours, English kōans, italic translations |
| Zen Old Mincho (400, 500) | Google Fonts via `next/font` | every Japanese glyph: the vertical poem, blend names, seals, sign-offs |

- Family stack is `EB Garamond, Zen Old Mincho, serif`, so kanji and kana
  fall through Garamond into the mincho with no markup; `:lang(ja)`
  additionally sets the mincho explicitly with `+0.06em` tracking.
- Base size `clamp(17px, 1vw + 12px, 20px)`, line-height 1.75 — Garamond
  is drawn small and rewards air.
- Display: wordmark `clamp(3.8rem, 16.5vw, 12rem)` at weight 500,
  letter-spacing 0.16em with matching text-indent (optical recentering),
  line-height 0.95. Section titles `clamp(2rem, 4.6vw, 3.2rem)` at 400.
- The Japanese is never scaled below 0.55em of its companion and never
  italicized — mincho does not lean. English translations italicize
  instead; the two languages are distinguished by posture, not size alone.
- The vertical poem: `writing-mode: vertical-rl`, line-height 2.5 as
  column pitch (the 間 between lines), letter-spacing 0.16em.
- Numerals (menu hours, prices): `font-variant-numeric: lining-nums
  tabular-nums` — a ledger, not a poem, for exactly two columns.

## Texture recipe

Washi in three static layers (never animated — the paper is old, not
alive):

1. **Fibers** — one fixed full-viewport SVG `feTurbulence`
   (`fractalNoise`, baseFrequency 0.55, 2 octaves, seed 9,
   `stitchTiles="stitch"`) mapped by `feColorMatrix` to sumi at ≤5% alpha,
   `mix-blend-mode: multiply`, opacity 0.75.
2. **Age** — a radial gold vignette: transparent to
   `rgba(176,141,74,0.09)` at the page edges.
3. **Laid lines** — `repeating-linear-gradient`, 2px of
   `rgba(28,24,20,0.012)` every 7px.

The plates add their own paper: `washi-aged` ground inside a 1px
`hairline` mount, plus a per-plate `feTurbulence` (baseFrequency ~0.01,
2 octaves, per-plate seed) that exists solely to feed the ink-settle
displacement.

## Motion vocabulary

| Name | Value | Used for |
| --- | --- | --- |
| `ease-smoke` | `cubic-bezier(0.22, 1, 0.36, 1)` | every entrance — rises fast, settles long |
| `ease-ink` | `cubic-bezier(0.65, 0, 0.35, 1)` | loader lift, button fill — deliberate, weighted |
| curl field | ψ = noise(150px) + 0.45·noise(56px); v = (∂ψ/∂y, −∂ψ/∂x); gain 1500 | the smoke's flow — divergence-free |
| field rise | 26 px/s upward drift of the noise domain | eddies travel with the plume |
| plume | buoyancy 46 px/s · relaxation 2.4 s⁻¹ · life 6.5–11 s | smoke has inertia, not obedience |
| pointer lean | pull ≤ ±54 px/s · attack 0.055 / release 0.018 | notices a hand fast, forgets it slowly |
| scroll lag | → 210 px/s per px/ms, cap ±190, smoothing 6.5 s⁻¹ | the ribbon bends when the page moves |
| breeze | 22·sin(0.21t) + 12·sin(0.47t + 1.9) px/s | touch / idle autonomy |
| glyph cadence | 1150ms `ease-smoke`; 110ms/letter (wordmark), 60ms/glyph + 620ms/column (poem) | the incense clock's tick |
| ink settle | feDisplacementMap scale 110 → 0, 1900ms cubic-out via rAF | the plates resolving |
| reveal | 900ms `ease-smoke`, translateY(18px) → 0, 90ms batch stagger | secheads, ledger rows, footer |
| loader | press 700ms · hold 1450ms · lift 650ms `ease-ink` | the seal; skippable by anything |
| ambient | ember breath 5.6s · hint drift 7.4s | mutually prime; opacity/transform only |

Timing rule: the two ambient cycles and the cadence periods share no
common divisor, so the page never visibly loops. Nothing on the page
bounces; everything settles.

## Space & shape

- Sections breathe at `clamp(96px, 15vh, 176px)`; the hero is exactly one
  viewport; the dark room opens with `clamp(110px, 18vh, 200px)` — the
  biggest inhale on the page comes before the invitation.
- Reading measures: prose and ledger at 880px; the poem stage at 1080px;
  the plate wall at 1240px. Nothing full-bleed except the hero and the
  dark room — the paper needs margins to read as paper.
- Shapes are rectangles and hairlines. Radius above 4px exists only on
  the seals (rx 3–4, as carved stone) and the focus ring's 1px optical
  correction. Rules are 1px solid `hairline`.
- Asymmetry is deliberate and resolved: the poem leans right (vertical
  column) and is counterweighted by the seal at its foot; the middle
  plate hangs `clamp(20px, 4vw, 56px)` lower than its neighbors — a wall
  of paintings, not a grid of cards.
- The one inversion (washi → sumi) happens at a section boundary with no
  transition — stepping from the courtyard into the dim shop.

## Voice guide

**Five adjectives:** kōan-quiet · present-tense · bilingual-by-birth ·
patient · lightly amused.

**Three example lines:**

1. "The smoke does not hurry. Neither should you." / 煙は急がない。あなたも。
2. "Each blend is one hour long. Burn it for the time, not the perfume."
   / どの香も、長さは一時間。香りのためでなく、時間のために焚く。
3. "The smoke rises whether or not we watch. We prefer to watch." /
   煙は、見ていなくても立ちのぼる。私たちは、見ているほうを選ぶ。

**Three banned words:** *luxury* (the house would never), *experience*
(it sells hours, not experiences), *zen* (the loudest way to claim
quiet).

Grammar of the voice: short English sentences, full stops, no
exclamation marks anywhere; the Japanese line is never a literal
translation — it is the same observation, re-felt by the older voice
(一炷一刻, not "one stick one hour" transliterated). Prices are exact;
poetry never is.

## Do & Don't

**Do**

1. Route every color through a token; if a new shade is needed, thin sumi
   or bank the ember, and name the result.
2. Give the Japanese the last word in every pairing, and read it aloud —
   if it sounds like a translation, rewrite it as an observation.
3. Let the smoke be the only fast thing: it may respond in milliseconds;
   everything else takes at least 900.
4. Keep the plates' displacement scale the *only* animated filter
   parameter — turbulence is computed once, like ground ink.
5. Preserve the 間: when adding content, add whitespace first.

**Don't**

1. Don't put ember or gold text on washi — bank it (`ember-deep`) or save
   it for the dark room.
2. Don't add a second signature: one plume. A second censer would make
   this a shop; one makes it an hour.
3. Don't animate layout — transform, opacity, filter, and the two rAF
   attribute writes (displacement scale, canvas field), nothing else.
4. Don't season the page: no cherry blossoms, no maple leaves, no snow.
   The atelier's only weather is smoke.
5. Don't let the fiction wink — no "smoke and mirrors" jokes, no incense
   puns. The house believes it is a house.
