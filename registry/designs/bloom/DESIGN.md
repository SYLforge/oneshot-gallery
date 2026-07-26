# 피다 BLOOM — design spec

## Identity

A botanical perfume house beside a peony field in Seogwipo, Jeju, run by
people who believe a scent is not a product but *an act of opening*. The
page is not a brochure about the fragrance — it *is* the fragrance,
rehearsed in time: you arrive at a warm-cream sheet of paper, an ink-line
botanical draws itself stem-first as you settle, a blush of watercolor
blooms outward behind it and finds its edge, and then one pinned flower
opens petal-by-petal with your scroll — the house scent, literally
unfurling. Everything botanical on screen is drawn by code in SVG, because
a photograph of a peony is a record of somewhere else and this page is a
presence. The Korean is the perfumer's own voice — shorter, warmer, never
a translation of the English; the English trails it like a label on the
back of the bottle.

## Distinction from SAKURA (the 1st ink-bloom entry)

This is the second of three `ink-bloom` entries. The family thesis is
*ink → bloom*, and both entries honor it — but with deliberately different
mediums and grounds, so a grayscale screenshot of each is unmistakable:

| Axis | SAKURA (1st) | BLOOM (2nd, this entry) |
| --- | --- | --- |
| Ground | dark canvas, cherry-blossom pink | **light** warm cream paper |
| Medium | canvas particle field (scattered petals) | **SVG line-draw + watercolor wash** |
| Bloom metaphor | petals *scatter and fall* (a thing moving) | pigment *spreads and settles* (a behavior on paper) |
| Accent | cherry pink | **botanical green** (`#3d6b3a`), one blush |
| Signature moment | particles drifting across dark | **a pinned flower opening** petal-by-petal |
| Texture | canvas-driven motion | **feTurbulence paper fiber + watercolor displacement** |

Where SAKURA reads as *night, falling petals*, BLOOM reads as *daylight, a
perfumer's plate being drawn*. Same family; opposite time of day,
different instrument.

## Palette

| Token | Hex | Role | Contrast pairing (on cream) |
| --- | --- | --- | --- |
| `cream` | `#faf3e8` | background — warm cream paper | — |
| `ink` | `#2a2620` | primary text, the giant 피다, SVG line-art strokes | 12.4:1 (AAA) |
| `botanical` | `#3d6b3a` | accent: wordmark, numerals, CTA, focus ring, deepest stems | 6.9:1 (AA normal) |
| `bark` | `#5c554a` | secondary text: glosses, captions, scent descriptions | 5.7:1 (AA normal) |
| `sage` | `#8aa67a` | **decorative only**: leaf fills, far strokes, coords | 2.4:1 — never functional text |
| `blush` | `#d98a9e` | **decorative only**: the single petal-wash bloom accent | 1.9:1 — never functional text |
| `gold` | `#b8924a` | decorative: anthers, date folio | decorative |
| `hairline` | `#cdbfa8` | decorative: paper rules at full strength | reads as paper grain |

Derived working tokens, all named in styles.css and tokens.json: the SVG
stroke tiers `c-stem #4a6b3f` / `c-branch #5f7d4f` / `c-leaf #3d6b3a` /
`c-vein #6f8f5e` / `c-petal #2a2620` / `c-calyx #4a6b3f`, and the wash
fills `wash-green #6f8f5e` / `wash-blush #e8b8c4` / `wash-sage #8aa67a`,
all at low alpha. No overlay grain — *paper fiber is the texture*.

## Type system

