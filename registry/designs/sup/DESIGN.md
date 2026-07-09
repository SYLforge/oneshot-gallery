# 숲 SUP — design spec

## Identity

A forest-bathing retreat house below a birch ridge in Gangwon-do, run by
people who believe the forest is not scenery but company. The page is not a
brochure about the walk — it *is* the walk: you arrive in a clearing, a tree
grows to meet you, a field answers your hand, and something quietly teaches
you to breathe before asking anything of you. Everything green on screen is
drawn by code, because a photograph of a forest is a memory and this page is
supposed to be a presence. The Korean is the host's own voice — warmer and
shorter than the English, which trails it like a translation for guests.

## Palette

| Token | Hex | Role | Contrast pairing (on cream) |
| --- | --- | --- | --- |
| `cream` | `#f2efe6` | background; the clearing | — |
| `loam` | `#2e2a24` | primary text, the giant 숲 | 12:1 (AAA) |
| `moss` | `#4a5d3a` | accent: wordmark, numerals, buttons, focus ring | 6.2:1 (AA normal) |
| `bark` | `rgba(46,42,36,.72)` ≈ `#65615a` | secondary text: glosses, captions, durations | 5.4:1 (AA normal) |
| `lichen` | `#a8b89a` | **decorative only**: leaves, far grass, coordinates | 1.8:1 — never functional text |
| `sunlight` | `#e9dfa8` | light washes at ≤50% alpha, pollen | decorative |

Derived working tokens, all named in styles.css and tokens.json: branch
tiers `trunk #56523d` / `stem #5c7245` / `moss-soft #6f8457`, understory
`under-stem #8d9d7d` / `under-leaf #b7c2a8`, meadow `field #e7ead6` and the
four grass rows (`grass-lit/back/mid/front`), `pollen #d9cd8f`,
`hairline rgba(74,93,58,.25)`. No overlay texture — light is the texture.

## Type system

