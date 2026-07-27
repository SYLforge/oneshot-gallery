---
provenance: distilled-recipe
model: glm-5.2
harness: ZCode CLI
date: 2026-07-18
attempts: 1
verification:
  status: unverified
---

The prompt below is a distilled recipe: the full brief this entry was built
from, compressed to what a strong model needs to regenerate a comparable
page in one shot.

```text
Build a complete, art-directed page for a fictional publication:
잡지 ZINE — The Photocopy Underground, No. 32. A bilingual (KO-first)
independent punk-culture zine that reads like a photocopied collage. This
is the MAXIMALIST editorial register — dense, layered, loud — and is the
deliberate opposite of the gallery's other editorial-serif entry (YEOBAEK,
a quiet airy literary journal). Where that entry spends emphasis as
whitespace, this one spends it as density. Theme is light (newsprint
cream). Aesthetic: editorial-serif. Stack: Next.js App Router client page
("use client"), React 19, TypeScript strict, vanilla CSS (classes prefixed
zine-), vanilla JS animation, zero npm dependencies, no raster images
(SVG halftone "photos" only).

PALETTE (CSS custom properties on .zine-root): newsprint #f4f0e6 page,
ink #1a1a1a text (14.6:1), ink-soft #4a4640 secondary (8.7:1), highlighter
#fff44f as DECORATIVE ONLY (the marker stroke behind pull quotes, drop cap,
dek — 2.3:1 as text so it NEVER carries a word alone; text on yellow stays
ink, reading as 14.8:1 ink-on-yellow), stamp #c1272d for folios/kickers/
the rubber stamp/focus ring (5.7:1, large/bold only). Derived: rule-faint
ink@22% for photo frames, tape-cream newsprint@66% for translucent tape.

TYPE: Oswald (condensed Latin display — masthead EN, headlines, folios,
kickers, the marquee band, bylines) + Noto Serif KR (every Hangul glyph:
masthead 잡지, all essays, marginalia; weight 400/500/700/900) via
next/font/google in a fonts.ts. Body stack Noto Serif KR first so Hangul
and Latin serif both resolve there; display elements get Oswald by class.
Style :lang(ko) explicitly (Noto Serif KR, word-break: keep-all, line-height
1.72, -0.005em tracking). Korean is first-class — natural word order,
transcreated (never translationese).

VOICE: declarative, loud, unsentimental, concrete (always a machine:
copier, riso, stapler, cassette). KO sentence first, EN answer after.
Write 12+ lines of real manifesto copy about why an independent press still
folds paper — e.g. "종이를 접고, 복사기를 두드리고, 한밤중에 스테이플러를
누른다. / Fold the paper, pound the copier, press the stapler at
midnight." Punk-zine register, Maximum Rocknroll / 독립지 energy. Anchor
it in the material of the press (the riso drum, registration marks, the
staple, the cassette) without sentimentality.

STRUCTURE (single scroll, 5 sections):
1. Hero/masthead — a 2px ink frame inside a 2px page border (a photocopied
   cover). Topline: folio NO. 32 (stamp red), dateline (KO+EN), price.
   Wordmark: 잡지 huge in Noto Serif KR 900 split into aria-hidden spans
   behind an aria-label for a per-glyph reveal (each letter opacity 0→1 +
   translateY(0.5em) + rotate(-4deg) → 0, staggered), with ZINE in Oswald
   700 below it. A 2px ink rule, then a dek with a HIGHLIGHTER swatch
   behind it (mark element, box-decoration-break clone). Lower grid: a KO
   lede, a rotated double-border red RUBBER STAMP ("PHOTOCOPIER /
   복사기는 총이다"), and an EST. mast line. Bottom: a begin-reading anchor.
2. Marquee band — a single ticker between 2px ink rules on a HIGHLIGHTER
   background, running the zine's production credits in KO+EN separated by
   stars. REVERSES with scroll direction and speeds up with scroll velocity
   (dir·−speed, dt-normalized lerp, capped); rAF translate3d with the
   offset wrapped across 4 identical groups so the seam is invisible.
   IntersectionObserver starts/stops the loop. The moving row is
   aria-hidden; credits delivered once in a visually-hidden paragraph.
3. Lead essay — the editor's note. Multi-column running text: TRUE CSS
   column-count: 2 at ≥940px with a 1px ink column rule (the dense
   newsprint register). KO paragraphs lead (Noto Serif KR 500, line-height
   1.74), EN deks answer (Oswald 400, ink-soft, 0.92em). DROP CAP on the
   opener: a wrapped span glyph (not ::first-letter) at 3.6em on a
   highlighter swatch, rotated -2deg. A PULL QUOTE dropped between the
   columns: stock-paper background, 4px ink left border, one clause
   flagged with a highlighter mark. MARGINALIA: 3 pinned annotation cards
   (※ marker, stamp-red) in a 13rem margin rail at ≥1080px, each with a
   2px hard offset shadow and a slight rotation; fold beneath the column
   on narrow viewports.
4. Article grid — the zine's dense core. Six features in a 1→2→3 column
   wall (620/1040px) with 1px ink hairline frames and a 3px 3px 0 ink hard
   offset shadow per card. Each card: a clip-path-revealed HALFTONE
   "photo" (SVG dot field — a grid of circles whose radius grows toward a
   radial mask center so it reads as a newsprint duotone; cream shows
   through gaps; 6 variants: stage/riso/crowd/wall/tape/flyers), held on
   with translucent cream TAPE strips rotated -32deg at two corners, the
   whole photo rotated ±1-3deg for misregistration. Plus kicker (stamp
   red), bilingual headline, dek, byline. The clip-path wipe direction
   VARIES per card: left-to-right (inset 0 100% 0 0), right-to-left,
   top-to-bottom, and DIAGONAL (polygon). Photo wipes 760ms, body fades in
   180ms later.
5. Colophon — dense masthead-style ledger (publisher, editor-in-chief,
   editors, print, run, type, subscribe mailto) with 1px ink row borders,
   the zine's manifesto line, "© 2026 잡지 — 화면은 꺼진다. 종이는 남는다.
   The screen goes dark. The paper stays.", back-to-cover link.

LINKS everywhere get a HIGHLIGHTER-STROKE underline (deliberately distinct
from the editorial-serif sibling's ink-stroke draw): a static faint ink
underline always present, plus a yellow bar that slides in (scaleX 0 → 1)
on hover/focus through an overshooting bezier. Pure CSS — works without JS.

HALFTONE PHOTOS are SVG only: a function that, given a variant + mask
center, emits a grid of <circle> elements with radius = density² × scale
where density falls off with distance from the mask center. No raster, no
<image>. Each is role="img" with a bilingual aria-label.

HARD REQUIREMENTS:
- prefers-reduced-motion: hero skips choreography, reveals present without
  motion, marginalia present without slide, marquee holds still (hook
  returns early), clip panels fully open (clip-path: none, photos shown),
  link highlighter simply present. usePrefersReducedMotion via
  useSyncExternalStore.
- Touch: marquee is autonomous (drifts on its own, reverses with scroll);
  no hover-only meaning. The highlighter underline's static state is the
  affordance.
- Keyboard: every link reachable; custom stamp-red :focus-visible ring.
- AA: ink 14.6:1, ink-soft 8.7:1, stamp 5.7:1 (large/bold only);
  highlighter is decorative — text on it is ink (14.8:1).
- Content visible without JS: add a .zine-js class on mount and gate every
  pre-reveal / clip-pre state behind it. The zine must read as a finished
  printed document with JS disabled.
- Animate transform/opacity/clip-path only; marquee measured in rAF.
- Custom ::selection (highlighter yellow / ink) scoped to .zine-root.
- On mount: window.parent?.postMessage({ type: "oneshot:ready",
  slug: "zine" }, "*").
- Composed at 360px and 1440px+ (essay single-column below 940px,
  marginalia folds under at 1080px, article wall 1→2→3 at 620/1040px).

FILES: page.tsx (default export, applies font variables + zine-root),
components/ (Hero, MarqueeBand, HalftonePhoto, ArticleGrid, LeadEssay,
ZineFooter, ZineLink), hooks/ (usePrefersReducedMotion, useReveal,
useMarquee), styles.css (all tokens + styles), fonts.ts. Relative imports
only.
```

