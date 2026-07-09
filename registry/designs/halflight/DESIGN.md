# HALFLIGHT — design spec

## Identity

A composer who writes original scores for films that were never shot. The
page is not a portfolio *about* the studio — it *is* the studio's screening
room: lights off, one reel threaded, the cue sheet open on the mixing desk.
Every scroll section is a reel; every heading is a slug line; the visitor is
the projectionist (scroll is the projector). The emotional register is
elegy played completely straight: the films are spoken of as real, their
absence is never a joke. The Korean line is not a translation layer; it is
the same direction, re-heard — terser, and a shade warmer.

## Palette

| Token | Hex | Role | Contrast pairing (on screen-black) |
| --- | --- | --- | --- |
| `screen-black` | `#0b0b0d` | background; the screen with the lamp off | — |
| `abyss` | `#000000` | letterbox bars, frame surround, credits stage | darker than the screen so the picture reads as lit |
| `bone` | `#e8e4da` | primary text, score envelope, the disc in shot B | 15.5:1 (AAA) |
| `bone-dim` | bone @ 64% α (≈ `#989690`) | secondary text: Korean glosses, captions, HUD | 6.6:1 (AA+) |
| `signal-red` | `#d43425` | **the one accent**: cue dots, focus ring, selection, struck-cue spine, THE END | 4.0:1 — large type & non-text only, never body text |
| `tungsten` | `#a08560` | warm metadata: slug lines, timecodes, credit roles | 5.6:1 (AA) |
| `hairline` | bone @ 14% α (≈ `#2a2a2c`) | decorative rules | never carries text |

The reel's interior grays (`#050506`–`#1a191c`, light washes of
`rgb(226 222 212)`) are a derived neutral ladder between abyss and bone —
no hue ever enters the picture. Red appears on screen at most once per
viewport: hero cue dot, reel-end cue mark, play dot, playhead, struck spine,
THE END. If a second red shows up in the same frame, one of them is wrong.

## Type system

| Font | Source | Role |
| --- | --- | --- |
| Anton | Google Fonts | the title card and section display — condensed capitals, one weight |
| Spectral | Google Fonts | prose: directions (italic), cue notes, program copy |
| Space Mono | Google Fonts | the machine: timecodes, FR counters, cue leaders, credit roles |
| Noto Serif KR | Google Fonts | every Hangul glyph — its own serif voice |

- Body stack `Spectral, Noto Serif KR, Georgia, serif` and mono stack
  `Space Mono, Noto Serif KR, monospace`: Hangul falls through the Latin
  face with no markup; `:lang(ko)` pins the family, zeroes tracking, and
  sets `word-break: keep-all`.
- Title: `clamp(3rem, 16.5vw, 12.5rem)` at line-height 0.92 — the word
  should almost touch the letterbox bars.
- Section heads `clamp(1.9rem, 4.4vw, 3.2rem)`; Korean rides them at 0.48em
  in bone-dim, weight 600.
- Mono is always small (0.7–0.85rem) and always tracked (0.1–0.32em):
  machine text is read at a distance, like a counter.

## Texture recipe

Two grains, both procedural, both dead under reduced motion:

1. **DOM (hero)** — an SVG `feTurbulence` data-URI tile (baseFrequency 0.8,
   desaturated) at 7% opacity, oversized by 60px on every side and jumped
   between five fixed offsets with `steps(1, end)` at ~0.26s per position.
   Discrete jumps read as frames of stock; a smooth drift would read as fog.
2. **Canvas (reel)** — a 160px speck tile pre-rendered once (bright specks
   where `Math.random() > 0.82`, dark below 0.16), tiled with
   `globalCompositeOperation: "overlay"` at 0.45 alpha, re-offset at ~12fps
   while the display runs at 60 — grain lives at film cadence, the scrub at
   display cadence. Under it, a wear pass hashed off the frame number:
   scratches that survive ~3 frames, 0–3 dust motes, a per-frame lamp
   flicker (3–8% black wash). Over it, a radial vignette to 62% black.

Letterboxing is structural, not painted: pure-`#000` bars in the hero, and
the reel frame is a true `aspect-ratio: 2.39 / 1` box on an abyss strip.

## Motion vocabulary

