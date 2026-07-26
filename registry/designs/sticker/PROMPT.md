---
provenance: distilled-recipe
model: builtin:zai-coding-plan/GLM-5.2
harness: zcode-cli
date: 2026-07-18
attempts: 1
verification:
  status: unverified
---

The prompt below is a distilled recipe: the full brief this entry was built
from, compressed to what a strong model needs to regenerate a comparable page
in one shot.

```text
Build a complete, art-directed landing page for a fictional brand:
STICKER (스티커) — a playful design studio in Seoul whose entire website is
built from draggable, springy stickers. The user can grab any sticker and
fling it; it springs back home with a bouncy wobble, or shoves its neighbors
into a pile if dropped on them. Aesthetic: playful-pop. Stack: Next.js App
Router client page ("use client"), React 19, TypeScript strict, vanilla CSS
(classes prefixed sticker-), vanilla JS animation, zero npm dependencies.
THEME IS LIGHT.

PALETTE (CSS custom properties on .sticker-root): warm white ground #fef8ee
(the desk), ink #1a1a1a (chunky outlines + all functional text), and six
saturated sticker colors — tangerine #ff7a45 (lead/brand accent), sky #5ec5ff,
lime #9ade54, grape #a06bff, lemon #ffd84d, bubble #ff5fa2 — plus a deeper
tangerine #bf421a used wherever the accent must function as TEXT on the
ground (4.96:1). Contrast rule: ink text passes AA on EVERY sticker fill
(6.1:1–10.7:1 across the palette), so the universal functional-text pattern
is ink-on-saturated-sticker. White text fails on all of them — display only.
Custom ::selection (sky ground, ink text) scoped to the root. Paper warmth:
one static full-viewport feTurbulence rect (fractalNoise, baseFrequency 0.9,
2 octaves, seed 3, alpha ~0.05) multiplied over everything, plus a faint
radial-dot backing-sheet pattern on the board.

TYPE: Black Han Sans (Korean display — the wordmark 스티커, section titles,
the giant footer shout) + Gaegu (everyday Korean — captions, sticker labels,
the notebook-hand voice) + Fredoka (English voice — subtitle, English labels,
marquee) via next/font/google in a fonts.ts with literal configs. Each face
requests the `latin` subset (Hangul glyphs ride the font file's own CJK
coverage, which next/font preserves). The family stack ALWAYS lists the
Korean face first; a :lang(ko) rule pins it so Hangul never falls through.

VOICE: bilingual, KOREAN-FIRST, ~15 lines of real microcopy. Register:
"우리는 스티커를 만들어요. We make things that stick." / "잡고, 던지고, 통통
튀는 웹사이트. Grab it. Fling it. Watch it bounce home." / "11:00–19:00 ·
커피가 끓으면 시작 WE START WHEN THE COFFEE'S READY". The Korean carries the
warmth natively — transcreation, never translationese. Stickers themselves
carry Korean-first copy: 초록 READY, 괜찮아 it's ok!, 비밀 top secret, 완료
DONE!, 안녕! hi, 좋아.

STRUCTURE (single scroll, 3 body sections + hero + footer):
1. Hero — the shout. The wordmark 스티커 / STICKER styled as the biggest
   sticker on the desk (tangerine fill, 4px ink outline, double offset solid
   shadow), rotated -3deg, floating center-stage. Around it, a small pile of
   draggable accent stickers at three parallax depths (lime READY pill, sky
   star, bubble heart, tangerine 뿅! burst) — the hero IS a miniature sticker
   board, you can grab these too. Pointer movement pushes layers at different
   rates (depth 0.04/0.08/0.14/0.20), lerped and capped ±18px. Bilingual
   shout "우리는 스티커를 만들어요. We make things that stick." with a lemon
   highlight. A grape CTA button "스티커 만지기 · PLAY WITH THEM". A lemon
   round "EST. 2024 · 접착력 좋음" badge.
2. Service marquee — two full-width tickers (row A: disciplines on sky, row B:
   adjectives on tangerine) running in OPPOSITE directions. Page scroll
   direction reverses both; scroll velocity feeds their speed through an
   exponential lerp so a flip skids, not teleports. Moving rows aria-hidden;
   every word delivered once in a visually hidden paragraph. Reduced motion:
   static rows.
3. Sticker board (SIGNATURE) — a bordered rounded desk (faint dot-grid backing)
   scattered with 11 draggable stickers, all CSS/SVG, no images: the studio
   logo (스티커 studio), 괜찮아 it's ok! stamp, 비밀 top secret, 5/5 star
   rating, a taped handwritten note (오늘의 할 일: 웹사이트를 스티커로 만들기),
   a coffee cup, a THIS-WAY arrow, 완료 DONE!, a 좋아 heart, a barcode, and an
   안녕! hi speech bubble. Pointer drag with SPRING physics: on release each
   sticker is pulled home (0,0) by an underdamped spring (k=0.18, c=0.40,
   semi-implicit Euler in normalized-frame space — settles in ~590ms with two
   visible bounces), initial fling velocity decays through friction 0.92 then
   hands off to the spring, rotation faked from grab-offset × release-velocity
   torque, restitution 0.4 off edges, and SOFT-CIRCLE pile-up: a released
   sticker shoves resting neighbors within 1.1× combined radius by 0.35 of
   the overlap so they settle into a pile. Release velocity capped at 2.2
   px/ms. Physics state is a DELTA from CSS-scattered base positions so no-JS
   shows the same pile, just still. rAF loop self-terminates when every body
   sleeps (below 0.004 px/ms); pauses on hidden tab. Stickers stack z-index
   on grab. Keyboard: every sticker focusable, arrows nudge 10px (spring
   pulls home), Enter/Space lifts to top, visible focus ring. Reduced motion:
   every release is a placement, snap home, no nudge.
4. Footer — the back of the sticker sheet, INK GROUND (palette inverts). Giant
   "같이 붙여요 STICK WITH US" (Korean in tangerine), grid of FIND US / HOURS /
   TALK (fictional Mapo address, "11:00–19:00 · 커피가 끓으면 시작", a grape
   mailto button), sign-off "© 2026 STICKER STUDIO — 접착제와 장난으로 지음.
   BUILT WITH GLUE AND A SENSE OF HUMOR."

PRESS FEEDBACK: stickers scale(0.94) on :active, 90ms in / 120ms out with
ease-back cubic-bezier(0.34,1.56,0.64,1) — a tiny overshoot, a sticker
squished under a thumb. Buttons translate(0,4px) + shadow collapse.

REVEAL: sections with [data-sticker-reveal] start opacity 0 / translateY(24px)
under .sticker-js, gain .is-revealed on IntersectionObserver, 700ms ease-back,
90ms stagger — a sticker being peeled up.

HARD REQUIREMENTS:
- prefers-reduced-motion: tickers static, no sticker inertia (releases snap
  home), no parallax, reveal-hide undone (nothing left invisible). All via
  usePrefersReducedMotion (useSyncExternalStore over matchMedia) + a CSS block.
- Fully usable at 360px; composed at 1440px+. Touch fallbacks throughout
  (pointer events + touch-action none on stickers).
- Keyboard reachable everything; custom :focus-visible (3px ink ring — the
  only ring that clears 3:1 UI threshold on every surface; tangerine on the
  ink footer).
- AA contrast for all functional text: ink/ground 16.5:1, ink/tangerine 6.7:1,
  ink/sky 9.0:1, ink/lime 10.7:1, ink/grape 5.0:1, ink/lemon 12.6:1,
  ink/bubble 6.1:1, tangerine-deep/ground 4.96:1. White-on-saturated is
  display-only.
- Content visible without JS: gate JS-dependent styles behind a .sticker-js
  class added on mount; the sticker scatter is CSS.
- transform/opacity/filter animations only; no console errors; no canvas.
- On mount: window.parent?.postMessage({ type: "oneshot:ready", slug:
  "sticker" }, "*").

FILES: page.tsx (default export, applies font variables + sticker-root),
components/ (Hero, ServiceMarquee, StickerBoard, StudioFooter), hooks/
(useStickerPhysics, usePointerParallax, useReveal, usePrefersReducedMotion),
styles.css, fonts.ts. Relative imports only.
```

