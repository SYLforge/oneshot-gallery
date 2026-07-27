# GLITCH — design spec

## Identity

A VFX & experimental-music studio in a Hongdae back-alley basement that treats
render failure as a finished product. The page *is* the studio's broadcast
ident left running: a wordmark whose RGB channels drift apart, scanlines
denser than any working CRT, an ASCII ident that scrambles itself every couple
of seconds and resolves. Everything on screen must feel like it was emitted
by one broken machine that someone decided to trust. The emotional register is
a control room where the error log has become the release notes — confident,
defiant, almost tender about its own corruption.

The Korean is the in-house engineer muttering — terser, blunter, sometimes
funnier than the English, never a translation of it.

## Distinction from PALE.SIGNAL (the other terminal-core entry)

Both entries share the `terminal-core` family, but they are opposite poles of
it. **PALE.SIGNAL** is clean phosphor poetry — one green, one black, a CRT
tube that boots politely and types out the night's log; its motion is rare,
breathing, reverent. **GLITCH** is corrupted hardware — three primaries
tearing against each other, scanlines so dense they read as datamosh, an ident
that scrambles on purpose; its motion is stuttering, defiant, never polite.
Pale-signal is the observatory technician who loves the machine; glitch is the
VFX artist who broke the machine and shipped the break. Visually: pale-signal =
one phosphor green on tube black; glitch = RGB-split primaries on void black.
They would never be mistaken for each other in a corner crop.

## Palette

| Token | Hex | Role | Contrast pairing (on void) |
| --- | --- | --- | --- |
| `void` | `#050508` | ground — the dead screen before power | — |
| `glitch-white` | `#f0f0f5` | primary text, wordmark base, focus ring — the unsplit signal | 17.9:1 (AAA) |
| `cyan` | `#00ffe5` | accent + secondary text, links, ASCII bright band, focus halo | 15.9:1 (AAA) |
| `red-shift` | `#ff0044` | the red channel of chromatic aberration; error/alert tags | 5.17:1 (AA normal) |
| `blue-shift` | `#0044ff` | the blue channel — large/decorative only | 3.17:1 (AA large) |
| `cyan-dim` | `#0aa399` | cyan composited at 72% over void — the calm voice under noise | 6.51:1 (AA+) |
| `mute` | `#9a9aad` | tertiary text — timestamps, metadata, the muttering | 7.37:1 (AAA normal) |
| `error-red` | `#ff3344` | decode-failed / corrupt tags, lifted from red for small-size legibility | ~5.6:1 |
| `grid-line` | `#1d3b39` | **decorative only**: hairline rules, clip-path tear edges, panel numerals | 1.68:1 — never functional text |

A key contrast decision: cyan (`#00ffe5`) measures 15.9:1 on void — high
enough to carry secondary text directly, so unlike PALE.SIGNAL (which had to
derive a `phosphor-dim` token), GLITCH needs no dim derivative for text. The
`cyan-dim` token exists for a calmer tertiary voice, not for contrast rescue.

The RGB primaries are **decorative channels first, text second**: red carries
small alert tags at 5.17:1 (passes AA); blue is large/decorative only (3.17:1
fails normal text). They appear together only in the wordmark and the
glass vignette, where they are ornament, not copy.

## Type system

| Font | Source | Role |
| --- | --- | --- |
| Major Mono Display | Google Fonts | corrupted display — the RGB-split wordmark and section display; single-case geometric glyphs |
| Space Mono | Google Fonts | the machine voice — body, track ledger, log lines, tabular timestamps |
| Noto Sans KR | Google Fonts | every Hangul glyph — a clean modern grotesque, distinct from PALE.SIGNAL's Nanum Gothic Coding |

- Family stack is `Space Mono, Noto Sans KR, monospace`, so Hangul typed
  without markup falls through Space Mono into Noto Sans KR. `:lang(ko)`
  additionally pins Noto Sans KR at `0.94em` with `-0.005em` tracking so it
  sits on the Space Mono rhythm.
- Display (Major Mono Display) is used *only* for the wordmark and section
  titles — single weight (400), single-case, `text-transform: lowercase`,
  optical size large (`clamp(1.4rem, 3.4vw, 2.2rem)` for sections,
  `clamp(3.4rem, 17vw, 13rem)` for the wordmark). Its metrics are too
  theatrical for body copy.
- Body base `clamp(15px, 1.6vw + 9px, 18px)` — Space Mono is a true monospace,
  so the base runs slightly smaller than a proportional UI face would.

## Texture recipe

Two fixed, pointer-transparent overlays above the content, in order:

1. **Scanlines** — `repeating-linear-gradient(0deg, rgba(240,240,245,0.05)
   0 1px, transparent 1px 2px)`. Denser than PALE.SIGNAL's 3px CRT grille
   (1px of ink every **2px**) — the glitch/datamosh aesthetic. Ink is capped
   at 5% alpha so worst-case text contrast stays above AA. The whole layer
   drifts `0 → -2px` over 8.8s (~0.23Hz — photosafe).
