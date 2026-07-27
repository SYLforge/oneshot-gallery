# ORBIT — design spec

## Identity

A fictional studio — ORBIT STUDIO — that drops one silhouette at a time.
The page is not *about* a product; it *is* the configurator. The signature
sneaker (ORBIT 001) sits on a turntable in a seamless studio, lit by a warm
key light and a cool rim, and you orbit it 360° by dragging. Three
colorways, an exploded build scrubbed by scroll, and panels that wipe in.
The register is a product designer who has shot too many turntables to be
precious about it: specs first, the swagger smuggled into the lighting.
The Korean is the Seoul office's own hand — the same drop, re-felt, never
a caption.

This is the gallery's first true 3D entry, and the honesty matters: there
is no three.js, no mesh, no perspective matrix. The "3D" is a procedural
canvas 2.5D silhouette whose entire shape is a function of the orbit angle
— width foreshortens with cos, the visible side swaps, a specular streak
tracks the key light. A side profile that breathes with the turntable,
plus a contact shadow and a floor reflection. That is enough to read as
orbit, and it ships with zero dependencies and zero image files.

## Renderer choice — canvas 2.5D, stated honestly

Two options were on the table. Raw WebGL (a hand-written mesh + lighting)
would be more impressive but far more code, and risky to keep correct under
DPR, resize, context loss, and reduced motion within the gallery's budget.
Canvas 2.5D — the product as a parameterized side-elevation that varies
with rotation — is cheaper, far more reliable, and lets the "specular hint"
and "turntable shadow" be real, continuous, and interruptible rather than
baked into a sprite sheet.

The shipped choice is the latter, taken one step further than the brief's
"swap N pre-rendered sprites" suggestion: instead of pre-baking 36 angles
and cross-fading, we draw ONE continuous silhouette function. As `angle`
sweeps 0 → 2π the silhouette's effective width foreshortens (cos), the
visible side swaps (the swoosh and laces flip), and a specular streak
travels the upper — so a single parameterized drawing reads as a
continuous orbit, with no sprite atlas, no frame stepping, and no
discontinuity. This is documented as a known deviation from the literal
"sprite-turntable" phrasing in PROMPT.md.

## Palette

| Token | Hex | Role | Contrast pairing (on studio-floor) |
| --- | --- | --- | --- |
| `studio-floor` | `#1a1a22` | seamless ground; the page base | — |
| `studio-rise` | `#2a2a36` | the floor lifting into the cyclorama backdrop | decorative |
| `ink` | `#0d0d12` | deepest shadow — turntable base, contact shadow core, footer well (≈19:1) | — |
| `ember` | `#ff5722` | hero accent, focus ring, default colorway, key call-outs | 4.9:1 large text (AA large); used for display/labels, never small body |
| `ocean` | `#0066ff` | second colorway; the rim-light tint borrowed on readouts | 4.6:1 — labels only, never body |
| `frost` | `#e8eef5` | third colorway; primary text + the specular highlight color | 14.6:1 (AAA) |
| `frost-dim` | `#9aa0ad` (frost ≈60% α) | secondary text: captions, Korean glosses, kicker halves | 7.0:1 (AAA normal) |
| `key-light` | `#fff5e6` | warm key light tinting the lit side and the specular hot spot | lighting only |
| `rim-light` | `#b8d8ff` | cool rim light raking the shadow side; reflection's cool edge | lighting only |
| `hairline` | `#3a3a48` | **decorative only** (2.6:1): divider rules, panel borders, rails | never functional text |

The two colorways that carry text (ember on floor at 4.9:1) are kept to
large/display sizes and labels; small body text always runs frost or
frost-dim. The studio lights (key/rim) are never text colors.

## Type system

| Font | Source | Role |
| --- | --- | --- |
| Space Grotesk | Google Fonts | technical display — the ORBIT wordmark, section numbers, spec readouts, colorway names, the angle readout |
| Inter | Google Fonts | English body and UI — captions, copy, labels, buttons |
| Noto Sans KR | Google Fonts | every Korean line — body and subheads; Korean never falls through to the default sans stack |

- The body stack is `Inter, Noto Sans KR, system-ui, sans-serif`: English
  stays in Inter, Hangul lands in Noto Sans KR through the stack. Korean is
  first-class body, never an afterthought.
- `:lang(ko)` adds `word-break: keep-all` and −0.005em tracking; Korean is
  never letter-spaced apart, even in uppercase-tracked kickers (the Korean
  kicker half halves the tracking).
- Display: the ORBIT wordmark `clamp(4rem, 16vw, 12rem)` at line-height 0.9,
  weight 700, tracking −0.02em — a technical wordmark that owns the hero.
  Section titles `clamp(1.8rem, 4vw, 2.8rem)` weight 600.
- Instrument text (kickers, labels, metas, the angle readout) runs
  0.66–0.78rem in Space Grotesk, weight 500–600, tracked 0.12–0.24em,
  uppercase — the configurator's monospace-free readout voice.

## Texture recipe

A studio built in code, three layers stacked, never all visible at once:

1. **The seamless** — a CSS radial-gradient cyclorama: floor `#1a1a22`
   rising into `#2a2a36`, a vignette darkening the corners, a warm
   key-light pool `#fff5e6` stage-right-upper and a cool rim-light pool
   `#b8d8ff` stage-left-lower. This is the no-JS view and the canvas
   understudy; the product reads as lit over it even before the canvas
   paints.
