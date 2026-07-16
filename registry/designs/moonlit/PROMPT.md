---
provenance: distilled-recipe
model: builtin:zai-coding-plan/GLM-5.2
harness: ZCode CLI
date: 2026-07-17
attempts: 1
verification:
  status: unverified
---

The prompt below is a distilled recipe: the full brief this entry was built
from, compressed to what a strong model needs to regenerate a comparable
page in one shot. The four illustrations were generated separately in
ComfyUI (recipe at the bottom); the prompt assumes those assets already
exist at the listed paths and contain no baked-in text.

```text
Build a complete, art-directed landing page for a fictional brand:
MOONLIT — 달빛 배달, a late-night food delivery service that runs from 10 PM
to 4 AM. The page is one webtoon chapter — a single order tracked from
접수 to 완료 — and the visitor is the reader. Aesthetic: webtoon, but the
COLD/night twin of an existing warm/dawn entry: deep indigo nights, one
neon-blue accent, exactly one warm amber note reserved for the handoff.
Stack: Next.js App Router client page ("use client"), React 19, TypeScript
strict, vanilla CSS (classes prefixed moonlit-), vanilla JS animation,
zero npm dependencies. next/font/google allowed.

THE CENTRAL CONSTRAINT: this is the lonely, contemplative 2 AM city —
Wong Kar-wai at night, not a cheerful bakery. Half the city is asleep;
the rider is the only moving thing. Count amber on screen at any moment:
it should be zero, or it should be the entire handoff viewport — never a
little warmth decorating cold UI. The single warm note is a chapter, not
a colour scheme.

ASSETS (already produced, four illustrations at /media/moonlit/):
- hero-night-delivery.avif|webp (832×1216) — rider on motorcycle at night,
  establishing shot. Used in the hero.
- rider-character.avif|webp (832×1216) — the rider character portrait.
  Used in the rider intro panel.
- street-night.avif|webp (1024×768) — empty neon city street background,
  landscape. Used in the street panel.
- delivery-complete-dawn.avif|webp (832×1216) — the warm handoff moment
  at dawn, the emotional climax. Used in the handoff panel.
Reference each as <picture> with avif <source> + webp <source> + <img>.
The images contain NO text — every status, name, timestamp is real
HTML/SVG overlay.

PALETTE (CSS custom properties on .moonlit-root, every rendered color a
named token): night-deep #0b1020, night-mid #131a2e, moonlight #e8edf5,
moonlight-dim #9aa6c2, neon-blue #4da8ff, neon-blue-bright #7cc4ff,
ember-amber #e89b4c (the one warm note), ember-bright #ffba6a, steel
#828cb0, hairline #27304a. Cool indigo + one blue accent; amber reserved
for the handoff alone. moonlight measures 16.1:1 on night-deep (AAA);
moonlight-dim 7.8:1 (AA+); neon-blue 7.5:1 (AAA on normal text — it is a
working UI colour, unlike HALFLIGHT's red which is restricted); ember
8.3:1; steel 5.7:1 (AA on normal text). Custom ::selection
(neon-blue bg / night-deep text) scoped to the root.

TYPE: Gugi (Korean display — the wordmark `달빛` and the handoff title
only), Noto Sans KR (every Korean line — prose voice, 300/400/500/700),
Space Grotesk (English display + body — wordmark `MOONLIT`, section
heads, English body), Space Mono (the machine — timestamps, order #s,
tracker labels, 400/700) via next/font/google in a fonts.ts with literal
config objects. Body stack `Space Grotesk, Noto Sans KR, system-ui` so
Hangul falls through with no markup; :lang(ko) pins Noto Sans KR, zeroes
tracking, word-break: keep-all. Mono stack keeps Korean in Noto Sans KR
under the Latin mono so a status line that is half machine / half Korean
still reads correctly.

VOICE: lonely, nocturnal, tender only about the meal, deadpan about the
tracker. Korean is written first, literary, never translationese.
~20 lines of real bilingual copy. Examples:
- Hero: "도시가 잠든 2시, 당신의 따뜻한 한 끼를 배달합니다." / "At 2 AM,
  when the city sleeps, we deliver your warm meal."
- Rider interior: "아무도 없다. 가로등만, 그리고 나." / "There is no one.
  Only the lamps, and me."
- Handoff signoff: "잘 드세요. — 좋은 밤 되세요." / "EAT WELL. — GOOD
  NIGHT."

STRUCTURE (single scroll, six chapters):
1. Hero (CH. 01) — the rider already mid-street, motorcycle, single
   headlight. The portrait image is masked top/bottom by alpha gradients
   so the page's night ground shows through; a CSS moon disc sits high on
   the right; an SVG neon sign ("OPEN"-style tube) hangs top-right and
   brightens + draws on scroll-in. Kicker "달빛 배달 · LATE-NIGHT
   DELIVERY · EST. 2024", wordmark "MOONLIT" with Korean "달빛" beneath
   in Gugi, hero lede (the "도시가 잠든 2시" line), a live status chip
   with a pulsing neon dot ("LIVE · 밤 10시 — 새벽 4시 · 47 RIDERS
   AWAKE"). Subtle parallax: image translates Y by scroll*0.045, capped,
   transform-only. JS-gated, dead under reduced motion.
2. Rider intro (CH. 02) — grid: portrait panel left (rider-character),
   body right. The body has a delivery-status card whose Korean line
   types itself out (technique: typewriter) when the panel scrolls in:
   "02:14:08 — 배차 완료 · ASSIGNED" + "라이더 #14. 새벽 세 시의 도시를,
   잠들지 않은 당신에게 잇는다." Then a literary paragraph and a 3-row
   facts list (배달 거리 7.4 km, 운행 시간 22:00–04:00, 오늘 배달 12/14).
3. Live tracker (CH. 03, SIGNATURE) — an <ol> of four stages: 주문 접수
   → 조리 중 → 배달 출발 → 배달 완료. Each row's Korean label types
   itself out (typewriter) when the row enters view; timestamps and
   English labels are plain mono text. To the left of the list, an SVG
   progress tube whose stroke-dashoffset scrubs from full (400, the
   path length) to zero as the active stage advances (technique:
   svg-line-draw). Active stage = the max row index scrolled past —
   monotonic, no timers, no lies. Each active node is a glowing neon
   dot, inactive nodes are hollow steel.
4. Empty street (CH. 04) — the street-night image as a 1024/768 landscape
   panel. Two SVG neon signs hang over the street; they brighten + draw
   on scroll-in (svg-line-draw, 180/460ms stagger, then a 3.3–4.1s
   flicker). A headlight-trail marquee (technique: marquee) of thin
   cool-blue light streaks sweeps across the panel — two rows at 5.4s /
   3.6s, one reversed. Overlaid street label "04· SEONYU-RO 42-GIL ·
   SEOUL", rider interior line, English gloss. Caption below.
5. Handoff (CH. 05, the warm climax) — the delivery-complete-dawn image.
   The whole section is the one warm moment: the page ground warms with
   a radial ember-amber bloom leaking from the right edge, opacity 0 → 1
   over 1800ms ease-out (the "dawn arriving through the door" effect).
   Title in Gugi, ember-bright: "따뜻하게, 도착했습니다." Image panel
   with its own warm radial glow overlay. Body: the rider's argument
   (one warm meal stitches the sleeping city back together). Signoff:
   "잘 드세요. — 좋은 밤 되세요." This is the only viewport where amber
   dominates.
6. Service panel + footer (CH. 06) — three cells (운영 시간 22:00–04:00 /
   배달 가능 지역 서울 47동 / 주문 방법 앱·전화), a CTA row (CALL TO
   ORDER + ghost email button), then footer. Cold UI resumes — steel
   and blue only, no amber. "운영 시간" says we close on Seollal and
   Chuseok, even us, even then.

THREE INTERACTIVE TECHNIQUES (declare all three in meta.techniques, all
must earn a breakdown section, all must be DISTINCT from the existing
PPANG! entry which uses clip-path-reveal + char-split-reveal +
pointer-parallax):
- typewriter — delivery-status lines and stage labels type themselves
  out one Korean glyph at a time when their panel/row enters view,
  with a 540ms-blink neon cursor that holds its blink after typing
  completes (the way a tracker waits for the next stage).
- svg-line-draw — neon signs and the tracker's progress tube brighten
  and draw themselves via stroke-dashoffset as they scroll into view,
  evoking driving past lit signs at night; signs then hold a tired-tube
  flicker.
- marquee — headlight-trail speed lines sweep across the empty street
  panel (two rows of cool-blue linear-gradient streaks translate X),
  reduced-motion safe (sits at first frame).

HARD REQUIREMENTS:
- prefers-reduced-motion: neon signs hold their lit state without
  flicker, the headlight trail sits at its first frame, nothing types
  (full text already in DOM via visually-hidden spans), the dawn bloom
  sits at full opacity, all [data-reveal] sit at their final state. Use
  a usePrefersReducedMotion hook (useSyncExternalStore over matchMedia)
  + a real media query block. The page is a complete, calm, static
  document.
- AA contrast: moonlight 16.1:1 (AAA), moonlight-dim 7.8:1 (AA+),
  neon-blue 7.5:1 (AAA on normal text), ember 8.3:1, steel 5.7:1
  (AA on normal text). Document in tokens.json.
- No JS = finished readable page: add .moonlit-js on mount and gate
  every pre-reveal / pre-draw / pre-type state behind it. All copy is
  plain DOM; every Korean line that types has the full string in a
  visually-hidden span for screen readers and find-in-page.
- Keyboard: everything reachable; custom neon-blue :focus-visible with
  a halo box-shadow.
- Touch: no hover-only meaning; the parallax is decorative and degrades
  to no-motion on touch (the marquee is autonomous, not pointer-driven).
- Animations touch only transform, opacity, stroke, and filter — never
  layout. rAF pauses on hidden tabs.
- Bilingual Korean-first; machine text in mono, prose in Noto Sans KR.
- On mount: window.parent?.postMessage({ type: "oneshot:ready",
  slug: "moonlit" }, "*").
- Composed at 360 px and 1440 px+. The hero is one viewport; the tracker
  list wraps its timestamp column under 600 px.

FILES: page.tsx (default export, applies font variables + moonlit-root,
posts oneshot:ready on mount, adds .moonlit-js), components/ (Hero,
RiderIntro, DeliveryTracker, StreetSequence, DeliveryComplete,
ServiceFooter), hooks/ (usePrefersReducedMotion, useReveal, useInView,
useTypewriter), styles.css, fonts.ts. Relative imports only. Zero
dependencies. media.source: "comfyui" (the four illustrations are
generated).
```

