# AURORA — design spec

## Identity

AURORA is the launch site for a fictional SaaS product of the same name — a
"thinking surface for product teams": one canvas where notes become specs,
specs become tasks, and tasks ship, with a persistent context that remembers
the trail of decisions behind them. The page is the product's own argument:
*the surface is alive, so your thinking doesn't have to fight a dead one.*
The living gradient behind every section is not decoration for the product —
it is the demonstration of it. The register is a confident, slightly dry
product team that ships on Tuesday and finds breathless launch copy
embarrassing. The Korean is not a caption layer; it is the Seoul half of the
team writing the same pitch in their own rhythm (transcreation, never
translationese).

## Distinction from LUMEN NORD (same family, glass-futurism)

Both entries live in glass-futurism and both put an aurora behind glass. They
are otherwise opposed, by design:

| Axis | LUMEN NORD (no. 5) | AURORA (no. 6) |
| --- | --- | --- |
| **Premise** | A Nordic–Korean aurora forecast *bureau* | A *SaaS* product launch site |
| **Signature background** | Pointer-warped **WebGL fragment shader** (domain-warped fbm curtains, hashed stars, per-frame dither) | A self-breathing **pure-CSS morphing mesh** — five radial blobs on mutually-prime cycles, never pointer-reactive |
| **Pointer role** | The aurora *warps toward the cursor* (gaussian push); the pointer is the interaction | The pointer is *ignored by the sky*; cards tilt toward it (parallax), the gradient does not |
| **Glass** | Specular panels whose *highlight tracks the pointer* (glass-specular) over a star speckle | Floating cards that *lean in 3D* toward the cursor (pointer-parallax) over the mesh |
| **Signature motion** | A self-drawing SVG sparkline (svg-line-draw) + scroll temperature blend | A **pinned scroll-scrub** that assembles/disassembles the card stack (scroll-scrub-pinned) + a **char-split** wordmark |
| **Type** | Hahmlet serif + Sora sans (an old institution with new instruments) | Space Grotesk + Inter + Noto Sans KR (all sans — assembled today) |
| **Palette mood** | Polar night, aurora green, magenta veil — *nocturnal-meteorological* | Deep space, violet→fuchsia→cyan→emerald — *Linear-era product* |
| **Technique tags** | `webgl-shader`, `glass-specular`, `svg-line-draw` | `scroll-scrub-pinned`, `pointer-parallax`, `char-split-reveal` (zero overlap) |

The one-sentence family-cap statement: *where LUMEN NORD is a pointer-reactive
WebGL aurora over frosty glass for a science bureau, AURORA is a self-breathing
CSS mesh over floating, tilt-reactive cards for a SaaS launch — same family,
opposite physics, no shared technique tag.*

## Palette

| Token | Hex | Role | Contrast pairing |
| --- | --- | --- | --- |
| `deep-space` | `#0a0e1a` | page ground; deepens to `#06080f` behind text via scrims | — |
| `violet` | `#7c3aed` | primary accent — brand, focus ring, CTA fill, mesh blob | 12.3:1 on glass body (AAA) |
| `fuchsia` | `#d946ef` | mesh blob, headline second line, pin progress — accents only | 6.0:1 on glass (AA — never long body) |
| `cyan` | `#06b6d4` | mesh blob, hairline tint, kicker — the cool register | 10.4:1 on glass (AAA) |
| `emerald` | `#10b981` | mesh blob, success / live marker | 12.6:1 on glass (AAA) |
| `frost` | `#f1f3fb` | primary text — the reading voice | ~15.4:1 on deep-space, ≥10:1 on every glass body |
| `frost-dim` | `#aab2c9` | secondary text — captions, Korean glosses, labels | 8.0:1 on glass body (AAA) |
| `glass-fill` | `#101627` @ 46% α | glass card body over the mesh, under blur(18px) saturate(160%) | keeps frost ≥10:1 over the brightest blob |
| `hairline` | `#2f333e` | **decorative only** (1.8:1): card borders, dividers, tracks | never functional text |

Rule of the sheet: **anything you must read is frost, frost-dim, violet, cyan,
or emerald — nothing dimmer.** Fuchsia carries accents and one headline line,
never a paragraph. The mesh blobs themselves are decorative (`aria-hidden`);
text never sits on a bare blob, always on a scrim or a glass body.

## Type system

| Font | Source | Role |
| --- | --- | --- |
| Space Grotesk | Google Fonts | display — mast, headlines, kickers, CTAs, log values; the launch voice |
| Inter | Google Fonts | body/UI — paragraph copy, labels, chrome; the interface voice |
| Noto Sans KR | Google Fonts | every Hangul glyph — Korean never falls through to a Latin sans |

- Both Latin stacks put Noto Sans KR last (`Space Grotesk, Noto Sans KR, sans`
  / `Inter, Noto Sans KR, system-ui`), so Hangul routes into it with no markup;
  `:lang(ko)` additionally tightens tracking to −0.01em and sets
  `word-break: keep-all` so Korean phrases stay whole.
- Base size `clamp(15px, 0.35vw + 13.5px, 17px)`, line-height 1.65.
- Display: wordmark `clamp(3.4rem, 13vw, 10rem)` at line-height 0.96, weight
  700, tracking −0.02em (the char-split headline); sub-headline
  `clamp(1.3rem, 3.4vw, 2.4rem)`; section heads `clamp(1.8rem, 4vw, 2.9rem)`.
- The all-sans commitment is the deliberate counter to LUMEN NORD's
  serif-over-sans — AURORA reads as a product shipped this year, not an
  institution.

## Texture recipe

