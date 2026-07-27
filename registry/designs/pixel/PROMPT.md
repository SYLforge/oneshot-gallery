---
provenance: distilled-recipe
model: builtin:zai-coding-plan/GLM-5.2
modelLabel: GLM-5.2
tool: zcode-cli
date: 2026-07-18
oneshot: false
followUps: 0
verification:
  status: rubric-passed
---

# PIXEL — reproducible prompt

## Distilled recipe

A retro indie-game studio landing page for a fictional 2003 arcade. The hero
is hand-drawn one CSS `box-shadow` per pixel; a CRT scanline and chromatic
aberration overlay sell the tube. Cheerful and saturated — the dopamine side
of the Y2K family, distinct from CHROME's liquid-metal beauty and from
GRADIENT-PLAZA's melancholic vaporwave.

### Techniques
1. `ascii-render` — pixel-art sprites via CSS box-shadow grids (one shadow
   per pixel), idle sprite-cycle animation.
2. `crt-scanline` — full-page scanline + chromatic-aberration overlay,
   subtle flicker (reduced-motion-off only, well under 3Hz).
3. `marquee` — scrolling chiptune-credits / high-score ticker.

### Art direction
Deep CRT black `#0a0a12`, saturated dopamine palette (bubblegum `#ff3d8a`,
electric cyan `#00e5ff`, chrome silver, acid yellow). `image-rendering:
pixelated`. DungGeunMo (Korean pixel face) + Press Start 2P + Noto Sans KR.
Korean-first bilingual.

## Known deviations

- Docs (PROMPT/breakdowns) were authored by the orchestrator after the build
  agent hit its session budget; the code is the agent's.
