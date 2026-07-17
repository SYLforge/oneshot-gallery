---
provenance: distilled-recipe
model: builtin:zai-coding-plan/GLM-5.2
harness: ZCode
date: 2026-07-17
attempts: 1
verification:
  status: unverified
---

The prompt below is a distilled recipe: the full brief this entry was built
from, compressed to what a strong model needs to regenerate a comparable
page in one shot.

```text
Build a complete, art-directed page for a fictional virtual tea ceremony:
CHADŌ (茶道) — the way of tea. A bilingual (JP-first) page that performs a
four-hour chanoyu rite compressed into one scroll, where each beat is a
breath and the user is guided to slow down. The aesthetic is EXTREME
wabi-sabi — the most restrained, most empty, most slow entry in the
gallery. The craft is in what is omitted. Benchmark: THE TAWARAYA (Awwwards
Honorable Mention, 300-yr Kyoto ryokan) and the ma (間) principle. Theme is
light. Aesthetic: washi-sumi-e. Stack: Next.js App Router client page
("use client"), React 19, TypeScript strict, vanilla CSS (classes prefixed
chado-), vanilla JS animation, ZERO npm dependencies, no images (SVG only;
DOM + SVG renderer, no canvas — this is about stillness, not motion).

PALETTE (CSS custom properties on .chado-root): aged washi #e8e2d4 page, a
half-step brighter washi-warm #ece7da for hero/climax, tokonoma #d9d2c2 for
the recessed alcove, sumi #2b2620 warm ink (NEVER pure black — wabi-sabi)
for text, ink-soft #6b6358 for secondary, rule #b8ad96 for hairlines only,
and ONE accent: matcha #5d6b3a (muted, never neon). CRITICAL CONTRAST:
matcha #5d6b3a on washi is only 4.48:1 — below AA body. So matcha is
DECORATIVE/LARGE ONLY (whisk strokes, tea surface, bloom, hairlines) and a
derived matcha-deep #4a5630 (6.10:1, AA) carries any matcha word at body
size. Verify every accent use against AA.

TYPE: Shippori Mincho (Japanese serif whose vertical metrics were drawn
first — every CJK glyph AND the vertical headers) + Cormorant Garamond
(quiet noble Latin serif, italics for second-language answers) via
next/font/google in fonts.ts. Stack Cormorant first so CJK falls through
into Shippori; style :lang(ja) (Shippori, letter-spacing 0.02em, line-
height 1.9). Japanese is first-class — natural word order, transcreated
(never translationese).

THE SIGNATURE MOVE — TATEGAKI (縦書き): the hero title 茶道 is set in
writing-mode: vertical-rl; text-orientation: upright; Shippori Mincho, at
clamp(7rem, 18vw, 14rem). Split the two kanji into aria-hidden spans behind
an aria-label so each rises along the column on its own delay (the header
writes itself top-to-bottom, the only direction a brush travels). Almost no
Western "Japanese-inspired" site uses vertical-rl; this one leads with it.
Keep tategaki SCARCE — use it exactly twice (hero title + the tokonoma
scroll poem) so it stays sacred.

THREE INTERACTIVE TECHNIQUES:
1. BREATH-PACED SCROLL — a hero breathing cue on a 4-4-4 box-breath cycle:
   inhale 4s (scale 0.92→1, ease-out) · hold 4s (still) · exhale 4s
   (scale 1→0.92, ease-in) · rest 2s (the ma between breaths) = 14s. A
   matcha orb scales with the breath; under it a romanized label (吸う·止む·
   吐く·間) cross-fades as the phase turns. The cycle is a phase index
   (useBreathPace hook) so it never drifts; the scale itself is CSS keyed
   off data-breath={phase} (compositor-only). Pause when the hero is
   offscreen (IntersectionObserver) and when the tab is hidden. Under
   reduced motion: orb sits full & still, no rings, no label animation.
   The whole page is implicitly paced: content arrives (data-reveal), then
   WAITS — the opposite of busy.
2. VERTICAL TEXT (tategaki) — as above. The authentic Japanese reading
   direction; horizontal text for English/annotations.
3. TEA-WHISK (茶筅) DRAW-ON — the matcha preparation is an SVG brush/stroke
   draw-on tied to scroll: a chasen (bamboo whisk) with ~17 tines fanning
   from a node, pathLength=1 each, stroke-dashoffset: calc(1 − var(--
   ch-scrub,1)) so the tines draw exactly as far as the guest has scrolled,
   culminating in the chawan (bowl) whose matcha surface blooms in only at
   the end (opacity calc(scrub·5 − 4)). The scene pins (position: sticky)
   while a 4-step bilingual preparation text flows past. A useScrollProgress
   hook measures the scene rect in rAF (read→write, no thrash), lerps with
   a dt-normalized factor (1 − 0.88^(dt/16.7)) into a --ch-scrub custom
   property; IntersectionObserver starts/stops the loop; visibilitychange
   pauses on hidden tab. Default --ch-scrub is 1, so reduced-motion/no-JS
   leaves every tine drawn and the bowl full.

STRUCTURE (single slow scroll, ~6 sections, MASSIVE ma — section padding
22–26vh, the largest in the gallery):
1. Hero — the tategaki 茶道 in its own grid track; beside it the wordmark
   CHADŌ, romanized sadō, the one-line proposition (茶道は、一服の茶を全身で
   受け取るためにある / The whole ceremony exists so that one bowl...), the
   breath cue, and a "please, begin" scroll hint. Mostly paper.
2. Ceremony beats — four turns of the rite, each a held breath, with
   clamp(6rem, 18vh, 12rem) gaps between them: 露地 (roji garden) · 蹲踞
   (tsukubai, rinsing hands) · 和敬清寂 (wa-kei-sei-jaku, four principles)
   · 一礼 (the host's single bow). Each beat is a short JP statement + EN
   annotation, with a matcha-deep numeral (一二三四) in a 5rem rail.
3. The chashitsu — the chasen draw-on scene (pinned plate + flowing 4-step
   temae text: scoop → thin water → whisk → foam).
4. The tokonoma (床の間) — a recessed, darker-paper alcove holding exactly
   two things: a hanging scroll with a tea poem in tategaki, and one
   ikebana sprig (single SVG stem, one leaf, one matcha bloom) in a sumi
   vessel. The stem draws once on reveal (the only time-based draw). Frame
   is a 1px sumi hairline rebated 2.2vw in; a second feTurbulence inside
   makes the recess read as older paper.
5. The climax — 一服 (one bowl): a single full matcha bowl centered on the
   lit washi-warm ground, with a faint 7.2s steam ambient loop (opacity/
   transform only, mutually-prime with the 14s breath). The proposition
   resolves: これが、すべてのための一服 / This is the one bowl everything
   was for. The bowl's romanized name in matcha-deep (AA).
6. Colophon — a small ledger of the fictional chashitsu 一服庵 (Ippukuan),
   the four principles, the vessels, the type, the closing line (茶碗を置く。
   それで、終わる / The bowl is set down. With that, it ends), and a
   back-to-gate link. No CTA banner, no urgency.

VOICE: ceremonial, unhurried, concrete (always an object — bowl, whisk,
stone), reverent. JP statement first, EN annotation after. Anchor in real
named moments of chanoyu (roji, tsukubai, wa-kei-sei-jaku, chasen,
chashaku, chawan) without fabricating a tea master or lineage. BANNED
WORDS: zen (wrong framing — this is sadō), authentic, minimal. 15+ lines
of real ceremonial copy.

HARD REQUIREMENTS:
- Zero runtime deps. next/font/google allowed.
- prefers-reduced-motion: breath orb sits full & still (no rings, no label
  anim), tategaki renders statically (no glyph rise), chasen fully drawn &
  plate unpins (position: static), ikebana stem drawn (no transition), steam
  still, reveals present without motion. usePrefersReducedMotion via
  useSyncExternalStore. The whole ceremony must be a calm static scroll.
- AA contrast everywhere: verify matcha. ink 11.6:1, ink-soft 4.58:1,
  matcha-deep 6.10:1; matcha #5d6b3a (4.48:1) and rule (1.4:1) NEVER text.
- no-JS: fully readable ceremony. Add .chado-js on mount and gate every
  pre-reveal style behind it. With JS off the page is a finished document —
  a tea rite degrades to paper.
- Touch: pinning is plain touch scroll; no hover-only meaning.
- Keyboard: every interactive element reachable; custom matcha-deep
  :focus-visible ring. aria-label on the tategaki h1 + aria-hidden spans;
  SVG scenes are role="img" with bilingual <title>/<desc> or figcaption.
- Animate transform/opacity/stroke-dashoffset only; scrub in rAF; every
  loop pauses offscreen and on hidden tab.
- Custom ::selection (matcha/washi) scoped to .chado-root.
- On mount: window.parent?.postMessage({ type: "oneshot:ready", slug:
  "chado" }, "*").
- Composed at 360px and 1440px+ (stage collapses to one column <860px; beat
  rail folds <820px; chashitsu stacks <900px; tokonoma stacks <860px).

FILES: page.tsx (default export, applies font variables + chado-root),
components/ (Hero with tategaki + BreathCue, Ceremony beats, ChasenDraw,
Tokonoma, OneBowl, Colophon), hooks/ (usePrefersReducedMotion, useReveal,
useScrollProgress, useBreathPace), styles.css (tokens + all styles),
fonts.ts. Relative imports only. No @/ aliases.

DELIVERABLE FEEL: SACRED and SLOW — the opposite of every other entry. If
it feels like a normal landing page, it failed. The restraint IS the craft.
```

