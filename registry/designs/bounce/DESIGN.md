# BOUNCE — design spec

## Identity

**통통 BOUNCE** is a tiny story studio in Mapo, Seoul, behind a round door,
that makes picture books, story apps, and small games for the under-seven
crowd. The page is not a portfolio — it is the studio's own personality:
everything on it is made of rubber. Press a button and it squashes wide
and short; let go and a spring snaps it back with a small overshoot.
Headline letters bounce up one by one. Picture-book cards pop in when you
reach them. Soft pastel shapes drift toward your pointer like balloons on
a string. The emotional register is a grown-up who genuinely likes kids
and refuses to talk down to them — warm, a little silly, never squeaky.
The Korean is the first voice: 통통 (tong-tong, the Korean onomatopoeia
for *boing boing*) is the whole brand, and the English is the caption
under it.

### Distinction from STICKER (the 1st playful-pop entry)

STICKER is **grabbable, draggable** — you seize an object and move it
around the page; the interaction is *you act on the world*. BOUNCE is
**reactive, springy** — you never drag a thing. You touch a button, it
squashes and springs back. You scroll to a card, it bounces in to greet
you. You move your pointer, the background drifts toward it. The whole
page responds to you; nothing waits to be picked up. Same family (soft,
playful, springy motion, Korean-first), opposite posture: **STICKER is a
hand grabbing; BOUNCE is a rubber world bouncing back at you.** No
drag-pointer capture, no inertial fling, no scatter layout — the three
techniques here (`spring-press`, `char-split-reveal`, `pointer-parallax`)
are all reactive, none are manipulative.

## Palette

| Token | Hex | Role | Contrast pairing |
| --- | --- | --- | --- |
| `butter` | `#fdf2c9` | page background — the warm book page | — |
| `cream` | `#fff8e6` | lightest wash — hero sky, card art fills | ink 12.3:1 (AAA) |
| `sky` | `#bfe3ff` | card surface A | ink 9.7:1 (AAA) |
| `peach` | `#ffd0b0` | card surface B | ink 9.2:1 (AAA) |
| `grape` | `#d9c2ff` | card surface C | ink 8.1:1 (AAA) · plum 3.6:1 (AA large only) |
| `cloud` | `#ffffff` | cloud shapes, lightest card | ink 13.0:1 (AAA) |
| `ink` | `#3a2a4d` | all primary text + outlines + the squash edge | 8.1–13.0:1 on every pastel (AAA body) |
| `ink-soft` | `#5b4a6e` | secondary text, captions, English sublines | 4.95:1 minimum (AA body, weakest on grape) |
| `plum` | `#7a4fb8` | accent text, links, the wordmark fill, focus ring | 4.10–5.77:1 (AA body except 3.60:1 large-only on grape) |
| `accent` | `#ff8a5c` | the CTA surface + the spring's blush — **never text** | 1.45–2.32:1 as text (fails); carries ink type at 5.59:1 |

Two rules keep the palette honest. First, **pastels are surfaces, ink is
the voice**: every pastel token carries ink text at AAA (8:1 or better),
so a butter button and a grape card and a peach chip are equally legible.
Second, **accent orange `#ff8a5c` is decorative only** — it fails as text
on every pastel (1.45–2.32:1) and is reassigned: it is the CTA fill (ink
type on it holds 5.59:1), the spring's blush, and the floating shapes'
warm tone. When an accent *word* is needed, plum is used instead.

## Type system

| Font | Source | Role |
| --- | --- | --- |
| Fredoka | Google Fonts | Latin display + body — the chunky rounded sans; every English word |
| Gaegu | Google Fonts | every Hangul glyph — a hand-drawn rounded Korean face |

- The display stack is `Fredoka, Gaegu, sans-serif`, so a Hangul glyph
  inside a Fredoka headline falls through into Gaegu with no markup; the
  `:lang(ko)` rule additionally pins Gaegu, sets weight 700 (Gaegu's
  hand-drawn strokes need the bold to read at display size), keeps words
  whole (`word-break: keep-all`), and gives hangul its own line rhythm.
- One Korean face everywhere is the art direction: the studio writes
  everything — titles, captions, age tags, the footer — in the same
  rounded hand.
- Wordmark: 통통 at `clamp(3.4rem, 16vw, 9rem)` in Gaegu/plum above
  BOUNCE at `clamp(3rem, 15vw, 8.5rem)` in Fredoka/ink. The Hangul is the
  loud line; the English is the caption-sized one — the opposite of most
  bilingual sites, on purpose.

## Texture recipe

Softness is the only texture — there is no grain, no noise, no scanline.
Depth comes from two things, both committed to everywhere:

