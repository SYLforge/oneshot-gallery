# STICKER — design spec

## Identity

A two-person design studio in Mapo, Seoul, est. 2024, that does branding,
websites, webtoons, and illustration — and treats every project like a
sticker book. The page is not *about* the studio — it *is* the studio's
desk mid-mess: a pile of die-cut stickers you are allowed (expected,
nagged) to grab and fling. The emotional register is a studio that is
extremely good at craft and refuses to be serious about it. The Korean is
not a translation layer; it is the studio's first voice — warmer, punchier,
and the language every sticker's label is written in first.

The design bet: playfulness reads as craft, not childishness, when the
physics is real. A sticker that springs back with two visible bounces earns
its fun. A sticker that just translates back is a colored box.

## Palette

| Token | Hex | Role | Contrast pairing |
| --- | --- | --- | --- |
| `ground` | `#fef8ee` | background — warm white, the desk | — |
| `ink` | `#1a1a1a` | chunky outline + all functional text, focus ring | 16.5:1 on ground (AAA) |
| `tangerine` | `#ff7a45` | lead sticker color, brand accent, wordmark fill, CTA hover, marquee row B | 2.5:1 on ground → **display/surface only**; carries ink at 6.7:1 |
| `tangerine-deep` | `#bf421a` | accent-as-text on ground: eyebrows, section-number stamps | 4.96:1 on ground (AA) |
| `sky` | `#5ec5ff` | sticker color, marquee row A, ::selection ground | carries ink at 9.0:1 |
| `lime` | `#9ade54` | sticker color, the READY / 괜찮아 voice | carries ink at 10.7:1 (AAA) |
| `grape` | `#a06bff` | sticker color, the cool counterweight, the CTA fill | carries ink at 5.0:1 (AA) |
| `lemon` | `#ffd84d` | sticker color, highlights, the ! in pop, the badge | carries ink at 12.6:1 (AAA) |
| `bubble` | `#ff5fa2` | sticker color, the candy-pink note, hearts, secrets | carries ink at 6.1:1 (AA) |
| `paper` | `#ffffff` | backing of paper decals (note, barcode) | — |

Contrast rule, stated once because it is the whole accessibility strategy:
**ink text passes AA on every saturated sticker fill** (5.0:1–12.6:1). The
chunky black outline and the label text are the same color doing the same
job. White text fails on all of them (max 3.48:1 on grape) and is reserved
for display. The accent tangerine is 2.5:1 on the ground, so it is never
functional text or a focus ring on the ground — `tangerine-deep` does that.
No gradients anywhere; the only "gradient" is the radial dot backing-sheet
pattern on the board, which is a hard-stop repeating field.

## Type system

| Font | Source | Role |
| --- | --- | --- |
| Black Han Sans | Google Fonts | Korean display — the wordmark 스티커, section titles, the giant footer shout, every sticker's big Korean label. The webtoon-cover voice. |
| Gaegu | Google Fonts | everyday Korean — captions, the note-paper hand, sticker sub-labels, the shout. A handwritten rounded face so every line reads ballpoint-on-sticker. |
| Fredoka | Google Fonts | English voice — the wordmark subtitle, English labels, marquee English, the ledger hand. Rounded, warm, chunky. |

- Every Latin stack lists the Korean face first (`Fredoka, Gaegu, sans`),
  and a `:lang(ko)` rule pins Gaegu (body) / Black Han Sans (display) so
  Hangul never falls through to a default sans. Korean is the page's first
  voice; the type system says so out loud.
- Wordmark `clamp(3.6rem, 17vw, 12rem)` at line-height 0.9 for the Korean,
  with the English deck at 0.345em of it. Section titles ride
  `clamp(1.7rem, 5vw, 3.2rem)`.
- The footer giant is the only place the palette inverts (ink ground) — the
  page ends on the back of the sticker sheet, peel-off residue and all.

## Texture recipe

Three static layers, none animated (a sticker is a physical object; it does
not shimmer). (1) Paper warmth: one fixed full-viewport SVG `<rect>` through
`feTurbulence` (fractalNoise, baseFrequency 0.9, 2 octaves, seed 3,
stitchTiles) into a `feColorMatrix` that zeroes RGB and scales alpha to 0.05,
`mix-blend-mode: multiply` at opacity 0.5 — the warm-white desk is paper,
not screen. (2) Backing-sheet dots on the board: a `radial-gradient` of
1.5px ink dots at 5% alpha every 28px — the peel-and-stick backing every
sticker is die-cut from. (3) Physical depth: every sticker carries an offset
solid drop-shadow (`0 5px 0 rgba(26,26,26,0.18)` at rest, `0 11px 0` while
grabbed) plus a 3px ink outline and 14px radius — zero blur, because a
sticker casts a hard shadow, not a haze.

