# NIGHT-SNACK — design spec

## Identity

새벽 한 시의 포장마차 — the third webtoon twin. Where PPANG! is a cozy dawn
bakery (warm cream paper, brown ink, generated art) and MOONLIT is a lonely
delivery ride (cold indigo night, generated art), NIGHT-SNACK is the vibrant,
crowded, steamy chaos of a pojangmacha street-food tent at 1 AM: neon signs,
steam off the odeng, soju glasses clinking, skewers on the grill, halftone-dot
SFX lettering. Energetic and social, not lonely or cozy.

The page is Korean-first. Every pairing leads with Hangul; English is the
leaning subtitle. The voice is the loud, friendly 아줌마 who runs the tent —
the person who tops up your odeng broth without asking.

## Distinctness thesis (load-bearing)

NIGHT-SNACK is **pure code** — no generated imagery, unlike PPANG! and
MOONLIT which ship ComfyUI illustrations. Everything on screen is CSS/SVG
webtoon illustration: flat shapes, halftone dots, speech-bubble SFX, neon
glow via text-shadow stack. `media.source: "code"`, budget 0.

| Axis | PPANG! (1st) | MOONLIT (2nd) | NIGHT-SNACK (3rd, this) |
| --- | --- | --- | --- |
| Mood | warm dawn bakery | cold lonely delivery | **loud neon crowd** |
| Palette | cream/brown/apricot | indigo/neon-blue/amber | **night/amber/pink/soju-green** |
| Art | generated webtoon illos | generated webtoon illos | **pure CSS/SVG shapes** |
| Techniques | clip-path/char-split/parallax | typewriter/svg-line-draw/marquee | **sprite-scrub/drag-physics/ascii-render** |

All three technique tags are entirely different from both siblings. A
grayscale screenshot of each is unmistakable: PPANG! is warm-light,
MOONLIT is cold-dark-blue, NIGHT-SNACK is dark-neon-busy.

## Palette

Deep night ground `#14101c` (not pure black — a warm-dark, the color of a
tent's shadow at 1 AM). Three neon signage accents that never compete
because each owns a zone:

| Token | Hex | Role | Contrast |
| --- | --- | --- | --- |
| `night` | `#14101c` | ground — the tent's shadow | — |
| `night-deep` | `#0c0913` | footer, recessed panels | — |
| `amber` | `#ffb347` | neon amber — grill, signage primary | 7.9:1 on night (AA) |
| `pink-neon` | `#ff5e8a` | neon pink — signage secondary, SFX | 5.8:1 on night (AA) |
| `soju-green` | `#7ad67a` | soju bottles, "fresh" cues | 8.1:1 on night (AA) |
| `steam` | `#f4ede0` | steam, odeng, rice — the warm whites | 13.2:1 (AAA) |
| `ink` | `#1a1410` | text on light surfaces (menu board) | — |
| `paper` | `#f5efe1` | menu board ground (the only light surface) | — |

Amber is the functional accent (focus rings, links, primary neon). Pink
and soju-green are decorative/signage only.

## Type system

| Font | Source | Role |
| --- | --- | --- |
| Black Han Sans (400) | next/font/google | Korean display — the wordmark 야식, neon signs, SFX. Heavy and blocky, the voice of a hand-painted tent sign |
| Gaegu (400/700) | next/font/google | Korean body — handwritten, the friendly 아줌마 voice |
| Noto Sans KR (400/500) | next/font/google | Korean body fallback, longer prose |
| Space Mono (400/700) | next/font/google | English + ASCII neon, prices, the "terminal" of the cash box |

Family stacks lead with the Korean face; `:lang(ko)` pins Black Han Sans /
Gaegu. English captions are Space Mono (the only mono, for the receipt feel).

## Techniques (3, all distinct from siblings)

1. **sprite-scrub** — a steam/halftone sprite sequence scrubbed by scroll
   (the food cooking). Six code-drawn frames whose opacity is driven by
   `--ns-steam ∈ [0,1]`; a sticky stage holds the grill scene while the
   text flows past. The steam rises denser as you "lean in" (scroll down).
2. **drag-physics** — draggable soju glasses / skewers you can "clink."
   Each glass is a point mass with inertia + spring-back (semi-implicit
   Euler, k=0.16, c=0.38); overlap detection on release fires a spark SFX
   (a CSS burst). Touch + pointer + keyboard reachable.
3. **ascii-render** — neon signs rendered as ASCII-art glow (`_/-\|*`
   characters in amber/pink text-shadow stacks) that flicker on a slow,
   tired-tube cycle. The signage reads "오뎅" / "소주" / "야식" in ASCII
   block letters — distinctly retro-tent, distinctly code.

## Motion vocabulary

- `ease-clink` `cubic-bezier(0.34, 1.56, 0.64, 1)` — glass clink overshoot
- `ease-steam` `cubic-bezier(0.16, 1, 0.3, 1)` — steam settle
- `neon-flicker` — opacity keyframes at 3.2s/4.1s/5.7s (mutually prime, never sync)
- `steam-rise` — translateY + opacity, scrubbed, never autoplay
- All per-frame writes are transform/opacity only. rAF pauses offscreen
  and on `visibilitychange`.

## Accessibility

- **Reduced motion:** neon signs hold steady (no flicker), steam sits at
  first frame, glasses rest at home, sprite-scrub pins to mid-cook. Page
  is a complete readable menu.
- **No-JS:** every pre-reveal/pre-scrub state is gated behind `.night-js`
  added on mount. Without JS the tent is open, the menu is readable, the
  signs are lit.
- **Contrast:** all text passes AA. Amber 7.9:1, pink 5.8:1, soju-green
  8.1:1, steam 13.2:1 on night.
- **Semantics:** each neon sign is `role="img"` with bilingual alt; the
  menu is a real `<ul>`; the clink interaction is a real `<button>` per
  glass with `aria-label`.

## Do & Don't

**Do**
1. Let the tent be loud — halftone dots, SFX, neon. This is the social twin.
2. Keep every shape flat CSS/SVG — no generated images. The "code-only"
   constraint is what makes this entry distinct from its siblings.
3. Korean-first. The 아줌마 speaks Korean; English is the receipt.
4. Make the clink satisfying — a real spring, a real spark, real momentum.

**Don't**
1. Don't reuse PPANG!'s or MOONLIT's techniques. All three tags differ.
2. Don't animate layout — transform, opacity, the two scrub custom
   properties (`--ns-steam`, `--ns-neon`), nothing else.
3. Don't let the neons compete — each color owns a zone (amber=grill,
   pink=signage, soju-green=bottles).
4. Don't forget the menu must be fully readable without any interaction.
