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
Build a complete, art-directed landing page for a fictional brand:
RAVE — a one-night underground electronic-music festival / club night held
in an abandoned Itaewon printworks, Seoul. The page is the flyer / line-up
poster / ticket booth. Aesthetic: neo-brutalist. Stack: Next.js App Router
client page ("use client"), React 19, TypeScript strict, vanilla CSS
(classes prefixed rave-), vanilla JS animation, zero npm dependencies.
THEME IS DARK — pure black ground, the texture is light, not paper.

This entry is the SECOND of three neo-brutalist entries. The first, BLUNT,
is a riso print shop: LIGHT (paper #f2ede1), daylight, ink misregistration,
acid yellow, drag-physics sticker table, scroll-coupled two-row marquee.
RAVE must read as a SIBLING under brutalism but be visually DISTINCT: dark
/ nightlife / strobe vs. light / paper / riso. A grayscale screenshot must
tell them apart — RAVE is black ground with white blocks, BLUNT is paper
ground with ink. Do not reuse BLUNT's techniques (drag-physics, marquee
as scroll-coupled two-row, spring-press, feturbulence). Pick three NEW
ones: marquee (as multi-speed strobing bands), clip-path-reveal, crt-scanline.

PALETTE (CSS custom properties on .rave-root): ground #000000, block
#ffffff, strobe electric blue #0066ff (the ONE accent), ash #8a8a8a
(secondary metadata). Electric blue on black measures ~4.35:1 — passes AA
3:1 for large/display text but NOT 4.5:1 for body, so blue is reserved for
the wordmark plates, the highlighted ticket tier, marquee row B, the map
door, and section-title Korean sublines (all large). White carries every
body string (21:1 on black). White on blue reaches 4.83:1 (AA body) so
white type on the blue surfaces is fine. Custom ::selection (blue bg, white
text) scoped to the root. No gradients anywhere — hard-stop
repeating-linear-gradient for scanlines is allowed (it is not a gradient,
it is a grid).

TYPE: Black Han Sans (Korean, single 400 weight that reads as a solid
block — the brutalist Korean face) + Archivo Black (Latin display) + Space
Mono (timestamps/BPM/ledger) via next/font/google in a fonts.ts with
literal configs. Stack Black Han Sans FIRST so every Hangul glyph lands on
it; Archivo Black takes the Latin display so the two scripts sit at the
same visual weight. Mono stack also ends in Black Han Sans so Korean BPM/
timestamps use the heavy block.

VOICE: all-caps deadpan nightlife, KO/EN slammed together, ~15 lines of
real microcopy. Register: "DOORS AT 22:00. 밤 10시, 문이 열린다." /
"NO CAMERA. NO LIST. NO QUIET. 카메라 금지, 리스트 없음, 조용함 없음." /
"DOORS 22:00 · LIGHTS 06:00 밤 10시부터 새벽 6시". The Korean is
transcreated — shorter, harder, the way a promoter texts, never
translationese.

STRUCTURE (single scroll, 5 sections):
1. Hero — massive stacked wordmark RAVE / / 2099 / (Archivo Black, clamp
   huge, line-height 0.82) on pure black with a STROBING electric-blue
   under-plate: a CSS pseudo-element (content: attr(data-text) / "" so it
   is silent to screen readers) offset under the white ink layer with
   mix-blend-mode: screen, breathing opacity 1 → 0.55 on a 2.6s ease-in-out
   loop. That strobe is the page's ambient heartbeat. KR subline "레이브
   2099" in Black Han Sans on blue. CRT scanline overlay
   (crt-scanline technique): a hero-only, pointer-transparent
   repeating-linear-gradient grid of 1px white lines at 5% alpha every 3px,
   drifting one line per 8s. Both gated to reduced-motion-off and to .rave-js.
   One CTA (GET A WRISTBAND) with the hard-shadow press.
