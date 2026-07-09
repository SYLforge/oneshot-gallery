# HANJI SLATE — design spec

## Identity

A fictional e-ink writing slate by Onji Works, Seoul — marketed as "hanji,
upgraded": the thousand-year paper, given a memory. The page is its product
sheet, and it behaves like the product: warm, matte, unhurried, precise.
Nothing glows, nothing scrolls past you in a hurry, and the one moment of
drama — the e-ink refresh flash — lasts 120 milliseconds and apologizes by
being useful. The register is Apple-adjacent bento-product, but where that
genre reaches for gloss and gradients, this page reaches for paper: warm
gray, graphite, hairlines, and a single amber the color of persimmon ink.
The Korean is not a translation layer; it is the slate's first language,
terser and warmer than the English.

## Palette

| Token | Hex | Role | Contrast pairing |
| --- | --- | --- | --- |
| `warm-gray` | `#e9e6e0` | background — the desk the slate lies on | — |
| `graphite` | `#26262a` | all primary text; battery plate; footer ground | 12.1:1 on warm-gray (AAA) |
| `eink-white` | `#f7f5f0` | bento tiles, device bezel, footer type | 12.6:1 as text on graphite |
| `amber` | `#e8830c` | decorative marks, `::selection`, footer accents | 5.8:1 on graphite; **2.4:1 on light ground — never text there** |
| `amber-deep` | `#9a5504` | functional amber on light ground: key figures, units, plus icons, focus ring | 4.6:1 on warm-gray, 5.3:1 on eink-white (AA) |
| `ink-soft` | graphite @ 72% α (≈`#616061`) | secondary text: glosses, captions, notes | 5.3:1 on warm-gray (AA) |
| `shell` | `#d8d4cb` | device shell: side buttons, port, magnesium back plate | decorative only |

Sepia reading mode swaps only the papers — `warm-gray → #e7dfcf`,
`eink-white → #f2ead9`, `shell → #d6cdba` — via `data-mode="sepia"` on the
root. Graphite and both ambers hold still, and every pairing above stays AA
on the sepia grounds (deep amber measures 4.8:1 on `#f2ead9`).

Derived working tokens: `hairline` = graphite @ 14% α, `hairline-strong` =
graphite @ 30% α, `paper-soft` = eink-white @ 72% α (footer secondary,
7.9:1 on graphite). The only gradient on the page is the radial device
shadow. No blur, no glass, no gloss.

## Type system

| Font | Source | Role |
| --- | --- | --- |
| Hanken Grotesk | Google Fonts | Latin display and body — the product's voice |
| Noto Sans KR | Google Fonts | every Hangul glyph, `word-break: keep-all` |
| JetBrains Mono | Google Fonts | spec readouts: bento figures, table values, callout labels |

- Family stacks put Noto Sans KR second in both the sans and the mono
  stack, so Hangul falls through Hanken *and* JetBrains into it with no
  markup; `:lang(ko)` additionally pins the family and keep-all breaking.
- Base size `clamp(16px, 0.4vw + 14px, 18px)`, line-height 1.55.
- Display: hero name `clamp(2.7rem, 8vw, 6rem)` weight 700; section heads
  `clamp(1.35rem, 2.6vw, 1.9rem)` weight 650; bento hero figure up to
  5.6rem in mono weight 600, tracking −0.02em.
- Mono is always small and always tracking-out (0.08–0.22em) when it acts
  as a label; full-size and tight only when it is a *figure*.

## Texture recipe

There is deliberately no texture overlay — no feTurbulence, no grain, no
scanlines. The paper feel is carried by:

1. **Field** — warm gray, never pure white; tiles in eink-white sit on it
   like sheets on a desk.
2. **Hairlines** — 1px rules at 14% graphite (30% for emphasis); dotted
   only in the footer records.
3. **Radii** — 18px on tiles, 26px on the device bezel; softness without
   blur.
4. **One shadow** — a radial gradient ellipse under the SVG device,
   26% graphite fading to nothing at 74%.

