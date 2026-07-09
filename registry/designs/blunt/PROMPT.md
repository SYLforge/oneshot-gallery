---
provenance: distilled-recipe
model: claude-fable-5
harness: Claude Code
date: 2026-07-10
attempts: 1
verification:
  status: unverified
---

The prompt below is a distilled recipe: the full brief this entry was built
from, compressed to what a strong model needs to regenerate a comparable
page in one shot.

```text
Build a complete, art-directed landing page for a fictional brand:
BLUNT — a two-person risograph print co-op in a Euljiro alley, Seoul, that
hates minimalism and prints LOUD. The page is their shop front / manifesto.
Aesthetic: neo-brutalist. Stack: Next.js App Router client page
("use client"), React 19, TypeScript strict, vanilla CSS (classes prefixed
blunt-), vanilla JS animation, zero npm dependencies. THEME IS LIGHT.

PALETTE (CSS custom properties on .blunt-root): paper #f2ede1, ink black
#101010, acid yellow #ffd02f, riso blue #2536ff, fluorescent red #ff4b33.
Overprint logic: where colored elements overlap, use mix-blend-mode:
multiply so they darken like real riso ink layers. Fluorescent red only
measures ~2.9:1 on paper — never let it carry functional text; use it as
plates, stamps, and surfaces under ink type (5.7:1). Custom ::selection
(acid yellow bg, ink text) scoped to the root. Paper grain: one static
full-viewport feTurbulence rect (fractalNoise, ~0.8 base frequency, alpha
scaled to ~0.1) multiplied over everything.

TYPE: Archivo Black (Latin display) + Do Hyeon (KR condensed display) +
IBM Plex Mono (labels/annotations) via next/font/google in a fonts.ts with
literal configs. Stack Do Hyeon after both Latin faces so every Hangul
glyph on the page falls through into it — the shop hand-letters everything
in one condensed gothic.

VOICE: all-caps deadpan, KO/EN slammed together, ~15 lines of real
microcopy. Register: "WE PRINT LOUD. 조용한 건 안 찍음." / "TWO COLORS.
THAT'S IT. 두 도수면 충분하다." / "POSTER B2 — ₩12,000 — SMELLS LIKE INK
잉크 냄새 포함". The Korean carries the humor natively — transcreation,
never translationese.

STRUCTURE (single scroll, 5 sections):
1. Hero — massive stacked wordmark BLUNT / PRINT WORKS (Archivo Black,
   clamp huge, line-height 0.82) with a misregistered riso shadow: blue
   and fluorescent-red copies offset under the ink layer via CSS pseudo
   elements (content: attr(data-text) / "" so they are silent to screen
   readers), mix-blend-mode: multiply. Once per 8.4s the plates stumble
   for ~2 ticks (JS-gated, dead under reduced motion). KR subline
   "을지로 리소 인쇄소" in Do Hyeon. A stamp-looking badge "SINCE 2019 ·
   무광 전문" rotated -3deg (red double ring, ink text). One CTA with the
   hard-shadow press.
2. Marquee band — two full-width slogan tickers (mono, uppercase, 3px
   rules, row B on acid yellow) running in OPPOSITE directions. Page
   scroll direction reverses both (down: A left / B right; up: flip);
   scroll velocity feeds their speed; the signed speed reaches its target
   through an exponential lerp so a flip skids instead of teleporting.
   Moving rows aria-hidden, slogans delivered once in a visually hidden
   paragraph. Reduced motion: static rows.
3. Sticker board (signature) — a bordered work table (riso-blue
   cutting-mat grid) scattered with 10 draggable stickers, all CSS/SVG,
   no images: smiley, chunky arrow, 급함 rush tag, barcode, 쾅! burst,
   price tag, riso-blue halftone circle, WET INK 잉크 조심 label, 무광 OK
   round stamp, a two-dot overprint test. Pointer drag with hand-rolled
   inertia: velocity sampled on release, friction 0.93 per normalized
   frame, rotation from a faked torque (release velocity × grab offset),
   restitution 0.45 off the edges, bodies sleep below 0.004 px/ms and the
   rAF loop stops. Physics state is a DELTA from the CSS-scattered base
   positions so the no-JS page shows the same mess, just still. Stickers
   stack z-index on grab; solid-ink stickers multiply, paper decals stay
   opaque; hard drop-shadows (offset, zero blur). Keyboard: every sticker
   focusable, arrows nudge 10px, Enter/Space lifts to top, visible focus
   ring. Touch works (pointer events + touch-action none). Reduced
   motion: placement without glide. Caption: "DRAG THE MESS. 어지르세요."
4. Price list — a real <table> with explicit ARIA roles so it can re-grid
   to stacked cards at 640px without losing table semantics. 3px rules,
   alternating paper/acid-yellow rows, ~7 deadpan KO/EN items priced in ₩,
   one row struck through (3px red line-through) with a rotated
   "SOLD OUT 매진" stamp. Rows take a 3px press nudge on :active.
5. Footer printed in reverse — ink block, paper type: giant "COME PRINT
   WITH US 와서 찍어", fictional Euljiro address, hours "12:00–20:00 ·
   CLOSED WHEN RAINING 비 오면 쉼", yellow mailto button, "© 2026 BLUNT
   PRINT WORKS — MADE OF INK AND SPITE. 잉크와 깡으로 만듦."

SPRING-PRESS, MINUS THE SPRING (document honestly): buttons carry a 6px
hard shadow; :active translates the element INTO the shadow
(translate(6px,6px), shadow collapses to 0) with transition-duration 0ms
on press and a 90ms LINEAR snap-back on release. No cubic-bezier, no
bounce — a rubber stamp, not a spring.

HARD REQUIREMENTS:
- prefers-reduced-motion: marquees static, no sticker inertia, no
  misregistration twitch, everything readable. usePrefersReducedMotion =
  useSyncExternalStore over matchMedia.
- Fully usable at 360px; composed at 1440px+. Touch fallbacks throughout.
- Keyboard reachable everything; custom :focus-visible (3px ink ring,
  riso blue on yellow surfaces, paper on the ink footer).
- AA contrast for all functional text (ink/paper 16.3:1, ink/yellow
  13.0:1, blue/paper 5.9:1; red is display-only).
- Content visible without JS: gate JS-dependent styles behind a .blunt-js
  class added on mount.
- transform/opacity/filter animations only; no console errors; no canvas.
- On mount: window.parent?.postMessage({ type: "oneshot:ready",
  slug: "blunt" }, "*").

FILES: page.tsx (default export, applies font variables + blunt-root),
components/ (Hero, MarqueeBand, StickerBoard, PriceList, ShopFooter),
hooks/ (usePrefersReducedMotion, useScrollEnergy), styles.css, fonts.ts.
Relative imports only.
```

## Known deviations

- Fluorescent red `#ff4b33` measures ~2.9:1 on paper, so it never carries
  functional text: it works as a misregistration plate, stamp frames, and
  surfaces under ink type (5.7:1). The SOLD OUT stamp is ink type in a red
  frame, not red type.
- The `spring-press` tag is honored with no spring at all: 0ms in, 90ms
  linear out. The anti-easing is the point and is documented under that tag
  in the breakdown — squash-and-stretch would betray the aesthetic.
- The sticker physics is a point mass with a faked torque (release velocity
  crossed with the grab offset), not a rigid-body simulation. It reads
  right; it would not survive a physics exam.
- Price-list rows take a 3px press nudge without the shadow collapse — a
  `<tr>` cannot carry the hard shadow cleanly across table layout, so the
  full press is reserved for the two buttons.
- Overprint multiply is selective on the sticker board: solid-ink stickers
  multiply, but paper-backed decals (price tag, barcode, wet-ink label)
  stay opaque, because a real paper sticker occludes what it lands on.
- The wordmark misregistration is animated (one ~2-tick stumble per 8.4s)
  even though the brief only required the static offset; it dies under
  reduced motion and without JS.
