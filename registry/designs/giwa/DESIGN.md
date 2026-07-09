# GIWA — 처마 아래 단청 · design spec

## Identity

A palace-eave restoration guild that documents what it repaints. The page
is catalog plate no. 08 from the guild's 단청도감 — not a website about
dancheong but a working document *of* it: the color system first, then the
patterns, then the method, then the sign-off. The emotional register is a
museum label written by someone who has actually held the brush — dignity
without distance. Korean is the document's own language; English is the
visiting scholar's pencil note beneath each line. The fiction never winks,
never exoticizes: this is heritage as a working system, with real pigment
names, real sequence, real geometry.

## Palette

| Token | Hex | Role | Contrast on hanji `#f4eee1` |
| --- | --- | --- | --- |
| `hanji` | `#f4eee1` | background — the paper | — |
| `heuk` | `#1f1c19` | 흑 · 먹 — body text, ink lines, meokgihwa outlines | 14.7:1 (AAA) |
| `seokganju` | `#8a3b2a` | 적 · 석간주 — the accent: focus ring, ::selection, links, columns | 6.6:1 (AA+) |
| `samcheong` | `#2f5d9e` | 청 · 삼청 — bands, knots, fret ribbon; may carry text | 5.7:1 (AA) |
| `noerok` | `#58796f` | 뇌록 — ground-coat surfaces, large/decorative only | 4.2:1 — never body text |
| `noerok-deep` | `#3e5850` | derived: all secondary text (EN notes, glosses, captions) | 6.7:1 (AA+) |
| `hwang` | `#d9a441` | 황 · 석황 — seed-pods, gilt dots, the bell; **decorative only on hanji** | 2.0:1 (7.5:1 on heuk) |
| `baek` | `#f7f3e8` | 백 · 호분 — breath lines in the art, card grounds; never text | — |
| `tile` | `#3f3a34` | derived from heuk: the fired-clay roof plane | — |

Derived working tokens: `hanji-deep #ece4d0` (method stage), `clay #4b453e`
(tile-end discs), `line rgba(31,28,25,.26)` (hairlines), and
`--giwa-accent-live` — the one variable the obangsaek section is allowed to
retint (default seokganju; baek falls back to noerok-deep so the accent
never vanishes on paper).

Color law: pigment never eases. Accent swaps, hovers, and state changes are
instant; only transform, opacity, clip-path, and stroke-dashoffset animate.

## Type system

| Font | Source | Role |
| --- | --- | --- |
| Song Myung | Google Fonts | KR display serif — the hero 단청, section titles, hanja, step numerals |
| Gowun Batang | Google Fonts | KR body serif — every paragraph; the museum-label hand |
| Fraunces | Google Fonts | Latin accents only, applied via `[lang="en"]` — subtitles, folios, construction notes |

- The root carries `lang="ko"`; every English run is marked `lang="en"`
  and drops into Fraunces automatically. Korean is never the styling
  exception here — English is.
- Base size `clamp(16px, 0.5vw + 14px, 19px)`, line-height 1.78 — batang
  faces want air.
- Display: hero `clamp(4.2rem, 17vw, 12rem)` at line-height 1.02 (two
  glyphs, carved); section heads `clamp(1.7rem, 3.4vw, 2.5rem)`; weight
  400 everywhere — a brush has one weight.
- Translation notes run at 0.85–0.9em in noerok-deep: present, quieter.

## Texture recipe

Hanji in two registers, all of it feTurbulence, none of it animated:

1. **Page sheet** — one fixed full-viewport rect: fractalNoise
   `baseFrequency 0.75`, 2 octaves, alpha ≈ 0.07 via feColorMatrix,
   `mix-blend-mode: multiply`, opacity 0.55. Paper fiber under everything.
2. **Method stage** — three multiplied layers over `hanji-deep`: coarse
   fiber (0.9), long horizontal fiber (anisotropic `0.008 0.18` — the
   mulberry grain has a direction), sparse fleck (turbulence 0.05). Each
   layer drifts with the pointer at depth 4 / 8 / −5 px (one layer moves
   against the others), driven by two normalized custom properties from a
   lerped rAF hook and capped in CSS. Absent on touch; frozen flat under
   reduced motion.