## Known deviations

- `char-split-reveal` is shared with the editorial-serif sibling (YEOBAEK),
  which the brief explicitly permits. To keep it honest and distinct, ZINE
  applies the per-glyph split to a *two-character Korean wordmark* (잡지)
  with a **punk letter-splice** motion (translateY + rotate(−4°) → 0), not
  the sibling's quiet two-character rise. The drop cap deliberately does
  *not* use the split — it is a wrapped span glyph on a highlighter
  swatch, a collage element rather than a text animation.
- "Multi-column article layout" is delivered as **true CSS `column-count:
  2`** running essay text (the dense newsprint register the brief asks
  for), which is the opposite choice from the sibling entry — there the
  essay is a single measured column plus margin rail, because sticky
  plates don't compose with fragmentation. ZINE has no pinned plates, so
  CSS columns are free.
- The "halftone photo" is an SVG dot field, not a raster. Each panel is a
  hand-tuned function of a radial mask center; the six variants share one
  generator and differ only by mask geometry. This keeps the media budget
  at 0 bytes (no image payload) while still reading as newsprint halftone.
- The marquee is a *single* band (the brief says "a scrolling masthead/
  credits band"), where the project's reference marquee implementation
  (blunt) runs two. One band is enough for a zine masthead and keeps the
  rAF cost to one loop.
- The clip-path reveal uses four direction variants (ltr, rtl, ttb, diag)
  rotated across the six cards so the grid never wipes in lockstep. The
  diagonal variant uses a `polygon()` rather than `inset()` — the
  photocopied diagonal the brief names.
- The drop cap is a wrapped `<span>` glyph on a highlighter background,
  not CSS `::first-letter`, because the highlighter swatch must sit behind
  only the cap (not the whole first line) and the cap must rotate as a
  collage element. The span is `aria-hidden`; the paragraph's full Korean
  text remains readable.
- Stamp red `#c1272d` is 5.7:1 on newsprint — AA for large/bold text only,
  so it is restricted to kickers, folios, the rubber stamp, the link
  separators, and the focus ring, never body copy.
