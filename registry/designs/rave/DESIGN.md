# RAVE — design spec

## Identity

It is 01:40 on a Saturday in an abandoned printworks in Itaewon, and the
page is the flyer still pinned to the wall by the blue door. RAVE 2099 is
a one-night underground electronic-music festival: two rooms, ten acts,
doors at 22:00, lights at 06:00. The site does not explain the music. It
assumes you came here because you already know what 130 BPM at 02:00 feels
like, and the only question left is MAIN ROOM or BASEMENT. Everything on
screen must feel like a photocopied flyer collaged onto a black wall, then
lit by a single strobe — not rendered, not designed-for-web. The emotional
register is a promoter who has been doing this for eleven years and refuses
to be excited about it. The Korean is not a translation layer; it is the
promoter's actual texting voice — shorter, harder, drier than the English.

This entry is the **second of three neo-brutalist** designs. The first,
BLUNT, is a risograph print shop: paper ground, ink misregistration,
acid-yellow daylight, a sticker table you fling around. RAVE is its
night-shift sibling: pure black ground, white blocks, one strobing
electric blue, three line-up tickers running on tempo. Same doctrine (hard
shadows, anti-easing, monospace + heavy display), opposite half of the
day. A grayscale screenshot tells them apart instantly — BLUNT is light on
dark, RAVE is dark on light.

## Palette

| Token | Hex | Role | Contrast pairing |
| --- | --- | --- | --- |
| `ground` | `#000000` | the night — pure black ground | — |
| `block` | `#ffffff` | white panels carrying black type | 21:1 black-on-white, 21:1 white-on-black |
| `strobe` | `#0066ff` | electric blue — the ONE accent | 4.35:1 on black (**large/display only** — passes AA 3:1 large, not 4.5:1 body); white on it 4.83:1 (AA body); black on it 4.35:1 (large) |
| `ash` | `#8a8a8a` | secondary metadata on black — timestamps, fine print | 4.6:1 on black (AA body) |

One-accent rule: electric blue is the only chromatic color on the page.
It appears in exactly six places — the wordmark under-plate, the section
Korean sublines, the highlighted ticket tier, marquee row B, the venue map
door, and the footer's 22:00 numeral chip. Everywhere else is black, white,
or ash. No gradients anywhere; the only `linear-gradient` is the scanline
grid, which is a hard-stop `repeating-linear-gradient` (a grid, not a
gradient).

## Type system

| Font | Source | Role |
| --- | --- | --- |
| Black Han Sans | Google Fonts | every Hangul glyph — a single 400 weight that reads as a solid block; the brutalist Korean face |
| Archivo Black | Google Fonts | Latin display — wordmark, section titles, act names, the footer shout |
| Space Mono | Google Fonts | timestamps, BPM, ticket ledger, venue co-ordinates — tabular without a table |

- Korean is **first-class and stacked first**: both Latin stacks begin
  with Black Han Sans so any Hangul glyph lands on it with no markup;
  `:lang(ko)` additionally pins it and zeroes letter-spacing. One Korean
  face across display, schedule, and ledger is the tell that the promoter
  hand-set the whole flyer in the same heavy block.
- Wordmark `clamp(4.6rem, 24vw, 18rem)` at line-height 0.82, tracking
  −0.02em; the `/ 2099 /` deck runs at 0.3em of it, in blue.
- Everything else is 700-weight mono in caps with open tracking
  (0.04–0.14em). Body-size prose exists only in the venue ledger and the
  footer cells.

## Texture recipe

Two layers, both CSS, both decorative.

1. **Scanline grid** — a pointer-transparent overlay fixed to the hero
   only: `repeating-linear-gradient(rgba(255,255,255,0.05) 0 1px,
   transparent 1px 3px)`, a 3px-pitch grid of 1px white lines at 5% alpha.
   It drifts one line per 8s (`background-position 0 0 → 0 3px`), gated to
   reduced-motion-off. It tints the hero; it never reaches the readable
   sections.
2. **The strobe** — the wordmark's electric-blue under-plate (a CSS
   pseudo-element, `mix-blend-mode: screen` so it lightens the black
   ground) breathes opacity 1 → 0.55 on a 2.6s `ease-in-out` loop. That
   pulse is the page's ambient heartbeat, and marquee row B breathes on
   the same 2.6s so the strobe reads as one rhythm top to bottom.

