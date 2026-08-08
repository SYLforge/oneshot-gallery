# BLOCK — design spec

## Identity
An independent poetry press built from raw concrete blocks — the third
neo-brutalist entry, visually distinct from BLUNT (riso/paper/yellow) and
RAVE (dark/strobe/blue). BLOCK is grey concrete slab, green ink, hard
offset shadow, zero blur. Eight poems across four categories (structure /
attitude / material / method) form one wall. The premise: a poem is a
brick, a collection is a concrete wall.

## Three techniques
1. **clip-path-reveal + char-split** — sections wipe in with hard `steps(8)`
   geometric cuts; the hero wordmark splits letter-by-letter and each
   letter drops in sliced from above (no soft fades — brutalist hard cut).
2. **marquee** — a two-row manifesto ticker between sections, rows drifting
   in opposite directions at a constant gentle pace (rAF + IO-gated).
3. **flip-layout** — the signature: the poem grid FLIP-rearranges on
   category filter (First/Last/Invert/Play), with hard offset shadow cards
   and spring-overshoot press.

## Components (orchestrator + 6 components)
- `page.tsx` — orchestrator (~75 lines): composes sections, mounts
  `.block-js`, posts `oneshot:ready`, renders the concrete-grain overlay.
- `components/ConcreteHero.tsx` — wordmark + char-split-reveal + geometric
  shape explosion + meta chips.
- `components/PoemFlipGrid.tsx` — the signature FLIP grid (8 poems, 5
  filters).
- `components/Manifesto.tsx` — ink section, giant declaration + 5 rules.
- `components/ManifestoMarquee.tsx` — two-row voice ticker.
- `components/BlockFooter.tsx` — invitation, info grid, legal.
- `components/poems.ts` — 8 poems (KO original + EN echo), categories,
  motifs, labels.
- `components/Motifs.tsx` — pure inline-SVG geometric shapes (square,
  triangle, circle, stack, line, grid). Zero images.

## Palette (contrast map)
- `--bk-bg` #e5e5e5 — concrete slab. ink on it 15.3:1 (AAA).
- `--bk-ink` #171717 — the voice. 15.3:1 on bg.
- `--bk-ink-soft` #404040 — secondary. 9.7:1 on bg.
- `--bk-green` #22c55e — decorative only (2.0:1 on bg, never body).
- `--bk-green-ink` #14532d — the readable green. 7.6:1 on bg (AAA).
- `--bk-paper` #fff — card surface. ink on it 19.3:1 (AAA).

## Type
- Inter — every Latin glyph (display/body/label, full weight range).
- Black Han Sans — every Korean glyph. `:lang(ko)` pins line-height 1.4,
  letter-spacing 0. Display at letter-spacing -0.04em.

## Motion
- reveal: `steps(8)` (brutalist hard cut), 380–520ms.
- press: `cubic-bezier(0.34, 1.56, 0.64, 1)` (spring overshoot, y>1).
- flip: `cubic-bezier(0.22, 1, 0.36, 1)` (glide settle), 480ms.
- marquee: constant ~52px/s, rAF + IntersectionObserver-gated.

## Accessibility
Reduced motion: static (grid swaps instantly, ticker stops). No-JS: fully
readable (`.block-js` gate → SSR markup is the finished book). AA/AAA
contrast throughout. Korean-first bilingual. `:focus-visible` 3px outline.
Real `<ul>/<li>` grid with `aria-pressed` filters.
