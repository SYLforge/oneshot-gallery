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
Build a complete, art-directed landing page for a fictional brand:
MEMPHIS (멤피스) — a two-person postmodern design-studio portfolio in
Seongsu-dong, Seoul, that builds brand systems the way Sottsass drew
chairs in 1981: shapes first, justification second, but the justification
is real. The page IS their portfolio — a shape explosion, a manifesto
marquee, a project grid that FLIP-rearranges on filter. Aesthetic:
tactile-craft (Memphis/postmodern 80s). Stack: Next.js App Router client
page ("use client"), React 19, TypeScript strict, vanilla CSS (classes
prefixed mp-), vanilla JS animation, zero npm dependencies. THEME IS LIGHT.

PALETTE (CSS custom properties on .memphis-root): paper #f7f2e8 (warm
off-white), ink #1a1a1a, teal #2bb1a8, coral #ff6b8a, marigold #ffc933,
cobalt #3a5fcd, plum #6a3b8a. Contrast discipline: ink holds 6.4–15.6:1 on
every warm surface (teal/coral/marigold/paper). Teal as TEXT on paper is
only 2.4:1 → teal is decorative/surface only, never text. Cobalt surfaces
carry WHITE type (5.68:1 AA), never ink body (3.07:1); cobalt AS text on
paper is 5.1:1 AA. Project tiles tint the cream background with 12–22% of
their tone via color-mix so the surface stays above AA while reading as the
project's color. Custom ::selection (coral bg, ink text). Paper tooth: one
static full-viewport feTurbulence rect (fractalNoise, baseFrequency 0.9,
alpha scaled to 0.08) multiplied over everything at opacity 0.45.

TYPE: Space Grotesk (Latin display + body, weights 300/400/500/700) +
Black Han Sans (every Hangul, weight 400 — already heavy geometric) via
next/font/google in a fonts.ts with literal configs. Display stack ends in
Black Han Sans so every Hangul glyph falls through into it; :lang(ko) pins
it and zeroes tracking. The Korean voice is as loud and geometric as the
Latin.

VOICE: declarative Korean-first headlines with English as a shorter
uppercase subtitle, ~15 lines of real microcopy. Register: "형태는 자유롭게,
규칙은 단단하게." / "다섯 색. 그 이상도, 그 이하도 아름." / "도형마다 할 일이
있다." The Korean carries the manifesto natively — transcreation, never
translationese.

THREE TECHNIQUES (each is the headline of a section):
1. clip-path-reveal — Memphis shapes (blobs/zigzags/arches/squiggles) wipe
   in via geometric clip-path cuts on scroll-in (inset from varying
   directions + circle(0%) for dots), 620ms cubic-bezier(0.16,1,0.3,1),
   staggered 70ms via a per-target --mp-delay. Squiggles also stroke-draw
   via stroke-dashoffset (data-mp-squiggle, 900ms). Pre-reveal state is
   gated behind a .memphis-js root class so without JS nothing is hidden.
2. pointer-parallax — a fixed field of Memphis shapes in three depth layers
   (far/mid/near) drifts toward the pointer. A hook sets --mp-x/--mp-y
   (−1…1, lerped 0.06/frame, fine-pointer + hover only) on the field root;
   styles.css multiplies by depth (8/16/26px) so nearer shapes follow more.
   Each shape also bobs on a mutually-prime idle period (4.6–9.8s) so the
   field is alive on touch. Decorative: aria-hidden, pointer-transparent.
3. flip-layout (signature) — a project grid that FLIP-rearranges on filter.
   Six projects, four filters (전체/All, 브랜드/Brand, 인쇄/Print, 공간/Space).
   On filter change: snapshot each tile's rect (First) in a layout effect,
   let React swap the DOM (Last), apply the inverse delta as transform
   (Invert), then transition it to identity (Play) over 480ms
   cubic-bezier(0.22,1,0.36,1). Outgoing tiles unmount; incoming tiles
   fade in via a CSS keyframe staggered 50ms per index. The grid stays a
   real <ul>/<li>; filter only changes which render and in what order.

STRUCTURE (single scroll):
1. Hero — MEMPHIS / 멤피스 wordmark (clamp huge, line-height 0.86) over a
   shape explosion: coral blob, marigold squiggle (stroke-drawn on
   scroll-in), cobalt zigzag, teal arch, confetti scatter, spotted-disc
   mark. KR subline "멤피스" in cobalt. Lede: "형태는 자유롭게, 규칙은
   단단하게." Two CTAs with the hard-shadow press.
