---
provenance: distilled-recipe
model: glm-5.2
harness: ZCode
date: 2026-07-18
attempts: 1
verification:
  status: unverified
---

The prompt below is a distilled recipe: the full brief this entry was built
from, compressed to what a strong model needs to regenerate a comparable
page in one shot.

```text
Build a complete, art-directed page for a fictional business:
늘어남 STRETCH — A Studio That Breathes. A bilingual (KO-first) yoga &
wellness studio in Seongsu-dong, Seoul, whose site demonstrates what it
teaches: lengthening, breath, calm. The TYPOGRAPHY ITSELF STRETCHES — the
hero wordmark reaches on mount, the pinned pose-sequence elongates each
asana's name vertically on scroll (the way a body extends through a pose),
and breathing-circle backgrounds drift behind it all. This is KINETIC
TYPOGRAPHY, light/calm/breathful — explicitly the OPPOSITE of the family's
1st entry (TYPEWAVE: dark/energetic/strobe). Theme is light (warm
off-white). Stack: Next.js App Router client page ("use client"), React 19,
TypeScript strict, vanilla CSS (classes prefixed stretch-), vanilla JS
animation, zero npm dependencies, no images.

PALETTE (CSS custom properties on .stretch-root, warm and calm — this is
about air, not contrast): paper #f7f3ec page, paper-warm #fbf8f2 for
breath-circle fills, ink #2f2a24 text (12.85:1, AAA), ink-soft = ink at
70% alpha (≈#6b6660, 5.14:1) for secondary text, clay #c97b5a as the BRIGHT
display-only accent (the giant STRETCH wordmark fill, breath ring strokes,
the long pose rail — it is 2.94:1 so NEVER small text), clay-deep #a85e3f
for readable clay (kickers, ordinals, link underlines, focus ring,
::selection bg with ink text — 4.38:1, AA), sage #8a9a7b for RULES ONLY
(2.72:1, never text), sage-deep #5f6f50 for readable sage (the breath cue,
4.90:1). Verify every contrast number; demote any color that fails 4.5:1
when used as text to rules-only and derive a readable variant instead.

TYPE: Noto Serif KR (Korean serif — every Hangul glyph, the wordmark 늘어,
pose names 산·하늘·나무·숨; chosen for vertical metrics that elongate
gracefully under scaleY) + Cormorant Garamond with italics (tall Latin
voice — STRETCH, EN transcreations, captions, ordinals; long ascenders
that stretch well) via next/font/google in a fonts.ts. Stack Cormorant
first so Hangul falls through into Noto Serif KR; also style :lang(ko)
explicitly (Noto Serif KR, word-break: keep-all, leading ~2.0). Korean is
first-class — natural word order, transcreated (never translationese).

VOICE: calm, embodied, KO paragraph then its EN transcreation. Write 12+
lines of real studio copy about lengthening, the breath, the body in a
pose — e.g. "늘어나는 것은 부드러운 일이다. / Lengthening is a soft act."
A yoga teacher's register, not marketing. Anchor it in the body (feet,
spine, arms, the floor, the breath) without wellness cliché. Never say
"energetic", "power", or "transform" — that is the OTHER entry's voice.

STRUCTURE (single scroll, ~3 zones + footer):
1. Cover/Hero — STRETCH huge in Cormorant (split into per-glyph aria-hidden
   spans behind an aria-label for a rise+reach: scaleY 0.78→1.06→1 with a
   ~12% overshoot, per-glyph 90ms stagger), the Korean 늘어 in clay beneath,
   a folio "늘어남 · No. 01 · The Reach", one sage hairline that grows
   (scaleX) on mount, a studio issue line, a begin-the-sequence anchor, a
   one-line epigraph. Vast air — the cover breathes.
2. Pinned pose-sequence — THE SIGNATURE. A tall spacer (~300vh) pins a
   scene for its whole length; four poses each own a 0.25-wide band of the
   overall scroll scrub (--st-scrub, 0→1): 산(山)·Earth, 하늘·Sky,
   나무·Tree, 숨·Breath. Only the active band's pose is visible (opacity
   from scrub distance to band center). The active pose's name WRITES
   ITSELF (per-glyph opacity follows a local scrub with a small stagger)
   and its glyphs ELONGATE VERTICALLY: scaleY = 1 + localScrub×1.8 → up to
   2.8× — the type reaching the way a body reaches in a held pose. A long
   clay rail grows (scaleX = scrub) across the whole sequence with four
   labeled ticks; a breath counter 01/04 sits in the corner. All geometry
   is calc() off the per-pose --st-p0/--st-p1 and the global --st-scrub —
   transform/opacity only; the pin is position: sticky. A slow lerp
   (half-life ≈ 5.4 frames) so lengthening reads as a held breath.
3. Studio footer — the coda: the studio's standing note (KO + EN, "we do
   not break the body; we find the length that was already there"), a
   practical ledger (location Seongsu-dong, hours 06:00–22:00, the four
   daily classes, reserve mailto), and the two working links (reserve,
   back to top), both with a soft clay underline that reaches from the
   left (scaleX 0→1, ease-breathe). Pure CSS. "© 2026 늘어남 — 남은 것은
   숨 한 모금. What remains is one breath."

BACKGROUND: three concentric translucent circles (paper-warm 92% α, clay
7% α, sage 6% α) that breathe on a 12s alternate cycle (scale 1→1.06) and
DRIFT WITH THE POINTER (pointer-parallax): one rAF loop lerps the offset
(0.06/frame), each layer weighted by a --st-depth so the farthest moves
least, capped to ±12%. Decorative only (aria-hidden, role="img", bilingual
label). Pauses offscreen and on hidden tabs; does not engage on coarse
pointers.

HARD REQUIREMENTS:
- prefers-reduced-motion: wordmark fully risen+filled, rule grown, reveals
  present, breath circles STILL (no cycle, no parallax), and the pinned
  sequence FLATTENED into a calm static document — every pose at full
  stretch (scaleY 2.8), fully written, stacked in flow with air between.
  usePrefersReducedMotion via useSyncExternalStore. One finished static poster.
- Touch: the pin is plain touch scroll; pointer parallax never engages on
  coarse pointers; the circles breathe on their own. Nothing hover-only.
- Keyboard: every link reachable; custom clay-deep :focus-visible ring.
- AA: ink 12.85:1, clay-deep 4.38:1, ink-soft 5.14:1, sage-deep 4.90:1;
  bright clay and sage never carry text.
- Content visible without JS: add a .stretch-js class on mount and gate
  every pre-reveal and pre-stretch style behind it. The no-JS page is a
  finished poster — wordmark stretched, poses at full reach, names written.
- Animate transform/opacity only; scrub measured in rAF (one rect read,
  one custom-property write per frame, read before write). Every rAF loop
  pauses offscreen (IntersectionObserver) and on hidden tabs.
- Custom ::selection (clay-deep bg, paper text, 4.38:1) scoped to
  .stretch-root.
- On mount: window.parent?.postMessage({ type: "oneshot:ready",
  slug: "stretch" }, "*").
- Composed at 360px and 1440px+ (ledger stacks at <720px, pose names scale
  with vw, the cover wordmark scales hard on phones).

FILES: page.tsx (default export, applies font variables + stretch-root,
mounts BreathCircle behind a .stretch-issue wrapper that holds Hero,
PoseSequence, StudioFooter), components/ (Hero, PoseSequence,
BreathCircle, StudioFooter), hooks/ (usePrefersReducedMotion,
useScrollProgress, useStretchScroll, useReveal), styles.css (all tokens +
styles + reduced-motion), fonts.ts. Relative imports only.
```

