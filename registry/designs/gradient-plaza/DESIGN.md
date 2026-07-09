# GRADIENT PLAZA — design spec

## Identity

A 24-hour radio station, FM 88.8, broadcasting from the second-floor
fountain court of a shopping mall that only exists between closing and
opening. Nobody works there; the PA system simply kept going. The page is
not *about* the station — it *is* the mall at 3:33 AM: the floor stretches
to a sunset that never finishes setting, the announcements keep announcing,
and the booth's windows are still open on a song for no one. The emotional
register is liminal-tender: the mall is glad you came, and it will not ask
why you are here. The Korean is not a translation layer; it is the same PA
voice, softer and a beat more direct (transcreation, never translationese).

Vaporwave is the family, discipline is the brand: one accent, measured
contrast, real typographic hierarchy. The nostalgia is art-directed, not
poured on.

## Palette

| Token | Hex | Role | Contrast (on deep-purple) |
| --- | --- | --- | --- |
| `void` | `#0d0518` | deepest layer: sky top, floor falloff, ticker, footer | — |
| `deep-purple` | `#1a0b2e` | page background — the mall after hours | — |
| `panel` | `#241040` | window bodies (body text 14.3:1 on it) | — |
| `sunset-pink` | `#ff71ce` | **the accent**: title, ON AIR, title bars, SIGNAL LOST | 7.5:1 (AA body, AAA large) |
| `cyan` | `#01cdfe` | grid light, times, buttons, focus ring | 9.9:1 (AAA) |
| `mint` | `#05ffa1` | live markers only: horizon, clock, track on air | 14.0:1 (AAA) |
| `violet` | `#b967ff` | small labels, borders, chrome — never long copy | 5.7:1 (AA) |
| `lavender-white` | `#efe6ff` | reading text, hero stars | 15.4:1 (AAA) |
| `haze` | `#c7b8e0` | secondary text: Korean glosses, captions, hints | 10.0:1 (AAA) |

Derived working token: `line` = violet @ 32% alpha — hairlines and borders,
decorative only. Rule of the sheet: **anything you must read is
lavender-white, haze, cyan, mint, or pink — nothing dimmer.** Dark text on
neon (title bars, pressed taskbar buttons) uses deep-purple/void and stays
above 5.7:1 across the whole pink→violet gradient.

## Type system

| Font | Source | Role |
| --- | --- | --- |
| Monoton | Google Fonts | Latin neon display — H1, section titles, footer sign-off. Display sizes only; it is signage, not a reading face |
| Gugi | Google Fonts | every Hangul glyph — the PA's Korean voice |
| Azeret Mono | Google Fonts | the console: body, labels, schedule, window chrome |

- Both working stacks are Latin-first with Gugi second (`Monoton, Gugi,
  sans-serif` / `Azeret Mono, Gugi, monospace`), so Hangul falls through
  into Gugi with no markup; `:lang(ko)` additionally zeroes the mono
  tracking and sets `word-break: keep-all`.
- Base size `clamp(15px, 1.1vw + 10px, 17px)`, line-height 1.65.
- Display: title `clamp(2.5rem, 8.6vw, 7.2rem)`; section titles
  `clamp(1.65rem, 4.2vw, 2.9rem)`; announcement lines
  `clamp(1.25rem, 3.2vw, 2.1rem)` in Azeret 500 uppercase — Monoton would
  collapse at paragraph length.
- Static neon halo on display type only: pink text-shadow at 22px/80px
  blur; body text never glows.

## Texture recipe

Everything is procedural; there is not a single image asset.

1. **The grid floor (canvas)** — dusk sky gradient (`void → deep-purple →
   #2b1152`), ~1 star particle per 6,500px² drifting leftward and
   twinkling on hashed phases, a sun of 2px slices lerping pink→violet
   with venetian-blind gaps that widen toward the horizon, cyan verticals
   converging on the vanishing point, cyan horizontals projected as
   `y = horizon + floorH · (0.92 / z)`, and a mint horizon line whose glow
   is `0.3 + 0.55 · energy`.
2. **The stage tile** — two crossed `repeating-linear-gradient`s, 1px of
   violet @ 6% every 32px over void: mall flooring, static, free.
