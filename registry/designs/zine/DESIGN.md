# 잡지 ZINE — design spec

## Identity

An independent punk-culture zine called **잡지 / ZINE — The Photocopy
Underground**, No. 32. A small press in a Hongdae basement that prints a
thousand two-color stapled copies a month, and the page *is* one of those
issues: a masthead poster, a scrolling production-credits band, a
multi-column editor's note with a highlighter drop cap and pull quote,
a dense grid of six halftone-photo features that wipe in with clip-path
cuts, and a back-page colophon. The emotional register is loud, dense,
collaged, handmade — a zine you can almost hear being stapled. Korean is
the first language; English answers in the condensed display voice.

### Distinction from YEOBAEK (the sibling editorial-serif entry)

Both entries live in the `editorial-serif` family and both are bilingual
KO-first magazines. They are otherwise opposites, deliberately:

| Axis | YEOBAEK (No. 07) | ZINE (No. 32) |
| --- | --- | --- |
| Register | quiet, literary, restrained | loud, punk, dense |
| Whitespace | the design — vast, set emptiness | refused — the grid is packed |
| Columns | one measured column + margin rail | true CSS multi-column running text |
| Drop cap | `::first-letter`, oxblood, calm | a wrapped glyph on a highlighter swatch, rotated |
| Accent | oxblood `#7d2a26` (scarce, expensive) | highlighter yellow `#fff44f` (everywhere as a marker pass) + stamp red |
| Texture | none — paper against paper | halftone dots, tape, misregistration, rules |
| Photos | none — empty plates | SVG halftone duotones, taped on |
| Underline | rubber-band ink stroke that draws | highlighter bar that slides in |
| Motion | scroll-scrubbed ink that draws | clip-path wipes + per-glyph splice + marquee |
| Voice | essayistic, unhurried | declarative, shouted |

The same family, the opposite magazine.

## Palette

| Token | Hex | Role | Contrast (on newsprint) |
| --- | --- | --- | --- |
| `newsprint` | `#f4f0e6` | the page — cheap cream ground | — |
| `stock` | `#fbf8ef` | taped-on photos & pull quotes — glossy on newsprint | 1.03:1 (surface only) |
| `ink` | `#1a1a1a` | body text, headlines, halftone dots, masthead | 14.6:1 (AAA) |
| `ink-soft` | `#4a4640` | secondary text — captions, folios, marginalia, deks | 8.7:1 (AAA) |
| `highlighter` | `#fff44f` | **decorative only** — the marker stroke behind pull quotes, drop cap, dek; tape translucency | 2.3:1 as text — **never carries text alone** |
| `stamp` | `#c1272d` | rubber-stamp red — folios, the POSTAGE stamp, kickers, focus ring | 5.7:1 (large/bold only) |

Derived tokens: `rule-faint` = ink @ 22% α (photo frames), `tape` = ink @
10% α, `tape-cream` = newsprint @ 66% α (the cream tape over photos),
`shadow` = ink @ 18% α (photocopy contact shadow).

**The highlighter rule:** yellow is a *marker pass*, never the ink. Text
that sits on a yellow swatch stays `ink` — the highlighter is the
background, the word reads as ink-on-yellow (14.8:1). Yellow never appears
alone carrying a word.

## Type system

| Font | Source | Role |
| --- | --- | --- |
| Oswald | Google Fonts | condensed Latin display — masthead, headlines, folios, kickers, the marquee band, bylines; the poster voice |
| Noto Serif KR | Google Fonts | every Hangul glyph (masthead 잡지, all essays, marginalia) + Korean-first running text at weight 400/500/700/900 |

- Body stack is `Noto Serif KR, serif` first: Hangul and Latin serif both
  resolve there. Display elements get Oswald by class (the masthead's
  English `ZINE`, every kicker, every dek, the marquee).
- `:lang(ko)` pins Noto Serif KR explicitly and applies `word-break:
  keep-all` with −0.005em tracking and line-height 1.72 — Korean never
  breaks mid-word and the serif gets the air it needs.
- Base size `clamp(15px, 0.4vw + 13.5px, 18px)`, root leading 1.6 (tighter
  than the literary sibling — density is the point).
- KO body runs at line-height 1.74, weight 500; EN deks at 0.92em in
  Oswald 400, `ink-soft` — a lighter, condensed answer to the serif lead.
- Masthead 잡지 at weight 900, `clamp(5.5rem, 24vw, 17rem)`, −0.04em;
  `ZINE` below it in Oswald 700 at `clamp(2.2rem, 9vw, 6.4rem)`.
- Drop cap: a wrapped span glyph (not `::first-letter`) at 3.6em on a
  highlighter swatch, rotated −2° — a real collage element.

## Texture recipe

Photocopy energy, built from **layering and geometry**, never from image
files or noise filters:

1. **Halftone "photos"** — SVG dot fields inside masked panels. Each panel
   is a grid of `<circle>` elements whose radius grows toward a soft radial
   mask center, so the field reads as a newsprint duotone photograph:
   dense where the picture is dark, sparse where it is light. Cream shows
   through the gaps the way newsprint shows through ink. Six variants
   (stage, riso, crowd, wall, tape, flyers) feel like different shots of
   the same underground.