2. Marquee band (signature) — THREE strobing line-up tickers at DIFFERENT
   fixed speeds and directions: row A the headliners (fast, ~200 px/s,
   left, on white carrying black type, Archivo Black display size), row B
   the openers (mid, ~120 px/s, right, on electric blue, strobes with the
   hero), row C the genres (slow, ~70 px/s, left, on black in ash). This is
   the distinction from blunt: blunt's two rows react to scroll velocity
   (a shop's slogans); rave's three bands run on their own clock at three
   BPMs (nightlife runs on tempo, not scroll). Each row holds 4 identical
   groups so the wrap is seamless (offset wraps at one group's measured
   width via ResizeObserver). The band only spends frames while an
   IntersectionObserver says it is on screen. Moving rows aria-hidden; the
   full line-up delivered once in a visually hidden paragraph. Reduced
   motion: all three stand still.
3. Ticket block (signature) — schedule + ticket ledger. A room toggle
   (MAIN ROOM / BASEMENT) swaps the schedule order with a 160ms opacity/
   translate cross-fade (list remounts via key, so it is a clean enter
   animation). The schedule is a monospace grid: time | act (Korean acts
   in Black Han Sans) | room chip (A=black-on-block, B=blue-on-block).
   Beside it, THREE ticket tiers wipe in with DIRECTION-AWARE clip-path
   cuts (clip-path-reveal technique): left tier wipes from the left (inset
   0 100% 0 0), the highlighted middle (electric blue) from the top
   (inset 0 0 100% 0), the right tier from the right (inset 0 0 0 100%).
   The wipe is 620ms steps(8, end) — a hard geometric cut, not a soft
   fade. One tier is SOLD OUT (strikethrough + rotated stamp, ash on
   transparent). The highlighted tier carries the blue CTA. Reduced
   motion: clips open, no cross-fade.
4. Venue map (brutalist site map, no image) — a CSS grid of labeled
   blocks representing the printworks: blue DOOR (vertical text) on the
   left, MAIN ROOM + BAR, BASEMENT, white EXIT (vertical text) on the
   right. Below it a monospace ledger: address, metro, access (step-free
   to main floor only), last call. The whole section wipes in from the
   bottom on enter.
5. Footer printed in reverse — WHITE block carrying BLACK type: giant
   "SEE YOU AT 22:00" (the 22:00 in a black chip with blue numerals),
   Korean "밤 10시에 보자", fictional Itaewon address, runs, one blue
   mailto CTA, "© 2099 RAVE COLLECTIVE — SOUND FROM THE BASEMENT.
   지하에서 올라오는 소리." Wipes in from the left.

SPRING-PRESS, MINUS THE SPRING (document honestly, same doctrine as blunt
but at a harder 8px and white-on-black): buttons carry an 8px offset solid
white shadow; :active translates the element INTO the shadow
(translate(8px,8px), shadow collapses to 0) with transition-duration 0ms
on press and a 110ms LINEAR snap-back on release. No cubic-bezier. The
highlighted tier's CTA shadow is blue-on-block.

HARD REQUIREMENTS:
- prefers-reduced-motion: strobe stops (plate pinned at full opacity),
  scanline overlay hidden, marquee static, clip-path reveals open, no
  cross-fade. usePrefersReducedMotion = useSyncExternalStore over
  matchMedia. The page must still be a complete, composed, static flyer.
- Fully usable at 360px; composed at 1440px+. The venue map reflows
  (vertical door/exit become horizontal bars) and the schedule re-grids.
- Keyboard reachable everything; custom :focus-visible (3px strobe-blue
  ring on black ground, strobe-blue on the white footer too).
- AA contrast for all functional text: white/black 21:1, white/blue 4.83:1,
  ash/black 4.6:1; electric blue on black is DISPLAY/LARGE only (4.35:1).
- Content visible without JS: gate JS-dependent styles (strobe, scanline
  drift, pre-reveal clip hidden state) behind a .rave-js class added on
  mount. The SSR page is the completed flyer.
- transform/opacity/clip-path animations only; no console errors; no
  canvas; rAF loops pause offscreen and on hidden tabs, listeners/
  observers clean up on unmount.
- No image payload at all (media.source = "code", budgetKB 5120). All art
  is CSS/SVG.
- On mount: window.parent?.postMessage({ type: "oneshot:ready",
  slug: "rave" }, "*").

FILES: page.tsx (default export, applies font variables + rave-root),
components/ (Hero, LineupMarquee, TicketBlock, VenueMap, RaveFooter),
hooks/ (usePrefersReducedMotion, useReveal), styles.css, fonts.ts,
meta.json, tokens.json, DESIGN.md, breakdown.en.mdx, breakdown.ko.mdx.
Relative imports only. No "@/" aliases.
```

## Known deviations

- Electric blue `#0066ff` measures ~4.35:1 on black — above the AA 3:1
  threshold for large text but below 4.5:1 for body. It is therefore
  reserved for large/display use only: the wordmark plates, section-title
  Korean sublines, the highlighted ticket tier surface, marquee row B, the
  venue map door, and the footer's "22:00" numeral chip. Every body string
  is white (21:1). White on blue reaches 4.83:1 so white type on the blue
  surfaces clears AA body.
- The `marquee` tag is reused from blunt but built completely differently:
  blunt couples two rows to scroll velocity (a shop's slogans read by the
  eye); rave runs three bands on independent fixed clocks at three tempos
  (nightlife runs on BPM). The technique is the same family; the behaviour
  is the distinction.
- The `clip-path-reveal` tag uses `inset()` for the four cardinal cuts and
  `polygon()` for the two diagonal corners (tl/br). A single
  `--rave-reveal-inset` custom property carries both shapes so the
  transition rule is shared; `steps(8, end)` gives the wipe a stepped,
  mechanical feel rather than a soft fade.
- The `crt-scanline` tag is honored with a CSS-only scanline grid
  (repeating-linear-gradient, 3px pitch) drifting one line per 8s, plus
  the wordmark's opacity strobe — no SVG filter, no canvas. It is gated to
  the hero only and to reduced-motion-off, so it never tints the readable
  sections or annoures a motion-sensitive reader.
- The footer's white-on-black reverse uses strobe-blue for the focus ring
  and the "22:00" numeral chip (black chip, blue numerals) rather than a
  full blue panel, keeping the white block readable and the accent scarce.
- The schedule cross-fade is implemented as a list remount (`key={room}`)
  driving a 160ms enter animation, rather than animating two stacked
  lists — simpler, and the enter/exit asymmetry is hidden by the short
  duration.
