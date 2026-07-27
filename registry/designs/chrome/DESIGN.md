# CHROME — design spec

## Identity

A Y2K beauty house in a chrome-fronted building in Seongsu-dong, Seoul, that
refuses to call its lip glosses a color. Every pour is a metal — Liquid
Mercury, Iridescent Pearl, Gunmetal Veil, Hot Hologram — and the page's only
job is to make you believe the metal is wet. The emotional register is early-
2000s optimism: flip-phones, holographic stickers, the conviction that
everything looks better chrome. Nothing is pixelated, nothing is blocky;
everything pours, reflects, and shifts. Where the gallery's PIXEL entry is a
game arcade of cheerful pixel art, CHROME is a beauty counter of liquid metal
— the same family (retro-y2k), the opposite instinct.

One rule above all: **the chrome is the product.** The headline is not chrome-
*colored* type, it is a fragment shader pouring liquid metal into the glyph
shapes; the buttons are not silver-styled, they are wet chrome bands; the
cards are not holographic-*themed*, they are sealed in three offset rainbow
foil layers. If a surface does not ripple, foil, or keep its shadow, it is
wrong.

## Distinction from PIXEL (retro-y2k family)

PIXEL is **pixel-art game arcade**: blocky, cheerful, mosaic, hard edges,
a CRT grid of discrete cells. CHROME is **liquid chrome beauty**: smooth,
metallic, reflective, continuous gradients, the opposite of a grid. The two
share only the decade. PIXEL earns Y2K through the *aesthetic of the pixel*;
CHROME earns it through the *aesthetic of the chrome* — the wet metallic
everything of 2003 product design. A grayscale screenshot of each is
unmistakable: PIXEL is a mosaic of squares; CHROME is a smooth gradient with
a moving specular.

## Palette

| Token | Hex | Role | Contrast on holo-mist |
| --- | --- | --- | --- |
| `holo-mist` | `#f4f1ff` | page background — a soft holographic white-violet | — |
| `chrome-ink` | `#2a2a3a` | deep chrome shadow — THE ink: body text, headlines, dark chrome button core | 12.66:1 (AAA) |
| `chrome-ink-2` | `#4a4a5e` | secondary text: eyebrows-gloss, Korean glosses | 7.76:1 (AA+) |
| `ink-soft` | `#6a6a7e` | tertiary text: hints, captions, legal | 4.75:1 (AA) |
| `chrome-silver` | `#c8d0d8` | chrome silver — a **surface fill only**, never text (1.40:1) | n/a (fill) |
| `chrome-highlight` | `#ffffff` | the wet top sheen; light text on the dark chrome band | 14.09:1 on chrome-ink |
| `holo-sky` / `holo-pink` / `holo-mint` | `#e0e8ff` / `#ffd8f0` / `#d8fff0` | holographic gradient stops — foil band fills, card sheens; chrome-ink reads 11.5/11.0/13.1:1 on them | — |
| `accent` | `#ff8ad8` | holographic pink accent — a **FILL/SURFACE only** (1.91:1 as text, never used for text) | n/a (fill) |
| `accent-deep` | `#c84aa0` | deepened pink for accent-colored TEXT at large display scale | 3.82:1 (AA-large) |

The discipline is in the rationing. Chrome silver `#c8d0d8` is too light to
be text (1.40:1) — it is reserved for surface fills (the chrome shader, the
button frame, the foil base). The bright accent `#ff8ad8` is even lighter as
text (1.91:1) — it is a fill only (the foil seam, the button rim glow,
`::selection`). Every functional text token runs on chrome-ink, chrome-ink-2,
or ink-soft, all AA or better on the holo-mist background. The one place an
accent color carries text is the eyebrow/large-display register, where
`accent-deep #c84aa0` clears AA-large (3.82:1) — documented, never body.

## Type system

