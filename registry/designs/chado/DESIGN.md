# CHADŌ 茶道 — design spec

## Identity

A virtual tea ceremony — 茶道, sadō, the way of tea — whose entire reason
to exist is the proposition that one bowl of matcha can be received with
full attention. The page is the ceremony compressed: not a landing page
about tea, but the rite itself, paced in breaths. The emotional register is
the most restrained in the gallery. Where kemuri sells an hour of
stillness with smoke, and yeobaek argues for blank space, chado *performs*
the pause — each beat arrives, then waits. The user is guided to slow down,
and the design rewards slowness rather than fighting it. Japanese (日本語) is
a first language; the English is a quiet annotation set half a step back,
answering rather than translating.

The benchmark is THE TAWARAYA — the Awwwards Honorable Mention for a
300-year Kyoto ryokan — and the *ma* (間) principle documented in the
gallery's asian-aesthetics reference (§3.1, §4 Tier 1). TAWARAYA succeeds
through restraint: vast negative space, a single accent, typography as the
hero. CHADŌ commits to the same discipline at the extreme end — the most
empty, the most slow, the most silent entry in the gallery. The craft is in
what is omitted.

## Palette

| Token | Hex | Role | Contrast (on washi) |
| --- | --- | --- | --- |
| `washi` | `#e8e2d4` | the aged page; everything happens against it | — |
| `washi-warm` | `#ece7da` | the page's lit skin — hero & climax ground, a half-step brighter so the bowls feel lit (surface only) | 1.03:1 (surface) |
| `tokonoma` | `#d9d2c2` | the alcove — recessed, older paper where the scroll and ikebana hang | 1.10:1 (surface) |
| `sumi` | `#2b2620` | the ink: primary text, the wordmark, bowl outlines, ceremony headers — never pure black, wabi-sabi keeps it warm | 11.61:1 (AAA) |
| `ink-soft` | `#6b6358` | sumi thinned — secondary text: English annotations, beat labels, captions, the ledger | 4.58:1 (AA) |
| `rule` | `#b8ad96` | **hairlines only**: page rules, the tokonoma frame, beat dividers | 1.4:1 — never text |
| `matcha` | `#5d6b3a` | the one living accent: the chasen whisk tines, the bowl's tea surface, the ikebana bloom, hairlines of emphasis, ::selection ground, focus ring | 4.48:1 — **decorative & large only, never body text** |
| `matcha-deep` | `#4a5630` | matcha that must function as text at body size — the bowl's romanized name, beat numerals, the closing seal | 6.10:1 (AA) |

**The one contrast decision that mattered:** the brief's matcha `#5d6b3a`
measures 4.48:1 on washi — just below the AA body threshold of 4.5. So
matcha is restricted to decorative and large uses (whisk strokes ≥1.6px,
the tea surface, the bloom, hairlines), and a derived `matcha-deep #4a5630`
(6.10:1) carries any word that would otherwise fall short. The brand accent
in `meta.json` stays `#5d6b3a`; the text-grade token keeps the page honest.
There is no second hue — if something needs emphasis, it gets space, not
color.

## Type system

| Font | Source | Role |
| --- | --- | --- |
| Shippori Mincho | Google Fonts | every CJK glyph — the tategaki title 茶道, the alcove scroll poem, ceremony headers, beat labels, the bowl's name. A mincho whose vertical metrics were drawn first; it carries `writing-mode: vertical-rl` with no complaint |
| Cormorant Garamond | Google Fonts | the Latin voice — the wordmark CHADŌ, English annotations, the colophon, romanized breath beats. A quiet noble serif with a long ascender; italic for the second-language answers |

- Family stack is `Cormorant Garamond, Shippori Mincho, serif`: Latin
  resolves in Cormorant, CJK falls through into Shippori with no markup.
  `:lang(ja)` additionally pins Shippori and sets 0.02em tracking with
  looser 1.9 leading — mincho needs air.
- Base size `clamp(16px, 0.42vw + 14px, 19px)`, root leading 1.85.
- JA paragraphs read at line-height 2.05; their EN answers at 0.95em /
  1.74, in `ink-soft` — the two languages breathe at different rates.
- The tategaki title is `clamp(7rem, 18vw, 14rem)` at weight 500,
  0.06em tracking, `writing-mode: vertical-rl; text-orientation: upright`.
- Breath labels: Shippori 1.1rem for the JP beat (吸う · 止む · 吐く · 間),
  Cormorant uppercase 0.74rem at 0.24em for the EN gloss.

## Texture recipe

Washi in two static layers, both fixed and never animated — stillness is
the material:

1. **Aged paper grain** — one full-viewport SVG `feTurbulence` pass:
   `fractalNoise`, baseFrequency 0.62, 2 octaves, seed 17, mapped by
   `feColorMatrix` to sumi at ≤4.5% alpha, `mix-blend-mode: multiply`.
   Fibers, not film grain. It never animates.
2. **Warm age-vignette** — a `radial-gradient` to `rgba(91,80,58,0.06)` at
   the edges, so the page reads as paper yellowed evenly in a drawer.
3. **The tokonoma's own paper** — inside the alcove, a `tokonoma` ground
   one step darker than the body, a 1px sumi-hairline frame rebated 2.2vw
   in, and a second `feTurbulence` (baseFrequency 0.04, 2 octaves) only
   inside the recess — so the alcove reads as deeper, older paper.

## Motion vocabulary

