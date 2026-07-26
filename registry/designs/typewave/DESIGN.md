# TYPEWAVE — design spec

## Identity

An electronic artist whose only instrument is the typeface. The page is not a
landing *about* a release — it *is* the release: the wordmark behaves like a
waveform, the section heads react to scroll like amplitude, and a pinned
section scrubs the letterforms across their whole width/weight range like an
audio timeline being swept by a filter. The emotional register is a club
before the lights come up — confident, rhythmic, a little overdriven, never
gimmicky. The Korean line is not a translation layer; it is the same track
re-heard, usually punchier, in a heavier voice.

## Palette

| Token | Hex | Role | Contrast pairing (on ground `#000`) |
| --- | --- | --- | --- |
| `ground` | `#000000` | the stage — pure black ground; type is the only thing lit | — |
| `ink` | `#fafafa` | primary text, the resting wordmark | 20.1:1 (AAA) |
| `ink-dim` | `#98948a` | secondary text: Korean glosses, BPM, durations | 6.9:1 (AA+) |
| `ink-faint` | `#5f5d57` | decorative only: hairlines, dim marquee band, spectrum grid | never carries meaning |
| `acid` | `#c6ff3a` | **the one accent** — focus ring, selection, scrub playhead, acid marquee band, the head's overdriven state | 17.8:1 — clears AA normal text, but held for display type, marks, and inverted text on acid fills rather than body copy |
| `panel` | `#0e0e0e` | lifted dark surface: scrub stage surround, marquee bed, footer field | ink reads 11.7:1, acid 16.3:1 |
| `ink-on-acid` | `#000000` | inverted text on acid fills (the acid marquee band, pressed chips) | 17.8:1 on the acid |

One accent, on purpose. The page commits to a single electric green and never
introduces a hue. The acid appears as: the focus ring, the selection, the
scrub playhead (a pulsing vertical rule), the third marquee band (inverted —
acid ground, black text), the section-head numbers, the spectrum-baseline
hairlines, and the waveform zero-crossing line in the hero. The page stays
almost entirely black/ink until you scroll — then the acid arrives where the
motion is.

## Type system

| Font | Source | Role |
| --- | --- | --- |
| Archivo | Google Fonts (variable, axes wdth + wght) | the synthesizer — the wordmark and every Latin display head; the width axis is the whole kinetic premise |
| Black Han Sans | Google Fonts | the Korean drum — every Hangul display glyph; the heavy blocky mass the wordmark translates into |
| Noto Sans KR | Google Fonts | Korean body voice — prose, liner notes, footer copy; Korean never falls through to a Latin sans |
| Space Mono | Google Fonts | the patch sheet — BPM, timecodes, track numbers, axis readouts |

- Display stack `Archivo, Black Han Sans, sans` and body stack
  `Archivo, Noto Sans KR, sans`: a Korean glyph in a display head falls
  through Archivo into Black Han Sans — a deliberate heavy face, not the
  default sans. `:lang(ko)` additionally pins Korean to its own families,
  zeroes tracking, and sets `word-break: keep-all`.
- Hero wordmark `clamp(3.4rem, 19vw, 16rem)` at line-height 0.86, weight 900,
  `letter-spacing -0.025em` — the letters should almost touch the viewport
  edges. The Korean wordmark rides under it in Black Han Sans.
- The scrub wordmark travels the full axis range (wdth 62 → 125, wght 100 →
  900); the closer parks at the terminal state (wdth 125, wght 900) — the
  widest and heaviest the type goes.
- Mono is always small (0.72rem), always tracked (0.08em), always uppercase
  and tabular — machine text read at a distance, like a patch readout.

## Texture recipe

None — and that *is* the recipe. There are no images, no `feTurbulence`
grain, no canvas. The texture is the type itself: a fixed 8-row grid of faint
acid hairlines behind the scrub wordmark reads as a spectrum-analyzer
baseline; a 1px acid rule under the hero wordmark behaves like a waveform's
zero-crossing. Everything else is flat, committed color on flat, committed
black. This entry's premise is that kinetic letterforms are a complete
surface — adding grain would dilute the idea that the type is the instrument.

## Motion vocabulary