## Motion vocabulary

| Name | Value | Used for |
| --- | --- | --- |
| `ease-out` | `cubic-bezier(0.16, 1, 0.3, 1)` | scroll reveals, note appear |
| `ease-brush` | `cubic-bezier(0.45, 0.05, 0.35, 1)` | ink draws — steady through the stroke |
| `ease-flood` | `cubic-bezier(0.6, 0, 0.18, 1)` | color floods — commits early, rests long |
| hero draw | ridge 0s → hooks .25 → hips .3 → courses .38+.045i → eave .55 (1.5s) → beam .95 → columns 1.15 → dot rows 1.3/1.5 | the roofline drawing itself |
| hero flood | `inset(0 100% 0 0) → inset(0)`, 1.6s, delay 2.05s | line art taking its colors |
| motif draw | 0.9s per path, `--d` stagger .03–.12s, at scroll-into-view | the 초 construction layer |
| motif flood | bloom `circle(0%→78%)` · sweep from left · drop from top, ~1s, delay .75s | medallion / beam·fret / bell |
| reveal | 0.65s, translateY(18px)→0, 90ms batch stagger | all copy |
| parallax lerp | 0.09 / 60fps-normalized frame, depths 4/8/−5px | hanji layers |
| pendulum | θ″ = −16θ − 2.1ω; impulse 0.011·Δy clamped ±0.9; θ ≤ 0.24 rad | the norigae on scroll |

Choreographic rule: ink before color, always — the page repeats the
guild's own sequence (출초 → 채색) at every scale, from the hero to the
smallest motif.

## Space & shape

- Content column 1160–1240px; long text capped at 640–720px.
- Section padding `clamp(72px, 11vh, 140px)`; the hero is one viewport
  with the roofline pinned to its bottom edge.
- Shapes are rectangles and compass work. Border-radius ≤ 3px (only where
  the SVG art itself wants it); cards are hairline-bordered `baek` panels.
- Rules carry meaning: solid heuk 2px opens the method steps and the
  footer; dotted hairlines separate records; the accent-live 3px segment
  underlines every section head.
- The roofline is the only full-bleed-feeling element; everything else
  sits in the column like plates in a book.

## Voice guide

**Five adjectives:** dignified · precise · unhurried · devotional-without-
piety · bilingual-by-courtesy.

**Three example lines:**

1. "단청 — 나무를 지키고, 위계를 말하고, 아름다움을 남긴다." /
   "Dancheong: it protects the wood, states the hierarchy, and leaves
   behind beauty."
2. "빛넣기 — 색과 색 사이에 놓이는 흰 숨이다." / "Bitneoki, the white
   breath laid between colors."
3. "오늘도 처마 밑에서 단청은 마르고 있다." / "Under the eaves, the paint
   is drying still."

**Three banned words:** *oriental* (obviously), *mystical* (it is a
technique, not a mood), *timeless* (the guild counts every year — that is
the point).

Grammar of the voice: Korean sentences end firmly (…한다, …이다) — label
prose, not lyric; the English is a translation *note*, one register
quieter, never longer than its Korean. Technical terms stay in Korean with
hanja only where the hanja is real.

## Do & Don't

**Do**

1. Route every color through a token; derive and name new shades (as
   noerok-deep was) rather than eyeballing.
2. Keep the ink-then-color order in any new animation — construction
   before pigment is the page's grammar.
3. Build new motifs as one unit + symmetry (rotate / mirror / translate),
   with heuk outlines and baek breath lines, and say so in a construction
   note.
4. Keep hwang scarce. Wherever it lands becomes the center of attention —
   that is its job in real dancheong.
5. Write Korean first, then translate down — never the reverse.

**Don't**

1. Don't paint the roof plane. Fired clay stays gray; dancheong lives
   under the eave. The restraint is the authenticity.
2. Don't transition color. Pigment snaps; only geometry eases.
3. Don't add a dragon, a taegeuk, or anything the page hasn't earned —
   ornament without structural purpose is exactly what dancheong isn't.
4. Don't let the English lead a single section, and don't let it grow
   longer than the Korean it translates.
5. Don't soften the document into a mood board — no gradients, no blur
   panels, no parchment-colored nostalgia filters. The paper is texture
   enough.