| Font | Source | Role |
| --- | --- | --- |
| Syne | Google Fonts | Latin chrome display — wordmark, headlines, section titles; weights 400/600/800, the 800 fills like poured metal |
| Black Han Sans | Google Fonts | all Hangul — a chunky Y2K Korean display face; Korean never hits a fallback sans |
| Major Mono Display | Google Fonts | the chrome console — spec numerals (CRM-01…), shade codes, eyebrow labels, monospaced readouts |

- Display stacks read `Syne, Black Han Sans, sans-serif`, so Hangul typed
  inside a display heading falls through the Latin face into the Korean one
  with no markup; `:lang(ko)` additionally pins the family.
- Syne's 800 weight is the chrome register; 600 is the credo; 400 is body
  Latin. Hierarchy comes from weight + size, never from a second face.
- Black Han Sans is single-weight by design — the Korean voice is uniformly
  bold and confident, the lettering on a flip-phone casing.
- Major Mono Display carries every "technical" readout: the spec codes, the
  eyebrows, the footer legal. Its even advance width is the rhythm of a
  product sheet stamped into foil.
- Tracking scale: eyebrows 0.22–0.28em (mono), hero sub 0.18em, footer legal
  0.05em, body 0.02–0.04em. Display heads go tight (-0.01 to -0.02em) so the
  heavy 800 reads as a single poured mass, not separate letters.

## The chrome (three renderers)

The headline is the page's thesis and uses three layered renderers, each a
named technique:

1. **CSS chrome-gradient text fill** (`.chrome-wordmark__fill`) — the honest
   fallback. A 5-stop linear gradient (ink → silver → highlight → silver →
   ink) clipped to the glyph shapes via `background-clip: text`. This is what
   you see with no JavaScript, under reduced motion, and if WebGL fails.
2. **WebGL fragment shader** (`.chrome-wordmark__metal`, `useChromeShader`) —
   a single full-quad program painting a horizontal chrome band stack
   displaced by layered sine ripples plus a gaussian lens that follows the
   pointer. The palette is fixed to the entry's chrome tokens (shadow, silver,
   highlight) so the shader is a literal token render. It sits over the CSS
   fill in `mix-blend-mode: screen`, transparent until its first real frame
   (`.is-live`). On any failure it stays hidden and the CSS fill stands.
3. **Per-glyph sweep reveal** (`.chrome-wordmark__glyphs`, `char-split-reveal`)
   — six aria-hidden glyph spans behind an `aria-label`, each clipping open
   left-to-right (`inset(0 100% 0 0)` → `inset(0)`) staggered 55ms, so the
   metal sweeps across the wordmark as it arrives. The glyphs themselves are
   transparent ink (they exist only for layout + the clip mask); the visible
   metal is the fill + shader beneath them.

## Texture recipe

- **The foil.** Three offset conic-gradient bands (sky → pink → mint) in
  `mix-blend-mode: screen` over a chrome-silver base, their angular origins
  shifted by `--chrome-px` / `--chrome-py` (the pointer parallax source).
  Blurred 10–34px so the rainbow reads as a sheen, not as bands. On touch and
  under reduced motion the foils rest at `--chrome-px: 0` (neutral rainbow).
- **The chrome pill** (product "photos"). An SVG with a horizontal 7-stop
  chrome gradient body (ink edge → silver → white → silver → ink edge), a
  radial chrome cap, a moving specular band positioned per-product, and a
  holographic radial floor glow keyed to the product's glow token. Every
  "product shot" is gradients — the no-photo rule, kept.
- **The scrim.** One radial holo-pink wash + one diagonal holo-sky → mist →
  mint gradient behind the hero, so no-JS and shader failure never show a
  hole. The same wash returns, softer, behind the footer.
- **The wet read.** A moving white specular streak (`.chrome-holofoil__spec`)
  across every foil panel, `background-position` shifted by the pointer — the
  thing that makes the metal read as wet rather than printed.

## Motion vocabulary

