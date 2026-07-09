# RASTER — design spec

## Identity

A standards bureau, est. 1957, that certifies grid systems the way a
metrology institute certifies weights. The page is not *about* the bureau —
it *is* one of its standard sheets: numbered, stamped, set on its own
certified grid, wearing its construction lines in public. The emotional
register is total deadpan: the sheet never raises its voice because it has
never once been wrong. Restraint is the flex — three colors, one typeface
family, and the entire expressive budget spent on a single variable-font
axis (Archivo's width, 62–125). The Korean is not a translation layer; it
is the clause hand of the same bureau, drier and one degree more final than
the English.

## Palette

| Token | Hex | Role | Contrast pairing (on paper) |
| --- | --- | --- | --- |
| `paper` | `#f7f7f5` | background — the sheet; never pure white | — |
| `ink` | `#111111` | all body text, headings, thick/thin rules | 17.6:1 (AAA) |
| `bureau-red` | `#e30613` | marks, hairlines, stamp, focus ring, selection, large display fills | 4.55:1 — AA normal *by 0.05*; the bureau does not certify without margin, so red never sets small text |
| `hairline` | `#f1b4b6` (red @ 28% α) | **decorative only**: column overlay, baseline grid | never functional |

Derived working tokens: `hairline-faint` = red @ 16% α (resting overlay),
`tint` = red @ 2.5% (column fill), `rule-soft` = ink @ 25% (row hairlines),
`ink-dim` = ink @ 66% ≈ `#5f5f5e` (annotations, 5.6:1). White appears only
inside ink and red blocks (labels, 4.9:1 on red) and as selection text.
No gradients. No shadows. No third color, ever.

## Type system

| Font | Source | Role |
| --- | --- | --- |
| Archivo (variable, wght + wdth 62–125) | Google Fonts | the standard itself — wordmark, headings, body; the width axis is the only special effect on the page |
| IBM Plex Sans KR | Google Fonts | every Hangul glyph — the clause hand |
| Space Mono | Google Fonts | annotations, coordinates, tabular figures, stamp lettering |

- Family stack is `Archivo, IBM Plex Sans KR, sans-serif`, so Hangul falls
  through the Latin font with no markup; `:lang(ko)` additionally pins the
  family and tightens tracking −0.005em.
- Base size `clamp(15px, 0.4vw + 13.6px, 17px)`, line-height 1.55.
- Display: wordmark `clamp(4.2rem, 17.5vw, 14rem)` at line-height 0.88,
  weight 640, resting width 125; verdict `clamp(2.3rem, 9.2vw, 9.6rem)`.
- Headings sit at width 116; body at 100. Width is hierarchy; weight barely
  moves (460–640).
- Mono annotations run 0.66–0.8rem with `font-variant-numeric:
  tabular-nums` — every figure on the sheet aligns.
- Type sizes above body are steps of the modular scale (ratio 1.333, the
  perfect fourth). A size off the scale is not a size.

## Texture recipe

None — and that is the recipe. The paper is flat `#f7f7f5`; the only
"texture" is the exposed construction:

1. **Column overlay** — a fixed, pointer-transparent layer holding *two*
   grids (12-col and 6-col) that share the content's exact max-width
   (1440px), margins, and gutter. Each track is a 2.5% red tint bounded by
   16% red hairlines. Only opacity crosses between the layers (240ms) when
   the certification changes.
2. **Baseline grid** — hero only: one 5.5% red hairline every 24px,
   `repeating-linear-gradient`, static.

The page wears its own blueprint; nothing else is allowed to decorate.

## Motion vocabulary

| Name | Value | Used for |
| --- | --- | --- |
| `ease-raster` | `cubic-bezier(0.2, 0, 0, 1)` | everything — brisk in, dead stop, zero overshoot |
| flip re-snap | 560ms on `transform`; First/Last around `flushSync`, invert inline, CSS plays it home | the 6↔12 re-certification |
| overlay crossfade | 240ms, opacity only | hairlines redraw ahead of the content |
| wdth-in | 1100ms per glyph, `'wdth' 62 → 125`, 55ms stagger, backwards fill | wordmark, footer verdict |
| wdth-hover | 300ms to `'wdth' 62`, hovered glyph only | decorative demonstration |
| stamp draw | 900ms `stroke-dashoffset 1 → 0` (pathLength=1), rings at 0/200/420ms, text fades at 720ms | hero seal |
| cert-rule draw | 1100ms, 480ms delay, same trick | footer rule |
| modular scrub | scroll-driven `scale(0.750 → 1)` — one ratio step of travel; smoothstep, 0.09 stagger | scale specimen |
| crosshair | raw `pointermove` written in rAF, `translate3d` only, **no lerp** | the instrument reports; it does not smooth |

Timing rule: nothing loops. Every animation runs once, settles, and files
itself. The only continuous behavior is the crosshair, and it is
user-driven.

## Space & shape

- Everything sits on the master grid: `repeat(var(--raster-cols),
  minmax(0, 1fr))`, gutter `clamp(8px, 1.6vw, 24px)`, frame max 1440px,
  margins `clamp(16px, 4vw, 48px)`. The column count is state (12 default,
  6 on re-certification), and the overlay proves it.
- Rule discipline: 3px ink opens a section; 1.5px closes a table header;
  1px @ 25% separates rows; red exists as 1px hairlines or 3px accents,
  nothing between.
- Shapes are rectangles and one circle (the stamp — a seal is the single
  permitted ceremony). border-radius: 0, everywhere, always.
- Section padding `clamp(64px, 11vh, 132px)`; the hero is exactly one
  viewport with the wordmark pushed to the optical middle.
- Blocks in the demonstration are solid ink, hairline outline, or red —
  numbered, never named.

## Voice guide

**Five adjectives:** deadpan · exact · certain · bureaucratic ·
quietly proud.

**Three example lines:**

1. "grid no. 04. approved 1972. still correct." / "그리드 제4호. 1972년
   승인. 지금도 유효함."
2. "clause 1.1 — a grid is correct, or it is not a grid." / "제1조 1항 —
   그리드는 정확하거나, 그리드가 아니다."
3. "note — grid no. 05 was deprecated in 1998. odd column counts do not
   divide." / "비고 — 그리드 제5호는 1998년 폐지되었다. 홀수 단은
   나누어지지 않는다."

**Three banned words:** *beautiful* (irrelevant to certification),
*flexible* (grounds for deprecation), *creative* (see clause 1.1).

Grammar of the voice: lowercase English except registered marks (RASTER,
DEPRECATED, NO. 04); every claim carries a number or a year; the Korean
line is the same finding re-issued, never a gloss — shorter where Korean is
shorter, and it always gets the last word.

## Do & Don't

**Do**

1. Spend all expression on the width axis — if something needs emphasis,
   make it wider or narrower, not bigger, bolder, or colored.
2. Put every new element on the grid and let `[data-flip]` carry it through
   re-certification; an element that cannot re-snap does not belong.
3. Derive every size from the 1.333 scale and every color from the three
   tokens; name any new alpha derivation in :root.
4. Keep figures tabular and zero-padded (04, not 4) — the sheet is read by
   inspectors.
5. Double every red mark with black text; red annotates, ink testifies.

**Don't**

1. Don't add a fourth color, a gradient, a shadow, or a radius — the
   fiction dies with the first soft corner.
2. Don't let red carry small text; it passes AA by 0.05 and the bureau does
   not certify without margin.
3. Don't smooth the crosshair or ease the toggle buttons — instruments
   report and switches snap.
4. Don't animate anything that lays out: transform, opacity,
   font-variation-settings, stroke-dashoffset — the whitelist is closed.
5. Don't let the fiction wink. No jokes about being a website. The bureau
   has no sense of humor on record.