2. **Tape strips** — translucent cream rectangles (`tape-cream`, newsprint
   @ 66% α) at the photo corners, rotated −32°, holding each photo on like
   masking tape on a collage.
3. **Highlighter marks** — solid yellow bars behind the dek, the drop cap,
   and the pull quote's flagged clause. Slightly oversized and box-clone
   wrapped so multi-line reads as one marker pass.
4. **Rules** — 1–2px ink hairlines everywhere: the masthead frame, the
   column rule between essay columns, picture-frame borders, the
   colophon ledger. The grid leans on its rules.
5. **Misregistration** — photos rotate ±1–3°, the stamp rotates −7°, the
   pull quote −0.6°, marginalia ±1.4°. The whole grid is slightly off-axis
   — handmade, never perfectly registered.

No `feTurbulence`, no image grain filters. The grain is geometric.

## Motion vocabulary

| Name | Value | Used for |
| --- | --- | --- |
| `ease-punk` | `cubic-bezier(0.2, 0.8, 0.2, 1)` | clip wipes, letter reveals, link highlighter |
| `ease-stamp` | `cubic-bezier(0.34, 1.56, 0.5, 1)` | stamp drop — ~6% overshoot |
| `clip wipe` | `inset(0 100% 0 0)` → `inset(0 0 0 0)`, 760ms; diagonal variant `polygon(0 0,0 0,0 100%,0 100%)` → `polygon(0 0,100% 0,100% 100%,0 100%)` | article photo reveals |
| `letter reveal` | per-glyph opacity 0→1 + translateY(0.5em) + rotate(−4°) → 0, 90ms + 160ms·i stagger, 540ms | masthead 잡지 |
| `marquee drift` | base 0.05 px/ms; reversed & boosted by scroll dir/vel (dir·−(BASE+vel·BOOST), cap 0.32); dt-normalized lerp | the credits band |
| `marquee wrap` | offset kept in (−w, 0] across 4 identical groups | seamless seam |
| `reveal` | 560ms `ease-punk`, translateY(16px) → 0 + opacity, 70ms batch stagger | paragraphs, heads |
| `link highlighter` | in 340ms `ease-stamp` (scaleX 0 → 1), out 260ms `ease-punk` | every `.zine-link` |

Rule: motion only *finishes* or *reveals* something already in the
static page — a clip opening, a letter landing, a band drifting. The
marquee is the one looping element, and it pauses offscreen.

## Space & shape

- **Dense grid.** Essay columns at 2 columns ≥940px with a 1px ink column
  rule; the article wall is 1 → 2 → 3 columns at 620/1040px. Padding runs
  tight: `clamp(56px, 10vh, 120px)` — half the literary sibling's air.
- **A margin rail** for marginalia at ≥1080px (13rem); below that, notes
  fold beneath the column. The notes carry a 2px hard offset shadow
  (`2px 2px 0 ink`) — pinned cards, not floating panels.
- **Shapes are rectangles** framed in ink, with one hard offset shadow
  each (`3px 3px 0 ink` on cards). Rotation is the only non-orthogonal
  move, applied to photos, tape, the stamp, marginalia, the pull quote.
- **The masthead frame** is a 2px ink border inside a 2px ink page border —
  a double rule that reads as a photocopied cover.

## Voice guide

**Five adjectives:** declarative · loud · Korean-first · concrete (always
a machine: copier, riso, stapler, cassette) · unsentimental.

**Three example lines:**

1. "종이를 접고, 복사기를 두드리고, 한밤중에 스테이플러를 누른다." /
   "Fold the paper, pound the copier, press the stapler at midnight."
2. "좋은 잡지는 손해보는 잡지다." / "A good zine is a losing zine."
3. "화면은 꺼진다. 종이는 남는다." / "The screen goes dark. The paper stays."

**Three banned words:** *premium* (zines are cheap and proud of it),
*curated* (wrong politics — these are stapled, not selected), *minimal*
(this is the maximalist editorial register).

Grammar of the voice: KO sentence first, EN answer after — the same
observation re-felt, never word-for-word. Claims stay anchored in the
material of the press (the riso drum, the registration mark, the staple,
the cassette) and stop before sentimentality.

## Do & Don't

**Do**

1. Spend emphasis as density: if something matters, the grid gets tighter,
   not airier.
2. Keep the highlighter as a marker pass — it is always behind ink, never
   carrying a word on its own.
3. Let the misregistration read: photos lean, the stamp tilts, marginalia
   sit crooked. The off-axis is the aesthetic.
4. Write KO first and answer in EN; read both aloud before shipping.
5. Keep every halftone honest — SVG dot fields tuned by hand, never a
   raster.

**Don't**

1. Don't add air where the brief asked for density — this is the maximalist
   sibling. Whitespace is YEOBAEK's job.
2. Don't let the highlighter or stamp red fall below AA when they carry
   text; yellow is decorative, red is large/bold only.
3. Don't animate layout — transform, opacity, clip-path only; the marquee
   is `translate3d`, the photos' rotation is static art direction.
4. Don't load a single raster image. The grain is geometry; the photos are
   dots.
5. Don't let the fiction wink at the web — no jokes about scrolling or
   browsers; the zine believes it is paper held together with tape.
