# PIXEL — design spec

## Identity

PIXEL is a fictional indie arcade studio in Seoul that never stopped
making 32-kilobyte games. The page is the studio's own cabinet at 4 PM on
a Saturday in 2003: bright, saturated, optimistic — the CRT still warm
because somebody is definitely playing. The emotional register is the
opposite of vaporwave's dead-mall melancholy. There is no sunset that
never finishes; there is a lamp that is on because the room is in use.
The Korean is not a translation layer — it is the cabinet's other
marquee, written first in the cheerful, slightly boastful voice of an
arcade that is proud of its high-score table.

Retro-Y2K is the family, dopamine is the brand: one bubblegum accent,
measured contrast, and a single pixel language that runs from the hero
mascot to the smallest card thumbnail. The nostalgia is cheerful, not
wistful — this arcade is open.

## How this differs from gradient-plaza (vaporwave)

Both are dark, neon, CRT-adjacent sister families — and the gallery
enforces that they read as distinct from a corner crop. The split is
total, on every axis:

| Axis | gradient-plaza (vaporwave) | **pixel (retro-y2k)** |
| --- | --- | --- |
| Feeling | melancholic, liminal, 3:33 AM | cheerful, optimistic, 4 PM Saturday |
| Palette | mauve/pink/violet on deep purple | **bubblegum + cyan + acid + chrome on CRT black** |
| Hero | a perspective **grid floor** rushing to a striped sun | a **CSS box-shadow pixel sprite** mascot |
| Signature motion | scroll-velocity floor rush + drag-physics windows | **idle CRT breathe** + **two-frame sprite cycle** |
| Surface | a *place* (a mall) | a *screen* (a CRT playing a cabinet) |
| Mood line | "the escalators run all night, for no one" | "made for every quarter you spent" |

Where vaporwave is mauve and melancholic and built from a *grid* that
recedes, pixel is saturated and cheerful and built from *pixels* that
step forward. The two share a dark ground and a neon accent; they share
nothing else.

## Palette

| Token | Hex | Role | Contrast (on ground) |
| --- | --- | --- | --- |
| `ground` | `#0a0a12` | the CRT ground — page background | — |
| `void` | `#050509` | deeper than ground — footer, marquee, sprite stage | — |
| `panel` | `#14141f` | card / cabinet bodies | — |
| `bubblegum` | `#ff3d8a` | **the accent**: title, INSERT COIN, marquee marks, sprite cheeks | 5.9:1 (AA) |
| `cyan` | `#00e5ff` | links, focus ring, hi-score digits, screen bezel | 12.8:1 (AAA) |
| `acid` | `#fff44f` | live markers, the POWER lamp, score highlights | 17.2:1 (AAA) |
| `mint` | `#4dff9f` | CONTINUE, secondary accent, level-clear green | 15.1:1 (AAA) |
| `violet` | `#b967ff` | small labels, borders, chrome — never long copy | 6.0:1 (AA) |
| `chrome` | `#c8d0d8` | **reading text** — the one color long copy is allowed to be | 12.7:1 (AAA) |
| `haze` | `#8a93a8` | secondary text, captions, Korean glosses | 6.6:1 (AA) |

Derived working token: `line` = violet @ 28% alpha — hairlines and
borders, decorative only. Rule of the sheet: **anything you must read is
chrome, haze, cyan, acid, or mint; bubblegum (5.9:1) and violet (6.0:1)
are spent on display and labels, not body paragraphs.** Dark text on
neon (button labels) uses ground and stays above 5.9:1.

## Type system

| Font | Source | Role |
| --- | --- | --- |
| Press Start 2P | Google Fonts | Latin pixel display — wordmark, section titles, signage, INSERT COIN. Display sizes only; it is a bitmap redraw, not a reading face |
| Gugi | Google Fonts | every Hangul glyph — the cheerful Korean display voice of an arcade cabinet |
| VT323 | Google Fonts | the CRT console — body, labels, credits, the only face allowed near paragraph length |

- Both working stacks are Latin-first with Gugi second
  (`Press Start 2P, Gugi, monospace` / `VT323, Gugi, monospace`), so
  Hangul falls through into Gugi with no markup; `:lang(ko)` additionally
  zeroes tracking and sets `word-break: keep-all`.
- Base size `clamp(15px, 1vw + 11px, 18px)`, line-height 1.55.
- Display: hero title `clamp(3rem, 14vw, 9rem)`; section titles
  `clamp(1.5rem, 4vw, 2.6rem)`; card titles stay at Press Start 2P's
  readable floor (~0.92rem) because the bitmap face collapses at large
  paragraph sizes.
- Static bubblegum halo on display type only: text-shadow at 22px/70px
  blur plus a hard `4px 4px 0 void` pixel drop; body text never glows.

### Honest note on the Korean pixel face

The brief asked for **DungGeunMo** (둥근모, the canonical Korean bitmap
pixel face). DungGeunMo is **not in the Google Fonts registry** —
verified against `next/font`'s own `font-data.json`, the metadata
`next/font/google` validates against at build time. Loading it would
require `next/font/local` with a shipped binary `.woff2`, which violates
this entry's `media.source: "code"` / zero-media discipline (and the
brief's "No image payload. Budget 0."). The closest *legally loadable*
Korean display face on Google Fonts with a retro register is **Gugi** —
the same face gradient-plaza uses for its Korean voice — chosen here for
its round, cabinet-marquee cheer. This substitution is documented
honestly in `tokens.json`, the breakdown, and `PROMPT.md` Known
deviations (rubric gate G4). Pixel-art intent is preserved through the
Latin pixel face (Press Start 2P) and the literal pixel sprites; the
Korean reads in a complementary retro display register.