No `feTurbulence`, no image, no canvas. The texture is the **light**, not
the paper — which is the load-bearing distinction from BLUNT (whose
texture is grain on stock).

## Motion vocabulary

| Name | Value | Used for |
| --- | --- | --- |
| press-in | **0ms** — `:active` snaps `translate(8px,8px)`, shadow → 0 | buttons |
| press-out | **110ms linear** snap-back on release | buttons |
| marquee-fast | 0.20 px/ms (~200 px/s), left | headliner ticker |
| marquee-mid | 0.12 px/ms (~120 px/s), right | opener ticker (strobes) |
| marquee-slow | 0.07 px/ms (~70 px/s), left | genre ticker |
| strobe | 2.6s ease-in-out, opacity 1 → 0.55 | wordmark plate + marquee row B |
| scanline-drift | 8s linear, `background-position 0 0 → 0 3px` | hero scanline grid |
| reveal-cut | `clip-path` inset/polygon 100% → 0 over **620ms `steps(8, end)`** | section/tier entrance |
| tab-swap | 160ms linear, opacity + `translate3d(0,6px,0) → 0` | schedule room toggle |

The anti-easing is the same doctrine as BLUNT, at a harder offset: nothing
eases into a press, the shadow is 8px (not 6px) and white-on-black. The
only continuous easings on the page are the strobe (a slow breath) and the
clip-path wipe (stepped, mechanical — `steps(8, end)`, not `ease`). A
stepped wipe is the brutalist equivalent of a fade: it cuts, it does not
dissolve.

## Space & shape

- The 3px rule is the atom: borders, schedule rules, tier frames, focus
  ring — all 3px. If a line is not 3px it is a 1px scanline.
- Shadows are offset solids, never blurred: 8px/8px white on black
  (buttons, tiers), 8px/8px blue on black (the highlighted CTA), 8px/8px
  ash (the sold-out tier). Blur is fog; this room has strobe, not fog.
- Rectangles by default; the only rotation is the sold-out stamp (−3deg)
  and the footer needs none. No `border-radius` anywhere.
- The venue map is a labeled grid of blocks — the printworks floor plan
  reduced to chips. The door and exit are vertical text (writing-mode
  vertical-rl) because that is how you read a doorway in a plan.
- Sections read at 1320px (slightly wider than blunt's 1280 — nightlife
  sprawls); the marquee band is full-bleed; hero is one viewport.

## Voice guide

**Five adjectives:** nocturnal · deadpan · promotional · tempo-literate ·
secretly committed.

**Three example lines:**

1. "DOORS AT 22:00. 밤 10시, 문이 열린다."
2. "NO CAMERA. NO LIST. NO QUIET. 카메라 금지, 리스트 없음, 조용함 없음."
3. "05:30 · 맥주는 새벽 5시 반까지. NO RE-ENTRY AFTER 03:00."

**Three banned words:** *vibrant* (the strobe is vibrant; the copy is
not), *immersive* (we are a flyer, not an experience), *curated* (the
line-up is booked, not curated).

Grammar of the voice: ALL CAPS English, short declaratives, times in 24h
with the 0; the Korean line is never a literal translation — it is the
same fact said the way the promoter would text it at 23:47, and it is
allowed to be blunter than the English. Times and prices are written once
in the mono face and never decorated.

## Do & Don't

**Do**

1. Route every color through the four chips; electric blue appears in six
   named places and nowhere else. Scarcity is what makes it strobe.
2. Keep the strobe as one rhythm — the wordmark plate and marquee row B
   share the 2.6s loop so the page breathes in time.
3. Let presses snap — 0ms in, 110ms linear out, everywhere a press exists.
4. Keep Korean first-class: Black Han Sans, natural word order, blunter
   than the English; read it aloud before shipping.
5. Cut, don't fade — clip-path reveals use `steps(8, end)`, a hard wipe.

**Don't**

1. Don't let electric blue carry body text on black — 4.35:1 is large-only.
   White is the only body voice.
2. Don't blur a shadow, round a corner, or gradient a surface; the page is
   a photocopied flyer, not a screen.
3. Don't couple the marquee to scroll (that is blunt's move); rave's bands
   run on their own tempo — three fixed speeds, three directions.
4. Don't add a fourth ticker or a second strobe frequency; nightlife reads
   as rhythm only while it is scarce.
5. Don't let the fiction wink — no jokes about being a website. The
   promoter believes it is 02:00 and the door is open.
