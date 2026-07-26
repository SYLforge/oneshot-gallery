# 늘어남 STRETCH — design spec

## Identity

A bilingual (KO-first) yoga & wellness studio in Seongsu-dong, Seoul, whose
entire site is a demonstration of what it teaches: lengthening, breath,
calm. The typography itself stretches — the hero wordmark reaches on mount,
the pinned pose-sequence elongates each asana's name vertically as you hold
the scroll, breathing circles drift behind it all. The product of the studio
*is* the motion of the page. The register is a teacher who has done this ten
thousand times: nothing hurries, nothing performs, the air is the point.
Korean is the first language; the English is a transcreation set half a step
quieter, answering rather than translating.

## Distinction from TYPEWAVE (the 1st entry of this family)

Both entries live in `kinetic-typography` and both let type do the talking —
and that is where the resemblance ends. The third slot in a family goes to
the entry that is *different enough*, and STRETCH is built to be the
photographic negative of TYPEWAVE in every axis that matters:

| Axis | TYPEWAVE (1st) | STRETCH (this) |
| --- | --- | --- |
| Mood | dark, energetic, strobing | light, calm, breathful |
| Palette | deep night + saturated waveform color | warm off-white + soft clay + sage |
| What the type does | rides a waveform, jitter, frequency | elongates *vertically* (scaleY), reaches |
| Signature motion | horizontal/oscillating, beat-driven | vertical/lengthening, scroll-held |
| Background | dense animated visualizer | three translucent circles *breathing* |
| Pace | fast, percussive | 12s inhale-exhale, 760ms reveals |
| Industry | music / entertainment | wellness |
| The metaphor | sound made visible | the body, lengthening |

The two are recognizable from a corner crop: TYPEWAVE is dark type on a
moving field; STRETCH is warm type on still air, and the type grows tall.

## Palette

| Token | Hex | Role | Contrast (on paper) |
| --- | --- | --- | --- |
| `paper` | `#f7f3ec` | the warm off-white page; the calm is how much of this you see | — |
| `paper-warm` | `#fbf8f2` | breath-circle fills, plate panels | 1.04:1 (surface only) |
| `ink` | `#2f2a24` | body text, the wordmark, pose names, strokes | 12.85:1 (AAA) |
| `ink-soft` | ink @ 70% α ≈ `#6b6660` | secondary text: EN transcreations, captions, counts, the studio note | 5.14:1 (AA) |
| `clay` | `#c97b5a` | the bright accent — the STRETCH wordmark fill, breath ring strokes, the long pose rail; display/large only | 2.94:1 — never small text |
| `clay-deep` | `#a85e3f` | readable clay — kickers, pose ordinals, link underlines, focus ring; selection bg with ink text | 4.38:1 (AA) |
| `sage` | `#8a9a7b` | rules ONLY — breath count ticks, section hairlines, breath-circle guide rings | 2.72:1 — never functional text |
| `sage-deep` | `#5f6f50` | readable sage — the breath cue label, inhale/exhale instruction | 4.90:1 (AA) |

Derived working tokens: `rule` = sage @ 50% α, `rule-faint` = sage @ 28% α,
`shadow` = ink @ 10% α. The bright `clay` is allowed to dip below 3:1
because it carries only the giant wordmark (display type, ≥ 24px) and
decorative rings; any clay that must be *read* as text uses `clay-deep`
(4.38:1). There is no second bright accent.

## Type system

| Font | Source | Role |
| --- | --- | --- |
| Noto Serif KR | Google Fonts (OFL) | every Hangul glyph; the wordmark 늘어 (700), pose names 산·하늘·나무·숨 (700), the studio note (400) |
| Cormorant Garamond | Google Fonts (OFL) | the tall Latin voice: STRETCH, the EN transcreations (italic), captions, ordinals |

- Family stack is `Cormorant Garamond, Noto Serif KR, serif`: Latin resolves
  in Cormorant, Hangul falls through into Noto Serif KR with no markup.
  `:lang(ko)` additionally pins Noto Serif KR, applies `word-break: keep-all`
  and −0.005em tracking, with line-height 2.0.
- Base size `clamp(16px, 0.45vw + 14px, 19px)`, root leading 1.8.
- The two voices are chosen for *vertical metrics*: Cormorant's long
  ascenders and Noto Serif KR's deliberate vertical drawing both elongate
  gracefully under `transform: scaleY()` — the type looks drawn-to-be-stretched,
  never distorted.
- Wordmark `clamp(4.5rem, 19vw, 16rem)` at weight 500, +0.01em; the Korean
  늘어 sits beneath at `clamp(2.2rem, 8.5vw, 6.5rem)` in clay, weight 700.
- Pose names: Korean `clamp(3.5rem, 13vw, 9rem)` (the head, stretching);
  Latin `clamp(1.4rem, 3.5vw, 2.4rem)` in clay-deep beneath.
- Kicker / ordinal: Cormorant uppercase at 0.7rem with 0.26em tracking.

## Texture recipe

