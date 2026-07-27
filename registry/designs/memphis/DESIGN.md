# MEMPHIS — design spec

## Identity

A two-person design studio in Seongsu-dong, Seoul, est. 2019, that writes
postmodern brand systems the way Ettore Sottsass drew chairs in 1981 —
shapes first, justification second, but the justification is real. The page
*is* their portfolio: a shape explosion, a manifesto marquee, a project grid
that re-sorts itself when you filter. The studio's personality is maximalist
but disciplined — every squiggle has a job, the palette is exactly five, every
line is 3px. They will tell you Memphis is not a retro reference but a
method: geometry as a language, color as a noun. The Korean is not a
translation layer; it is the studio's actual voice — shorter, declarative,
drier than the English.

## Palette

| Token | Hex | Role | Contrast pairing |
| --- | --- | --- | --- |
| `paper` | `#f7f2e8` | background — warm off-white stock | — |
| `ink` | `#1a1a1a` | all functional text, 3px outlines, terrazzo speckle | 15.6:1 on paper (AAA) |
| `teal` | `#2bb1a8` | signature — hero fill, focus ring, marquee row B | ink on it: 6.59:1 (AA). As text on paper 2.4:1 → **decorative/surface only** |
| `coral` | `#ff6b8a` | Memphis pink — blobs, project tiles, ::selection | ink on it: 6.40:1 (AA) |
| `marigold` | `#ffc933` | sunny yellow — squiggles, CTA, footer shout | ink on it: 11.3:1 (AAA) |
| `cobalt` | `#3a5fcd` | disciplined counterpoint — section heads as text; panels carry white | text on paper: 5.1:1 (AA). White on cobalt: 5.68:1 (AA). Ink on cobalt 3.07:1 → cobalt surfaces never carry ink body |
| `plum` | `#6a3b8a` | terrazzo fleck + link accent | ink-text safe at 7.0:1 on paper |

Discipline rule: exactly five colors plus ink and paper. Teal never carries
text on paper (2.4:1) — it is a fill, a ring, and a surface. Cobalt surfaces
never carry ink body text (3.07:1) — they carry white. Project tiles tint the
cream background with a low percentage of their tone (12–22% via `color-mix`)
so the surface stays well above AA while reading as the project's color. No
gradients anywhere; Memphis color is flat, hard-edged, declarative.

## Type system

| Font | Source | Role |
| --- | --- | --- |
| Space Grotesk | Google Fonts (OFL) | Latin display + body + labels — geometric, engineered |
| Black Han Sans | Google Fonts (OFL) | every Hangul glyph — heavy geometric Korean, cut like paper |

- The display stack ends in Black Han Sans (`Space Grotesk, Black Han Sans,
  sans`), so Hangul falls through into it with no markup; `:lang(ko)`
  additionally pins it and zeroes tracking. One geometric Korean face across
  display and body is the art direction — the studio's Korean voice is as
  loud and geometric as its Latin one.
- Wordmark `clamp(4rem, 21vw, 15rem)` at line-height 0.86, tracking −0.02em;
  the 멤피스 deck runs at 0.42em in cobalt.
- Section titles pair a Korean headline (cobalt) with an uppercase English
  subtitle at 0.42em — bilingual as composition, not duplication.

## Texture recipe

One fixed, pointer-transparent layer over the whole viewport: an SVG `<rect>`
filtered through `feTurbulence` (fractalNoise, baseFrequency 0.9, numOctaves
2, stitchTiles) into a `feColorMatrix` that zeroes RGB and scales noise alpha
to 0.08, blended with `mix-blend-mode: multiply` at opacity 0.45 — static
paper/tooth grain, never animated. Net effect is a faint darkening that stops
the warm off-white reading as flat screen and starts reading as stock.
Terrazzo is the second texture: a decorative full-width band of rotated
multicolor chips (deterministic coords, multiply-blended) so the ground reads
as speckled handmade stock. Neither moves — handmade paper does not shimmer.

## Motion vocabulary

