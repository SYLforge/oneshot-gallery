# SAKURA — design spec

## Identity

A generative ink garden. There is no brand here to sell anything — there is
only the page itself, performing its one idea: black ink drops fall from a
deep night sky, strike an invisible waterline, and bloom into cherry petals
that drift on a curl-noise wind and slowly fade. The metaphor is *mono no
aware* (もののあわれ) — the gentle, appreciative sadness that beauty is
transient. Every petal on this page is born, drifts, and is forgotten; the
page does not mourn them, it *stages* them.

This is the ink-bloom family's flagship and the gallery's direct, labeled
answer to [oneshot-sakura](https://oneshot-sakura.vercel.app/) — the
reference site that inspired the whole gallery. The thesis: the same premise
(ink → bloom), executed as a trilingual, installable, fully-source-included
page under MIT, where sakura offers one hero. The ink-to-petal transition is
the signature moment; the four scrubbed verses are the soul.

Unlike KEMURI (the washi-sumi-e flagship), which deliberately refused spring
— "smoke instead of blossoms" — SAKURA is the page that *owns* the blossom.
Where KEMURI inverts the curl-noise physics to make smoke rise, SAKURA
inverts it again: ink falls by gravity, blooms on impact, petals sink. The
two are a matched pair across two families, the same engine pointed in
opposite directions.

## Palette

| Token | Hex | Role | Contrast (on ink-night) |
| --- | --- | --- | --- |
| `ink-night` | `#0e0a0f` | ground — the deep night sky every drop falls from | — |
| `ink-panel` | `#14101a` | raised panel — verse stage floor, the CTA, card grounds | — |
| `petal-white` | `#f6eef0` | primary text — a near-white warmed with the faintest blush | 17.2:1 (AAA) |
| `bloom` | `#f4c2d4` | soft bloom pink — display sub-voice, verse Korean body, the freshly opened petal | 12.6:1 (AAA) |
| `blossom` | `#e8869e` | the accent — the live petal mid-bloom: kickers, verse numerals, focus rings, selection ground, card frame | 7.8:1 (text-safe) |
| `blossom-deep` | `#c75a76` | banked blossom — functional accent on ink-panel where it must hold weight | 4.6:1 on panel (AA) |
| `gold` | `#c9a85a` | the single warm mote — gold dust: the hero hairline rule, the seal stamp fill, the one drifting pollen grain | 8.6:1 (text-safe, decorative) |
| `ink-soft` | `#a89aa2` | captions, the English subtitle, the colophon — the voice from further into the night | 7.3:1 (AAA) |
| `moss-ink` | `#6b5a64` | large or decorative only — far petals, hairlines, the waterline shimmer | 3.1:1 — large/decorative only |

Derived working tokens: `hairline` / `hairline-strong` = petal-white at
14% / 26% α for rules and mounts. The page never inverts (unlike KEMURI's
one dark-room flip): the dark is this page's home, not a room you step
into. The palette is generous — even the accent blossom clears AA for body
text (7.8:1), so blossom is permitted to speak everywhere, where KEMURI's
ember had to be banked. The one discipline: gold appears exactly where gold
should — the hero rule, the seal, the single drifting mote — never as a
fill or a gradient.

## Type system

| Font | Source | Role |
| --- | --- | --- |
| Shippori Mincho (400, 500, 700) | Google Fonts via `next/font` | every Japanese glyph: the vertical 桜花 title (tategaki), verse markers 一二三四, seals. A mincho drawn for vertical metrics first |
| Noto Serif KR (400, 500) | Google Fonts via `next/font` | Korean main voice — 벚꽃, the verse body, ledes, footer. 한국어 메인. The brush-remembering Korean serif that actually speaks |
| Cormorant Garamond (400, 500, 600, italic) | Google Fonts via `next/font` | Latin subtitle — the SAKURA wordmark, English subtitle, captions, numerals; a quiet noble serif, the register of a slow letter |

- Family stack is `Cormorant Garamond, Noto Serif KR, Shippori Mincho,
  serif`, so Hangul and kanji fall through the Latin face into their own
  with no markup; `:lang(ko)` and `:lang(ja)` pin their faces and tune
  tracking (+0.01em KR, +0.06em JA).
- Base size `clamp(17px, 1vw + 12px, 20px)`, line-height 1.75.
- Display: wordmark `clamp(3.8rem, 16.5vw, 12rem)` at weight 500,
  letter-spacing 0.16em with matching text-indent (optical recentering),
  line-height 0.95. The tategaki 桜花 sets at `clamp(2.4rem, 7vw, 5rem)`
  in Shippori, to the right of the wordmark.
- The trilingual policy: **Korean is the main reading voice** (한국어 메인),
  **Japanese is the decorative source glyph** (the sakura motif is Japanese
  at its root), **English is the subtitle**. The Korean headline 벚꽃 is
  larger than the English wordmark's companions and carries the page's
  speaking voice; the Japanese 桜花 hangs vertical as a hanging scroll.
- The vertical verse markers (一二三四) set in Shippori at display size;
  the verse Korean body in Noto Serif KR is the voice that recites.

## Texture recipe

Night in three static layers (the sky is old, not alive):

1. **Dust** — one fixed full-viewport SVG `feTurbulence`
   (`fractalNoise`, baseFrequency 0.62, 2 octaves, seed 7,
   `stitchTiles="stitch"`) mapped by `feColorMatrix` to blossom at ≤4% alpha,
   `mix-blend-mode: screen`, opacity 0.6. Fine grain like dust suspended in
   night air — never animated.
2. **Vignette** — a deep radial gradient, transparent at center fading to
   `rgba(0,0,0,0.55)` at the corners, holding the eye toward the waterline.
3. **The waterline** — drawn on the canvas itself (not CSS): a 1px
   moss-ink hairline at 38% opacity with a 24px blossom glow beneath it,
   shimmering at 6.2s. The only fixed geometry on the page.

The petals carry no texture: they are flat filled paths prerendered to
sprites, the way a woodblock print is flat. Three sprite tones (fresh
blossom, mid bloom, pale edge) give variety without per-particle shading.

## Motion vocabulary

| Name | Value | Used for |
| --- | --- | --- |
| `ease-bloom` | `cubic-bezier(0.22, 1, 0.36, 1)` | every entrance — opens fast, settles long, like a petal unfurling |
| `ease-ink` | `cubic-bezier(0.65, 0, 0.35, 1)` | the drop's fall and the seal press — deliberate, weighted, symmetric |
| curl wind field | ψ = noise(170px) + 0.4·noise(64px); v = (∂ψ/∂y, −∂ψ/∂x); gain 720 | the petals' drift — divergence-free (echoes KEMURI's smoke, inverted) |
| field drift | 10 px/s left + 14 px/s up of the noise domain | gusts travel with the petals |
| ink fall | gravity 580 px/s² · terminal 480 px/s | the drop descends |
| bloom burst | 8–14 petals outward at 40–90 px/s + 4–7 splash droplets | the moment of bloom at the waterline |
| petal drift | sink −22 px/s · relaxation 1.8 s⁻¹ · life 7–13 s · size 7–16px | petals fall gently, fade |
| pointer wind | horizontal pull ≤ ±70 px/s · attack 0.06 / release 0.02 | petals lean toward a hand fast, forget slowly |
| scroll bloom | progress 0→1 over ~2.5 viewports: drop rate ×3.2, density floor ×0.7 | petals accumulate as you read the verses, clear as you leave |
| ambient breeze | 18·sin(0.19t) + 9·sin(0.43t + 1.4) px/s | touch / idle autonomy (~33s, ~15s periods, no common divisor) |
| glyph cadence | 1100ms `ease-bloom`; 95ms/letter (wordmark), 540ms/line (verses) | the unhurried pace of petals |
| reveal | 900ms `ease-bloom`, translateY(16px) → 0, 80ms batch stagger | secheads, notes, footer |
| loader | press 700ms · hold 1400ms · lift 650ms `ease-ink` | the bloom seal; skippable by anything |
| ambient | waterline shimmer 6.2s · hint drift 8.6s | mutually prime; opacity/transform only |

