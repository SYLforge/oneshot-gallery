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
BOUNCE (통통) — a tiny story studio in Mapo, Seoul that makes picture
books, story apps, and small games for the under-seven crowd. The page
is the studio's own personality: everything on it is made of rubber.
Aesthetic: playful-pop (2nd of 3 in the family; the 1st is STICKER, a
draggable-sticker page — you MUST be visually and behaviorally distinct:
reactive-spring, NOT draggable). Stack: Next.js App Router client page
("use client"), React 19, TypeScript strict, vanilla CSS (classes
prefixed bounce-), vanilla JS animation, zero npm dependencies. THEME
IS LIGHT.

PALETTE (CSS custom properties on .bounce-root): butter #fdf2c9 (page),
cream #fff8e6 (lightest wash), sky #bfe3ff, peach #ffd0b0, grape #d9c2ff
(card surfaces), cloud #ffffff, ink #3a2a4d (all primary text + outlines,
8.1–13.0:1 AAA on every pastel), ink-soft #5b4a6e (secondary text,
4.95:1 AA min), plum #7a4fb8 (accent text, links, wordmark fill, focus
ring — 4.10–5.77:1 AA; 3.60:1 large-only on grape), accent #ff8a5c (the
CTA surface + spring blush — NEVER text, 1.45–2.32:1 as text; carries ink
type at 5.59:1). Custom ::selection (plum bg, cream text) scoped to root.
Softness is the only texture: rounded everything (12px chips → 28px cards
→ 999px pills/blobs), soft offset drop-shadows built from layered ink-alpha
steps (0 3px 0 rgba(58,42,77,.10), 0 10px 22px rgba(58,42,77,.14)) — no
blur, no gradients, no grain. 3px ink outlines on every pressable thing so
the squash has an edge.

TYPE: Fredoka (Latin display + body, chunky rounded sans) + Gaegu (every
Hangul, hand-drawn rounded Korean face) via next/font/google in fonts.ts
with literal configs. Stack Fredoka → Gaegu so Hangul falls through with
no markup; :lang(ko) pins Gaegu, weight 700, word-break keep-all, its own
line-height.

VOICE: Korean-first, warm, a little silly, never babyish. Onomatopoeia
is load-bearing — 통통 (boing boing) is the whole brand. ~15 lines of
real bilingual microcopy, KO leading, EN as the supporting line. "통통
튀는 이야기 / BOUNCE — stories that boing" / "종이 위에서 통통. 화면 위에서도
통통." / "또 놀러와요 / come bounce again". Banned words: cute,
educational, content. The English is never a word-for-word translation.

THREE REACTIVE TECHNIQUES (declare exactly these in meta.techniques;
NONE draggable):
1. spring-press — buttons AND cards squash-and-stretch on press via spring
   physics. Press → scale(1.12, 0.82) in ~1 frame (wide and short); release
   → critically-underdamped spring back to 1 (stiffness 380, damping 14,
   mass 1, ~6% overshoot, settles ~520ms). Semi-implicit Euler integration,
   dt clamped to 48ms. Writes ONLY transform (scale + small translateY).
2. char-split-reveal — headline letters bounce in one-by-one with overshoot
   on reveal. Accessible split: container carries aria-label, animated
   spans are aria-hidden. Per-glyph translateY(34px→0) + scale(.5→1) via
   underdamped spring (320 / 12 / 1), staggered 55ms/glyph, triggered by
   IntersectionObserver.
3. pointer-parallax — soft pastel background shapes (blobs, stars, clouds,
   all inline SVG) drift toward the pointer: --bounce-px/py (−1…1) lerp
   toward pointer × depth factor 0.04–0.18, capped ±30px; plus idle bob
   ±6px on mutually-prime 4.6–9.8s periods so the field is alive without
   a pointer. Fine pointers only; touch falls back to idle bob.

STRUCTURE (single scroll):
1. FloatingShapes (background, aria-hidden, fixed, pointer-events none) —
   3 depth layers of pastel SVG shapes drifting toward pointer + bobbing.
2. Hero — giant bouncing wordmark: 통통 (Gaegu, plum) above BOUNCE (Fredoka,
   ink); glyphs spring up one-by-one. Korean-first lede, two buttons
   (primary accent CTA + cream ghost), a "눌러보세요 press me →" hint that
   bobs. The primary CTA is spring-press.
