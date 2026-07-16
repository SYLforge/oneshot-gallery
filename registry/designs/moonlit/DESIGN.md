# MOONLIT — design spec

## Identity

달빛 배달 (MOONLIT) — a late-night food delivery service that runs from 10 PM
to 4 AM and treats its own work as a webtoon. The page is one chapter list,
one order: chapter 01 the rider leaving, 02 the rider as a person, 03 the
live tracker, 04 the empty street between deliveries, 05 the handoff at
dawn, 06 the hours. A single order is the entire page; the visitor is the
reader of one webtoon chapter.

The emotional register is lonely and contemplative, not cheerful. This is
the 2 AM city — half of it asleep, the other half awake and alone. The
rider is the only moving thing on screen, and the only warmth in the page
is the meal he is carrying. The Korean is first-class literary copy, never
translationese.

This entry is the cold twin of PPANG! — PPANG!'s warm dawn bakery is
orange and bread and morning light; MOONLIT's cold night delivery is
indigo and neon and streetlamp halos, with a single amber note reserved
for the moment a warm meal changes hands. Both are webtoon, but a person
who saw only a corner crop of either could tell them apart instantly.

## Palette

| Token | Hex | Role | Contrast pairing (on night-deep) |
| --- | --- | --- | --- |
| `night-deep` | `#0b1020` | background base — the deep indigo of a fully-asleep city | — |
| `night-mid` | `#131a2e` | secondary surface — panels, cards, the slight lift above the page | — |
| `night-high` | `#1a2240` | hover surface, raised card edges | — |
| `moonlight` | `#e8edf5` | primary text — soft off-white, a window with one lamp on | 16.1:1 (AAA) |
| `moonlight-dim` | `#9aa6c2` | secondary text — Korean glosses, captions, the rider's inner voice | 7.8:1 (AA+) |
| `neon-blue` | `#4da8ff` | **the cold accent** — neon signs, streetlamp halos, focus ring, selection, headlight glow, active status | 7.5:1 (AAA, normal text) |
| `neon-blue-bright` | `#7cc4ff` | neon at full draw — the lit stroke of an SVG neon sign that has just been switched on | 10.1:1 — large type / non-text only |
| `ember-amber` | `#e89b4c` | **the single warm note** — reserved for the meal, the handoff, dawn. Appears once per viewport at most | 8.3:1 (AAA) |
| `ember-bright` | `#ffba6a` | dawn at full bloom — large/non-text only (11.0:1 on the handoff ground) | — |
| `steel` | `#828cb0` | metadata — chapter numerals, eyebrows, inactive delivery steps, the timestamp of a city that has not woken up | 5.7:1 (AA, normal text) |
| `hairline` | `#27304a` | decorative rules — moonlight at ~12% over night-deep; never carries text | — |

The rule that holds the whole page together: amber is a chapter, not a
colour scheme. It appears only on the handoff panel (chapter 05) and on
the warm eyebrow line that introduces it. Everything else is cold indigo +
one neon blue. Count amber on screen at any moment: it should be zero, or
it should be the entire handoff viewport — never a little bit of warmth
decorating the cold UI. That single move is what makes the handoff feel
like dawn rather than a styled card.

Blue carries normal text safely (7.5:1, AAA), so it is allowed on small
labels, the active status, and section eyebrows — unlike HALFLIGHT's red,
which is restricted to large type. This is a deliberate departure: this
page wants its cold accent to be a working UI colour, because the page is
half delivery-tracker and half webtoon, and the tracker half needs the
accent to mark active state.

## Type system

| Font | Source | Role |
| --- | --- | --- |
| Gugi | Google Fonts | the splash — the wordmark `달빛`, the handoff headline. A Korean display face with webtoon-title weight; used sparingly |
| Noto Sans KR | Google Fonts | the prose voice — every Korean line of poetry, status, caption, the rider's interior monologue |
| Space Grotesk | Google Fonts | English display — the MOONLIT wordmark in Latin, chapter numerals, section heads, body English |
| Space Mono | Google Fonts | the machine — delivery tracker timestamps, order numbers, every line that belongs to the app rather than the story |

- Body stack `Space Grotesk, Noto Sans KR, system-ui` lets Hangul fall
  through the Latin face with no markup; `:lang(ko)` pins Noto Sans KR,
  zeroes tracking, and sets `word-break: keep-all`.
