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
RISO — an independent book publisher and art-house cinema in Seochon, Seoul,
that runs a three-drum risograph press. The page is a press sheet / cinema
program. Aesthetic: tactile-craft (risograph print). Stack: Next.js App
Router client page ("use client"), React 19, TypeScript strict, vanilla CSS
(classes prefixed riso-), vanilla JS animation, zero npm dependencies.
THEME IS LIGHT.

PALETTE (CSS custom properties on .riso-root): uncoated paper #f0ebe0,
warm ink #1a1410, and three fluorescent spot-color drums — fluo pink
#ff3d7f, riso blue #2d5fbb, riso yellow #ffd23f. Overprint logic: every
drum-colored element uses mix-blend-mode: multiply so overlaps darken like
real riso ink (pink×blue → violet #2d175d, three-way → near-ink). Halftone
logic: spot colors are radial-gradient dot fields (color 40% → transparent
44%, 10–11px tile), never flat fills — a plate is a screen of dots.
Fluorescent pink on paper is 2.84:1 and yellow 1.21:1 — never let them
carry functional text; they are plates and surfaces under ink (ink-on-pink
5.4:1 AA, ink-on-yellow 12.6:1 AAA, paper-on-blue 5.1:1 AA). Custom
::selection (yellow bg, ink text) scoped to root. Paper grain: one static
full-viewport feTurbulence rect (fractalNoise, baseFrequency 0.9, 2 octaves,
seed 11, alpha ~0.07) multiplied over everything at opacity 0.5.

DISTINCT FROM BLUNT (the gallery's neo-brutalist riso sibling): blunt is
one-ink, 3px rules, hard black 6px shadows, 0ms anti-easing, drag physics.
RISO is three-drum overprint, 1px hairlines, soft low rgba shadows, gentle
ease-out reveals, serif-led. Same physical process family, opposite
temperament.

TYPE: Noto Serif KR (every Hangul + KR display, weights 400/500/700/900) +
Lora (Latin body & section serif, italic for EN subtitles) + Space Mono
(folios, captions, registration annotations) via next/font/google in a
fonts.ts with literal configs. Both serif stacks fall through into Noto
Serif KR so Hangul never hits a fallback sans; :lang(ko) pins it.

VOICE: Korean-first bilingual, serif prose, mono metadata. Register: "세
개의 도수, 한 장의 종이." / "Printed this season. 이번 절기에 찍은 책." /
"© 2026 RISO PRESS — PRINTED BY HAND, OVERLAPPED ON PURPOSE. 손으로 찍고,
일부러 겹쳤다." The Korean leads and is never a translation of the English.

STRUCTURE (single scroll, 4 sections):
1. Hero — literary serif wordmark "RISO" set in THREE overprinting plates:
   fluo-pink and riso-blue copies offset under the ink layer via CSS pseudo
   elements (content: attr(data-text) / "" so they are silent to screen
   readers), mix-blend-mode: multiply, plus a faint yellow text-shadow on
   the ink layer so all three drums are on the wordmark. KR subline "리소
   — 종이 위에 쌓이는 빛" in Noto Serif KR. A clip-path-reveal poster
   figure beside it: a bordered sheet (320×420) with two halftone fields
   (pink + blue) and an inline-SVG cinema marquee ("NOW SHOWING", a
   projected beam, a yellow screen, seats) — the sheet wipes open from a
   centered inset clip (clip-path: inset(50% 50% 50% 50%) → inset(0)) on
   mount under .riso-js, 520ms cubic-bezier(0.16,1,0.3,1). One pink CTA
   (ink text, 5.4:1) with a soft blue offset shadow that collapses 2px on
   :active. A blue link to the catalogue.
2. The press (SIGNATURE, scroll-scrub-pinned) — a tall section (320vh)
   with a sticky inner. As you scroll, a single print sheet builds up in
   three drum passes: fluo pink (phase 0.00–0.33), riso blue (0.33–0.66),
   riso yellow (0.66–1.00), each a multiply halftone plate whose opacity
   is gated by --riso-press (0→1, driven by a useScrollProgress hook that
   lerps 0.12/frame and only runs while onscreen + tab visible). The sheet
   has an ink SVG line-art underneath (a book opening into a film reel, so
   the colored plates read as transparent ink layers), a center register
   crosshair, a folio, and a drum legend (3 chips) that lights up as each
   phase opens. Phase math in CSS via clamp() over --riso-press.
   CSS fallback var(--riso-press, 1) = fully printed, so no-JS/reduced-
   motion shows the complete three-color sheet.
3. The catalogue — a grid of 6 book covers, every one CSS + inline SVG,
   no images: a halftone field in the title's hue, the KR title in Noto
   Serif KR, the EN title in Lora italic, author + spec in Space Mono, a
   spine block and an overprinted circle mark. Each cover wipes open with
   a clip-path-reveal (inset(100% 0 0 0) → inset(0), like a sheet feeding
   off the press) as it enters the viewport via IntersectionObserver,
   staggered naturally by scroll. Under reduced motion / no-JS covers
   stand revealed.
4. Footer / colophon — a final overprint word "오버프린트 OVERPRINT" set in
   the same three-plate trick (KR in Noto Serif KR 900, EN in Lora below),
   then a 4-column colophon (find us / hours / manuscripts / colophon
   specs in mono), fictional Seochon address, mailto. "© 2026 RISO PRESS —
   PRINTED BY HAND, OVERLAPPED ON PURPOSE. 손으로 찍고, 일부러 겹쳤다."

REGISTRATION MARKS: four cross-in-circle SVG marks pinned to the viewport
corners (the bleed of one big sheet) + a three-chip color bar bottom-center.
Under .riso-js (not reduced motion) the three chips drift a few px toward
the pointer (exponential lerp, frame-normalized) — the print's
misregistration breathing. State is a delta; reduced motion / no-JS leave
everything in register.

HARD REQUIREMENTS:
- prefers-reduced-motion: --riso-press pinned to 1 (fully printed), no
  clip-path animations, no misregistration drift, no transitions.
  usePrefersReducedMotion = useSyncExternalStore over matchMedia. The
  reduced-motion page IS the completed three-color print.
- Fully usable at 360px; composed at 1440px+. Touch fallbacks throughout
  (no hover-only affordances; the press build is scroll-driven, works on
  touch).
- Keyboard reachable everything; custom :focus-visible (2px ink ring,
  yellow on the footer).
- AA contrast for all functional text (ink/paper 15.3:1, ink/yellow 12.6:1,
  ink/pink 5.4:1, paper/blue 5.1:1; pink & yellow are plates/surfaces only).
- Content visible without JS: gate JS-dependent styles behind a .riso-js
  class added on mount. The SSR frame is the finished print.
- transform/opacity/filter/clip-path animations only; no console errors;
  no canvas, no images, zero media payload.
- Every rAF loop pauses offscreen (IntersectionObserver) and on hidden
  tabs (visibilitychange).
- On mount: window.parent?.postMessage({ type: "oneshot:ready",
  slug: "riso" }, "*").

FILES: page.tsx (default export, applies font variables + riso-root, mounts
the grain SVG + RegistrationMarks + Hero + main(ThePress, BookGrid) +
RisoFooter), components/ (Hero, ThePress, BookGrid, RegistrationMarks,
RisoFooter), hooks/ (usePrefersReducedMotion, useScrollProgress),
styles.css, fonts.ts, meta.json, tokens.json. Relative imports only.
```

## Known deviations

- The `clip-path-reveal` on the hero poster uses a CSS `@keyframes` animation
  (`riso-press-open`) on mount rather than a scroll-scrubbed clip, because
  the poster is above the fold and should open once on arrival, not scrub.
  The book covers below use the IntersectionObserver-toggled `.is-revealed`
  class form of the same technique, which is the documented primary
  implementation. Both are the same technique (direction-aware inset clip
  wipe); the difference is the trigger, and it is noted here.
- The `scroll-scrub-pinned` build expresses its three drum phases as
  `clamp()` arithmetic over `--riso-press` in CSS rather than as discrete
  JS-driven opacity steps. This keeps the entire build in CSS (no per-frame
  style writes beyond the one custom property) and makes it trivially
  scrubbable, at the cost of slightly less crisp phase boundaries — which
  suits a riso drum coming down softly anyway.
- The misregistration drift on the color-bar chips is pointer-driven (not
  scroll-driven) and capped at ±4px. The brief allowed "subtly shifts on
  pointer"; this is the literal reading of that. It dies under reduced
  motion and without JS.
- Overprint multiply is applied to every drum-colored element globally
  rather than selectively (blunt selects per-sticker), because in a
  three-drum press *every* ink layer is transparent — there are no
  paper-backed decals here to keep opaque.
- `riso-blue` as text on paper measures only 3.0:1, so it is used for large
  display text (section Korean accents, footer headings) and links
  (border-bottom, not body text) only — never for paragraph body, which is
  always ink at 15.3:1.