2. **The turntable** — a DPR-capped canvas drawing the sneaker
   procedurally as a continuous function of orbit angle. Each frame is a
   side-elevation silhouette: outsole, midsole wedge, upper profile (toe
   box, vamp, collar, heel counter), an accent stripe ("swoosh") that only
   renders on the near side, laces + collar trim, a body-shading gradient
   keyed to the key-light azimuth, and a specular streak that travels the
   upper. The near/far side swap and the width foreshorten are what sell
   the orbit.
3. **The contact + reflection** — an elliptical DOM contact shadow that
   foreshortens (`scaleX = 0.78 + 0.22·|cos(angle)|`) and re-centers under
   the product, written imperatively each frame; and a floor reflection of
   the silhouette drawn into the same canvas at low alpha, vertically
   flipped and squashed. Both DOM/canvas layers over the seamless.

## Motion vocabulary

| Name | Value | Used for |
| --- | --- | --- |
| `ease-out-settle` | `cubic-bezier(0.22, 1, 0.36, 1)` | orbit inertia, reveals, clip wipes |
| orbit inertia | release: angular velocity × 0.96/frame, decaying to a stop in ~1.4s | the fling after a drag |
| angle lerp | 0.32/frame toward target angle | the sprite chases the drag, never tearing past it |
| specular travel | highlight x = 0.5 + 0.34·sin(angle − keyAzimuth) | the streak crosses the upper as the shoe turns |
| shadow foreshorten | scaleX = 0.78 + 0.22·|cos(angle)|, opacity 0.55→0.8 | the shadow breathes with the silhouette's width |
| scroll-scrub pin | exploded build pinned 220vh; parts translate on Y by progress × offset | the exploded view |
| clip wipe | colorway panels reveal with direction-aware clip-path inset(), 640ms, 90ms stagger | the colorway grid |
| reveal | 700ms ease-out-settle, translateY(20px) → 0, 80ms batch stagger | section heads, footer |
| key-light drift | after 4s of orbit silence, keyAzimuth advances 0.06 rad/s | touch / unattended: a living specular |

Timing rule: drag is 1:1 (a turn feels like turning the shoe); inertia and
the angle lerp are the only eased chasers; the key light holds while you
drag and drifts on its own only after quiet.

## Space & shape

- One corner radius: 4px on panels. The turntable stage and the seamless
  are full-bleed curves; everything else is hairline — 1px solid or dotted
  `hairline` lines.
- Containers: hero at 1280px (two-column ≥920px), build diagram at 680px,
  colorway grid at 1160px (3-col ≥760px), footer at 1020px.
- Section padding `clamp(80px, 12vh, 150px)`; the hero is exactly one
  viewport with copy left and the turntable right (stacked below 920px).
- The exploded build is pinned at 220vh — the extra height is the scrub
  runway; the sticky inner centers the diagram.
- Depth comes from light (key/rim pools, the specular streak, the body
  shading) and from the contact shadow + reflection — not from borders.

## Voice guide

**Five adjectives:** precise · confident · lit · spare · shop-floor.

**Three example lines:**

1. "One silhouette, three colorways, a full turn. The studio drops a single
   shoe at a time — turn it, light it, take it apart." /
   "실루엣 하나, 컬러웨이 셋, 한 바퀴. 스튜디오는 한 번에 한 켤레만
   내려놓는다 — 돌리고, 비추고, 분해한다."
2. "ORBIT 001 ships when the studio is satisfied it is the only shoe in the
   room." / "오르빗 001은 스튜디오가 ‘방에 신발이 하나뿐이다’에 만족할
   때 나간다."
3. "Heat-treated suede and a molten accent. The studio's default." /
   "열처리 스웨이드와 녹아내린 액센트. 스튜디오의 기본값."

**Three banned words:** *revolutionary* (the studio ships a shoe, not a
manifesto), *immersive* (the page proves it; naming it is begging),
*futuristic* (the studio is a workshop, not a render farm).

Grammar of the voice: specs carry the sentence, swagger rides in the
lighting and the Korean re-feeling; product nouns stay uppercase
(ORBIT 001, LAST, MIDSOLE); the Korean line is the same drop re-felt by
the Seoul office — transcreation, with its own rhythm.

## Do & Don't

**Do**

1. Route every color through a token; if you need a new shade, derive it
   from frost or ink and name it.
2. Keep the orbit 1:1 with the drag — a turn feels like turning the shoe,
   not steering a cursor.
3. Let the key light matter everywhere it plausibly could (specular, body
   shading, reflection) and nowhere it couldn't (text never chases light).
4. Keep Korean in Noto Sans KR, keep-all, and first-class — read it aloud
   before shipping.
5. Pause the rAF offscreen, on hidden tabs, and under reduced motion; the
   turntable becomes a re-posable still, not a frozen bug.

**Don't**

1. Don't claim three.js or "real 3D" — this is canvas 2.5D, stated plainly
   in the breakdown. The honesty is part of the craft.
2. Don't put small body text in ember or ocean — they're large/display and
   labels only; body is always frost or frost-dim.
3. Don't animate layout; transform, opacity, filter, and clip-path are the
   only things the turntable is allowed to touch.
4. Don't let the product go flat: no turntable without its contact shadow
   and reflection, no lit side without its rim.
5. Don't let the fiction wink — the studio has never heard of "WebGL"; it
   photographs shoes on a turntable.