| Name | Value | Used for |
| --- | --- | --- |
| `ease-out-cine` | `cubic-bezier(0.16, 1, 0.3, 1)` | reveals — fast in, long tail |
| gate weave | 7.3s `steps(1, end)`, nine positions within ±0.7px/±0.9px | the title, loose in the gate |
| char rise | 700ms per glyph, translateY(0.35em)→0, 55ms stagger | title card reveal |
| cue blink | 8.1s cycle, two ~0.7% dips to 0.15 opacity | hero cue dot |
| grain step | 1.3s `steps(1, end)` (DOM) · 83ms re-seed (canvas) | both grains |
| scrub lerp | 0.12 / 60fps-normalized frame | the reel trails the scroll like film mass |
| reel dissolve | smoothstep over scroll p 0.45–0.60 | shot A → shot B |
| reveal | 600ms `ease-out-cine`, translateY(18px)→0, 70ms batch stagger | cue sheet, score section |
| audio attack / release | 1.6s / 0.55s exponential on master gain | the drone's envelope |
| strings entry | `osc.start(now + 3)`, 2.8s linear swell | the copy, made literal |
| drone weather | LFOs 0.07Hz (filter ±320Hz), 0.11Hz (swell ±0.24) | the cue never sits still |
| credit roll | `translateY(calc(80svh − p·(80svh + 100%)))` over 300vh | end credits scrub |

Timing rule: ambient cycles (7.3s weave, 8.1s blink, 1.3s grain) share no
common divisor — the dark never visibly loops.

## Space & shape

- The master width is the picture: `--hl-frame-w: min(1100px, 92vw, 148svh)`
  sizes the reel frame, its header, and its caption as one column; prose
  sections read at 880px.
- Section padding `clamp(72px, 12vh, 150px)`; the hero and both scrub
  stages are exactly one viewport tall.
- Shapes are rectangles and one circle (the cue dot). No border-radius
  above the 1px focus-ring correction, no drop shadows except the cue
  dot's glow; rules are 1px hairlines.
- Scrub corridors (380vh reel, 300vh credits) exist only under
  `.halflight-js` and collapse to normal flow without JS or with reduced
  motion — the letterboxed look must never depend on JavaScript.

## Voice guide

**Five adjectives:** terse · nocturnal · procedural (in both senses) ·
elegiac · deadpan.

**Three example lines:**

1. "INT. MEMORY — NIGHT." / "내부. 기억 — 밤."
2. "Cue 04: the strings enter three seconds late, on purpose." /
   "큐 04: 현악은 3초 늦게, 의도적으로 들어온다."
3. "Nothing plays. The rain is the score." / "아무것도 연주하지 않는다.
   비가 곧 음악이다."

**Three banned words:** *cinematic* (the page must be it, never say it),
*dreamlike* (too easy an alibi), *soundtrack* (this studio writes scores).

Grammar of the voice: slug lines in tracked mono capitals, ending in a full
stop; cue notes in Spectral, one clause of direction and no adjectives it
can't defend; the Korean line is a transcreation with its own rhythm —
usually shorter, never explanatory.

## Do & Don't

**Do**

1. Draw everything. If a texture, frame, or waveform is needed, generate it
   in code — this entry's premise is that no asset file exists.
2. Hash, don't random: frame-indexed hashes keep wear deterministic, so
   scrubbing backward shows the same scratches — film has a memory.
3. Keep red an event. Count its appearances per viewport; the answer
   should be one.
4. Let machine text (mono) state facts and serif text carry feeling; never
   swap their jobs.
5. Tear audio down all the way: every stop path ends with a closed
   AudioContext.

**Don't**

1. Don't add a second accent or any hue to the reel's grays — the moment
   the sea turns blue, the fiction collapses into a template.
2. Don't animate layout — transform and opacity only; the canvas does its
   own compositing.
3. Don't let the reel free-run: its only clock is the scroll (grain
   excepted, at 12fps). An auto-playing reel is a video, and this page
   refuses to be one.
4. Don't soften the gate weave into a smooth wobble — `steps(1)` or
   nothing; projectors jump.
5. Don't let the fiction wink. The films are missing, not fake; nobody on
   this page knows it is a website.