## Image recipe (ComfyUI)

The four illustrations were generated in ComfyUI before the page was
built. Same family as the parallel PPANG! entry, so the recipe is shared
and credited honestly here.

- **Checkpoint:** Illustrious-XL merge — `zenijiMixKWebtoon_v10`
  (Korean-webtoon-styled SDXL merge).
- **LoRA:** `toonystarkKoreanWebtoonFlux` @ strength 0.75 (the Korean
  webtoon linework + shading lora).
- **Sampler / scheduler:** Euler a, 30 steps, CFG 6.5.
- **Output sizes:** portrait scenes at 832×1216 (hero, rider, handoff);
  the street scene at 1024×768 (landscape).
- **Upscale:** RealESRGAN 2× (the entries ship the AVIF/WebP at the
  post-upscaled resolution).
- **Encode:** AVIF (primary) + WebP (fallback) for every asset.

Positive prompts (condensed; full versions live in `image-recipe.md` and
the exported graph in `workflows/`):

- `hero-night-delivery` — "Korean webtoon illustration, lone delivery
  rider on a motorcycle at 2 AM, single headlight cutting through an
  empty neon-lit Seoul street, deep indigo night, wet asphalt, cold blue
  neon signs in the distance, cinematic, lonely, no text, no captions,
  vertical 832×1216, zenijiMixK Korean webtoon style."