## Motion vocabulary

| Name | Value | Used for |
| --- | --- | --- |
| spring-stiffness | 0.18 | the spring constant pulling a released sticker home |
| spring-damping | 0.40 | underdamped — ~2 visible bounces, settle ~590ms |
| fling-friction | 0.92 / normalized frame | initial momentum glide before the spring absorbs it |
| grab-torque | `vr += 0.5 × (vx·−gy + vy·gx)` | grab a corner and yank — it spins |
| pile-nudge | 0.35 of overlap, within 1.1× combined radius | dropped stickers shove neighbors into a pile |
| parallax-depth | pointer × {0.04, 0.08, 0.14, 0.20}, lerped `1−0.82^(dt/16.7)`, capped ±18px | the hero pile drifts at different rates |
| marquee-base | 0.05 px/ms (~50 px/s), rows opposed, sign = scroll direction | tickers |
| marquee-boost | +0.05 px/ms per unit scroll velocity, cap 0.30 | tickers |
| marquee-approach | `1−0.86^(dt/16.7)` | a direction flip skids, not teleports |
| reveal | 700ms ease-back, translateY(24px)→0, 90ms stagger | sections peel up |
| press | scale(0.94), 90ms in / 120ms out, ease-back | a sticker squished under a thumb |

The spring is the doctrine. Everything bouncy shares one integrator and one
damping curve — a sticker release, a keyboard nudge, and a press all feel
like the same hand. The only motion that is *not* a spring is the marquee's
exponential approach, which exists because a 0ms direction flip read as a
bug, not a decision.

## Space & shape

- The 3px ink outline is the atom: every sticker, every border, every focus
  ring. The radius is 14px (stickers) / 22px (the board) / 50% (stamps,
  badges) — rounded everywhere a sticker would be; sharp only on the
  full-bleed marquee rules and the footer top edge.
- Shadows are offset solids, never blurred: 5px rest / 11px grabbed. Blur is
  haze; stickers have none.
- Nothing decorative sits at 0° — stickers live between −10° and +11°. The
  wordmark floats at −3°. Functional running text (kicker, footer legal) is
  upright.
- Sections read at 1280px; the marquee band is full-bleed; section padding
  `clamp(56px, 9vh, 120px)`; hero is one viewport.

## Voice guide

**Five adjectives:** playful · warm · tactile · meme-literate · not cringe.

**Three example lines:**

1. "우리는 스티커를 만들어요. We make things that stick."
2. "안녕! hi, we make stickers"
3. "11:00–19:00 · 커피가 끓으면 시작 WE START WHEN THE COFFEE'S READY"

**Three banned words:** *professional* (we are, but saying so is the tell),
*curated* (we make stickers, we don't curate them), *seamless* (nothing
seamless sticks to anything).

Grammar of the voice: Korean first, English second, slammed together on one
line. The Korean is the warm original; the English is the gloss, allowed to
be drier. Stickers carry Korean-first labels (초록, 괜찮아, 비밀, 완료, 안녕,
좋아) — one or two syllables, the way you'd actually scribble on a sticker.
Exclamation marks are allowed and earned (뿅!, 안녕!, 완료!) because the
aesthetic is loud; periods are not.

## Do & Don't

**Do**

1. Route every color through the palette tokens; a new shade means a new
   sticker in the pack, and the pack has six plus ink and ground.
2. Put ink text on every saturated sticker — it is the one pairing that
   passes AA across the whole palette. White is display-only.
3. Let everything bouncy share the spring — a release, a nudge, a press all
   use the same integrator and damping curve.
4. Keep Korean first-class: Gaegu / Black Han Sans, natural word order,
   warmer than the English; read it aloud before shipping.
5. Rotate the decoration, square the information.

**Don't**

1. Don't let tangerine carry functional text or a focus ring on the ground
   (2.5:1). That is tangerine-deep's job.
2. Don't blur a shadow or fade an entrance with a long ease; stickers are
   physical — they pop, they spring, they don't dissolve.
3. Don't make the wordmark draggable — it floats; the decals around it are
   the grabbable pile. (See Known deviations in PROMPT.md.)
4. Don't add a third marquee row or a second wobble loop; playfulness reads
   as charm only while it is scarce.
5. Don't let the fiction wink at being a website. The studio believes it is
   a studio, and it wants your brief by Friday.