Timing rule: the two ambient cycles and the cadence periods share no common
divisor, so the idle garden never visibly loops. Nothing bounces; everything
settles or drifts.

## Space & shape

- Sections breathe at `clamp(96px, 15vh, 176px)`; the hero is exactly one
  viewport; the CTA opens with `clamp(110px, 18vh, 200px)` — the biggest
  inhale before the invitation.
- The verse section is the exception: it is **tall** (~260vh) because it is
  scroll-scrubbed. Its inner stage is `position: sticky; top: 0; height:
  100svh` for the full scroll length, so the verses pin while progress runs.
- Reading measures: prose at 880px; the verse stack at 1000px; the garden
  notes at 1080px. Nothing full-bleed except the hero and the bloom stages.
- Shapes are hairlines and the seal's carved-stone radius (rx 3–4). Rules
  are 1px solid `hairline`. The garden bloom stage gets a 1px hairline frame
  and a 2px radius — the only bordered box on the page.
- Asymmetry is the tategaki: the 桜 hangs to the right of the wordmark (a
  hanging scroll beside a Latin inscription), counterweighted by the gold
  rule beneath. The verse markers (一二三四) sit left of the verse body —
  the seal-stamp punctuation of each stanza.

## Voice guide

**Five adjectives:** mono-no-aware · present-tense · trilingual-by-birth ·
patient · un-precious about beauty.

