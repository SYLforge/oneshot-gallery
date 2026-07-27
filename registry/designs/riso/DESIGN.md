# RISO — design spec

## Identity

RISO is an independent book publisher and art-house cinema in Seochon, Seoul,
that runs a three-drum risograph press in the back and a 24-seat screening
room up front. The page is not *about* the press — it *is* a press sheet:
uncoated paper, three fluorescent spot colors that overprint where they
cross, halftone-dot fields instead of flat fills, registration marks pinned
to the bleed corners, and a static paper grain over everything. The
emotional register is a literary-minded printer who chose fluorescent ink
the way a poet chooses a line break — for the overlap, not the brightness.
Korean is the first language of the house, set in a literary serif; English
is the subtitle track, never the lead.

This is the craft of physical print made web. Where the gallery's other
riso-adjacent entry (blunt) is a *shop* shouting in one ink with hard
shadows, RISO is a *press* building an image in three drums with halftone
and overprint. Same family of physical process, opposite temperament.

## Palette

| Token | Hex | Role | Contrast pairing |
| --- | --- | --- | --- |
| `paper` | `#f0ebe0` | background — uncoated riso stock | — |
| `ink` | `#1a1410` | all functional text, registration marks, hairlines | 15.3:1 on paper (AAA) |
| `fluo-pink` | `#ff3d7f` | drum 1 — plate, halftone field, CTA surface | ink on it: 5.4:1 (AA); on paper 2.84:1 → plate/surface only |
| `riso-blue` | `#2d5fbb` | drum 2 — plate, halftone, links, section accents | paper on it: 5.1:1 (AA); as text on paper 3.0:1 → large/display only |
| `riso-yellow` | `#ffd233` | drum 3 — plate, halftone, ::selection | ink on it: 12.6:1 (AAA); on paper 1.21:1 → surface only |
| `overprint-violet` | `#2d175d` | computed pink×blue overlap — decorative | never carries text |

Overprint rule: every drum-colored element uses `mix-blend-mode: multiply`,
so where pink crosses blue the overlap darkens toward violet (`#2d175d`),
and where all three cross the sheet goes near-ink — the physics of
transparent riso inks stacking on paper, made literal in the browser. The
signature press section shows this building up drum by drum with scroll.
Halftone is the other physics claim: spot colors are never flat fills, they
are `radial-gradient` dot fields (color ~40% → transparent 44%, 10–11px
tile), so each plate reads as a screen of dots the way a real riso drum
lays down ink.

## Type system

| Font | Source | Role |
| --- | --- | --- |
| Noto Serif KR | Google Fonts | every Hangul glyph + Korean display — a book publisher sets Korean in a serif first |
| Lora | Google Fonts | Latin body & section serif; display weight for the wordmark; italic for the English subtitle |
| Space Mono | Google Fonts | folios, captions, registration annotations, the press operator's ledger hand |

- Both serif stacks fall through into Noto Serif KR, so Hangul never lands
  in a fallback sans; `:lang(ko)` pins it and zeroes tracking. One serif
  register across EN/KR is the tell that the house hand-sets both languages
  in the same family of letter.
- Wordmark `clamp(4.6rem, 19vw, 15rem)` at line-height 0.86, three
  overprinting plates (pink + blue pseudo-elements multiply under an ink
  layer with a faint yellow text-shadow, so all three drums are on the
  wordmark).
- Body is Lora at a generous `line-height: 1.6`; the mono voice is reserved
  for metadata (folios, specs, captions), never paragraphs.

## Texture recipe

Two static SVG/CSS layers, neither animated. (1) Paper grain: one
full-viewport `feTurbulence` rect (fractalNoise, baseFrequency 0.9, 2
octaves, seed 11, stitchTiles) through a `feColorMatrix` that zeroes RGB and
scales alpha to ~0.07, overlaid with `mix-blend-mode: multiply` at opacity
0.5 — sparse dark fiber that keeps the paper from reading as flat
`#f0ebe0`. Lighter than blunt's grain (alpha 0.1) because this stock is
cooler and the halftone already adds texture. (2) Halftone dots: each
spot-color plate is a `radial-gradient` dot field, so the three drums read
as dot screens, not flat fills. A subtle misregistration (each plate offset
a few px, the color-bar chips drift toward the pointer under `.riso-js`) is
the only ambient motion — dead under reduced motion.

