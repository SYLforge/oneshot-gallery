---
provenance: distilled-recipe
model: builtin:zai-coding-plan/GLM-5.2
harness: ZCode CLI
date: 2026-07-18
attempts: 1
verification:
  status: unverified
---

The prompt below is a **distilled recipe** — the entry was built iteratively
(human + AI), and this is the brief compressed to what a strong model needs to
regenerate a comparable page in one shot. It is labeled `distilled-recipe`
(Class B) honestly, not `one-shot`: `meta.prompt.oneshot` is `false`. There
are **no generated images** — `media.source` is `"code"`, so there is no
`image-recipe.md` and no `workflows/`; the entire illustration is CSS/SVG.

```text
Build a complete, art-directed landing page for a fictional Korean brand:
NIGHT-SNACK 야식! — a pojangmacha (street-food tent) in a back-alley off
Jongno, Seoul, open 21:00–04:00. The page is NOT a shop — it is ONE CHAPTER
of a Naver Webtoon about the 1 AM hour at the tent, scrolled top to bottom.
Aesthetic: webtoon (the third twin). Theme DARK — deep plum-black night +
tri-color neon. Stack: Next.js App Router client page ("use client"), React
19, TypeScript strict, vanilla CSS (classes prefixed ns-), vanilla JS
animation, zero npm dependencies.

THIS ENTRY IS PURE CODE — media.source: "code". NO generated images, NO
picture elements, NO /media/night-snack/ payload. Every illustration is a
CSS/SVG shape: flat fills, halftone-dot textures, neon glow via text-shadow
and box-shadow, webtoon SFX speech-bubbles. Budget is 0 KB of media.

DISTINCTION (the family-cap sentence): PPANG! = warm/dawn/bakery/cream-paper/
one-apricot/feTurbulence/clip-path+char-split+parallax/GENERATED ART. MOONLIT
= cold/night/delivery/indigo/one-neon-blue/screen-noise/typewriter+svg-draw+
marquee/GENERATED ART. NIGHT-SNACK = warm+cold/night/street-food-tent/plum-
black/TRI-COLOR NEON (amber+pink+green)/HALFTONE DOTS/sprite-scrub+drag-
physics+ascii-render/PURE CODE. A grayscale screenshot of each is
identifiable: PPANG! light cream, MOONLIT near-black one-blue, NIGHT-SNACK
mid-dark with three distinct dancing mid-greys.

PALETTE (CSS custom properties on .ns-root; every rendered color a named
token): night-ground #14101c (the alley), night-panel #1d1726 (tent wall,
menu card), night-high #271f33 (hover/glass rim), lantern-white #fbf3df
(primary text, 14.6:1 AAA), lantern-dim #c7b8c4 (secondary text, 8.0:1 AAA),
neon-amber #ffb347 (THE accent — grill, ! in 야식!, focus, prices, ::selection
ground; 9.4:1 AAA so it CARRIES functional text, unlike ppang's apricot),
neon-amber-bright #ffcf7a (full-draw neon, large/non-text only), neon-pink
#ff5e8a (second neon — drinks sign, soju highlight; 5.0:1 AA, accent/large
use), soju-green #7ad67a (third neon — soju bottle, veg tag, clink spark;
8.1:1 AAA, used sparingly), steel #9a8fa6 (metadata, 6.0:1 AA), hairline
#332a40 (rules, never text). Amber is BOTH accent AND working text color —
no "banked" variant needed. Pink/green stay decorative/large/accent. The
three neons NEVER form a gradient — they are three separate signs, three
separate circuits.

TYPE: Black Han Sans (Korean display — 야식!, panel titles, SFX; the SAME face
ppang uses for 빵!, deliberately, set here in lantern-white + neon halo over
night instead of brown ink on cream) + Gaegu (Korean handwriting — speech
bubbles, menu note, footer koan; so the tent reads as someone talking) +
Noto Sans KR (every Korean body line, the menu, the hours) + Space Mono (the
machine + the ASCII neon — prices/tickets AND the ASCII sign glyphs, since
the monospace grid is what makes ASCII render as a picture). Via
next/font/google with literal configs in fonts.ts. Stacks always lead with
the Korean face so Hangul never falls through; :lang(ko) gets word-break:
keep-all. English is always the second voice, never larger than ~0.42em of
its Korean companion.

VOICE: loud, crowded-affectionate, Korean-first, stranger-warm, neon-literal.
Korean in a warm polite register (the owner to a regular); English is the
second voice, NEVER word-for-word. Write ~12 real literary lines: "불은
꺼지지 않는다. 김은 피어오르고, 잔은 부딪친다." / "The lights never go out.
Steam rises, the glasses clink." Banned: delicious, vibrant, authentic.

TEXTURE (all static, no feTurbulence — printed not photographic): (1) ground
gradient night-ground → night-panel; (2) HALFTONE DOT grid — fixed
radial-gradient tiled 14px, ~7% lantern-white, mix-blend-mode screen, the
printed-webtoon Ben-Day field (this is the key separator from ppang's
feTurbulence paper and moonlit's screen noise); (3) per-section neon haze
radial blooms at 4–8%.

STRUCTURE (single scroll, a 6-beat chapter):
1. Hero — the establishing shot, PURE CSS diorama of the tent: orange tarp
   roof (clip-path polygon) with a neon-amber ridge (glowing box-shadow),
   red/cream striped scalloped awning (clip-path), FIVE paper-lantern discs
   (radial-gradient + glow box-shadow) swaying ±0.6° on mutually-prime 5.3/
   5.7/5.9/6.3/6.7s cycles, a counter with a grill-ember band that breathes
   0.72→1.0 / 3.1s, three rising steam plumes. Hero text in a dark lower-
   third scrim so lantern-white reads AAA over every band. Wordmark 야식! in
   Black Han Sans, clamp(4.4rem,20vw,14rem), triple-layer text-shadow (amber
   halo + amber bloom + pink underglow) so it reads as a neon tube. Lede
   "불은 꺼지지 않는다..." / status "영업 중 · OPEN · 밤 9시—새벽 4시" with a
   pulsing amber dot.
2. SteamScrub (02화 · 불 앞에서) — TECHNIQUE sprite-scrub. A pinned-tall
   stage with SIX code-drawn frames: each is a steam plume (radial-gradient,
   different scale/opacity per frame) + a halftone heat field (denser dots =
   hotter). A hook useSpriteScrub writes --ns-steam ∈ [0,1] from how far the
   stage has traveled through the viewport; styles.css maps --ns-steam to
   each frame's opacity via a TRIANGULAR WINDOW (opacity = 1 - clamp(max(
   steam - c, c - steam) / h, 0, 1), using max() to avoid abs()), so only
   ~3 frames are ever visible — a crossfade, not a flip. Frames: raw → fire-
   on → searing (치치칵! SFX) → cooking → almost-done → plated (냠냠! SFX), food
   darkens via per-frame filter. A vertical scrub rail on the right shows
   progress = honesty. Under reduced motion --ns-steam pinned at 1 (cooked);
   no-JS stays at 0 (raw) which is also a legit frame.
3. ClinkDrag (03화 · 건배) — TECHNIQUE drag-physics. A dark wood table stage
   (height clamp(360px,56vh,540px)) with 4 draggable bodies: 3 soju glasses
   (CSS drawing: green bottle + clear trapezoid glass with soju-green tint)
   and 1 skewer (stick + food chunks). Hook useClinkPhysics runs ONE rAF for
   the stage: pointerdown grabs the topmost body under the cursor (circle
   hit test), pointermove updates position + samples velocity, pointerup
   releases → body coasts (vel decay 0.86/frame) then springs home (stiffness
   0.18, damping 0.78). When two bodies' circles overlap → CLINK: a pink/
   amber radial-gradient spark SFX pops at the midpoint (state in React, auto-
   clears 540ms), and both bodies take a knockback impulse. FINE-POINTER ONLY
   (matchMedia pointer:fine); touch + reduced-motion = calm still life. Each
   body is tabindex=0 with a visible amber focus halo.
4. NeonSigns (04화 · 네온 간판) — TECHNIQUE ascii-render. Three neon signs
   rendered as ASCII-ART character fields (hand-written strings): a soju
   bottle, a fish/can, a steaming bowl. Each sign is a <pre> in Space Mono;
   every non-space glyph is its own cell (.ns-ascii__c) with a neon text-
   shadow; one sign amber, one pink, one green. Hook useNeonFlicker every
   220ms dims ~8% of random cells (.is-dim, opacity 0.28, no glow) so the
   sign reads as a bank of dying bulbs. Three signs, three mutually-prime
   flicker feels (the periods emerge from the per-roll randomness). Under
   reduced motion signs hold full steady brightness.
5. MenuBoard (05화 · 오늘의 메뉴) — TODAY'S MENU. Plain semantic <ol>, fully
   readable no-JS. Rows: number (mono), bilingual name, price (amber mono
   tabular-nums), optional tag chip (매운/SPICY pink-border, 채소/VEG green-
   border). Dashed row dividers = hand-torn receipt. 7 dishes (닭꼬치, 떡소시지
   꼬치, 오뎅 탕, 골뱅이 비빔면, 파전, 소주, 맥주). A note in Gaegu about
   shared seats.
6. NightFooter (06화) — hours, address (종로 12길 뒷골목), phone, a sign-off
   koan "배고픈 사람이 모이면 새벽은 금방 온다" / "Gather the hungry, and dawn
   comes faster than you think.", © 2026 야식!, and a #ns-top back-to-top
   link. Real anchors, keyboard-reachable.

HARD REQUIREMENTS:
- prefers-reduced-motion: --ns-steam pinned at 1 (cooked), all ambient
  animations dead (lanterns still, grill steady, steam off), ASCII signs full
  steady brightness, clink stage a calm still life (no drag), every [data-
  reveal] at final state. Page reads as a finished chapter.
- No text hidden without JS: add .ns-js on mount; every pre-reveal style is
  gated behind it. SSR state = completed chapter.
- Touch: clink drag self-disables on coarse pointers; everything else works.
  Nothing meaningful behind hover.
- Keyboard: custom amber :focus-visible ring (haloed, 2px + 4px glow) on the
  footer links and the draggable bodies (tabindex=0).
- Animate transform/opacity/filter only; per-frame writes are: --ns-steam
  (one number), per-glass transform, per-cell is-dim class. rAF pauses
  offscreen (IO) and on visibilitychange.
- ASCII: aria-hidden on the <pre> (the caption beside it carries the meaning
  for AT); space-cells stay invisible so the grid holds.
- Custom ::selection (amber ground, night text, AAA) scoped to root.
- On mount: window.parent?.postMessage({ type: "oneshot:ready", slug:
  "night-snack" }, "*").
- Composed at 360px and 1440px+: the 3-up neon grid → 1-up, the clink table
  stays usable, the menu re-grids price under the name.

FILES: page.tsx (fonts + .ns-root + reveal wiring), components/ (Hero,
SteamScrub, ClinkDrag, NeonSigns, MenuBoard, NightFooter), hooks/
(usePrefersReducedMotion, useReveal, useInView, useSpriteScrub,
useClinkPhysics, useNeonFlicker), styles.css (all tokens + styles), fonts.ts.
Relative imports only. Zero dependencies. NO Picture component, NO media/
folder, NO image-recipe.md, NO workflows/.
```