**Three example lines:**

1. "Ink falls, the blossom opens." / 먹이 지고, 꽃이 피어난다 / 墨が落ちて、花が咲く。
2. "The petals bloom and clear to the pace of your reading — nothing here
   is meant to stay." / 꽃잎이 당신의 읽기에 맞춰 피고 집니다 — 여기엔 머무는 것이 없다.
3. "The blossom is beautiful because it falls. The code remembers its
   passing." / 꽃은 지기 때문에 아름답다. 코드는 그 덧없음을 기억한다 /
   花は散るから美しい。コードはその儚さを覚えている。

**Three banned words:** *magical* (it is physics, not magic — say "bloom"),
*sakura-season* marketing (no "spring sale", no festival copy), and
*ephemeral* used as a buzzword (show the fading, don't label it).

Grammar of the voice: short sentences, full stops, no exclamation marks.
The Korean is the speaking voice and is never translationese; the Japanese
is the source voice (the motif is Japanese at its root) and is given the
decorative role — vertical glyphs, verse markers, the seal; the English is
the quiet subtitle that translates without explaining.

## Do & Don't

**Do**

1. Route every color through a token; if a new shade is needed, thin the
   blossom or bank it, and name the result.
2. Give the Korean the speaking voice and the Japanese the source glyph in
   every pairing — read the Korean aloud; if it sounds translated, rewrite
   it as an observation.
3. Let the bloom be the only fast thing: the canvas may respond in
   milliseconds; everything else takes at least 700.
4. Keep the ink-to-petal transition the single signature — every other
   motion serves it.
5. Preserve the mono no aware: petals are not permanent. Anything that
   accumulates must also clear.

**Don't**

1. Don't put moss-ink text anywhere — it is 3.1:1, large or decorative only.
2. Don't add a second canvas signature — one bloom field. A second would
   make this a screensaver; one makes it a garden.
3. Don't animate layout — transform, opacity, filter, and the canvas field,
   nothing else.
4. Don't season the page beyond spring — no maple, no snow, no second
   motif. The garden's only subject is the blossom.
5. Don't let the trilingual drift into translationese — each language reads
   as written-in-that-language, or it is rewritten.
