# PALE.SIGNAL — design spec

## Identity

A decommissioned radio observatory on a Korean mountain ridge, est. 1979,
retired 2019, still listening. The page is not *about* the station — it *is*
the station: its public terminal, left on, publishing the night's log to
anyone who finds it. Everything on screen must feel like it was emitted by
one machine: one green, one glass, one voice. The emotional register is a
technical document that keeps almost saying something tender, and stops
itself. The Korean is not a translation layer; it is the operator's own
hand, terser and warmer than the English.

## Palette

| Token | Hex | Role | Contrast pairing (on tube-black) |
| --- | --- | --- | --- |
| `tube-black` | `#0a0f0a` | background; the unlit screen | — |
| `phosphor` | `#33ff66` | primary text, cursor, focus ring, bright ASCII band | 14.5:1 (AAA) |
| `phosphor-dim` | `#27b54a` (phosphor @ 72% α) | secondary text: timestamps, Korean glosses, captions | 7.2:1 (AAA normal) |
| `dim-trace` | `#1d5c31` | **decorative only**: rules, section numerals, faintest ASCII cells | 2.4:1 — never functional text |
| `amber-alert` | `#ffb000` | the one flagged log entry; the retired dish status | 10.6:1 (AAA) |
| `glass-glare` | `#c8ffd9` | glare washes at ≤7% alpha; full-strength only as ASCII peak glints | 17.3:1 (never body text) |

Derived working tokens: `grid-line` = dim-trace @ 40% α (borders),
`scan-ink` = `rgba(3,8,4,0.28)` (scanline dark). No teal. No gradient blobs —
the only gradients are the CRT glass itself (scanlines, glare, vignette).

## Type system

| Font | Source | Role |
| --- | --- | --- |
| VT323 | Google Fonts | Latin display, log body, digits, the canvas ASCII glyphs |
| Nanum Gothic Coding | Google Fonts | all Hangul — the operator's hand |

- Family stack is `VT323, Nanum Gothic Coding, monospace`, so Hangul falls
  through VT323 into Nanum even where no `lang` attribute exists (the boot
  `<pre>`); `:lang(ko)` additionally compacts Korean to `0.8em` with
  `-0.01em` tracking so it sits on VT323's baseline rhythm.
- Base size `clamp(17px, 2.2vw + 10px, 21px)` — VT323 is drawn small, so the
  base runs larger than a normal UI face.
- Display: title `clamp(3.1rem, 12.5vw, 10.5rem)` at line-height 0.9;
  section heads `clamp(1.5rem, 3vw, 2.1rem)`, weight 400 everywhere —
  the tube has exactly one stroke weight.
- Static phosphor halo on display type only:
  `text-shadow: 0 0 18px rgba(51,255,102,.55), 0 0 70px rgba(51,255,102,.22)`.

## Texture recipe

Three fixed, pointer-transparent layers over the whole viewport, in order:

1. **Scanlines** — `repeating-linear-gradient(0deg, scan-ink 0 1px,
   transparent 1px 3px)`. 1px of ink per 3px keeps worst-case text contrast
   above AA.
2. **Glare** — `radial-gradient(120% 90% at 50% 8%, rgba(200,255,217,0.07),
   transparent 55%)`, resting opacity 0.8, breathing twice per 9.4s cycle
   (0.8 → 1 → 0.6 → 0.8, each step ~20ms).
3. **Vignette** — `radial-gradient(130% 100% at 50% 45%, transparent 60%,
   rgba(2,5,3,0.5) 100%)`.

Beneath the glass, the content layer stumbles once per 12.4s: three ~19ms
keyframe segments of `translateX(3px) skewX(-0.6deg)` → `translateX(-2px)`
→ `translateX(1px)`. All texture motion dies under
`prefers-reduced-motion: reduce`.

## Motion vocabulary

