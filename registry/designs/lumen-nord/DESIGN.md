# LUMEN NORD — design spec

## Identity

A joint observatory — one station on a Norwegian ridge at 69°N, one office
in Seoul — that issues aurora forecasts the way other agencies issue
weather: bulletin numbers, confidence percentages, visibility windows. The
page is not *about* the bureau; it *is* tonight's bulletin, posted where
anyone can read it. The register is a meteorologist who has watched the sky
too long to stay entirely clinical: readings first, feeling smuggled in
after the decimal point. The Korean is the Seoul office's own hand — the
same forecast, re-felt, never a caption.

## Palette

| Token | Hex | Role | Contrast pairing (on polar-night) |
| --- | --- | --- | --- |
| `polar-night` | `#0e1330` | background; deepens toward `#080b20` on scroll | — |
| `aurora-green` | `#6ff2c3` | accent, focus ring, kickers, gauge fill, sparkline dots | 13.1:1 (AAA) |
| `magenta-veil` | `#c26bf2` | curtain hem, dusk end of the scroll blend, section readings | 5.8:1 (AA — never long body text) |
| `ice` | `#dfe9ff` | primary text; the specular highlight | 14.9:1 (AAA) |
| `ice-dim` | `#a4adc5` (ice @ 72% α) | secondary text: captions, Korean glosses, labels | 8.1:1 (AAA normal) |
| `horizon` | `#27406b` | **decorative only**: hairlines, ridge glow | 1.9:1 — never functional text |
| `glass-fill` | `#121838` @ 58% α | glass panel body under blur(14px) saturate(150%) | keeps ice ≥ 5.7:1 over worst-case afterglow |

Derived working token: `--lumen-blend`, a JS-lerped magenta→green keyed to
scroll — the only color on the page allowed to change over time. Scrims of
polar-night sit under the masthead so ice text never meets the brightest
curtain unprotected.

## Type system

| Font | Source | Role |
| --- | --- | --- |
| Hahmlet | Google Fonts | variable serif drawn for Hangul and Latin together — masthead, panel values, every poetic line |
| Sora | Google Fonts | instrument voice — body, kickers, readings, labels, SVG axis text |

- The body stack is `Sora, Hahmlet, sans-serif`: Hangul falls through Sora
  into Hahmlet with no markup, so **Korean body text is serif on purpose**.
  This single decision keeps the page out of generic SaaS-glass territory.
- `:lang(ko)` adds `word-break: keep-all` and −0.005em tracking; Korean is
  never letter-spaced apart, even in uppercase-tracked kickers (tracking is
  halved on the Korean half of the kicker).
- Display: masthead `clamp(3.1rem, 11.5vw, 9.5rem)` at line-height 0.98,
  weight 600; panel values `clamp(1.9rem, 3.4vw, 2.7rem)` weight 500;
  section heads `clamp(1.7rem, 3.4vw, 2.6rem)` weight 500.
- Instrument text (kickers, labels, metas) runs 0.68–0.74rem, weight 600,
  tracked 0.14–0.24em, uppercase — the bulletin's monospace-free answer to
  a readout.

## Texture recipe

Three skies, stacked, never all visible at once:

1. **The shader** — 3-octave value-noise fbm, domain-warped
   (`rib = fbm(q + fbm(q)·2.2)`), sharpened into curtains with
   `pow(1 − |2·rib − 1|, 2.6)`, combed by a fine vertical ray noise,
   over hashed stars that twinkle at their own rates. A per-frame hash
   dither (±0.003) kills gradient banding on dark panels.
2. **The understudy** — an always-painted CSS aurora: three radial blobs
   (green ×2, magenta ×1) + a horizon glow + a conic sweep, blurred 26px,
   drifting on 26s/19s alternate cycles (no common divisor). It is the
   no-JS view, the no-WebGL view, and the context-lost view; the canvas
   fades in over it only after a first frame truly lands.
3. **The speckle** — behind the bulletin, a repeating multi-size
   radial-gradient starfield whose only job is to give
   `backdrop-filter: blur(14px) saturate(150%)` real detail to blur.
   Glass over a flat color is just a gray rectangle; glass over stars is
   glass.