The fiction does the rest: the copy claims the glass is micro-etched, and
the page corroborates it by refusing gloss everywhere.

## Motion vocabulary

| Name | Value | Used for |
| --- | --- | --- |
| `ease-flip` | `cubic-bezier(0.22, 1, 0.36, 1)` | FLIP morph, detail fade, plus icon |
| flip-morph | 420ms — outer translate+scale, inner inverse scale | bento expand/collapse |
| plus-to-minus | 200ms, scaleY(1→0) on the vertical bar | tile affordance |
| detail-fade | 300ms + 140ms delay, translateY(6px) + opacity | expanded detail entrance |
| explode-scrub | smoothstep(p ∈ [0.08, 0.70]); ±132px outer / ±44px inner | exploded layers |
| callout-draw | dashoffset 1→0 over p ∈ [0.5+0.09i, 0.72+0.09i] | spec callout lines |
| eink-flash | 120ms linear, hard-cut invert(0→1→0) | reading-mode refresh |
| pointer-lerp | k = 0.09 / 60fps-normalized frame; ±7px device, ∓4px shadow | hero parallax |
| device-float | 6.5s ease-in-out infinite, −6px | the only ambient motion |

Timing rules: the page has exactly one infinite animation (the float);
everything else is caused by the visitor. Scrub is unsmoothed on purpose —
e-ink snaps. Interactions settle within 420ms; nothing on the page takes
longer except the visitor's own scroll.

## Space & shape

- Containers: sections read at 1120px (spec sheet at 880px); hero is one
  viewport; section padding `clamp(72px, 11vh, 140px)`.
- The bento grid is 4 columns (`repeat(4, minmax(0,1fr))`), 14px gap,
  `grid-auto-flow: dense`; footprints 2×2 / 2×1 / 1×1; expanded =
  `grid-column: 1 / -1`. Collapses to 2 columns at 900px, 1 at 480px.
- Shapes are rounded rectangles at exactly two radii (18px tiles, 999px
  pills) plus the device's 26px. Rules are 1px solid hairline; dotted
  reserved for the footer ledger.
- One accent geometry: amber appears as small marks (dots, terminals,
  underlines, key figures) — never as a surface.

## Voice guide

**Five adjectives:** calm · precise · warm · restrained · certain.

**Three example lines:**

1. "Six weeks of mornings on one charge." / "한 번의 충전으로 여섯 주의
   아침."
2. "Light falls into it, not off it." / "빛이 튕기지 않고 스며드는 화면."
3. "The last screen that lets you rest." / "쉬게 해주는 마지막 화면."

**Three banned words:** *revolutionary* (the slate would never raise its
voice), *seamless* (it has seams; they are 0.4mm and listed in the spec),
*experience* (it is a notebook, not an experience).

Grammar of the voice: short declaratives; numbers stated once, exactly,
never rounded up ("Measured, not rounded up"); the Korean line is never a
literal translation — it is the same fact, re-felt (transcreation). Specs
are haiku: figure, consequence, silence.

## Do & Don't

**Do**

1. Route every color through a token; if a new shade is needed, derive it
   from graphite or the papers and name it, alpha documented.
2. Keep bright amber off light ground for anything that must be read;
   `amber-deep` exists precisely so the accent can *work* for a living.
3. Let the visitor cause the motion — expand, scrub, toggle; the page's
   own idle life is one 6.5s float and nothing else.
4. Keep Korean first-class: Noto Sans KR, keep-all, natural word order;
   read it aloud before shipping.
5. State numbers like the spec sheet: exact, mono, once.

**Don't**

1. Don't add gloss — no gradients (beyond the one shadow), no
   backdrop-filter, no specular anything; e-ink is matte or it is a lie.
2. Don't animate layout — the FLIP exists so the grid can reflow while
   only transforms ever animate.
3. Don't ease the e-ink flash or the scrub; hard cuts and direct scrub
   are the material speaking.
4. Don't add a second accent hue, and don't let amber become a surface
   larger than a battery terminal.
5. Don't let the fiction wink — no "buy now" irony, no spec jokes; the
   slate believes it is paper.
