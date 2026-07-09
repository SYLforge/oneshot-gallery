---
provenance: distilled-recipe
model: claude-fable-5
harness: Claude Code
date: 2026-07-10
attempts: 1
verification:
  status: unverified
---

The prompt below is a distilled recipe: the full brief this entry was built
from, compressed to what a strong model needs to regenerate a comparable
page in one shot.

```text
Build a complete, art-directed landing page for a fictional brand:
LUMEN NORD — a Nordic–Korean joint observatory that issues nightly aurora
forecasts the way weather agencies issue bulletins. The page IS tonight's
bulletin. Aesthetic: glass-futurism, THEME DARK, pure code — no images;
a WebGL shader carries all the visuals. Stack: Next.js App Router client
page ("use client"), React 19, TypeScript strict, vanilla CSS (classes
prefixed lumen-), vanilla JS animation, zero npm dependencies.

PALETTE (CSS custom properties on .lumen-root, every rendered color a
token): polar night #0e1330 (bg), aurora green #6ff2c3 (accent, focus,
13.1:1), magenta veil #c26bf2 (5.8:1 — accents/labels only, never long
body text), ice #dfe9ff (primary text, 14.9:1), horizon #27406b
(decorative only, 1.9:1). Secondary text = ice at 72% alpha (≈#a4adc5,
8.1:1). Custom ::selection (green bg, night text) scoped to the root.

TYPE: Hahmlet (variable serif, Korean+Latin — display, values, poetic
lines) + Sora (body/UI) via next/font/google with literal configs in
fonts.ts. Body stack is Sora-then-Hahmlet so Hangul falls through into
Hahmlet: Korean body text is serif ON PURPOSE. :lang(ko) gets
word-break: keep-all. Serif-display-over-sans keeps this out of generic
SaaS-glass territory.

VOICE: scientific-poetic bulletin — readings first, feeling smuggled in.
~15 lines of real bilingual copy; Korean is transcreation, never
translationese. Headline: "TONIGHT — 78% chance the sky remembers it is
a curtain. / 오늘 밤, 하늘은 자신이 커튼이었음을 기억할 확률 78%."
Fake-but-plausible readings: Kp 5.7, solar wind 612 km/s, Bz −8.4 nT,
window 22:40–01:10 KST, moon 12%.

STRUCTURE (single scroll, 5 beats):
1. Hero — full-viewport WebGL fragment shader behind the masthead:
   value-noise fbm (3 octaves), domain-warped into ridged aurora
   curtains (rid = pow(1 − |2·fbm − 1|, 2.6)), fine vertical ray
   striation, hashed twinkling stars, per-frame dither against banding.
   Color: green skirt low / magenta hem high (mix keyed on uv.y + flow).
   POINTER: warp the field with a capped gaussian push
   (exp(−4.5·d²) × 0.22 × energy); lerp pointer 0.07/frame, energy
   attack 0.05 / release 0.02; after 3.2s idle (or on touch) an
   autonomous lissajous drift takes over. Hand-roll the WebGL: one
   oversized triangle, inline shader strings, no libraries. FALLBACK:
   an always-painted layered CSS gradient aurora (radial blobs + conic
   sweep, blur 26px, 26s/19s alternate drifts) sits UNDER the canvas;
   the canvas fades in only after a first frame lands, so no-WebGL,
   failed compile, and webglcontextlost all resolve to the CSS sky —
   never a blank canvas. Masthead: serif LUMEN NORD + 오로라 예보국,
   kicker "NIGHTLY AURORA FORECAST · 야간 오로라 예보", bulletin no.,
   bottom scrim for AA. A glass chip "pause the sky · 하늘 멈춤" button
   (aria-pressed) freezes shader AND fallback — WCAG 2.2.2.
2. Tonight's bulletin — specular glass panels (backdrop-filter blur 14px
   saturate 150%, 1px ice border, inner top highlight) over a repeating
   radial-gradient star speckle that gives the blur something to chew.
   Each panel's highlight follows the pointer: pointermove writes
   --lumen-gx/--lumen-gy on the card, a radial-gradient ::spec layer
   reads them; strength eases via @property --lumen-gs (0.55 resting →
   1), so touch users get lit glass resting top-center, not dead glass.
   Panels: Kp 5.7 with an SVG arc gauge (pathLength=9, dasharray 5.7),
   visibility window with a 21:00–03:00 night-bar, and a wide poetic
   "what to look for" advisory.
3. Scroll temperature — a --lumen-temp variable 0→1 from page scroll
   (rAF-throttled, passive listener) drives: a JS-lerped magenta→green
   --lumen-blend consumed by section labels, glass top hairlines, and
   method-list borders; background color-mix toward #080b20; and the
   shader's u_temp uniform (same scroll ×3, so the sky reaches deep
   night a third of the way down). Dusk leans magenta, deep night leans
   green. Subtle but real.
4. Forecast log — the night hour-by-hour as a sparkline (Catmull-Rom
   through 7 Kp readings, inline SVG): pathLength={1} normalizes the
   dash, stroke-dashoffset 1→0 draws it on scroll-into-view (shared
   IntersectionObserver reveal), dots stagger in, Kp 5 storm-threshold
   line labeled bilingually. Then three lines on how the bureau listens
   ("we read the solar wind ninety minutes before it arrives").
5. Footer — sign-off ("03:40 KST — curtain closed. the archive is one
   night heavier."), both stations' coordinates (Nordfjell Ridge 69°17′N
   16°01′E; 서울 하늘기록소 37°34′N), duty mailto, "© 2026 LUMEN NORD —
   the sky files its report at dawn. 새벽에 하늘이 보고서를 제출한다."

HARD REQUIREMENTS:
- prefers-reduced-motion: shader draws exactly ONE composed frame
  (t = 38s, centered energy 0.55) and never starts its loop; CSS aurora
  static; reveals and sparkline simply visible; pause button hidden
  (nothing to pause). usePrefersReducedMotion = useSyncExternalStore
  over matchMedia.
- WebGL unsupported / compile fail / context lost → CSS aurora, never a
  blank hero.
- Touch: no hover-dependence; shader follows touch-move then drifts;
  specular rests centered.
- Keyboard: links + pause button reachable; :focus-visible = 2px aurora
  green ring + soft veil.
- AA contrast everywhere, including ice over the brightest curtain
  (hero scrim) and panel text over the afterglow (glass fill 58% alpha).
- Content visible without JS: reveal pre-states gated behind .lumen-js
  added on mount; canvas is decorative enhancement over the CSS sky.
- Animate transform/opacity/filter only. The shader owns one rAF,
  DPR-aware (capped at 2), paused when the hero leaves the viewport
  (IntersectionObserver), on visibilitychange, and by the pause button.
- On mount: window.parent?.postMessage({ type: "oneshot:ready",
  slug: "lumen-nord" }, "*").
- Composed at 1440px and at 360px (panel grid collapses to one column;
  title clamps).

FILES: page.tsx (default export, fonts + .lumen-root + .lumen-js),
components/ (Hero, AuroraCanvas, GlassPanel, BulletinPanels, ForecastLog,
Footer), hooks/ (usePrefersReducedMotion, useReveal,
useScrollTemperature), styles.css, fonts.ts. Relative imports only.
```

## Known deviations

- The brief asks that the scroll temperature drive "the shader uniform"
  from page progress; verbatim, the shader would barely shift before the
  hero scrolls away. The shipped u_temp takes the same scroll progress
  amplified ×3 (clamped), so the sky visibly cools while the hero is still
  on screen. CSS tokens use the unamplified 0→1.
- Under reduced motion the shader's still frame keeps the u_temp it was
  drawn with; scrolling does not re-render the canvas (the CSS-side color
  blend still tracks scroll, since it is input-driven, not autonomous).
- The specular highlight's resting state is not "off" — it idles at 55%
  strength, top-center. A literal reading of "highlight follows the
  pointer" would leave touch panels flat; the resting glow is a deliberate
  softening of the brief.
- `pointer-parallax` is not claimed in meta.techniques even though the
  aurora reacts to the pointer: there are no layered depth planes, and
  every listed technique must earn a breakdown section.
- The magenta veil #c26bf2 measures 5.8:1 on polar night — fine for its
  actual uses (section labels, blends, hems) but it is kept off long body
  text by rule rather than by measurement of every possible pairing.