3. **The smear** — cyan/pink pseudo-element ghosts on display headings,
   offset ±(0–7px) and faded 0–0.85 by scroll energy, `mix-blend-mode:
   screen`. The CRT only misbehaves when *you* rush.

## Motion vocabulary

| Name | Value | Used for |
| --- | --- | --- |
| scroll energy | attack 0.16 / release 0.05 per normalized frame; full at 2.4 px/ms | one number drives grid, ticker, smear |
| grid speed | 0.5 + 4.2·energy lane-units/s | the floor's rest drift and rush |
| aberration envelope | shift 0–7px, ghost 0–0.85 | heading smear |
| ticker speed | 42 + 300·energy px/s | the PA hurrying after you |
| drag inertia | pointer velocity kept, friction 0.9/frame, parks < 0.02 px/ms | window release |
| keyboard step | 24px, Shift 4px, Home respawns | window steering |
| on-air lamp | 2.4s ease-in-out opacity breath | the one ambient blink |
| progress loop | 292s linear scaleX(0→1) | the 4:52 song, looping until dawn |

Timing rules: chrome states (hover, raise, minimize) snap — retro OS chrome
does not ease. Only the lamp and the progress bar loop autonomously, on
mutually prime periods, and both die under reduced motion.

## Space & shape

- Rhythm derives from the 32px stage tile; window paddings and gaps are
  near-multiples of it.
- Containers: everything reads inside 1240px; announcements cap at 34ch,
  hero copy at 46ch.
- Section padding `clamp(72px, 12vh, 140px)`; the hero is exactly one
  viewport with content seated on the floor's lower third.
- Shapes are rectangles with hard 8px offset shadows (the Y2K drop), plus
  exactly one gradient per window (the title bar). Border radius exists
  only on the focus ring (2px) and the lamp (a circle).
- One accent geometry: a left border on announcement items; it thickens
  and turns pink on the final "for you" line, and the same pink dashes mark
  the SIGNAL LOST row — pink borders always mean *look closer*.

## Voice guide

**Five adjectives:** liminal · courteous · nocturnal · deadpan ·
quietly devoted.

**Three example lines:**

1. "Attention shoppers: the escalators run all night, for no one." /
   "안내 말씀드립니다 — 에스컬레이터는 밤새 운행합니다, 아무도 없이."
2. "The food court closes when you stop remembering it." /
   "푸드코트는 당신이 잊는 순간 문을 닫습니다."
3. "If you can hear this, the mall is open. For you." /
   "이 방송이 들린다면, 몰은 영업 중입니다. 당신만을 위해."

**Three banned words:** *vibes* (the mall predates them), *retro* (the mall
does not know it is the past), *sale* (nothing here is for sale anymore —
"special" is allowed, because the PA never learned to stop).

Grammar of the voice: announcements open with PA formality ("Attention
shoppers", "안내 말씀드립니다") and end somewhere lonelier; timestamps are
AM, always; the Korean line re-feels the observation instead of translating
it; the station never jokes about being a website.

## Do & Don't

**Do**

1. Route every color through a token, and check its ratio before it
   carries a single word — this palette is one careless hex from kitsch.
2. Let one number rule the motion: if it moves with scroll, it reads
   `energy`; do not invent a second envelope.
3. Keep Korean in Gugi everywhere, including inside window chrome and the
   ticker — one fallback-sans glyph breaks the whole PA.
4. Let chrome snap and entrances ease; a retro window that lerps its
   raise feels like a modal, not a desktop.
5. Write new copy as PA lines: formal opening, liminal turn, restraint.

**Don't**

1. Don't add a second accent story — mint is "live", pink is "look
   closer"; the moment they swap, both stop meaning anything.
2. Don't set body copy in Monoton or in violet; signage is not a
   paragraph and 5.7:1 is a label's ratio, not a page's.
3. Don't animate layout — windows move by transform, the floor moves by
   repainting a canvas, nothing else moves at all.
4. Don't let the aberration subtract: ghosts are `screen`-blended copies
   *behind* pointer-events, never a filter on the base text.
5. Don't play sound. The instant the radio is audible, the fiction — a
   broadcast you can only see — is gone.