## Known deviations

- The brief asked for "breath-paced scroll" as a technique. The breath
  pacing is implemented as a hero breathing *cue* (the 4-4-4 box-breath
  cycle) that implicitly paces the page, rather than a system that
  forcibly throttles native scroll velocity. Forcibly intercepting scroll
  (e.g. wheel hijacking) is an accessibility hazard (fights reduced-
  motion expectations, breaks touch inertia, disobeys the user) and would
  violate gate G2. The cue achieves the experiential goal — guiding the
  user to slow down — through pacing and vast ma, while leaving scroll
  control entirely with the user. This is the honest interpretation.
- "Tategaki (vertical text)" is the signature art-direction move but is
  not a taxonomy technique tag (the gallery's technique vocabulary has no
  `tategaki`/`vertical-text` id). It is claimed in the brief, used twice
  on screen (hero title + tokonoma scroll), and documented richly in both
  breakdowns — following the same convention yeobaek uses for its margin-
  footnote slide (documented in prose rather than claimed as a tag).
- The three declared taxonomy techniques (`scroll-scrub-pinned`,
  `svg-line-draw`, `feturbulence-texture`) are all genuinely on screen:
  the chashitsu pins + scrubs the chasen; the chasen/ikebana/bowl are
  stroke-dashoffset draws; the washi grain and alcove paper are static
  feTurbulence passes.
- The matcha accent `#5d6b3a` measures 4.48:1 on washi — just under AA
  body (4.5). Per the brief's explicit instruction to verify matcha-on-
  washi, a `matcha-deep #4a5630` (6.10:1) token carries every matcha use
  at text size; the brighter matcha is restricted to decorative/large
  uses (strokes ≥1.6px, fills, hairlines). The `meta.json` accent stays
  `#5d6b3a` (the brand accent used decoratively).
- The chasen renders 17 tines (drawn progressively) rather than the ~70 a
  real chasen has, for SVG legibility at the rendered size and to keep the
  draw readable as a draw. The caption honors the real count ("seventy
  tines") so the abstraction is named, not hidden.
- The "four-hour ceremony compressed into one scroll" is the conceit; the
  page does not literally simulate four hours. The breath cue's 14-second
  cycle is the pacing device that makes the compression feel ceremonial.