3. SpringCards ("하나 · on the shelf") — a grid of 4 picture-book cards
   (토끼가 통통, 둥둥 로켓, 구름이 말랑말랑, 사과가 콩콩) on sky/peach/grape/
   butter surfaces. Each card bounce-in pops (translateY+scale spring,
   batch-staggered 90ms) on scroll-into-view AND squashes spring-press on
   click. Each card is a focusable <li> with a chunky SVG illustration
   (bunny, rocket, cloud, apple), a Korean age tag, KO title + EN sub,
   and a bilingual blurb.
4. KidsFooter (plum block, white type at 5.77:1) — giant bouncing sign-off
   "또 놀러와요 / come bounce again" (char-split-reveal), a <dl> grid with
   studio address / story time / mailto (the mailto is a spring-press
   pill), and a small legal line.

HARD REQUIREMENTS:
- prefers-reduced-motion: no bounce anywhere — glyphs render at rest, cards
  rest in place, shapes stop drifting and bobbing, buttons keep a tiny
  static press-down only. usePrefersReducedMotion = useSyncExternalStore
  over matchMedia. Everything fully readable, nothing hidden.
- No-JS: fully readable. Gate pre-reveal styles (glyphs hidden before
  bounce, cards waiting below) behind a .bounce-js class added on mount;
  without it everything sits in its resting state.
- Zero npm deps. next/font/google only.
- AA contrast for all functional text (ink 8.1–13.0:1, ink-soft 4.95:1+,
  plum 4.10–5.77:1; accent #ff8a5c is surface-only, never text; white on
  plum footer 5.77:1).
- Every rAF loop pauses offscreen (IntersectionObserver) and when the tab
  is hidden (visibilitychange). dt clamped to 48ms everywhere.
- transform/opacity animations only; no console errors; no canvas, no
  images (all SVG/CSS). Media budget 0.
- Keyboard: every interactive element reachable, visible custom
  :focus-visible (3px plum ring, cream on the plum footer). Cards are
  focusable <li>; the CSS :active fallback covers keyboard activation.
- Touch: pointer-parallax is fine-pointer only (matchMedia hover+fine);
  touch devices get the idle bob instead. Nothing essential on hover.
- Korean-first bilingual throughout; Gaegu never falls through to system.
- Composed at 360px (stacked buttons, single-column shelf) and 1440px+.
- On mount: window.parent?.postMessage({ type: "oneshot:ready",
  slug: "bounce" }, "*").

FILES: page.tsx (default export, applies font variables + bounce-root,
adds .bounce-js on mount, posts oneshot:ready), components/ (Hero,
SpringCards, FloatingShapes, KidsFooter), hooks/ (useSpringPress — the
spring-press behaviour, useBounceReveal — char-split + card-pop on
intersection, usePointerParallax, usePrefersReducedMotion), styles.css,
fonts.ts. Relative imports only — no @/ aliases, no imports from other
entries.

DISTINCTION (state this in one sentence in any family-cap note): STICKER
is grabbable/draggable (you act on the world); BOUNCE is reactive/springy
(the world bounces back at you — you never drag a thing).
```

## Known deviations

- The `spring-press` tag is honored with a real critically-underdamped
  spring (stiffness 380, damping 14), the opposite of BLUNT's deliberate
  anti-easing (0ms/90ms linear). The aesthetic is different: rubber, not
  a rubber stamp. The squash on press is `scale(1.12, 0.82)` (wide and
  short) and the release overshoots ~6% — documented under that tag in
  the breakdown.
- `pointer-parallax` here drives background shapes, not layered scene
  depth over content (as in SUP). The shapes are decorative SVG; there
  is no foreground parallax, no canvas — the technique is deliberately
  lighter to keep the page feeling like a flat picture book with floating
  balloons, not a 3D diorama.
- `char-split-reveal` uses a per-glyph underdamped spring (translateY +
  scale) rather than the more common opacity+translateY tween, so each
  letter *boings* in with overshoot instead of fading up — the bounce is
  the whole point of the page.
- The card press uses the same spring as buttons but the keyboard
  `:active` path (and the reduced-motion path) falls back to a static
  CSS `scale(1.06, 0.9)` press-down with no oscillation, because the JS
  spring is pointer-event driven and keyboard activation deserves a
  defined, instant response.
- The footer's giant "또 놀러와요" uses char-split-reveal, but because the
  glyphs land on a plum surface the spring-written inline `transform`
  works identically — the only concession is a CSS rule keeping the
  glyph color cream at rest so the split never flashes dark-on-plum.
- Accent orange `#ff8a5c` is the meta `accent` (the demo's card-framing
  color) because it is the most identifiable BOUNCE hue, even though it
  is surface-only on the page; plum does the accent-TEXT job.