Everything is procedural; there is not a single image asset (media budget 0).

1. **The mesh (the signature)** — five oversized radial-gradient blobs
   (violet, fuchsia, cyan, emerald, and a violet→fuchsia blend) over a
   deep-space wash, each `filter: blur(70px) saturate(150%)` and
   `mix-blend-mode: screen`, drifting on mutually-prime cycles (24s, 31s,
   19s, 17s, 29s) so the field never visibly loops. A 43s conic `aurora-sweep`
   turns once per cycle as the curtain ghost. **The mesh is never coupled to
   the pointer** — that is the whole point of the distinction from LUMEN NORD.
2. **The grain** — a tiny inline SVG `feTurbulence` fractal-noise data-uri at
   3.5% opacity, `mix-blend-mode: overlay`, exists only to kill the banding
   that mesh gradients show on dark consumer panels.
3. **The glass** — `backdrop-filter: blur(18px) saturate(160%)` cards over the
   mesh, hairline frost borders, a 1px accent top hairline per card, and a
   soft diagonal sheen. Glass over a flat color is a gray rectangle; glass
   over a living mesh is glass.
4. **The scrims** — deep-space gradients under the masthead and behind every
   text region, so worst-case blob-behind-copy still clears AA.

## Motion vocabulary

| Name | Value | Used for |
| --- | --- | --- |
| `ease-out-settle` | `cubic-bezier(0.16, 1, 0.3, 1)` | reveals, char-split, CTA — fast in, long settle |
| `ease-in-out-morph` | `cubic-bezier(0.45, 0, 0.55, 1)` | the mesh breathing between poses |
| reveal | 650ms, translateY(16px)→0 + opacity, 70ms batch stagger | section heads, lede, CTA, footer |
| char-split | glyphs translateY(110%)→0 on 44ms stagger, 620ms, behind clip mask | the AURORA wordmark |
| mesh morph | blobs translate+scale on 24s/31s/19s/17s/29s alternate | the living sky (no shared divisor → no loop) |
| pin assemble | `--aurora-pin` 0→1 lerp-smoothed (0.16/frame); cards ride piecewise slices | the pinned feature stack |
| tilt lerp | 0.12/frame; rotateX/Y capped ±7deg; translateZ up to 60px; perspective 900px | cards leaning toward the cursor |
| pin progress | 2px violet→fuchsia bar, scaleX(0→1) on `--aurora-pin` | the section's own scrubbed meter |
| CTA settle | hover/active translateY(−2px), 220ms | buttons |

Timing rules: the only things that move on their own are the mesh (five
prime-cycle blobs + one sweep) and the on-air-style "live" dot glow — all
input-driven motion (pin scrub, tilt, reveals) parks at rest. Under reduced
motion the mesh holds one composed frame and everything else is simply
visible.

## Space & shape

- One card radius (22px), one button radius (12px), focus ring 6px. Everything
  else is a hairline — 1px frost-derived borders.
- Containers: hero and pin stage at 1200px (1280px at 1440px+), CTA at 880px,
  footer at 1020px; the mesh is always full-bleed.
- Section padding `clamp(80px, 12vh, 150px)` (CTA goes taller); the hero is
  one viewport with content centered.
- The pinned region is 420vh tall holding a 100vh sticky stage — about one
  viewport of scrub per card.
- Depth comes from light and lift, not borders: inner top highlight, accent
  top hairline, pointer-driven translateZ. One soft long drop shadow
  (`0 24px 60px`) per card.

## Voice guide

**Five adjectives:** confident · dry · alive · precise · unbothered.

**Three example lines:**

1. "A single canvas where notes become specs, specs become tasks, and tasks
   ship." / "메모가 스펙이 되고, 스펙이 작업이 되고, 작업이 출시되는 하나의 캔버스."
2. "Built for the team that ships on Tuesday." / "화요일마다 출시하는 팀을 위해."
3. "The sky keeps moving. So does the work." / "하늘은 계속 움직인다. 일도 그렇다."

**Three banned words:** *magical* (the product is engineered, not enchanted),
*seamless* (a seam is a feature when you can see how it joins), *revolutionary*
(a thinking surface is a calmer room, not a coup).

Grammar of the voice: short declarative sentences; concrete verbs ("ships",
"remembers", "breathes"); the gradient is named as proof, not metaphor ("the
gradient behind this paragraph is the whole pitch"); the Korean re-feels the
line in its own rhythm rather than translating it word for word.

## Do & Don't

**Do**

1. Route every color through a token; if you need a new shade, derive it from
   frost or deep-space and name it.
2. Keep the mesh self-driving — it breathes on its own and never, ever reacts
   to the pointer. That boundary is the entry's identity.
3. Let the pointer matter to the *cards* (tilt) and nowhere else; the sky is
   weather, the cards are objects you could pick up.
4. Keep Korean in Noto Sans KR everywhere, keep-all, first-class — read it
   aloud before shipping.
5. Park everything that moves: offscreen (IntersectionObserver on the mesh),
   hidden tab (visibilitychange), reduced motion, and at rest (the tilt and
   pin loops self-park).

**Don't**

1. Don't couple the gradient to the pointer — that is LUMEN NORD's signature,
   and stealing it collapses the distinction.
2. Don't put functional text on a bare blob — scrim or glass first, then type.
3. Don't animate layout; transform, opacity, and filter are the only things
   the mesh and cards are allowed to touch.
4. Don't let the glass go flat: no card without the mesh behind it, no blur
   without saturation.
5. Don't let the fiction wink — AURORA is a product that ships; the page is a
   launch, not a parody of one.