- `rider-character` — "Korean webtoon character portrait, a young
  Korean late-night delivery rider in his late 20s, helmet under one
  arm, tired but kind face, dark windbreaker, cold blue neon rim light,
  empty city behind him, deep indigo background, no text, vertical
  832×1216."
- `street-night` — "Korean webtoon illustration, an empty Seoul street
  at 3 AM, closed shuttered storefronts, wet asphalt, distant streetlamp
  halos, two cold blue neon shop signs, no people, lonely cinematic
  mood, deep indigo, no text, landscape 1024×768."
- `delivery-complete-dawn` — "Korean webtoon illustration, the handoff
  at first light — a delivery rider and a customer at an apartment door,
  a warm meal passing between hands, the sky just beginning to warm at
  the edges with amber dawn light, indigo night still dominant, tender,
  cinematic, no text, vertical 832×1216."

The page's design departs from the prompts in two known places: (1) the
overlaid UI (street labels, rider names, order numbers) is real HTML
overlay, not baked text; (2) the warm amber on the handoff is reinforced
on the page side by the radial dawn-bloom layer, which is CSS, not part
of the illustration.

## Known deviations

- The hero parallax is a single `window.scrollY` read in a passive rAF
  loop, capped at 800 px and 4.5% translation. This is technically a
  scroll handler; it is `passive: true`, never causes layout (transform
  only), pauses on `visibilitychange`, and is killed entirely under
  reduced motion. The brief asked for "parallax"; this is the cheapest
  honest version that does not require a library.
- The tracker's active stage advances on scroll position (the max row
  index scrolled past), not on a timer. The brief literally says
  "delivery-status narrative ... that updates as you scroll", so this is
  faithful — but it means a reader who scrolls back up sees the active
  stage stay where it last was (monotonic). Re-scrolling forward does
  not un-advance. Accepted: a real tracker does not un-deliver.
- The `headlight-trail` marquee reuses the `marquee` technique id, which
  is also claimed by gradient-plaza. The two entries use it for
  completely different things (gradient-plaza: a kinetic radio ticker;
  moonlit: speed lines for a moving rider). The technique taxonomy is
  gallery-wide and the same tag is allowed to mean different concrete
  things across entries; this is the honest classification.
- The reduced-motion branch of the typewriter still runs the hook (so
  the cursor never appears, the text arrives in a few frames as
  effectively-whole), rather than skipping the hook entirely. This is
  because the hook owns the visibility of the visible string; skipping
  it would require duplicate markup. The end state is correct: typed
  text whole, no cursor, no blink.
- The hero neon sign SVG is a stylized tube path, not a real "달빛" or
  "OPEN" wordmark — it is a gestural neon squiggle, deliberately
  abstract, because rendering legible Hangul or Latin as an SVG stroke
  path at this size was not legible enough across browsers. The street
  signs use the same vocabulary. Accepted: the signs read as neon, not
  as words.
