# BLUNT — design spec

## Identity

A two-person risograph co-op at the end of a Euljiro alley, est. 2019,
behind a blue door nobody repaints. The page is not *about* the shop — it
*is* the shop: the price list taped to the wall, the work table mid-mess,
the wordmark that came off the drum two millimeters off and got kept
because it looked better that way. Everything on screen must feel printed,
not rendered: one paper, one ink, three drums, hard shadows. The emotional
register is a shopkeeper who is extremely good at the job and refuses to be
charming about it. The Korean is not a translation layer; it is the
co-op's actual voice — shorter, drier, funnier than the English.

## Palette

| Token | Hex | Role | Contrast pairing |
| --- | --- | --- | --- |
| `paper` | `#f2ede1` | background — recycled stock | — |
| `ink` | `#101010` | all functional text, 3px rules, hard shadows | 16.3:1 on paper (AAA) |
| `acid-yellow` | `#ffd02f` | row highlights, CTA surface, ::selection, marquee row B | ink on it: 13.0:1 (AAA) |
| `riso-blue` | `#2536ff` | misregistration plate, halftone, cutting-mat grid, focus on yellow | 5.9:1 on paper (AA) · 4.7:1 on yellow (AA) |
| `fluo-red` | `#ff4b33` | misregistration plate, stamps, rush tag — **display/decorative only** | 2.9:1 on paper — never functional text; as a surface it carries ink at 5.7:1 |

Overprint rule: solid-ink elements (the two wordmark plates, ink stickers,
halftone dots, the overprint test) use `mix-blend-mode: multiply`, so
overlaps darken the way stacked riso layers do. Paper-backed things (price
tag, barcode, wet-ink label) stay opaque — paper occludes. No gradients
anywhere except the halftone dot pattern and the hazard stripes, which are
hard-stop repeating gradients, i.e. not gradients at all.

## Type system

| Font | Source | Role |
| --- | --- | --- |
| Archivo Black | Google Fonts | Latin display — wordmark, section titles, the footer shout |
| Do Hyeon | Google Fonts | every Hangul glyph on the page — condensed, deadpan |
| IBM Plex Mono | Google Fonts | labels, prices, slogans, annotations — the ledger hand |

- Both Latin stacks end in Do Hyeon (`Archivo Black, Do Hyeon, sans` /
  `IBM Plex Mono, Do Hyeon, monospace`), so Hangul falls through with no
  markup; `:lang(ko)` additionally pins it and zeroes letter-spacing.
  One Korean face everywhere is the art direction: the shop hand-letters
  everything in the same condensed gothic.
- Wordmark `clamp(4.2rem, 22vw, 16.5rem)` at line-height 0.82, tracking
  −0.02em; the PRINT WORKS deck runs at 0.345em of it.
- Everything else is 700-weight mono in caps with open tracking
  (0.04–0.14em) — labels, not paragraphs. Body-size text exists only in
  the footer address and price notes.

## Texture recipe

One fixed, pointer-transparent layer over the whole viewport: an SVG
`<rect>` filtered through `feTurbulence` (fractalNoise, baseFrequency 0.8,
numOctaves 2, stitchTiles) into a `feColorMatrix` that zeroes RGB and
scales alpha to 0.1, blended with `mix-blend-mode: multiply` at
opacity 0.55. Static — grain in paper does not move. Beneath it, the
misregistered wordmark plates stumble once per 8.4s (transform only,
~2 ticks), which is the entire ambient motion budget of the page.

## Motion vocabulary

| Name | Value | Used for |
| --- | --- | --- |
| press-in | **0ms** — `:active` snaps `translate(6px,6px)` as the shadow collapses to 0 | buttons |
| press-out | **90ms linear** snap-back on release | buttons |
| row-press | same pair at 3px | price-list rows |
| marquee base | 0.066 px/ms (~66 px/s), sign = scroll direction, rows opposed | tickers |
| marquee boost | +0.055 px/ms per unit of smoothed scroll velocity, cap 0.34 | tickers |
| marquee approach | signed speed → target by `1 − 0.88^(dt/16.7)` per frame | direction flips skid |
| sticker friction | 0.93 per 60fps-normalized frame | fling glide (~400px) |
| sticker bounce | restitution 0.45, spin ×0.6 on impact | table edges |
| sticker torque | `0.6 × (vx·−gy + vy·gx)` | grab a corner, it spins |
| misreg twitch | 8.4s cycle, ~2 ticks of plate offset | wordmark |

The anti-easing is doctrine, not a shortcut: nothing on this page eases
into a press. A stamp hits the paper at full speed and lifts off almost as
fast — `0ms` in, `90ms linear` out is that gesture. The only continuous
easing on the page (the marquee's exponential approach) exists because a
0ms direction flip read as a rendering bug, not a decision.

## Space & shape

- The 3px rule is the atom: borders, table rules, strikethrough, focus
  ring — all 3px, all ink. If a line is not 3px it is a 1px annotation
  (badge inner ring, mat grid).
- Shadows are offset solids, never blurred: 6px/6px on buttons, 4px/5px on
  stickers (9px/11px while grabbed). Blur is fog; this shop has none.
- Rectangles by default; circles only where print justifies them (stamps,
  halftone, smiley, the overprint dots). No border-radius otherwise.
- Nothing decorative sits at 0° — badges, stamps, and stickers live
  between −8° and +8°. Functional text (prices, addresses, the table)
  is always square.
- Sections read at 1280px; the marquee band is full-bleed; section padding
  `clamp(56px, 9vh, 120px)`; hero is one viewport.

## Voice guide

**Five adjectives:** loud · deadpan · stubborn · precise-about-money ·
secretly proud.

**Three example lines:**

1. "WE PRINT LOUD. 조용한 건 안 찍음."
2. "POSTER B2 — ₩12,000 — SMELLS LIKE INK 잉크 냄새 포함"
3. "12:00–20:00 · CLOSED WHEN RAINING 비 오면 쉼"

**Three banned words:** *minimal* (the enemy), *clean* (we are not),
*curated* (we print things, we don't curate them).

Grammar of the voice: ALL CAPS English, short declaratives, prices with
the ₩ up front; the Korean line is never a literal translation — it is the
same fact said the way the shop would actually say it (transcreation), and
it is allowed to be funnier than the English. No exclamation marks except
inside artwork (쾅! earns its one).

## Do & Don't

**Do**

1. Route every color through the five drum tokens; a new shade means a new
   drum, and the shop has five.
2. Multiply where ink overlaps ink; keep paper decals opaque. The blend
   mode is a physics claim, not a style.
3. Let presses snap — 0ms in, 90ms linear out, everywhere a press exists.
4. Keep the Korean first-class: Do Hyeon, natural word order, drier than
   the English; read it aloud before shipping.
5. Rotate the decoration, square the information.

**Don't**

1. Don't let fluorescent red carry functional text on paper — it is a
   plate and a frame, not a voice (2.9:1).
2. Don't blur a shadow, round a corner, or fade an entrance; the page is
   printed, not projected — things are simply there.
3. Don't animate anything but transform, opacity, and filter — and spend
   the ambient budget once (the 8.4s misregistration stumble is it).
4. Don't add a third marquee row or a second twitch; brutalism reads as
   rhythm only while it is scarce.
5. Don't let the fiction wink — no jokes about being a website. The shop
   believes it is a shop, and it wants your order in by Thursday.