| Name | Value | Used for |
| --- | --- | --- |
| clip-wipe-in | scroll-triggered clip-path inset→full, 620ms cubic-bezier(0.16,1,0.3,1), 70ms stagger | hero shapes, studio panel |
| parallax-drift | --mp-x/--mp-y (−1…1) lerped 0.06/frame × depth (8/16/26px) | shape field layers |
| parallax-idle | mutually-prime bob 4.6–9.8s | shapes without a pointer |
| flip-play | First→Last→Invert→Play, 480ms cubic-bezier(0.22,1,0.36,1) | project grid filter |
| flip-fade | incoming opacity 0→1 over 320ms; staggered 50ms per index | new tiles |
| marquee-base | 0.05 px/ms (~50px/s), two rows opposed | manifesto band |
| btn-press | 0ms in / 140ms cubic-bezier(0.22,1,0.36,1) out | buttons + filters |
| squiggle-draw | stroke-dashoffset 100%→0%, 900ms ease-out | hero + tile squiggles |

The page has exactly three technique tags and each one is the headline of a
section: clip-path-reveal in the hero, pointer-parallax across the whole
field, flip-layout as the signature project grid. The press gesture is the
only motion shared across interactive elements — a shape pressing into the
page (0ms in, confident overshoot out), never a spring.

## Space & shape

- The 3px line is the atom: borders, tile edges, the cobalt panel, footer
  dividers — all 3px, all ink. If a line is not 3px it is the teal focus
  ring or a 1px hairline nowhere yet used.
- Shadows are offset solids: 5px/5px on tiles and buttons (0/0 pressed),
  8px/8px on hover. No blur — handmade objects sit on the page, they do not
  float in fog.
- Memphis geometry only: squiggles, blobs, zigzags, half-arches, confetti
  dots, spotted discs. No emojis, no icon-font glyphs. Every shape is inline
  SVG.
- Decoration rotates and offsets; information sits square. Shapes live
  between a few degrees of tilt and their idle bob; copy and tables are
  always upright.
- Hero is one viewport; sections read at 1280px; the marquee and footer are
  full-bleed. The parallax field is fixed behind the stage.

## Voice guide

**Five adjectives:** maximalist · disciplined · geometric · cheerful ·
precise-about-shape.

**Three example lines:**

1. "형태는 자유롭게, 규칙은 단단하게. A studio that builds postmodern brand
   systems — every squiggle earns its place."
2. "다섯 색. 그 이상도, 그 이하도 아님." (Five colors. No more, no less.)
3. "도형마다 할 일이 있다. 장식으로는 쓰지 않는다." (Every shape has a job.
   None is decoration.)

**Three banned words:** *retro* (Memphis is a method, not nostalgia),
*gradient* (color is flat here), *minimal* (the enemy).

Grammar of the voice: declarative Korean-first headlines, English as a
shorter subtitle in caps with open tracking. The Korean line is never a
translation — it is the same principle said the way the studio would say it.
Prices and years use Arabic numerals; color names stay in their token form.

## Do & Don't

**Do**

1. Route every color through the seven tokens; a new shade means a new drum,
   and the studio has five plus ink and paper.
2. Keep shapes as inline SVG — no images, no emoji. The terrazzo, the
   squiggles, the blob silhouettes are all geometry.
3. Let every technique tag be the headline of its section: clip reveal in
   the hero, parallax across the field, FLIP in the grid.
4. Keep the Korean first-class: Black Han Sans, natural word order,
   declarative; read it aloud before shipping.
5. Rotate and scatter the decoration; keep the information square and the
   palette at exactly five.

**Don't**

1. Don't let teal carry text on paper (2.4:1) or cobalt carry ink body
   (3.07:1) — both are surface colors with their own safe text pairings.
2. Don't blur a shadow or fade a gradient in — handmade objects sit on the
   sheet; the page believes it is paper.
3. Don't add a fourth technique tag. Three is the discipline; a fourth is
   decoration the studio would reject.
4. Don't animate anything but transform, opacity, filter, and clip-path —
   and spend the parallax budget once (idle bob is the only ambient loop).
5. Don't let the maximalism become noise. A squiggle with no job gets cut;
   the studio's pride is that every shape survived review.