Almost none — the texture is light and air:

1. **Breathing circles** — three concentric translucent layers (`paper-warm`
   at 92% α, clay at 7% α, sage at 6% α) that scale 1 → 1.06 on a 12s
   alternate cycle and drift with the pointer at depth-weighted amounts.
2. **Hairlines** — 1px sage throughout: the section rules, the breath-count
   ticks, the long clay pose-rail that grows across the whole sequence.
3. **Air as material** — section padding runs 14–22vh so the calm reads as
   composed, not absent. No grain, no noise filters.

## Motion vocabulary

| Name | Value | Used for |
| --- | --- | --- |
| `ease-breathe` | `cubic-bezier(0.45, 0, 0.2, 1)` | the default — slow inhale, longer exhale |
| `ease-stretch` | `cubic-bezier(0.22, 1, 0.36, 1)` | long reach past midpoint |
| `ease-recoil` | `cubic-bezier(0.34, 1.24, 0.4, 1)` | ~12% overshoot: wordmark settle only |
| breath cycle | 12s ease-in-out infinite alternate; scale 1 → 1.06 | background circles |
| wordmark settle | scaleY 0.78 → 1.06 → 1, per-glyph 90ms stagger, 1400ms | hero on mount |
| scrub lerp | `v += (t − v)(1 − 0.88^(dt/16.7))` — half-life ≈ 5.4 frames | pose stretch (slower than default) |
| pose stretch | `scaleY = 1 + localScrub×1.8` → up to 2.8× | headline glyphs as you hold scroll |
| reveal | 760ms, translateY(18px) → 0, 90ms batch stagger | paragraphs, heads |
| pointer drift | translate ±12%, lerped 0.06/frame, depth-weighted, capped | breath circles |
| underline | in 520ms ease-breathe scaleX 0 → 1 from left; out 200ms | studio links |

Rule: motion on a wellness page may only ever *lengthen* something the
static page already shows — a pose reaching, a name writing, a rail growing.
Nothing snaps. Nothing idles aggressively; between interactions the page
breathes, once every twelve seconds.

## Space & shape

- One calm column: text caps at 34–44rem; the ledger goes to two columns at
  ≥720px. Section padding `clamp(5rem, 14vh, 9rem)`.
- The cover is one viewport: folio at top, wordmark centered, foot at the
  bottom — air in every direction.
- Shapes are circles (the breathing background, the breath-cue pill) and
  hairlines. The only filled shape is the clay rail that grows across the
  sequence — a single horizontal line that lengthens, mirroring the vertical
  lengthening of the type.
- The pinned sequence stacks four poses in one viewport; the spacer behind
  it is ~300vh so each pose earns roughly a viewport of held scroll.

## Voice guide

**Five adjectives:** calm · lengthening · bilingual-by-conviction ·
embodied (always the body: feet, spine, breath, flank) · unhurried.

**Three example lines:**

1. "늘어나는 것은 부드러운 일이다." / "Lengthening is a soft act."
2. "한 발은 뿌리가 되고, 다른 발은 가지가 된다." / "One foot becomes a
   root; the other becomes a branch."
3. "빠른 쪽이 이기는 곳이 아니라, 긴 쪽이 남는 곳." / "Not a place where
   the fast win, but where the long remain."

**Three banned words:** *energetic* (wrong mood — this is calm), *power*
(gym language, not studio language), *transform* as a verb in copy (the
studio lengthens, it does not "transform"; the word belongs to CSS, not
voice).

Grammar of the voice: KO paragraph first, EN transcreation after — the
same instruction re-felt in the body, never word-for-word. Claims stay
anchored in the body and the breath (feet, spine, arms, the floor) and
stop before wellness cliché.

## Do & Don't

**Do**

1. Let the type do the reaching: the stretch is vertical (scaleY), never
   horizontal jitter — that is TYPEWAVE's gesture, not ours.
2. Keep clay scarce as text — ordinals, kickers, one rail, one wordmark
   fill. The bright `#c97b5a` is display-only; readable clay is `clay-deep`.
3. Let the reader's scroll hold each pose: the scrub is deliberately slow
   (half-life ≈ 5.4 frames) so lengthening reads as a held breath, not a
   snap.
4. Write KO first and transcreate; read both aloud before shipping.
5. Keep the no-JS page a finished static poster — every pose at full reach,
   every name written, the sequence readable as a document.

**Don't**

1. Don't add strobing, jitter, or percussive motion — that belongs to the
   other entry in this family. STRETCH is the 12-second exhale.
2. Don't let sage or bright clay carry small text; they draw lines and
   rings, `sage-deep` and `clay-deep` speak.
3. Don't animate layout — transform, opacity, stroke-dashoffset only; the
   pin is `position: sticky`, not scripted layout.
4. Don't fill the air. The breathing circles and the whitespace are
   content; an empty section is a held breath, not a gap.
5. Don't let the fiction wink — no jokes about scrolling or websites; the
   studio believes it is a studio, and the page believes it is breath.