| Name | Value | Used for |
| --- | --- | --- |
| `ease-wave` | `cubic-bezier(0.33, 1, 0.68, 1)` | reveals — fast out, long settle; type resolves like a note decaying |
| `ease-scrub` | `cubic-bezier(0.22, 1, 0.36, 1)` | the scrub's lerp frame |
| char-rise | 640ms `ease-wave`, translateY(0.32em)→0 + opacity 0→1, 45ms stagger, backwards fill | hero & footer wordmark entrance |
| vel-stretch | per-glyph `scaleX(1 + velocity·0.42)`, alternating phase, decay 0.16/frame | the hero wordmark's amplitude reaction to scroll velocity |
| head-track | `letter-spacing` opened by `velocity·0.12em` via `--tw-track` | the tracklist head — a restrained echo of the hero stretch |
| wdth-scrub | `font-variation-settings 'wdth' 62→125, 'wght' 100→900`, smoothstep-eased, lerp 0.14/frame | the pinned scrub — a filter sweeping the spectrum |
| acid-pulse | 2.4s ease-in-out infinite alternate, opacity 0.55 → 1 | the scrub playhead — a held beat, not a flicker |
| marquee-l | linear, 38s, translateX(-50%) | top lyric band, left, resting tempo |
| marquee-r | linear, 30s, translateX(-50%) reverse | middle band, right, faster — counterpoint |
| marquee-acid | linear, 22s, translateX(-50%) | acid band, left, fastest and loudest |

Timing rules: the three marquee periods (38s / 30s / 22s) share no common
divisor, so the bands never visibly re-sync. The acid pulse (2.4s) and the
vel-stretch decay (≈ a few frames) operate on different clocks — the page
never visibly loops as a whole. Velocity is the only reactive input; every
ambient cycle is constant.

## Space & shape

- The master width is `--tw-maxw: 1440px` with `clamp(16px, 4vw, 48px)`
  margins; prose reads inside that, the scrub stage centers within it.
- Section padding `clamp(64px, 11vh, 132px)`; the hero and the scrub stage
  are exactly one viewport tall.
- Shapes are rectangles and the single acid vertical playhead. No
  border-radius above the 1px focus-ring correction, no drop shadows except
  the playhead's acid glow; rules are 1px hairlines.
- The scrub corridor (320vh) exists only under `.typewave-js` and collapses
  to normal flow without JS or with reduced motion — the morph must never
  depend on JavaScript to be a complete, readable section.

## Voice guide

**Five adjectives:** rhythmic · overdriven · procedural · confident ·
bilingual-as-first-class.

**Three example lines:**

1. "Scroll is the play head." / "스크롤이 재생 머리다."
2. "The faster you scroll, the harder the glyphs pull. Effort becomes
   amplitude." / "빠를수록 글자가 세게 당겨진다. 노력이 진폭이 된다."
3. "Hold anywhere; the type holds with you. The wordmark has no clock of its
   own — only your scroll." / "멈추면 글자도 함께 멈춘다. 워드마크에는 자기
   시계가 없다 — 오직 당신의 스크롤뿐."

**Three banned words:** *kinetic* (the page must be it, never say it),
*animated* (type moves; it is not "animated"), *cool* (the easiest alibi).

Grammar of the voice: machine text (mono) states facts — BPM, durations, axis
values; display text carries the gesture. The Korean line is a transcreation
with its own rhythm — usually shorter and punchier, never explanatory, never
translationese.

## Do & Don't

**Do**

1. Let the type be the instrument. If a texture, surface, or flourish is
   needed, ask first whether a letter being moved could do it.
2. Keep one accent. Count the acid's appearances per viewport; it should be
   an event wherever it lands.
3. Make velocity the only reactive input — amplitude written into the glyphs
   is the signature, and a second reactive channel would muddy it.
4. Gate every pre-reveal, scrub corridor, and marquee behind `.typewave-js`:
   the no-JS page is the finished page.
5. Treat Korean as first-class copywriting — Black Han Sans and Noto Sans KR
   are voices, not fallbacks.

**Don't**

1. Don't add a second hue, a gradient, or grain — the moment a second color
   arrives, the one-accent commitment collapses into a template.
2. Don't animate layout (except the single deliberate head letter-spacing,
   which *is* type). The wordmark morph uses `font-variation-settings` and
   `transform`; everything else is `transform`/`opacity`.
3. Don't let the scrub free-run. Its only clock is the scroll; an
   auto-playing morph is a screensaver, and this page refuses to be one.
4. Don't soften the velocity stretch into a uniform bulge — the alternating
   per-glyph phase is what makes it read as a wave rather than a balloon.
5. Don't let the fiction wink. The artist is real on this page; nobody here
   knows it is a website.