1. **Rounded everything.** `border-radius` scales from 12px (focus ring,
   age chips) through 28px (cards) to 999px (pills, blobs). There is not
   a single sharp corner on a pressable thing.
2. **Soft offset shadows.** No blur fog — instead a layered stack:
   `0 3px 0 rgba(ink,.10), 0 10px 22px rgba(ink,.14)`. The first step is
   a crisp rubber contact line; the second is the soft cast. It reads as
   a rubber object resting on the page, not a drop-shadow filter.

Pastel surfaces are flat fills; a single 3px ink outline on pressable
things (buttons, cards) gives the squash-and-stretch an edge to deform
against — when a button squashes, you see the outline flex with it.

## Motion vocabulary

| Name | Value | Used for |
| --- | --- | --- |
| spring-press (press) | `scale(1.12, 0.82)` in ~1 frame, then critically-underdamped spring back: stiffness 380, damping 14, mass 1 — ~6% overshoot, settles ~520ms | buttons, cards |
| spring-stiff (card) | stiffness 220, damping 18, mass 1 | bounce-in settle after reveal |
| char-reveal | per-glyph `translateY(34px→0) + scale(.5→1)` via underdamped spring (320 / 12 / 1), staggered 55ms/glyph | headlines |
| card-pop | cards `translateY(30px→0) + scale(.92→1)` with spring-stiff, batch-staggered 90ms | book shelf |
| float-drift | shapes lerp toward pointer × depth 0.04–0.18, lerp 0.06/frame (60fps-normalized), capped ±30px | floating shapes |
| bob | idle ambient: shapes bob ±6px on mutually-prime 4.6–9.8s periods; the hero hint bobs ±6px at 3.6s | everywhere |

The spring is doctrine. A critically-underdamped spring (damping just
under critical) overshoots once and settles — that single overshoot is
the *boing*. Semi-implicit Euler integration (`v += a·dt; x += v·dt`)
keeps it stable under frame drops, and `dt` is clamped to 48ms so a
background tab resuming never slingshots a button. Everything animated is
`transform` (translate + scale) — no layout, no paint properties.

## Space & shape

- The pill is the atom: 999px radius buttons, 28px radius cards, 12px
  radius chips and focus rings. Blobs are organic SVG paths; stars are
  chunky 5-pointers with rounded joins.
- Outlines are 3px ink on every pressable surface (buttons, cards) and
  2px ink/plum on chips — the deformation edge for the squash.
- Shadows are the soft two-step everywhere, scaled sm/md/lg by importance.
- Nothing sits at a hard grid edge; the floating shapes bleed to the
  viewport, the shelf sits at 1180px, the footer is full-bleed plum.
- Section padding `clamp(40px, 7vh, 80px)`; hero is ~90vh; generous
  vertical air because kids' pages breathe.

## Voice guide

**Five adjectives:** warm · bouncy · a-little-silly · never-babyish ·
hand-written.

**Three example lines:**

1. "통통 튀는 이야기 / BOUNCE — stories that boing"
2. "종이 위에서 통통. 화면 위에서도 통동. / We make picture books, story
   apps, and tiny games for the under-seven crowd."
3. "또 놀러와요 / come bounce again"

**Three banned words:** *cute* (it is, but saying so is condescending),
*educational* (we are not a worksheet app), *content* (we make stories,
not content).

Grammar of the voice: Korean first, then English as the supporting line,
never the other way around. Short declarative sentences. Onomatopoeia is
welcome and load-bearing — 통통, 콩콩, 둥둥 are the brand. The English is
plain and warm, never translated word-for-word; it carries the same fact
in the studio's actual English voice.

## Do & Don't

**Do**

1. Route every color through the pastel + ink + plum + accent tokens; a
   new shade means a new crayon in the box, and the box is closed.
2. Let everything that is touched bounce back — a press without a spring
   is a broken toy on this page.
3. Keep Korean first: Gaegu, natural word order, onomatopoeia allowed to
   lead. Read every Korean line aloud before shipping.
4. Round every pressable corner; outline every pressable edge. The
   squash needs both.
5. Let the springs overshoot exactly once — one boing, not a wobble.

**Don't**

1. Don't let accent orange `#ff8a5c` carry text — it is a surface and a
   blush, never a voice (1.45–2.32:1).
2. Don't make anything draggable. STICKER drags; BOUNCE bounces back.
   Mixing the two would blur the family's whole point.
3. Don't animate anything but `transform` and `opacity`; don't add a
   marquee, a canvas, or a second ambient loop beyond the idle bob.
4. Don't use a sharp corner, a blur shadow, or a gradient — soft, flat,
   outlined, or it isn't this page.
5. Don't talk down. The audience is small; the voice is not.
