# FLOW — design spec

## Identity

A journaling app whose whole identity is that *letters flow like water*.
The third kinetic-typography entry, visually distinct from TYPEWAVE and
STRETCH: where they animate the type itself, FLOW animates the medium the
type lives in — a canvas river that carries the words.

## The signature

**WordRiver** — a canvas that draws ~30 words along sine waves in three
planes of depth (far/mid/near = small-faint-slow / readable-teal /
large-crisp-fast). A pointer parts them radially, like a stone in the
current; the push lerps back to rest when the hand leaves. Reduced motion
freezes the river at a single composed still.

## Structure

- `page.tsx` — orchestrator (root, reveal observer, oneshot:ready).
- `components/FlowHero.tsx` — hero: WordRiver backdrop + char-split wordmark.
- `components/WordRiver.tsx` — the canvas React wrapper (rAF, resize, pointer).
- `components/wordRiver.ts` — pure simulation + draw (no React, no DOM events).
- `components/FlowingVerse.tsx` — pinned verse, four crossfading stanzas.
- `components/FlowLaws.tsx` — five laws of liquid as glass cards.
- `components/FlowFooter.tsx` — closing colophon.
- `components/words.ts` — the lexicon, verses, laws (pure data).
- `styles.css` — full liquid palette with contrast ratios, Korean `:lang(ko)`
  rules, three easing curves, layered shadows, four media queries.

## Accessibility

- Reduced motion: canvas draws one still; wordmark does not drift; pointer
  parallax never writes its variables; verses show the last stanza.
- No-JS: fully readable — river replaced by CSS sky wash, verses stacked,
  laws a static list.
- AA contrast on every body token; bright cyans are decorative only.
- Korean-first bilingual with `:lang(ko)` line-height (1.9) and letter-spacing
  (0) rules.
- NaN discipline: every measured value guarded with `Number.isFinite`.

## Palette (with contrast ratios)

| token | hex | on sky | role |
|---|---|---|---|
| ink | #0c4a6e | 8.87:1 (AAA) | primary text |
| ink-soft | #0369a1 | 5.57:1 (AA) | secondary text |
| accent-press | #075985 | 7.09:1 (AAA) | solid fills |
| accent | #0ea5e9 | 2.60:1 | DECORATIVE only |
| ink-faint | #7dd3fc | 1.78:1 | DECORATIVE (canvas far band) |
