---
provenance: distilled-recipe
model: builtin:zai-coding-plan/GLM-5.2
modelLabel: GLM-5.2
tool: zcode-cli
date: 2026-07-27
oneshot: false
followUps: 1
verification:
  status: rubric-passed
---

# CHAPTER — reproducible prompt

## Distilled recipe
시간의 책, The Book of Hours — an editorial-serif digital book that sets a
day as six hours (dawn → night), each hour a chapter with a drop cap,
prose, and a unique marginalia note. The page *is* the book: a
frontispiece, six pinned spreads that crossfade like turning a page as you
scroll, and a colophon ledger. Pure code, no images, Korean-first bilingual.
Remade from a 3-chapter × 2-sentence, 254-line sheet into a 6-hour,
~6-sentence-per-chapter, 800+ line book.

## Distinct from siblings
- YEOBAEK — quiet, airy, literary single voice.
- ZINE — loud, dense, photocopied, multi-column newsprint.
- CHAPTER — the book-as-object: pinned page-turning spreads, a real
  frontispiece and colophon, marginalia as the reader's annotations.

## Signature moment
펼쳐지는 책 페이지 — pinned spreads that crossfade on scroll (the atelier
Lookbook pattern, adapted to a paper book). `data-spreadstate` drives a
robust single-spread crossfade; `--chapter-spread` is the smooth layer.

## Known deviations
Hooks: `useReveal` + `usePrefersReducedMotion` retained (standard);
`useChapterProgress` added (lookbook-style). `useScrollProgress` removed
(the old pinned title page is gone). fonts.ts (fontsource inter +
noto-serif-kr) unchanged. meta.json slug/no/aesthetic/techniques unchanged.