2. The work (signature) — FLIP project grid as above. Each tile: a tone
   motif (squiggle/blob/zigzag/arch/dot SVG), year, KR tag, bilingual
   title + blurb. Caption: "모든 도형은 SVG, 이미지는 한 장도 없습니다."
3. Marquee band — two full-width manifesto tickers (uppercase, 3px rules,
   row B on teal with ink text) running opposite directions at a constant
   gentle pace. Moving rows aria-hidden, slogans delivered once in a
   visually hidden paragraph.
4. The studio — composed poster: a cobalt panel (carries WHITE type,
   clip-path-revealed from the left) with the principle "우리는 멤피스를
   복고가 아니라 방법론으로 쓴다" beside a numbered rule list (다섯 색 /
   3px 선 / 도형마다 할 일) and a terrazzo-chip row.
5. Footer — ink block with a last shape scatter: giant bilingual "함께
   형태를 만들자 / let's build a shape", fictional Seongsu address,
   hours "11:00–19:00 · 월요일 쉼", marigold mailto CTA, "© 2026 MEMPHIS
   STUDIO — 도형으로 지은 이름."

PRESS GESTURE (document honestly): buttons + filter chips carry a 5px hard
shadow; :active snaps INTO the shadow (translate(5px,5px), shadow collapses
to 0) with transition-duration 0ms on press and a 140ms
cubic-bezier(0.22,1,0.36,1) overshoot on release. A shape being pressed
flat, not a spring.

HARD REQUIREMENTS:
- prefers-reduced-motion: parallax drift off, field+footer shapes static,
  clips fully open, squiggles fully drawn, grid swaps instantly (no FLIP
  play), marquees static, everything readable. usePrefersReducedMotion =
  useSyncExternalStore over matchMedia.
- Fully usable at 360px; composed at 1440px+. Touch fallbacks throughout
  (parallax is fine-pointer-only; idle bob carries life on touch).
- Keyboard reachable everything; custom :focus-visible (3px teal ring,
  marigold on the ink footer). Filter chips are real <button> with
  aria-pressed; tiles are focusable <li> with descriptive aria-label.
- AA contrast for all functional text (verified per pairing above).
- Content visible without JS: gate pre-reveal styles behind a .memphis-js
  class added on mount — without it the page is a finished poster.
- transform/opacity/filter/clip-path animations only; no console errors.
- Each rAF loop pauses offscreen (IntersectionObserver) and on hidden tab.
- On mount: window.parent?.postMessage({ type: "oneshot:ready",
  slug: "memphis" }, "*").

FILES: page.tsx (default export, applies font variables + memphis-root),
components/ (Shapes, Hero, ShapeParallax, ProjectFlipGrid, StudioMarquee,
StudioSection, MemphisFooter), hooks/ (usePrefersReducedMotion,
usePointerParallax, useClipReveal), styles.css, fonts.ts. Relative imports
only. Zero dependencies. No images — every shape is inline SVG; budget 0.
```

## Known deviations

- The `pointer-parallax` field is fine-pointer-only (hover + pointer:fine):
  on touch devices the hook no-ops and the shapes bob on their CSS idle
  animation instead, so the field is still alive but does not chase a
  finger. This is a deliberate touch affordance, not a missing feature.
- The `clip-path-reveal` technique uses CSS `clip-path` transitions
  (inset/circle) rather than an SVG mask wipe. The visual is identical — a
  geometric cut opens to reveal the shape — and clip-path is cheaper, but
  the literal mechanism differs from a raster mask. Documented here for
  honesty.
- The `flip-layout` FLIP implementation measures rects in a `useLayoutEffect`
  around React's commit rather than using a library (Framer Motion / GSAP
  Flip). It handles First/Last/Invert/Play by hand; tiles that leave and
  re-enter (e.g. filtering away then back to All) fade in fresh rather than
  remembering a prior position, because the React key unmounts them. This is
  the common FLIP-in-React trade-off and reads as a clean re-enter.
- The marquee runs at a constant gentle pace and does NOT couple to scroll
  velocity (unlike the sibling `blunt` entry). Memphis maximalism already
  has a lot of motion; a velocity-coupled ticker competed with the parallax
  field, so the marquee was made calm. The `marquee` technique tag is not
  claimed in meta.json for this reason — only the three named techniques are.
- Project tile tone tints use `color-mix(in srgb, …)` to pale-wash the
  project color over cream. `color-mix` is widely supported in 2026 evergreen
  browsers; if it is absent the tile falls back to the cream background (the
  text stays AA either way, since the tint is decorative).
- The wordmark does not carry a misregistration/twitch (that is `blunt`'s
  riso signature); MEMPHIS keeps its type crisp. The Memphis personality
  lives in the shapes and the FLIP, not in printed-plate offsets.