## Motion vocabulary

| Name | Value | Used for |
| --- | --- | --- |
| `ease-out-veil` | `cubic-bezier(0.22, 1, 0.36, 1)` | scroll reveals — fast in, long settle |
| reveal | 700ms, translateY(18px)→0, 80ms batch stagger | section heads, panels, footer |
| pointer lerp | 0.07 / 60fps-normalized frame | the curtain warp chases your hand like weather |
| energy attack / release | 0.05 / 0.02 | quick to notice you, slow to forget you |
| idle drift | after 3.2s silence: lissajous `x .5+.3sin(.13t)`, `y .6+.18sin(.21t+1.7)` | touch / unattended sky |
| pointer warp | `exp(−4.5·d²) × 0.22 × energy` | capped — the sky bends, never tears |
| scroll temperature | `--lumen-temp` 0→1 full page; shader ×3 clamped | magenta dusk → green deep night |
| specular ease | `@property --lumen-gs`, 0.55 → 1, 450ms | glass highlights waking under the pointer |
| sparkline draw | 1900ms `cubic-bezier(0.33, 0, 0.2, 1)`, dashoffset 1→0 | the forecast drawing itself |
| canvas fade-in | 600ms ease | WebGL taking over from the CSS sky |
| fallback drift / sway | 26s / 19s alternate | the understudy breathing |

Timing rule: ambient periods (26s, 19s, and the shader's incommensurate
sine rates) share no common divisor — the sky never visibly loops.

## Space & shape

- One radius: 18px on glass (999px only on the pause chip). Everything
  else is a hairline — 1px solid or dotted `horizon`-derived lines.
- Containers: bulletin grid at 1160px, log and footer at 1020px, masthead
  at 1200px; the sky is always full-bleed.
- Section padding `clamp(80px, 12vh, 150px)`; the hero is exactly one
  viewport with content settled to the bottom-left.
- Panel grid: one column below 760px, two above; the advisory panel spans
  both — the poem gets the widest glass.
- Depth comes from light, not borders: inner top highlight, pointer
  specular, colored top hairline. Shadows are one long soft drop
  (`0 18px 44px`) and nothing else.

## Voice guide

**Five adjectives:** measured · nocturnal · courteous · precise ·
quietly-astonished.

**Three example lines:**

1. "TONIGHT — 78% chance the sky remembers it is a curtain." /
   "오늘 밤, 하늘은 자신이 커튼이었음을 기억할 확률 78%."
2. "Clear spells between passing cloud. Moon 12% and setting — politely
   dim." / "구름 사이가 갠다. 달은 12%, 지는 중 — 예의 바르게 어둡다."
3. "We read the solar wind ninety minutes before it arrives." /
   "태양풍이 도착하기 구십 분 전에, 우리가 먼저 읽는다."

**Three banned words:** *magical* (the bureau measures), *breathtaking*
(the bureau breathes evenly), *guarantee* (a forecast never does).

Grammar of the voice: numbers carry the sentence and the feeling rides in
the subordinate clause; protocol nouns stay uppercase (KP, KST, BULLETIN);
the Korean line is the same observation re-felt by the Seoul office —
transcreation, with its own rhythm and restraint.

## Do & Don't

**Do**

1. Route every color through a token; if you need a new shade, derive it
   from ice or horizon and name it.
2. Give every reading a poetic consequence and every poetic line a
   reading — the two registers must stay braided.
3. Let the pointer matter everywhere it plausibly could (curtains, glass)
   and nowhere it couldn't (text never chases the cursor).
4. Keep Korean serif, keep-all, and first-class — read it aloud before
   shipping.
5. Pause everything that moves by itself: offscreen, hidden tab, reduced
   motion, and the visitor's own button.

**Don't**

1. Don't add a third hue; the whole night is green, magenta, and the blue
   the dark already owns.
2. Don't put functional text on the bare curtain — scrim first, then type.
3. Don't animate layout; transform, opacity, and filter are the only
   things the wind is allowed to touch.
4. Don't let the glass go flat: no panel without its speckle backdrop, no
   blur without saturation.
5. Don't let the fiction wink — the bureau has never heard of websites;
   it publishes bulletins.