## Known deviations

- The pinned pose-sequence is implemented as a single tall spacer with a
  `position: sticky` inner pin, and *all four* poses are absolutely
  stacked inside one pinned scene (visibility by scrub distance to band
  center). The brief's "each pose pins separately" would have meant four
  independent sticky contexts with scroll-snap handoffs — harder to keep
  calm and harder to keep accessible. One pin, four bands, one scrub is
  simpler and reads as one continuous reach rather than four discrete
  chapters. The per-pose math (local scrub = clamp((s − p0)/0.25, 0, 1);
  scaleY = 1 + localScrub × 1.8; visibility = 1 − distance × 6.25) lives
  in `calc()` in CSS so the logic is inspectable, not hidden in JS.
- The breath-circle pointer parallax runs on a single shared rAF loop that
  writes two custom properties (`--st-px`, `--st-py`) onto the stack;
  layers consume them weighted by their own `--st-depth`. The brief's
  "layered depth" is depth by CSS variable, not by separate JS per layer —
  one loop, one read, one write pair, three layers.
- Bright clay `#c97b5a` measures 2.94:1 on paper, which fails 3:1 even for
  large text. It is therefore reserved strictly for the giant display
  wordmark (well over 24px and weight 700, and used as a fill rather than
  as small text) and for decorative strokes/rings; any clay that must be
  *read* uses `clay-deep` `#a85e3f` at 4.38:1 (AA). The contrast numbers in
  tokens.json and DESIGN.md are the measured values, not aspirations.
- The CSS drives opacity, visibility, and scaleY purely from the global
  `--st-scrub` and each pose's `--st-p0/--st-p1` using `clamp()`/`calc()`/
  `min()`. The per-pose visibility triangle (1 at band center, fading 0.16
  each side) is written as `min((s-(p0-0.035))*6.25, (p0+0.285-s)*6.25)`
  rather than the equivalent `1 - abs(s-c)/h`, deliberately — `abs()` in
  CSS is too new (2024+) to rely on, while `min()`/`clamp()` have been
  universal since 2020. The two forms are mathematically identical
  (verified across the full scrub grid). The no-JS / SSR path additionally
  flattens the sequence into a static document via
  `.stretch-root:not(.stretch-js)` overrides, so the worst case is a
  readable poster, never a broken scene.
- `useScrollProgress` is included in `hooks/` as a documented general-purpose
  page-progress hook (used by the long pose-rail's overall growth), distinct
  from `useStretchScroll` which maps the specific scrub window onto the
  pinned sequence. It is part of the documented motion vocabulary rather
  than a separately-claimed taxonomy technique.
- The "rubber-band" overshoot of the wordmark settle (`ease-recoil`,
  ~12%) is a single small sigh on mount only — never a recurring bounce.
  Recurring motion on a wellness page would read as anxiety; one settle is
  a held pose releasing.
