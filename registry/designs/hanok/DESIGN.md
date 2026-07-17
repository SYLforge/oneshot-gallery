# HANOK — design spec

## Identity

A fictional heritage atelier (Jipdam Atelier · 집담 아틀리에) documenting a
Korean hanok — an 1807 house under restoration in Hahoe Village. The page's
thesis is its premise: **the building's wooden structure IS the layout.**
The mortise-and-tenon joinery (no nails — 장부이음, pieces interlock) is the
grid logic; the page has distinct climate zones like a real hanok (warm
ondol, cool maru, open madang); the signature is an exploded axonometric
that disassembles the building into its labeled structural layers. It is
the third and final slot in the `korean-traditional` family, and it is
distinct from its siblings: GIWA is the eave-tile/dancheong *detail*,
MINHWA is folk *illustration*, HANOK is the *whole building* as
architectural diagram. Recognizable from a corner crop by its structural
section-drawing language and the five labeled planes.

The register is heritage-atelier, not tourist-heritage: precise, warm,
unhurried, the voice of people who measure old joints. The Korean is the
first language — terser and warmer than the English, never a translation
layer.

## Palette

| Token | Hex | Role | Contrast pairing |
| --- | --- | --- | --- |
| `earth-paper` | `#efe7d6` | page background — the pale 흙벽 render | — |
| `ink-beam` | `#3d2f1c` | all primary text, ridge, footer ground | 10.5:1 on earth-paper (AAA) |
| `wood-raw` | `#c4a87a` | unfinished pine — floors, columns, beam fills | **3.1:1 — surfaces only, never text** |
| `beam-mid` | `#6b5436` | structural beams, functional accent on light | 5.8:1 on earth-paper (AA) |
| `earth-wall` | `#d4c4a8` | 흙벽 wall fills inside structure and panels | decorative |
| `courtyard-stone` | `#b8b0a4` | 마당 stone ground | decorative (text never sits on it without a panel) |
| `eave-red` | `#9c3a2e` | 단청 trim accent — focus, ::selection, eave line, key callout, tenon outline | 5.6:1 on earth-paper (AA); 3.0:1+ as large type everywhere |
| `ink-soft` | `#5a4a32` | secondary text — glosses, captions, Korean sublines | 6.6:1 on earth-paper (AA) |
| `ink-faint` | `#8a7459` | tertiary — large/uppercase labels only | 3.4:1 — never body text |
| `sky-bone` | `#e8e2d4` | open-sky / madang ground, cooler than paper | 10:1 with ink-beam |
| `snow` | `#f6f2e7` | winter tint + maru cool deck; footer text on ink-beam | 12.6:1 on ink-beam |

The single accent is **eave-red `#9c3a2e`** — the dancheong-eave pigment,
a deliberate nod to the GIWA family (seokganju `#8a3b2a`), but used here
*sparingly*: only on the eaves (the curved-eave underline, the roof's
upturned tips, the exploded-view key callout that points at the mortise),
the joinery tenon outline, the focus ring, and `::selection`. It is never
a field color and never body text on a dark ground. The page is dominated
by unfinished wood, darkened beams, and pale earth — the red is the one
dancheong mark on an otherwise unpainted frame, exactly like a real hanok.

Derived working tokens: `hairline` = ink-beam @ 16% α, `hairline-strong` =
ink-beam @ 34% α, `wall-soft` = earth-wall @ 55% α. The only gradients are
the zone backgrounds (earth-wall → paper for ondol, sky-warm → sky-tone →
stone for madang) and the eave-shadow wash over the madang. No blur, no
glass, no gloss.

## Type system

| Font | Source | Role |
| --- | --- | --- |
| Noto Serif KR | Google Fonts | structural Korean serif — section titles, the parts of the building (처마/대들보/기둥/마루/주춧돌) |
| Nanum Myeongjo | Google Fonts | display Hangul serif — hero name 한옥 and zone headings; the carved myungjo |
| JetBrains Mono | Google Fonts | blueprint/joinery annotations — callouts, dimensions, season labels |

- The serif stack puts Noto Serif KR after Nanum (display) and the mono
  stack puts it after JetBrains, so Hangul falls through into the right
  face everywhere — even inside mono callouts — with no markup. `:lang(ko)`
  additionally pins the family and `word-break: keep-all` so phrases never
  shatter mid-word.
- Base size `clamp(16px, 0.42vw + 14px, 18px)`, line-height 1.6 (body),
  0.92 (hero name).
- Display: hero name `clamp(3.4rem, 13vw, 9rem)` weight 800, tracking
  0.04em; section heads `clamp(1.4rem, 2.7vw, 2rem)` weight 700; zone
  titles up to `2.8rem`. Mono is always small and tracking-out (0.1–0.24em)
  when it acts as a label; the draftsman's pencil.