| Name | Value | Used for |
| --- | --- | --- |
| `ease-out-signal` | `cubic-bezier(0.16, 1, 0.3, 1)` | scroll reveals, appears — fast in, long tail |
| `ease-crt` | `cubic-bezier(0.7, 0, 0.2, 1)` | title bloom — violent, then settles |
| boot char cadence | 9ms + 0–12ms jitter; 35% two-char bursts | typewriter |
| boot line pause | 140ms + 0–160ms; ×3.5 before the sign-off line | typewriter |
| title bloom | 950ms `ease-crt`, brightness 3.5→1 / blur 10px→0, two collapses | hero resolve |
| reveal | 600ms `ease-out-signal`, translateY(16px)→0, 70ms batch stagger | log, dishes, footer |
| pointer lerp | 0.085 / 60fps-normalized frame | ASCII bloom position |
| energy attack / release | 0.06 / 0.025 | quick to notice you, slow to forget you |
| auto drift | lissajous `x: .5+.34sin(.00021t)`, `y: .46+.26sin(.00033t+1.7)` | touch / idle fallback |
| cursor blink | 1.06s `steps(2, jump-none)` | block cursor |
| crt jitter / glare flicker | 12.4s / 9.4s cycles | texture (see above) |

Timing rule: no two ambient cycles share a period (1.06 / 9.4 / 12.4s), so
the page never visibly loops.

## Space & shape

- Rhythm derives from the terminal cell: gaps and paddings are multiples of
  the ~14px ASCII cell where visible (canvas grid, log gaps).
- Containers: log and footer read at 880px; ledger and hero breathe at
  1240px; the signal field is full-bleed with hairline top/bottom rules.
- Section padding `clamp(64px, 10vh, 128px)`; hero is exactly one viewport.
- Shapes are rectangles only. No border-radius above 1px (the focus ring's
  optical correction). Rules are 1px solid/dashed/dotted `grid-line` —
  dashes for machinery (dishes), dots for records (footer data).
- One accent geometry: the left border on log entries, thickened and
  amber-tinted on the flagged entry.

## Voice guide

**Five adjectives:** laconic · nocturnal · precise · tender-under-protocol ·
unhurried.

**Three example lines:**

1. "01:38 KST — static that sounded like rain. we listened until it
   stopped. it did not stop." / "빗소리를 닮은 잡음. 그칠 때까지 들었다.
   그치지 않았다."
2. "azimuth drive DISH-03 ......... retired — skipped, with respect" /
   "3호기 — 퇴역. 예를 갖춰 건너뜀."
3. "first light. the sky changes the subject." / "동이 튼다. 하늘이 말끝을
   돌린다."

**Three banned words:** *cosmic* (too easy), *magical* (the station would
never), *innovative* (it is forty-seven years old).

Grammar of the voice: lowercase English except protocol nouns (DISH-01,
KST, OK); timestamps open every claim; the Korean line is never a literal
translation — it is the same observation, re-felt (transcreation).

## Do & Don't

**Do**

1. Route every color through a token — if you need a new shade, derive it
   from phosphor or dim-trace and name it.
2. Keep the Korean first-class: Nanum Gothic Coding, natural word order,
   its own rhythm; read it aloud before shipping.
3. Let states snap — hover highlights and dish notes appear instantly;
   only entrances (reveal, bloom, appear) are eased.
4. Keep ambient cycles long, rare, and mutually prime; the screen should
   feel alive, not busy.
5. Write new copy as log lines: timestamp, observation, restraint.

**Don't**

1. Don't use dim-trace for anything a user must read — it is a trace, not
   a voice.
2. Don't add a second accent hue; amber appears exactly where something is
   wrong (one log entry, one retired dish).
3. Don't animate layout — transform, opacity, filter only; nothing else
   moves on this station.
4. Don't smooth the terminal: no border-radius, no drop shadows, no glass
   blur panels; the only glass is the CRT overlay.
5. Don't let the fiction wink — no jokes about being a website; the
   station believes it is a station.