## Texture recipe

Everything is procedural CSS; there is not a single image asset.

1. **The pixel sprites (box-shadow)** — every sprite (hero mascot, card
   thumbnails, coin/heart/star icons) is a 1px×1px anchor element whose
   `box-shadow` is a list of `${x}px ${y}px 0 0 ${color}` tuples, one per
   lit pixel. A 200-pixel mascot is a single DOM node. `image-rendering:
   pixelated` keeps any scaling crisp-blocky. The sprite palette is a
   named map (`SPRITE_PALETTE`), so every rendered color is a token.
2. **The CRT overlay (scanline + vignette)** — a fixed 3px-period
   `repeating-linear-gradient` scanline grille over the viewport at 16%
   opacity (`mix-blend-mode: multiply`), plus a radial vignette darkening
   the screen edges. The grille breathes 0.16→0.22 opacity at ~11Hz via
   JS (subtle, never seizure-risk); reduced motion renders it static.
3. **The hero bloom + floor** — three radial dopamine blooms (bubblegum,
   cyan, violet) behind the mascot, plus a 16px conic-checker pixel-tile
   floor fading up from the bottom edge — the arcade carpet, free.
4. **The smear** — cyan/magenta pseudo-element ghosts on display
   headings, idle-breathing ±1px at 6s and snapping to ±3px on scroll
   rush, `mix-blend-mode: screen`. The CRT only smears when *you* move,
   and breathes softly when you do not.

## Motion vocabulary

| Name | Value | Used for |
| --- | --- | --- |
| sprite-cycle | 2 frames, 0.42s steps | the mascot blinks on idle |
| crt idle breathe | aberration ±1px, 6s ease-in-out infinite | the screen is alive at rest |
| scroll-rush envelope | shift 0–3px, ghost 0–0.9 at 2.4 px/ms; attack 0.16 / release 0.05 | heading smear on scroll |
| scanline flicker | grille opacity 0.16 → 0.22, ~11Hz | the CRT breath |
| marquee speed | 44 + 240·energy px/s | chiptune credits scroll |
| lamp breath | 2.4s ease-in-out opacity 1 → 0.4 → 1 | the POWER / NOW PLAYING lamp |
| card press | translateY(2px) on :active, no easing | arcade buttons snap |
| focus ring | 2px cyan + 5px bubblegum halo + 18px cyan glow, instant | keyboard signage |

Timing rules: arcade chrome snaps — hover lift and card press have no
easing (0.08s linear read as instant). The lamp, the idle breathe, the
sprite cycle, and the scanline flicker loop autonomously on mutually
prime periods, and all die under reduced motion.

## Space & shape

- Rhythm derives from the 4px pixel grid; paddings and gaps are
  near-multiples of it.
- Containers read inside 1180px; hero lede caps at 52ch.
- Section padding `clamp(64px, 10vh, 120px)`; the hero is exactly one
  viewport with content centered on the bloom.
- Shapes are hard rectangles with hard offset shadows (`5px 5px 0 void`)
  — the Y2K drop. Border radius is zero everywhere (pixel language has
  no curves); the only non-square is the lamp (a square block) and the
  focus ring (still square, just outlined).
- One accent geometry: each catalog card carries its game's accent color
  as a 2px frame; status chips (`OUT NOW` mint / `SOON` acid / `BETA`
  cyan) carry meaning in both color and text, so the distinction survives
  without color.

## Voice guide

**Five adjectives:** cheerful · saturated · competitive · a little
boastful · warmly devoted.

**Three example lines:**

1. "An indie studio for games that fit in 32 kilobytes and a single
   afternoon." / "32킬로바이트와 한 오후면 충분한 게임을 만드는 인디 스튜디오."
2. "Thanks for playing." / "플레이해 주셔서 감사합니다."
3. "Made for every quarter you spent." / "당신이 넣은 모든 동전을 위해 만들었습니다."

**Three banned words:** *nostalgia* (the arcade does not know it is the
past — it is open), *retro* (same reason), *lo-fi* (these games are
*finished*, just small). "Pixel" is allowed — it is a material here, not
a mood.

Grammar of the voice: copy opens with arcade confidence ("OUT NOW",
"INSERT COIN"), the Korean line re-feels the boast rather than
translating it, scores are specific and fictional, and the studio never
apologizes for being small.

## Do & Don't

**Do**

1. Route every color through a token, and check its ratio before it
   carries a word — dopamine dies into kitsch one careless hex at a time.
2. Keep the pixel language consistent: every sprite is one box-shadow
   grid, every surface snaps, every shadow is a hard offset.
3. Let Korean live in Gugi everywhere — marquee, cards, footer — one
   fallback-sans glyph breaks the cabinet.
4. Let chrome snap and only the lamp/breathe/sprite loop; an arcade
   button that eases its press feels like a website, not a cabinet.
5. Make motion that is alive at rest: the CRT breathes even when nobody
   is scrolling, because the room is in use.

**Don't**

1. Don't drift into vaporwave — no mauve, no receding grid, no melancholy.
   If a color reads as "liminal," it is wrong for this family.
2. Don't set body copy in Press Start 2P or in bubblegum/violet; a
   bitmap face is not a paragraph and 5.9–6.0:1 is a label's ratio.
3. Don't animate layout — sprites swap box-shadow data, headings move by
   transform on pseudo-elements, nothing repaints a layout property.
4. Don't let the aberration subtract: ghosts are `screen`-blended copies
   behind pointer-events, never a filter on the base text.
5. Don't ship a DungGeunMo binary to chase a "true" Korean pixel face —
   zero-media is the entry's discipline; Gugi carries the Korean voice
   honestly.