## Texture recipe

Two SVG `feTurbulence` registers, both static:

1. **Wood grain (page-wide)** — one fixed sheet over the viewport in
   `multiply`, `fractalNoise` with `baseFrequency="0.012 0.48"` (the long
   horizontal fiber direction of sawn pine), 3 octaves, seed 7, warm brown
   color matrix, alpha ~0.06. The unfinished wood under everything. Never
   animated; pointer-transparent.
2. **Earth-wall roughness** — implied inside the axonometric wall fills by
   the warm earth color + hairline edges (a dedicated turbulence layer
   clipped to the walls is described in tokens.json as the troweled-render
   register; on screen the roughness reads from the color and the grain
   beneath it).

Season shifts recolor ONLY the madang sky ground and the eave-shadow
angle. Wood grain and earth-wall texture hold still across seasons — wood
and earth do not change with the season; only the light does. This is the
design rule that keeps the page from feeling like a weather widget.

## Motion vocabulary

| Name | Value | Used for |
| --- | --- | --- |
| `ease-timber` | `cubic-bezier(0.16, 1, 0.3, 0.1)` | structure settling: fast in, long rest |
| `ease-eave` | `cubic-bezier(0.65, 0, 0.35, 1)` | the curved-eave line: an even loaded brush |
| explode-scrub | smoothstep(p ∈ [0.06, 0.78]); roof ±168 / beam ±86 / columns ±44 / floor +96 / foundation +168 | exploded layers (3.4:1 outer:inner) |
| joinery-draw | dashoffset 1→0 over p ∈ [0.30+0.07i, 0.48+0.07i] | spec callout lines, labels fade 1.5× |
| char-split | 820ms ease-timber per glyph, 90ms stagger | hero title settle |
| eave-path-text | 1.6s ease-eave, dashoffset 1→0 once | hero eave line draw + textPath |
| season-swap | 420–520ms ease-timber | madang ground + eave shadow recolor |
| zone-reveal | 700ms ease-timber, translateY 22→0 + opacity | climate-zone rise on first in-view |
| eave-shadow-drift | translate by season (0 / −6 / +8 / +14 px) | madang eave shadow |

Timing rules: the page has exactly one infinite timer (the season
auto-cycle, paused offscreen/hidden-tab/reduced-motion). Everything else
is visitor-caused. The explode scrub is unsmoothed under the finger
(structure does not lag). Interactions settle within ~820ms; only the
visitor's own scroll takes longer.

## Space & shape

The page composes as a building section, top to bottom:

- The hero is the **curved-eave frame** — the roof edge over everything,
  sky-warm ground fading to earth-paper.
- The exploded axonometric is the **section drawing** — the building cut
  open and pulled apart along its vertical axis.
- The three climate zones are **the rooms**, in thermal order: the dense
  warm enclosed panel (ondol), the wide cool open band (maru), the empty
  sky-open court (madang). Density swings deliberately — ondol packs, maru
  spreads, madang empties — so the page's whitespace is the building's
  thermal logic.
- The joinery detail is the **detail callout** — zoomed-in, studied, the
  reason the building stands.
- The footer is the **darkest timber** — the page closes on ink-beam, the
  way a hanok closes on its darkest element.

Radii are minimal (2–4px on panels) — this is wood and stone, not software.
Borders are 1px hairlines; the ondol's double border + inset shadow is the
one "wall thickness" flourish. Asymmetry is rare on purpose: a hanok is a
deliberately balanced frame.

## Voice guide

Heritage-atelier, not tourism. The voice states how the building works,
physically, and lets that carry the feeling. Bilingual pairs are written
in both languages, not translated: the Korean is terser and often lands
the line ("나무는 그대로, 빛만 움직인다" is shorter and more final than "Wood
holds still; only the light moves"). Microcopy extends from hero to footer
to aria-labels: the gable silhouette's alt text reads "한옥의 산장 실루엣 —
용마루, 처마, 기둥" — copy, not a description.

## Do & don't

**Do** — let the structure be the layout; let density carry thermal
meaning; let the red appear only at the eaves; let the Korean be first and
terse; let the explode be the signature and earn it with real joinery
labels.

**Don't** — don't add a fifth dancheong color (this is not GIWA; one red
at the eaves is the whole accent system); don't animate the wood grain or
the earth wall (wood and earth don't move); don't let the season recolor
text (only the sky and the shadow); don't use the red as a field or as
body text on a dark ground; don't hide content behind the scroll scrub
(the SSR state is the assembled, labeled, fully readable building).