| Name | Value | Used for |
| --- | --- | --- |
| `ease-chrome` | `cubic-bezier(0.16, 1, 0.3, 1)` | the metallic sweep — fast gather, long bright tail |
| `ease-foil` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | foil settle — a slight overshoot |
| char-sweep | per-glyph 620ms `ease-chrome`, 55ms stagger | headline glyph reveal |
| fade reveal | 700ms `ease-foil`, translateY(16px) → 0 | section heads, cards, plaque |
| shader ripple | ambient 0.18 / 0.27 rad/s axes; pointer gaussian lens, lerp 0.09/frame | the chrome liquid |
| foil parallax | three layers ±18°/±11°/±6° origin shift, lerp 0.06/frame | the rainbow sheen |
| pointer lerp | 0.09 / 60fps-normalized frame | chrome slews like a heavy liquid |
| idle ripple | lissajous, after 2400ms silence or on touch | the metal breathes alone |
| glow pulse | 4.2s, accent rim opacity 0.35↔0.7 | the chrome button halo |
| hint pulse | 4.2s, opacity 0.5↔0.85 + 5px drift | the "move to ripple" invitation |

Nothing on the page snaps. Every JS-driven value is lerped, and no two
ambient periods coincide.

## Space & shape

- One column, centered, with the product grid as the only multi-column
  gesture (1 → 2 → 3 columns at 620/1000px). Generous section padding
  `clamp(84px, 12vh, 150px)`; text measure holds at 920px, credo at 760px.
- Shapes are pills (fully rounded) and sharp 4px corners. The chrome button
  is a perfect pill (`border-radius: 999px`); the foil panels are 4px; the
  wordmark sits hard against the foil's blurred edge.
- Asymmetry is held in reserve: the manifesto rules use a 4rem numeral column
  at ≥760px; the product grid breathes from 1 to 3 columns.

## Voice guide

**Five adjectives:** liquid · confident · optimistic · metallic · direct.

**Three example lines:**

1. "Gloss poured as metal. / 립을 붓듯 금속을 붓다."
2. "We do not sell a color. We sell the way light bends off a surface that
   refuses to be flat. / 우리는 색을 팔지 않는다. 납작해지기를 거부하는
   표면 위로 빛이 구부러지는 방식을 판다."
3. "© 2026 CHROME — poured as metal, worn as light. / 금속으로 붓고, 빛으로
   입는다."

**Three banned words:** *shimmer* (the metal *ripples*; shimmer is cheap),
*glamorous* (saying it would end it), *retro* (the house believes it is
current).

Grammar of the voice: present tense; one clause, maybe two; the Korean is a
transcreation that may compress — "poured as metal, worn as light" comes back
as "금속으로 붓고, 빛으로 입는다" (poured as metal, worn as light), the same
observation re-felt. Spec codes (CRM-01…) always typeset in Major Mono.

## Do & Don't

**Do**

1. Keep chrome silver and accent pink as **fills only** — every text token
   runs on chrome-ink / chrome-ink-2 / ink-soft. If a fill starts carrying
   copy, the contrast dies.
2. Let the shader be the spectacle, but never the only chrome: the CSS
   chrome-gradient fill behind it means WebGL failure loses the ripple, never
   the wordmark.
3. Keep the Korean first-class: Black Han Sans, natural word order, read
   aloud before shipping.
4. Derive every new shade from the eleven tokens and name it.
5. Hold the sweep discipline: glyphs arrive 55ms apart, reveals in observer
   batches — the metal sweeps, it does not pop.

**Don't**

1. Don't make it pixel-art. PIXEL owns the grid; CHROME owns the pour. If a
   surface looks blocky, it has crossed the family line.
2. Don't animate layout — transform, opacity, filter, clip-path only.
3. Don't let the chrome go flat: every chrome surface keeps its deep shadow
   (`chrome-ink`) — that shadow is what makes the highlight read as wet.
4. Don't let the fiction wink; no jokes about being a website or about Y2K.
   The counter believes it is a counter.
5. Don't speed the sweep up to "add energy." `ease-chrome` is patient on the
   way out for a reason — the bright tail is the chrome.
