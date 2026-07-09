# ONDO — design spec

## Identity

A perfume atelier in a quiet Hannam-dong alley, Seoul, that refuses to
describe its scents by what they resemble. Every scent is titled by a
temperature — 36.5° for the body, −2° for first snow holding its breath
over the Han, 45° for the floor of an ondol room that keeps yesterday's
fire. The page is the house's only public room: dark, warm, nearly empty,
one bottle on a stage behind a sheet of old glass. The emotional register
is restraint that has money — nothing raises its voice, nothing repeats
itself, and the most expensive thing on the page is the space between
letters.

One rule above all: **no photographs.** The gallery's loud entries can
shout; this one has to prove that "luxury" survives as pure code — an SVG
bottle, arithmetic glass, and type. If a decision would be easier with a
raster image, the decision is wrong.

## Palette

| Token | Hex | Role | Contrast on noir |
| --- | --- | --- | --- |
| `noir` | `#16130f` | background — a dark room with the heating on | — |
| `champagne` | `#d8c39a` | accent: wordmark, card numerals, level lines, focus ring, `::selection` | 10.7:1 (AAA) |
| `cream` | `#efe9df` | primary text, section titles | 15.3:1 (AAA) |
| `champagne-dim` | champagne @ 72% α (≈ `#a49273`) | secondary text: eyebrows, hints, every Korean gloss | 6.1:1 (AA+) |
| `vermeil` | `#9c6b3f` | **rules + large display only**: hairlines, the 36.5° numeral, bottle collar/halo | 4.0:1 — AA large, never small text |

Derived working tokens: `hairline` = champagne @ 24% α (borders, tier
rules), `hairline-strong` @ 38% (the pane frame, underlines), `noir-2`
`#1a1511` (the bottle's stage — deliberately flat, because the refraction
canvas must repaint it exactly). The only gradients on the page are inside
the SVG bottle, the card swatches, and one radial vignette behind the hero.

## Type system

| Font | Source | Role |
| --- | --- | --- |
| Italiana | Google Fonts | Latin hairline display: wordmark, degree numerals, section titles, credo |
| Noto Serif KR | Google Fonts | all Hangul and all body text (weights 200/300/400) |

- Display stacks read `Italiana, Noto Serif KR, serif`, so Hangul inside a
  display setting falls through the Latin face into the Korean serif with
  no extra markup; `:lang(ko)` additionally pins the family and adds
  0.01em tracking.
- Italiana ships exactly one weight. That constraint is the aesthetic:
  hierarchy comes from size and letter-spacing, never boldness.
- Tracking scale: eyebrows 0.34–0.42em · wordmark 0.4em (the breath's
  destination) · card names 0.24em · footer call 0.22em · body 0.04–0.06em.
- Body runs Noto Serif KR at weight 300, `clamp(16px, 1vw + 12px, 19px)`,
  line-height 1.7 — a page you read slowly.

## The bottle (SVG anatomy)

Everything lives in one 360×560 viewBox, every color a palette value:

1. warm halo (radial vermeil, ≤18% α) and floor shadow behind/below;
2. glass body — a single path whose shoulders taper into the neck, filled
   with a horizontal five-stop gradient (edge sheen, dark center), hairline
   champagne stroke at 35% α;
3. the liquid, filled **exactly to the 36.5° gradation** of a hairline
   thermometer etched beside the bottle — the one narrative device;
4. speculars: three rounded rects with a vertical cream fade;
5. vermeil collar (three-stop metal gradient) and a faceted stopper (cream
   → champagne → vermeil diagonal, facet lines at ≤16% α).

The SVG carries `role="img"` with a bilingual label; it is also the source
texture for the refraction (serialized, rasterized, warped), which is why
it contains no text elements — external fonts don't load inside an SVG
image.

## Texture recipe

- **The pane.** A canvas inset 12%/7%/10% into the stage, framed by a 1px
  champagne hairline and a static 112° cream sheen (5% α). Each frame the
  serialized bottle is re-rendered through a two-pass strip displacement
  (rows then columns) driven by a precomputed value-noise LUT; displacement
  caps ±7px/±4px. The pane fades in only after its first real frame — until
  then (and forever, without JS) the crisp bottle shows through an empty
  sheet of glass.