2. **Noise** — a tiled SVG `feTurbulence` (fractalNoise, baseFrequency 0.9,
   2 octaves) at 4% opacity over `multiply`. Static — no animation — so it
   never competes with the wordmark burst. The datamosh shimmer.
3. **Vignette** — `radial-gradient(130% 100% at 50% 50%, transparent 58%,
   rgba(255,0,68,0.06) 92%, rgba(0,68,255,0.08) 100%)` — a faint red/blue
   fringe at the corners, chromatic aberration as ambient atmosphere.

The fixed glass tears horizontally once per 7.7s: three ~16ms keyframe
segments of `translateX(2px) skewX(-0.4deg)`. All texture motion dies under
`prefers-reduced-motion: reduce`.

## Motion vocabulary

| Name | Value | Used for |
| --- | --- | --- |
| `ease-tear` | `cubic-bezier(0.85, 0, 0.15, 1)` | clip-path reveals — violent in, settles hard |
| `ease-signal` | `cubic-bezier(0.22, 1, 0.36, 1)` | fades and copy — fast, long tail |
| clip-path tear-in | 480ms `ease-tear`, polygon slit → full | section reveals (every `[data-tear]`) |
| RGB-split burst | single-frame: red −7px / blue +8px for ~16ms every 4.2s | wordmark channels |
| ASCII scramble | every 2.6s, 35% of non-space cells randomize over 220ms (steps(4)) | the ident |
| scan drift | 0 → −2px over 8.8s linear infinite | scanline overlay (~0.23Hz) |
| reveal fade | 480ms `ease-signal`, translateY(10px)→0, 60ms batch stagger | copy reveals |
| cursor blink | 1.1s `steps(2, jump-none)` | (reserved — not currently used) |
| tear jitter | 7.7s cycle; one ~16ms `translateX(2px) skewX(-0.4deg)` segment | the glass |

Timing rule: every ambient cycle is well below 3Hz (scan drift ~0.23Hz,
wordmark burst one frame per 4.2s, tear one frame per 7.7s) so nothing
flickers fast enough to be a photosensitive hazard. Periods (4.2 / 7.7 / 8.8s)
share no common divisor, so the ambient motion never visibly loops.

## Space & shape

- Containers: manifesto and tracks breathe at 1280px; ASCII and footer read
  at 980px / 880px. Section padding `clamp(64px, 10vh, 128px)`; hero is
  exactly one viewport.
- Shapes are rectangles only. No border-radius above 1px. Rules are 1px
  solid/dashed/dotted `grid-line` — solid for section heads, dashed for the
  catalogue (machinery), dotted for footer data (records).
- One accent geometry: the RGB-split wordmark layers stacked with
  `mix-blend-mode: screen`, and the clip-path torn panels.

## Voice guide

**Five adjectives:** defiant · technical-fluent · dry-funny · corruption-as-craft
· confident-under-failure.

**Three example lines:**

1. "the drop is a single corrupted I-frame looped for thirty-two bars. the
   mastering engineer cried; we kept it." / "드롭은 손상된 I-프레임 하나를
   32마디 동안 루프한 것이다. 마스터링 엔지니어가 울었다. 우리는 그대로 두었다."
2. "sample rate drifts 0.7% over the runtime. nobody notices unless they try
   to mix it. that is the point." / "샘플레이트가 재생 시간 동안 0.7% 흘러간다.
   믹스하려 하지 않으면 아무도 모른다. 그게 요점이다."
3. "we keep the broken frames." / "우리는 부서진 프레임을 모은다."

**Three banned words:** *seamless* (the studio worships the seam),
*polished* (nothing here is polished), *magical* (it is engineering, own it).

Grammar of the voice: lowercase English except protocol nouns (GLT-001, BPM,
RENDERING); technical claims open with a number or a codec; the Korean line is
the same observation re-felt — blunter, sometimes funnier — never a literal
translation (transcreation).

## Do & Don't

**Do**

1. Route every color through a token — if you need a new shade, derive it
   from a primary and name it.
2. Keep the Korean first-class: Noto Sans KR, natural word order, blunt
   engineer's voice; read it aloud before shipping.
3. Let states snap — hover highlights and track notes appear instantly;
   only entrances (tears, fades, bursts) are animated.
4. Keep every ambient cycle below 3Hz and mutually prime; the page should
   feel unstable, never strobing.
5. Write new copy as release notes: codec, artifact, the defiant one-liner.

**Don't**

1. Don't use grid-line for anything a user must read — it is a trace, not a
   voice.
2. Don't let the wordmark channels tween — `steps(1, end)` instant cuts are
   the whole point; easing makes it "animated", not "broken".
3. Don't animate layout — transform, opacity, filter, clip-path only; nothing
   else moves in this studio.
4. Don't add a fourth color to the primaries — red/blue/cyan/white is the
   entire RGB-split system; a fifth collapses it into "rainbow theme".
5. Don't let the fiction apologize — no "oops a bug!" winks; the studio
   believes corruption is craft.