## Known deviations

- The spring is a point-mass semi-implicit Euler integrator in normalized-frame
  space, not a rigid-body simulation. It reads right and is unconditionally
  stable; it would not survive a physics exam. Torque is faked from the grab
  offset crossed with release velocity (the same honest lie blunt's board
  tells).
- "Pile-up" is a soft-circle overlap push (0.35 of the overlap transfers to
  the neighbor), not a real collision solver. Stickers shove each other and
  the spring pulls them back; they do not stack rigidly or conserve momentum
  honestly. The effect reads as a pile; the physics is a kindness, not a law.
- The hero wordmark sticker is `pointer-events: none` (it floats, it is not
  draggable) — making it draggable fought with the parallax transform on its
  ancestors and produced a jumpy grab. The decals around it ARE draggable.
- Two hero decals (lime READY, sky star) hide below 480px to keep the
  wordmark legible on the narrowest screens; the rest of the pile reflows.
- The accent tangerine `#ff7a45` measures 2.5:1 on the ground, so it never
  carries functional text or a focus ring on the ground — `tangerine-deep
  #bf421a` (4.96:1) does that job. Tangerine is a sticker fill, the wordmark
  surface, and a ring color on the ink footer only.
- `spring-press` is NOT one of the three declared techniques (drag-physics,
  pointer-parallax, marquee are); the press feedback exists as supporting
  motion and is documented under drag-physics in the breakdown.