- **The vignette.** One radial vermeil wash (11% α) behind the hero. No
  grain, no scanlines, no blur panels — the room is clean.
- **Hairlines.** Every rule on the page is 1px: vermeil for the two
  ceremonial rules (hero, footer), champagne-alpha for structure (tiers,
  card borders, pane frame).

## Motion vocabulary

| Name | Value | Used for |
| --- | --- | --- |
| `ease-couture` | `cubic-bezier(0.77, 0, 0.18, 1)` | clip-path wipes — patient in, patient out |
| `ease-air` | `cubic-bezier(0.22, 1, 0.36, 1)` | fades, the pane appearing |
| breath intro | opens to 0.45 over 2600ms, cubic ease-out | wordmark, on load |
| breath scroll | completes within the first 0.7 viewport | wordmark, scroll-linked |
| breath lerp | 0.055 / 60fps-normalized frame | the tracking never snaps |
| clip reveal | 950ms `ease-couture`, `inset(0 100% 0 0)` → 0, 90ms batch stagger, text +220ms | collection cards |
| fade reveal | 750ms `ease-air`, translateY(14px) → 0 | heads, tiers, footer |
| pointer lerp | 0.08 / frame | the lens slews like held glass |
| energy attack / release | 0.05 / 0.02 | notices slowly, forgets slower |
| noise drift | 0.22 cells/s rows, 0.17 cells/s columns | ambient shimmer |
| idle shimmer | lissajous, after 2800ms silence or on touch | the glass breathes alone |
| hint pulse | 4.6s, opacity 0.45↔0.85 + 5px drift | the 36.5° ↓ invitation |

Nothing on the page moves fast. No two ambient periods coincide, and every
JS-driven value is lerped — state never steps.

## Space & shape

- One column, centered, generous: section padding `clamp(84px, 12vh,
  150px)`; the text measure holds at 880px, the credo at 640px.
- Shapes are rectangles with 1px hairlines. The only curves on the page
  belong to the bottle.
- The rail is the single horizontal gesture — cards `clamp(230px, 62vw,
  300px)`, snap-aligned, gap `clamp(18px, 3vw, 36px)`.
- The card swatch repeats the page's one systematic joke with a straight
  face: the gradation line's height *is* the temperature. −2° sits low and
  pale; 62° sits high and glowing.

## Voice guide

**Five adjectives:** sparse · sensory · warm · unhurried · certain.

**Three example lines:**

1. "36.5° — the temperature at which skin becomes a story." /
   "36.5도 — 피부가 이야기가 되는 온도."
2. "first snow holds its breath over the river." /
   "첫눈이 강 위에서 숨을 참는다."
3. "© 2026 ONDO — measured in degrees, worn as memory." /
   "도(度)로 재고, 기억으로 입는다."

**Three banned words:** *unforgettable* (the house never begs), *exotic*
(it is at home), *luxurious* (saying it would end it).

Grammar of the voice: present tense only; one clause, maybe two; no
doubled adjectives; the Korean line is a transcreation that may say less
and mean more. Temperatures are always typeset with the degree sign closed
up (36.5°), minus as U+2212 (−2°).

## Do & Don't

**Do**

1. Keep vermeil ceremonial — two rules and one numeral; if vermeil starts
   appearing everywhere, the page cools to brown.
2. Let the glass be the only spectacle: one refraction pane, subtle, capped
   — a visitor should wonder whether they imagined it.
3. Keep the Korean first-class: Noto Serif KR, natural word order, its own
   rhythm; read it aloud before shipping.
4. Derive every new shade from the four tokens and name it.
5. Hold the stagger discipline: reveals arrive in observer batches, 90ms
   apart, text one beat after its image.

**Don't**

1. Don't add an image. Not a texture JPEG, not a "just this once" product
   shot — the entry's thesis dies with the first raster pixel.
2. Don't animate layout — transform, opacity, filter, clip-path only; even
   the letter-spacing breath is transforms.
3. Don't brighten the room: noir stays #16130f, and the vignette stays
   at 11% — luxury here is underexposure.
4. Don't let the fiction wink; no jokes about being a website. The atelier
   believes it is an atelier.
5. Don't speed anything up to "add energy." If a reveal feels slow, cut an
   element instead.
