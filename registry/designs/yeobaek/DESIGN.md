# 여백 YEOBAEK — design spec

## Identity

A bilingual literary quarterly about yeobaek — 여백, the negative space of
Korean art and life — whose seventh issue is devoted to its own subject.
The page is not a website about the journal; it *is* the issue: cover,
lead essay with tipped-in plates, margin apparatus, a small gallery of
plates, colophon. The emotional register is a quiet editor who trusts the
reader: nothing shouts, nothing fills, and every centimeter of ivory is a
decision, not a leftover. Korean is the first language; the English is a
transcreation set half a step quieter, answering rather than translating.

## Palette

| Token | Hex | Role | Contrast (on ivory) |
| --- | --- | --- | --- |
| `ivory` | `#faf6ef` | the page; whitespace is rendered in this color | — |
| `plate-paper` | `#fffdf8` | tipped-in plates — coated stock in an uncoated book | 1.03:1 (surface only) |
| `ink` | `#232020` | body text, strokes, the masthead | 15.0:1 (AAA) |
| `ink-soft` | ink @ 72% α ≈ `#5f5c5a` | secondary text: EN transcreations, captions, footnotes, folios | 6.2:1 (AA+) |
| `oxblood` | `#7d2a26` | the single accent: hairlines, drop cap, footnote numerals, seal, underline draw, focus ring, selection | 8.7:1 (AAA) |
| `graphite` | `#8f8a82` | **rules only**: plate edges, column rule, dotted ledger leaders, static link hairline | 3.2:1 — never functional text |

Derived working tokens: `rule` = graphite @ 55% α, `rule-faint` =
graphite @ 32% α, `shadow` = ink @ 14% α (the tip-in shadow). There is no
second accent. If something needs emphasis, it gets space, not color.

## Type system

| Font | Source | Role |
| --- | --- | --- |
| Nanum Myeongjo | Google Fonts | every Hangul glyph; the masthead 여백 (800); essay KO body (400/700) |
| Libre Caslon Text | Google Fonts | Latin body, italic folios and captions, the drop cap |

- Family stack is `Libre Caslon Text, Nanum Myeongjo, serif`: Latin
  resolves in Caslon, Hangul falls through into Myeongjo with no markup.
  `:lang(ko)` additionally pins Myeongjo, applies `word-break: keep-all`
  and −0.005em tracking.
- Base size `clamp(16px, 0.45vw + 14px, 19px)`, root leading 1.8.
- KO paragraphs read at line-height 2.05 (Myeongjo needs air); their EN
  answers at 0.95em / 1.78, in `ink-soft`.
- Masthead `clamp(5rem, 21vw, 15rem)` at weight 800, −0.015em; essay title
  `clamp(2.1rem, 5vw, 3.6rem)` at 700.
- Folio and kicker: Caslon italic / uppercase Caslon at 0.72rem with
  0.28em tracking (0.18em for Hangul).
- Drop cap: `::first-letter`, Caslon, 4.6em, line-height 0.76, oxblood.

## Texture recipe

Deliberately none — the texture budget is spent on paper against paper:

1. **Tip-in plates** — `plate-paper` panels, 1px `rule-faint` edge,
   rotated −0.6° (or +0.5° when flipped/right-hung), shadow
   `0 14px 34px -22px` ink@14% plus a 2px contact shadow. They read as
   prints tipped into the binding.
2. **Hairlines** — 1px throughout: solid oxblood for the journal's one
   ornament (cover rule, kicker dash), solid/faint graphite for structure,
   dotted graphite for the colophon ledger.
3. **Emptiness as material** — section paddings run 16–18vh, the gallery
   hangs plates with `clamp(6rem, 18vh, 14rem)` between them. The
   whitespace must read as set, not unset.

## Motion vocabulary

