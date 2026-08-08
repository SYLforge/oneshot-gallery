# CHAPTER — design spec

## Identity
시간의 책, The Book of Hours — an editorial-serif entry that sets a day as a
book of six hours. The third editorial-serif, distinct from YEOBAEK (quiet,
airy, literary) and ZINE (loud, dense, photocopied). Here the page *is* the
book: a frontispiece, six pinned spreads that crossfade like turning a page,
and a colophon that sets the book down.

## Structure
- `page.tsx` — orchestrator only: root ref + reveal ref + three leaves.
- `components/TitlePage.tsx` — sticky frontispiece; char-split-reveal glyphs.
- `components/ChapterSpreads.tsx` — the signature moment: pinned, scrubbed,
  crossfading spreads (opacity + hairline scale, never layout).
- `components/ChapterSpread.tsx` — one leaf: drop cap + prose + marginalia.
- `components/Colophon.tsx` — the publisher's ledger, a real book's last page.
- `components/chapters.ts` — six hours, each 4–6 sentences of Korean prose
  with a unique marginalia note.
- `hooks/useChapterProgress.ts` — writes `--chapter-spread` (0→1, lerped) and
  `data-spreadstate` (0..5) to the sticky stage from scroll position.

## Signature moment
펼쳐지는 책 페이지. The spreads section is `(CHAPTERS + 1) × 100vh` tall; its
inner sticky stage holds the book open while you scroll. Exactly one spread
matches `data-spreadstate` at a time — a clean crossfade, no fragile float
math. The page genuinely *turns*: each spread holds, dissolves into the next,
and the editorial frame never moves.

## Accessibility
- Reduced motion: static. The cover glyphs settle; reveals present; the
  crossfade stays live (it tracks the wheel 1:1 — only the lerp is bypassed,
  because it is a *reveal* of already-present content, not motion).
- No-JS: fully readable. Every spread, marginalia, and the colophon are in
  the DOM in source order; the first spread shows, the rest are a static list.
- AA contrast on every ink token; decorative red is large/ornamental only.
- Korean-first bilingual, `:lang(ko)` gets its own line-height (1.9) and
  keep-all breaking.