- Mono stack `Space Mono, Noto Sans KR, monospace` keeps the Korean in
  its own face even inside machine text — a delivery status line is half
  machine (timestamp, order #) and half human (잘 드세요), so the two
  ride different stacks.
- The hero wordmark sits at `clamp(3.2rem, 13vw, 8rem)` with a Korean
  subtitle `달빛` underneath in Gugi at 0.42em — the Korean is the small
  signature under the big English name, the way Naver Webtoon titles do
  it.
- Section heads `clamp(1.7rem, 3.6vw, 2.8rem)` with a Korean subtitle
  block at 0.52em in moonlight-dim. The handoff title alone breaks the
  rule: it is set in Gugi, in amber-bright, the page's one display
  moment.
- Mono is always small (0.7–0.85rem) and tracked (0.08–0.28em): machine
  text is read at a distance.

## Texture recipe

Three layers, all CSS / SVG, all dead under reduced motion:

1. **Base gradient** — a single page-wide `radial-gradient(140% 90% at 50%
   0%, #161e3a, transparent 55%)` over `linear-gradient(night-deep →
   night-mid)`. The sky over an empty city. Never animates.
2. **Moon disc** — a single CSS radial-gradient disc, `clamp(72px, 9vw,
   128px)` high on the hero's right edge, with a soft blue box-shadow
   halo. Static. The moon is the page's quietest anchor.
3. **Per-panel vignettes** — each image panel gets a two-stop radial +
   linear gradient vignette that darkens the bottom and corners, so the
   illustrations read as panels cut into the night rather than
   photographs laid on top.

The handoff panel adds one more layer: an `ember-amber` radial bloom
leaking in from the right edge, opacity 0 → 1 over 1800ms when the panel
enters view — dawn arriving through the door.

## Motion vocabulary

| Name | Value | Used for |
| --- | --- | --- |
| `ease-night` | `cubic-bezier(0.22, 1, 0.36, 1)` | reveals and neon draws — settle as the eye adjusts to the dark |
| `neon-flicker` | 3.7s `steps(1, end)` infinite across three brightness stops | the tired-tube flicker of a neon sign that has been on since dinner |
| `neon-draw` | `stroke-dashoffset` 1400ms ease-night per sign, 180–460ms stagger between the two street signs | signs brighten + draw themselves on scroll-in |
| `status-type` | 55–60ms per glyph with a 540ms-blink cursor | each delivery status types itself out like a tracker update |
| `headlight-trail` | linear-gradient streaks `translateX -50%` at 5.4s / 3.6s linear infinite, opacity scrubbed by IO | speed lines for a moving rider |
| `moon-drift` | (deferred — single-paint moon, no drift) | — |
| `chapter-rise` | folded into `reveal`: 600ms ease-night, translateY(18px)→0, 70ms stagger | panels lift into the frame |
| `ember-bloom` | 1800ms ease-out-soft radial-gradient opacity 0 → 1 on the handoff panel | the warm note arrives slowly, the way dawn does |
| `cursor-blink` | 540ms `steps(1, end)` infinite | the typing cursor while a status is mid-update |
| `pulse-dot` | 2s ease-in-out infinite | the hero's live indicator |

Timing rule: every ambient cycle (3.7s flicker, 5.4s trail, 540ms blink,
2s pulse) shares no common divisor — the night never visibly loops.

## Space & shape

- The master column is `min(1180px, 92vw)`; prose sections read at 900px.
- Section padding `clamp(60px, 12svh, 150px)`; the hero is one viewport.
- Panels are rectangles with 2px border-radius and 1px hairlines. The
  only circle on the page is the moon; the only glowing circle is the
  tracker's progress node. No drop shadows except the handoff panel's
  card-shadow and the neon-tube SVG glow filter.
- The hero portrait is masked top and bottom by a soft alpha gradient,
  so the page's night ground shows through above and below the image —
  the rider floats in the indigo rather than sitting in a frame.
- The street panel is `1024 / 768` landscape — the only landscape panel
  on the page, deliberately, because it is the panel where the city
  opens up around the rider.

## Voice guide

**Five adjectives:** lonely · nocturnal · tender (about the meal only) ·
deadpan (about the tracker) · cinematic.

**Three example lines:**

1. "도시가 잠든 2시, 당신의 따뜻한 한 끼를 배달합니다." / "At 2 AM, when
   the city sleeps, we deliver your warm meal." (the hero)
2. "아무도 없다. 가로등만, 그리고 나." / "There is no one. Only the lamps,
   and me." (the rider's interior on the empty street)
3. "잘 드세요. — 좋은 밤 되세요." / "EAT WELL. — GOOD NIGHT." (the
   signoff at the handoff)

**Three banned words/phrases:** *fast* (the page's point is that this is
slow, lonely work), *always* (we close on Seollal and Chuseok — say so),
*cinematic* (the page must be it, never say it).

Grammar of the voice: the Korean is written first, literary, with its own
rhythm — never a translation of the English. The English rides underneath
each Korean block in moonlight-dim italic. Machine text (mono) states
facts: timestamps, order numbers, distances, hours. The machine never
gets tender; the prose never gets chirpy.

## Do & Don't

**Do**

1. Count amber on screen. At any moment, it should be zero, or it should
   be the entire handoff viewport. Anything in between is wrong.
2. Keep blue working. Blue is allowed on normal text (4.7:1), so use it
   for active state, the live indicator, the section eyebrows. This is
   what makes the page read as a delivery app, not just a webtoon.
3. Treat the four illustrations as panels, not photographs. Vignette
   them, frame them, mask them — they are moments in a chapter, not a
   catalogue.
4. Let the machine half and the human half share the page. The tracker
   is half the design's identity; the rider's interior monologue is the
   other half. Neither swallows the other.
5. Type the Korean. The typewriter is not a gimmick — a real delivery
   tracker updates live, and Korean typed letter-by-letter reads as
   "the tracker just updated", not as "the page is decorating".

**Don't**

1. Don't warm the cold UI. The operating hours, the coverage list, the
   call-to-order button — all steel or blue. Amber is a chapter, not a
   tint.
2. Don't animate layout — transform, opacity, stroke, filter only. The
   marquee is a transform; the neon draw is a stroke; the bloom is an
   opacity.
3. Don't lie about the order. The tracker advances as you scroll, not as
   time passes — the page must be honest that you are the reader, not
   the customer.
4. Don't soften the loneliness. PPANG!'s cheer is the twin, not the
   model. The rider is tired; the street is empty; the meal is the only
   warm thing. Hold that line.
5. Don't crowd the hero. The rider image, the moon, the wordmark, and
   one status line — that is the whole viewport. Anything more is
   noise.