| Font | Source | Role |
| --- | --- | --- |
| Cormorant Garamond | Google Fonts | Latin display, the wordmark, section titles, all italic asides (the perfumer's voice) |
| Noto Serif KR | Google Fonts | all Hangul and the Korean-first voice; scent names, the giant 피다, the sign-off |

- Display stack is `Cormorant Garamond, Noto Serif KR, serif`, so the giant
  피다 falls through the Latin face into Noto Serif KR with no extra markup
  — the title's Hangul weight is a font-stack accident made load-bearing.
  `:lang(ko)` adds `word-break: keep-all` and its own 1.78 line-height.
- Base size `clamp(16px, 0.4vw + 14px, 18px)`, line-height 1.75 — body text
  reads at the pace of someone writing a formula.
- Display: 피다 at `clamp(6.4rem, 21vw, 13.5rem)`, the Latin wordmark at
  0.18em tracking beside it; section titles `clamp(1.8rem, 3.8vw, 2.7rem)`,
  weight 400 everywhere — one stroke weight, like one nib.
- Every italic on the page is Cormorant via a scoped `em` rule; the
  italics are the lines the perfumer writes in the margin.

## Texture recipe

Two behaviors do the work — neither is an opaque overlay:

1. **Paper fiber** — one *static* `feTurbulence` (fractalNoise,
   `baseFrequency 0.9`, seed 7) sits fixed over the whole page at ~4%
   cream-on-cream via `mix-blend-mode: multiply`. It never animates; it
   just keeps the cream from reading as flat `#fff`. Distinguish from
   kemuri's washi grain (ink-dark noise over a warm sheet): this is
   cream-on-cream, lighter, a paper not a fabric.
2. **Watercolor bloom** — the *animated* texture. Each botanical wash
   shape rides inside an SVG `feTurbulence + feDisplacementMap` filter
   whose `scale` attribute starts at ~62 ("still wet") and a rAF loop
   eases it down to 0 on reveal (`useWashSettle`). The turbulence
   `baseFrequency` and `seed` never change, so the noise is computed once
   and each frame pays displacement only — the color appears to *spread
   outward through the noise and then settle*, like ink finding its edge
   on wet paper. This is the page's namesake behavior.

The botanical **line-art** (stems, leaves, petals) is plain SVG strokes
with no filter, so the drawn line stays crisp while only the wash beneath
it bleeds — the central craft decision of the page.

## Motion vocabulary

| Name | Value | Used for |
| --- | --- | --- |
| `ease-bloom` | `cubic-bezier(0.25, 0.8, 0.3, 1)` | reveals + wash — quick to open, long to settle |
| reveal | 900ms `ease-bloom`, translateY(18px)→0, 90ms batch stagger | sections, note cards |
| line-draw intro | cubic ease-out to 0.7 over 2.4s, then scroll → 1 over 0.9vh | the svg-line-draw draw-on |
| line-draw lerp | 0.12 / 60fps-normalized frame | `--bloom-draw` never snaps |
| stroke window | `dashoffset = clamp(0, (d1 − draw)/(d1 − d0), 1.02)` | per-stroke drawing, pathLength=1 |
| wash settle | `feDisplacementMap scale 62 → 0` over 1700ms cubic-out | the watercolor bloom |
| bloom-open (pinned) | petal scale 0.42 → 1, rotate −8° → 0°, across pinned scroll 0–1 | the signature flower |
| bloom lerp | 0.14 / 60fps-normalized frame toward scroll target | `--bloom-open`, half-life ~5 frames |
| idle sway | hero line-art rotate ±0.4° at 11s; sun-breathe 19s | mutually prime, never loops |

Timing rule: no two ambient cycles share a period (11s sway, 19s sun), so
the page never visibly loops. Hover states snap — only entrances ease.

## Space & shape

- One shape language: botanical curves (stems, petals, leaves) against
  hairline rules. Border-radius exists only on the two pill CTAs, the 3px
  focus ring, and the 4px note-card frames; everything else is line.
- Reading columns: hero copy 34rem; notes grid three-up at 1160px;
  the pinned bloom is a 1.1fr/0.9fr split (flower | copy).
- Section padding `clamp(72px, 12vh, 150px)` — the page has long pauses
  between movements, like a scent developing.
- Section heads: a Korean numeral in italic Cormorant, the bilingual
  title, then a hairline — a folio mark, not a header bar.
- The hero botanical overlaps the copy's right edge at desktop and
  recedes to 50% opacity behind it under 900px; the text always wins.
- The pinned bloom section is `260vh` tall with a `position: sticky`
  inner, so ~1.6 screens of scroll map cleanly onto `--bloom-open` 0→1.

## Voice guide

**Five adjectives:** unhurried · sensory · warm-precise · botanical ·
never-selling.

**Three example lines:**

1. "A scent is not a thing. It is a thing opening." /
   "향기는 사물이 아닙니다. 피어나는 하나의 일입니다."
2. "A perfume does not bloom all at once — it opens top to base." /
   "향수는 한 번에 피지 않는다. 위에서 아래로, 천천히 핀다."
3. "What has bloomed, do not wait for." /
   "피어난 것을, 기다리지 마세요."

**Three banned words:** *luxury* (a scent is not a price tag), *flirty*
(the flower is not performing for you), *addictive* (no dependency
metaphors in a house about opening).

Grammar of the voice: present tense, short sentences, the Korean line
first and never a literal translation — it is the same moment, said by the
perfumer (transcreation). English italics are the label on the bottle;
roman text is the page signage.

## Do & Don't

**Do**

1. Route every color through a token; if a new green is needed, derive it
   between sage and botanical and name it.
2. Keep the line-art crisp and the washes blurred — that contrast *is*
   the medium. Never filter the strokes.
3. Let the fallback state be the finished state — `var(--bloom-draw, 1)`,
   `var(--bloom-open, 1)`, wash `scale="0"`. No JS, reduced motion, and
   slow networks all land on a composed, fully-drawn, fully-open page.
4. Keep ambient periods long and mutually prime; the page should feel
   alive at a glance and still on a stare.
5. Write new copy as the perfumer's note: something true about how a
   scent develops, said once.

**Don't**

1. Don't use sage, blush, or gold for anything a user must read — they
   are pigment, not a voice.
2. Don't add a second accent or a dark theme; botanical green is the only
   thing that ever asks for a click, and cream is the only ground.
3. Don't animate layout — transform, opacity, filter,
   stroke-dashoffset only; watercolor moves without reflowing.
4. Don't let the pinned flower's meaning depend on the motion; the copy
   ("the signature scent, opening") carries it, the animation merely
   agrees.
5. Don't let the fiction advertise — no testimonials, no pricing, no
   urgency; a scent opens at its own pace, not the market's.