| Font | Source | Role |
| --- | --- | --- |
| Instrument Serif | Google Fonts | Latin display, the SUP wordmark, all italic asides (the guide's voice) |
| Gowun Dodum | Google Fonts | all Hangul, all body text — round, unhurried |

- Display stack is `Instrument Serif, Gowun Dodum, serif`, so the giant 숲
  falls through the Latin face into Gowun Dodum with no extra markup;
  `:lang(ko)` adds `word-break: keep-all` and its own 1.8 line-height.
- Base size `clamp(16px, 0.4vw + 14px, 18px)`, line-height 1.75 — body text
  reads at a walking pace.
- Display: 숲 at `clamp(6.4rem, 21vw, 13.5rem)`, the Latin wordmark at
  0.22em tracking beside it; section titles `clamp(1.7rem, 3.4vw, 2.4rem)`,
  weight 400 everywhere — one stroke weight, like one voice.
- Every italic on the page is Instrument Serif via a scoped `em` rule; the
  italics are the lines the guide says out loud.

## Texture recipe

There is deliberately no grain, no noise, no glass. Three kinds of light do
the work:

1. **Sun** — `radial-gradient(110% 85% at 22% 0%, rgba(233,223,168,.5),
   transparent 70%)` over the hero, breathing 0.65 → 1 over 17s.
2. **Meadow** — the wind section's stage fades `cream → rgba(sunlight,.28)
   46% → field #e7ead6` top to bottom, held by 1px hairlines.
3. **Orb** — a radial of sunlight → lichen → moss-soft, the only round
   shape on the page, reserved for the breath.

Everything else is negative space and `1px solid rgba(74,93,58,.25)` rules.

## Motion vocabulary

| Name | Value | Used for |
| --- | --- | --- |
| `ease-forest` | `cubic-bezier(0.22, 0.8, 0.24, 1)` | reveals — quick to move, very long to settle |
| reveal | 950ms `ease-forest`, translateY(20px)→0, 110ms batch stagger | sections, ledger rows |
| growth intro | cubic ease-out to 0.74 over 5.2s, then scroll → 1 over 0.85vh | the L-system draw-on |
| growth lerp | 0.06 / 60fps-normalized frame | `--sup-grow` never snaps |
| branch window | `dashoffset = clamp(0, (t1 − grow)/(t1 − t0), 1.02)` | per-branch drawing, pathLength=1 |
| leaf unfurl | `clamp(0, (grow − t) × 12, 1)` on opacity + scale | each leaf opens in ~8% of the clock |
| breath | 4s half-sine in · 4s hold · 4s out; orb scale 0.76+0.3·b | the 4·4·4 guide |
| blade spring | stiffness 0.03–0.06, damp 0.88–0.93/frame | grass bend and recovery |
| wind field | 96 cells; gaussian pointer deposits; diffuse 0.22, decay 0.945 | the traveling breeze |
| pointer drift | lerp 0.05/frame; −7px shrub / +12px tree / −4px copy | hero parallax |
| idle sway | rotate ±0.5° at the root; 9.4s / 12.7s / 17s | tree, shrub, sun — mutually prime |

Timing rule: no two ambient cycles share a period (9.4 / 12.7 / 17s and the
12s breath), so the page never visibly loops. Hover states snap — only
entrances are eased.

## Space & shape

- One shape language: vertical lines (trunks, blades, hairlines) against a
  single circle (the breath). Border-radius exists only on the orb, the two
  pill controls, and the 3px focus ring.
- Reading columns: hero copy 34rem; wind and ledger lede 36rem; breath and
  retreats read at 880px; the wind stage is full-bleed
  (`margin-inline: calc(50% - 50vw)`) because wind does not respect margins.
- Section padding `clamp(72px, 12vh, 150px)` — the walk has long pauses.
- Section heads: a Korean numeral (하나 · 둘 · 셋) in moss, the title, then
  a hairline running to the edge — a trail marker, not a header bar.
- The hero plant overlaps the copy's right edge at desktop and recedes to
  50% opacity behind it under 900px; the text always wins.

## Voice guide

**Five adjectives:** unhurried · second-person · sensory · warm-precise ·
never-selling.

**Three example lines:**

1. "Breathe in for four. The forest is already breathing with you." /
   "넷을 세며 들이쉬세요. 숲은 이미 당신과 함께 숨 쉬고 있습니다."
2. "Wind you can see — we call it grass." / "눈에 보이는 바람을, 우리는
   풀이라고 부릅니다."
3. "Darkness is not the day ending — it is the forest closing its eyes." /
   "어둠은 하루의 끝이 아니라, 숲이 눈을 감는 방식입니다."

**Three banned words:** *healing* (the forest doesn't make claims),
*escape* (you are not fleeing, you are arriving), *unplug* (no machine
metaphors in a forest).

Grammar of the voice: present tense, second person, short sentences that
leave room to breathe. The Korean line is never a literal translation — it
is the same moment, said by the host (transcreation). English italics are
speech; roman text is the trail signage.

## Do & Don't

**Do**

1. Route every color through a token; if a new green is needed, derive it
   between lichen and moss and name it.
2. Keep one interactive metaphor per section: the hero follows, the field
   answers, the breath counts. Never two at once.
3. Let the fallback state be the finished state — `var(--sup-grow, 1)`,
   the resting orb, the mid-gust frame. No JS, reduced motion, and slow
   networks all land on a composed page.
4. Keep ambient periods long and mutually prime; the page should feel
   alive at a glance and still on a stare.
5. Write new copy as guidance: something the visitor's body can do while
   reading it.

**Don't**

1. Don't use lichen for anything a user must read — it is foliage, not a
   voice.
2. Don't add a second accent or a warm CTA color; moss is the only thing
   that ever asks for a click.
3. Don't animate layout — transform, opacity, filter, stroke-dashoffset
   only; the forest moves without reflowing.
4. Don't let the breathing instruction depend on the motion; the sentence
   teaches, the orb merely agrees.
5. Don't let the fiction advertise — no testimonials, no pricing, no
   urgency; the forest keeps your pace, not the other way around.