## Known deviations

- **No generated imagery — by design, not by oversight.** This is the third
  webtoon twin and its load-bearing distinction is `media.source: "code"`:
  every illustration is a CSS/SVG shape. There is therefore no
  `image-recipe.md`, no `workflows/`, and no `ASSETS-LICENSE.md` checkpoint
  dependency — the G4 imagery-license gate is satisfied trivially (no
  imagery). The trade-off, stated honestly: CSS/SVG shapes cannot match the
  painterly detail of PPANG!'s and MOONLIT's ComfyUI panels. The bet is that
  *distinctness* (tri-color neon, halftone, ASCII signs, an interactive
  table) earns the slot more than a third set of generated panels would — a
  third generated set would read as the third version of the same idea.
- **The three techniques are the three DIFFERENT-from-siblings ones.**
  ppang uses clip-path-reveal / char-split-reveal / pointer-parallax; moonlit
  uses typewriter / svg-line-draw / marquee. This entry uses **sprite-scrub /
  drag-physics / ascii-render** — zero overlap. The sprite-scrub is
  implemented with code-drawn frames (steam plume + halftone density) rather
  than an image strip, since there is no image payload; the technique tag's
  definition ("image-sequence strips scrubbed by scroll — the no-video
  video") is honored honestly: the *sequence* is the unit, the *scrub* is the
  mechanism, and the frames being CSS drawings instead of PNGs is a
  source-format choice the tag does not forbid.
- **Black Han Sans is reused from PPANG!** — deliberately. It is the
  gallery's house webtoon display face, and the distinction is in the
  *treatment*: PPANG! sets 빵! in brown ink on cream (printed, quiet);
  NIGHT-SNACK sets 야식! in lantern-white with a triple-layer neon halo over
  night (lit, loud). Same voice, opposite register. The other three faces
  (Gaegu, Noto Sans KR, Space Mono) are unique to this entry.
- **The entry number is 22**, chosen freely — the brief said "no `28` (verify
  unique)"; 28 is already taken by another entry, and 22 was free at the time
  of writing (the gallery's used numbers were 1–21, 23, 24, 27).
- **The clink physics is fine-pointer-only.** The drag is a flourish, not a
  gate — on touch devices the table renders as a calm, complete still life
  and the menu/signs/cooking are fully usable. This is the honest call: a
  multi-body drag with overlap detection is poor on touch (no hover hit-
  testing, fat-finger ambiguity), and faking it would be worse than a clean
  static fallback. The gallery's G2 touch gate is satisfied because nothing
  *essential* lives behind the drag.
- **The ASCII signs are `aria-hidden`.** The neon picture they draw is
  decorative; the bilingual caption beside each sign carries the meaning for
  assistive tech, and the `<pre>` is plain copy-pasteable text for sighted
  users. The grid would read as nonsense to a screen reader, so hiding it is
  the accessible choice.
- **Verification is `unverified`.** This is a `distilled-recipe` entry built
  iteratively; the verification protocol (3 independent runs against the
  pinned model) has not been executed. The badge simply does not show.