| Name | Value | Used for |
| --- | --- | --- |
| `ease-tea` | `cubic-bezier(0.16, 1, 0.3, 1)` | every entrance: soft, long tail — steam leaving a kettle |
| `ease-bow` | `cubic-bezier(0.65, 0, 0.35, 1)` | the breath cue & bowl fill: weighted, two-handed |
| `breath-cycle` | inhale 4s (ease-out, scale 0.92→1) · hold 4s (still) · exhale 4s (ease-in, scale 1→0.92) · rest 2s — a 14s bow | the hero cue; phases mutually-prime so it never syncs with scroll |
| `breath-label` | 320ms ease-tea cross-fade, opacity only | the romanized beat changes under the cue |
| `scrub-lerp` | `v += (t − v)(1 − 0.88^(dt/16.7))` — half-life ≈ 5.4 frames, dt-normalized | the chasen draw (120Hz-safe) |
| `scrub-window` | start: scene center at 62vh; span: `min(0.9·height, 1.2·vh)` | the whisk draws only in its chashitsu |
| `chasen-draw` | `pathLength=1` paths, `stroke-dashoffset: calc(1 − var(--ch-scrub,1))`; tea surface `opacity: calc(scrub·5 − 4)` | the whisk & bowl |
| `reveal` | 1100ms ease-tea, translateY(16px) → 0, 140ms stagger | ceremony beats, slower than gallery default |
| `tategaki-rise` | 1300ms ease-tea per glyph, 220ms stagger along the column | the title writes itself top-to-bottom |
| `ambient` | bowl steam 7.2s (opacity/transform only), breath cue 14s — mutually prime | the only idle loops on the page |

Rule: motion may only ever *finish* something the static page already
shows — a tine completing, a tea surface blooming, a glyph arriving.
Between interactions the page is perfectly still. The breath cue is the
one exception, and it exists to *pace* stillness, not to break it.

## Space & shape

- The page is a single slow scroll: hero → four ceremony beats (vast ma
  between them, `clamp(6rem, 18vh, 12rem)`) → the chashitsu (pinned plate
  + flowing preparation text) → the tokonoma alcove → the one-bowl climax
  → colophon. Section padding runs 22–26vh — the largest in the gallery.
- The tategaki title occupies its own grid track; at ≥860px the stage is
  a two-column `col | title` so the vertical 茶道 stands to the right of
  the wordmark and proposition.
- The chashitsu pins the chasen plate (`position: sticky`) while the
  four-step preparation flows past — the pin is native sticky, not
  scripted layout.
- Shapes are circles (the bowl, the breath orb, the bloom), brush strokes,
  and hairlines. The only filled matcha shapes are the tea surface and the
  single ikebana bloom. Everything else is line.
- Asymmetry is deliberate: the beat index sits in a 5rem rail at ≥820px;
  the tokonoma is two centered objects on recessed paper; the climax is
  centered because a received bowl is centered in two hands.

## Voice guide

**Five adjectives:** ceremonial · unhurried · bilingual-by-conviction ·
concrete (always an object: bowl, whisk, stone, kettle) · reverent.

**Three example lines:**

1. "茶道は、一服の茶を全身で受け取るためにある。" / "The whole ceremony
   exists so that one bowl of tea can be received with full attention."
2. "露地を歩く。足元の飛び石は、急ぐ足をゆるやかにするために置かれた。"
   / "You walk the roji. The stepping stones are laid to slow a hurried
   foot."
3. "茶碗を置く。それで、終わる。何も残らない。それでよい。" / "The bowl
   is set down. With that, it ends. Nothing is left behind. That is as it
   should be."

**Three banned words:** *zen* (wrong framing, lazy shorthand — this is
*sadō*, a specific practice), *authentic* (the page shows, never claims),
*minimal* (the ceremony demonstrates restraint; labeling it is the opposite
of restraint).

Grammar of the voice: JP statement first, EN annotation after — the same
moment re-felt, never word-for-word. Claims stay anchored in real, named
moments of chanoyu (roji, tsukubai, wa-kei-sei-jaku, chasen, chashaku,
chawan) and stop before scholarship they can't support. The page does not
invent a tea master or a historical lineage; it invents one fictional
chashitsu (一服庵, Ippukuan) and is honest about it.

## Do & Don't

**Do**

1. Spend emphasis as space — if a beat matters more, give it more ma, not
   more weight. The gap between beats is the ceremony.
2. Keep matcha scarce and structural: the tea surface, the bloom, the
   whisk tines, one hairline, the focus ring. Its authority is its rarity.
3. Let tategaki stay scarce. It appears exactly twice — the hero title and
   the alcove scroll — so it reads as sacred, not decorative.
4. Pace the user. The breath cue is not ornament; it is the clock. Content
   arrives, then waits.
5. Write JP first and transcreate; read both aloud before shipping.

**Don't**

1. Don't let matcha `#5d6b3a` carry a word at body size — it fails AA at
   4.48:1. Use `matcha-deep #4a5630` (6.10:1) for any matcha text.
2. Don't use pure black. `sumi #2b2620` is warm on purpose; wabi-sabi
   avoids harsh black.
3. Don't animate layout — transform, opacity, stroke-dashoffset only. The
   pin is `position: sticky`, not JavaScript.
4. Don't fill the ma. A near-empty section is content, not a gap to plug.
5. Don't let the fiction wink — no jokes about scrolling or websites; the
   ceremony believes it is a ceremony.

## Distinctness from siblings

- **kemuri** (washi-sumi-e, same family): ink + smoke, an *incense*
  atelier, driven by a curl-noise canvas. CHADŌ has no canvas, no smoke,
  no particles — it is DOM + SVG only, because stillness, not motion, is
  the subject. Where kemuri animates continuously, chado animates almost
  never.
- **yeobaek** (editorial-serif): an *editorial* journal about Korean
  negative space, Korean-first, oxblood accent. CHADŌ is Japanese-first,
  matcha accent, and its subject is *ritual pacing*, not typographic
  argument. Tategaki is the differentiator yeobaek does not use.