## Motion vocabulary

| Name | Value | Used for |
| --- | --- | --- |
| press-reveal | 0ms in / 520ms `cubic-bezier(0.16,1,0.3,1)` out | clip-path inset wipes — a sheet feeding off the press |
| scrub-lerp | 0.12 per 60fps-normalized frame | `--riso-press` chases scroll progress; the overprint build is scrubbable |
| layer-rise | opacity 0→1, phase-gated by `--riso-press` | each drum drops onto the sheet as its phase opens |
| misreg-drift | plate offset lerps toward pointer ×0.018, capped ±4px | the color bar breathes under the hand |
| link-press | 0ms in / 120ms ease-out out, translate 2px | a stamp-tap on buttons/links |

The motion is gentle where blunt's is anti-eased: a press is a slow,
deliberate machine, so reveals ease out softly and the overprint build
lerps rather than snaps. The one hard gesture is the button press — a 2px
stamp-tap — because a drum coming down is the only fast thing in the room.
Ambient motion is scarce and low-stakes: the color-bar drift and the
scroll-scrubbed build. Everything pauses offscreen and on hidden tabs.

## Space & shape

- The 1px hairline is the atom: borders, table-like rules, registration
  marks, focus rings — all 1px ink, never 3px (this is not brutalism).
- Shadows are soft and low: `4px 4px 0 rgba(ink, 0.1)` on covers, a single
  `6px 6px 0 rgba(ink, 0.12)` on the press sheet. Blunt's hard black
  shadows are deliberately not used — this press is quieter.
- The sheet is the recurring shape: the press sheet (4:3), the poster
  (320:420), the book covers (3:4). Each is a bordered paper rectangle with
  a folio in the corner.
- Registration marks (cross-in-circle) pin the four viewport corners as the
  bleed of one big sheet; a three-chip color bar sits bottom-center.
- Sections read at 1240px; the press section is full-bleed with a tall
  scroll length (320vh) so the build scrubs across a few screens; hero is
  one viewport.

## Voice guide

**Five adjectives:** literary · patient · fluorescent · bilingual-first ·
quietly proud.

**Three example lines:**

1. "세 개의 도수, 한 장의 종이. — One drum at a time, the overlap doing all
   the work."
2. "Printed this season. 이번 절기에 찍은 책."
3. "© 2026 RISO PRESS — PRINTED BY HAND, OVERLAPPED ON PURPOSE. 손으로 찍고,
   일부러 겹쳤다."

**Three banned words:** *loud* (that's blunt), *clean* (riso is textured,
not clean), *minimal* (three fluorescent drums is the opposite of minimal).

Grammar of the voice: Korean leads, English follows as the subtitle track;
the Korean is set in the serif and is never a translation of the English —
it is the line the house would actually print. Folios and specs are mono
and uppercase with open tracking; prose is serif and lowercase. No
exclamation marks; the fluorescents do the shouting.

## Do & Don't

**Do**

1. Route every color through the six tokens; a drum color is always a
   plate (multiply) or a surface under ink, never flat text on paper.
2. Multiply where ink overlaps ink; the blend mode is a physics claim, and
   the press section exists to show it building up.
3. Set dot fields, not flat fills, for spot colors — a riso plate is a
   screen of dots.
4. Keep the Korean first-class: Noto Serif KR, natural word order, leading
   the English; read it aloud before shipping.
5. Let the press build slowly — the scrub-lerp and the soft reveal easings
   are the temperament of a deliberate machine.

**Don't**

1. Don't let fluorescent pink or yellow carry functional text on paper —
   pink is 2.84:1, yellow 1.21:1; they are plates and surfaces only.
2. Don't borrow blunt's 3px rules, hard black shadows, or 0ms anti-easing —
   this is a different temperament; 1px hairlines and soft low shadows.
3. Don't flatten the overprint into one color — the whole point is three
   drums stacking; if two plates don't visibly darken where they cross, the
   illusion is broken.
4. Don't animate anything but transform, opacity, filter, and clip-path —
   and keep the ambient budget scarce (color-bar drift + the scrubbed build
   is it).
5. Don't let the fiction wink — no jokes about being a website. The press
   believes it is a press, and it wants your manuscript by the next new
   moon.