| Name | Value | Used for |
| --- | --- | --- |
| `ease-out-page` | `cubic-bezier(0.16, 1, 0.3, 1)` | reveals, cover rise |
| `ease-ink` | `cubic-bezier(0.4, 0, 0.2, 1)` | time-based stroke draws |
| `ease-band` | `cubic-bezier(0.32, 1.42, 0.5, 1)` | underline draw — the rubber-band snap (~6% overshoot) |
| cover cadence | chars 120ms + 190ms·i · deck 520ms · rule 680ms · issue 800ms · foot 1020ms | masthead choreography |
| reveal | 700ms, translateY(14px) → 0, 80ms batch stagger | paragraphs, plates, heads |
| footnote slide | 700ms, translateX(22px) → 0 | margin notes at their threshold |
| scrub lerp | `v += (t − v)(1 − 0.86^(dt/16.7))` — half-life ≈ 4.6 frames | plate stroke draw |
| scrub window | start: spread top at 70vh; span: min(0.85·height, 1.1·vh) | when the ink moves |
| gallery draw | 1500ms `ease-ink`, ripples staggered +250/500/750ms | plates III |
| underline | in 640ms `ease-band`, out 220ms `ease-ink` | all `.yeobaek-link` |

Rule: motion may only ever *finish* something the static page already
shows — a stroke completing, a note arriving, a rule extending. Nothing
loops, nothing idles; between interactions the page is perfectly still.

## Space & shape

- One column of truth: essay text at `max-width: 36rem`; the margin rail
  (15rem) appears at 1080px; spreads live on a wider 74rem grid (5:7,
  flipped to 7:5) — figures deliberately break the text grid the way
  plates break a book's.
- Section padding `clamp(96px, 16vh, 200px)`; the cover is one viewport
  with the identity block starting at ~18vh.
- Shapes are rectangles and hairlines. The only rotation on the page is
  the plates' ±0.6°; the only filled shape is the 20×20 oxblood seal.
- Coda: CSS `column-count: 2` above 900px with a faint column rule —
  the essay ends in the magazine's own gesture.

## Voice guide

**Five adjectives:** essayistic · restrained · bilingual-by-conviction ·
concrete (always an object: paper, fan, courtyard) · unhurried.

**Three example lines:**

1. "여백은 비어 있지 않다. 그것은 아직 말해지지 않은 것이다." / "Blank
   space is not empty. It is the not-yet-said."
2. "가장 오래 읽게 되는 부분은 추신이 아니라, 문장이 끝나고 서명이
   시작되기 전의 그 빈 줄이다." / "The part we read longest is the blank
   line between the last sentence and the signature."
3. "이 판은 일부러 비워 두었다. 당신이 걸 것을 위하여." / "This plate is
   left empty on purpose, for whatever you bring."

**Three banned words:** *minimal* (the journal shows, never labels),
*zen* (wrong tradition, lazy shorthand), *elegant* (if it must be said,
it isn't).

Grammar of the voice: KO paragraph first, EN transcreation after — the
same observation re-felt, never word-for-word. Claims stay anchored in
real, checkable referents (Sehando, Shitao, pansori, the madang) and stop
before scholarship they can't support.

## Do & Don't

**Do**

1. Spend emphasis as space: if something matters more, give it more
   emptiness, not more weight.
2. Keep oxblood scarce — hairlines, numerals, one seal, one drop cap. Its
   authority is its rarity.
3. Let the reader's scroll do the drawing; the ink should never move
   faster than the hand that summons it.
4. Write KO first and transcreate; read both aloud before shipping.
5. Keep every stroke honest: `pathLength=1`, dashoffset math you can do in
   your head.

**Don't**

1. Don't add texture — no grain, no paper noise filters. The plates' two
   whites are the entire material story.
2. Don't let graphite carry words; it draws lines, `ink-soft` speaks.
3. Don't animate layout — transform, opacity, stroke-dashoffset only; the
   pin is `position: sticky`, not JavaScript layout.
4. Don't fill the margins. The rail holds footnotes and nothing else; an
   empty rail is content.
5. Don't let the fiction wink — no jokes about scrolling or websites; the
   journal believes it is paper.
